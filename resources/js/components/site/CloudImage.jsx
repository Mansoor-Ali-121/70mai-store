import { cloudImages } from '@/data/cloudImages';

const OPTIMIZED_BASE = 'https://new-cdn-res.70mai.com//images/opts';
const ORIGINAL_BASE = 'https://cdn-www.70mai.com/locales/en';

const MOBILE_WIDTHS = [375, 750];
const DESKTOP_WIDTHS = [768, 1024, 1280, 1536, 2048, 2560, 3072];
const DESKTOP_SIZES = '(max-width: 768px) 768px, (max-width: 1024px) 1024px, (max-width: 1280px) 1280px, 1536px';

const toSrcSet = (hashes, widths) =>
    hashes.map((hash, i) => `${OPTIMIZED_BASE}/${hash}.webp ${widths[i]}w`).join(', ');

/**
 * Responsive <picture> for a 70mai CDN asset. Serves the WebP variants listed
 * in the image manifest and falls back to the original PNG.
 */
export default function CloudImage({ src, alt = '', className = '', pictureClassName, ...imgProps }) {
    const variants = cloudImages[src];

    return (
        <picture className={pictureClassName}>
            {variants && (
                <>
                    <source
                        type="image/webp"
                        media="(max-width: 767px)"
                        sizes="375px"
                        srcSet={toSrcSet(variants.mobile, MOBILE_WIDTHS)}
                    />
                    <source type="image/webp" sizes={DESKTOP_SIZES} srcSet={toSrcSet(variants.desktop, DESKTOP_WIDTHS)} />
                </>
            )}
            <img
                src={`${ORIGINAL_BASE}/${encodeURI(src)}`}
                alt={alt}
                draggable={false}
                className={`select-none ${className}`}
                {...imgProps}
            />
        </picture>
    );
}
