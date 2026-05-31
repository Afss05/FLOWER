<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\Blog\CreateBlogDTO;
use App\Exceptions\NotFoundException;
use App\Repositories\Contracts\BlogRepositoryInterface;

final class BlogService
{
    public function __construct(private readonly BlogRepositoryInterface $blogs) {}

    public function list(array $queryParams): array
    {
        $page  = max(1, (int) ($queryParams['page'] ?? 1));
        $limit = min(50, max(1, (int) ($queryParams['limit'] ?? 10)));

        $filters = [];

        if (!empty($queryParams['category'])) {
            $filters['category'] = trim(strip_tags((string) $queryParams['category']));
        }

        if (!empty($queryParams['search'])) {
            $filters['search'] = trim(strip_tags((string) $queryParams['search']));
        }

        return $this->blogs->all($filters, $page, $limit);
    }

    public function getBySlug(string $slug): array
    {
        $slug = trim($slug);

        if ($slug === '') {
            throw new NotFoundException('Blog post');
        }

        $post = $this->blogs->findBySlug($slug);

        if ($post === null) {
            throw new NotFoundException('Blog post');
        }

        return $post;
    }

    public function create(CreateBlogDTO $dto, int $authorId): array
    {
        return $this->blogs->create($dto->toArray(), $authorId);
    }
}
