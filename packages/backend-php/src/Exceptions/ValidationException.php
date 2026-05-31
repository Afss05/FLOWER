<?php

declare(strict_types=1);

namespace App\Exceptions;

final class ValidationException extends AppException
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
