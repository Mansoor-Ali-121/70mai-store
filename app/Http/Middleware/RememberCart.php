<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Lunar\Facades\CartSession;
use Lunar\Models\Cart;
use Symfony\Component\HttpFoundation\Response;

/**
 * Lunar's CartSession keeps the cart id in the session, which expires after
 * SESSION_LIFETIME. This mirrors the id into a long-lived encrypted cookie and
 * restores the cart from it when the session no longer has one.
 */
class RememberCart
{
    public function handle(Request $request, Closure $next): Response
    {
        $sessionKey = config('lunar.cart_session.session_key');
        $cookieName = config('store.cart.cookie');

        if (! $request->session()->has($sessionKey) && ctype_digit((string) $request->cookie($cookieName))) {
            // Only carts that never became an order can be restored.
            $cart = Cart::whereDoesntHave('orders')->find((int) $request->cookie($cookieName));

            if ($cart) {
                CartSession::use($cart);
            }
        }

        $response = $next($request);

        if ($cartId = $request->session()->get($sessionKey)) {
            Cookie::queue($cookieName, (string) $cartId, config('store.cart.lifetime_days') * 24 * 60);
        } elseif ($request->cookies->has($cookieName)) {
            Cookie::queue(Cookie::forget($cookieName));
        }

        return $response;
    }
}
