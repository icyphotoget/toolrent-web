import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          50: '#FFF8F0',
          100: '#FFEFDB',
          200: '#FFD4AA',
          300: '#FFB066',
          400: '#FF8C33',
          500: '#F2711C',
          600: '#D4560A',
          700: '#A33F07',
          800: '#7A2F07',
          900: '#5A2208',
        },
        dark: {
          900: '#0F0F0F',
          800: '#1A1A1A',
          700: '#2D2D2D',
          600: '#3D3D3D',
          500: '#525252',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
};
export default config;
