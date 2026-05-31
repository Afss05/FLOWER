<?php

declare(strict_types=1);

namespace App\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\Psr7\Factory\ResponseFactory;

class CorsMiddleware implements MiddlewareInterface
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $allowedOrigins = explode(',', $_ENV['CORS_ORIGIN'] ?? 'http://localhost:5173');
        $origin = $request->getHeaderLine('Origin');

        // Handle preflight
        if ($request->getMethod() === 'OPTIONS') {
            $factory = new ResponseFactory();
            $response = $factory->createResponse(200);
            return $this->addCorsHeaders($response, $origin, $allowedOrigins);
        }

        $response = $handler->handle($request);
        return $this->addCorsHeaders($response, $origin, $allowedOrigins);
    }

    private function addCorsHeaders(ResponseInterface $response, string $origin, array $allowed): ResponseInterface
    {
        $originHeader = in_array($origin, $allowed, true) ? $origin : ($allowed[0] ?? '*');

        return $response
            ->withHeader('Access-Control-Allow-Origin', $originHeader)
            ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
            ->withHeader('Access-Control-Allow-Credentials', 'true')
            ->withHeader('Access-Control-Max-Age', '86400');
    }
}
