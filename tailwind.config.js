/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          DEFAULT: "#FF5E14",
          light: "#FF8C5A",
          dark: "#D84300",
        },
        coral: {
          DEFAULT: "#FF4757",
          light: "#FF6B81",
        },
        marigold: {
          DEFAULT: "#FFB020",
          light: "#FFD066",
        },
        gulabi: {
          DEFAULT: "#E8175D",
          light: "#FF5388",
        },
        lime: {
          DEFAULT: "#10B981",
          light: "#34D399",
          dark: "#059669",
        },
        peacock: {
          DEFAULT: "#0284C7",
          light: "#38BDF8",
          dark: "#0369A1",
        },
        violet: {
          DEFAULT: "#6366F1",
          light: "#818CF8",
          dark: "#4F46E5",
        },
        cream: {
          DEFAULT: "#FFFBF2",
          surface: "#FDF6E9",
          darker: "#E5D7BE",
        },
        charcoal: {
          DEFAULT: "#1E1E24",
          light: "#2E2E38",
          muted: "#6B7280",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 10px 25px -5px rgba(255, 94, 20, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 20px 30px -10px rgba(255, 94, 20, 0.18), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        button: "0 4px 14px 0 rgba(255, 94, 20, 0.35)",
        "button-lime": "0 4px 14px 0 rgba(16, 185, 129, 0.35)",
        "button-violet": "0 4px 14px 0 rgba(99, 102, 241, 0.35)",
      },
    },
  },
  plugins: [],
};

