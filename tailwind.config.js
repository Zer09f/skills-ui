/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-glow': 'pulse-glow 8s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5', filter: 'blur(100px)' },
          '50%': { opacity: '0.8', filter: 'blur(130px)' },
        }
      }
    },
  },
  plugins: [],
}
