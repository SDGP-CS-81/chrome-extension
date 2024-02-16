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
        primary: { dark: "#1F8505", light: "#1F8505" },
        secondary: { dark: "#121212", light: "#FBFBFD" },
        grey: { high: "#3B3D3B", mid: "#6F6F76", low: "#AAAAAA" },
      },
    },
  },
  plugins: [
    require("@tailwindcss/container-queries"),
    require("tailwind-scrollbar"),
  ],
};
