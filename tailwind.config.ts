import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import containerQueries from "@tailwindcss/container-queries";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        "surface-bright": "#FFFFFF",
        "on-tertiary": "#ffffff",
        "surface-dim": "#f0f0ec",
        "secondary-fixed": "#b5ebff",
        primary: "#A01318",
        background: "#FBFBF9",
        "on-surface-variant": "#52525B",
        secondary: "#00758C",
        "surface-container": "#F4F4F0",
        "surface-container-high": "#ECECE7",
        surface: "#FFFFFF",
        "on-surface": "#101014",
        "on-primary": "#ffffff",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "#F8F8F5",
        "on-background": "#101014",
        "outline-variant": "#E5E5DF",
        "surface-variant": "#F0F0EB",
        outline: "#D1D1C7",
        "accent-cyan": "#30B4D7"
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        "4xl": "2.5rem",
        full: "9999px"
      },
      spacing: {
        "gutter-desktop": "2.5rem",
        gutter: "1.5rem",
        "space-lg": "2rem",
        margin: "1.25rem",
        "margin-tablet": "3rem",
        "margin-desktop": "5rem",
        "space-md": "1rem",
        "space-sm": "0.5rem",
        "space-xl": "3.5rem",
        "space-xs": "0.25rem"
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "Poppins", "var(--font-jakarta)", "var(--font-outfit)", "sans-serif"],
        poppins: ["var(--font-poppins)", "Poppins", "var(--font-outfit)", "sans-serif"],
        display: ["var(--font-poppins)", "Poppins", "var(--font-outfit)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      boxShadow: {
        editorial: "0 8px 30px rgba(16, 16, 20, 0.04)",
        "editorial-hover": "0 16px 40px rgba(16, 16, 20, 0.08)",
        "editorial-modal": "0 24px 60px rgba(16, 16, 20, 0.12)"
      }
    }
  },
  plugins: [forms, containerQueries]
};

export default config;
