/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        uho: {
          light: '#388e3c',
          DEFAULT: '#1b5e20', // Verde UHO institucional
          dark: '#0d3c12',
          accent: '#ffb300',  // Oro/Amarillo UHO institucional
          accentHover: '#ffa000',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
