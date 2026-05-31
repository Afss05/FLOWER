<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

interface ProductRepositoryInterface
{
    /** @param array<string,mixed> $filters */
    public function all(array $filters = [], int $page = 1, int $limit = 15): array;

    public function findById(int $id): ?array;

    public function trending(int $limit = 8): array;

    /** @param array<string,mixed> $data */
    public function create(array $data): array;

    /** @param array<string,mixed> $data */
    public function update(int $id, array $data): ?array;

    public function delete(int $id): void;

    public function count(): int;
}
