import { useEffect, useState } from 'react';
import AppLink from './AppLink';

const STORAGE_KEY = 'cookie-consent';

export default function CookieBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        try {
            setVisible(!localStorage.getItem(STORAGE_KEY));
        } catch {
            // Storage unavailable (private mode, blocked site data): don't nag.
        }
    }, []);

    const accept = () => {
        try {
            localStorage.setItem(STORAGE_KEY, 'accepted');
        } catch {
            // Ignore; the banner is still dismissed for this page view.
        }
        setVisible(false);
    };

    if (!visible) {
        return null;
    }

    return (
        <section className="fixed bottom-0 z-9999 w-full bg-[#FBFBFB] px-5 py-12 text-muted shadow-[0_10px_30px_0_rgba(12,1,0,0.2)] md:px-12 md:py-15">
            <div className="mx-auto flex w-screen-xl max-w-full flex-col items-center justify-center md:flex-row">
                <p className="w-full md:w-1/2">
                    70mai uses strictly necessary cookies and related technologies to enable the website to function.
                    By clicking on accept, you agree to the use of this technology across the web. For more information
                    on cookie practices, please refer to our{' '}
                    <AppLink href="/cookie-policy" className="text-mai">
                        Cookie Policy
                    </AppLink>
                    .
                </p>
                <div className="flex w-full flex-col gap-6 pb-10 pt-6 md:w-1/2 md:flex-row md:justify-end md:pb-0 md:pt-0">
                    <AppLink
                        href="/cookie-setting"
                        className="rounded-full border border-[#dcdfe6] bg-white px-6 py-3 text-center text-sm font-light text-[#606266]"
                    >
                        Manage Cookies
                    </AppLink>
                    <button
                        type="button"
                        onClick={accept}
                        className="rounded-full bg-mai px-6 py-3 text-sm font-light text-white"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </section>
    );
}
