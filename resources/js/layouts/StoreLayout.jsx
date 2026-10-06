import CookieBanner from '@/components/site/CookieBanner';
import SiteFooter from '@/components/site/SiteFooter';
import StoreHeader from '@/components/store/StoreHeader';
import { usePage } from '@inertiajs/react';

export default function StoreLayout({ children }) {
    const { cart } = usePage().props;

    return (
        <div className="min-h-screen bg-white text-primary">
            <StoreHeader cartCount={cart?.count ?? 0} />
            <main>{children}</main>
            <SiteFooter />
            <CookieBanner />
        </div>
    );
}
