<?php

namespace App\Support;

/**
 * Shipping and total for a cart subtotal (all amounts in cents). Taxes are
 * not calculated yet.
 */
final class OrderTotals
{
    /**
     * @return array{subtotal: int, shipping: int, total: int, free_shipping_threshold: int}
     */
    public static function for(int $subtotal): array
    {
        $threshold = config('store.shipping.free_threshold');
        $shipping = $subtotal === 0 || $subtotal >= $threshold ? 0 : config('store.shipping.flat_rate');

        return [
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'total' => $subtotal + $shipping,
            'free_shipping_threshold' => $threshold,
        ];
    }
}
