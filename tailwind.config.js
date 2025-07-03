/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px', // already defined
      '2xl': '1536px',
    },
    extend: {
      colors: {
        maincolor: 'orange',
        secondary: 'skyblue',
        black: '#000',
        white: '#fff',
      },
    },
  },
  plugins: [],
}

