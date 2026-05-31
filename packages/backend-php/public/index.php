<?php

declare(strict_types=1);

use App\Config\Database;
use DI\ContainerBuilder;
use Monolog\Logger;
use Slim\Factory\AppFactory;
use Dotenv\Dotenv;

require __DIR__ . '/../vendor/autoload.php';

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Build DI container
$containerBuilder = new ContainerBuilder();
$containerBuilder->addDefinitions(__DIR__ . '/../src/Config/container.php');
$container = $containerBuilder->build();

// ── Startup logging ──────────────────────────────────────────────────────────
/** @var Logger $logger */
$logger = $container->get(Logger::class);
$env    = $_ENV['APP_ENV'] ?? 'production';
$name   = $_ENV['APP_NAME'] ?? 'FlowerShop';
$url    = $_ENV['APP_URL'] ?? 'http://localhost:8080';

$logger->info("Starting {$name} API ({$env}) → {$url}/api");

// Eager DB connection check on startup
try {
    $container->get(PDO::class);  // triggers Database::getConnection() which logs success/failure
} catch (\Throwable $e) {
    $logger->error('Startup DB check failed: ' . $e->getMessage());
    // Continue — individual requests will fail with a proper 500 response
}

// Create Slim app
AppFactory::setContainer($container);
$app = AppFactory::create();

// Add routing middleware
$app->addRoutingMiddleware();

// Add body parsing middleware
$app->addBodyParsingMiddleware();

// Register middleware
(require __DIR__ . '/../src/App/middleware.php')($app);

// Register routes
(require __DIR__ . '/../src/App/routes.php')($app);

// Add error middleware (must be last)
$displayErrors = $env === 'development';
$errorMiddleware = $app->addErrorMiddleware($displayErrors, true, true);
$errorMiddleware->setDefaultErrorHandler(new \App\Handlers\ErrorHandler($app->getCallableResolver(), $app->getResponseFactory()));

$logger->info('Routes loaded — server ready');

$app->run();
