module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    //   screens: {
    //     sm: "480px",
    //     md: "768px",
    //     lg: "976px",
    //     xl: "1440px",
    //   },
    colors: {
      transparent: "transparent",
      semi: "rgb(255,255,255,10%)",
      current: "currentColor",
      blue: "#002b48",
      blueDisabled: "#0066AB",
      green: "green",
      red: "red",
      gray: "rgb(182, 182, 182)",
      grayHome: "#002b4848",
      orange: "#FF9015",
      white: "#ffffff",
      tahiti: {
        100: "#cffafe",
        200: "#a5f3fc",
        300: "#67e8f9",
        400: "#22d3ee",
        500: "#06b6d4",
        600: "#0891b2",
        700: "#0e7490",
        800: "#155e75",
        900: "#164e63",
      },
      //     pink: "#ff49db",
      //     orange: "#ff7849",
      //     green: "#13ce66",
      //     "gray-dark": "#273444",
      //     gray: "#8492a6",
      //     "gray-light": "#d3dce6",
    },
    fontFamily: {
      sans: ["Quicksand", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },

    //   extend: {
    //     spacing: {
    //       128: "32rem",
    //       144: "36rem",
    //     },
    //     borderRadius: {
    //       "4xl": "2rem",
    //     },
    //   },
  },
  plugins: [require("@tailwindcss/forms")],
};
