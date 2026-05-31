<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Repositories\Contracts\OrderRepositoryInterface;
use PDO;

final class OrderRepository implements OrderRepositoryInterface
{
    private const ALLOWED_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    public function __construct(private readonly PDO $db) {}

    // -----------------------------------------------------------------------
    // Read
    // -----------------------------------------------------------------------

    public function all(int $userId, int $page = 1, int $limit = 15): array
    {
        $page   = max(1, $page);
        $limit  = min(50, max(1, $limit));
        $offset = ($page - 1) * $limit;

        $stmt = $this->db->prepare("
            SELECT o.*, COUNT(oi.id) AS item_count
            FROM   orders o
            LEFT JOIN order_items oi ON oi.order_id = o.id
            WHERE  o.user_id = :uid AND o.tenant_id = :tid
            GROUP  BY o.id
            ORDER  BY o.created_at DESC
            LIMIT  :lim OFFSET :off
        ");
        $stmt->bindValue(':uid', $userId, PDO::PARAM_INT);
        $stmt->bindValue(':tid', $this->tenantId());
        $stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $cStmt = $this->db->prepare(
            'SELECT COUNT(*) FROM orders WHERE user_id = :uid AND tenant_id = :tid'
        );
        $cStmt->execute([':uid' => $userId, ':tid' => $this->tenantId()]);

        return ['data' => $stmt->fetchAll(), 'total' => (int) $cStmt->fetchColumn()];
    }

    public function allAdmin(int $page = 1, int $limit = 15, array $filters = []): array
    {
        $page   = max(1, $page);
        $limit  = min(100, max(1, $limit));
        $offset = ($page - 1) * $limit;

        $where  = ['o.tenant_id = :tid'];
        $params = [':tid' => $this->tenantId()];

        if (!empty($filters['status']) && in_array($filters['status'], self::ALLOWED_STATUSES, true)) {
            $where[]          = 'o.status = :status';
            $params[':status'] = $filters['status'];
        }

        $whereStr    = implode(' AND ', $where);
        $countParams = $params;

        $params[':lim'] = $limit;
        $params[':off'] = $offset;

        $stmt = $this->db->prepare("
            SELECT o.*, u.name AS customer_name, u.email AS customer_email,
                   COUNT(oi.id) AS item_count
            FROM   orders o
            LEFT JOIN users u        ON u.id  = o.user_id
            LEFT JOIN order_items oi ON oi.order_id = o.id
            WHERE  {$whereStr}
            GROUP  BY o.id
            ORDER  BY o.created_at DESC
            LIMIT  :lim OFFSET :off
        ");
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v, in_array($k, [':lim', ':off'], true) ? PDO::PARAM_INT : PDO::PARAM_STR);
        }
        $stmt->execute();

        $cStmt = $this->db->prepare("SELECT COUNT(*) FROM orders o WHERE {$whereStr}");
        $cStmt->execute($countParams);

        return ['data' => $stmt->fetchAll(), 'total' => (int) $cStmt->fetchColumn()];
    }

    public function findById(int $id, ?int $userId = null): ?array
    {
        $sql    = 'SELECT o.*, u.name AS customer_name
                   FROM orders o
                   LEFT JOIN users u ON u.id = o.user_id
                   WHERE o.id = :id AND o.tenant_id = :tid';
        $params = [':id' => $id, ':tid' => $this->tenantId()];

        if ($userId !== null) {
            $sql             .= ' AND o.user_id = :uid';
            $params[':uid']   = $userId;
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $order = $stmt->fetch();

        if ($order === false) {
            return null;
        }

        $iStmt = $this->db->prepare("
            SELECT oi.*, p.name, p.name_ta, pi.url AS image_url
            FROM   order_items oi
            JOIN   products p ON p.id = oi.product_id
            LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.sort_order = 0
            WHERE  oi.order_id = :oid
        ");
        $iStmt->execute([':oid' => $id]);
        $order['items'] = $iStmt->fetchAll();

        return $order;
    }

    public function countByTenant(): int
    {
        $stmt = $this->db->prepare('SELECT COUNT(*) FROM orders WHERE tenant_id = :tid');
        $stmt->execute([':tid' => $this->tenantId()]);
        return (int) $stmt->fetchColumn();
    }

    // -----------------------------------------------------------------------
    // Write
    // -----------------------------------------------------------------------

    public function create(int $userId, array $data, array $items): array
    {
        $this->db->beginTransaction();

        try {
            $orderNumber = 'FS-' . strtoupper(bin2hex(random_bytes(4)));
            $total       = (float) array_reduce(
                $items,
                static fn(float $c, array $i): float => $c + ((float) $i['unit_price'] * (int) $i['quantity']),
                0.0
            );

            $stmt = $this->db->prepare('
                INSERT INTO orders
                  (tenant_id, user_id, order_number, status, total_amount,
                   delivery_address, delivery_date, delivery_slot, notes,
                   created_at, updated_at)
                VALUES
                  (:tid, :uid, :num, :status, :total,
                   :addr, :date, :slot, :notes,
                   :now, :now2)
            ');
            $stmt->execute([
                ':tid'    => $this->tenantId(),
                ':uid'    => $userId,
                ':num'    => $orderNumber,
                ':status' => 'pending',
                ':total'  => $total,
                ':addr'   => json_encode($data['address'] ?? [], JSON_THROW_ON_ERROR),
                ':date'   => !empty($data['delivery_date']) ? $data['delivery_date'] : null,
                ':slot'   => !empty($data['delivery_slot']) ? mb_substr($data['delivery_slot'], 0, 50) : null,
                ':notes'  => !empty($data['notes']) ? mb_substr($data['notes'], 0, 1000) : null,
                ':now'    => $this->now(),
                ':now2'   => $this->now(),
            ]);

            $orderId  = (int) $this->db->lastInsertId();
            $iStmt    = $this->db->prepare('
                INSERT INTO order_items (order_id, product_id, quantity, unit_price, created_at, updated_at)
                VALUES (:oid, :pid, :qty, :price, :now, :now2)
            ');

            foreach ($items as $item) {
                $iStmt->execute([
                    ':oid'   => $orderId,
                    ':pid'   => (int) $item['product_id'],
                    ':qty'   => max(1, (int) $item['quantity']),
                    ':price' => (float) $item['unit_price'],
                    ':now'   => $this->now(),
                    ':now2'  => $this->now(),
                ]);
            }

            $this->db->commit();
            return $this->findById($orderId, $userId)
                ?? throw new \RuntimeException('Order not found after insert');
        } catch (\Throwable $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public function updateStatus(int $id, string $status): ?array
    {
        if (!in_array($status, self::ALLOWED_STATUSES, true)) {
            throw new \InvalidArgumentException("Invalid order status: {$status}");
        }

        $this->db->prepare(
            'UPDATE orders SET status = :status, updated_at = :now WHERE id = :id AND tenant_id = :tid'
        )->execute([
            ':status' => $status,
            ':now'    => $this->now(),
            ':id'     => $id,
            ':tid'    => $this->tenantId(),
        ]);

        return $this->findById($id);
    }

    // -----------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------

    private function tenantId(): string
    {
        return $_ENV['CLIENT_ID'] ?? 'default';
    }

    private function now(): string
    {
        return date('Y-m-d H:i:s');
    }
}
