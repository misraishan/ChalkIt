/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/daisyui/dist/**/*.js",
    "node_modules/react-daisyui/dist/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
    require("react-daisyui"),
    require("tailwind-children"),
  ],
  daisyui: {
    styled: true,
    // DO NOT TOUCH, THIS MAKES DYNAMIC THEME???
    // themes: ["light", "dark"],
    // themes: [] — this makes it proper light mode
    // themes: ["black"]
  },

  reactStrictMode: true,
};
