/** @type {import('tailwindcss').Config} */
export default {
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
        primary: "#FFB000",
        danger: "#FF4848",
      },
    },
  },
};
