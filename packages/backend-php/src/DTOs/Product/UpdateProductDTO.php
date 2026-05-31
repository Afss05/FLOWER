<?php

declare(strict_types=1);

namespace App\DTOs\Product;

use App\Exceptions\ValidationException;

/** All fields optional — only provided keys are updated */
final class UpdateProductDTO
{
    /** @var array<string,mixed> */
    private readonly array $fields;

    private function __construct(array $fields)
    {
        $this->fields = $fields;
    }

    /** @param array<string,mixed> $raw */
    public static function fromArray(array $raw): self
    {
        $errors = [];
        $fields = [];

        if (array_key_exists('name', $raw)) {
            $v = trim(strip_tags((string) $raw['name']));
            if ($v === '') {
                $errors['name'] = 'Name must not be empty';
            } elseif (mb_strlen($v) > 200) {
                $errors['name'] = 'Name must not exceed 200 characters';
            } else {
                $fields['name'] = $v;
            }
        }

        if (array_key_exists('name_ta', $raw)) {
            $fields['name_ta'] = mb_substr(trim(strip_tags((string) $raw['name_ta'])), 0, 200);
        }

        if (array_key_exists('price', $raw)) {
            if (!is_numeric($raw['price']) || (float) $raw['price'] < 0) {
                $errors['price'] = 'Price must be a non-negative number';
            } else {
                $fields['price'] = (float) $raw['price'];
            }
        }

        if (array_key_exists('discounted_price', $raw)) {
            if ($raw['discounted_price'] === null || $raw['discounted_price'] === '') {
                $fields['discounted_price'] = null;
            } elseif (!is_numeric($raw['discounted_price']) || (float) $raw['discounted_price'] < 0) {
                $errors['discounted_price'] = 'Discounted price must be a non-negative number';
            } else {
                $fields['discounted_price'] = (float) $raw['discounted_price'];
            }
        }

        if (array_key_exists('stock_quantity', $raw)) {
            $v = (int) $raw['stock_quantity'];
            if ($v < 0) {
                $errors['stock_quantity'] = 'Stock must not be negative';
            } else {
                $fields['stock_quantity'] = $v;
            }
        }

        foreach (['description', 'description_ta', 'unit'] as $f) {
            if (array_key_exists($f, $raw)) {
                $fields[$f] = $raw[$f] !== null ? mb_substr(trim((string) $raw[$f]), 0, 1000) : null;
            }
        }

        foreach (['category_id'] as $f) {
            if (array_key_exists($f, $raw)) {
                $fields[$f] = $raw[$f] !== null ? (int) $raw[$f] : null;
            }
        }

        foreach (['is_festival_special', 'is_seasonal', 'is_fresh', 'is_active'] as $f) {
            if (array_key_exists($f, $raw)) {
                $fields[$f] = (bool) $raw[$f];
            }
        }

        if (!empty($errors)) {
            throw new ValidationException($errors);
        }

        return new self($fields);
    }

    /** @return array<string,mixed> */
    public function toArray(): array
    {
        return $this->fields;
    }

    public function isEmpty(): bool
    {
        return empty($this->fields);
    }
}
