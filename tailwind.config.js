/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brown: {
          500: "#37261f",
        },
        chestnut: {
          300: "#fc9941",
          400: "#db8539",
          500: "#BC6C25",
        },
        offwhite: "#FEFAE0",
        coffeeCream: {
          500: "#DDA15E",
        },
        green: {
          100: "#606C38",
          300: "#535e46",
          400: "#3e4a2f",
          500: "#283618",
        },
      },
      backgroundImage: {
        heroImg: "url('/images/bgbg.png')",
        faadsadas: "url('/images/dsadsadas.jpg')",
      },
      fontFamily: {
        baskerville: ["Libre Baskerville", "sans-serif"],
        quicksand: ["Quicksand", "sans-serif"],
      },
    },
  },
  plugins: [],
};
