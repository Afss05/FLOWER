<?php

declare(strict_types=1);

namespace App\Models;

use PDO;

abstract class BaseModel
{
    public function __construct(protected PDO $db) {}

    protected function tenantId(): string
    {
        return $_ENV['CLIENT_ID'] ?? 'default';
    }

    protected function now(): string
    {
        return date('Y-m-d H:i:s');
    }
}
