const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Gilroy", "sans-serif"],
        gilroy: ["Gilroy", "sans-serif"],
      },
      animation: {
        "bounce-delayed": "bounce 1s infinite 0.5s",
      },
      colors: {
        yellow: "#FFB000",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
