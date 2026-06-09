import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Indigo brand (dark)
        indigo: {
          950: "#070920",
          900: "#0C0E2A",
          850: "#101338",
          800: "#161A4A",
          780: "#1B1F5A",
          700: "#1F2560",
          600: "#2D3480",
          500: "#3D45A0",
          400: "#6B72C9",
          300: "#9AA0DD",
          200: "#C6CAEE",
          100: "#EEF0FB",
          50: "#F4F6FC",
        },
        // Gold
        gold: {
          700: "#8A6E16",
          600: "#A8861C",
          500: "#C9A227",
          400: "#D4AF37",
          300: "#E3C65B",
          200: "#F0DC95",
          100: "#FBF3D6",
        },
        // Dark theme backgrounds
        dark: {
          bg: "#0A0C24",
          panel: "#11142F",
          panel2: "#151935",
          panelHi: "#1B1F42",
          border: "#222746",
          borderHi: "#313861",
        },
        // Light theme (oficina)
        light: {
          bg: "#F7F8FC",
          surface: "#FFFFFF",
          surface2: "#FAFBFE",
          border: "#EAECF4",
          borderStrong: "#DCDFEC",
        },
        // Text
        ink: {
          DEFAULT: "#14162E",
          dark: "#EEF0FA",
          soft: "#54586F",
          softDark: "#A7ACCB",
          faint: "#9094AC",
          faintDark: "#6E739A",
        },
        // Status
        status: {
          ok: "#34D17F",
          okDark: "#1F9D57",
          okBg: "#EAF7F0",
          warn: "#E3B43C",
          warnDark: "#C8911A",
          warnBg: "#FBF3DC",
          err: "#FF6B6B",
          info: "#5BA8E3",
          infoDark: "#3B6FC4",
          infoBg: "#E9F0FB",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      borderRadius: {
        "2xl": "18px",
        "3xl": "22px",
        "4xl": "24px",
      },
      boxShadow: {
        xl: "0 40px 100px rgba(0,0,0,.55)",
        "lg-light": "0 16px 44px rgba(20,22,46,.11)",
        "xl-light": "0 40px 90px rgba(27,31,90,.24)",
      },
    },
  },
  plugins: [],
};

export default config;
