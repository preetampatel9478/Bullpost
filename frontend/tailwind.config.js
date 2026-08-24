/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bullish: '#10B981',
        bearish: '#EF4444',
        brandBlue: '#2563EB',
        brandBlueHover: '#1D4ED8',
        brandBlueLight: '#EFF6FF',
        darkBg: '#090D16',
        darkCard: '#111827',
        darkCardHover: '#172033',
        darkCardInner: '#1E293B',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
