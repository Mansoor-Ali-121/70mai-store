<?php

namespace Tests\Feature;

use Filament\Facades\Filament;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Lunar\Admin\Filament\Resources\ProductResource\Pages\ListProducts;
use Lunar\Admin\Models\Staff;
use Lunar\Models\Collection;
use Lunar\Models\CollectionGroup;
use Lunar\Models\Order;
use Lunar\Models\Product;
use Lunar\Models\ProductVariant;
use Tests\Concerns\InteractsWithCart;
use Tests\TestCase;

class AdminPanelTest extends TestCase
{
    use InteractsWithCart;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
        $this->seedCatalog();
    }

    public function test_guests_are_sent_to_the_admin_login(): void
    {
        $this->get('/admin/products')->assertRedirect('/admin/login');
        $this->get('/admin/login')->assertOk();
    }

    public function test_lunar_resources_render_for_an_admin(): void
    {
        $this->addToCart([self::OMNI_FRONT_REAR_BLACK => 1]);
        $this->post('/checkout', [
            'email' => 'driver@example.com',
            'first_name' => 'Sam',
            'last_name' => 'Rivera',
            'address_line_1' => '1 Market St',
            'city' => 'San Francisco',
            'state' => 'CA',
            'postal_code' => '94105',
            'country' => 'US',
        ]);

        $variant = ProductVariant::where('sku', self::OMNI_FRONT_REAR_BLACK)->first();
        $productId = $variant->product_id;

        $this->actingAs($this->admin(), 'staff');

        foreach ([
            '/admin',
            '/admin/products',
            "/admin/products/{$productId}/edit",
            "/admin/products/{$productId}/pricing",
            "/admin/products/{$productId}/variants",
            "/admin/product-variants/{$variant->id}/identifiers",
            "/admin/product-variants/{$variant->id}/pricing",
            // Collections are managed as a tree inside their collection group.
            '/admin/collection-groups',
            '/admin/collection-groups/'.CollectionGroup::first()->id.'/edit',
            '/admin/collections/'.Collection::first()->id.'/edit',
            '/admin/brands',
            '/admin/orders',
            '/admin/orders/'.Order::sole()->id,
            '/admin/customers',
        ] as $uri) {
            $this->get($uri)->assertOk();
        }

        // Lunar's variant "edit" route opens the identifiers tab.
        $this->get("/admin/product-variants/{$variant->id}/edit")
            ->assertRedirect("/admin/product-variants/{$variant->id}/identifiers");
    }

    public function test_the_product_table_lists_seeded_lunar_products(): void
    {
        $this->actingAs($this->admin(), 'staff');
        Filament::setCurrentPanel(Filament::getPanel('lunar'));

        // The table defers loading its rows until after the page renders.
        Livewire::test(ListProducts::class)
            ->loadTable()
            ->assertCanSeeTableRecords(Product::all())
            ->assertSee('70mai Dash Cam 4K Omni');
    }

    private function admin(): Staff
    {
        return Staff::create([
            'first_name' => 'Test',
            'last_name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'admin' => true,
        ]);
    }
}
