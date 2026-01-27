/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        royal: {
          500: '#4169E1',
          600: '#3458c9',
          700: '#2a47b1',
        }
      }
    },
  },
  plugins: [],
}
