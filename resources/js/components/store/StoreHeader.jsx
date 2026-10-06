import AppLink from '@/components/site/AppLink';
import Logo from '@/components/site/Logo';
import { SOCIAL_LINKS } from '@/components/site/SiteFooter';
import { officialUrl } from '@/lib/officialSite';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { CartIcon, ChevronDownIcon, CloseIcon, MenuIcon, SearchIcon } from './icons';

// Menu items after the Lunar collections: info pages on the official site and creator programmes.
const STATIC_NAV_ITEMS = [
    {
        label: 'Support',
        children: [
            { label: 'Customer Support', href: officialUrl('support') },
            { label: 'App Download', href: officialUrl('download') },
        ],
    },
    { label: 'Installation Service', href: officialUrl('support/installation-service') },
    {
        label: 'Creators Hub',
        children: [
            { label: 'Drive with 70mai', href: 'https://70mai.associates/4xVBPXx', newTab: true },
            { label: 'Creators Club', href: 'https://bit.ly/4gc8kJd', newTab: true },
        ],
    },
];

const HEADER_SOCIALS = SOCIAL_LINKS.filter((social) => ['Facebook', 'Instagram', 'YouTube'].includes(social.name));

function UtilityBar({ links }) {
    return (
        <div className="hidden bg-[#F2F2F2] text-[15px] lg:block">
            <div className="mx-auto flex h-[46px] max-w-[1920px] items-center justify-between px-6 xl:px-10 2xl:px-[150px]">
                <ul className="flex gap-6">
                    {links.map((link) => (
                        <li key={link.href}>
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
    if (!item.children?.length) {
        return (
            <li>
                <AppLink href={item.href} className="flex h-full items-center hover:text-mai">
                    {item.label}
                </AppLink>
            </li>
        );
    }

    const label = (
        <>
            {item.label}
            <ChevronDownIcon className="h-4 w-4 transition-transform group-hover:rotate-180" />
        </>
    );

    return (
        <li className="group relative flex h-full items-center">
            {item.href ? (
                <AppLink href={item.href} className="flex items-center gap-1 hover:text-mai" aria-haspopup="true">
                    {label}
                </AppLink>
            ) : (
                <button type="button" className="flex items-center gap-1 hover:text-mai" aria-haspopup="true">
                    {label}
                </button>
            )}
            <ul className="invisible absolute left-0 top-full z-50 min-w-[260px] translate-y-1 rounded-b-md border-t-2 border-mai bg-white py-3 opacity-0 shadow-lg transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                {item.children.map((child) => (
                    <li key={child.href}>
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

function MobileMenu({ items, onClose }) {
    return (
        <div className="absolute inset-x-0 top-full max-h-[calc(100vh-4rem)] overflow-y-auto border-t bg-white shadow-lg lg:hidden">
            <ul className="divide-y px-5">
                {items.map((item) => (
                    <li key={item.label} className="py-3">
                        {item.children?.length ? (
                            <details className="group">
                                <summary className="flex cursor-pointer list-none items-center justify-between text-lg">
                                    {item.label}
                                    <ChevronDownIcon className="h-5 w-5 transition-transform group-open:rotate-180" />
                                </summary>
                                <ul className="space-y-2 pb-1 pl-4 pt-3">
                                    {item.href && (
                                        <li>
                                            <AppLink href={item.href} onClick={onClose} className="block font-medium">
                                                Shop all {item.label}
                                            </AppLink>
                                        </li>
                                    )}
                                    {item.children.map((child) => (
                                        <li key={child.href}>
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

function SearchBar({ onClose }) {
    const [query, setQuery] = useState('');

    const submit = (event) => {
        event.preventDefault();
        router.get('/search', { q: query.trim() });
        onClose();
    };

    return (
        <form onSubmit={submit} className="border-t bg-white">
            <div className="mx-auto flex max-w-[1920px] gap-3 px-4 py-4 lg:px-6 xl:px-10 2xl:px-[150px]">
                <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search dash cams and accessories"
                    aria-label="Search products"
                    autoFocus
                    className="flex-1 rounded-md border border-[#D9D9D9] px-4 py-3 focus:border-primary focus:outline-none"
                />
                <button type="submit" className="bg-mai px-6 font-medium text-white hover:bg-[#e8560f]">
                    Search
                </button>
            </div>
        </form>
    );
}

export default function StoreHeader({ cartCount = 0 }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    // Lunar collections (Dash Cams, Accessories, …) with their products, shared by HandleInertiaRequests.
    const navigation = usePage().props.navigation ?? [];
    const navItems = [...navigation.filter((item) => item.href !== '/collections/hardwire-kits'), ...STATIC_NAV_ITEMS];

    return (
        <>
            <UtilityBar links={navigation} />
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
                            {navItems.map((item) => (
                                <DesktopNavItem key={item.label} item={item} />
                            ))}
                        </ul>
                    </nav>

                    <div className="ml-auto flex items-center gap-4 lg:gap-6">
                        <button
                            type="button"
                            onClick={() => setSearchOpen((open) => !open)}
                            aria-label={searchOpen ? 'Close search' : 'Search'}
                            aria-expanded={searchOpen}
                            className="hover:text-mai"
                        >
                            {searchOpen ? <CloseIcon className="h-6 w-6 lg:h-7 lg:w-7" /> : <SearchIcon className="h-6 w-6 lg:h-7 lg:w-7" />}
                        </button>
                        <Link href="/cart" aria-label={`Cart, ${cartCount} items`} className="relative hover:text-mai">
                            <CartIcon className="h-6 w-6 lg:h-7 lg:w-7" />
                            {cartCount > 0 && (
                                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-mai px-1 text-xs font-semibold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>

                    {menuOpen && <MobileMenu items={navItems} onClose={() => setMenuOpen(false)} />}
                </div>
                {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
            </header>
        </>
    );
}
