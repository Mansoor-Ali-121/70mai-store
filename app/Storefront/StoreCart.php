<?php

namespace App\Storefront;

use App\Storefront\Exceptions\InsufficientStock;
use App\Storefront\Shipping\StandardShipping;
use Lunar\DataTypes\ShippingOption;
use Lunar\Exceptions\Carts\CartException;
use Lunar\Facades\CartSession;
use Lunar\Facades\Pricing;
use Lunar\Facades\ShippingManifest;
use Lunar\Models\Cart;
use Lunar\Models\CartLine;
use Lunar\Models\Currency;
use Lunar\Models\ProductVariant;

/**
 * Storefront cart on top of Lunar's CartSession. Lunar stores the cart, merges
 * lines, validates stock and calculates every total; this class only enforces
 * the per-line quantity cap and shapes cart data for the pages.
 */
class StoreCart
{
    public const MAX_QUANTITY = 99;

    public function current(): ?Cart
    {
        return CartSession::current();
    }

    /**
     * Item count for the header badge, without running the full calculation.
     */
    public function count(): int
    {
        return (int) CartSession::current(calculate: false)?->lines()->sum('quantity');
    }

    /**
     * Lunar validates stock for the quantity being added only, so the line's
     * running total is checked here against the variant's available stock.
     *
     * @throws InsufficientStock when the line would exceed available stock
     * @throws CartException when Lunar rejects the line
     */
    public function add(ProductVariant $variant, int $quantity): void
    {
        $cart = CartSession::manager();
        $inCart = $this->lineFor($cart, $variant)?->quantity ?? 0;
        $remaining = ProductPresenter::maxQuantity($variant) - $inCart;

        if ($quantity > $remaining) {
            throw new InsufficientStock($variant->product->translateAttribute('name'), max(0, $remaining));
        }

        $cart->add($variant, $quantity);
    }

    /**
     * Quantity 0 removes the line; quantities are capped at available stock.
     * Lines outside the current cart are ignored.
     */
    public function updateLine(int $lineId, int $quantity): void
    {
        $cart = CartSession::current(calculate: false);
        $line = $cart?->lines->firstWhere('id', $lineId);

        if (! $line) {
            return;
        }

        if ($quantity < 1) {
            $cart->remove($lineId);
        } else {
            $cart->updateLine($lineId, min($quantity, max(1, ProductPresenter::maxQuantity($line->purchasable))));
        }
    }

    public function removeLine(int $lineId): void
    {
        $this->updateLine($lineId, 0);
    }

    public function shippingOption(Cart $cart): ?ShippingOption
    {
        return ShippingManifest::getOption($cart, StandardShipping::IDENTIFIER);
    }

    /**
     * Calculated lines and totals (all amounts in cents).
     *
     * @return array{lines: list<array<string, mixed>>, subtotal: int, tax: int, total: int, currency: string}
     */
    public function summary(?Cart $cart = null): array
    {
        $cart ??= $this->current();

        if (! $cart || $cart->lines->isEmpty()) {
            return ['lines' => [], 'subtotal' => 0, 'tax' => 0, 'total' => 0, 'currency' => Currency::getDefault()->code];
        }

        $cart->lines->load([
            'purchasable.product.urls',
            'purchasable.product.images',
            'purchasable.images',
            'purchasable.values',
            'purchasable.prices',
        ]);

        return [
            'lines' => $cart->lines->map(fn (CartLine $line) => $this->presentLine($line))->values()->all(),
            'subtotal' => $cart->subTotal->value,
            'tax' => $cart->taxTotal->value,
            'total' => $cart->total->value,
            'currency' => $cart->currency->code,
        ];
    }

    private function presentLine(CartLine $line): array
    {
        /** @var ProductVariant $variant */
        $variant = $line->purchasable;
        $product = $variant->product;
        $media = $variant->images->first() ?? $product->images->sortBy('order_column')->first();
        $compare = Pricing::for($variant)->qty(1)->get()->matched->compare_price?->value;
        $slug = ($product->urls->firstWhere('default', true) ?? $product->urls->first())?->slug;

        return [
            'id' => $line->id,
            'variant_id' => $variant->id,
            'name' => $product->translateAttribute('name'),
            'variant_title' => ProductPresenter::variantTitle($variant),
            'image' => $media ? ProductPresenter::mediaUrl($media, 'small') : null,
            'url' => $slug ? "/products/{$slug}" : null,
            'price' => $line->unitPrice->value,
            'compare_at_price' => $compare > $line->unitPrice->value ? $compare : null,
            'quantity' => $line->quantity,
            'line_total' => $line->subTotal->value,
            'available' => ProductPresenter::isAvailable($variant),
            // The stepper can't go above stock (never below what's already in the cart).
            'max_quantity' => max($line->quantity, ProductPresenter::maxQuantity($variant)),
        ];
    }

    private function lineFor(Cart $cart, ProductVariant $variant): ?CartLine
    {
        return $cart->lines->first(
            fn (CartLine $line) => $line->purchasable_type === $variant->getMorphClass() && (int) $line->purchasable_id === $variant->id
        );
    }
}
