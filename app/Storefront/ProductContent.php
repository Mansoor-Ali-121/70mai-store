<?php

namespace App\Storefront;

use Illuminate\Support\Facades\File;

/**
 * Editorial page content that Lunar has no fields for (feature banners, spec
 * tables, FAQs, review summary), kept in resources/data/product-content/{slug}.json.
 * Everything sold (names, prices, variants, stock, images) comes from Lunar.
 */
class ProductContent
{
    public function for(string $slug): array
    {
        $path = resource_path("data/product-content/{$slug}.json");

        return File::exists($path) ? File::json($path) : [];
    }

    /**
     * Store-wide shipping & returns policy shown on every product page.
     */
    public function shippingPolicy(): array
    {
        return File::json(resource_path('data/shipping-policy.json'));
    }
}
