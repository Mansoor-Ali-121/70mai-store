import { formatMoney } from '@/lib/money';
import { Link } from '@inertiajs/react';

/** Card for a product from ProductPresenter::card(). */
export default function ProductCard({ product, currency = 'USD' }) {
    const onSale = product.compare_at_price > product.price;

    return (
        <Link href={product.url} className="group flex flex-col overflow-hidden rounded-xl border border-[#EDEDED] bg-white transition-shadow hover:shadow-lg">
            <div className="relative aspect-square bg-[#F7F7F7]">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.short_name}
                        loading="lazy"
                        className="h-full w-full object-contain p-6 mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                    />
                ) : null}
                {!product.available ? (
                    <span className="absolute left-3 top-3 rounded bg-primary px-2 py-1 text-xs font-semibold text-white">Sold out</span>
                ) : onSale ? (
                    <span className="absolute left-3 top-3 rounded bg-mai px-2 py-1 text-xs font-semibold text-white">Sale</span>
                ) : null}
            </div>
            <div className="flex flex-1 flex-col gap-2 p-5">
                {product.series && <p className="text-xs uppercase tracking-wider text-muted">{product.series}</p>}
                <h3 className="text-[17px] font-medium leading-snug group-hover:text-mai">{product.short_name}</h3>
                {product.tagline && <p className="line-clamp-2 text-sm text-muted">{product.tagline}</p>}
                {product.price !== null && (
                    <p className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-2 text-lg">
                        {product.price_varies && <span className="text-sm text-muted">From</span>}
                        <span>{formatMoney(product.price, currency)}</span>
                        {onSale && <s className="text-sm text-muted">{formatMoney(product.compare_at_price, currency)}</s>}
                    </p>
                )}
            </div>
        </Link>
    );
}
