<?php

namespace Tests\Concerns;

use Illuminate\Testing\TestResponse;

/**
 * The test client doesn't keep cookies between requests, so carry the cart
 * cookie from each response into the next request like a browser would.
 */
trait InteractsWithCart
{
    // Variant ids from resources/data/products/dash-cam-4k-omni.json.
    protected const OMNI_FRONT_REAR_BLACK = 41314857451566; // $269.99

    protected const SD_CARD_256G = 40464939941934; // $59.99 add-on

    protected const SD_CARD_32G_SOLD_OUT = 40173136281646;

    protected function rememberCart(TestResponse $response): TestResponse
    {
        $name = config('store.cart.cookie');
        $cookie = $response->getCookie($name);

        if ($cookie !== null) {
            $this->withCookie($name, $cookie->isCleared() ? '' : $cookie->getValue());
        }

        return $response;
    }

    /**
     * @param  array<int, int>  $items  variant id => quantity
     */
    protected function addToCart(array $items): TestResponse
    {
        $payload = array_map(
            fn ($variantId, $quantity) => ['variant_id' => $variantId, 'quantity' => $quantity],
            array_keys($items),
            $items,
        );

        return $this->rememberCart($this->post('/cart/items', ['items' => $payload]));
    }
}
