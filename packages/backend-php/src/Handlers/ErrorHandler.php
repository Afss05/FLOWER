<?php

declare(strict_types=1);

namespace App\Handlers;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Exception\HttpNotFoundException;
use Slim\Exception\HttpMethodNotAllowedException;
use Slim\Handlers\ErrorHandler as SlimErrorHandler;
use Throwable;

class ErrorHandler extends SlimErrorHandler
{
    protected function respond(): ResponseInterface
    {
        $exception  = $this->exception;
        $statusCode = 500;
        $message    = 'Internal Server Error';

        if ($exception instanceof HttpNotFoundException) {
            $statusCode = 404;
            $message    = 'Route not found';
        } elseif ($exception instanceof HttpMethodNotAllowedException) {
            $statusCode = 405;
            $message    = 'Method not allowed';
        } elseif ($exception instanceof \App\Exceptions\AppException) {
            $statusCode = $exception->getStatusCode();
            $message    = $exception->getMessage();
        } elseif ($exception instanceof \InvalidArgumentException) {
            $statusCode = 400;
            $message    = $exception->getMessage();
        }

        $response = $this->responseFactory->createResponse($statusCode);

        $payload = ['success' => false, 'message' => $message];

        if ($this->displayErrorDetails && $statusCode === 500) {
            $payload['debug'] = [
                'exception' => get_class($exception),
                'file'      => $exception->getFile(),
                'line'      => $exception->getLine(),
                'trace'     => $exception->getTraceAsString(),
            ];
        }

        $response->getBody()->write(json_encode($payload, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE));

        return $response->withHeader('Content-Type', 'application/json');
    }
}
