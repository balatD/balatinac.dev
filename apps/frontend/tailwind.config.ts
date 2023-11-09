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
      grey: '#798082',
      light: '#898E85'
    },
    fontFamily: {
      mono: ['var(--font-geist-mono)'],
    },
  },
  plugins: [],
}
export default config
