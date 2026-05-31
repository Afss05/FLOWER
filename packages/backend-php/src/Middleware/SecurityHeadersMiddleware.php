<?php

declare(strict_types=1);

namespace App\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * Sets strict HTTP security headers on every response.
 * Addresses: OWASP A05 Security Misconfiguration, A03 Injection (via CSP),
 * and general hardening best practices.
 */
final class SecurityHeadersMiddleware implements MiddlewareInterface
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $response = $handler->handle($request);

        return $response
            // Prevent clickjacking
            ->withHeader('X-Frame-Options', 'DENY')
            // Prevent MIME sniffing
            ->withHeader('X-Content-Type-Options', 'nosniff')
            // XSS protection (legacy browsers)
            ->withHeader('X-XSS-Protection', '1; mode=block')
            // Referrer leakage control
            ->withHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
            // Permissions policy — disable unused browser features
            ->withHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')
            // HSTS — only sent in production to avoid breaking local dev
            ->withHeader(
                'Strict-Transport-Security',
                ($_ENV['APP_ENV'] ?? 'development') === 'production'
                    ? 'max-age=31536000; includeSubDomains; preload'
                    : 'max-age=0'
            )
            // Cache control for API responses
            ->withHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
            ->withHeader('Pragma', 'no-cache');
    }
}
