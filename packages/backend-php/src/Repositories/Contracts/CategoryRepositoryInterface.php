<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

interface CategoryRepositoryInterface
{
    /** @return list<array<string,mixed>> */
    public function all(): array;

    public function findById(int $id): ?array;
}
