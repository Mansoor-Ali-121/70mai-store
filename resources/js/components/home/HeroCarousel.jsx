import { createContext, useContext } from 'react';
import AppLink from '@/components/site/AppLink';
import CloudImage from '@/components/site/CloudImage';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function NewBadge() {
    return (
        <div className="mb-3 inline-block rounded bg-[#ff631b] text-xs text-white">
            <span className="block scale-75">NEW</span>
        </div>
    );
}

/** Centered copy block shared by most slides, shifted left on desktop. */
function SlideCopy({ offset = 'mb-70', children }) {
    return (
        <div className="absolute top-0 z-1 flex h-full w-full items-center justify-center">
            <div className={`text-center md:mb-0 md:-translate-x-64 md:pr-20 md:text-left ${offset}`}>{children}</div>
        </div>
    );
}

function SlideActions({ className = '', children }) {
    return (
        <div className={`flex flex-col justify-center md:flex-row md:justify-start ${className}`}>
            <div className="mx-auto flex flex-col justify-center md:ml-0 md:flex-row md:justify-start">{children}</div>
        </div>
    );
}

function SlideButton({ href, newTab, light = false, secondary = false, children }) {
    return (
        <AppLink
            href={href}
            newTab={newTab}
            className={`min-w-[150px] rounded-full border px-8 py-2 text-center text-xs ${
                light ? 'border-white text-white' : 'border-primary'
            } ${secondary ? 'mt-3 md:ml-8 md:mt-0' : ''}`}
        >
            {children}
        </AppLink>
    );
}

// Lunar products for the banners, keyed by slug (from HomeController).
const ProductsContext = createContext({});

/**
 * "Learn More" / "Buy Now" for the banner's Lunar product. Falls back to the
 * dash cam collection when the product isn't in the catalogue (or unpublished).
 */
function ProductActions({ slug, light = false, className = '' }) {
    const product = useContext(ProductsContext)[slug];

    return (
        <SlideActions className={className}>
            {product ? (
                <>
                    <SlideButton href={`/products/${product.slug}#details`} light={light}>
                        {'Learn More >'}
                    </SlideButton>
                    <SlideButton href={`/products/${product.slug}`} light={light} secondary>
                        {product.available ? 'Buy Now >' : 'Sold Out'}
                    </SlideButton>
                </>
            ) : (
                <SlideButton href="/collections/dash-cams" light={light}>
                    {'Shop Dash Cams >'}
                </SlideButton>
            )}
        </SlideActions>
    );
}

const SLIDES = [
    {
        key: 'a900-ultra',
        background: 'index/a900ultra/bg_a900ultra_fixed.png',
        content: (
            <SlideCopy>
                <NewBadge />
                <h2 className="flex flex-col items-center justify-center gap-[4px] text-3xl font-bold text-white md:items-start md:gap-[6px] md:text-4xl">
                    <span>Dash Cam</span>
                    <CloudImage src="index/a900ultra/logo.png" alt="A900 Ultra" className="w-[235.5px] md:w-[323px]" />
                </h2>
                <p className="mt-4 text-center text-base text-white md:mt-5 md:text-left md:text-2xl">
                    The Flagship of Dual 4K Vision. <br />
                    Every Frame Synced.
                </p>
                <ProductActions slug="dash-cam-4k-a900-ultra" light className="mt-4 md:mt-5" />
            </SlideCopy>
        ),
    },
    {
        key: 'a900',
        background: 'index/img_a900.png',
        content: (
            <SlideCopy>
                <NewBadge />
                <h2 className="flex items-center justify-center text-3xl font-bold text-white md:justify-start md:text-4xl">
                    Dash Cam
                    <CloudImage src="a900/4ka900.png" alt="4K A900" className="w-[150px] md:w-[200px]" />
                </h2>
                <p className="mt-4 text-center text-base text-white md:mt-5 md:text-left md:text-2xl">
                    Dual True 4K. Dual HDR. <br />
                    Security in Every Frame.
                </p>
                {/* The plain 4K A900 isn't sold in the store, so this falls back to the collection. */}
                <ProductActions slug="dash-cam-4k-a900" light className="mt-4 md:mt-5" />
            </SlideCopy>
        ),
    },
    {
        key: 'share-your-capture',
        className: 'bg-black',
        background: 'index/2026-q3-ugc/ugc_banner.png',
        backgroundClassName: 'absolute w-full object-cover',
        content: (
            <div className="absolute left-0 top-[42px] mx-auto flex w-full max-w-[1004px] flex-col items-center justify-center px-[22px] md:left-[11%] md:top-1/2 md:w-fit md:-translate-y-1/2 md:items-start">
                <div className="mb-[14px] h-full max-h-[27px] w-full max-w-[180px] md:max-h-[36px] md:max-w-[240px]">
                    <CloudImage src="index/2026-q3-ugc/10th-logo.png" alt="70mai 10th anniversary" className="w-full" />
                </div>
                <h2 className="text-center text-[27px] font-extrabold leading-[36px] -tracking-[0.02em] text-white md:text-left md:text-[40px] md:leading-[54.5px]">
                    SHARE YOUR CAPTURE
                    <br />
                    WITH 70MAI
                </h2>
                <p className="mt-[6px] text-center text-sm font-semibold leading-tight text-white md:mt-[15px] md:text-left md:text-[20px] md:leading-tight">
                    WHERE MOMENTS BECOME EVIDENCE
                </p>
                <a
                    href="https://70mai.associates/4xVBPXx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-[24.5px] flex h-[37.1px] min-w-[129.35px] items-center justify-center gap-[6px] rounded-[19px] bg-white pl-[9px] pr-[2.5px] text-center transition-opacity duration-300 hover:opacity-60 md:mt-[30.5px] md:h-[42px] md:min-w-[146.5px] md:gap-[7px] md:rounded-[21px] md:pl-[10px] md:pr-[3px]"
                >
                    <span className="mx-auto text-xs font-semibold leading-tight text-black md:text-sm md:leading-tight">
                        SUBMIT &amp; WIN
                    </span>
                    <span className="flex h-[31.25px] w-[31.25px] items-center justify-center overflow-hidden rounded-full bg-black md:h-[35.4px] md:w-[35.4px]">
                        <svg
                            viewBox="0 0 11 6.65"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            className="block h-[6.65px] w-[11px] md:h-[7.4px] md:w-[12px]"
                        >
                            <path
                                d="M1.3 3.325H6L9.7 3.325L6 1.15M6 3.325L9.7 3.325L6 5.5"
                                stroke="white"
                                strokeWidth="1.15"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                </a>
            </div>
        ),
    },
    {
        key: 'creators-club',
        className: 'bg-white md:text-white',
        background: 'index/2026-q3-creator-club/bg_creatorClub.png',
        content: (
            <SlideCopy offset="mb-86">
                <h2 className="pb-[8px] text-center text-[28px] font-bold leading-[30px] text-black md:pb-[6.5px] md:text-left md:text-[35px] md:leading-tight md:text-white">
                    Creators Club
                </h2>
                <p className="pb-[15px] text-center text-base font-medium leading-tight text-black md:pb-[22px] md:text-left md:text-[21px] md:leading-tight md:text-white">
                    We provide the tech, you tell the story.
                </p>
                <SlideActions>
                    <a
                        href="https://bit.ly/4gc8kJd"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-[32px] min-w-[104px] items-center justify-center rounded-full border border-primary px-[20px] md:h-[25px] md:border-white"
                    >
                        <span className="text-sm md:text-xs">{'Join now >'}</span>
                    </a>
                </SlideActions>
            </SlideCopy>
        ),
    },
    {
        key: 'a810-lite',
        background: 'index/bg_a810lite.png',
        content: (
            <SlideCopy>
                <NewBadge />
                <h2 className="pb-2 text-3xl font-bold md:text-4xl">
                    Dash Cam 4K A810 <span className="text-[#FF631B]">Lite</span>
                </h2>
                <p className="whitespace-pre-line pb-4 text-base font-medium md:text-2xl">
                    Lite on Size. Strong in 4K Detail.
                </p>
                <ProductActions slug="dash-cam-4k-a810-lite" />
            </SlideCopy>
        ),
    },
    {
        key: 'm310-plus-4k',
        background: 'index/m310plus4KBanner.png',
        content: (
            <SlideCopy>
                <NewBadge />
                <h2 className="mx-auto max-w-full pb-2 text-center text-3xl font-bold text-white md:mx-0 md:text-left md:text-4xl">
                    70mai Dash Cam
                    <br />
                    M310 Plus <span className="text-[#FF631B]">4K</span>
                </h2>
                <p className="whitespace-pre-line pb-4 text-base font-medium text-white md:text-2xl">
                    Tiny Body. Big 4K Performance.
                </p>
                <ProductActions slug="dash-cam-m310-plus-4k" light />
            </SlideCopy>
        ),
    },
    {
        key: 't800',
        background: 'index/bg.png',
        content: (
            <SlideCopy offset="mb-50">
                <div className="mb-5 flex items-center justify-center md:justify-start">
                    <CloudImage src="index/img_reddot.png" alt="Red Dot Design Award" />
                </div>
                <h2 className="flex items-center justify-center pb-2 text-3xl font-bold text-white md:justify-start md:text-4xl">
                    <span className="mr-[9px]">Dash Cam</span>
                    <CloudImage src="index/img_4k t800.png" alt="4K T800" />
                </h2>
                <p className="mt-4 text-center text-base text-white md:mt-5 md:text-left md:text-2xl">
                    Triple View. Dual 4K. Full Story.
                </p>
                <p className="my-4 whitespace-pre-line text-center text-xs font-medium text-[#ccc] md:text-left md:text-base">
                    The first-ever 3-channel dash cam with dual 4k front and rear recording.
                </p>
                <ProductActions slug="4k-t800-dash-cam" light />
            </SlideCopy>
        ),
    },
];

export default function HeroCarousel({ products = {} }) {
    return (
        <ProductsContext.Provider value={products}>
        <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            loop
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation
            className="site-swiper w-full"
        >
            {SLIDES.map((slide) => (
                <SwiperSlide key={slide.key} className={`pb-[141.6%] md:pb-[28.81%] ${slide.className ?? 'bg-white'}`}>
                    <CloudImage src={slide.background} className={slide.backgroundClassName ?? 'absolute w-full'} />
                    {slide.content}
                </SwiperSlide>
            ))}
        </Swiper>
        </ProductsContext.Provider>
    );
}
