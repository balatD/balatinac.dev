import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        container: {
            padding: {
                DEFAULT: '1rem',
                sm: '2rem',
                lg: '0',
                xl: '0',
                '2xl': '0',
            },
        },
        screens: {
            sm: '500px',
            md: '640px',
            lg: '768px',
            xl: '990px',
            '2xl': '1200px',
        },
        extend: {
            fontFamily: {
                qicksand: ['"Quicksand"', 'sans-serif'],
                conduit: ['"Conduit"', 'sans-serif'],
            },
            colors: {
                brand: {
                    green: {
                        500: '#BCCF02',
                    },
                },
                secondary: '#2d3748',
                tertiary: '#4a5568',
            },
            gridTemplateColumns: {
                '4-10': '4fr 6fr',
                '10-4': '10fr 4fr',
            },
            fontSize: {
                h1: [
                    '5rem',
                    {
                        lineHeight: '1',
                        letterSpacing: '0.03em',
                        fontWeight: '700',
                    },
                ],
                'h1-md': [
                    '3.75rem',
                    {
                        lineHeight: '1',
                        letterSpacing: '0.03em',
                        fontWeight: '700',
                    },
                ],
                'h1-sm': [
                    '2.75rem',
                    {
                        lineHeight: '1',
                        letterSpacing: '0.03em',
                        fontWeight: '700',
                    },
                ],
                h2: [
                    '2rem',
                    {
                        lineHeight: '2.5rem',
                        letterSpacing: '0.02em',
                        fontWeight: '500',
                    },
                ],
                h3: [
                    '1.5rem',
                    {
                        lineHeight: '2.0rem',
                        letterSpacing: '0.01em',
                        fontWeight: '500',
                    },
                ],
                h4: [
                    '1.25rem',
                    {
                        lineHeight: '1.75rem',
                        letterSpacing: '0em',
                        fontWeight: '700',
                    },
                ],
                teaser: [
                    '1.375rem',
                    {
                        lineHeight: '2rem',
                        letterSpacing: '0em',
                        fontWeight: '400',
                    },
                ],
            },
        },
    },
    plugins: [],
};
export default config;
