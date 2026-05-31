<?php

declare(strict_types=1);

require __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

$host   = $_ENV['DB_HOST']   ?? '127.0.0.1';
$port   = $_ENV['DB_PORT']   ?? '3306';
$dbName = $_ENV['DB_NAME']   ?? 'flowershop';
$user   = $_ENV['DB_USER']   ?? 'root';
$pass   = $_ENV['DB_PASS']   ?? '';

try {
    $pdo = new PDO("mysql:host={$host};port={$port};charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);

    $sql = file_get_contents(__DIR__ . '/migrations/001_create_tables.sql');
    $pdo->exec($sql);

    echo "✅ Migration completed successfully.\n";
} catch (Exception $e) {
    echo "❌ Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
