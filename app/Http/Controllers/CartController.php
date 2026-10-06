<?php

namespace App\Http\Controllers;

use App\Storefront\Catalog;
use App\Storefront\Exceptions\InsufficientStock;
use App\Storefront\ProductPresenter;
use App\Storefront\StoreCart;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Lunar\Exceptions\Carts\CartException;

class CartController extends Controller
{
    public function index(StoreCart $cart): Response
    {
        return Inertia::render('Cart', $cart->summary());
    }

    public function store(Request $request, StoreCart $cart, Catalog $catalog): RedirectResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.variant_id' => ['required', 'integer'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:'.StoreCart::MAX_QUANTITY],
            'buy_now' => ['sometimes', 'boolean'],
        ]);

        $variants = [];
        foreach ($validated['items'] as $item) {
            $variant = $catalog->findVariant($item['variant_id']);

            if ($variant === null || ! ProductPresenter::isAvailable($variant)) {
                throw ValidationException::withMessages(['items' => 'One of the selected items is unavailable.']);
            }

            $variants[] = [$variant, $item['quantity']];
        }

        try {
            foreach ($variants as [$variant, $quantity]) {
                $cart->add($variant, $quantity);
            }
        } catch (InsufficientStock|CartException $e) {
            throw ValidationException::withMessages(['items' => $e->getMessage()]);
        }

        return $request->boolean('buy_now') ? to_route('checkout.show') : back();
    }

    public function update(Request $request, StoreCart $cart, int $line): RedirectResponse
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:0', 'max:'.StoreCart::MAX_QUANTITY],
        ]);

        try {
            $cart->updateLine($line, $validated['quantity']);
        } catch (CartException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back();
    }

    public function destroy(StoreCart $cart, int $line): RedirectResponse
    {
        $cart->removeLine($line);

        return back();
    }
}
