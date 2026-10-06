import CookieBanner from '@/components/site/CookieBanner';
import SiteFooter from '@/components/site/SiteFooter';
import SiteHeader from '@/components/site/SiteHeader';

export default function SiteLayout({ children }) {
    return (
        <div className="max-w-full">
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
            <CookieBanner />
        </div>
    );
}
