/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['"Gotham SSm"', 'sans-serif'],
        },
        colors: {
          tesla: {
            black: '#171a20',
            gray: '#393c41',
            lightgray: '#f4f4f4',
            blue: '#3e6ae1'
          }
        },
        animation: {
          'bounce-slow': 'bounce 3s infinite',
        },
      },
    },
    plugins: [],
  };