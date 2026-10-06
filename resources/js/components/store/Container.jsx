/** Page-width wrapper aligned with the store header's side padding. */
export default function Container({ className = '', children }) {
    return <div className={`mx-auto w-full max-w-[1920px] px-4 lg:px-6 xl:px-10 2xl:px-[150px] ${className}`}>{children}</div>;
}
