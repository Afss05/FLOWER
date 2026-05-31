<?php

declare(strict_types=1);

namespace App\Middleware;

use Firebase\JWT\ExpiredException;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\SignatureInvalidException;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\Psr7\Factory\ResponseFactory;

final class AuthMiddleware implements MiddlewareInterface
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $authHeader = $request->getHeaderLine('Authorization');

        if ($authHeader === '' || !str_starts_with($authHeader, 'Bearer ')) {
            return $this->unauthorized('Missing or invalid Authorization header');
        }

        $token = trim(substr($authHeader, 7));

        if ($token === '') {
            return $this->unauthorized('Token is empty');
        }

        $secret = $_ENV['JWT_SECRET'] ?? '';

        if (strlen($secret) < 32) {
            // Fail closed — misconfigured secret is a server error
            return $this->serverError('Authentication is not properly configured');
        }

        try {
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));
        } catch (ExpiredException) {
            return $this->unauthorized('Token has expired');
        } catch (SignatureInvalidException) {
            return $this->unauthorized('Token signature is invalid');
        } catch (\Throwable) {
            return $this->unauthorized('Invalid token');
        }

        // Strict type checks on every claim — no silent null fallback
        if (
            !isset($decoded->id, $decoded->email, $decoded->role)
            || !is_int($decoded->id)
            || !is_string($decoded->email)
            || !is_string($decoded->role)
            || $decoded->id <= 0
        ) {
            return $this->unauthorized('Token payload is malformed');
        }

        $request = $request->withAttribute('user', [
            'id'       => $decoded->id,
            'email'    => $decoded->email,
            'role'     => $decoded->role,
            'tenantId' => isset($decoded->tenantId) && is_string($decoded->tenantId)
                            ? $decoded->tenantId
                            : ($_ENV['CLIENT_ID'] ?? 'default'),
        ]);

        return $handler->handle($request);
    }

    // -----------------------------------------------------------------------

    private function unauthorized(string $message): ResponseInterface
    {
        return $this->jsonResponse(401, $message);
    }

    private function serverError(string $message): ResponseInterface
    {
        return $this->jsonResponse(500, $message);
    }

    private function jsonResponse(int $status, string $message): ResponseInterface
    {
        $factory  = new ResponseFactory();
        $response = $factory->createResponse($status);
        $response->getBody()->write(json_encode([
            'success' => false,
            'message' => $message,
        ], JSON_THROW_ON_ERROR));

        return $response->withHeader('Content-Type', 'application/json');
    }
}

