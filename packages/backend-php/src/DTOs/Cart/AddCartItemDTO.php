<?php

declare(strict_types=1);

namespace App\DTOs\Cart;

use App\Exceptions\ValidationException;

final class AddCartItemDTO
{
    private function __construct(
        public readonly int $productId,
        public readonly int $quantity,
    ) {}

    /** @param array<string,mixed> $raw */
    public static function fromArray(array $raw): self
    {
        $errors = [];

        $productId = 0;
        if (empty($raw['product_id']) || !is_numeric($raw['product_id'])) {
            $errors['product_id'] = 'Product ID is required';
        } else {
            $productId = (int) $raw['product_id'];
            if ($productId <= 0) {
                $errors['product_id'] = 'Product ID must be a positive integer';
            }
        }

        $quantity = 1;
        if (!isset($raw['quantity']) || !is_numeric($raw['quantity'])) {
            $errors['quantity'] = 'Quantity is required';
        } else {
            $quantity = (int) $raw['quantity'];
            if ($quantity < 1) {
                $errors['quantity'] = 'Quantity must be at least 1';
            } elseif ($quantity > 999) {
                $errors['quantity'] = 'Quantity must not exceed 999';
            }
        }

        if (!empty($errors)) {
            throw new ValidationException($errors);
        }

        return new self(productId: $productId, quantity: $quantity);
    }
}
