import { ChevronDownIcon } from '@/components/store/icons';
import { useId, useState } from 'react';

export default function Accordion({ title, defaultOpen = false, className = '', titleClassName = 'text-[19px]', children }) {
    const [open, setOpen] = useState(defaultOpen);
    const panelId = useId();

    return (
        <div className={`border-b border-[#E5E5E5] ${className}`}>
            <h3>
                <button
                    type="button"
                    onClick={() => setOpen((value) => !value)}
                    aria-expanded={open}
                    aria-controls={panelId}
                    className={`flex w-full items-center justify-between gap-4 py-5 text-left ${titleClassName}`}
                >
                    {title}
                    <ChevronDownIcon className={`h-5 w-5 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
            </h3>
            <div id={panelId} hidden={!open} className="pb-6">
                {children}
            </div>
        </div>
    );
}
