<?php

namespace Tests\Concerns;

use Database\Seeders\HomepageSeeder;
use Database\Seeders\LunarBaseSeeder;
use Database\Seeders\LunarProductSeeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Testing\TestResponse;
use Lunar\Models\CartLine;
use Lunar\Models\ProductVariant;

/**
 * Seeds the Lunar catalogue (without downloading images) and provides cart helpers.
 */
trait InteractsWithCart
{
    // SKUs from database/seeders/data/products.json.
    protected const OMNI_FRONT_REAR_BLACK = '6830AA800385'; // $269.99

    protected const SD_CARD_256G = '5350AA800004'; // $59.99

    protected const SD_CARD_32G_SOLD_OUT = '5350AA000069';

    protected function seedCatalog(): void
    {
        config(['store.seed_product_images' => false]);

        Http::fake(['data.lunarphp.io/*' => Http::response([[
            'name' => 'United States',
            'iso3' => 'USA',
            'iso2' => 'US',
            'phone_code' => '1',
            'capital' => 'Washington',
            'currency' => 'USD',
            'native' => 'United States',
            'emoji' => '🇺🇸',
            'emojiU' => 'U+1F1FA U+1F1F8',
            'states' => [['name' => 'California', 'state_code' => 'CA']],
        ]])]);

        $this->seed([LunarBaseSeeder::class, LunarProductSeeder::class, HomepageSeeder::class]);
    }

    protected function variantId(string $sku): ?int
    {
        return ProductVariant::where('sku', $sku)->value('id');
    }

    protected function lineId(string $sku): int
    {
        return CartLine::where('purchasable_id', $this->variantId($sku))->value('id');
    }

    /**
     * @param  array<string, int>  $items  SKU => quantity
     */
    protected function addToCart(array $items): TestResponse
    {
        $payload = [];
        foreach ($items as $sku => $quantity) {
            $payload[] = ['variant_id' => $this->variantId($sku) ?? 999999, 'quantity' => $quantity];
        }

        return $this->post('/cart/items', ['items' => $payload]);
    }
}
