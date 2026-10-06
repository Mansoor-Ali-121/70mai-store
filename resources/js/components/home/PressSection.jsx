import CloudImage from '@/components/site/CloudImage';
import { useState } from 'react';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import SectionTitle from './SectionTitle';

import 'swiper/css';

const PRESS_QUOTES = [
    {
        outlet: 'PCWorld',
        logo: 'dashcamIndex/iicon_pcworld_active.png',
        logoInactive: 'dashcamIndex/iicon_pcworld.png',
        quote: "The captures from the 70mai A810 are among the best I've seen.",
    },
    {
        outlet: 'WIRED',
        logo: 'dashcamIndex/iicon_wiired_active.png',
        logoInactive: 'dashcamIndex/iicon_wiired.png',
        quote: 'The Dash Cam Omni is an ideal solution both when driving and when parking. The image quality is exceptional.',
    },
    {
        outlet: 'TechRadar',
        logo: 'dashcamIndex/iicon_techradar_active.png',
        logoInactive: 'dashcamIndex/iicon_techradar.png',
        quote: 'The 4K HDR Dash Cam from 70mai is a fantastic all-rounder.',
    },
    {
        outlet: 'stern',
        logo: 'dashcamIndex/iicon_stern_active.png',
        logoInactive: 'dashcamIndex/iicon_stern.png',
        quote: 'The 70mai dash cam could be particularly useful for driving at night, as it delivers very good image quality in unfavorable lighting conditions.',
    },
];

function QuoteMark({ className, children }) {
    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none absolute z-1 flex max-h-[95px] max-w-[95px] select-none items-center justify-center text-[26rem] text-[#EFEFEF] ${className}`}
        >
            {children}
        </div>
    );
}

export default function PressSection() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className="flex flex-col items-center bg-gradient-to-b from-white to-[#f8f8f6] pb-6 pt-14">
            <SectionTitle>In the Press</SectionTitle>

            {/* Desktop: outlet logos act as tabs for the quote below. */}
            <div className="hidden flex-col items-center md:flex">
                <ul className="flex">
                    {PRESS_QUOTES.map((press, index) => (
                        <li key={press.outlet} className="px-5">
                            <button type="button" onClick={() => setActiveIndex(index)} aria-pressed={index === activeIndex}>
                                <CloudImage
                                    src={index === activeIndex ? press.logo : press.logoInactive}
                                    alt={press.outlet}
                                    loading="lazy"
                                />
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="relative mt-12 flex h-[168px] w-[961px] items-center justify-center">
                    <QuoteMark className="left-0 top-[6rem]">“</QuoteMark>
                    <QuoteMark className="-bottom-[6rem] right-0">”</QuoteMark>
                    <blockquote className="relative z-10 px-[2rem] text-center text-2xl font-extrabold tracking-[0.08rem]">
                        {PRESS_QUOTES[activeIndex].quote}
                    </blockquote>
                </div>
            </div>

            {/* Mobile: auto-playing carousel. Hidden via a wrapper because Swiper's
                own `.swiper { display: block }` would override `md:hidden`. */}
            <div className="w-full md:hidden">
            <Swiper modules={[Autoplay]} loop autoplay={{ delay: 5000, disableOnInteraction: false }}>
                {PRESS_QUOTES.map((press) => (
                    <SwiperSlide key={press.outlet}>
                        <CloudImage src={press.logo} alt={press.outlet} className="mx-auto mt-5 h-[60px]" />
                        <div className="relative mx-auto flex h-[320px] w-[375px] max-w-full items-center justify-center">
                            <QuoteMark className="left-[2rem] top-[8rem]">“</QuoteMark>
                            <QuoteMark className="-bottom-[4.5rem] right-[2rem]">”</QuoteMark>
                            <div className="relative z-10 flex flex-1 items-center justify-center">
                                <blockquote className="px-[2rem] text-center text-2xl font-extrabold tracking-[0.08rem]">
                                    {press.quote}
                                </blockquote>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            </div>
        </section>
    );
}
