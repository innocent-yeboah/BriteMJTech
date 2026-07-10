import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        brand: {
          // Primary Blue
          DEFAULT: "#1E3A5F",
          50: "#f0f4f9",
          100: "#dae4f0",
          200: "#b6c9e1",
          300: "#8aa7cd",
          400: "#5a80b3",
          500: "#3c6096",
          600: "#2f4d7a",
          700: "#1E3A5F",
          800: "#182f4d",
          900: "#132540",
          950: "#0A2540", // Secondary Dark
        },
        accent: {
          // Accent Red/Orange
          DEFAULT: "#E63946",
          50: "#fdf2f3",
          100: "#fbe0e2",
          200: "#f7c5c9",
          300: "#f19da4",
          400: "#e86974",
          500: "#E63946",
          600: "#d11f2e",
          700: "#b01824",
          800: "#921821",
          900: "#7a1921",
          950: "#42090d",
        },
        ink: "#1A1A1A",
        surface: "#F5F5F5",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-montserrat)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 4px 24px -6px rgba(10, 37, 64, 0.12)",
        "card-hover": "0 12px 40px -8px rgba(10, 37, 64, 0.22)",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #0A2540 0%, #1E3A5F 55%, #2f4d7a 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "fade-in": "fade-in 0.8s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
