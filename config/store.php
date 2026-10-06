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

    /*
    |--------------------------------------------------------------------------
    | Merchandising
    |--------------------------------------------------------------------------
    |
    | Lunar collection slugs that drive the storefront: the header/footer menus
    | list `navigation` collections (with their products), and the homepage
    | "Explore by Series" tabs come from `homepage_series`.
    |
    */

    'navigation' => ['dash-cams', 'accessories', 'hardwire-kits'],

    'homepage_series' => 'explore-by-series',

    // Number of interest-free installments advertised on product pages (0 to hide).
    'installments' => (int) env('STORE_INSTALLMENTS', 4),

    /*
    |--------------------------------------------------------------------------
    | Seeding
    |--------------------------------------------------------------------------
    |
    | Whether LunarProductSeeder downloads product images from the 70mai CDN.
    |
    */

    'seed_product_images' => (bool) env('SEED_PRODUCT_IMAGES', true),

    'countries' => [
        'US' => 'United States',
        'CA' => 'Canada',
        'AU' => 'Australia',
        'KR' => 'South Korea',
    ],

];
