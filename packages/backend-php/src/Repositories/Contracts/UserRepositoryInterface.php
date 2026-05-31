<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

interface UserRepositoryInterface
{
    public function findById(int $id): ?array;

    public function findByEmail(string $email): ?array;

    /** @param array{name:string,email:string,password:string,phone?:string,role?:string} $data */
    public function create(array $data): array;

    /** @param array<string,mixed> $data */
    public function update(int $id, array $data): ?array;

    public function all(int $page = 1, int $limit = 15): array;

    public function count(): int;
}
