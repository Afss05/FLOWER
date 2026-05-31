<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Repositories\Contracts\CategoryRepositoryInterface;
use PDO;

final class CategoryRepository implements CategoryRepositoryInterface
{
    public function __construct(private readonly PDO $db) {}

    public function all(): array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM categories WHERE tenant_id = :tid AND is_active = 1
             ORDER BY sort_order, name'
        );
        $stmt->execute([':tid' => $this->tenantId()]);
        return $stmt->fetchAll();
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM categories WHERE id = :id AND tenant_id = :tid'
        );
        $stmt->execute([':id' => $id, ':tid' => $this->tenantId()]);
        $row = $stmt->fetch();
        return $row !== false ? $row : null;
    }

    private function tenantId(): string
    {
        return $_ENV['CLIENT_ID'] ?? 'default';
    }
}
