/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bullish: '#00E676',
        bearish: '#FF3B30',
        cyanAccent: '#00F2FE',
        darkBg: '#070a11',
        cardBg: '#0e1524',
        cardHover: '#162035',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
