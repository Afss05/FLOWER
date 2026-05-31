<?php

declare(strict_types=1);

use App\Middleware\CorsMiddleware;
use App\Middleware\RateLimitMiddleware;
use App\Middleware\SecurityHeadersMiddleware;
use Slim\App;

return function (App $app): void {
    // 1. Security headers on every response
    $app->add(SecurityHeadersMiddleware::class);

    // 2. Rate limiting (120 req/min per IP; no-op if APCu unavailable)
    $app->add(RateLimitMiddleware::class);

    // 3. CORS (must be last so it runs first in the middleware stack)
    $app->add(CorsMiddleware::class);
};

