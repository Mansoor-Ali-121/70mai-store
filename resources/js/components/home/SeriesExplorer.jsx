import CloudImage from '@/components/site/CloudImage';
import { formatMoney } from '@/lib/money';
import { Link } from '@inertiajs/react';
import { useLayoutEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SectionTitle from './SectionTitle';

import 'swiper/css';

const BUTTON_CLASSES = 'inline-block w-[135px] rounded-full border border-muted py-2 text-center text-xs md:min-w-[130px]';

/**
 * "Explore By Series": one tab per product in Lunar's "Explore by Series"
 * collection (order and membership are managed in the Lunar admin).
 *
 * @param {{ series: Array<{ id: number, slug: string, url: string, short_name: string, series: ?string,
 *   tagline: ?string, image: ?string, price: ?number, price_varies: boolean, available: boolean }> }} props
 */
export default function SeriesExplorer({ series = [] }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [swiper, setSwiper] = useState(null);
    const [indicator, setIndicator] = useState({ left: 0, width: 180 });
    const tabRefs = useRef([]);

    // Slide the orange indicator under the active tab.
    useLayoutEffect(() => {
        const measure = () => {
            const tab = tabRefs.current[activeIndex];
            if (tab) {
                setIndicator({ left: tab.offsetLeft, width: tab.offsetWidth });
            }
        };

        measure();
        window.addEventListener('resize', measure);

        return () => window.removeEventListener('resize', measure);
    }, [activeIndex, series.length]);

    if (series.length === 0) {
        return null;
    }

    return (
        <section className="w-full">
            <div className="flex flex-col items-center pb-6 pt-14">
                <SectionTitle>Explore By Series</SectionTitle>
            </div>

            <div className="w-full overflow-hidden px-5">
                <div className="hide-scrollbar w-full overflow-x-scroll">
                    <div className="relative mx-auto mb-12 w-fit md:mb-9">
                        <div role="tablist" className="mb-4 flex w-fit justify-center gap-x-5 md:mb-6 md:gap-x-14">
                            {series.map((product, index) => (
                                <button
                                    key={product.id}
                                    ref={(el) => (tabRefs.current[index] = el)}
                                    type="button"
                                    role="tab"
                                    aria-selected={index === activeIndex}
                                    onClick={() => swiper?.slideTo(index)}
                                    className={`min-w-[160px] text-center text-sm text-primary md:min-w-[180px] md:text-base ${
                                        index === activeIndex ? 'font-bold' : 'opacity-50'
                                    }`}
                                >
                                    {product.series || product.short_name}
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <div className="h-px w-full bg-black opacity-10" />
                            <div
                                className="absolute -top-px left-0 h-[3px] bg-[#FF4B00] transition-all duration-300 ease-in-out"
                                style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Swiper onSwiper={setSwiper} onSlideChange={(s) => setActiveIndex(s.activeIndex)} className="w-full">
                {series.map((product) => (
                    <SwiperSlide key={product.id} className="bg-white">
                        <div className="flex w-full flex-col-reverse bg-[#F9F9F9] md:flex-row">
                            <div className="relative aspect-square w-full bg-[#F3F3F3] md:aspect-auto md:w-1/2">
                                {product.image && (
                                    <img
                                        src={product.image}
                                        alt={product.short_name}
                                        loading="lazy"
                                        className="absolute inset-0 h-full w-full object-contain p-6 mix-blend-multiply md:p-10"
                                    />
                                )}
                            </div>

                            <div className="w-full md:relative md:w-1/2">
                                <CloudImage src="index/img_bg.png" className="hidden w-full md:block" />
                                <div className="flex min-h-70 w-full flex-col items-center justify-center px-5 md:absolute md:left-0 md:top-0 md:h-full md:items-start md:pl-[24%] md:pt-[5%]">
                                    <h3 className="text-center text-3xl font-bold md:text-left md:text-2xl">{product.short_name}</h3>
                                    {product.tagline && (
                                        <p className="mt-5 text-center text-base font-light md:my-5 md:text-left md:text-sm">{product.tagline}</p>
                                    )}
                                    {product.price !== null && (
                                        <p className="mb-8 mt-3 text-center text-sm md:mb-5 md:mt-0 md:text-left">
                                            {product.available ? (
                                                <>
                                                    {product.price_varies && 'From '}
                                                    {formatMoney(product.price)}
                                                </>
                                            ) : (
                                                <span className="text-muted">Sold out</span>
                                            )}
                                        </p>
                                    )}
                                    <div className="flex flex-row">
                                        <Link href={`/products/${product.slug}#details`} className={`${BUTTON_CLASSES} mr-5 md:mr-0`}>
                                            Learn More
                                        </Link>
                                        <Link href={`/products/${product.slug}`} className={`${BUTTON_CLASSES} md:ml-8`}>
                                            Buy Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
