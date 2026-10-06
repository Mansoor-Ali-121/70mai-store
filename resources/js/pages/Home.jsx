import HeroCarousel from '@/components/home/HeroCarousel';
import MediaSection from '@/components/home/MediaSection';
import PressSection from '@/components/home/PressSection';
import SeriesExplorer from '@/components/home/SeriesExplorer';
import SiteLayout from '@/layouts/SiteLayout';
import { Head } from '@inertiajs/react';

export default function Home() {
    return (
        <SiteLayout>
            <Head title="70mai: Innovator in Smart Dash Cams">
                <meta
                    head-key="description"
                    name="description"
                    content="A global leader in smart car electronics since 2016. Trusted by more than 5 million users in 100+ countries. 70mai offers safety, intelligence, and peace of mind to your driving experience."
                />
            </Head>

            <h1 className="sr-only">70mai: Innovator in Smart Dash Cams</h1>

            <div className="w-full pb-10 md:pb-14">
                <HeroCarousel />
                <SeriesExplorer />
                <PressSection />
                <MediaSection />
            </div>
        </SiteLayout>
    );
}
