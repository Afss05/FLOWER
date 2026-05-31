<?php

declare(strict_types=1);

namespace App\Models;

class Order extends BaseModel
{
    public function all(int $userId, int $page = 1, int $limit = 15): array
    {
        $offset = ($page - 1) * $limit;
        $stmt   = $this->db->prepare("
            SELECT o.*, COUNT(oi.id) AS item_count
            FROM orders o
            LEFT JOIN order_items oi ON oi.order_id = o.id
            WHERE o.user_id = ? AND o.tenant_id = ?
            GROUP BY o.id
            ORDER BY o.created_at DESC
            LIMIT ? OFFSET ?
        ");
        $stmt->execute([$userId, $this->tenantId(), $limit, $offset]);
        $rows = $stmt->fetchAll();

        $cStmt = $this->db->prepare('SELECT COUNT(*) FROM orders WHERE user_id = ? AND tenant_id = ?');
        $cStmt->execute([$userId, $this->tenantId()]);

        return ['data' => $rows, 'total' => (int) $cStmt->fetchColumn()];
    }

    public function allAdmin(int $page = 1, int $limit = 15, array $filters = []): array
    {
        $offset = ($page - 1) * $limit;
        $where  = ['o.tenant_id = ?'];
        $params = [$this->tenantId()];

        if (!empty($filters['status'])) {
            $where[]  = 'o.status = ?';
            $params[] = $filters['status'];
        }

        $whereStr = implode(' AND ', $where);

        $stmt = $this->db->prepare("
            SELECT o.*, u.name AS customer_name, u.email AS customer_email,
                   COUNT(oi.id) AS item_count
            FROM orders o
            LEFT JOIN users u ON u.id = o.user_id
            LEFT JOIN order_items oi ON oi.order_id = o.id
            WHERE {$whereStr}
            GROUP BY o.id
            ORDER BY o.created_at DESC
            LIMIT ? OFFSET ?
        ");
        $params[] = $limit;
        $params[] = $offset;
        $stmt->execute($params);

        return $stmt->fetchAll();
    }

    public function findById(int $id, ?int $userId = null): ?array
    {
        $sql    = 'SELECT o.*, u.name AS customer_name FROM orders o LEFT JOIN users u ON u.id = o.user_id WHERE o.id = ? AND o.tenant_id = ?';
        $params = [$id, $this->tenantId()];

        if ($userId !== null) {
            $sql    .= ' AND o.user_id = ?';
            $params[] = $userId;
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $order = $stmt->fetch();

        if (!$order) {
            return null;
        }

        // Load items
        $iStmt = $this->db->prepare("
            SELECT oi.*, p.name, p.name_ta, pi.url AS image_url
            FROM order_items oi
            JOIN products p ON p.id = oi.product_id
            LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.sort_order = 0
            WHERE oi.order_id = ?
        ");
        $iStmt->execute([$id]);
        $order['items'] = $iStmt->fetchAll();

        return $order;
    }

    public function create(int $userId, array $data, array $items): array
    {
        $this->db->beginTransaction();

        try {
            $orderNumber = 'FS-' . strtoupper(bin2hex(random_bytes(4)));
            $total       = array_reduce($items, fn($c, $i) => $c + ($i['unit_price'] * $i['quantity']), 0.0);

            $stmt = $this->db->prepare('
                INSERT INTO orders
                  (tenant_id, user_id, order_number, status, total_amount,
                   delivery_address, delivery_date, delivery_slot, notes, created_at, updated_at)
                VALUES (?,?,?,?,?,?,?,?,?,?,?)
            ');
            $stmt->execute([
                $this->tenantId(),
                $userId,
                $orderNumber,
                'pending',
                $total,
                json_encode($data['address'] ?? []),
                $data['delivery_date'] ?? null,
                $data['delivery_slot'] ?? null,
                $data['notes'] ?? null,
                $this->now(),
                $this->now(),
            ]);

            $orderId   = (int) $this->db->lastInsertId();
            $itemStmt  = $this->db->prepare('
                INSERT INTO order_items (order_id, product_id, quantity, unit_price, created_at, updated_at)
                VALUES (?,?,?,?,?,?)
            ');

            foreach ($items as $item) {
                $itemStmt->execute([
                    $orderId,
                    $item['product_id'],
                    $item['quantity'],
                    $item['unit_price'],
                    $this->now(),
                    $this->now(),
                ]);
            }

            $this->db->commit();
            return $this->findById($orderId, $userId);
        } catch (\Throwable $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public function updateStatus(int $id, string $status): ?array
    {
        $this->db->prepare('UPDATE orders SET status = ?, updated_at = ? WHERE id = ? AND tenant_id = ?')
                 ->execute([$status, $this->now(), $id, $this->tenantId()]);

        return $this->findById($id);
    }
}
