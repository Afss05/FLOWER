<?php

declare(strict_types=1);

use App\Config\Database;

// Controllers
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
use App\Services\AdminService;
use App\Services\AuthService;
use App\Services\BlogService;
use App\Services\CartService;
use App\Services\OrderService;
use App\Services\ProductService;
use App\Services\UserService;

use Psr\Container\ContainerInterface;

return [
    // ------------------------------------------------------------------
    // Database
    // ------------------------------------------------------------------
    Database::class => static fn() => new Database(),
    PDO::class      => static fn(ContainerInterface $c) => $c->get(Database::class)->getConnection(),

    // ------------------------------------------------------------------
    // Repository bindings  (interface → concrete)
    // ------------------------------------------------------------------
    UserRepositoryInterface::class     => static fn(ContainerInterface $c) => new UserRepository($c->get(PDO::class)),
    ProductRepositoryInterface::class  => static fn(ContainerInterface $c) => new ProductRepository($c->get(PDO::class)),
    CartRepositoryInterface::class     => static fn(ContainerInterface $c) => new CartRepository($c->get(PDO::class)),
    OrderRepositoryInterface::class    => static fn(ContainerInterface $c) => new OrderRepository($c->get(PDO::class)),
    BlogRepositoryInterface::class     => static fn(ContainerInterface $c) => new BlogRepository($c->get(PDO::class)),
    CategoryRepositoryInterface::class => static fn(ContainerInterface $c) => new CategoryRepository($c->get(PDO::class)),

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
        $c->get(PDO::class),
        $c->get(OrderRepositoryInterface::class),
        $c->get(ProductRepositoryInterface::class),
        $c->get(UserRepositoryInterface::class),
    ),

    // ------------------------------------------------------------------
    // Controllers
    // ------------------------------------------------------------------
    AuthController::class    => static fn(ContainerInterface $c) => new AuthController($c->get(AuthService::class)),
    ProductController::class => static fn(ContainerInterface $c) => new ProductController(
        $c->get(ProductService::class),
        $c->get(CategoryRepositoryInterface::class),
    ),
    CartController::class    => static fn(ContainerInterface $c) => new CartController($c->get(CartService::class)),
    OrderController::class   => static fn(ContainerInterface $c) => new OrderController($c->get(OrderService::class)),
    BlogController::class    => static fn(ContainerInterface $c) => new BlogController($c->get(BlogService::class)),
    UserController::class    => static fn(ContainerInterface $c) => new UserController($c->get(UserService::class)),
    AdminController::class   => static fn(ContainerInterface $c) => new AdminController($c->get(AdminService::class)),
    SubscriptionController::class => static fn(ContainerInterface $c) => new SubscriptionController($c->get(PDO::class)),

    // ------------------------------------------------------------------
    // Middleware
    // ------------------------------------------------------------------
    SecurityHeadersMiddleware::class => static fn() => new SecurityHeadersMiddleware(),
    RateLimitMiddleware::class       => static fn() => new RateLimitMiddleware(
        maxRequests:   (int) ($_ENV['RATE_LIMIT_MAX'] ?? 120),
        windowSeconds: (int) ($_ENV['RATE_LIMIT_WINDOW'] ?? 60),
    ),
];

