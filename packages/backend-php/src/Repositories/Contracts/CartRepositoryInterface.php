<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

interface CartRepositoryInterface
{
    public function findOrCreateByUser(int $userId): array;

    /** @return list<array<string,mixed>> */
    public function getItems(int $cartId): array;

    /** @return list<array<string,mixed>> */
    public function addItem(int $cartId, int $productId, int $quantity): array;

    public function updateItem(int $cartId, int $itemId, int $quantity): void;

    public function removeItem(int $cartId, int $itemId): void;

    public function clear(int $cartId): void;
}
