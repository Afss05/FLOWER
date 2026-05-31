<?php

declare(strict_types=1);

namespace App\Controllers;

use App\DTOs\Auth\LoginDTO;
use App\DTOs\Auth\RegisterDTO;
use App\Repositories\UserRepository;
use App\Services\AuthService;
use App\Utils\Response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class AuthController
{
    public function __construct(private readonly AuthService $authService) {}

    public function register(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $dto    = RegisterDTO::fromArray((array) $request->getParsedBody());
        $result = $this->authService->register([
            'name'     => $dto->name,
            'email'    => $dto->email,
            'password' => $dto->password,
            'phone'    => $dto->phone,
        ]);

        return Response::success($response, $result, 'Registration successful', 201);
    }

    public function login(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $dto    = LoginDTO::fromArray((array) $request->getParsedBody());
        $result = $this->authService->login(['email' => $dto->email, 'password' => $dto->password]);

        return Response::success($response, $result, 'Login successful');
    }

    public function me(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $user = $request->getAttribute('user');

        if (!is_array($user) || empty($user['id'])) {
            return Response::error($response, 'Unauthorized', 401);
        }

        return Response::success($response, $user);
    }

    public function refresh(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $user = $request->getAttribute('user');

        if (!is_array($user) || empty($user['id'])) {
            return Response::error($response, 'Unauthorized', 401);
        }

        $token = $this->authService->refreshToken((int) $user['id']);

        return Response::success($response, ['token' => $token]);
    }
}
