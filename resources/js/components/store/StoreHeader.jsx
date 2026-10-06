import AppLink from '@/components/site/AppLink';
import Logo from '@/components/site/Logo';
import { SOCIAL_LINKS } from '@/components/site/SiteFooter';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { CartIcon, ChevronDownIcon, CloseIcon, MenuIcon, SearchIcon, UserIcon } from './icons';

const UTILITY_LINKS = [
    { label: 'Dual Channels', href: '/collections/dual-channel' },
    { label: 'Single Channel', href: '/collections/single-channel' },
    { label: 'Auto Accessories', href: '/collections/accessories' },
    { label: 'Hardwire Kit', href: '/products/4g-hardwire-kit' },
];

const NAV_ITEMS = [
    {
        label: 'Dash Cams',
        children: [
            { label: 'Dash Cam 4K Omni', href: '/products/dash-cam-4k-omni' },
            { label: 'Dash Cam 4K T800', href: '/products/4k-t800-dash-cam' },
            { label: 'Dash Cam 4K A810S', href: '/products/4k-a810s' },
            { label: 'Dash Cam 4K M800', href: '/products/4k-m800' },
        ],
    },
    {
        label: 'Accessories',
        children: [
            { label: 'Micro SD Card', href: '/products/microsd-card' },
            { label: 'Hardwire Kit', href: '/products/4g-hardwire-kit' },
            { label: 'CPL Filter for 4K Omni', href: '/products/cpl-filter-for-4k-omni' },
        ],
    },
    {
        label: 'Support',
        children: [
            { label: 'Customer Support', href: '/support' },
            { label: 'App Download', href: '/download' },
        ],
    },
    { label: 'Installation Service', href: '/support/installation-service' },
    {
        label: 'Creators Hub',
        children: [
            { label: 'Drive with 70mai', href: 'https://70mai.associates/4xVBPXx', newTab: true },
            { label: 'Creators Club', href: 'https://bit.ly/4gc8kJd', newTab: true },
        ],
    },
];

const HEADER_SOCIALS = SOCIAL_LINKS.filter((social) => ['Facebook', 'Instagram', 'YouTube'].includes(social.name));

function UtilityBar() {
    return (
        <div className="hidden bg-[#F2F2F2] text-[15px] lg:block">
            <div className="mx-auto flex h-[46px] max-w-[1920px] items-center justify-between px-6 xl:px-10 2xl:px-[150px]">
                <ul className="flex gap-6">
                    {UTILITY_LINKS.map((link) => (
                        <li key={link.label}>
                            <AppLink href={link.href} className="hover:text-mai">
                                {link.label}
                            </AppLink>
                        </li>
                    ))}
                </ul>
                <div className="flex items-center gap-4">
                    {HEADER_SOCIALS.map((social) => (
                        <a
                            key={social.name}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.name}
                            className="hover:text-mai"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-[18px] w-[18px]">
                                <path d={social.path} />
                            </svg>
                        </a>
                    ))}
                    <span className="ml-4 flex items-center gap-1">
                        United States (USD $)
                        <ChevronDownIcon className="h-4 w-4" />
                    </span>
                </div>
            </div>
        </div>
    );
}

function DesktopNavItem({ item }) {
    if (!item.children) {
        return (
            <li>
                <AppLink href={item.href} className="flex h-full items-center hover:text-mai">
                    {item.label}
                </AppLink>
            </li>
        );
    }

    return (
        <li className="group relative flex h-full items-center">
            <button type="button" className="flex items-center gap-1 hover:text-mai" aria-haspopup="true">
                {item.label}
                <ChevronDownIcon className="h-4 w-4 transition-transform group-hover:rotate-180" />
            </button>
            <ul className="invisible absolute left-0 top-full z-50 min-w-[240px] translate-y-1 rounded-b-md border-t-2 border-mai bg-white py-3 opacity-0 shadow-lg transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                {item.children.map((child) => (
                    <li key={child.label}>
                        <AppLink
                            href={child.href}
                            newTab={child.newTab}
                            className="block px-5 py-2 text-base hover:bg-[#F7F7F7] hover:text-mai"
                        >
                            {child.label}
                        </AppLink>
                    </li>
                ))}
            </ul>
        </li>
    );
}

function MobileMenu({ onClose }) {
    return (
        <div className="absolute inset-x-0 top-full max-h-[calc(100vh-4rem)] overflow-y-auto border-t bg-white shadow-lg lg:hidden">
            <ul className="divide-y px-5">
                {NAV_ITEMS.map((item) => (
                    <li key={item.label} className="py-3">
                        {item.children ? (
                            <details className="group">
                                <summary className="flex cursor-pointer list-none items-center justify-between text-lg">
                                    {item.label}
                                    <ChevronDownIcon className="h-5 w-5 transition-transform group-open:rotate-180" />
                                </summary>
                                <ul className="space-y-2 pb-1 pl-4 pt-3">
                                    {item.children.map((child) => (
                                        <li key={child.label}>
                                            <AppLink href={child.href} newTab={child.newTab} onClick={onClose} className="block text-muted">
                                                {child.label}
                                            </AppLink>
                                        </li>
                                    ))}
                                </ul>
                            </details>
                        ) : (
                            <AppLink href={item.href} onClick={onClose} className="block text-lg">
                                {item.label}
                            </AppLink>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function StoreHeader({ cartCount = 0 }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <UtilityBar />
            <header className="sticky top-0 z-40 border-b bg-white">
                <div className="relative mx-auto flex h-16 max-w-[1920px] items-center px-4 lg:h-[100px] lg:px-6 xl:px-10 2xl:px-[150px]">
                    <button
                        type="button"
                        onClick={() => setMenuOpen((open) => !open)}
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={menuOpen}
                        className="mr-3 lg:hidden"
                    >
                        {menuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>

                    <Link href="/" aria-label="70mai home" className="shrink-0">
                        <Logo className="w-[92px] lg:w-[128px]" />
                    </Link>

                    <nav aria-label="Main" className="ml-8 hidden h-full lg:block xl:ml-12">
                        <ul className="flex h-full items-center gap-6 text-base xl:gap-9 xl:text-[19px]">
                            {NAV_ITEMS.map((item) => (
                                <DesktopNavItem key={item.label} item={item} />
                            ))}
                        </ul>
                    </nav>

                    <div className="ml-auto flex items-center gap-4 lg:gap-6">
                        <button type="button" aria-label="Search" className="hover:text-mai">
                            <SearchIcon className="h-6 w-6 lg:h-7 lg:w-7" />
                        </button>
                        <Link href="/account" aria-label="Account" className="hidden hover:text-mai sm:block">
                            <UserIcon className="h-6 w-6 lg:h-7 lg:w-7" />
                        </Link>
                        <Link href="/cart" aria-label={`Cart, ${cartCount} items`} className="relative hover:text-mai">
                            <CartIcon className="h-6 w-6 lg:h-7 lg:w-7" />
                            {cartCount > 0 && (
                                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-mai px-1 text-xs font-semibold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>

                    {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
                </div>
            </header>
        </>
    );
}
