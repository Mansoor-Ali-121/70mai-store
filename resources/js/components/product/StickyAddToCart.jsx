import { formatMoney } from '@/lib/money';
import { useEffect, useState } from 'react';

/** Compact add-to-cart bar shown once the main buy buttons scroll out of view. */
export default function StickyAddToCart({ targetRef, name, image, price, compareAtPrice, currency, disabled, onAddToCart }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const target = targetRef.current;
        if (!target) return;

        // Show only after the buttons have been scrolled past, not before reaching them.
        const observer = new IntersectionObserver(([entry]) => {
            setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
        });
        observer.observe(target);

        return () => observer.disconnect();
    }, [targetRef]);

    return (
        <div
            aria-hidden={!visible}
            className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 md:inset-x-auto md:bottom-6 md:right-6 ${
                visible ? 'translate-y-0' : 'pointer-events-none translate-y-[150%]'
            }`}
        >
            <div className="flex items-center gap-4 border-t bg-white p-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] md:w-[520px] md:rounded-lg md:border md:p-4 md:shadow-xl">
                {image && <img src={image} alt="" className="hidden h-16 w-16 shrink-0 object-contain sm:block" />}
                <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-[15px] leading-snug">{name}</p>
                    <p className="mt-1 flex items-baseline gap-2">
                        {compareAtPrice > price && <s className="text-sm text-muted">{formatMoney(compareAtPrice, currency)}</s>}
                        <span className="text-lg">{formatMoney(price, currency)}</span>
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onAddToCart}
                    disabled={disabled}
                    tabIndex={visible ? 0 : -1}
                    className="shrink-0 bg-mai px-5 py-3 font-medium text-white hover:bg-[#e8560f] disabled:opacity-50"
                >
                    Add to cart
                </button>
            </div>
        </div>
    );
}
