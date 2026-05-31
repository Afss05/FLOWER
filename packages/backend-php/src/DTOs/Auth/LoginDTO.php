<?php

declare(strict_types=1);

namespace App\DTOs\Auth;

use App\Exceptions\ValidationException;

final class LoginDTO
{
    private function __construct(
        public readonly string $email,
        public readonly string $password,
    ) {}

    /** @param array<string,mixed> $raw */
    public static function fromArray(array $raw): self
    {
        $errors = [];

        $email = mb_strtolower(trim((string) ($raw['email'] ?? '')));
        if ($email === '') {
            $errors['email'] = 'Email is required';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Invalid email address';
        }

        $password = (string) ($raw['password'] ?? '');
        if ($password === '') {
            $errors['password'] = 'Password is required';
        }

        if (!empty($errors)) {
            throw new ValidationException($errors);
        }

        return new self(email: $email, password: $password);
    }
}
