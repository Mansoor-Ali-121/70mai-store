<?php

namespace App\Support;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;

/**
 * Cart of variant id => quantity, kept in a long-lived encrypted cookie so it
 * outlives the session. Line details are resolved from the catalogue on read,
 * so prices are always current. Bound as a scoped singleton: one instance per
 * request, shared by controllers and the Inertia middleware.
 */
class Cart
{
    public const MAX_QUANTITY = 99;

    /** @var array<int, int> */
    private array $items;

    public function __construct(Request $request, private ProductCatalog $catalog)
    {
        $this->items = $this->decode($request->cookie(config('store.cart.cookie')));
    }

    public function add(int $variantId, int $quantity): void
    {
        $this->items[$variantId] = min(self::MAX_QUANTITY, ($this->items[$variantId] ?? 0) + $quantity);
        $this->persist();
    }

    public function update(int $variantId, int $quantity): void
    {
        if (! isset($this->items[$variantId])) {
            return;
        }

        if ($quantity < 1) {
            unset($this->items[$variantId]);
        } else {
            $this->items[$variantId] = min(self::MAX_QUANTITY, $quantity);
        }

        $this->persist();
    }

    public function remove(int $variantId): void
    {
        $this->update($variantId, 0);
    }

    public function clear(): void
    {
        $this->items = [];
        Cookie::queue(Cookie::forget(config('store.cart.cookie')));
    }

    public function count(): int
    {
        return array_sum($this->items);
    }

    public function isEmpty(): bool
    {
        return $this->items === [];
    }

    /**
     * Cart lines with product details. Variants no longer in the catalogue are skipped.
     *
     * @return list<array<string, mixed>>
     */
    public function lines(): array
    {
        $lines = [];

        foreach ($this->items as $variantId => $quantity) {
            $variant = $this->catalog->findVariant($variantId);

            if ($variant !== null) {
                $lines[] = [...$variant, 'quantity' => $quantity, 'line_total' => $variant['price'] * $quantity];
            }
        }

        return $lines;
    }

    /**
     * @param  list<array<string, mixed>>|null  $lines
     */
    public function subtotal(?array $lines = null): int
    {
        return array_sum(array_column($lines ?? $this->lines(), 'line_total'));
    }

    private function persist(): void
    {
        if ($this->items === []) {
            $this->clear();

            return;
        }

        Cookie::queue(
            config('store.cart.cookie'),
            json_encode($this->items),
            config('store.cart.lifetime_days') * 24 * 60,
        );
    }

    /**
     * Parse the cookie defensively: anything malformed is treated as an empty cart.
     *
     * @return array<int, int>
     */
    private function decode(mixed $value): array
    {
        $data = is_string($value) ? json_decode($value, true) : null;

        if (! is_array($data)) {
            return [];
        }

        $items = [];
        foreach ($data as $variantId => $quantity) {
            if (ctype_digit((string) $variantId) && is_int($quantity) && $quantity > 0) {
                $items[(int) $variantId] = min(self::MAX_QUANTITY, $quantity);
            }
        }

        return $items;
    }
}
