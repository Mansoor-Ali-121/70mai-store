<?php

namespace App\Storefront;

use Lunar\Models\Product;

/**
 * Header/footer menus built from Lunar: each configured collection with the
 * published products in it, so new products appear without code changes.
 */
class Navigation
{
    public function __construct(private Catalog $catalog) {}

    /**
     * @return list<array{label: string, href: string, children: list<array{label: string, href: string}>}>
     */
    public function collections(): array
    {
        $menu = [];

        foreach (config('store.navigation') as $slug) {
            $collection = $this->catalog->findCollection($slug);

            if (! $collection) {
                continue;
            }

            $menu[] = [
                'label' => $collection->translateAttribute('name'),
                'href' => "/collections/{$slug}",
                'children' => $this->catalog->productsIn($collection, ['urls'])
                    ->map(fn (Product $product) => [
                        'label' => $product->translateAttribute('short_name') ?: $product->translateAttribute('name'),
                        'href' => '/products/'.($product->urls->firstWhere('default', true) ?? $product->urls->first())?->slug,
                    ])
                    ->values()
                    ->all(),
            ];
        }

        return $menu;
    }
}
