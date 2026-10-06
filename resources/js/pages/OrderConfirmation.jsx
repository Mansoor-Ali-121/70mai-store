import OrderSummary from '@/components/checkout/OrderSummary';
import { CheckIcon } from '@/components/store/icons';
import Container from '@/components/store/Container';
import StoreLayout from '@/layouts/StoreLayout';
import { Head, Link } from '@inertiajs/react';

export default function OrderConfirmation({ order }) {
    const address = order.shipping_address;

    return (
        <StoreLayout>
            <Head title={`Order ${order.reference}`} />

            <Container className="py-12 lg:py-16">
                <div className="mx-auto max-w-3xl">
                    <div className="flex items-start gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-mai text-white">
                            <CheckIcon className="h-6 w-6" strokeWidth={2.5} />
                        </span>
                        <div>
                            <p className="text-muted">Order {order.reference}</p>
                            <h1 className="text-3xl lg:text-4xl">Thank you, {address.first_name}!</h1>
                        </div>
                    </div>

                    <p className="mt-6 text-[17px] leading-relaxed">
                        We've received your order and saved it as <strong>{order.status}</strong>. Payment hasn't been
                        taken; we'll contact you at <strong>{order.email}</strong> about the next steps.
                    </p>

                    <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,1fr)_260px]">
                        <section className="bg-[#F7F7F7] p-6">
                            <h2 className="mb-5 text-lg font-semibold">Order summary</h2>
                            <OrderSummary
                                lines={order.lines}
                                subtotal={order.subtotal}
                                shipping={order.shipping_total}
                                total={order.total}
                                currency={order.currency}
                            />
                        </section>

                        <section className="space-y-2 text-[15px]">
                            <h2 className="mb-3 text-lg font-semibold">Shipping to</h2>
                            <p>
                                {address.first_name} {address.last_name}
                            </p>
                            <p>{address.address_line_1}</p>
                            {address.address_line_2 && <p>{address.address_line_2}</p>}
                            <p>
                                {address.city}, {address.state} {address.postal_code}
                            </p>
                            <p>{order.country_name}</p>
                            {address.phone && <p className="text-muted">{address.phone}</p>}
                        </section>
                    </div>

                    <Link
                        href="/"
                        className="mt-10 inline-block bg-primary px-8 py-4 font-medium text-white transition-colors hover:bg-black"
                    >
                        Continue shopping
                    </Link>
                </div>
            </Container>
        </StoreLayout>
    );
}
