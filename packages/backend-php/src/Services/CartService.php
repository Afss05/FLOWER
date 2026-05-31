<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\Cart\AddCartItemDTO;
use App\DTOs\Cart\UpdateCartItemDTO;
use App\Exceptions\NotFoundException;
use App\Repositories\Contracts\CartRepositoryInterface;
use App\Repositories\Contracts\ProductRepositoryInterface;

final class CartService
{
    public function __construct(
        private readonly CartRepositoryInterface    $carts,
        private readonly ProductRepositoryInterface $products,
    ) {}

    public function getCart(int $userId): array
    {
        return $this->carts->findOrCreateByUser($userId);
    }

    public function addItem(int $userId, AddCartItemDTO $dto): array
    {
        // Verify product exists and is active
        $product = $this->products->findById($dto->productId);
        if ($product === null) {
            throw new NotFoundException('Product');
        }

        if ((int) ($product['is_active'] ?? 1) === 0) {
            throw new \App\Exceptions\AppException('Product is not available', 422);
        }

        if ((int) ($product['stock_quantity'] ?? 0) < $dto->quantity) {
            throw new \App\Exceptions\AppException(
                "Only {$product['stock_quantity']} item(s) in stock",
                422
            );
        }

        $cart  = $this->carts->findOrCreateByUser($userId);
        $items = $this->carts->addItem((int) $cart['id'], $dto->productId, $dto->quantity);

        return ['items' => $items, 'total' => $this->sumTotal($items)];
    }

    public function updateItem(int $userId, int $itemId, UpdateCartItemDTO $dto): array
    {
        $cart = $this->carts->findOrCreateByUser($userId);
        $this->carts->updateItem((int) $cart['id'], $itemId, $dto->quantity);
        return $this->carts->findOrCreateByUser($userId);
    }

    public function removeItem(int $userId, int $itemId): array
    {
        $cart = $this->carts->findOrCreateByUser($userId);
        $this->carts->removeItem((int) $cart['id'], $itemId);
        return $this->carts->findOrCreateByUser($userId);
    }

    public function clearCart(int $userId): void
    {
        $cart = $this->carts->findOrCreateByUser($userId);
        $this->carts->clear((int) $cart['id']);
    }

    // -----------------------------------------------------------------------

    /** @param list<array<string,mixed>> $items */
    private function sumTotal(array $items): float
    {
        return (float) array_reduce(
            $items,
            static fn(float $c, array $i): float => $c + ((float) $i['unit_price'] * (int) $i['quantity']),
            0.0
        );
    }
}
