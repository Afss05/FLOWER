<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\Order\CreateOrderDTO;
use App\Exceptions\AppException;
use App\Exceptions\ForbiddenException;
use App\Exceptions\NotFoundException;
use App\Repositories\Contracts\CartRepositoryInterface;
use App\Repositories\Contracts\OrderRepositoryInterface;

final class OrderService
{
    private const CANCELLABLE_STATUSES = ['pending', 'confirmed'];

    public function __construct(
        private readonly OrderRepositoryInterface $orders,
        private readonly CartRepositoryInterface  $carts,
    ) {}

    public function listForUser(int $userId, int $page, int $limit): array
    {
        $page  = max(1, $page);
        $limit = min(50, max(1, $limit));
        return $this->orders->all($userId, $page, $limit);
    }

    public function getForUser(int $orderId, int $userId): array
    {
        if ($orderId <= 0) {
            throw new NotFoundException('Order');
        }

        $order = $this->orders->findById($orderId, $userId);

        if ($order === null) {
            throw new NotFoundException('Order');
        }

        return $order;
    }

    public function place(int $userId, CreateOrderDTO $dto): array
    {
        $cart = $this->carts->findOrCreateByUser($userId);

        if (empty($cart['items'])) {
            throw new AppException('Cart is empty', 422);
        }

        $items = array_map(
            static fn(array $i): array => [
                'product_id' => (int) $i['product_id'],
                'quantity'   => (int) $i['quantity'],
                'unit_price' => (float) $i['unit_price'],
            ],
            $cart['items']
        );

        $order = $this->orders->create($userId, $dto->toArray(), $items);

        // Clear cart after successful order placement
        $this->carts->clear((int) $cart['id']);

        return $order;
    }

    public function cancel(int $orderId, int $userId): array
    {
        $order = $this->orders->findById($orderId, $userId);

        if ($order === null) {
            throw new NotFoundException('Order');
        }

        if (!in_array($order['status'], self::CANCELLABLE_STATUSES, true)) {
            throw new AppException('Order cannot be cancelled at this stage', 422);
        }

        $updated = $this->orders->updateStatus($orderId, 'cancelled');

        if ($updated === null) {
            throw new NotFoundException('Order');
        }

        return $updated;
    }
}
