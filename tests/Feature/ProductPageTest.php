<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Lunar\FieldTypes\TranslatedText;
use Lunar\Models\Price;
use Lunar\Models\Product;
use Lunar\Models\ProductVariant;
use Tests\Concerns\InteractsWithCart;
use Tests\TestCase;

class ProductPageTest extends TestCase
{
    use InteractsWithCart;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
        $this->seedCatalog();
    }

    public function test_product_page_is_built_from_lunar_data(): void
    {
        $this->get('/products/dash-cam-4k-omni')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('ProductDetail')
                ->where('product.name', '70mai Dash Cam 4K Omni 360 Full View with Dual Sony STARVIS 2, AI 2.0 & 4G LTE Supported')
                ->where('product.tagline', 'The Next-Gen 360° Dash Cam with Dual Brilliance')
                ->has('product.options', 2)
                ->where('product.options.1.type', 'swatch')
                ->where('product.options.1.values.1.swatch', '#E3262E')
                ->has('product.variants', 4)
                ->where('product.variants.0.options', ['Front+Rear Cam', 'Black'])
                ->where('product.variants.0.price', 26999)
                ->where('product.variants.0.compare_at_price', 34999)
                ->has('product.highlights', 9)
                ->has('product.bundle', 3)
                ->has('product.specs')
                ->has('product.shipping'));
    }

    public function test_every_seeded_product_has_a_page(): void
    {
        foreach (['dash-cam-4k-omni', '4k-t800-dash-cam', 'microsd-card', '4g-hardwire-kit', 'cpl-filter-for-4k-omni', 'battery-pack'] as $slug) {
            $this->get("/products/{$slug}")->assertOk();
        }
    }

    public function test_name_and_price_edits_show_on_the_next_request(): void
    {
        $variant = ProductVariant::where('sku', self::OMNI_FRONT_REAR_BLACK)->first();
        $product = $variant->product;

        $attributes = $product->attribute_data;
        $attributes['name'] = new TranslatedText(['en' => '70mai Omni (renamed in admin)']);
        $product->update(['attribute_data' => $attributes]);
        Price::where('priceable_id', $variant->id)->update(['price' => 24999]);

        $this->get('/products/dash-cam-4k-omni')->assertInertia(fn (Assert $page) => $page
            ->where('product.name', '70mai Omni (renamed in admin)')
            ->where('product.variants.0.price', 24999));
    }

    public function test_unknown_and_unpublished_products_are_not_found(): void
    {
        $this->get('/products/no-such-product')->assertNotFound();

        Product::whereHas('urls', fn ($q) => $q->where('slug', 'battery-pack'))->update(['status' => 'draft']);
        $this->get('/products/battery-pack')->assertNotFound();
    }
}
