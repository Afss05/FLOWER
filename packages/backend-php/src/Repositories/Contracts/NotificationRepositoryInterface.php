<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

interface NotificationRepositoryInterface
{
    /** Create a new notification record. */
    public function create(
        string $tenantId,
        int    $userId,
        string $type,
        string $title,
        string $body,
        ?array $data = null
    ): array;

    /** Unread notifications for a user (newest first, limit 50). */
    public function unread(string $tenantId, int $userId): array;

    /** All notifications for a user (paginated). */
    public function all(string $tenantId, int $userId, int $page, int $limit): array;

    /** Total count for pagination. */
    public function count(string $tenantId, int $userId): int;

    /** Unread count badge. */
    public function unreadCount(string $tenantId, int $userId): int;

    /** Notifications created after a given ISO-8601 timestamp (for polling). */
    public function since(string $tenantId, int $userId, string $since): array;

    /** Mark a single notification as read. Returns false if not found. */
    public function markRead(int $id, int $userId): bool;

    /** Mark all unread notifications as read for a user. */
    public function markAllRead(string $tenantId, int $userId): void;

    /** Delete a notification. Returns false if not found/not owned. */
    public function delete(int $id, int $userId): bool;
}
