/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Outfit', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#6D5EF5',
          hover: '#5B4CE5',
          light: '#8B5CF6',
          soft: '#EEF4FF',
        },
        secondary: {
          DEFAULT: '#8B5CF6',
          light: '#A78BFA',
        },
        glass: {
          bg: 'rgba(255, 255, 255, 0.55)',
          card: 'rgba(255, 255, 255, 0.65)',
          border: 'rgba(255, 255, 255, 0.40)',
          accent: '#6D5EF5',
          secondary: '#8B5CF6',
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
          text: '#111827',
          muted: '#6B7280',
        },
        brand: {
          50: '#EEF4FF',
          100: '#E0E7FF',
          500: '#6D5EF5',
          600: '#5B4CE5',
          700: '#4A3BC3',
          900: '#2B1B8C',
        }
      },
      borderRadius: {
        'glass-sm': '16px',
        'glass-md': '20px',
        'glass-lg': '28px',
        'glass-xl': '32px',
      },
      boxShadow: {
        'glass-card': '0 10px 40px rgba(0, 0, 0, 0.08)',
        'glass-card-hover': '0 20px 50px rgba(109, 94, 245, 0.12)',
        'glass-btn': '0 8px 24px rgba(109, 94, 245, 0.15)',
        'glass-btn-primary': '0 10px 28px rgba(109, 94, 245, 0.35)',
        'glass-input': 'inset 0 2px 4px rgba(17, 24, 39, 0.03)',
        'glass-pill': '0 10px 30px rgba(17, 24, 39, 0.06)',
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-reverse': 'floatReverse 10s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(3deg)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(15px) rotate(-3deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
