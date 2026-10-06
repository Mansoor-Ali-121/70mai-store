import { ArrowLeftIcon, ArrowRightIcon, ExpandIcon } from '@/components/store/icons';
import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Lightbox from './Lightbox';

import 'swiper/css';

/**
 * Product gallery: thumbnail rail (vertical on desktop, horizontal on mobile),
 * swipeable main image, and a fullscreen viewer. `activeIndex` is controlled so
 * the page can jump to a variant's image.
 *
 * The main image sits in a fixed square stage, so switching images or variants
 * never changes the layout height. On desktop the rail is pinned beside the
 * stage and takes its height from it, scrolling when there are more thumbnails.
 */
export default function ImageGallery({ images = [], activeIndex = 0, onChange }) {
    const [swiper, setSwiper] = useState(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const railRef = useRef(null);
    const thumbRefs = useRef([]);

    // Keep the main image and thumbnail rail in step with the selected index.
    useEffect(() => {
        if (swiper && !swiper.destroyed && swiper.activeIndex !== activeIndex) {
            swiper.slideTo(activeIndex);
        }

        const rail = railRef.current;
        const thumb = thumbRefs.current[activeIndex];
        if (rail && thumb) {
            rail.scrollTo({
                top: thumb.offsetTop - rail.clientHeight / 2 + thumb.clientHeight / 2,
                left: thumb.offsetLeft - rail.clientWidth / 2 + thumb.clientWidth / 2,
                behavior: 'smooth',
            });
        }
    }, [activeIndex, swiper]);

    if (images.length === 0) {
        return <div className="aspect-square w-full bg-[#F5F5F5]" />;
    }

    return (
        <div className="relative flex flex-col gap-4 lg:block">
            <div
                ref={railRef}
                className="hide-scrollbar relative order-last flex gap-3 overflow-x-auto lg:absolute lg:inset-y-0 lg:left-0 lg:w-[100px] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden"
            >
                {images.map((image, index) => (
                    <button
                        key={image.src}
                        ref={(el) => (thumbRefs.current[index] = el)}
                        type="button"
                        onClick={() => onChange(index)}
                        aria-label={`Show image ${index + 1}`}
                        aria-current={index === activeIndex}
                        className={`aspect-square w-[72px] shrink-0 overflow-hidden border lg:w-full ${
                            index === activeIndex ? 'border-primary' : 'border-transparent hover:border-[#D0D0D0]'
                        }`}
                    >
                        <img src={image.thumb ?? image.src} alt="" loading="lazy" className="h-full w-full object-cover" />
                    </button>
                ))}
            </div>

            {/* Square stage, capped to the viewport on desktop so the sticky image stays fully visible. */}
            <div className="relative aspect-square w-full overflow-hidden bg-white lg:ml-[132px] lg:max-h-[calc(100vh-148px)] lg:w-[calc(100%-132px)]">
                <Swiper
                    onSwiper={setSwiper}
                    onSlideChange={(s) => onChange(s.activeIndex)}
                    initialSlide={activeIndex}
                    className="h-full"
                >
                    {images.map((image, index) => (
                        <SwiperSlide key={image.src} className="flex items-center justify-center">
                            <img
                                src={image.src}
                                alt={image.alt}
                                loading={index === 0 ? 'eager' : 'lazy'}
                                className="h-full w-full object-contain"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    aria-label="View fullscreen"
                    className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center bg-white shadow-md"
                >
                    <ExpandIcon className="h-5 w-5" />
                </button>
                <button
                    type="button"
                    onClick={() => swiper?.slidePrev()}
                    disabled={activeIndex === 0}
                    aria-label="Previous image"
                    className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md disabled:opacity-0 lg:left-4"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <button
                    type="button"
                    onClick={() => swiper?.slideNext()}
                    disabled={activeIndex === images.length - 1}
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md disabled:opacity-0 lg:right-4"
                >
                    <ArrowRightIcon className="h-5 w-5" />
                </button>
            </div>

            {lightboxOpen && (
                <Lightbox images={images} index={activeIndex} onChange={onChange} onClose={() => setLightboxOpen(false)} />
            )}
        </div>
    );
}
