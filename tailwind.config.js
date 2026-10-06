import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/**/*.blade.php',
        './resources/**/*.{js,jsx}',
        './resources/**/*.vue',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Manrope', ...defaultTheme.fontFamily.sans],
            },
            // Design tokens taken from the original 70mai stylesheet.
            colors: {
                mai: '#FF6319',
                primary: '#2C2C31',
                secondary: '#515761',
                muted: '#70727B',
                subtle: '#8F8F91',
                igray: '#B4B4B4',
            },
            spacing: {
                15: '3.75rem',
                18: '4.5rem',
                50: '12.5rem',
                70: '17.5rem',
                86: '21.5rem',
                100: '25rem',
            },
            lineHeight: {
                12: '3rem',
            },
            width: {
                'screen-lg': '1024px',
                'screen-xl': '1280px',
            },
            zIndex: {
                1: '1',
                9999: '9999',
            },
            borderWidth: {
                1: '1px',
            },
        },
    },
    plugins: [],
};
