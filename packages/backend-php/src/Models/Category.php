<?php

declare(strict_types=1);

namespace App\Models;

class Category extends BaseModel
{
    public function all(): array
    {
        $stmt = $this->db->prepare('SELECT * FROM categories WHERE tenant_id = ? AND is_active = 1 ORDER BY sort_order, name');
        $stmt->execute([$this->tenantId()]);
        return $stmt->fetchAll();
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM categories WHERE id = ? AND tenant_id = ?');
        $stmt->execute([$id, $this->tenantId()]);
        return $stmt->fetch() ?: null;
    }
}
