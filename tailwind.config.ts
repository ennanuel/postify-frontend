/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{html,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        black: {
            100: "#cccccc",
            200: "#999999",
            300: "#666666",
            400: "#333333",
            500: "#000000",
            600: "#000000",
            700: "#000000",
            800: "#000000",
            900: "#000000"
        }
      },
      animation: {
        stretch: 'stretch 5s linear'
      },
      keyframes: {
        stretch: {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' }
        }
      }
    }
  },
  plugins: [],
} satisfies Config;
