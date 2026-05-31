<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

interface OrderRepositoryInterface
{
    public function all(int $userId, int $page = 1, int $limit = 15): array;

    /** @param array<string,mixed> $filters */
    public function allAdmin(int $page = 1, int $limit = 15, array $filters = []): array;

    public function findById(int $id, ?int $userId = null): ?array;

    /**
     * @param array<string,mixed> $data
     * @param list<array<string,mixed>> $items
     */
    public function create(int $userId, array $data, array $items): array;

    public function updateStatus(int $id, string $status): ?array;

    public function countByTenant(): int;
}
