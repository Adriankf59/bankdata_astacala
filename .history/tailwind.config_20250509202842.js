/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'netflix-red': '#E50914',
          'netflix-black': '#141414',
          'netflix-dark-gray': '#181818',
          'netflix-light-gray': '#808080',
        },
        fontFamily: {
          sans: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
        },
        animation: {
          'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
      },
    },
    plugins: [
      require('tailwind-scrollbar-hide')
    ],
  };