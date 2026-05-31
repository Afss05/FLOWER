<?php

declare(strict_types=1);

namespace App\DTOs\Product;

/** Immutable filter bag for product listing. All values are pre-sanitized. */
final class ProductFilterDTO
{
    private function __construct(
        public readonly int     $page,
        public readonly int     $limit,
        public readonly ?int    $categoryId,
        public readonly ?string $search,
        public readonly bool    $festivalSpecial,
        public readonly bool    $seasonal,
        public readonly ?float  $minPrice,
        public readonly ?float  $maxPrice,
        public readonly bool    $inStock,
    ) {}

    /** @param array<string,mixed> $params  Query-string params */
    public static function fromQueryParams(array $params): self
    {
        $page  = max(1, (int) ($params['page'] ?? 1));
        $limit = min(100, max(1, (int) ($params['limit'] ?? 15)));

        $search = null;
        if (!empty($params['search'])) {
            $raw    = trim(strip_tags((string) $params['search']));
            $search = $raw !== '' ? mb_substr($raw, 0, 200) : null;
        }

        $categoryId = null;
        if (!empty($params['categoryId']) && is_numeric($params['categoryId'])) {
            $categoryId = (int) $params['categoryId'];
            if ($categoryId <= 0) {
                $categoryId = null;
            }
        }

        $minPrice = null;
        if (isset($params['minPrice']) && is_numeric($params['minPrice'])) {
            $v = (float) $params['minPrice'];
            if ($v >= 0) {
                $minPrice = $v;
            }
        }

        $maxPrice = null;
        if (isset($params['maxPrice']) && is_numeric($params['maxPrice'])) {
            $v = (float) $params['maxPrice'];
            if ($v >= 0) {
                $maxPrice = $v;
            }
        }

        return new self(
            page:            $page,
            limit:           $limit,
            categoryId:      $categoryId,
            search:          $search,
            festivalSpecial: ($params['festival'] ?? '') === 'true',
            seasonal:        ($params['seasonal'] ?? '') === 'true',
            minPrice:        $minPrice,
            maxPrice:        $maxPrice,
            inStock:         ($params['inStock'] ?? '') === 'true',
        );
    }

    /** @return array<string,mixed> */
    public function toFilters(): array
    {
        $filters = [];

        if ($this->categoryId !== null)    $filters['category_id']         = $this->categoryId;
        if ($this->search !== null)        $filters['search']               = $this->search;
        if ($this->festivalSpecial)        $filters['is_festival_special']  = true;
        if ($this->seasonal)               $filters['is_seasonal']          = true;
        if ($this->minPrice !== null)      $filters['min_price']            = $this->minPrice;
        if ($this->maxPrice !== null)      $filters['max_price']            = $this->maxPrice;
        if ($this->inStock)                $filters['in_stock']             = true;

        return $filters;
    }
}
