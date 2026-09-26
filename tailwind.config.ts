import type { Config } from "tailwindcss";

// Design tokens color-matched directly from the People's Renaissance
// Movement's live website (pmkenya.ke) via pixel sampling — blue #003491
// and red #F0181E are their exact brand colors, not estimates. "navy" is
// repurposed as their heading/body text color (Tailwind's own gray-900),
// since the party site doesn't use a separate dark-navy tone — it's blue,
// red, white, and standard grays. site_settings in the database can
// override secondary/accent shades without touching this file.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        campaign: {
          blue: "#003491",
          "blue-dark": "#002569",
          red: "#F0181E",
          navy: "#111827",
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
