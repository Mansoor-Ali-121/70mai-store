<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Lunar\Models\Url;
use Tests\Concerns\InteractsWithCart;
use Tests\TestCase;

class StorefrontPagesTest extends TestCase
{
    use InteractsWithCart;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
        $this->seedCatalog();
    }

    public function test_home_series_tabs_come_from_the_lunar_collection(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Home')
                ->has('series', 4)
                ->where('series.0.slug', 'dash-cam-4k-omni')
                ->where('series.0.series', 'Pioneering - X Series')
                ->where('series.0.url', '/products/dash-cam-4k-omni')
                ->where('series.1.slug', 'dash-cam-a810')
                ->where('series.2.available', false) // the M310 is sold out
                ->where('series.3.slug', 'rearview-dash-cam-s500'));
    }

    public function test_reordering_the_series_collection_reorders_the_home_tabs(): void
    {
        $collection = Url::where('slug', 'explore-by-series')->first()->element;
        $s500 = Url::where('slug', 'rearview-dash-cam-s500')->first()->element_id;
        $collection->products()->updateExistingPivot($s500, ['position' => 0]);

        $this->get('/')->assertInertia(fn (Assert $page) => $page->where('series.0.slug', 'rearview-dash-cam-s500'));
    }

    public function test_hero_banners_get_their_products_by_slug(): void
    {
        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->where('products.dash-cam-4k-a900-ultra.url', '/products/dash-cam-4k-a900-ultra')
            ->where('products.dash-cam-4k-a810-lite.price', 8499)
            ->where('products.dash-cam-m310-plus-4k.price_varies', false)
            ->where('products.4k-t800-dash-cam.available', true)
            ->missing('products.dash-cam-4k-a900'));
    }

    public function test_navigation_is_built_from_lunar_collections(): void
    {
        $this->get('/cart')->assertInertia(fn (Assert $page) => $page
            ->where('navigation.0.label', 'Dash Cams')
            ->where('navigation.0.href', '/collections/dash-cams')
            ->has('navigation.0.children', 8)
            ->where('navigation.1.label', 'Accessories')
            ->where('navigation.1.children.0.href', '/products/microsd-card'));
    }

    public function test_collection_page_lists_product_cards(): void
    {
        $this->get('/collections/accessories')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('ProductListing')
                ->where('heading', 'Accessories')
                ->has('products', 4)
                ->where('products.0.slug', 'microsd-card')
                ->where('products.0.price_varies', true)
                // Cheapest purchasable variant (the $19.99 32G card is sold out).
                ->where('products.0.price', 3199));
    }

    public function test_unknown_collections_are_not_found(): void
    {
        $this->get('/collections/no-such-collection')->assertNotFound();
    }

    public function test_search_finds_products_by_name_and_sku(): void
    {
        $this->get('/search?q=s500')->assertInertia(fn (Assert $page) => $page
            ->component('ProductListing')
            ->where('query', 's500')
            ->where('products.0.slug', 'rearview-dash-cam-s500'));

        $this->get('/search?q=6830AA800385')->assertInertia(fn (Assert $page) => $page
            ->has('products', 1)
            ->where('products.0.slug', 'dash-cam-4k-omni'));

        $this->get('/search?q=zzzz-nothing')->assertInertia(fn (Assert $page) => $page->has('products', 0));
    }
}
