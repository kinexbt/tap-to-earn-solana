/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'flappy-sky': '#4FC3F7',
        'flappy-yellow': '#FFD54F',
        'flappy-orange': '#FF8F00',
        'flappy-green': '#4CAF50',
        'flappy-ground': '#8BC34A',
        'flappy-pipe': '#4CAF50',
        'flappy-bird': '#FFD54F',
        'flappy-dark': '#2c3e50',
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'monospace'],
      },
      animation: {
        'bounce-bird': 'bounce-bird 1s ease-in-out infinite',
        'float-cloud': 'float-cloud 8s ease-in-out infinite',
        'grass-wave': 'grass-wave 2s linear infinite',
      },
      keyframes: {
        'bounce-bird': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(-5deg)' }
        },
        'float-cloud': {
          '0%, 100%': { transform: 'translateX(0px)' },
          '50%': { transform: 'translateX(-20px)' }
        },
        'grass-wave': {
          '0%, 100%': { backgroundPosition: '0px 0px' },
          '50%': { backgroundPosition: '40px 0px' }
        }
      },
    },
  },
  plugins: [],
}
