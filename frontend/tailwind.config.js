/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1a9e75', dark: '#0f6e56', light: '#5dcaa5' },
        bg:      { DEFAULT: '#0f1117', card: '#1a1d27', border: '#2a2d3e' },
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
    },
  },
  plugins: [],
};
