/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#123A63',
          blue: '#2563EB',
          teal: '#0D9488',
          amber: '#F59E0B',
          bg: '#F6F8FC',
          text: '#172033',
        }
      }
    },
  },
  plugins: [],
};
