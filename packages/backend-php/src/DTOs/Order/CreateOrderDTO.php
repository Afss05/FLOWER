<?php

declare(strict_types=1);

namespace App\DTOs\Order;

use App\Exceptions\ValidationException;

final class CreateOrderDTO
{
    private function __construct(
        public readonly array   $address,
        public readonly ?string $deliveryDate,
        public readonly ?string $deliverySlot,
        public readonly ?string $notes,
    ) {}

    /** @param array<string,mixed> $raw */
    public static function fromArray(array $raw): self
    {
        $errors = [];

        // --- address ---
        $address = $raw['address'] ?? [];
        if (!is_array($address)) {
            $errors['address'] = 'Address must be an object';
        } else {
            $requiredAddressFields = ['street', 'city'];
            foreach ($requiredAddressFields as $field) {
                if (empty($address[$field])) {
                    $errors["address.{$field}"] = ucfirst($field) . ' is required';
                }
            }
            // Sanitize address fields
            $address = array_map(
                static fn($v) => is_string($v) ? mb_substr(trim(strip_tags($v)), 0, 200) : $v,
                $address
            );
        }

        // --- delivery_date (optional, YYYY-MM-DD) ---
        $deliveryDate = null;
        if (!empty($raw['delivery_date'])) {
            $d = trim((string) $raw['delivery_date']);
            if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $d)) {
                $errors['delivery_date'] = 'Delivery date must be in YYYY-MM-DD format';
            } else {
                $ts = strtotime($d);
                if ($ts === false || $ts < strtotime('today')) {
                    $errors['delivery_date'] = 'Delivery date must be today or in the future';
                } else {
                    $deliveryDate = $d;
                }
            }
        }

        // --- delivery_slot (optional) ---
        $deliverySlot = null;
        if (!empty($raw['delivery_slot'])) {
            $deliverySlot = mb_substr(trim(strip_tags((string) $raw['delivery_slot'])), 0, 50);
        }

        // --- notes (optional) ---
        $notes = null;
        if (!empty($raw['notes'])) {
            $notes = mb_substr(trim(strip_tags((string) $raw['notes'])), 0, 1000);
        }

        if (!empty($errors)) {
            throw new ValidationException($errors);
        }

        return new self(
            address:      is_array($address) ? $address : [],
            deliveryDate: $deliveryDate,
            deliverySlot: $deliverySlot,
            notes:        $notes,
        );
    }

    /** @return array<string,mixed> */
    public function toArray(): array
    {
        return [
            'address'       => $this->address,
            'delivery_date' => $this->deliveryDate,
            'delivery_slot' => $this->deliverySlot,
            'notes'         => $this->notes,
        ];
    }
}
