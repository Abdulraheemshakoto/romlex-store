/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0d1b2a',
        card: '#142d4e',
        border: '#1e3a5f',
        text: '#e8f1f8',
        muted: '#8ba3bc',
        accent: '#00d4aa',
        'accent-dim': '#00b896',
        danger: '#ff4757',
        warning: '#ffa502',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}