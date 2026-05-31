<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

interface BlogRepositoryInterface
{
    /** @param array<string,mixed> $filters */
    public function all(array $filters = [], int $page = 1, int $limit = 10): array;

    public function findBySlug(string $slug): ?array;

    public function findById(int $id): ?array;

    /** @param array<string,mixed> $data */
    public function create(array $data, int $authorId): array;
}
