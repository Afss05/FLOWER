<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Repositories\Contracts\CartRepositoryInterface;
use PDO;

final class CartRepository implements CartRepositoryInterface
{
    public function __construct(private readonly PDO $db) {}

    public function findOrCreateByUser(int $userId): array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM carts WHERE user_id = :uid AND tenant_id = :tid LIMIT 1'
        );
        $stmt->execute([':uid' => $userId, ':tid' => $this->tenantId()]);
        $cart = $stmt->fetch();

        if ($cart === false) {
            $this->db->prepare(
                'INSERT INTO carts (user_id, tenant_id, created_at, updated_at) VALUES (:uid, :tid, :now, :now2)'
            )->execute([
                ':uid'  => $userId,
                ':tid'  => $this->tenantId(),
                ':now'  => $this->now(),
                ':now2' => $this->now(),
            ]);
            $cart = ['id' => (int) $this->db->lastInsertId(), 'user_id' => $userId];
        }

        $cartId          = (int) $cart['id'];
        $cart['items']   = $this->getItems($cartId);
        $cart['total']   = $this->calculateTotal($cart['items']);
        $cart['item_count'] = count($cart['items']);

        return $cart;
    }

    public function getItems(int $cartId): array
    {
        $stmt = $this->db->prepare("
            SELECT ci.id, ci.cart_id, ci.product_id, ci.quantity, ci.unit_price,
                   p.name, p.name_ta, p.price, p.discounted_price, p.stock_quantity,
                   pi.url AS image_url
            FROM   cart_items ci
            JOIN   products p  ON p.id  = ci.product_id
            LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.sort_order = 0
            WHERE  ci.cart_id = :cid
            ORDER  BY ci.created_at ASC
        ");
        $stmt->execute([':cid' => $cartId]);
        return $stmt->fetchAll();
    }

    public function addItem(int $cartId, int $productId, int $quantity): array
    {
        if ($quantity < 1) {
            throw new \InvalidArgumentException('Quantity must be at least 1');
        }

        $stmt = $this->db->prepare(
            'SELECT * FROM cart_items WHERE cart_id = :cid AND product_id = :pid LIMIT 1'
        );
        $stmt->execute([':cid' => $cartId, ':pid' => $productId]);
        $existing = $stmt->fetch();

        if ($existing !== false) {
            $this->db->prepare(
                'UPDATE cart_items SET quantity = quantity + :qty, updated_at = :now WHERE id = :id'
            )->execute([':qty' => $quantity, ':now' => $this->now(), ':id' => $existing['id']]);
        } else {
            $priceStmt = $this->db->prepare(
                'SELECT price, discounted_price FROM products WHERE id = :pid LIMIT 1'
            );
            $priceStmt->execute([':pid' => $productId]);
            $product   = $priceStmt->fetch();

            if ($product === false) {
                throw new \RuntimeException("Product #{$productId} not found");
            }

            $unitPrice = $product['discounted_price'] !== null
                ? (float) $product['discounted_price']
                : (float) $product['price'];

            $this->db->prepare('
                INSERT INTO cart_items (cart_id, product_id, quantity, unit_price, created_at, updated_at)
                VALUES (:cid, :pid, :qty, :price, :now, :now2)
            ')->execute([
                ':cid'   => $cartId,
                ':pid'   => $productId,
                ':qty'   => $quantity,
                ':price' => $unitPrice,
                ':now'   => $this->now(),
                ':now2'  => $this->now(),
            ]);
        }

        $this->touchCart($cartId);
        return $this->getItems($cartId);
    }

    public function updateItem(int $cartId, int $itemId, int $quantity): void
    {
        if ($quantity <= 0) {
            $this->removeItem($cartId, $itemId);
            return;
        }

        $this->db->prepare(
            'UPDATE cart_items SET quantity = :qty, updated_at = :now
             WHERE id = :id AND cart_id = :cid'
        )->execute([
            ':qty'  => $quantity,
            ':now'  => $this->now(),
            ':id'   => $itemId,
            ':cid'  => $cartId,
        ]);

        $this->touchCart($cartId);
    }

    public function removeItem(int $cartId, int $itemId): void
    {
        $this->db->prepare(
            'DELETE FROM cart_items WHERE id = :id AND cart_id = :cid'
        )->execute([':id' => $itemId, ':cid' => $cartId]);

        $this->touchCart($cartId);
    }

    public function clear(int $cartId): void
    {
        $this->db->prepare(
            'DELETE FROM cart_items WHERE cart_id = :cid'
        )->execute([':cid' => $cartId]);

        $this->touchCart($cartId);
    }

    // -----------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------

    private function touchCart(int $cartId): void
    {
        $this->db->prepare(
            'UPDATE carts SET updated_at = :now WHERE id = :id'
        )->execute([':now' => $this->now(), ':id' => $cartId]);
    }

    private function calculateTotal(array $items): float
    {
        return (float) array_reduce(
            $items,
            static fn(float $carry, array $item): float
                => $carry + ((float) $item['unit_price'] * (int) $item['quantity']),
            0.0
        );
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
