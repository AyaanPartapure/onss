/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#effaf8',
          100: '#d8f2ee',
          200: '#aee2d8',
          300: '#7fcbc0',
          400: '#3eada8',
          500: '#138e8b',
          600: '#087875',
          700: '#0a625f',
          800: '#0d4e50',
          900: '#103b43',
          950: '#0c2b36',
        },
        navy: {
          800: '#0f172a',
          900: '#0a0f1d',
          950: '#05070e',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
