/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A5F',
          light: '#2D4A6F',
          dark: '#152A47',
        },
        accent: {
          DEFAULT: '#4A90A4',
          light: '#5BA0B4',
        },
        earth: '#2C2419',
        background: {
          light: '#F8F6F3',
          dark: '#1A1A1A',
        },
        border: '#E5E2DE',
        text: {
          DEFAULT: '#1A1A1A',
          muted: '#6B6B6B',
        },
      },
      fontFamily: {
        heading: ['var(--font-cinzel)', 'serif'],
        body: ['var(--font-plus-jakarta)', 'sans-serif'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.32, 0.72, 0, 1) forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
