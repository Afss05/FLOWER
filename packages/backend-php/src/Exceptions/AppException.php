<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

class AppException extends RuntimeException
{
    public function __construct(string $message, private readonly int $statusCode = 500)
    {
        parent::__construct($message);
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }
}

class NotFoundException extends AppException
{
    public function __construct(string $resource = 'Resource')
    {
        parent::__construct("{$resource} not found", 404);
    }
}

class UnauthorizedException extends AppException
{
    public function __construct(string $message = 'Unauthorized')
    {
        parent::__construct($message, 401);
    }
}

class ForbiddenException extends AppException
{
    public function __construct(string $message = 'Forbidden')
    {
        parent::__construct($message, 403);
    }
}

class ConflictException extends AppException
{
    public function __construct(string $message = 'Conflict')
    {
        parent::__construct($message, 409);
    }
}

class ValidationException extends AppException
{
    private array $errors;

    public function __construct(array $errors)
    {
        parent::__construct('Validation failed', 422);
        $this->errors = $errors;
    }

    public function getErrors(): array
    {
        return $this->errors;
    }
}
