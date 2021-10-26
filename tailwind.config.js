const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: [
    "./src/components/**/*.{ts,tsx,js,jsx}",
    "./src/pages/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.red,
        background: {
          DEFAULT: "#000000",
          200: "#777676",
          300: "#696968",
          400: "#5e5d5d",
          500: "#555454",
          600: "#4d4c4c",
          700: "#464545",
          800: "#403f3f",
          900: "#3a3939",
        },
        typography: {
          DEFAULT: "#FFFFFF",
          secondary: colors.warmGray[300],
        },
      },
    },
  },
  variants: {},
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
