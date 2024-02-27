/** @type {import('tailwindcss').Config} */
import containerQueries from "@tailwindcss/container-queries";

export default {
  content: [
    "index.html",
    "./src/*.{html,js,ts}",
    "./src/**/*.{html,js,ts}",
    "./src/**/**/*.{html,js,ts}",
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
  plugins: [containerQueries],
};
