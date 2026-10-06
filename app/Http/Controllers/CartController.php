<?php

namespace App\Http\Controllers;

use App\Support\Cart;
use App\Support\ProductCatalog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(Cart $cart): Response
    {
        $lines = $cart->lines();

        return Inertia::render('Cart', [
            'lines' => $lines,
            'subtotal' => $cart->subtotal($lines),
            'currency' => $lines[0]['currency'] ?? 'USD',
        ]);
    }

    public function store(Request $request, Cart $cart, ProductCatalog $catalog): RedirectResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.variant_id' => ['required', 'integer'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:'.Cart::MAX_QUANTITY],
            'buy_now' => ['sometimes', 'boolean'],
        ]);

        foreach ($validated['items'] as $item) {
            $variant = $catalog->findVariant($item['variant_id']);

            if ($variant === null || ! $variant['available']) {
                throw ValidationException::withMessages([
                    'items' => 'One of the selected items is unavailable.',
                ]);
            }
        }

        foreach ($validated['items'] as $item) {
            $cart->add($item['variant_id'], $item['quantity']);
        }

        return $request->boolean('buy_now') ? to_route('checkout.show') : back();
    }

    public function update(Request $request, Cart $cart, int $variant): RedirectResponse
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:0', 'max:'.Cart::MAX_QUANTITY],
        ]);

        $cart->update($variant, $validated['quantity']);

        return back();
    }

    public function destroy(Cart $cart, int $variant): RedirectResponse
    {
        $cart->remove($variant);

        return back();
    }
}
