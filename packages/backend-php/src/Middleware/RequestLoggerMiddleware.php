<?php

declare(strict_types=1);

namespace App\Middleware;

use Monolog\Logger;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

final class RequestLoggerMiddleware implements MiddlewareInterface
{
    public function __construct(private readonly Logger $logger) {}

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $start = microtime(true);

        $response = $handler->handle($request);

        $ms     = round((microtime(true) - $start) * 1000, 1);
        $status = $response->getStatusCode();
        $method = $request->getMethod();
        $path   = $request->getUri()->getPath();
        $ip     = $request->getServerParams()['REMOTE_ADDR'] ?? '-';

        $context = ['method' => $method, 'path' => $path, 'status' => $status, 'ms' => $ms, 'ip' => $ip];

        if ($status >= 500) {
            $this->logger->error("{$method} {$path} {$status} {$ms}ms", $context);
        } elseif ($status >= 400) {
            $this->logger->warning("{$method} {$path} {$status} {$ms}ms", $context);
        } else {
            $this->logger->info("{$method} {$path} {$status} {$ms}ms", $context);
        }

        return $response;
    }
}
