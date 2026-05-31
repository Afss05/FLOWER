<?php

declare(strict_types=1);

namespace App\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\Psr7\Factory\ResponseFactory;

/**
 * Restrict route to specific roles.
 * Usage: new RoleMiddleware(['admin', 'super_admin'])
 */
class RoleMiddleware implements MiddlewareInterface
{
    public function __construct(private readonly array $roles) {}

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $user = $request->getAttribute('user');

        if (!$user) {
            return $this->forbidden('Not authenticated');
        }

        if (!in_array($user['role'], $this->roles, true)) {
            return $this->forbidden('Insufficient permissions');
        }

        return $handler->handle($request);
    }

    private function forbidden(string $message): ResponseInterface
    {
        $factory  = new ResponseFactory();
        $response = $factory->createResponse(403);
        $response->getBody()->write(json_encode([
            'success' => false,
            'message' => $message,
        ], JSON_THROW_ON_ERROR));

        return $response->withHeader('Content-Type', 'application/json');
    }
}
