<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Repositories\Contracts\UserRepositoryInterface;
use PDO;

final class UserRepository implements UserRepositoryInterface
{
    public function __construct(private readonly PDO $db) {}

    // -----------------------------------------------------------------------
    // Read
    // -----------------------------------------------------------------------

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM users WHERE id = :id AND tenant_id = :tid LIMIT 1'
        );
        $stmt->execute([':id' => $id, ':tid' => $this->tenantId()]);
        $row = $stmt->fetch();
        return $row !== false ? $row : null;
    }

    public function findByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM users WHERE email = :email AND tenant_id = :tid LIMIT 1'
        );
        $stmt->execute([':email' => mb_strtolower(trim($email)), ':tid' => $this->tenantId()]);
        $row = $stmt->fetch();
        return $row !== false ? $row : null;
    }

    public function all(int $page = 1, int $limit = 15): array
    {
        $page   = max(1, $page);
        $limit  = min(100, max(1, $limit));
        $offset = ($page - 1) * $limit;

        $stmt = $this->db->prepare(
            'SELECT id, tenant_id, name, email, phone, role, status, created_at, updated_at
             FROM users
             WHERE tenant_id = :tid
             ORDER BY created_at DESC
             LIMIT :lim OFFSET :off'
        );
        $stmt->bindValue(':tid', $this->tenantId());
        $stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    public function count(): int
    {
        $stmt = $this->db->prepare(
            "SELECT COUNT(*) FROM users WHERE tenant_id = :tid AND role = 'customer'"
        );
        $stmt->execute([':tid' => $this->tenantId()]);
        return (int) $stmt->fetchColumn();
    }

    // -----------------------------------------------------------------------
    // Write
    // -----------------------------------------------------------------------

    public function create(array $data): array
    {
        $stmt = $this->db->prepare(
            'INSERT INTO users
               (tenant_id, name, email, phone, password, role, status, created_at, updated_at)
             VALUES
               (:tid, :name, :email, :phone, :password, :role, :status, :now, :now2)'
        );
        $stmt->execute([
            ':tid'      => $this->tenantId(),
            ':name'     => mb_substr(trim($data['name']), 0, 100),
            ':email'    => mb_strtolower(trim($data['email'])),
            ':phone'    => mb_substr(trim($data['phone'] ?? ''), 0, 20),
            ':password' => password_hash($data['password'], PASSWORD_BCRYPT, ['cost' => 12]),
            ':role'     => in_array($data['role'] ?? '', ['admin', 'customer'], true)
                            ? $data['role']
                            : 'customer',
            ':status'   => 'active',
            ':now'      => $this->now(),
            ':now2'     => $this->now(),
        ]);

        $id = (int) $this->db->lastInsertId();
        return $this->findById($id) ?? throw new \RuntimeException('User not found after insert');
    }

    public function update(int $id, array $data): ?array
    {
        $allowed = ['name', 'phone', 'email', 'status'];
        $fields  = [];
        $values  = [];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "{$field} = ?";
                $values[] = $field === 'email'
                    ? mb_strtolower(trim((string) $data[$field]))
                    : mb_substr(trim((string) $data[$field]), 0, 100);
            }
        }

        if (empty($fields)) {
            return $this->findById($id);
        }

        $fields[] = 'updated_at = ?';
        $values[] = $this->now();
        $values[] = $id;
        $values[] = $this->tenantId();

        $this->db->prepare(
            'UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = ? AND tenant_id = ?'
        )->execute($values);

        return $this->findById($id);
    }

    // -----------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------

    /** Remove sensitive fields before returning to caller */
    public static function publicData(array $user): array
    {
        unset($user['password']);
        return $user;
    }

    private function tenantId(): string
    {
        return $_ENV['CLIENT_ID'] ?? 'default';
    }

    private function now(): string
    {
        return date('Y-m-d H:i:s');
    }
}
