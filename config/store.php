<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cart
    |--------------------------------------------------------------------------
    |
    | The cart lives in an encrypted cookie so it survives session expiry and
    | browser restarts.
    |
    */

    'cart' => [
        'cookie' => 'cart',
        'lifetime_days' => (int) env('CART_LIFETIME_DAYS', 30),
    ],

    /*
    |--------------------------------------------------------------------------
    | Shipping
    |--------------------------------------------------------------------------
    |
    | Amounts are in cents. Orders at or above the threshold ship free (as on
    | the 70mai store); the flat rate below it is a placeholder to replace
    | with real rates.
    |
    */

    'shipping' => [
        'free_threshold' => (int) env('SHIPPING_FREE_THRESHOLD', 9900),
        'flat_rate' => (int) env('SHIPPING_FLAT_RATE', 999),
    ],

    'countries' => [
        'US' => 'United States',
        'CA' => 'Canada',
        'AU' => 'Australia',
        'KR' => 'South Korea',
    ],

];
