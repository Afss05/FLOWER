<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\Product\ProductFilterDTO;
use App\Exceptions\NotFoundException;
use App\Repositories\Contracts\ProductRepositoryInterface;

final class ProductService
{
    public function __construct(private readonly ProductRepositoryInterface $products) {}

    public function getAll(ProductFilterDTO $dto): array
    {
        return $this->products->all($dto->toFilters(), $dto->page, $dto->limit);
    }

    public function getById(int $id): array
    {
        if ($id <= 0) {
            throw new NotFoundException('Product');
        }

        $product = $this->products->findById($id);

        if ($product === null) {
            throw new NotFoundException('Product');
        }

        return $product;
    }

    public function getFestivalSpecials(): array
    {
        $result = $this->products->all(
            ['is_festival_special' => true, 'in_stock' => true],
            1,
            12
        );
        return $result['data'];
    }

    public function getTrending(): array
    {
        return $this->products->trending(8);
    }

    /** @param array<string,mixed> $data */
    public function create(array $data): array
    {
        return $this->products->create($data);
    }

    /** @param array<string,mixed> $data */
    public function update(int $id, array $data): array
    {
        if ($id <= 0) {
            throw new NotFoundException('Product');
        }

        $product = $this->products->update($id, $data);

        if ($product === null) {
            throw new NotFoundException('Product');
        }

        return $product;
    }

    public function delete(int $id): void
    {
        if ($id <= 0) {
            throw new NotFoundException('Product');
        }

        // Verify it exists before deleting
        if ($this->products->findById($id) === null) {
            throw new NotFoundException('Product');
        }

        $this->products->delete($id);
    }
}
