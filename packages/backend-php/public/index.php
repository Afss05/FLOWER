<?php

declare(strict_types=1);

use DI\ContainerBuilder;
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
$displayErrors = $_ENV['APP_ENV'] === 'development';
$errorMiddleware = $app->addErrorMiddleware($displayErrors, true, true);
$errorMiddleware->setDefaultErrorHandler(new \App\Handlers\ErrorHandler($app->getCallableResolver(), $app->getResponseFactory()));

$app->run();
