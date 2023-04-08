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
  darkMode: "class",
  plugins: [
    require("daisyui"),
    require("react-daisyui"),
    require("tailwind-children"),
    require("@tailwindcss/typography"),
  ],
  daisyui: {
    styled: true,
    themes: [
      {
        light: {
          primary: "#38BDF8",
          secondary: "#818CF8",
          accent: "#F471B5",
          neutral: "#3d4451",
          "base-100": "#f3f4f6",
          "base-200": "#e5e7eb",
          "base-300": "#d1d5db",
          info: "#2094f3",
          success: "#009485",
          warning: "#ff9900",
          error: "#ff5724",
        },
      },
      {
        dark: {
          primary: "#38BDF8",
          secondary: "#818CF8",
          accent: "#F471B5",
          "base-100": "#242933",
          "base-200": "#3B4252",
          "base-300": "#434C5E",
          info: "#2094f3",
          success: "#009485",
          warning: "#ff9900",
          error: "#ff5724",
        },
      },
    ],
  },

  reactStrictMode: true,
};
