/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "business",
      "forest",
      "night",
      "coffee",
      "winter",
    ],
    styled: true,
    base: true,
    utils: true,
    darkTheme: "dark",
  },
};
