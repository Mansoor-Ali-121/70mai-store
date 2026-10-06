<?php

namespace App\Http\Controllers;

use App\Http\Requests\PlaceOrderRequest;
use App\Storefront\ProductPresenter;
use App\Storefront\StoreCart;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Lunar\Exceptions\Carts\CartException;
use Lunar\Facades\CartSession;
use Lunar\Facades\Payments;
use Lunar\Models\Country;
use Lunar\Models\Order;
use Lunar\Models\OrderLine;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class CheckoutController extends Controller
{
    public function show(StoreCart $cart): Response|RedirectResponse
    {
        $lunarCart = $cart->current();
        $summary = $cart->summary($lunarCart);

        if ($summary['lines'] === []) {
            return to_route('cart.index')->with('error', 'Your cart is empty.');
        }

        // Shipping isn't on the cart until an address is set, so add the option's price here.
        $shipping = $cart->shippingOption($lunarCart)?->price->value ?? 0;

        return Inertia::render('Checkout', [
            'lines' => $summary['lines'],
            'totals' => [
                'subtotal' => $summary['subtotal'],
                'shipping' => $shipping,
                'tax' => $summary['tax'],
                'total' => $summary['total'] + $shipping,
                'free_shipping_threshold' => config('store.shipping.free_threshold'),
            ],
            'currency' => $summary['currency'],
            'countries' => config('store.countries'),
        ]);
    }

    public function store(PlaceOrderRequest $request, StoreCart $cart): RedirectResponse
    {
        $lunarCart = $cart->current();
        $summary = $cart->summary($lunarCart);

        if ($summary['lines'] === []) {
            return to_route('cart.index')->with('error', 'Your cart is empty.');
        }

        foreach ($summary['lines'] as $line) {
            if (! $line['available']) {
                return to_route('cart.index')->with('error', "{$line['name']} is no longer available.");
            }
        }

        $address = [
            'first_name' => $request->validated('first_name'),
            'last_name' => $request->validated('last_name'),
            'line_one' => $request->validated('address_line_1'),
            'line_two' => $request->validated('address_line_2'),
            'city' => $request->validated('city'),
            'state' => $request->validated('state'),
            'postcode' => $request->validated('postal_code'),
            'country_id' => Country::where('iso2', $request->validated('country'))->value('id'),
            'contact_email' => $request->validated('email'),
            'contact_phone' => $request->validated('phone'),
        ];

        try {
            CartSession::setShippingAddress($address);
            CartSession::setBillingAddress($address);
            CartSession::setShippingOption($cart->shippingOption(CartSession::current()));

            // Place the order through Lunar's payment pipeline using the configured payment
            // type (lunar.payments.default, "cash-in-hand" = offline). Authorising creates the
            // order via the cart's order pipeline, sets placed_at and the "payment-offline"
            // status. Swap the type for a gateway (e.g. Lunar's Stripe add-on) to take payment online.
            $payment = Payments::driver()
                ->cart(CartSession::current())
                ->withData(['meta' => ['payment_method' => 'offline']])
                ->authorize();
        } catch (CartException $e) {
            return back()->with('error', $e->getMessage());
        }

        if (! $payment?->success) {
            return back()->with('error', $payment?->message ?: 'We could not place your order. Please try again.');
        }

        // The order now owns the cart; start the shopper on a fresh one.
        CartSession::forget();

        $order = Order::findOrFail($payment->orderId);
        $request->session()->put('last_order_id', $order->id);

        return to_route('checkout.confirmation', $order->reference);
    }

    public function confirmation(Request $request, string $reference): Response
    {
        // Only physical lines have product purchasables; the shipping line's is a ShippingOption.
        $order = Order::with([
            'lines' => fn ($query) => $query->where('type', 'physical')->with(['purchasable.images', 'purchasable.product.images']),
            'shippingAddress.country',
        ])->where('reference', $reference)->firstOrFail();

        // Only the session that placed the order may view it.
        abort_unless($request->session()->get('last_order_id') === $order->id, 404);

        $address = $order->shippingAddress;

        return Inertia::render('OrderConfirmation', [
            'order' => [
                'reference' => $order->reference,
                'email' => $address?->contact_email,
                'status' => config("lunar.orders.statuses.{$order->status}.label", $order->status),
                'currency' => $order->currency_code,
                'shipping_address' => [
                    'first_name' => $address?->first_name,
                    'last_name' => $address?->last_name,
                    'line_one' => $address?->line_one,
                    'line_two' => $address?->line_two,
                    'city' => $address?->city,
                    'state' => $address?->state,
                    'postcode' => $address?->postcode,
                    'country' => $address?->country?->name,
                    'phone' => $address?->contact_phone,
                ],
                'subtotal' => $order->sub_total->value,
                'shipping_total' => $order->shipping_total->value,
                'tax_total' => $order->tax_total->value,
                'total' => $order->total->value,
                'lines' => $order->lines
                    ->map(fn (OrderLine $line) => [
                        'id' => $line->id,
                        'name' => $line->description,
                        'variant_title' => $line->option ?: null,
                        'image' => ($media = $this->lineImage($line)) ? ProductPresenter::mediaUrl($media, 'small') : null,
                        'quantity' => $line->quantity,
                        'line_total' => $line->sub_total->value,
                    ])->values(),
            ],
        ]);
    }

    private function lineImage(OrderLine $line): ?Media
    {
        $variant = $line->purchasable;

        return $variant?->images->first() ?? $variant?->product?->images->sortBy('order_column')->first();
    }
}
