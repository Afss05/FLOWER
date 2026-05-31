<?php

declare(strict_types=1);

namespace App\Controllers;

use App\DTOs\User\ChangePasswordDTO;
use App\DTOs\User\UpdateProfileDTO;
use App\Exceptions\UnauthorizedException;
use App\Services\UserService;
use App\Utils\Response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class UserController
{
    public function __construct(private readonly UserService $userService) {}

    public function profile(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $userId = $this->resolveUserId($request);
        return Response::success($response, $this->userService->getProfile($userId));
    }

    public function updateProfile(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $userId = $this->resolveUserId($request);
        $dto    = UpdateProfileDTO::fromArray((array) $request->getParsedBody());
        $user   = $this->userService->updateProfile($userId, $dto);
        return Response::success($response, $user, 'Profile updated');
    }

    public function changePassword(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $userId = $this->resolveUserId($request);
        $dto    = ChangePasswordDTO::fromArray((array) $request->getParsedBody());
        $this->userService->changePassword($userId, $dto);
        return Response::success($response, null, 'Password changed successfully');
    }

    // -----------------------------------------------------------------------

    private function resolveUserId(ServerRequestInterface $request): int
    {
        $user = $request->getAttribute('user');
        if (!is_array($user) || empty($user['id'])) {
            throw new UnauthorizedException();
        }
        return (int) $user['id'];
    }
}
