/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 1s ease-in forwards'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' }
        },
        'magic-particle': {
          '0%': { 
            transform: 'translateY(0) scale(0)',
            opacity: 0 
          },
          '50%': { 
            transform: 'translateY(-100px) scale(1)',
            opacity: 0.5
          },
          '100%': { 
            transform: 'translateY(-200px) scale(0)',
            opacity: 0 
          }
        }
      },
      fontFamily: {
        'antistar': ['Antistar', 'sans-serif'],
        'luiston': ['"The Luiston"', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
    },
    animation: {
      float: 'float 3s ease-in-out infinite',
      glitch: 'glitch 0.5s ease-in-out infinite',
      'magic-particle': 'magic-particle 2s ease-out infinite'
    }
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    },
  ],
}