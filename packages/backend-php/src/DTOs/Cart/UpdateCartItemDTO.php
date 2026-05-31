<?php

declare(strict_types=1);

namespace App\DTOs\Cart;

use App\Exceptions\ValidationException;

final class UpdateCartItemDTO
{
    private function __construct(
        public readonly int $quantity,
    ) {}

    /** @param array<string,mixed> $raw */
    public static function fromArray(array $raw): self
    {
        if (!isset($raw['quantity']) || !is_numeric($raw['quantity'])) {
            throw new ValidationException(['quantity' => 'Quantity is required and must be numeric']);
        }

        $quantity = (int) $raw['quantity'];

        if ($quantity < 0) {
            throw new ValidationException(['quantity' => 'Quantity must not be negative']);
        }

        if ($quantity > 999) {
            throw new ValidationException(['quantity' => 'Quantity must not exceed 999']);
        }

        return new self(quantity: $quantity);
    }
}
