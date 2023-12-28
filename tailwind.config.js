/** @type {import('tailwindcss').Config} */
export default {
  content: ["index.html", "./src/**/*.{html,js}", "./src/*.{html,js}"],
  theme: {
    extend: {
      backgroundColor: {
        primary: "#1f8505",
        secondary: "#121212",
        secondary_variant: "#3b3d3b",
      },
    },
  },
  plugins: [],
};
