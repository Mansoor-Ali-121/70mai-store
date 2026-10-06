import { MinusIcon, PlusIcon } from '@/components/store/icons';

export default function QuantitySelector({ value, onChange, min = 1, max = 99, size = 'md', label = 'Quantity' }) {
    const clamp = (n) => Math.max(min, Math.min(max, n));
    const sizes = size === 'sm' ? 'h-9 [&_button]:w-8 [&_input]:w-10 text-base' : 'h-[54px] [&_button]:w-11 [&_input]:w-12 text-lg';

    return (
        <div className={`inline-flex items-stretch border border-[#E2E2E2] ${sizes}`}>
            <button
                type="button"
                onClick={() => onChange(clamp(value - 1))}
                disabled={value <= min}
                aria-label={`Decrease ${label.toLowerCase()}`}
                className="flex items-center justify-center text-muted hover:text-primary disabled:opacity-40"
            >
                <MinusIcon className="h-4 w-4" />
            </button>
            <input
                type="number"
                inputMode="numeric"
                min={min}
                max={max}
                value={value}
                onChange={(event) => onChange(clamp(Number(event.target.value) || min))}
                aria-label={label}
                className="border-0 p-0 text-center [appearance:textfield] focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
                type="button"
                onClick={() => onChange(clamp(value + 1))}
                disabled={value >= max}
                aria-label={`Increase ${label.toLowerCase()}`}
                className="flex items-center justify-center text-muted hover:text-primary disabled:opacity-40"
            >
                <PlusIcon className="h-4 w-4" />
            </button>
        </div>
    );
}
