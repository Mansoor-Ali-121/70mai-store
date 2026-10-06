<?php

namespace App\Support;

use Illuminate\Support\Facades\File;

/**
 * Demo catalogue backed by the JSON fixtures in resources/data/products,
 * standing in for Lunar products until they are set up.
 */
class ProductCatalog
{
    /** @var array<int, array<string, mixed>>|null */
    private ?array $variants = null;

    public function find(string $slug): ?array
    {
        $path = $this->path($slug);

        return File::exists($path) ? File::json($path) : null;
    }

    /**
     * A purchasable variant (including bundle add-ons) with the details a cart line needs.
     */
    public function findVariant(int $variantId): ?array
    {
        return $this->variants()[$variantId] ?? null;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function variants(): array
    {
        if ($this->variants !== null) {
            return $this->variants;
        }

        $this->variants = [];

        foreach (File::glob(resource_path('data/products/*.json')) as $file) {
            $product = File::json($file);
            $currency = $product['currency'] ?? 'USD';

            foreach ($product['variants'] ?? [] as $variant) {
                $this->variants[$variant['id']] = [
                    'variant_id' => $variant['id'],
                    'name' => $product['name'],
                    'variant_title' => implode(' / ', $variant['options']),
                    'price' => $variant['price'],
                    'compare_at_price' => $variant['compare_at_price'] ?? null,
                    'available' => $variant['available'],
                    'image' => $product['images'][$variant['image'] ?? 0]['thumb'] ?? null,
                    'url' => '/products/'.$product['slug'],
                    'currency' => $currency,
                ];
            }

            foreach ($product['bundle'] ?? [] as $addOn) {
                foreach ($addOn['variants'] as $variant) {
                    $this->variants[$variant['id']] = [
                        'variant_id' => $variant['id'],
                        'name' => $addOn['name'],
                        'variant_title' => $variant['title'],
                        'price' => $variant['price'],
                        'compare_at_price' => $variant['compare_at_price'] ?? null,
                        'available' => $variant['available'],
                        'image' => $addOn['image'] ?? null,
                        'url' => File::exists($this->path($addOn['slug'])) ? '/products/'.$addOn['slug'] : null,
                        'currency' => $currency,
                    ];
                }
            }
        }

        return $this->variants;
    }

    private function path(string $slug): string
    {
        return resource_path("data/products/{$slug}.json");
    }
}
