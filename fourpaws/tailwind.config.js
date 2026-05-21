/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDF8EC',
          100: '#FAF0CC',
          200: '#F5E09A',
          300: '#EFC868',
          400: '#E8B042',
          500: '#C9A84C',
          600: '#B8962A',
          700: '#9A7D22',
          800: '#7D641C',
          900: '#614D16',
        },
        champagne: '#F7E7CE',
        pearl: '#F5F0E8',
        charcoal: {
          50: '#F2F2F2',
          100: '#E0E0E0',
          200: '#C2C2C2',
          300: '#A3A3A3',
          400: '#858585',
          500: '#4A4A4A',
          600: '#3D3D3D',
          700: '#2A2A2A',
          800: '#1A1A1A',
          900: '#0A0A0A',
        },
        silver: {
          100: '#F8F8F8',
          200: '#E8E8E8',
          300: '#D0D0D0',
          400: '#B8B8B8',
          500: '#9C9C9C',
          600: '#7A7A7A',
          700: '#5E5E5E',
          800: '#3E3E3E',
          900: '#1E1E1E',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Georgia"', 'serif'],
        sans: ['"Inter"', '"Helvetica Neue"', 'sans-serif'],
        display: ['"Cormorant Garamond"', '"Playfair Display"', 'serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #F5E09A 50%, #C9A84C 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #B8962A 0%, #EFC868 25%, #F5E09A 50%, #EFC868 75%, #B8962A 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #0D0D0D 100%)',
        'charcoal-gradient': 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'hero-gradient': 'radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.15) 0%, rgba(10,10,10,0.9) 70%)',
      },
      boxShadow: {
        'gold': '0 0 30px rgba(201,168,76,0.3), 0 4px 20px rgba(0,0,0,0.5)',
        'gold-lg': '0 0 60px rgba(201,168,76,0.4), 0 8px 40px rgba(0,0,0,0.6)',
        'gold-sm': '0 0 15px rgba(201,168,76,0.2), 0 2px 10px rgba(0,0,0,0.4)',
        'glass': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        'premium': '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.1)',
        'card': '0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'gold-pulse': 'goldPulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        goldPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201,168,76,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(201,168,76,0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { textShadow: '0 0 10px rgba(201,168,76,0.5)' },
          '100%': { textShadow: '0 0 30px rgba(201,168,76,0.9), 0 0 60px rgba(201,168,76,0.4)' },
        }
      }
    },
  },
  plugins: [],
}
