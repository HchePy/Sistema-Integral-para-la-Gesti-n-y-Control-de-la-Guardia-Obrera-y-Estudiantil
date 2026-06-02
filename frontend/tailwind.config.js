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
          light: '#4A90D9',   // Celeste/Azul claro universitario
          DEFAULT: '#1A3A6E', // Azul Universitario Predominante (según E.R.S)
          dark: '#0F2447',    // Azul marino oscuro
          accent: '#F39C12',  // Oro/Ámbar de contraste
          accentHover: '#D68910',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
