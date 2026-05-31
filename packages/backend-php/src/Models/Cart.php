<?php

declare(strict_types=1);

namespace App\Models;

class Cart extends BaseModel
{
    public function findOrCreateByUser(int $userId): array
    {
        $stmt = $this->db->prepare('SELECT * FROM carts WHERE user_id = ? AND tenant_id = ? LIMIT 1');
        $stmt->execute([$userId, $this->tenantId()]);
        $cart = $stmt->fetch();

        if (!$cart) {
            $this->db->prepare('INSERT INTO carts (user_id, tenant_id, created_at, updated_at) VALUES (?,?,?,?)')
                     ->execute([$userId, $this->tenantId(), $this->now(), $this->now()]);
            $cart = ['id' => (int) $this->db->lastInsertId(), 'user_id' => $userId];
        }

        $cart['items'] = $this->getItems((int) $cart['id']);
        $cart['total'] = $this->calculateTotal($cart['items']);
        return $cart;
    }

    public function getItems(int $cartId): array
    {
        $stmt = $this->db->prepare("
            SELECT ci.*, p.name, p.name_ta, p.price, p.discounted_price,
                   pi.url AS image_url
            FROM cart_items ci
            JOIN products p ON p.id = ci.product_id
            LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.sort_order = 0
            WHERE ci.cart_id = ?
        ");
        $stmt->execute([$cartId]);
        return $stmt->fetchAll();
    }

    public function addItem(int $cartId, int $productId, int $quantity): array
    {
        // Check if already in cart
        $stmt = $this->db->prepare('SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ? LIMIT 1');
        $stmt->execute([$cartId, $productId]);
        $existing = $stmt->fetch();

        if ($existing) {
            $this->db->prepare('UPDATE cart_items SET quantity = quantity + ?, updated_at = ? WHERE id = ?')
                     ->execute([$quantity, $this->now(), $existing['id']]);
        } else {
            $priceStmt = $this->db->prepare('SELECT price, discounted_price FROM products WHERE id = ?');
            $priceStmt->execute([$productId]);
            $product   = $priceStmt->fetch();
            $unitPrice = $product['discounted_price'] ?? $product['price'];

            $this->db->prepare('INSERT INTO cart_items (cart_id, product_id, quantity, unit_price, created_at, updated_at) VALUES (?,?,?,?,?,?)')
                     ->execute([$cartId, $productId, $quantity, $unitPrice, $this->now(), $this->now()]);
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
        $this->db->prepare('UPDATE cart_items SET quantity = ?, updated_at = ? WHERE id = ? AND cart_id = ?')
                 ->execute([$quantity, $this->now(), $itemId, $cartId]);
        $this->touchCart($cartId);
    }

    public function removeItem(int $cartId, int $itemId): void
    {
        $this->db->prepare('DELETE FROM cart_items WHERE id = ? AND cart_id = ?')
                 ->execute([$itemId, $cartId]);
        $this->touchCart($cartId);
    }

    public function clear(int $cartId): void
    {
        $this->db->prepare('DELETE FROM cart_items WHERE cart_id = ?')->execute([$cartId]);
        $this->touchCart($cartId);
    }

    private function touchCart(int $cartId): void
    {
        $this->db->prepare('UPDATE carts SET updated_at = ? WHERE id = ?')
                 ->execute([$this->now(), $cartId]);
    }

    private function calculateTotal(array $items): float
    {
        return array_reduce($items, fn($carry, $item) => $carry + ($item['unit_price'] * $item['quantity']), 0.0);
    }
}
