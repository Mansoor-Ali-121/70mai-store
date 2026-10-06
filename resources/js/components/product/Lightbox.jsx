import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from '@/components/store/icons';
import { useEffect } from 'react';

export default function Lightbox({ images, index, onChange, onClose }) {
    const count = images.length;
    const go = (step) => onChange((index + step + count) % count);

    useEffect(() => {
        const onKey = (event) => {
            if (event.key === 'Escape') onClose();
            if (event.key === 'ArrowLeft') go(-1);
            if (event.key === 'ArrowRight') go(1);
        };
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKey);
        };
    });

    const image = images[index];

    return (
        <div role="dialog" aria-modal="true" aria-label="Product images" className="fixed inset-0 z-[100] flex flex-col bg-white">
            <div className="flex items-center justify-between px-5 py-4">
                <span className="text-sm text-muted">
                    {index + 1} / {count}
                </span>
                <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-2 hover:bg-[#F2F2F2]">
                    <CloseIcon className="h-7 w-7" />
                </button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 md:px-20">
                <img src={image.src} alt={image.alt} className="max-h-full max-w-full object-contain" />
                <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md md:left-6"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md md:right-6"
                >
                    <ArrowRightIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}
