<?php

declare(strict_types=1);

namespace App\DTOs\Product;

use App\Exceptions\ValidationException;

final class CreateProductDTO
{
    private function __construct(
        public readonly string  $name,
        public readonly string  $nameTa,
        public readonly float   $price,
        public readonly ?float  $discountedPrice,
        public readonly int     $stockQuantity,
        public readonly string  $unit,
        public readonly ?int    $categoryId,
        public readonly ?string $description,
        public readonly ?string $descriptionTa,
        public readonly bool    $isFestivalSpecial,
        public readonly bool    $isSeasonal,
        public readonly bool    $isFresh,
    ) {}

    /** @param array<string,mixed> $raw */
    public static function fromArray(array $raw): self
    {
        $errors = [];

        $name = trim(strip_tags((string) ($raw['name'] ?? '')));
        if ($name === '') {
            $errors['name'] = 'Product name is required';
        } elseif (mb_strlen($name) > 200) {
            $errors['name'] = 'Name must not exceed 200 characters';
        }

        if (!isset($raw['price']) || !is_numeric($raw['price'])) {
            $errors['price'] = 'Valid price is required';
        } elseif ((float) $raw['price'] < 0) {
            $errors['price'] = 'Price must not be negative';
        }

        $price = isset($errors['price']) ? 0.0 : (float) $raw['price'];

        $discountedPrice = null;
        if (isset($raw['discounted_price']) && $raw['discounted_price'] !== null && $raw['discounted_price'] !== '') {
            if (!is_numeric($raw['discounted_price'])) {
                $errors['discounted_price'] = 'Discounted price must be numeric';
            } else {
                $dp = (float) $raw['discounted_price'];
                if ($dp < 0) {
                    $errors['discounted_price'] = 'Discounted price must not be negative';
                } elseif (!isset($errors['price']) && $dp >= $price) {
                    $errors['discounted_price'] = 'Discounted price must be less than original price';
                } else {
                    $discountedPrice = $dp;
                }
            }
        }

        $stock = 0;
        if (isset($raw['stock_quantity'])) {
            $stock = (int) $raw['stock_quantity'];
            if ($stock < 0) {
                $errors['stock_quantity'] = 'Stock must not be negative';
            }
        }

        $categoryId = null;
        if (!empty($raw['category_id']) && is_numeric($raw['category_id'])) {
            $categoryId = (int) $raw['category_id'];
        }

        if (!empty($errors)) {
            throw new ValidationException($errors);
        }

        return new self(
            name:              $name,
            nameTa:            mb_substr(trim(strip_tags((string) ($raw['name_ta'] ?? ''))), 0, 200),
            price:             $price,
            discountedPrice:   $discountedPrice,
            stockQuantity:     max(0, $stock),
            unit:              mb_substr(trim((string) ($raw['unit'] ?? 'piece')), 0, 50),
            categoryId:        $categoryId,
            description:       !empty($raw['description']) ? trim((string) $raw['description']) : null,
            descriptionTa:     !empty($raw['description_ta']) ? trim((string) $raw['description_ta']) : null,
            isFestivalSpecial: (bool) ($raw['is_festival_special'] ?? false),
            isSeasonal:        (bool) ($raw['is_seasonal'] ?? false),
            isFresh:           (bool) ($raw['is_fresh'] ?? false),
        );
    }

    /** @return array<string,mixed> */
    public function toArray(): array
    {
        return [
            'name'               => $this->name,
            'name_ta'            => $this->nameTa,
            'price'              => $this->price,
            'discounted_price'   => $this->discountedPrice,
            'stock_quantity'     => $this->stockQuantity,
            'unit'               => $this->unit,
            'category_id'        => $this->categoryId,
            'description'        => $this->description,
            'description_ta'     => $this->descriptionTa,
            'is_festival_special'=> $this->isFestivalSpecial,
            'is_seasonal'        => $this->isSeasonal,
            'is_fresh'           => $this->isFresh,
        ];
    }
}
