<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use Tests\Concerns\InteractsWithCart;
use Tests\TestCase;

class CartTest extends TestCase
{
    use InteractsWithCart;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
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

    public function test_items_can_be_added_and_are_listed_in_the_cart(): void
    {
        $this->from('/products/dash-cam-4k-omni');
        $this->addToCart([self::OMNI_FRONT_REAR_BLACK => 2, self::SD_CARD_256G => 1])
            ->assertRedirect('/products/dash-cam-4k-omni');

        $this->get('/cart')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Cart')
                ->has('lines', 2)
                ->where('lines.0.variant_id', self::OMNI_FRONT_REAR_BLACK)
                ->where('lines.0.variant_title', 'Front+Rear Cam / Black')
                ->where('lines.0.quantity', 2)
                ->where('lines.1.name', '70mai Micro SD Card for Dash Cam')
                ->where('subtotal', 2 * 26999 + 5999)
                ->where('cart.count', 3));
    }

    public function test_cart_is_stored_in_a_long_lived_cookie(): void
    {
        $response = $this->addToCart([self::OMNI_FRONT_REAR_BLACK => 1]);

        $cookie = $response->getCookie(config('store.cart.cookie'));
        $this->assertNotNull($cookie);
        $this->assertGreaterThan(now()->addDays(29)->getTimestamp(), $cookie->getExpiresTime());
    }

    public function test_cart_count_is_shared_with_every_page(): void
    {
        $this->addToCart([self::OMNI_FRONT_REAR_BLACK => 2]);

        $this->get('/')->assertInertia(fn (Assert $page) => $page->component('Home')->where('cart.count', 2));
        $this->get('/products/dash-cam-4k-omni')->assertInertia(fn (Assert $page) => $page->where('cart.count', 2));
    }

    public function test_a_tampered_cart_cookie_is_ignored(): void
    {
        $this->withCookie(config('store.cart.cookie'), 'not json');

        $this->get('/cart')->assertOk()->assertInertia(fn (Assert $page) => $page->where('cart.count', 0));
    }

    public function test_adding_the_same_variant_again_increases_its_quantity(): void
    {
        $this->addToCart([self::OMNI_FRONT_REAR_BLACK => 1]);
        $this->addToCart([self::OMNI_FRONT_REAR_BLACK => 1]);

        $this->get('/cart')->assertInertia(fn (Assert $page) => $page
            ->has('lines', 1)
            ->where('lines.0.quantity', 2));
    }

    public function test_buy_now_goes_to_checkout(): void
    {
        $this->post('/cart/items', [
            'items' => [['variant_id' => self::OMNI_FRONT_REAR_BLACK, 'quantity' => 1]],
            'buy_now' => true,
        ])->assertRedirect('/checkout');
    }

    public function test_unknown_or_sold_out_variants_are_rejected(): void
    {
        foreach ([999999, self::SD_CARD_32G_SOLD_OUT] as $variantId) {
            $this->addToCart([$variantId => 1])->assertSessionHasErrors('items');
        }

        $this->get('/cart')->assertInertia(fn (Assert $page) => $page->where('cart.count', 0));
    }

    public function test_quantity_can_be_updated_and_lines_removed(): void
    {
        $this->addToCart([self::OMNI_FRONT_REAR_BLACK => 1, self::SD_CARD_256G => 1]);

        $this->rememberCart($this->patch('/cart/items/'.self::OMNI_FRONT_REAR_BLACK, ['quantity' => 4]))->assertRedirect();
        $this->rememberCart($this->delete('/cart/items/'.self::SD_CARD_256G))->assertRedirect();

        $this->get('/cart')->assertInertia(fn (Assert $page) => $page
            ->has('lines', 1)
            ->where('lines.0.quantity', 4)
            ->where('subtotal', 4 * 26999));
    }
}
