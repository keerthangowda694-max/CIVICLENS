/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#070f1e',
          800: '#0c192c',
          700: '#13243f',
          600: '#1b3256',
        },
        civic: {
          blue: '#1d4ed8',
          electric: '#2563eb',
          cyan: '#06b6d4',
          teal: '#0d9488',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
