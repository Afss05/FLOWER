<?php

declare(strict_types=1);

namespace App\Controllers;

use App\DTOs\Product\CreateProductDTO;
use App\DTOs\Product\ProductFilterDTO;
use App\DTOs\Product\UpdateProductDTO;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use App\Services\ProductService;
use App\Utils\Response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class ProductController
{
    public function __construct(
        private readonly ProductService              $productService,
        private readonly CategoryRepositoryInterface $categories,
    ) {}

    public function index(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $dto    = ProductFilterDTO::fromQueryParams($request->getQueryParams());
        $result = $this->productService->getAll($dto);
        return Response::paginated($response, $result['data'], $result['total'], $result['page'], $result['limit'], 'Products retrieved');
    }

    public function show(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $id      = max(0, (int) ($args['id'] ?? 0));
        $product = $this->productService->getById($id);
        return Response::success($response, $product);
    }

    public function festivalSpecials(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        return Response::success($response, $this->productService->getFestivalSpecials(), 'Festival specials retrieved');
    }

    public function trending(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        return Response::success($response, $this->productService->getTrending(), 'Trending products retrieved');
    }

    public function search(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $params = $request->getQueryParams();
        $q      = trim((string) ($params['q'] ?? ''));

        if ($q === '') {
            return Response::success($response, []);
        }

        $dto    = ProductFilterDTO::fromQueryParams(array_merge($params, ['search' => $q]));
        $result = $this->productService->getAll($dto);
        return Response::paginated($response, $result['data'], $result['total'], $result['page'], $result['limit'], 'Search results');
    }

    public function categories(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        return Response::success($response, $this->categories->all(), 'Categories retrieved');
    }

    // ------------------------------------------------------------------
    // Admin endpoints
    // ------------------------------------------------------------------

    public function store(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $dto     = CreateProductDTO::fromArray((array) $request->getParsedBody());
        $product = $this->productService->create($dto->toArray());
        return Response::success($response, $product, 'Product created', 201);
    }

    public function update(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $id      = max(0, (int) ($args['id'] ?? 0));
        $dto     = UpdateProductDTO::fromArray((array) $request->getParsedBody());
        $product = $this->productService->update($id, $dto->toArray());
        return Response::success($response, $product, 'Product updated');
    }

    public function destroy(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $id = max(0, (int) ($args['id'] ?? 0));
        $this->productService->delete($id);
        return Response::success($response, null, 'Product deleted');
    }
}
