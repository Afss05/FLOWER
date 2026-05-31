<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Repositories\Contracts\NotificationRepositoryInterface;
use PDO;

final class NotificationRepository implements NotificationRepositoryInterface
{
    public function __construct(private readonly PDO $pdo) {}

    // ──────────────────────────────────────────────────────────────────────
    // Write
    // ──────────────────────────────────────────────────────────────────────

    public function create(
        string $tenantId,
        int    $userId,
        string $type,
        string $title,
        string $body,
        ?array $data = null
    ): array {
        $stmt = $this->pdo->prepare(
            'INSERT INTO notifications (tenant_id, user_id, type, title, body, data, created_at)
             VALUES (:tenantId, :userId, :type, :title, :body, :data, NOW())'
        );
        $stmt->execute([
            ':tenantId' => $tenantId,
            ':userId'   => $userId,
            ':type'     => $type,
            ':title'    => mb_substr($title, 0, 255),
            ':body'     => $body,
            ':data'     => $data !== null ? json_encode($data, JSON_UNESCAPED_UNICODE) : null,
        ]);

        $id = (int) $this->pdo->lastInsertId();
        return $this->findById($id);
    }

    public function markRead(int $id, int $userId): bool
    {
        $stmt = $this->pdo->prepare(
            'UPDATE notifications SET read_at = NOW()
             WHERE id = :id AND user_id = :userId AND read_at IS NULL'
        );
        $stmt->execute([':id' => $id, ':userId' => $userId]);
        return $stmt->rowCount() > 0;
    }

    public function markAllRead(string $tenantId, int $userId): void
    {
        $stmt = $this->pdo->prepare(
            'UPDATE notifications SET read_at = NOW()
             WHERE tenant_id = :tenantId AND user_id = :userId AND read_at IS NULL'
        );
        $stmt->execute([':tenantId' => $tenantId, ':userId' => $userId]);
    }

    public function delete(int $id, int $userId): bool
    {
        $stmt = $this->pdo->prepare(
            'DELETE FROM notifications WHERE id = :id AND user_id = :userId'
        );
        $stmt->execute([':id' => $id, ':userId' => $userId]);
        return $stmt->rowCount() > 0;
    }

    // ──────────────────────────────────────────────────────────────────────
    // Read
    // ──────────────────────────────────────────────────────────────────────

    public function unread(string $tenantId, int $userId): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT * FROM notifications
             WHERE tenant_id = :tenantId AND user_id = :userId AND read_at IS NULL
             ORDER BY created_at DESC
             LIMIT 50'
        );
        $stmt->execute([':tenantId' => $tenantId, ':userId' => $userId]);
        return array_map($this->hydrate(...), $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function all(string $tenantId, int $userId, int $page, int $limit): array
    {
        $offset = ($page - 1) * $limit;
        $stmt   = $this->pdo->prepare(
            'SELECT * FROM notifications
             WHERE tenant_id = :tenantId AND user_id = :userId
             ORDER BY created_at DESC
             LIMIT :limit OFFSET :offset'
        );
        $stmt->bindValue(':tenantId', $tenantId);
        $stmt->bindValue(':userId',   $userId,  PDO::PARAM_INT);
        $stmt->bindValue(':limit',    $limit,   PDO::PARAM_INT);
        $stmt->bindValue(':offset',   $offset,  PDO::PARAM_INT);
        $stmt->execute();
        return array_map($this->hydrate(...), $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function count(string $tenantId, int $userId): int
    {
        $stmt = $this->pdo->prepare(
            'SELECT COUNT(*) FROM notifications
             WHERE tenant_id = :tenantId AND user_id = :userId'
        );
        $stmt->execute([':tenantId' => $tenantId, ':userId' => $userId]);
        return (int) $stmt->fetchColumn();
    }

    public function unreadCount(string $tenantId, int $userId): int
    {
        $stmt = $this->pdo->prepare(
            'SELECT COUNT(*) FROM notifications
             WHERE tenant_id = :tenantId AND user_id = :userId AND read_at IS NULL'
        );
        $stmt->execute([':tenantId' => $tenantId, ':userId' => $userId]);
        return (int) $stmt->fetchColumn();
    }

    public function since(string $tenantId, int $userId, string $since): array
    {
        // Validate the timestamp to prevent injection via format
        $parsed = date('Y-m-d H:i:s', strtotime($since));
        if ($parsed === false || $parsed === '1970-01-01 00:00:00') {
            return [];
        }

        $stmt = $this->pdo->prepare(
            'SELECT * FROM notifications
             WHERE tenant_id = :tenantId AND user_id = :userId AND created_at > :since
             ORDER BY created_at ASC
             LIMIT 100'
        );
        $stmt->execute([':tenantId' => $tenantId, ':userId' => $userId, ':since' => $parsed]);
        return array_map($this->hydrate(...), $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    // ──────────────────────────────────────────────────────────────────────
    // Internal helpers
    // ──────────────────────────────────────────────────────────────────────

    private function findById(int $id): array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM notifications WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $this->hydrate($stmt->fetch(PDO::FETCH_ASSOC));
    }

    private function hydrate(array $row): array
    {
        return [
            'id'         => (int) $row['id'],
            'userId'     => (int) $row['user_id'],
            'type'       => $row['type'],
            'title'      => $row['title'],
            'body'       => $row['body'],
            'data'       => $row['data'] !== null ? json_decode($row['data'], true) : null,
            'readAt'     => $row['read_at'],
            'createdAt'  => $row['created_at'],
        ];
    }
}
