import QuantitySelector from '@/components/product/QuantitySelector';
import AppLink from '@/components/site/AppLink';
import { formatMoney } from '@/lib/money';

function LineTitle({ line }) {
    const content = (
        <>
            <span className="block text-[17px] leading-snug">{line.name}</span>
            {line.variant_title && <span className="mt-1 block text-[15px] text-muted">{line.variant_title}</span>}
        </>
    );

    return line.url ? (
        <AppLink href={line.url} className="hover:text-mai">
            {content}
        </AppLink>
    ) : (
        content
    );
}

export default function CartLine({ line, currency, busy, onQuantityChange, onRemove }) {
    return (
        <li className={`grid grid-cols-[80px_minmax(0,1fr)] gap-4 py-6 transition-opacity sm:grid-cols-[110px_minmax(0,1fr)_auto] sm:gap-6 ${busy ? 'opacity-60' : ''}`}>
            {line.image ? (
                <img src={line.image} alt="" className="aspect-square w-full border border-[#F0F0F0] object-contain" />
            ) : (
                <div className="aspect-square w-full bg-[#F5F5F5]" />
            )}

            <div className="min-w-0 space-y-3">
                <LineTitle line={line} />
                <p className="flex items-baseline gap-2">
                    {line.compare_at_price > line.price && (
                        <s className="text-sm text-muted">{formatMoney(line.compare_at_price, currency)}</s>
                    )}
                    <span>{formatMoney(line.price, currency)}</span>
                </p>
                <div className="flex items-center gap-5">
                    <QuantitySelector
                        value={line.quantity}
                        onChange={onQuantityChange}
                        max={line.max_quantity ?? 99}
                        size="sm"
                        label={`${line.name} quantity`}
                    />
                    <button
                        type="button"
                        onClick={onRemove}
                        disabled={busy}
                        className="text-sm text-muted underline underline-offset-4 hover:text-mai"
                    >
                        Remove
                    </button>
                </div>
            </div>

            <p className="col-start-2 text-lg sm:col-start-auto sm:text-right">
                <span className="sr-only">Line total: </span>
                {formatMoney(line.line_total, currency)}
            </p>
        </li>
    );
}
