import OrderSummary from '@/components/checkout/OrderSummary';
import Container from '@/components/store/Container';
import StoreLayout from '@/layouts/StoreLayout';
import { formatMoney } from '@/lib/money';
import { Head, Link, useForm } from '@inertiajs/react';

const INPUT_CLASSES =
    'w-full rounded-md border border-[#D9D9D9] px-4 py-3 text-[15px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary';

function Field({ label, name, form, className = '', optional = false, children, ...inputProps }) {
    const error = form.errors[name];

    return (
        <div className={className}>
            <label htmlFor={name} className="mb-1.5 block text-sm">
                {label}
                {optional && <span className="text-muted"> (optional)</span>}
            </label>
            {children ?? (
                <input
                    id={name}
                    name={name}
                    value={form.data[name]}
                    onChange={(event) => form.setData(name, event.target.value)}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${name}-error` : undefined}
                    className={`${INPUT_CLASSES} ${error ? 'border-red-500' : ''}`}
                    {...inputProps}
                />
            )}
            {error && (
                <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

export default function Checkout({ lines, totals, currency, countries }) {
    const form = useForm({
        email: '',
        first_name: '',
        last_name: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        postal_code: '',
        country: Object.keys(countries)[0] ?? 'US',
        phone: '',
    });

    const submit = (event) => {
        event.preventDefault();
        form.post('/checkout', { preserveScroll: true });
    };

    const amountToFreeShipping = totals.free_shipping_threshold - totals.subtotal;

    return (
        <StoreLayout>
            <Head title="Checkout" />

            <Container className="py-10 lg:py-14">
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <h1 className="text-3xl lg:text-[40px]">Checkout</h1>
                    <Link href="/cart" className="underline underline-offset-4 hover:text-mai">
                        Return to cart
                    </Link>
                </div>

                <form onSubmit={submit} noValidate className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16">
                    <div className="space-y-10">
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold">Contact</h2>
                            <Field label="Email" name="email" type="email" autoComplete="email" form={form} />
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold">Shipping address</h2>
                            <Field label="Country / region" name="country" form={form}>
                                <select
                                    id="country"
                                    value={form.data.country}
                                    onChange={(event) => form.setData('country', event.target.value)}
                                    autoComplete="country"
                                    className={INPUT_CLASSES}
                                >
                                    {Object.entries(countries).map(([code, name]) => (
                                        <option key={code} value={code}>
                                            {name}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="First name" name="first_name" autoComplete="given-name" form={form} />
                                <Field label="Last name" name="last_name" autoComplete="family-name" form={form} />
                            </div>
                            <Field label="Address" name="address_line_1" autoComplete="address-line1" form={form} />
                            <Field
                                label="Apartment, suite, etc."
                                name="address_line_2"
                                autoComplete="address-line2"
                                optional
                                form={form}
                            />
                            <div className="grid gap-4 sm:grid-cols-3">
                                <Field label="City" name="city" autoComplete="address-level2" form={form} />
                                <Field label="State / province" name="state" autoComplete="address-level1" form={form} />
                                <Field label="Postal code" name="postal_code" autoComplete="postal-code" form={form} />
                            </div>
                            <Field label="Phone" name="phone" type="tel" autoComplete="tel" optional form={form} />
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold">Payment</h2>
                            {/* TODO: render the payment provider's form here. */}
                            <p className="rounded-md bg-[#F7F7F7] p-4 text-[15px] text-muted">
                                Payment is arranged offline: once you place your order, we'll contact you to complete payment. Nothing is charged online.
                            </p>
                        </section>
                    </div>

                    <aside className="h-fit space-y-6 bg-[#F7F7F7] p-6 lg:sticky lg:top-[124px] lg:p-8">
                        <h2 className="text-xl font-semibold">Order summary</h2>
                        <OrderSummary
                            lines={lines}
                            subtotal={totals.subtotal}
                            shipping={totals.shipping}
                            tax={totals.tax}
                            total={totals.total}
                            currency={currency}
                        >
                            {amountToFreeShipping > 0 && (
                                <p className="text-sm text-muted">
                                    Add {formatMoney(amountToFreeShipping, currency)} more for free shipping.
                                </p>
                            )}
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="h-[58px] w-full bg-mai text-lg font-medium text-white transition-colors hover:bg-[#e8560f] disabled:opacity-60"
                            >
                                {form.processing ? 'Placing order…' : 'Place order'}
                            </button>
                        </OrderSummary>
                    </aside>
                </form>
            </Container>
        </StoreLayout>
    );
}
