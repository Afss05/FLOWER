<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\ConflictException;
use App\Exceptions\UnauthorizedException;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\UserRepository;
use Firebase\JWT\JWT;

final class AuthService
{
    public function __construct(private readonly UserRepositoryInterface $users) {}

    // -----------------------------------------------------------------------
    // Public API
    // -----------------------------------------------------------------------

    /**
     * @param array{name:string,email:string,password:string,phone?:string} $data
     * @return array{user:array<string,mixed>,token:string}
     */
    public function register(array $data): array
    {
        if ($this->users->findByEmail($data['email']) !== null) {
            throw new ConflictException('Email already registered');
        }

        $user  = $this->users->create($data);
        $token = $this->generateToken($user);

        return ['user' => UserRepository::publicData($user), 'token' => $token];
    }

    /**
     * @param array{email:string,password:string} $data
     * @return array{user:array<string,mixed>,token:string}
     */
    public function login(array $data): array
    {
        $user = $this->users->findByEmail($data['email']);

        // Constant-time comparison path — prevents timing-oracle attacks
        $dummyHash = '$2y$12$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
        $hash      = $user !== null ? (string) $user['password'] : $dummyHash;
        $valid     = password_verify($data['password'], $hash);

        if ($user === null || !$valid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        if (($user['status'] ?? '') !== 'active') {
            throw new UnauthorizedException('Account is not active');
        }

        return ['user' => UserRepository::publicData($user), 'token' => $this->generateToken($user)];
    }

    public function refreshToken(int $userId): string
    {
        $user = $this->users->findById($userId);

        if ($user === null) {
            throw new UnauthorizedException('User not found');
        }

        if (($user['status'] ?? '') !== 'active') {
            throw new UnauthorizedException('Account is not active');
        }

        return $this->generateToken($user);
    }

    // -----------------------------------------------------------------------
    // Internal
    // -----------------------------------------------------------------------

    /** @param array<string,mixed> $user */
    public function generateToken(array $user): string
    {
        $secret = $_ENV['JWT_SECRET'] ?? '';

        if (strlen($secret) < 32) {
            throw new \RuntimeException('JWT_SECRET must be at least 32 characters');
        }

        $expires = max(300, (int) ($_ENV['JWT_EXPIRES_IN'] ?? 604800));

        $payload = [
            'iss'      => $_ENV['APP_URL'] ?? 'flowershop',
            'id'       => (int) $user['id'],
            'email'    => (string) $user['email'],
            'role'     => (string) $user['role'],
            'tenantId' => (string) ($user['tenant_id'] ?? ($_ENV['CLIENT_ID'] ?? 'default')),
            'iat'      => time(),
            'exp'      => time() + $expires,
        ];

        return JWT::encode($payload, $secret, 'HS256');
    }
}
