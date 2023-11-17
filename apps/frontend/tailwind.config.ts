import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      ...colors,
      dark: '#181920',
      lighterDark: '#2b2c36',
      grey: '#798082',
      light: '#898E85'
    },
    fontFamily: {
      mono: ['var(--font-geist-mono)'],
    },
    extend: {
      animation: {
        marquee: "marquee 50s linear infinite",
        blob: 'blob 10s infinite',
      },
      keyframes: {
        blob: {
          '0%, 100%': {
            transform: 'translate(0, 0) scale(1)',
          },
          '25%': {
            transform: 'translate(20px, -50px) scale(1.1)',
          },
          '50%': {
            transform: 'translate(0, 20px) scale(1)',
          },
          '75%': {
            transform: 'translate(-20px, -15px) scale(0.9)',
          },
        },
        marquee: {
          from: {
            transform: 'translateX(0)',
          },
          to: {
            transform: 'translateX(calc(-100% - 2.5rem))',
          },
        },
        pulse: {
          '0%, 100%': {
            opacity: '.1',
          },
          '50%': {
            opacity: '.2'
          },
        },
      },
    },
  },
  plugins: [],
}
export default config
