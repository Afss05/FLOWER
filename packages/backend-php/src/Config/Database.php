<?php

declare(strict_types=1);

namespace App\Config;

use Monolog\Logger;
use PDO;
use PDOException;
use RuntimeException;

class Database
{
    private ?PDO $connection = null;

    public function __construct(private readonly ?Logger $logger = null) {}

    public function getConnection(): PDO
    {
        if ($this->connection !== null) {
            return $this->connection;
        }

        $host   = $_ENV['DB_HOST'] ?? '127.0.0.1';
        $port   = $_ENV['DB_PORT'] ?? '3306';
        $dbName = $_ENV['DB_NAME'] ?? 'flowershop';
        $user   = $_ENV['DB_USER'] ?? 'root';
        $pass   = $_ENV['DB_PASS'] ?? '';

        $dsn = "mysql:host={$host};port={$port};dbname={$dbName};charset=utf8mb4";

        try {
            $this->connection = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::ATTR_PERSISTENT         => true,   // reuse connection across requests
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
            ]);

            $this->logger?->info("✓ Database connected [{$host}:{$port}/{$dbName}]");
        } catch (PDOException $e) {
            $this->logger?->error('✗ Database connection failed: ' . $e->getMessage());
            throw new RuntimeException('Database connection failed: ' . $e->getMessage());
        }

        return $this->connection;
    }
}
