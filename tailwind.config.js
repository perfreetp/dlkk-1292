/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A5F',
          light: '#2A4F7E',
          dark: '#152A45',
        },
        accent: {
          DEFAULT: '#FF6B35',
          light: '#FF8A5B',
          dark: '#E55A28',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'system-ui', 'sans-serif'],
        display: ['SF Pro Display', 'Noto Sans SC', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
