/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        q: {
          950: '#0D0A05',
          900: '#1A1408',
          850: '#201A0C',
          800: '#2A2010',
          750: '#332818',
          700: '#3D3020',
          600: '#5C4830',
          500: '#7D6040',
          400: '#A07848',
          300: '#C8973A',
          200: '#DDB860',
          100: '#F0D890',
          50:  '#FDF5E0',
        },
        earth: {
          cream:   '#F0E8D0',
          sand:    '#D8C8A0',
          stone:   '#8C7B60',
          terra:   '#C04B2F',
          sage:    '#6A9B6A',
          moss:    '#3D6655',
          amber:   '#C8973A',
          gold:    '#E8B850',
        }
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        body:    ['Outfit', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-in':    'fadeIn 0.25s ease-out',
        'slide-up':   'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
