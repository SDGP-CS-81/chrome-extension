/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "index.html",
    "./src/*.{html,js}",
    "./src/**/*.{html,js}",
    "./src/**/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1f8505",
        secondary: "#121212",
        secondary_variant: "#3b3d3b",
        grey: "#6f6f76",
      },
    },
  },
  plugins: [require("@tailwindcss/container-queries")],
};
