import { useEffect, useRef } from 'react';

const COL_SPAN = { 1: '', 2: 'col-span-2' };
const ROW_SPAN = { 1: '', 2: 'lg:row-span-2' };

function FeatureTiles({ tiles }) {
    return (
        <div className="grid auto-rows-[250px] grid-cols-2 gap-4 lg:auto-rows-[300px] lg:grid-cols-4 lg:gap-6">
            {tiles.map((tile) => (
                <div
                    key={tile.image}
                    className={`relative overflow-hidden bg-black ${COL_SPAN[tile.cols] ?? ''} ${ROW_SPAN[tile.rows] ?? ''}`}
                >
                    <img src={tile.image} alt={tile.title ? '' : tile.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                    {tile.title && (
                        <h3 className="relative break-words p-5 text-2xl font-semibold leading-tight text-white lg:p-8 lg:text-3xl 2xl:p-10 2xl:text-[40px]">{tile.title}</h3>
                    )}
                </div>
            ))}
        </div>
    );
}

/** Autoplays muted while on screen; nothing downloads until it scrolls into view. */
function InViewVideo({ src, poster }) {
    const ref = useRef(null);

    useEffect(() => {
        const video = ref.current;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
        observer.observe(video);

        return () => observer.disconnect();
    }, []);

    return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" className="w-full" />;
}

function SectionCopy({ title, body, note }) {
    return (
        <div className="mx-auto max-w-[1200px] text-center">
            <h3 className="text-3xl font-semibold leading-tight lg:text-[44px]">{title}</h3>
            {body && <p className="mt-6 text-lg leading-relaxed lg:text-[21px]">{body}</p>}
            {note && <p className="mt-4 text-base text-muted lg:text-lg">{note}</p>}
        </div>
    );
}

function FeatureSection({ section }) {
    return (
        <section className="space-y-10">
            <SectionCopy title={section.title} body={section.body} note={section.note} />

            {section.stats && (
                <dl className="mx-auto grid max-w-3xl grid-cols-3 gap-6 text-center">
                    {section.stats.map((stat) => (
                        <div key={stat.label} className="flex flex-col">
                            <dt className="order-last text-sm text-muted lg:text-base">{stat.label}</dt>
                            <dd className="text-3xl font-bold text-mai lg:text-5xl">{stat.value}</dd>
                        </div>
                    ))}
                </dl>
            )}

            {section.image && (
                <img src={section.image} alt={section.title} loading="lazy" className="mx-auto max-h-[640px] w-auto max-w-full rounded-2xl" />
            )}

            {section.compare && (
                <div className="mx-auto grid max-w-[1200px] gap-4 sm:grid-cols-2 lg:gap-6">
                    {section.compare.map((item) => (
                        <figure key={item.label} className="overflow-hidden rounded-2xl">
                            <img src={item.image} alt={`${section.title}: ${item.label}`} loading="lazy" className="w-full" />
                            <figcaption className="bg-[#F5F5F5] py-3 text-center text-lg font-semibold">{item.label}</figcaption>
                        </figure>
                    ))}
                </div>
            )}

            {section.cards && (
                <div className="mx-auto grid max-w-[1200px] gap-6 md:grid-cols-3">
                    {section.cards.map((card) => (
                        <article key={card.title} className="overflow-hidden rounded-2xl bg-[#F7F7F7]">
                            <img src={card.image} alt="" loading="lazy" className="w-full" />
                            <div className="space-y-2 p-6">
                                <h4 className="text-xl font-semibold">{card.title}</h4>
                                <p className="text-muted">{card.body}</p>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

export default function ProductDetails({ banner, tiles = [], spotlight, sections = [] }) {
    return (
        <div className="space-y-16 lg:space-y-24">
            {banner && (
                <picture>
                    <source media="(max-width: 767px)" srcSet={banner.mobile_image} />
                    <img src={banner.image} alt={banner.alt} className="w-full" />
                </picture>
            )}

            {tiles.length > 0 && <FeatureTiles tiles={tiles} />}

            {spotlight && (
                <section className="space-y-10">
                    <SectionCopy title={spotlight.title} body={spotlight.body} note={spotlight.note} />
                    {spotlight.video && <InViewVideo src={spotlight.video} poster={spotlight.poster} />}
                </section>
            )}

            {sections.map((section) => (
                <FeatureSection key={section.title} section={section} />
            ))}
        </div>
    );
}
