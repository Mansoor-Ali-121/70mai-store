<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Lunar\Models\Order;
use Tests\Concerns\InteractsWithCart;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    use InteractsWithCart;
    use RefreshDatabase;

    private const ADDRESS = [
        'email' => 'driver@example.com',
        'first_name' => 'Sam',
        'last_name' => 'Rivera',
        'address_line_1' => '1 Market St',
        'address_line_2' => '',
        'city' => 'San Francisco',
        'state' => 'CA',
        'postal_code' => '94105',
        'country' => 'US',
        'phone' => '',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
        $this->seedCatalog();
    }

    public function test_checkout_with_an_empty_cart_redirects_to_the_cart(): void
    {
        $this->get('/checkout')
            ->assertRedirect('/cart')
            ->assertSessionHas('error', 'Your cart is empty.');
    }

    public function test_checkout_page_shows_lunar_cart_lines_and_totals(): void
    {
        $this->addToCart([self::OMNI_FRONT_REAR_BLACK => 1]);

        $this->get('/checkout')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Checkout')
                ->has('lines', 1)
                ->where('totals.subtotal', 26999)
                ->where('totals.shipping', 0)
                ->where('totals.total', 26999)
                ->where('currency', 'USD'));
    }

    public function test_orders_below_the_free_shipping_threshold_pay_the_flat_rate(): void
    {
        $this->addToCart([self::SD_CARD_256G => 1]);

        $this->get('/checkout')->assertInertia(fn (Assert $page) => $page
            ->where('totals.subtotal', 5999)
            ->where('totals.shipping', config('store.shipping.flat_rate'))
            ->where('totals.total', 5999 + config('store.shipping.flat_rate')));
    }

    public function test_placing_an_order_creates_a_lunar_order_and_clears_the_cart(): void
    {
        $this->addToCart([self::OMNI_FRONT_REAR_BLACK => 2, self::SD_CARD_256G => 1]);

        $response = $this->post('/checkout', self::ADDRESS);

        $order = Order::with(['lines', 'shippingAddress'])->sole();
        $response->assertRedirect("/checkout/confirmation/{$order->reference}");

        // Placed through Lunar's offline payment type, so it counts as a real (non-draft) order.
        $this->assertSame('payment-offline', $order->status);
        $this->assertNotNull($order->placed_at);
        $this->assertSame(2 * 26999 + 5999, $order->sub_total->value);
        $this->assertSame(0, $order->shipping_total->value);
        $this->assertSame(2 * 26999 + 5999, $order->total->value);
        $this->assertCount(2, $order->lines->where('type', 'physical'));
        $this->assertSame('San Francisco', $order->shippingAddress->city);
        $this->assertSame('driver@example.com', $order->shippingAddress->contact_email);

        $this->get("/checkout/confirmation/{$order->reference}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('OrderConfirmation')
                ->where('order.reference', $order->reference)
                ->has('order.lines', 2)
                ->where('order.total', 2 * 26999 + 5999)
                ->where('cart.count', 0));
    }

    public function test_flat_rate_shipping_is_charged_on_the_lunar_order(): void
    {
        $this->addToCart([self::SD_CARD_256G => 1]);
        $this->post('/checkout', self::ADDRESS);

        $order = Order::sole();
        $this->assertSame(config('store.shipping.flat_rate'), $order->shipping_total->value);
        $this->assertSame(5999 + config('store.shipping.flat_rate'), $order->total->value);
    }

    public function test_address_fields_are_validated(): void
    {
        $this->addToCart([self::OMNI_FRONT_REAR_BLACK => 1]);

        $this->post('/checkout', [...self::ADDRESS, 'email' => 'nope', 'city' => '', 'country' => 'XX'])
            ->assertSessionHasErrors(['email', 'city', 'country']);

        $this->assertSame(0, Order::count());
    }

    public function test_placing_an_order_with_an_empty_cart_is_rejected(): void
    {
        $this->post('/checkout', self::ADDRESS)->assertRedirect('/cart');

        $this->assertSame(0, Order::count());
    }

    public function test_confirmation_is_only_visible_to_the_session_that_placed_the_order(): void
    {
        $this->addToCart([self::OMNI_FRONT_REAR_BLACK => 1]);
        $this->post('/checkout', self::ADDRESS);
        $reference = Order::sole()->reference;

        $this->flushSession();

        $this->get("/checkout/confirmation/{$reference}")->assertNotFound();
    }
}
