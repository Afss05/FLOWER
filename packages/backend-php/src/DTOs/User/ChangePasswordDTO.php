<?php

declare(strict_types=1);

namespace App\DTOs\User;

use App\Exceptions\ValidationException;

final class ChangePasswordDTO
{
    private function __construct(
        public readonly string $currentPassword,
        public readonly string $newPassword,
    ) {}

    /** @param array<string,mixed> $raw */
    public static function fromArray(array $raw): self
    {
        $errors = [];

        $current = (string) ($raw['current_password'] ?? '');
        if ($current === '') {
            $errors['current_password'] = 'Current password is required';
        }

        $newPass = (string) ($raw['new_password'] ?? '');
        if ($newPass === '') {
            $errors['new_password'] = 'New password is required';
        } elseif (strlen($newPass) < 8) {
            $errors['new_password'] = 'New password must be at least 8 characters';
        } elseif (strlen($newPass) > 128) {
            $errors['new_password'] = 'New password too long';
        } elseif (!preg_match('/[A-Z]/', $newPass)) {
            $errors['new_password'] = 'New password must contain at least one uppercase letter';
        } elseif (!preg_match('/[0-9]/', $newPass)) {
            $errors['new_password'] = 'New password must contain at least one number';
        } elseif ($current !== '' && $current === $newPass) {
            $errors['new_password'] = 'New password must be different from current password';
        }

        if (!empty($errors)) {
            throw new ValidationException($errors);
        }

        return new self(currentPassword: $current, newPassword: $newPass);
    }
}
