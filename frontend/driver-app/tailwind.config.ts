import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          primary: "#1a1a2e",
          secondary: "#16213e",
          tertiary: "#0f3460",
          surface: "#222244",
          card: "#1e1e3a",
        },
        accent: {
          green: "#22c55e",
          red: "#E94560",
          orange: "#f59e0b",
          blue: "#3b82f6",
        },
      },
      animation: {
        pulse_slow: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
