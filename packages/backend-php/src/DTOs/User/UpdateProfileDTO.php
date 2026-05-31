<?php

declare(strict_types=1);

namespace App\DTOs\User;

use App\Exceptions\ValidationException;

final class UpdateProfileDTO
{
    private function __construct(
        public readonly ?string $name,
        public readonly ?string $phone,
        public readonly ?string $email,
    ) {}

    /** @param array<string,mixed> $raw */
    public static function fromArray(array $raw): self
    {
        $errors = [];
        $name   = null;
        $phone  = null;
        $email  = null;

        if (array_key_exists('name', $raw)) {
            $v = trim(strip_tags((string) $raw['name']));
            if ($v === '') {
                $errors['name'] = 'Name must not be empty';
            } elseif (mb_strlen($v) < 2) {
                $errors['name'] = 'Name must be at least 2 characters';
            } elseif (mb_strlen($v) > 100) {
                $errors['name'] = 'Name must not exceed 100 characters';
            } else {
                $name = $v;
            }
        }

        if (array_key_exists('phone', $raw)) {
            $v = trim((string) $raw['phone']);
            if ($v !== '' && !preg_match('/^\+?[0-9\s\-]{7,20}$/', $v)) {
                $errors['phone'] = 'Invalid phone number format';
            } else {
                $phone = $v !== '' ? $v : null;
            }
        }

        if (array_key_exists('email', $raw)) {
            $v = mb_strtolower(trim((string) $raw['email']));
            if ($v === '') {
                $errors['email'] = 'Email must not be empty';
            } elseif (!filter_var($v, FILTER_VALIDATE_EMAIL)) {
                $errors['email'] = 'Invalid email address';
            } elseif (mb_strlen($v) > 255) {
                $errors['email'] = 'Email too long';
            } else {
                $email = $v;
            }
        }

        if (!empty($errors)) {
            throw new ValidationException($errors);
        }

        return new self(name: $name, phone: $phone, email: $email);
    }

    /** @return array<string,mixed> */
    public function toArray(): array
    {
        $data = [];
        if ($this->name  !== null) $data['name']  = $this->name;
        if ($this->phone !== null) $data['phone'] = $this->phone;
        if ($this->email !== null) $data['email'] = $this->email;
        return $data;
    }

    public function isEmpty(): bool
    {
        return $this->name === null && $this->phone === null && $this->email === null;
    }
}
