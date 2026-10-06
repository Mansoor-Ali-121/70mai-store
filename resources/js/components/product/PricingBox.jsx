import { formatMoney } from '@/lib/money';
import StarRating from './StarRating';

export default function PricingBox({ price, compareAtPrice, currency = 'USD', installments, rating }) {
    const onSale = compareAtPrice > price;
    const savePercent = onSale ? Math.round((1 - price / compareAtPrice) * 100) : 0;

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-2xl lg:text-[26px]">
                {onSale && (
                    <s className="text-muted">
                        <span className="sr-only">Regular price </span>
                        {formatMoney(compareAtPrice, currency)}
                    </s>
                )}
                <span>
                    {onSale && <span className="sr-only">Sale price </span>}
                    {formatMoney(price, currency)}
                </span>
                {onSale && (
                    <span className="rounded bg-mai px-2 py-1 text-sm font-semibold leading-none text-white">Save {savePercent}%</span>
                )}
            </div>

            <p className="text-[15px] text-muted">
                <a href="#shipping-returns" className="underline underline-offset-4">
                    Shipping
                </a>{' '}
                calculated at checkout.
            </p>

            {installments > 1 && (
                <p className="text-[17px]">
                    Pay in {installments} interest-free installments of{' '}
                    <span className="font-semibold">{formatMoney(Math.ceil(price / installments), currency)}</span>
                </p>
            )}

            {rating?.count > 0 && (
                <a href="#reviews" className="inline-flex items-center gap-2 text-xl hover:text-mai">
                    <StarRating value={rating.average} className="text-2xl" />
                    {rating.count} reviews
                </a>
            )}
        </div>
    );
}
