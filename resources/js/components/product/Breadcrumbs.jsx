import { Link } from '@inertiajs/react';

/** @param {{ items: { label: string, href?: string }[] }} props  Last item is the current page. */
export default function Breadcrumbs({ items }) {
    return (
        <nav aria-label="Breadcrumb" className="text-[15px]">
            <ol className="flex flex-wrap items-center gap-x-3 gap-y-1">
                {items.map((item, index) => (
                    <li key={item.label} className="flex items-center gap-3">
                        {index > 0 && (
                            <span aria-hidden="true" className="text-[#C4C4C4]">
                                /
                            </span>
                        )}
                        {item.href ? (
                            <Link href={item.href} className="underline underline-offset-4 hover:text-mai">
                                {item.label}
                            </Link>
                        ) : (
                            <span aria-current="page">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
