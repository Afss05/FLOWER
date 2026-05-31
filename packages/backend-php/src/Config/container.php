<?php

declare(strict_types=1);

use App\Config\Database;
use App\Middleware\RequestLoggerMiddleware;

// Controllers
use App\Controllers\NotificationController;
use App\Controllers\AdminController;
use App\Controllers\AuthController;
use App\Controllers\BlogController;
use App\Controllers\CartController;
use App\Controllers\OrderController;
use App\Controllers\ProductController;
use App\Controllers\SubscriptionController;
use App\Controllers\UserController;

// Middleware
use App\Middleware\RateLimitMiddleware;
use App\Middleware\SecurityHeadersMiddleware;

// Repositories (interfaces → concrete)
use App\Repositories\NotificationRepository;
use App\Repositories\Contracts\NotificationRepositoryInterface;
use App\Repositories\BlogRepository;
use App\Repositories\CartRepository;
use App\Repositories\CategoryRepository;
use App\Repositories\Contracts\BlogRepositoryInterface;
use App\Repositories\Contracts\CartRepositoryInterface;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use App\Repositories\Contracts\OrderRepositoryInterface;
use App\Repositories\Contracts\ProductRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\OrderRepository;
use App\Repositories\ProductRepository;
use App\Repositories\UserRepository;

// Services
use App\Services\NotificationService;
use App\Services\AdminService;
use App\Services\AuthService;
use App\Services\BlogService;
use App\Services\CartService;
use App\Services\OrderService;
use App\Services\ProductService;
use App\Services\UserService;

use Monolog\Formatter\JsonFormatter;
use Monolog\Handler\RotatingFileHandler;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;
use Psr\Container\ContainerInterface;

return [
    // ------------------------------------------------------------------
    // Logger (Monolog) — stdout + rotating daily log file
    // ------------------------------------------------------------------
    Logger::class => static function (): Logger {
        $appName  = $_ENV['APP_NAME'] ?? 'FlowerShop';
        $env      = $_ENV['APP_ENV']  ?? 'production';
        $logLevel = $env === 'development' ? Logger::DEBUG : Logger::INFO;
        $logDir   = __DIR__ . '/../../storage/logs';

        $jsonFormatter = new JsonFormatter();

        // Stdout — plain line format for readability in terminal
        $stdoutFmt = new \Monolog\Formatter\LineFormatter(
            "[%datetime%] %level_name%: %message% %context%\n",
            'Y-m-d H:i:s', false, true
        );
        $stdout = new StreamHandler('php://stdout', $logLevel);
        $stdout->setFormatter($stdoutFmt);

        // File — JSON format for structured log parsing
        $file = new RotatingFileHandler($logDir . '/app.log', 14, $logLevel);
        $file->setFormatter($jsonFormatter);

        $logger = new Logger($appName);
        $logger->pushHandler($stdout);
        $logger->pushHandler($file);

        return $logger;
    },

    // ------------------------------------------------------------------
    // Database
    // ------------------------------------------------------------------
    Database::class => static fn(ContainerInterface $c) => new Database($c->get(Logger::class)),
    PDO::class      => static fn(ContainerInterface $c) => $c->get(Database::class)->getConnection(),

    // ------------------------------------------------------------------
    // Repository bindings  (interface → concrete)
    // ------------------------------------------------------------------
    UserRepositoryInterface::class         => static fn(ContainerInterface $c) => new UserRepository($c->get(PDO::class)),
    ProductRepositoryInterface::class      => static fn(ContainerInterface $c) => new ProductRepository($c->get(PDO::class)),
    CartRepositoryInterface::class         => static fn(ContainerInterface $c) => new CartRepository($c->get(PDO::class)),
    OrderRepositoryInterface::class        => static fn(ContainerInterface $c) => new OrderRepository($c->get(PDO::class)),
    BlogRepositoryInterface::class         => static fn(ContainerInterface $c) => new BlogRepository($c->get(PDO::class)),
    CategoryRepositoryInterface::class     => static fn(ContainerInterface $c) => new CategoryRepository($c->get(PDO::class)),
    NotificationRepositoryInterface::class => static fn(ContainerInterface $c) => new NotificationRepository($c->get(PDO::class)),

    // ------------------------------------------------------------------
    // Services
    // ------------------------------------------------------------------
    AuthService::class    => static fn(ContainerInterface $c) => new AuthService($c->get(UserRepositoryInterface::class)),
    ProductService::class => static fn(ContainerInterface $c) => new ProductService($c->get(ProductRepositoryInterface::class)),
    CartService::class    => static fn(ContainerInterface $c) => new CartService(
        $c->get(CartRepositoryInterface::class),
        $c->get(ProductRepositoryInterface::class),
    ),
    OrderService::class   => static fn(ContainerInterface $c) => new OrderService(
        $c->get(OrderRepositoryInterface::class),
        $c->get(CartRepositoryInterface::class),
    ),
    BlogService::class    => static fn(ContainerInterface $c) => new BlogService($c->get(BlogRepositoryInterface::class)),
    UserService::class    => static fn(ContainerInterface $c) => new UserService($c->get(UserRepositoryInterface::class)),
    AdminService::class   => static fn(ContainerInterface $c) => new AdminService(
        $c->get(UserRepositoryInterface::class),
        $c->get(ProductRepositoryInterface::class),
        $c->get(OrderRepositoryInterface::class),
    ),
    NotificationService::class => static fn(ContainerInterface $c) => new NotificationService(
        $c->get(NotificationRepositoryInterface::class),
    ),

    // ------------------------------------------------------------------
    // Controllers
    // ------------------------------------------------------------------
    AuthController::class         => static fn(ContainerInterface $c) => new AuthController($c->get(AuthService::class)),
    ProductController::class      => static fn(ContainerInterface $c) => new ProductController($c->get(ProductService::class), $c->get(CategoryRepositoryInterface::class)),
    CartController::class         => static fn(ContainerInterface $c) => new CartController($c->get(CartService::class)),
    OrderController::class        => static fn(ContainerInterface $c) => new OrderController($c->get(OrderService::class)),
    BlogController::class         => static fn(ContainerInterface $c) => new BlogController($c->get(BlogService::class)),
    UserController::class         => static fn(ContainerInterface $c) => new UserController($c->get(UserService::class)),
    AdminController::class        => static fn(ContainerInterface $c) => new AdminController($c->get(AdminService::class)),
    SubscriptionController::class => static fn(ContainerInterface $c) => new SubscriptionController(),
    NotificationController::class => static fn(ContainerInterface $c) => new NotificationController($c->get(NotificationService::class)),

    // ------------------------------------------------------------------
    // Middleware
    // ------------------------------------------------------------------
    RequestLoggerMiddleware::class   => static fn(ContainerInterface $c) => new RequestLoggerMiddleware($c->get(Logger::class)),
    SecurityHeadersMiddleware::class => static fn() => new SecurityHeadersMiddleware(),
    RateLimitMiddleware::class       => static fn() => new RateLimitMiddleware(
        maxRequests:   (int) ($_ENV['RATE_LIMIT_MAX'] ?? 120),
        windowSeconds: (int) ($_ENV['RATE_LIMIT_WINDOW'] ?? 60),
    ),
];

