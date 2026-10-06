<?php

namespace App\Storefront\Shipping;

use Closure;
use Lunar\Base\ShippingModifier;
use Lunar\DataTypes\Price;
use Lunar\DataTypes\ShippingOption;
use Lunar\Facades\Pricing;
use Lunar\Facades\ShippingManifest;
use Lunar\Models\Contracts\Cart;
use Lunar\Models\TaxClass;

/**
 * Single shipping option: free at or above the threshold, flat rate below it
 * (see config/store.php). Lunar adds the chosen option to the cart totals.
 */
class StandardShipping extends ShippingModifier
{
    public const IDENTIFIER = 'standard';

    public function handle(Cart $cart, Closure $next)
    {
        $free = $this->merchandiseTotal($cart) >= config('store.shipping.free_threshold');

        ShippingManifest::clearOptions();
        ShippingManifest::addOption(new ShippingOption(
            name: $free ? 'Free shipping' : 'Standard shipping',
            description: 'Ships within 2 working days',
            identifier: self::IDENTIFIER,
            price: new Price($free ? 0 : config('store.shipping.flat_rate'), $cart->currency, 1),
            taxClass: TaxClass::getDefault(),
        ));

        return $next($cart);
    }

    /**
     * Uses calculated line totals when available, otherwise prices the lines directly
     * (modifiers can run before the cart has been calculated).
     */
    private function merchandiseTotal(Cart $cart): int
    {
        return $cart->lines->sum(fn ($line) => $line->subTotal?->value
            ?? Pricing::for($line->purchasable)->qty($line->quantity)->get()->matched->price->value * $line->quantity);
    }
}
