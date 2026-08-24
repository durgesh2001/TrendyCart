import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12110F",
        ivory: "#F6F3EC",
        paper: "#FBFAF6",
        gold: "#A6813C",
        goldLight: "#D8C08A",
        rust: "#8C3B2E",
        stone: "#6E6A61",
        line: "#E4DFD3"
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"]
      },
      letterSpacing: {
        widest2: "0.28em"
      }
    }
  },
  plugins: []
};

export default config;
