const STAR_PATH = 'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z';

function Stars({ className }) {
    return (
        <div className={`flex gap-0.5 ${className}`}>
            {Array.from({ length: 5 }, (_, i) => (
                <svg key={i} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-[1em] w-[1em] shrink-0">
                    <path d={STAR_PATH} />
                </svg>
            ))}
        </div>
    );
}

/** Five stars filled proportionally to `value` (0–5). Size follows the font size. */
export default function StarRating({ value = 0, className = 'text-2xl' }) {
    const percent = Math.max(0, Math.min(5, value)) * 20;

    return (
        <div role="img" aria-label={`Rated ${value} out of 5`} className={`relative inline-block ${className}`}>
            <Stars className="text-[#E2E2E2]" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${percent}%` }}>
                <Stars className="text-[#F7A21B]" />
            </div>
        </div>
    );
}
