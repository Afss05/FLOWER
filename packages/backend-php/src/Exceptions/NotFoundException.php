<?php

declare(strict_types=1);

namespace App\Exceptions;

final class NotFoundException extends AppException
{
    public function __construct(string $resource = 'Resource')
    {
        parent::__construct("{$resource} not found", 404);
    }
}
