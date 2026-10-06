import AppLink from '@/components/site/AppLink';
import CloudImage from '@/components/site/CloudImage';
import { useLayoutEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SectionTitle from './SectionTitle';

import 'swiper/css';

const SERIES = [
    {
        tab: 'Pioneering - X Series',
        title: 'Dash Cam 4K Omni',
        subtitle: 'The Next-Gen 360° Dash Cam with Dual Brilliance.',
        image: 'index/img_x800.png',
        background: 'index/img_x800_bg.png',
        learnMoreHref: '/4komni',
        buyNowHref: 'https://bit.ly/43jQrTI',
    },
    {
        tab: 'With Screen - A Series',
        title: 'Dash Cam 4K A810',
        subtitle: 'Extreme Clarity. Extreme Security.',
        image: 'index/img_a810.png',
        background: 'index/img_a810_bg.png',
        learnMoreHref: '/a810',
        buyNowHref: 'https://70mai.store/collections/dash-cam/products/dash-cam-a810',
    },
    {
        tab: 'Screenless - M Series',
        title: 'Dash Cam M310',
        subtitle: 'Next-Level Clarity within Reach.',
        image: 'index/img_m310.png',
        background: 'index/img_m310_bg.png',
        learnMoreHref: '/m310',
        buyNowHref: 'https://70mai.store/collections/dash-cam/products/m310-dash-cam',
    },
    {
        tab: 'Streaming - S Series',
        title: 'Dash Cam S500',
        subtitle: 'Touch into the Brilliance of 3K Streaming.',
        image: 'index/img_s500.png',
        background: 'index/img_s500_bg.png',
        learnMoreHref: '/s500',
        buyNowHref: 'https://70mai.store/collections/dash-cam/products/s500-rearview-dash-cam',
    },
];

const BUTTON_CLASSES = 'inline-block w-[135px] rounded-full border border-muted py-2 text-center text-xs md:min-w-[130px]';

export default function SeriesExplorer() {
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
    }, [activeIndex]);

    return (
        <section className="w-full">
            <div className="flex flex-col items-center pb-6 pt-14">
                <SectionTitle>Explore By Series</SectionTitle>
            </div>

            <div className="w-full overflow-hidden px-5">
                <div className="hide-scrollbar w-full overflow-x-scroll">
                    <div className="relative mx-auto mb-12 w-fit md:mb-9">
                        <div role="tablist" className="mb-4 flex w-fit justify-center gap-x-5 md:mb-6 md:gap-x-14">
                            {SERIES.map((series, index) => (
                                <button
                                    key={series.tab}
                                    ref={(el) => (tabRefs.current[index] = el)}
                                    type="button"
                                    role="tab"
                                    aria-selected={index === activeIndex}
                                    onClick={() => swiper?.slideTo(index)}
                                    className={`min-w-[160px] text-center text-sm text-primary md:min-w-[180px] md:text-base ${
                                        index === activeIndex ? 'font-bold' : 'opacity-50'
                                    }`}
                                >
                                    {series.tab}
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
                {SERIES.map((series) => (
                    <SwiperSlide key={series.title} className="bg-white">
                        <div className="flex w-full flex-col-reverse bg-[#F9F9F9] md:flex-row">
                            <div className="w-full md:relative md:w-1/2">
                                <div className="w-full md:absolute md:left-0 md:top-0 md:flex md:h-full md:items-start md:justify-center">
                                    <CloudImage src={series.image} alt={series.title} className="w-full" />
                                </div>
                                <CloudImage src={series.background} className="hidden w-full md:block" />
                            </div>

                            <div className="w-full md:relative md:w-1/2">
                                <CloudImage src="index/img_bg.png" className="hidden w-full md:block" />
                                <div className="flex min-h-70 w-full flex-col items-center justify-center md:absolute md:left-0 md:top-0 md:h-full md:items-start md:pl-[24%] md:pt-[5%]">
                                    <h3 className="text-center text-3xl font-bold md:text-left md:text-2xl">{series.title}</h3>
                                    <p className="mb-8 mt-5 text-center text-base font-light md:my-5 md:text-left md:text-sm">
                                        {series.subtitle}
                                    </p>
                                    <div className="flex flex-row">
                                        <AppLink href={series.learnMoreHref} className={`${BUTTON_CLASSES} mr-5 md:mr-0`}>
                                            Learn More
                                        </AppLink>
                                        <AppLink href={series.buyNowHref} className={`${BUTTON_CLASSES} md:ml-8`}>
                                            Buy Now
                                        </AppLink>
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
