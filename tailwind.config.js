const plugin = require("tailwind-scrollbar");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "index.html",
    "./src/*.{html,js}",
    "./src/**/*.{html,js}",
    "./src/**/**/*.{html,js}",
  ],
  darkMode: ["class", '[data-mode="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: { dark: "#1f8505", light: "#1f8505" },
        secondary: { dark: "#121212", light: "#121212" },
        grey: { high: "#3b3d3b", mid: "#6f6f76", low: "#aaaaaa" },
      },
    },
  },
  plugins: [
    require("@tailwindcss/container-queries"),
    require("tailwind-scrollbar"),
  ],
};
