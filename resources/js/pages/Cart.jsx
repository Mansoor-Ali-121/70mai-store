import CartLine from '@/components/cart/CartLine';
import Container from '@/components/store/Container';
import StoreLayout from '@/layouts/StoreLayout';
import { formatMoney } from '@/lib/money';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Cart({ lines = [], subtotal = 0, currency = 'USD' }) {
    const { flash } = usePage().props;
    const [busyVariant, setBusyVariant] = useState(null);

    const visitOptions = (variantId) => ({
        preserveScroll: true,
        onStart: () => setBusyVariant(variantId),
        onFinish: () => setBusyVariant(null),
    });

    const updateQuantity = (variantId, quantity) =>
        router.patch(`/cart/items/${variantId}`, { quantity }, visitOptions(variantId));

    const removeLine = (variantId) => router.delete(`/cart/items/${variantId}`, visitOptions(variantId));

    const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);

    return (
        <StoreLayout>
            <Head title="Your cart" />

            <Container className="py-10 lg:py-16">
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E5E5E5] pb-6">
                    <h1 className="text-3xl lg:text-[44px]">Your cart</h1>
                    <Link href="/" className="text-lg underline underline-offset-4 hover:text-mai">
                        Continue shopping
                    </Link>
                </div>

                {flash?.error && (
                    <p role="alert" className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                        {flash.error}
                    </p>
                )}

                {lines.length === 0 ? (
                    <div className="py-24 text-center">
                        <p className="text-2xl">Your cart is empty</p>
                        <p className="mt-3 text-muted">Find the right dash cam for your car.</p>
                        <Link
                            href="/products/dash-cam-4k-omni"
                            className="mt-8 inline-block bg-mai px-10 py-4 text-lg font-medium text-white hover:bg-[#e8560f]"
                        >
                            Shop Dash Cam 4K Omni
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-10 pt-2 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16">
                        <section aria-label="Cart items">
                            <ul className="divide-y divide-[#E5E5E5]">
                                {lines.map((line) => (
                                    <CartLine
                                        key={line.variant_id}
                                        line={line}
                                        currency={currency}
                                        busy={busyVariant === line.variant_id}
                                        onQuantityChange={(quantity) => updateQuantity(line.variant_id, quantity)}
                                        onRemove={() => removeLine(line.variant_id)}
                                    />
                                ))}
                            </ul>
                        </section>

                        <aside className="h-fit space-y-5 bg-[#F7F7F7] p-6 lg:sticky lg:top-[124px] lg:mt-6 lg:p-8">
                            <h2 className="text-xl font-semibold">Order summary</h2>
                            <dl className="space-y-3 text-[17px]">
                                <div className="flex justify-between">
                                    <dt>
                                        Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                                    </dt>
                                    <dd className="font-semibold">{formatMoney(subtotal, currency)}</dd>
                                </div>
                            </dl>
                            <p className="text-[15px] text-muted">Taxes and shipping calculated at checkout.</p>
                            <Link
                                href="/checkout"
                                className={`flex h-[58px] w-full items-center justify-center bg-mai text-lg font-medium text-white transition-colors hover:bg-[#e8560f] ${
                                    busyVariant ? 'pointer-events-none opacity-60' : ''
                                }`}
                            >
                                Check out
                            </Link>
                        </aside>
                    </div>
                )}
            </Container>
        </StoreLayout>
    );
}
