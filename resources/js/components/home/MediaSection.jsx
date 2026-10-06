import AppLink from '@/components/site/AppLink';
import CloudImage from '@/components/site/CloudImage';
import SectionTitle from './SectionTitle';

const MEDIA_ITEMS = [
    {
        image: 'dashcamIndex/img_p5_1.png',
        alt: 'Photos captured with 70mai dash cams',
        href: 'https://drive.google.com/drive/folders/1rg7pxvv7yBCVbfohSld3oAdAZVQuMBNr?usp=sharing',
        label: 'Get Media Kit >',
    },
    {
        image: 'dashcamIndex/iimg_p5_2.png',
        alt: '70mai dash cam video reviews',
        href: '/news?tab=1',
        label: 'Watch Video Reviews >',
    },
];

export default function MediaSection() {
    return (
        <section>
            <div className="flex flex-col items-center pb-6 pt-14">
                <SectionTitle>70mai Photos &amp; Videos</SectionTitle>
            </div>
            <div className="flex w-full flex-col px-2 md:flex-row md:gap-2">
                {MEDIA_ITEMS.map((item) => (
                    <div key={item.href} className="relative flex w-full flex-col items-center md:w-1/2">
                        <CloudImage
                            src={item.image}
                            alt={item.alt}
                            pictureClassName="w-full"
                            className="w-full"
                            loading="lazy"
                        />
                        <AppLink
                            href={item.href}
                            className="mx-auto mb-10 mt-6 inline-block rounded-full border border-gray-300 px-8 py-2 text-xs text-igray md:absolute md:bottom-0 md:mt-0 md:border-white md:text-white"
                        >
                            {item.label}
                        </AppLink>
                    </div>
                ))}
            </div>
        </section>
    );
}
