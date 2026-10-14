/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gmi: {
          red: '#8B181A',
          cream: '#FAF5E9',
          gold: '#C89B62',
          dark: '#2A1314'
        }
      }
    },
  },
  plugins: [],
}