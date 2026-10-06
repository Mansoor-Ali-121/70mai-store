import { formatMoney } from '@/lib/money';

/**
 * Line items and totals. Lines use `price` (cart) or `unit_price` (placed order).
 */
export default function OrderSummary({ lines, subtotal, shipping, tax = 0, total, currency, children }) {
    return (
        <div className="space-y-6">
            <ul className="space-y-5">
                {lines.map((line) => (
                    <li key={line.id ?? line.variant_id} className="flex gap-4">
                        <div className="relative shrink-0">
                            {line.image ? (
                                <img src={line.image} alt="" className="h-16 w-16 border border-[#E5E5E5] bg-white object-contain" />
                            ) : (
                                <div className="h-16 w-16 bg-[#EDEDED]" />
                            )}
                            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1 text-xs text-white">
                                {line.quantity}
                            </span>
                        </div>
                        <div className="min-w-0 flex-1 text-[15px]">
                            <p className="leading-snug">{line.name}</p>
                            {line.variant_title && <p className="mt-1 text-muted">{line.variant_title}</p>}
                        </div>
                        <p className="shrink-0 text-[15px]">{formatMoney(line.line_total, currency)}</p>
                    </li>
                ))}
            </ul>

            <dl className="space-y-3 border-t border-[#E0E0E0] pt-5 text-[15px]">
                <div className="flex justify-between">
                    <dt>Subtotal</dt>
                    <dd>{formatMoney(subtotal, currency)}</dd>
                </div>
                <div className="flex justify-between">
                    <dt>Shipping</dt>
                    <dd>{shipping === 0 ? 'Free' : formatMoney(shipping, currency)}</dd>
                </div>
                {tax > 0 && (
                    <div className="flex justify-between">
                        <dt>Tax</dt>
                        <dd>{formatMoney(tax, currency)}</dd>
                    </div>
                )}
                <div className="flex justify-between border-t border-[#E0E0E0] pt-4 text-lg font-semibold">
                    <dt>Total</dt>
                    <dd>
                        <span className="mr-2 text-sm font-normal text-muted">{currency}</span>
                        {formatMoney(total, currency)}
                    </dd>
                </div>
            </dl>

            {children}
        </div>
    );
}
