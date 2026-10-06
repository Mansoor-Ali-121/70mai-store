<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Lunar\Models\Cart;
use Tests\Concerns\InteractsWithCart;
use Tests\TestCase;

class CartTest extends TestCase
{
    use InteractsWithCart;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
        $this->seedCatalog();
    }

    public function test_empty_cart_page_renders(): void
    {
        $this->get('/cart')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Cart')
                ->where('lines', [])
                ->where('subtotal', 0)
                ->where('cart.count', 0));
    }

    public function test_items_are_added_to_a_lunar_cart_with_backend_totals(): void
    {
        $this->from('/products/dash-cam-4k-omni');
        $this->addToCart([self::OMNI_FRONT_REAR_BLACK => 2, self::SD_CARD_256G => 1])
            ->assertRedirect('/products/dash-cam-4k-omni');

        $this->assertSame(1, Cart::count());
        $this->assertSame(2, Cart::first()->lines()->count());

        $this->get('/cart')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Cart')
                ->has('lines', 2)
                ->where('lines.0.variant_id', $this->variantId(self::OMNI_FRONT_REAR_BLACK))
                ->where('lines.0.variant_title', 'Front+Rear Cam / Black')
                ->where('lines.0.quantity', 2)
                ->where('lines.0.price', 26999)
                ->where('lines.0.line_total', 2 * 26999)
                ->where('lines.1.name', '70mai Micro SD Card for Dash Cam')
                ->where('subtotal', 2 * 26999 + 5999)
                ->where('total', 2 * 26999 + 5999)
                ->where('cart.count', 3));
    }

    public function test_adding_the_same_variant_again_increases_its_quantity(): void
    {
        $this->addToCart([self::OMNI_FRONT_REAR_BLACK => 1]);
        $this->addToCart([self::OMNI_FRONT_REAR_BLACK => 1]);

        $this->get('/cart')->assertInertia(fn (Assert $page) => $page
            ->has('lines', 1)
            ->where('lines.0.quantity', 2));
    }

    public function test_cart_survives_session_expiry_via_the_cart_cookie(): void
    {
        $response = $this->addToCart([self::OMNI_FRONT_REAR_BLACK => 1]);
        $cookie = $response->getCookie(config('store.cart.cookie'));

        $this->assertNotNull($cookie);
        $this->assertGreaterThan(now()->addDays(29)->getTimestamp(), $cookie->getExpiresTime());

        $this->flushSession();

        $this->withCookie(config('store.cart.cookie'), $cookie->getValue())
            ->get('/cart')
            ->assertInertia(fn (Assert $page) => $page->has('lines', 1)->where('cart.count', 1));
    }

    public function test_a_tampered_cart_cookie_is_ignored(): void
    {
        $this->withCookie(config('store.cart.cookie'), 'not-a-cart-id')
            ->get('/cart')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('cart.count', 0));
    }

    public function test_cart_count_is_shared_with_every_page(): void
    {
        $this->addToCart([self::OMNI_FRONT_REAR_BLACK => 2]);

        $this->get('/')->assertInertia(fn (Assert $page) => $page->component('Home')->where('cart.count', 2));
        $this->get('/products/dash-cam-4k-omni')->assertInertia(fn (Assert $page) => $page->where('cart.count', 2));
    }

    public function test_buy_now_goes_to_checkout(): void
    {
        $this->post('/cart/items', [
            'items' => [['variant_id' => $this->variantId(self::OMNI_FRONT_REAR_BLACK), 'quantity' => 1]],
            'buy_now' => true,
        ])->assertRedirect('/checkout');
    }

    public function test_unknown_or_sold_out_variants_are_rejected(): void
    {
        $this->addToCart(['NO-SUCH-SKU' => 1])->assertSessionHasErrors('items');
        $this->addToCart([self::SD_CARD_32G_SOLD_OUT => 1])->assertSessionHasErrors('items');

        $this->get('/cart')->assertInertia(fn (Assert $page) => $page->where('cart.count', 0));
    }

    public function test_quantity_can_be_updated_and_lines_removed(): void
    {
        $this->addToCart([self::OMNI_FRONT_REAR_BLACK => 1, self::SD_CARD_256G => 1]);

        $this->patch('/cart/lines/'.$this->lineId(self::OMNI_FRONT_REAR_BLACK), ['quantity' => 4])->assertRedirect();
        $this->delete('/cart/lines/'.$this->lineId(self::SD_CARD_256G))->assertRedirect();

        $this->get('/cart')->assertInertia(fn (Assert $page) => $page
            ->has('lines', 1)
            ->where('lines.0.quantity', 4)
            ->where('subtotal', 4 * 26999));
    }
}
