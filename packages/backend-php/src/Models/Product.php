<?php

declare(strict_types=1);

namespace App\Models;

class Product extends BaseModel
{
    public function all(array $filters = [], int $page = 1, int $limit = 15): array
    {
        $offset = ($page - 1) * $limit;
        $where  = ['p.tenant_id = ?'];
        $params = [$this->tenantId()];

        if (!empty($filters['category_id'])) {
            $where[]  = 'p.category_id = ?';
            $params[] = $filters['category_id'];
        }

        if (!empty($filters['search'])) {
            $where[]  = '(p.name LIKE ? OR p.name_ta LIKE ? OR p.description LIKE ?)';
            $term     = '%' . $filters['search'] . '%';
            $params[] = $term;
            $params[] = $term;
            $params[] = $term;
        }

        if (!empty($filters['is_festival_special'])) {
            $where[]  = 'p.is_festival_special = 1';
        }

        if (!empty($filters['is_seasonal'])) {
            $where[]  = 'p.is_seasonal = 1';
        }

        if (isset($filters['min_price'])) {
            $where[]  = 'p.price >= ?';
            $params[] = $filters['min_price'];
        }

        if (isset($filters['max_price'])) {
            $where[]  = 'p.price <= ?';
            $params[] = $filters['max_price'];
        }

        if (isset($filters['in_stock']) && $filters['in_stock']) {
            $where[] = 'p.stock_quantity > 0';
        }

        $whereStr = implode(' AND ', $where);

        $sql = "
            SELECT p.*,
                   c.name AS category_name,
                   c.name_ta AS category_name_ta,
                   GROUP_CONCAT(pi.url ORDER BY pi.sort_order) AS image_urls
            FROM products p
            LEFT JOIN categories c ON c.id = p.category_id
            LEFT JOIN product_images pi ON pi.product_id = p.id
            WHERE {$whereStr}
            GROUP BY p.id
            ORDER BY p.created_at DESC
            LIMIT ? OFFSET ?
        ";

        $countParams = $params;
        $params[]    = $limit;
        $params[]    = $offset;

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        // Convert image_urls string to array
        foreach ($rows as &$row) {
            $row['images'] = $row['image_urls'] ? explode(',', $row['image_urls']) : [];
            unset($row['image_urls']);
        }

        $cStmt = $this->db->prepare("SELECT COUNT(*) FROM products p WHERE {$whereStr}");
        $cStmt->execute($countParams);
        $total = (int) $cStmt->fetchColumn();

        return ['data' => $rows, 'total' => $total, 'page' => $page, 'limit' => $limit];
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare("
            SELECT p.*,
                   c.name AS category_name,
                   c.name_ta AS category_name_ta
            FROM products p
            LEFT JOIN categories c ON c.id = p.category_id
            WHERE p.id = ? AND p.tenant_id = ?
        ");
        $stmt->execute([$id, $this->tenantId()]);
        $product = $stmt->fetch();

        if (!$product) {
            return null;
        }

        // Load images
        $imgStmt = $this->db->prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order');
        $imgStmt->execute([$id]);
        $product['images'] = $imgStmt->fetchAll();

        return $product;
    }

    public function create(array $data): array
    {
        $stmt = $this->db->prepare('
            INSERT INTO products
              (tenant_id, category_id, name, name_ta, description, description_ta,
               price, discounted_price, stock_quantity, unit,
               is_festival_special, is_seasonal, is_fresh, is_active,
               created_at, updated_at)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ');
        $stmt->execute([
            $this->tenantId(),
            $data['category_id'] ?? null,
            $data['name'],
            $data['name_ta'] ?? null,
            $data['description'] ?? null,
            $data['description_ta'] ?? null,
            $data['price'],
            $data['discounted_price'] ?? null,
            $data['stock_quantity'] ?? 0,
            $data['unit'] ?? 'piece',
            (int) ($data['is_festival_special'] ?? 0),
            (int) ($data['is_seasonal'] ?? 0),
            (int) ($data['is_fresh'] ?? 0),
            1,
            $this->now(),
            $this->now(),
        ]);

        return $this->findById((int) $this->db->lastInsertId());
    }

    public function update(int $id, array $data): ?array
    {
        $allowed = [
            'category_id', 'name', 'name_ta', 'description', 'description_ta',
            'price', 'discounted_price', 'stock_quantity', 'unit',
            'is_festival_special', 'is_seasonal', 'is_fresh', 'is_active',
        ];
        $fields  = [];
        $values  = [];

        foreach ($allowed as $f) {
            if (array_key_exists($f, $data)) {
                $fields[] = "{$f} = ?";
                $values[] = $data[$f];
            }
        }

        if (empty($fields)) {
            return $this->findById($id);
        }

        $fields[]  = 'updated_at = ?';
        $values[]  = $this->now();
        $values[]  = $id;
        $values[]  = $this->tenantId();

        $this->db->prepare('UPDATE products SET ' . implode(', ', $fields) . ' WHERE id = ? AND tenant_id = ?')
                 ->execute($values);

        return $this->findById($id);
    }

    public function delete(int $id): void
    {
        $this->db->prepare('DELETE FROM products WHERE id = ? AND tenant_id = ?')
                 ->execute([$id, $this->tenantId()]);
    }

    public function trending(int $limit = 8): array
    {
        $stmt = $this->db->prepare("
            SELECT p.*, COUNT(oi.id) AS order_count
            FROM products p
            LEFT JOIN order_items oi ON oi.product_id = p.id
            WHERE p.tenant_id = ? AND p.is_active = 1 AND p.stock_quantity > 0
            GROUP BY p.id
            ORDER BY order_count DESC, p.created_at DESC
            LIMIT ?
        ");
        $stmt->execute([$this->tenantId(), $limit]);
        return $stmt->fetchAll();
    }
}
