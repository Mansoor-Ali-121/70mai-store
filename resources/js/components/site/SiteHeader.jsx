import { CartIcon } from '@/components/store/icons';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLink from './AppLink';
import CloudImage from './CloudImage';
import Logo from './Logo';

const NAV_ITEMS = [
    { label: 'Dash Cams', href: '/dashcams' },
    { label: 'Accessories', href: '/accessories' },
    {
        label: 'Support',
        href: '/support',
        children: [{ label: 'Installation Service', href: '/support/installation-service' }],
    },
    { label: 'Where to Buy', href: '/buy' },
    { label: 'About 70mai', href: '/about' },
    { label: 'Road Season', href: '/why-dashcam' },
    { label: '4G Cloud+', href: '/4g' },
];

const STORE_URL = 'https://70mai.store/?utm_source=homepage&utm_medium=brandsite&utm_campaign=us';

export default function SiteHeader() {
    const [menuOpen, setMenuOpen] = useState(false);
    const cartCount = usePage().props.cart?.count ?? 0;

    return (
        <header className="relative flex h-11 w-full items-center justify-center border-b-1 bg-white lg:h-20">
            <div className="mx-[22px] flex h-full w-full items-center justify-center lg:justify-between xl:mx-[150px]">
                <Link href="/" className="flex-shrink-0 lg:pr-4 xl:pr-14">
                    <Logo className="w-full max-w-[4.375rem] md:max-w-[5.876rem] lg:max-w-[6.876rem]" />
                </Link>

                <button
                    type="button"
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={menuOpen}
                    className="absolute left-0 ml-5 lg:hidden"
                >
                    <CloudImage src="header/btn_navbar.png" />
                </button>

                <nav
                    className={`${menuOpen ? 'block' : 'hidden'} absolute top-full z-9999 min-h-full w-full items-center bg-white lg:relative lg:top-auto lg:flex lg:h-full lg:w-auto lg:justify-center lg:bg-transparent`}
                >
                    <ul className="flex h-full w-full flex-col lg:w-auto lg:flex-row">
                        {NAV_ITEMS.map((item) => (
                            <li
                                key={item.href}
                                className="group relative mx-5 h-full border-b-1 py-2 text-base md:last:mr-0 lg:ml-0 lg:mr-4 lg:flex lg:items-center lg:justify-center lg:border-b-0"
                            >
                                <AppLink href={item.href} className="block w-full leading-tight lg:text-center">
                                    {item.label}
                                </AppLink>

                                {item.children && (
                                    <ul className="space-y-2 pb-2 pl-4 pt-1 lg:absolute lg:left-0 lg:top-full lg:hidden lg:min-w-max lg:bg-white lg:p-4 lg:shadow-md lg:group-hover:block">
                                        {item.children.map((child) => (
                                            <li key={child.href}>
                                                <AppLink href={child.href} className="block text-sm text-subtle">
                                                    {child.label}
                                                </AppLink>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="absolute right-4 flex items-center justify-center gap-4 text-base lg:relative lg:right-0 lg:ml-8 lg:gap-5">
                    <Link href="/cart" aria-label={`Cart, ${cartCount} items`} className="relative hover:text-mai">
                        <CartIcon className="h-5 w-5 lg:h-6 lg:w-6" />
                        {cartCount > 0 && (
                            <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-mai px-1 text-[10px] font-semibold text-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    <a
                        href={STORE_URL}
                        className="rounded-full border-1 border-primary px-3 py-1 text-sm leading-tight md:text-center lg:px-4 lg:py-1.5"
                    >
                        Store
                    </a>
                </div>
            </div>
        </header>
    );
}
