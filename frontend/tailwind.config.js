/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0a0a14",
          900: "#0f0f1e",
          850: "#13132a",
          800: "#181832",
          700: "#20203f",
          600: "#2a2a4a",
        },
        arcane: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
        },
      },
      fontFamily: {
        display: ["'Cinzel'", "serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(139, 92, 246, 0.25)",
      },
    },
  },
  plugins: [],
};
