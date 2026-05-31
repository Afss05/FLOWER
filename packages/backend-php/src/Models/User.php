<?php

declare(strict_types=1);

namespace App\Models;

use App\Exceptions\NotFoundException;

class User extends BaseModel
{
    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE id = ? AND tenant_id = ? LIMIT 1');
        $stmt->execute([$id, $this->tenantId()]);
        return $stmt->fetch() ?: null;
    }

    public function findByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE email = ? AND tenant_id = ? LIMIT 1');
        $stmt->execute([$email, $this->tenantId()]);
        return $stmt->fetch() ?: null;
    }

    public function create(array $data): array
    {
        $stmt = $this->db->prepare('
            INSERT INTO users (tenant_id, name, email, phone, password, role, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ');
        $stmt->execute([
            $this->tenantId(),
            $data['name'],
            $data['email'],
            $data['phone'] ?? '',
            password_hash($data['password'], PASSWORD_BCRYPT, ['cost' => 12]),
            $data['role'] ?? 'customer',
            'active',
            $this->now(),
            $this->now(),
        ]);

        return $this->findById((int) $this->db->lastInsertId());
    }

    public function update(int $id, array $data): array
    {
        $allowed = ['name', 'phone', 'email', 'status'];
        $fields  = [];
        $values  = [];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "{$field} = ?";
                $values[] = $data[$field];
            }
        }

        if (empty($fields)) {
            return $this->findById($id);
        }

        $fields[]  = 'updated_at = ?';
        $values[]  = $this->now();
        $values[]  = $id;
        $values[]  = $this->tenantId();

        $this->db->prepare('UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = ? AND tenant_id = ?')
                 ->execute($values);

        return $this->findById($id);
    }

    public function all(int $page = 1, int $limit = 15): array
    {
        $offset = ($page - 1) * $limit;
        $stmt   = $this->db->prepare('SELECT * FROM users WHERE tenant_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?');
        $stmt->execute([$this->tenantId(), $limit, $offset]);
        $rows = $stmt->fetchAll();

        $total = $this->db->prepare('SELECT COUNT(*) FROM users WHERE tenant_id = ?');
        $total->execute([$this->tenantId()]);

        return ['data' => $rows, 'total' => (int) $total->fetchColumn()];
    }

    /** Strip password from user data before returning to client */
    public static function publicData(array $user): array
    {
        unset($user['password']);
        return $user;
    }
}
