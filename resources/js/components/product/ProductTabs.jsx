import { useEffect, useState } from 'react';

/**
 * Sticky in-page navigation. Highlights the section currently in view and
 * scrolls to a section on click. Sections need matching `id`s.
 */
export default function ProductTabs({ tabs }) {
    const [activeId, setActiveId] = useState(tabs[0]?.id);

    useEffect(() => {
        const sections = tabs.map((tab) => document.getElementById(tab.id)).filter(Boolean);
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((entry) => entry.isIntersecting);
                if (visible.length > 0) {
                    setActiveId(visible[0].target.id);
                }
            },
            { rootMargin: '-35% 0px -60% 0px' },
        );
        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, [tabs]);

    const scrollTo = (id) => {
        setActiveId(id);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <nav aria-label="Product sections" className="sticky top-16 z-30 border-y border-[#EBEBEB] bg-[#F7F7F7] lg:top-[100px]">
            <ul className="hide-scrollbar mx-auto flex max-w-full gap-8 overflow-x-auto px-4 lg:justify-center lg:gap-11">
                {tabs.map((tab) => (
                    <li key={tab.id} className="shrink-0">
                        <a
                            href={`#${tab.id}`}
                            onClick={(event) => {
                                event.preventDefault();
                                scrollTo(tab.id);
                            }}
                            aria-current={activeId === tab.id ? 'true' : undefined}
                            className={`block py-4 text-lg transition-colors lg:text-xl ${
                                activeId === tab.id ? 'font-semibold text-primary' : 'text-[#A3A3A3] hover:text-primary'
                            }`}
                        >
                            {tab.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
