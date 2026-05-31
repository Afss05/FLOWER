<?php

declare(strict_types=1);

namespace App\Controllers;

use App\DTOs\Order\CreateOrderDTO;
use App\Exceptions\UnauthorizedException;
use App\Services\OrderService;
use App\Utils\Response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class OrderController
{
    public function __construct(private readonly OrderService $orderService) {}

    public function index(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $userId = $this->resolveUserId($request);
        $params = $request->getQueryParams();
        $page   = max(1, (int) ($params['page'] ?? 1));
        $limit  = min(50, max(1, (int) ($params['limit'] ?? 10)));

        $result = $this->orderService->listForUser($userId, $page, $limit);
        return Response::paginated($response, $result['data'], $result['total'], $page, $limit, 'Orders retrieved');
    }

    public function show(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $userId  = $this->resolveUserId($request);
        $orderId = max(0, (int) ($args['id'] ?? 0));
        $order   = $this->orderService->getForUser($orderId, $userId);
        return Response::success($response, $order);
    }

    public function store(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $userId = $this->resolveUserId($request);
        $dto    = CreateOrderDTO::fromArray((array) $request->getParsedBody());
        $order  = $this->orderService->place($userId, $dto);
        return Response::success($response, $order, 'Order placed successfully', 201);
    }

    public function cancel(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $userId  = $this->resolveUserId($request);
        $orderId = max(0, (int) ($args['id'] ?? 0));
        $order   = $this->orderService->cancel($orderId, $userId);
        return Response::success($response, $order, 'Order cancelled');
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
