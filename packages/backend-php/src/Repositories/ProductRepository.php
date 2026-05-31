<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Repositories\Contracts\ProductRepositoryInterface;
use PDO;

final class ProductRepository implements ProductRepositoryInterface
{
    public function __construct(private readonly PDO $db) {}

    // -----------------------------------------------------------------------
    // Read
    // -----------------------------------------------------------------------

    public function all(array $filters = [], int $page = 1, int $limit = 15): array
    {
        $page   = max(1, $page);
        $limit  = min(100, max(1, $limit));
        $offset = ($page - 1) * $limit;

        $where  = ['p.tenant_id = :tid'];
        $params = [':tid' => $this->tenantId()];
        $i      = 0; // unique param counter

        if (!empty($filters['category_id'])) {
            $key            = ":cat{$i}";
            $where[]        = "p.category_id = {$key}";
            $params[$key]   = (int) $filters['category_id'];
            $i++;
        }

        if (!empty($filters['search'])) {
            $term           = '%' . $this->escapeLike($filters['search']) . '%';
            $k1 = ":s1{$i}"; $k2 = ":s2{$i}"; $k3 = ":s3{$i}";
            $where[]        = "(p.name LIKE {$k1} OR p.name_ta LIKE {$k2} OR p.description LIKE {$k3})";
            $params[$k1]    = $term;
            $params[$k2]    = $term;
            $params[$k3]    = $term;
            $i++;
        }

        if (!empty($filters['is_festival_special'])) {
            $where[] = 'p.is_festival_special = 1';
        }

        if (!empty($filters['is_seasonal'])) {
            $where[] = 'p.is_seasonal = 1';
        }

        if (isset($filters['min_price']) && is_numeric($filters['min_price'])) {
            $k          = ":min{$i}";
            $where[]    = "p.price >= {$k}";
            $params[$k] = (float) $filters['min_price'];
            $i++;
        }

        if (isset($filters['max_price']) && is_numeric($filters['max_price'])) {
            $k          = ":max{$i}";
            $where[]    = "p.price <= {$k}";
            $params[$k] = (float) $filters['max_price'];
            $i++;
        }

        if (!empty($filters['in_stock'])) {
            $where[] = 'p.stock_quantity > 0';
        }

        if (!array_key_exists('show_inactive', $filters)) {
            $where[] = 'p.is_active = 1';
        }

        $whereStr    = implode(' AND ', $where);
        $countParams = $params;

        $params[':lim'] = $limit;
        $params[':off'] = $offset;

        $sql = "
            SELECT p.*,
                   c.name    AS category_name,
                   c.name_ta AS category_name_ta,
                   GROUP_CONCAT(pi.url ORDER BY pi.sort_order SEPARATOR '|||') AS image_urls
            FROM   products p
            LEFT JOIN categories c ON c.id = p.category_id
            LEFT JOIN product_images pi ON pi.product_id = p.id
            WHERE  {$whereStr}
            GROUP  BY p.id
            ORDER  BY p.created_at DESC
            LIMIT  :lim OFFSET :off
        ";

        $stmt = $this->db->prepare($sql);
        foreach ($params as $k => $v) {
            if (in_array($k, [':lim', ':off'], true)) {
                $stmt->bindValue($k, $v, PDO::PARAM_INT);
            } else {
                $stmt->bindValue($k, $v);
            }
        }
        $stmt->execute();
        $rows = $stmt->fetchAll();

        foreach ($rows as &$row) {
            $row['images'] = $row['image_urls'] !== null
                ? array_filter(explode('|||', (string) $row['image_urls']))
                : [];
            unset($row['image_urls']);
        }
        unset($row);

        $cStmt = $this->db->prepare(
            "SELECT COUNT(*) FROM products p WHERE {$whereStr}"
        );
        $cStmt->execute($countParams);

        return [
            'data'  => $rows,
            'total' => (int) $cStmt->fetchColumn(),
            'page'  => $page,
            'limit' => $limit,
        ];
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare("
            SELECT p.*, c.name AS category_name, c.name_ta AS category_name_ta
            FROM   products p
            LEFT JOIN categories c ON c.id = p.category_id
            WHERE  p.id = :id AND p.tenant_id = :tid
        ");
        $stmt->execute([':id' => $id, ':tid' => $this->tenantId()]);
        $product = $stmt->fetch();

        if ($product === false) {
            return null;
        }

        $imgStmt = $this->db->prepare(
            'SELECT * FROM product_images WHERE product_id = :pid ORDER BY sort_order'
        );
        $imgStmt->execute([':pid' => $id]);
        $product['images'] = $imgStmt->fetchAll();

        return $product;
    }

    public function trending(int $limit = 8): array
    {
        $limit = min(50, max(1, $limit));
        $stmt  = $this->db->prepare("
            SELECT p.*, COUNT(oi.id) AS order_count
            FROM   products p
            LEFT JOIN order_items oi ON oi.product_id = p.id
            WHERE  p.tenant_id = :tid AND p.is_active = 1 AND p.stock_quantity > 0
            GROUP  BY p.id
            ORDER  BY order_count DESC, p.created_at DESC
            LIMIT  :lim
        ");
        $stmt->bindValue(':tid', $this->tenantId());
        $stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function count(): int
    {
        $stmt = $this->db->prepare(
            'SELECT COUNT(*) FROM products WHERE tenant_id = :tid'
        );
        $stmt->execute([':tid' => $this->tenantId()]);
        return (int) $stmt->fetchColumn();
    }

    // -----------------------------------------------------------------------
    // Write
    // -----------------------------------------------------------------------

    public function create(array $data): array
    {
        $stmt = $this->db->prepare('
            INSERT INTO products
              (tenant_id, category_id, name, name_ta, description, description_ta,
               price, discounted_price, stock_quantity, unit,
               is_festival_special, is_seasonal, is_fresh, is_active,
               created_at, updated_at)
            VALUES
              (:tid, :cat, :name, :name_ta, :desc, :desc_ta,
               :price, :disc, :stock, :unit,
               :festival, :seasonal, :fresh, 1,
               :now, :now2)
        ');
        $stmt->execute([
            ':tid'      => $this->tenantId(),
            ':cat'      => isset($data['category_id']) ? (int) $data['category_id'] : null,
            ':name'     => mb_substr(trim((string) $data['name']), 0, 200),
            ':name_ta'  => mb_substr(trim((string) ($data['name_ta'] ?? '')), 0, 200),
            ':desc'     => $data['description'] ?? null,
            ':desc_ta'  => $data['description_ta'] ?? null,
            ':price'    => (float) $data['price'],
            ':disc'     => isset($data['discounted_price']) ? (float) $data['discounted_price'] : null,
            ':stock'    => max(0, (int) ($data['stock_quantity'] ?? 0)),
            ':unit'     => mb_substr(trim((string) ($data['unit'] ?? 'piece')), 0, 50),
            ':festival' => (int) (bool) ($data['is_festival_special'] ?? false),
            ':seasonal' => (int) (bool) ($data['is_seasonal'] ?? false),
            ':fresh'    => (int) (bool) ($data['is_fresh'] ?? false),
            ':now'      => $this->now(),
            ':now2'     => $this->now(),
        ]);

        $id = (int) $this->db->lastInsertId();
        return $this->findById($id) ?? throw new \RuntimeException('Product not found after insert');
    }

    public function update(int $id, array $data): ?array
    {
        $allowed = [
            'category_id', 'name', 'name_ta', 'description', 'description_ta',
            'price', 'discounted_price', 'stock_quantity', 'unit',
            'is_festival_special', 'is_seasonal', 'is_fresh', 'is_active',
        ];
        $fields = [];
        $values = [];

        foreach ($allowed as $f) {
            if (!array_key_exists($f, $data)) {
                continue;
            }
            $fields[] = "{$f} = ?";
            $values[] = match ($f) {
                'price', 'discounted_price'         => $data[$f] !== null ? (float) $data[$f] : null,
                'category_id', 'stock_quantity',
                'is_festival_special', 'is_seasonal',
                'is_fresh', 'is_active'             => (int) $data[$f],
                default                             => mb_substr(trim((string) $data[$f]), 0, 255),
            };
        }

        if (empty($fields)) {
            return $this->findById($id);
        }

        $fields[] = 'updated_at = ?';
        $values[] = $this->now();
        $values[] = $id;
        $values[] = $this->tenantId();

        $this->db->prepare(
            'UPDATE products SET ' . implode(', ', $fields) . ' WHERE id = ? AND tenant_id = ?'
        )->execute($values);

        return $this->findById($id);
    }

    public function delete(int $id): void
    {
        $this->db->prepare(
            'DELETE FROM products WHERE id = :id AND tenant_id = :tid'
        )->execute([':id' => $id, ':tid' => $this->tenantId()]);
    }

    // -----------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------

    private function escapeLike(string $value): string
    {
        return str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $value);
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
