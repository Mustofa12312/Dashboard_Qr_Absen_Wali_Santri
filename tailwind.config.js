/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-dark": "#020617",
        "bg-card": "rgba(15,23,42,0.85)",
        primary: "#22c55e",
      },
    },
  },
  plugins: [],
};
