<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\User\ChangePasswordDTO;
use App\DTOs\User\UpdateProfileDTO;
use App\Exceptions\AppException;
use App\Exceptions\ConflictException;
use App\Exceptions\NotFoundException;
use App\Exceptions\UnauthorizedException;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\UserRepository;

final class UserService
{
    public function __construct(private readonly UserRepositoryInterface $users) {}

    public function getProfile(int $userId): array
    {
        $user = $this->users->findById($userId);

        if ($user === null) {
            throw new NotFoundException('User');
        }

        return UserRepository::publicData($user);
    }

    public function updateProfile(int $userId, UpdateProfileDTO $dto): array
    {
        if ($dto->isEmpty()) {
            return $this->getProfile($userId);
        }

        // If email is being changed, check for duplicates
        if ($dto->email !== null) {
            $existing = $this->users->findByEmail($dto->email);
            if ($existing !== null && (int) $existing['id'] !== $userId) {
                throw new ConflictException('Email already in use');
            }
        }

        $updated = $this->users->update($userId, $dto->toArray());

        if ($updated === null) {
            throw new NotFoundException('User');
        }

        return UserRepository::publicData($updated);
    }

    public function changePassword(int $userId, ChangePasswordDTO $dto): void
    {
        $user = $this->users->findById($userId);

        if ($user === null) {
            throw new NotFoundException('User');
        }

        if (!password_verify($dto->currentPassword, (string) $user['password'])) {
            throw new UnauthorizedException('Current password is incorrect');
        }

        $newHash = password_hash($dto->newPassword, PASSWORD_BCRYPT, ['cost' => 12]);

        $this->users->update($userId, ['password' => $newHash]);
    }
}
