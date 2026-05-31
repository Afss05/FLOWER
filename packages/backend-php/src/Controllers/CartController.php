<?php

declare(strict_types=1);

namespace App\Controllers;

use App\DTOs\Cart\AddCartItemDTO;
use App\DTOs\Cart\UpdateCartItemDTO;
use App\Services\CartService;
use App\Utils\Response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class CartController
{
    public function __construct(private readonly CartService $cartService) {}

    public function index(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $userId = $this->resolveUserId($request);
        return Response::success($response, $this->cartService->getCart($userId));
    }

    public function addItem(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $userId = $this->resolveUserId($request);
        $dto    = AddCartItemDTO::fromArray((array) $request->getParsedBody());
        $result = $this->cartService->addItem($userId, $dto);
        return Response::success($response, $result, 'Item added to cart', 201);
    }

    public function updateItem(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $userId = $this->resolveUserId($request);
        $itemId = max(0, (int) ($args['itemId'] ?? 0));
        $dto    = UpdateCartItemDTO::fromArray((array) $request->getParsedBody());
        $cart   = $this->cartService->updateItem($userId, $itemId, $dto);
        return Response::success($response, $cart, 'Cart updated');
    }

    public function removeItem(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $userId = $this->resolveUserId($request);
        $itemId = max(0, (int) ($args['itemId'] ?? 0));
        $cart   = $this->cartService->removeItem($userId, $itemId);
        return Response::success($response, $cart, 'Item removed');
    }

    public function clear(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $userId = $this->resolveUserId($request);
        $this->cartService->clearCart($userId);
        return Response::success($response, null, 'Cart cleared');
    }

    // -----------------------------------------------------------------------

    private function resolveUserId(ServerRequestInterface $request): int
    {
        $user = $request->getAttribute('user');
        if (!is_array($user) || empty($user['id'])) {
            throw new \App\Exceptions\UnauthorizedException();
        }
        return (int) $user['id'];
    }
}
