// Stroke icons used across the store UI. All inherit `currentColor`.
function Icon({ className = 'h-6 w-6', strokeWidth = 1.75, children }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={className}
        >
            {children}
        </svg>
    );
}

export const SearchIcon = (props) => (
    <Icon {...props}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
    </Icon>
);

export const UserIcon = (props) => (
    <Icon {...props}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
    </Icon>
);

export const CartIcon = (props) => (
    <Icon {...props}>
        <path d="M2.5 3h2.6l2.3 11.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L21 7H6" />
        <circle cx="9.5" cy="20" r="1.25" />
        <circle cx="17.5" cy="20" r="1.25" />
    </Icon>
);

export const MenuIcon = (props) => (
    <Icon {...props}>
        <path d="M3 6h18M3 12h18M3 18h18" />
    </Icon>
);

export const CloseIcon = (props) => (
    <Icon {...props}>
        <path d="M6 6l12 12M18 6 6 18" />
    </Icon>
);

export const ChevronDownIcon = (props) => (
    <Icon {...props}>
        <path d="m6 9 6 6 6-6" />
    </Icon>
);

export const ArrowLeftIcon = (props) => (
    <Icon {...props}>
        <path d="M19 12H5M11 6l-6 6 6 6" />
    </Icon>
);

export const ArrowRightIcon = (props) => (
    <Icon {...props}>
        <path d="M5 12h14M13 6l6 6-6 6" />
    </Icon>
);

export const ExpandIcon = (props) => (
    <Icon {...props}>
        <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5M4 4l6 6M20 4l-6 6M4 20l6-6M20 20l-6-6" />
    </Icon>
);

export const PlusIcon = (props) => (
    <Icon {...props}>
        <path d="M12 5v14M5 12h14" />
    </Icon>
);

export const MinusIcon = (props) => (
    <Icon {...props}>
        <path d="M5 12h14" />
    </Icon>
);

export const CheckIcon = (props) => (
    <Icon {...props}>
        <path d="m5 12 5 5 9-10" />
    </Icon>
);
