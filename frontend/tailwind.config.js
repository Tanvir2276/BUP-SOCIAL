/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bup: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#38a5f6',
          500: '#0e87ea',
          600: '#026bc9',
          700: '#0355a2',
          800: '#074885',
          900: '#0c3d6f',
          950: '#07274a',
          navy: '#091b33',
          navyDark: '#050f1d',
          emerald: '#006a4e',
          emeraldLight: '#059669',
          gold: '#f59e0b',
          goldHover: '#d97706',
          dark: '#070e1a',
          darkCard: '#0d182b',
        },
      },
      boxShadow: {
        'bup-glow': '0 0 25px -5px rgba(3, 85, 162, 0.4)',
        'emerald-glow': '0 0 25px -5px rgba(0, 106, 78, 0.4)',
        'gold-glow': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
        '3d-subtle': '0 2px 0 rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};
