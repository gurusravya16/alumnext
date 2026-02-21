/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A",
        accent: "#10B981",
        "bg-light": "#F9FAFB",
      },
    },
  },
  plugins: [],
};
