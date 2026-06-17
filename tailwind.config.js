/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#1a1d1d',
          oled: '#0a0a0a',
          light: '#fcfcf9',
        },
        surface: {
          DEFAULT: '#252828',
          light: '#ffffff',
          secondary: 'rgba(255,255,255,0.06)',
        },
        accent: {
          DEFAULT: '#32b8c6',
          end: '#21808d',
          muted: 'rgba(50,184,198,0.14)',
          soft: 'rgba(50,184,198,0.1)',
          glow: 'rgba(50,184,198,0.28)',
        },
        brand: {
          orange: '#e68161',
          'orange-muted': 'rgba(230,129,97,0.14)',
        },
        success: {
          DEFAULT: '#34d399',
          muted: 'rgba(52,211,153,0.15)',
        },
        danger: {
          DEFAULT: '#f87171',
          muted: 'rgba(248,113,113,0.15)',
        },
        text: {
          primary: '#f3f4f4',
          secondary: '#b0b8b8',
          light: {
            primary: '#134252',
            secondary: '#5a7580',
          },
        },
        tier: {
          premium: '#9b87d4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
