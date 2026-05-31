<?php

declare(strict_types=1);

namespace App\DTOs\Auth;

use App\Exceptions\ValidationException;

final class RegisterDTO
{
    private function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly string $password,
        public readonly string $phone,
    ) {}

    /** @param array<string,mixed> $raw */
    public static function fromArray(array $raw): self
    {
        $errors = [];

        // --- name ---
        $name = trim(strip_tags((string) ($raw['name'] ?? '')));
        if ($name === '') {
            $errors['name'] = 'Name is required';
        } elseif (mb_strlen($name) < 2) {
            $errors['name'] = 'Name must be at least 2 characters';
        } elseif (mb_strlen($name) > 100) {
            $errors['name'] = 'Name must not exceed 100 characters';
        }

        // --- email ---
        $email = mb_strtolower(trim((string) ($raw['email'] ?? '')));
        if ($email === '') {
            $errors['email'] = 'Email is required';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Invalid email address';
        } elseif (mb_strlen($email) > 255) {
            $errors['email'] = 'Email too long';
        }

        // --- password ---
        $password = (string) ($raw['password'] ?? '');
        if ($password === '') {
            $errors['password'] = 'Password is required';
        } elseif (strlen($password) < 8) {
            $errors['password'] = 'Password must be at least 8 characters';
        } elseif (strlen($password) > 128) {
            $errors['password'] = 'Password too long';
        } elseif (!preg_match('/[A-Z]/', $password)) {
            $errors['password'] = 'Password must contain at least one uppercase letter';
        } elseif (!preg_match('/[0-9]/', $password)) {
            $errors['password'] = 'Password must contain at least one number';
        }

        // --- phone (optional) ---
        $phone = trim((string) ($raw['phone'] ?? ''));
        if ($phone !== '' && !preg_match('/^\+?[0-9\s\-]{7,20}$/', $phone)) {
            $errors['phone'] = 'Invalid phone number format';
        }

        if (!empty($errors)) {
            throw new ValidationException($errors);
        }

        return new self(
            name:     $name,
            email:    $email,
            password: $password,
            phone:    $phone,
        );
    }
}
