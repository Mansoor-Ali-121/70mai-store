import { useState } from 'react';
import AppLink from './AppLink';
import CloudImage from './CloudImage';
import Logo from './Logo';
import NewsletterForm from './NewsletterForm';

const FOOTER_GROUPS = [
    {
        title: 'Products',
        links: [
            { label: 'Dash Cams', href: '/dashcams' },
            { label: 'Accessories', href: '/accessories' },
        ],
    },
    {
        title: 'Support',
        links: [
            { label: 'Customer Support', href: '/support' },
            { label: 'App Download', href: '/download' },
        ],
    },
    {
        title: 'About 70mai',
        links: [
            { label: 'About Us', href: '/about' },
            { label: 'Press and Media', href: '/news' },
            { label: 'Contact Us', href: '/contactus' },
        ],
    },
    {
        title: 'Creator Hub',
        links: [
            { label: 'Drive with 70mai', href: 'https://70mai.associates/4xVBPXx', newTab: true },
            { label: 'Creators Club', href: 'https://bit.ly/4gc8kJd', newTab: true },
        ],
    },
];

export const SOCIAL_LINKS = [
    {
        name: 'Facebook',
        href: 'https://www.facebook.com/pg/70maiofficial',
        path: 'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z',
    },
    {
        name: 'Instagram',
        href: 'https://www.instagram.com/70mai_official/',
        path: 'M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077',
    },
    {
        name: 'YouTube',
        href: 'https://www.youtube.com/channel/UCf5gR9LK9MIGsx80o8KMDfA?view_as=subscriber',
        path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
    },
    {
        name: 'X',
        href: 'https://x.com/70mai_official/',
        path: 'M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z',
    },
    {
        name: 'Reddit',
        href: 'https://www.reddit.com/r/70mai_official/',
        path: 'M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z',
    },
];

function FooterNavGroup({ title, links }) {
    const [open, setOpen] = useState(false);

    return (
        <div className={`overflow-hidden border-b-1 leading-6 md:h-full md:border-0 ${open ? 'h-auto' : 'h-12'}`}>
            <h3 className="text-[15px] font-bold leading-12 text-primary md:mb-2 md:mr-5 md:pr-5">
                <button
                    type="button"
                    onClick={() => setOpen((value) => !value)}
                    aria-expanded={open}
                    className="flex w-full justify-between text-left md:pointer-events-none"
                >
                    {title}
                    <span className="flex w-[10px] items-center justify-center md:hidden">{open ? '−' : '+'}</span>
                </button>
            </h3>
            <ul>
                {links.map((link) => (
                    <li key={link.href} className="mb-1">
                        <AppLink href={link.href} newTab={link.newTab} className="mb-1 block">
                            {link.label}
                        </AppLink>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function PrivacyNotice() {
    return (
        <p className="text-xs">
            By signing up, you agree to 70mai's{' '}
            <AppLink href="/privacy-policy" newTab className="text-mai">
                Privacy Policy
            </AppLink>
            .
        </p>
    );
}

export default function SiteFooter() {
    return (
        <footer className="border-t px-[22px]">
            <div className="mx-auto flex w-screen-lg max-w-full flex-col py-8 text-sm text-muted md:grid md:grid-cols-4 md:py-10">
                {FOOTER_GROUPS.map((group) => (
                    <FooterNavGroup key={group.title} {...group} />
                ))}
            </div>

            {/* Newsletter: desktop */}
            <div className="relative mx-auto mt-9 hidden w-full max-w-screen-lg justify-between overflow-x-hidden pb-16 text-sm text-muted md:flex">
                <div className="md:w-1/2">
                    <p className="text-[15px] font-bold text-primary md:mb-2">Stay in the know</p>
                    <p className="min-w-100 leading-6">Sign up to receive newsletters and promotional offers from 70mai.</p>
                    <PrivacyNotice />
                </div>
                <div className="flex items-end">
                    <NewsletterForm />
                </div>
            </div>

            {/* Newsletter: mobile */}
            <div className="text-sm text-primary md:hidden">
                <p>Subscribe to our newsletter:</p>
                <div className="mb-6 mt-4">
                    <NewsletterForm />
                </div>
                <div className="text-muted">
                    <PrivacyNotice />
                </div>
            </div>

            <div className="mx-auto flex w-screen-lg max-w-full flex-col-reverse justify-between border-b-1 pb-6 pt-10 md:flex-row md:pb-5 md:pt-5">
                <Logo className="w-full max-w-[4.8125rem]" />
                <ul className="mb-4 flex items-center gap-[1rem] pb-4 md:mb-0 md:gap-[1.2rem] md:pb-0">
                    {SOCIAL_LINKS.map((social) => (
                        <li key={social.name}>
                            <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name}>
                                <svg
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                    className="w-[1rem]"
                                >
                                    <path d={social.path} />
                                </svg>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mx-auto mb-4 flex w-screen-lg max-w-full flex-col-reverse items-start justify-between pb-15 pt-6 text-center text-xs md:mb-20 md:flex-row md:items-center md:pb-6 md:text-base">
                <span className="text-muted md:text-secondary">
                    Copyright © {new Date().getFullYear()} 70mai Co., Ltd. All Rights Reserved.
                </span>
                <div className="flex items-center pb-4 text-xs font-normal text-muted md:pb-0 md:text-sm md:text-primary">
                    <CloudImage src="footer/icon_laguage.png" className="min-h-[14px] min-w-[14px]" loading="lazy" />
                    <p className="ml-1">United States / English</p>
                </div>
            </div>
        </footer>
    );
}
