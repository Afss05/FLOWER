<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Exceptions\ValidationException;
use App\Utils\Response;
use PDO;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class SubscriptionController
{
    public function __construct(private PDO $db) {}

    private function tenantId(): string
    {
        return $_ENV['CLIENT_ID'] ?? 'default';
    }

    public function index(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $userId = $request->getAttribute('user')['id'];
        $stmt   = $this->db->prepare('SELECT * FROM subscriptions WHERE user_id = ? AND tenant_id = ? ORDER BY created_at DESC');
        $stmt->execute([$userId, $this->tenantId()]);
        return Response::success($response, $stmt->fetchAll(), 'Subscriptions retrieved');
    }

    public function store(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $user = $request->getAttribute('user');
        $body = (array) $request->getParsedBody();

        if (empty($body['plan']))    throw new ValidationException(['plan' => 'Plan is required']);
        if (empty($body['address'])) throw new ValidationException(['address' => 'Delivery address is required']);

        $stmt = $this->db->prepare('
            INSERT INTO subscriptions
              (tenant_id, user_id, plan, delivery_days, address, status, starts_at, created_at, updated_at)
            VALUES (?,?,?,?,?,?,?,NOW(),NOW())
        ');
        $stmt->execute([
            $this->tenantId(),
            $user['id'],
            $body['plan'],
            json_encode($body['delivery_days'] ?? []),
            json_encode($body['address']),
            'active',
            $body['starts_at'] ?? date('Y-m-d'),
        ]);

        $id   = (int) $this->db->lastInsertId();
        $sub  = $this->db->prepare('SELECT * FROM subscriptions WHERE id = ?');
        $sub->execute([$id]);

        return Response::success($response, $sub->fetch(), 'Subscription created', 201);
    }

    public function cancel(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $userId = $request->getAttribute('user')['id'];
        $this->db->prepare('UPDATE subscriptions SET status = ?, updated_at = NOW() WHERE id = ? AND user_id = ?')
                 ->execute(['cancelled', $args['id'], $userId]);

        return Response::success($response, null, 'Subscription cancelled');
    }
}
