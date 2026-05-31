<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Exceptions\ValidationException;
use App\Services\AdminService;
use App\Utils\Response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class AdminController
{
    public function __construct(private readonly AdminService $adminService) {}

    public function dashboard(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        return Response::success($response, $this->adminService->getDashboardStats(), 'Dashboard data retrieved');
    }

    public function orders(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $params  = $request->getQueryParams();
        $page    = max(1, (int) ($params['page'] ?? 1));
        $limit   = min(100, max(1, (int) ($params['limit'] ?? 15)));
        $filters = [];

        if (!empty($params['status'])) {
            $filters['status'] = trim((string) $params['status']);
        }

        $result = $this->adminService->listOrders($page, $limit, $filters);
        return Response::paginated($response, $result['data'], $result['total'], $page, $limit, 'Orders retrieved');
    }

    public function updateOrderStatus(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $body   = (array) $request->getParsedBody();
        $status = trim((string) ($body['status'] ?? ''));

        if ($status === '') {
            throw new ValidationException(['status' => 'Status is required']);
        }

        $orderId = max(0, (int) ($args['id'] ?? 0));
        $order   = $this->adminService->updateOrderStatus($orderId, $status);
        return Response::success($response, $order, 'Order status updated');
    }

    public function customers(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $params = $request->getQueryParams();
        $page   = max(1, (int) ($params['page'] ?? 1));
        $limit  = min(100, max(1, (int) ($params['limit'] ?? 15)));

        $data = $this->adminService->listCustomers($page, $limit);
        return Response::paginated($response, $data, count($data), $page, $limit, 'Customers retrieved');
    }
}

