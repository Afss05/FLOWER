<?php

declare(strict_types=1);

/**
 * startup-check.php
 * Runs once before `php -S` starts. Logs app info + DB connection status.
 */

require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;
use Monolog\Formatter\LineFormatter;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// ── Logger (stdout only for startup) ────────────────────────────────────────
$fmt    = new LineFormatter("[%datetime%] %level_name%: %message%\n", 'Y-m-d H:i:s', false, true);
$stdout = new StreamHandler('php://stdout', Logger::DEBUG);
$stdout->setFormatter($fmt);
$logger = new Logger($_ENV['APP_NAME'] ?? 'FlowerShop');
$logger->pushHandler($stdout);

$name = $_ENV['APP_NAME'] ?? 'FlowerShop';
$env  = $_ENV['APP_ENV']  ?? 'production';
$url  = $_ENV['APP_URL']  ?? 'http://localhost:8080';

$logger->info("Starting {$name} API ({$env}) → {$url}/api");

// ── DB connection check ──────────────────────────────────────────────────────
$host   = $_ENV['DB_HOST'] ?? '127.0.0.1';
$port   = $_ENV['DB_PORT'] ?? '3306';
$dbName = $_ENV['DB_NAME'] ?? 'flowershop';
$user   = $_ENV['DB_USER'] ?? 'root';
$pass   = $_ENV['DB_PASS'] ?? '';

try {
    new PDO(
        "mysql:host={$host};port={$port};dbname={$dbName};charset=utf8mb4",
        $user,
        $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_TIMEOUT => 3]
    );
    $logger->info("✓ Database connected [{$host}:{$port}/{$dbName}]");
} catch (PDOException $e) {
    $logger->error("✗ Database connection failed: " . $e->getMessage());
}

$logger->info("Routes loaded — server ready → {$url}");
