import { Link } from '@inertiajs/react';

/**
 * Inertia <Link> for in-app routes, plain <a> for external URLs or links
 * that open in a new tab.
 */
export default function AppLink({ href, newTab = false, ...props }) {
    if (newTab || /^https?:\/\//.test(href)) {
        return <a href={href} {...(newTab && { target: '_blank', rel: 'noopener noreferrer' })} {...props} />;
    }

    return <Link href={href} {...props} />;
}
