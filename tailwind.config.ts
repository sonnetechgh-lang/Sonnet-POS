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
        primary: {
          DEFAULT: "#1F3A5F", // Deep Blue
          light: "#2B4E7A",
          dark: "#142640",
        },
        secondary: {
          DEFAULT: "#2EC4B6", // Teal / Cyan
          light: "#4ED7CB",
          dark: "#23A095",
        },
        accent: {
          DEFAULT: "#2E7D32", // Green (Actions/CTAs)
          light: "#3E9C43",
          dark: "#1B5E20",
        },
        warning: {
          DEFAULT: "#F9A825", // Amber
        },
        error: {
          DEFAULT: "#C62828", // Red
        },
        background: {
          app: "#F5F7FA",
          card: "#FFFFFF",
        },
        border: {
          DEFAULT: "#E0E6ED",
        },
        text: {
          primary: "#1E1E1E",
          secondary: "#6B7280",
          disabled: "#9CA3AF",
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
