// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        azure: {
          DEFAULT: '#0078D4',  // Azure blue
          light: '#C7E0F4',
          dark: '#004578',
        },
      },
      boxShadow: {
        subtle: '0 2px 6px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
