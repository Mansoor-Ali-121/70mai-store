<?php

namespace App\Http\Controllers;

use App\Http\Requests\PlaceOrderRequest;
use App\Models\Order;
use App\Support\Cart;
use App\Support\OrderTotals;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function show(Cart $cart): Response|RedirectResponse
    {
        $lines = $cart->lines();

        if ($lines === []) {
            return to_route('cart.index')->with('error', 'Your cart is empty.');
        }

        return Inertia::render('Checkout', [
            'lines' => $lines,
            'totals' => OrderTotals::for($cart->subtotal($lines)),
            'currency' => $lines[0]['currency'],
            'countries' => config('store.countries'),
        ]);
    }

    public function store(PlaceOrderRequest $request, Cart $cart): RedirectResponse
    {
        $lines = $cart->lines();

        if ($lines === []) {
            return to_route('cart.index')->with('error', 'Your cart is empty.');
        }

        foreach ($lines as $line) {
            if (! $line['available']) {
                return to_route('cart.index')->with('error', "{$line['name']} ({$line['variant_title']}) is no longer available.");
            }
        }

        $totals = OrderTotals::for($cart->subtotal($lines));

        // TODO: take payment here (e.g. a Stripe PaymentIntent) before marking the order paid.
        $order = DB::transaction(function () use ($request, $lines, $totals) {
            $order = Order::create([
                'reference' => $this->newReference(),
                'status' => 'pending',
                'email' => $request->validated('email'),
                'shipping_address' => $request->shippingAddress(),
                'currency' => $lines[0]['currency'],
                'subtotal' => $totals['subtotal'],
                'shipping_total' => $totals['shipping'],
                'total' => $totals['total'],
                'placed_at' => now(),
            ]);

            $order->lines()->createMany(array_map(fn (array $line) => [
                'variant_id' => $line['variant_id'],
                'name' => $line['name'],
                'variant_title' => $line['variant_title'],
                'image' => $line['image'],
                'unit_price' => $line['price'],
                'quantity' => $line['quantity'],
                'line_total' => $line['line_total'],
            ], $lines));

            return $order;
        });

        $cart->clear();
        $request->session()->put('last_order_id', $order->id);

        return to_route('checkout.confirmation', $order->reference);
    }

    public function confirmation(Request $request, string $reference): Response
    {
        $order = Order::with('lines')->where('reference', $reference)->firstOrFail();

        // Only the session that placed the order may view it.
        abort_unless($request->session()->get('last_order_id') === $order->id, 404);

        return Inertia::render('OrderConfirmation', [
            'order' => [
                'reference' => $order->reference,
                'email' => $order->email,
                'status' => $order->status,
                'currency' => $order->currency,
                'shipping_address' => $order->shipping_address,
                'country_name' => config('store.countries')[$order->shipping_address['country']] ?? $order->shipping_address['country'],
                'subtotal' => $order->subtotal,
                'shipping_total' => $order->shipping_total,
                'total' => $order->total,
                'lines' => $order->lines->map->only(['variant_id', 'name', 'variant_title', 'image', 'unit_price', 'quantity', 'line_total']),
            ],
        ]);
    }

    private function newReference(): string
    {
        do {
            $reference = 'MAI-'.strtoupper(Str::random(8));
        } while (Order::where('reference', $reference)->exists());

        return $reference;
    }
}
