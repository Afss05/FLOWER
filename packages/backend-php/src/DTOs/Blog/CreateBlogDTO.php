<?php

declare(strict_types=1);

namespace App\DTOs\Blog;

use App\Exceptions\ValidationException;

final class CreateBlogDTO
{
    private function __construct(
        public readonly string  $title,
        public readonly string  $content,
        public readonly ?string $excerpt,
        public readonly string  $category,
        public readonly ?string $imageUrl,
        public readonly bool    $isPublished,
    ) {}

    /** @param array<string,mixed> $raw */
    public static function fromArray(array $raw): self
    {
        $errors = [];

        $title = trim(strip_tags((string) ($raw['title'] ?? '')));
        if ($title === '') {
            $errors['title'] = 'Title is required';
        } elseif (mb_strlen($title) > 255) {
            $errors['title'] = 'Title must not exceed 255 characters';
        }

        $content = trim((string) ($raw['content'] ?? ''));
        if ($content === '') {
            $errors['content'] = 'Content is required';
        }

        // Validate image_url if provided
        $imageUrl = null;
        if (!empty($raw['image_url'])) {
            $u = trim((string) $raw['image_url']);
            if (!filter_var($u, FILTER_VALIDATE_URL)) {
                $errors['image_url'] = 'Image URL must be a valid URL';
            } else {
                $imageUrl = $u;
            }
        }

        if (!empty($errors)) {
            throw new ValidationException($errors);
        }

        return new self(
            title:       $title,
            content:     $content,
            excerpt:     !empty($raw['excerpt']) ? mb_substr(trim((string) $raw['excerpt']), 0, 500) : null,
            category:    mb_substr(trim(strip_tags((string) ($raw['category'] ?? 'general'))), 0, 50),
            imageUrl:    $imageUrl,
            isPublished: (bool) ($raw['is_published'] ?? true),
        );
    }

    /** @return array<string,mixed> */
    public function toArray(): array
    {
        return [
            'title'        => $this->title,
            'content'      => $this->content,
            'excerpt'      => $this->excerpt,
            'category'     => $this->category,
            'image_url'    => $this->imageUrl,
            'is_published' => $this->isPublished,
        ];
    }
}
