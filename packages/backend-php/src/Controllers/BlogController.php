<?php

declare(strict_types=1);

namespace App\Controllers;

use App\DTOs\Blog\CreateBlogDTO;
use App\Exceptions\UnauthorizedException;
use App\Services\BlogService;
use App\Utils\Response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class BlogController
{
    public function __construct(private readonly BlogService $blogService) {}

    public function index(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $result = $this->blogService->list($request->getQueryParams());
        return Response::paginated($response, $result['data'], $result['total'], $result['page'], $result['limit'], 'Blog posts retrieved');
    }

    public function show(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $slug = trim((string) ($args['slug'] ?? ''));
        $post = $this->blogService->getBySlug($slug);
        return Response::success($response, $post);
    }

    public function store(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $user = $request->getAttribute('user');
        if (!is_array($user) || empty($user['id'])) {
            throw new UnauthorizedException();
        }

        $dto  = CreateBlogDTO::fromArray((array) $request->getParsedBody());
        $post = $this->blogService->create($dto, (int) $user['id']);
        return Response::success($response, $post, 'Blog post created', 201);
    }
}
