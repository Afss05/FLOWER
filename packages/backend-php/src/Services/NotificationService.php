<?php

declare(strict_types=1);

namespace App\Services;

use App\Repositories\Contracts\NotificationRepositoryInterface;

/**
 * NotificationService — business logic layer for notifications.
 *
 * Dispatch API (called by other services):
 *   NotificationService::dispatch($repo, $tenantId, $userId, $type, $title, $body, $data)
 *
 * Notification types:
 *   order_placed       — customer places order
 *   order_confirmed    — admin confirms order
 *   order_packing      — order is being packed
 *   order_shipped      — order out for delivery
 *   order_delivered    — order delivered
 *   order_cancelled    — order cancelled
 *   payment_success    — payment verified
 *   payment_failed     — payment failed
 *   new_order          — admin: new order arrived
 *   low_stock          — admin: product stock below threshold
 *   promo              — promotional notification
 */
final class NotificationService
{
    // Maximum long-poll wait (seconds). Keep below PHP max_execution_time.
    private const MAX_POLL_WAIT = 25;

    public function __construct(
        private readonly NotificationRepositoryInterface $repo
    ) {}

    // ──────────────────────────────────────────────────────────────────────
    // Static dispatcher — called from OrderService, PaymentService, etc.
    // ──────────────────────────────────────────────────────────────────────

    /**
     * Dispatch a notification. Other services should call this static helper
     * so they don't need to depend on NotificationService via DI.
     */
    public static function dispatch(
        NotificationRepositoryInterface $repo,
        string $tenantId,
        int    $userId,
        string $type,
        string $title,
        string $body,
        ?array $data = null
    ): void {
        try {
            $repo->create($tenantId, $userId, $type, $title, $body, $data);
        } catch (\Throwable) {
            // Never let a notification failure break the main flow
        }
    }

    // ──────────────────────────────────────────────────────────────────────
    // Polling
    // ──────────────────────────────────────────────────────────────────────

    /**
     * Long-poll for new notifications since a given ISO-8601 timestamp.
     *
     * Blocks for up to $waitSeconds, checking every second.
     * Returns immediately if new notifications exist.
     * Returns empty array if nothing arrives within the timeout.
     */
    public function poll(
        string $tenantId,
        int    $userId,
        string $since,
        int    $waitSeconds = 20
    ): array {
        $wait    = min($waitSeconds, self::MAX_POLL_WAIT);
        $since   = $this->normaliseSince($since);
        $deadline = time() + $wait;

        do {
            $rows = $this->repo->since($tenantId, $userId, $since);
            if (!empty($rows)) {
                return $rows;
            }
            if (time() >= $deadline) {
                break;
            }
            sleep(1);
        } while (true);

        return [];
    }

    // ──────────────────────────────────────────────────────────────────────
    // Management
    // ──────────────────────────────────────────────────────────────────────

    public function list(string $tenantId, int $userId, int $page, int $limit): array
    {
        $page  = max(1, $page);
        $limit = min(50, max(1, $limit));
        $total = $this->repo->count($tenantId, $userId);
        $items = $this->repo->all($tenantId, $userId, $page, $limit);

        return [
            'items'       => $items,
            'unreadCount' => $this->repo->unreadCount($tenantId, $userId),
            'total'       => $total,
            'page'        => $page,
            'limit'       => $limit,
            'pages'       => (int) ceil($total / $limit),
        ];
    }

    public function unreadCount(string $tenantId, int $userId): int
    {
        return $this->repo->unreadCount($tenantId, $userId);
    }

    public function markRead(int $id, int $userId): bool
    {
        return $this->repo->markRead($id, $userId);
    }

    public function markAllRead(string $tenantId, int $userId): void
    {
        $this->repo->markAllRead($tenantId, $userId);
    }

    public function delete(int $id, int $userId): bool
    {
        return $this->repo->delete($id, $userId);
    }

    // ──────────────────────────────────────────────────────────────────────
    // Typed factory methods (convenience for other services)
    // ──────────────────────────────────────────────────────────────────────

    public function orderPlaced(
        NotificationRepositoryInterface $repo,
        string $tenantId,
        int    $userId,
        string $orderNumber,
        float  $amount
    ): void {
        self::dispatch(
            $repo, $tenantId, $userId,
            'order_placed',
            'Order Placed Successfully',
            "Your order #{$orderNumber} has been placed. Total: ₹{$amount}",
            ['orderNumber' => $orderNumber, 'amount' => $amount]
        );
    }

    public function orderStatusChanged(
        NotificationRepositoryInterface $repo,
        string $tenantId,
        int    $userId,
        string $orderNumber,
        string $status
    ): void {
        $messages = [
            'confirmed'        => ['Order Confirmed',          "Your order #{$orderNumber} has been confirmed and is being prepared."],
            'packing'          => ['Order Being Packed',       "Your order #{$orderNumber} is being carefully packed."],
            'out_for_delivery' => ['Order Out for Delivery',   "Your order #{$orderNumber} is on the way! 🚚"],
            'delivered'        => ['Order Delivered',          "Your order #{$orderNumber} has been delivered. Enjoy your flowers! 🌸"],
            'cancelled'        => ['Order Cancelled',          "Your order #{$orderNumber} has been cancelled."],
        ];

        [$title, $body] = $messages[$status] ?? ["Order #{$orderNumber} Updated", "Your order status changed to {$status}."];

        self::dispatch(
            $repo, $tenantId, $userId,
            "order_{$status}",
            $title, $body,
            ['orderNumber' => $orderNumber, 'status' => $status]
        );
    }

    public function paymentSuccess(
        NotificationRepositoryInterface $repo,
        string $tenantId,
        int    $userId,
        string $orderNumber,
        float  $amount
    ): void {
        self::dispatch(
            $repo, $tenantId, $userId,
            'payment_success',
            'Payment Successful',
            "Payment of ₹{$amount} for order #{$orderNumber} was successful.",
            ['orderNumber' => $orderNumber, 'amount' => $amount]
        );
    }

    public function newOrderAlert(
        NotificationRepositoryInterface $repo,
        string $tenantId,
        int    $adminUserId,
        string $orderNumber,
        float  $amount
    ): void {
        self::dispatch(
            $repo, $tenantId, $adminUserId,
            'new_order',
            'New Order Received',
            "New order #{$orderNumber} received for ₹{$amount}. Review and confirm.",
            ['orderNumber' => $orderNumber, 'amount' => $amount]
        );
    }

    public function lowStockAlert(
        NotificationRepositoryInterface $repo,
        string $tenantId,
        int    $adminUserId,
        string $productName,
        int    $stockLeft
    ): void {
        self::dispatch(
            $repo, $tenantId, $adminUserId,
            'low_stock',
            'Low Stock Alert',
            "'{$productName}' has only {$stockLeft} units left. Please restock.",
            ['product' => $productName, 'stockLeft' => $stockLeft]
        );
    }

    // ──────────────────────────────────────────────────────────────────────
    // Internal helpers
    // ──────────────────────────────────────────────────────────────────────

    private function normaliseSince(string $since): string
    {
        if ($since === '') {
            // Default: last 24 hours
            return date('Y-m-d H:i:s', time() - 86400);
        }
        $ts = strtotime($since);
        if ($ts === false) {
            return date('Y-m-d H:i:s', time() - 86400);
        }
        return date('Y-m-d H:i:s', $ts);
    }
}
