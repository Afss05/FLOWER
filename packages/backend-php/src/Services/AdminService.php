<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\NotFoundException;
use App\Repositories\Contracts\OrderRepositoryInterface;
use App\Repositories\Contracts\ProductRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use PDO;

final class AdminService
{
    public function __construct(
        private readonly PDO                        $db,
        private readonly OrderRepositoryInterface   $orders,
        private readonly ProductRepositoryInterface $products,
        private readonly UserRepositoryInterface    $users,
    ) {}

    // -----------------------------------------------------------------------
    // Dashboard
    // -----------------------------------------------------------------------

    /** @return array<string,mixed> */
    public function getDashboardStats(): array
    {
        $tid = $_ENV['CLIENT_ID'] ?? 'default';

        $stats = [];

        $stmt = $this->db->prepare(
            "SELECT COALESCE(SUM(total_amount), 0)
             FROM orders
             WHERE tenant_id = :tid AND status NOT IN ('cancelled')"
        );
        $stmt->execute([':tid' => $tid]);
        $stats['total_revenue'] = (float) $stmt->fetchColumn();

        $stmt = $this->db->prepare('SELECT COUNT(*) FROM orders WHERE tenant_id = :tid');
        $stmt->execute([':tid' => $tid]);
        $stats['total_orders'] = (int) $stmt->fetchColumn();

        $stats['total_customers'] = $this->users->count();
        $stats['total_products']  = $this->products->count();

        // Orders by status
        $stmt = $this->db->prepare(
            "SELECT status, COUNT(*) AS count FROM orders WHERE tenant_id = :tid GROUP BY status"
        );
        $stmt->execute([':tid' => $tid]);
        $stats['orders_by_status'] = $stmt->fetchAll();

        // Recent 5 orders
        $stmt = $this->db->prepare("
            SELECT o.id, o.order_number, o.status, o.total_amount, o.created_at,
                   u.name AS customer_name
            FROM   orders o
            LEFT JOIN users u ON u.id = o.user_id
            WHERE  o.tenant_id = :tid
            ORDER  BY o.created_at DESC
            LIMIT  5
        ");
        $stmt->execute([':tid' => $tid]);
        $stats['recent_orders'] = $stmt->fetchAll();

        // Top 5 products by order volume
        $stmt = $this->db->prepare("
            SELECT p.id, p.name,
                   SUM(oi.quantity) AS total_sold,
                   SUM(oi.quantity * oi.unit_price) AS revenue
            FROM   order_items oi
            JOIN   products p ON p.id = oi.product_id
            JOIN   orders o   ON o.id = oi.order_id
            WHERE  o.tenant_id = :tid AND o.status NOT IN ('cancelled')
            GROUP  BY oi.product_id
            ORDER  BY total_sold DESC
            LIMIT  5
        ");
        $stmt->execute([':tid' => $tid]);
        $stats['top_products'] = $stmt->fetchAll();

        return $stats;
    }

    // -----------------------------------------------------------------------
    // Orders
    // -----------------------------------------------------------------------

    public function listOrders(int $page, int $limit, array $filters): array
    {
        return $this->orders->allAdmin($page, $limit, $filters);
    }

    public function updateOrderStatus(int $orderId, string $status): array
    {
        if ($orderId <= 0) {
            throw new NotFoundException('Order');
        }

        $order = $this->orders->findById($orderId);

        if ($order === null) {
            throw new NotFoundException('Order');
        }

        $updated = $this->orders->updateStatus($orderId, $status);

        if ($updated === null) {
            throw new NotFoundException('Order');
        }

        return $updated;
    }

    // -----------------------------------------------------------------------
    // Customers
    // -----------------------------------------------------------------------

    public function listCustomers(int $page, int $limit): array
    {
        return $this->users->all($page, $limit);
    }
}
