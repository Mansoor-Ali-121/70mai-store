import { useState } from 'react';

/** Bulleted key features, collapsed behind a "Read more" toggle. */
export default function ProductHighlights({ highlights = [], note }) {
    const [expanded, setExpanded] = useState(false);

    if (highlights.length === 0) {
        return null;
    }

    return (
        <div>
            <div className={`relative overflow-hidden ${expanded ? '' : 'max-h-[230px]'}`}>
                <ul className="list-disc space-y-3 pl-5 text-[17px] leading-relaxed text-muted">
                    {highlights.map((item) => (
                        <li key={item.title}>
                            <strong className="font-semibold text-primary">{item.title}:</strong> {item.body}
                        </li>
                    ))}
                </ul>
                {note && <p className="mt-4 text-sm text-muted">{note}</p>}
                {!expanded && <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white" />}
            </div>
            <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                aria-expanded={expanded}
                className="mt-3 text-lg text-mai underline underline-offset-4"
            >
                {expanded ? 'Read less' : 'Read more'}
            </button>
        </div>
    );
}
