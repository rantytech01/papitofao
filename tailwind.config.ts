import type { Config } from "tailwindcss";

// Design tokens derived from the supplied campaign poster.
// Blue/red/navy are the fixed campaign identity; site_settings in the
// database can override secondary/accent shades without touching this file.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        campaign: {
          blue: "#0757D5",
          "blue-dark": "#053E9E",
          red: "#ED1111",
          navy: "#071B3A",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "diagonal-split":
          "linear-gradient(115deg, var(--tw-gradient-stops))",
      },
      maxWidth: {
        prose: "72ch",
      },
    },
  },
  plugins: [],
};

export default config;
