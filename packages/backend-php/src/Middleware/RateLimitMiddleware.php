<?php

declare(strict_types=1);

namespace App\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\Psr7\Factory\ResponseFactory;

/**
 * Simple in-memory (APCu) or file-based rate limiter.
 * Limits: 120 requests / minute per IP (configurable).
 * Returns HTTP 429 on breach with Retry-After header.
 *
 * If APCu is unavailable the middleware is a no-op to ensure
 * the application still works in environments without APCu.
 */
final class RateLimitMiddleware implements MiddlewareInterface
{
    public function __construct(
        private readonly int $maxRequests = 120,
        private readonly int $windowSeconds = 60,
    ) {}

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        if (!extension_loaded('apcu') || !apcu_enabled()) {
            // APCu not available — skip rate limiting
            return $handler->handle($request);
        }

        $ip  = $this->resolveIp($request);
        $key = 'rl:' . md5($ip);

        $count = (int) apcu_fetch($key);

        if ($count === 0) {
            apcu_store($key, 1, $this->windowSeconds);
        } else {
            apcu_inc($key);
            $count++;
        }

        if ($count > $this->maxRequests) {
            $factory  = new ResponseFactory();
            $response = $factory->createResponse(429);
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Too many requests. Please slow down.',
            ], JSON_THROW_ON_ERROR));

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withHeader('Retry-After', (string) $this->windowSeconds)
                ->withHeader('X-RateLimit-Limit', (string) $this->maxRequests)
                ->withHeader('X-RateLimit-Remaining', '0');
        }

        $remaining = max(0, $this->maxRequests - $count);
        return $handler->handle($request)
            ->withHeader('X-RateLimit-Limit', (string) $this->maxRequests)
            ->withHeader('X-RateLimit-Remaining', (string) $remaining);
    }

    // -----------------------------------------------------------------------

    private function resolveIp(ServerRequestInterface $request): string
    {
        // Respect trusted proxy headers
        $trustedHeaders = ['X-Forwarded-For', 'X-Real-IP', 'CF-Connecting-IP'];

        foreach ($trustedHeaders as $header) {
            $value = $request->getHeaderLine($header);
            if ($value !== '') {
                // X-Forwarded-For may contain comma-separated list; take first
                $ip = trim(explode(',', $value)[0]);
                if (filter_var($ip, FILTER_VALIDATE_IP) !== false) {
                    return $ip;
                }
            }
        }

        $serverParams = $request->getServerParams();
        return (string) ($serverParams['REMOTE_ADDR'] ?? '0.0.0.0');
    }
}
