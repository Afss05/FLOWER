<?php

declare(strict_types=1);

namespace App\Utils;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class Response
{
    public static function success(
        ResponseInterface $response,
        mixed $data,
        string $message = 'Success',
        int $status = 200
    ): ResponseInterface {
        $response->getBody()->write(json_encode([
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ], JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE));

        return $response
            ->withStatus($status)
            ->withHeader('Content-Type', 'application/json');
    }

    public static function paginated(
        ResponseInterface $response,
        array $data,
        int $total,
        int $page,
        int $limit,
        string $message = 'Success'
    ): ResponseInterface {
        $response->getBody()->write(json_encode([
            'success' => true,
            'message' => $message,
            'data'    => [
                'data'       => $data,
                'total'      => $total,
                'page'       => $page,
                'limit'      => $limit,
                'totalPages' => (int) ceil($total / $limit),
            ],
        ], JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE));

        return $response
            ->withStatus(200)
            ->withHeader('Content-Type', 'application/json');
    }

    public static function error(
        ResponseInterface $response,
        string $message,
        int $status = 500,
        mixed $errors = null
    ): ResponseInterface {
        $payload = ['success' => false, 'message' => $message];
        if ($errors !== null) {
            $payload['errors'] = $errors;
        }

        $response->getBody()->write(json_encode($payload, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE));

        return $response
            ->withStatus($status)
            ->withHeader('Content-Type', 'application/json');
    }

    public static function pagination(ServerRequestInterface $request, int $default = 15): array
    {
        $params = $request->getQueryParams();
        $page   = max(1, (int) ($params['page'] ?? 1));
        $limit  = min(100, max(1, (int) ($params['limit'] ?? $default)));
        $offset = ($page - 1) * $limit;

        return compact('page', 'limit', 'offset');
    }
}
