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
        clay: {
          bg: '#F4F6FB',
          card: '#EEF2FF',
          accent: '#6D5EF5',
          'accent-light': '#8E82FF',
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
          text: '#1F2937',
          muted: '#6B7280',
        },
        brand: {
          50: '#f4f2ff',
          100: '#eef2ff',
          500: '#6d5ef5',
          600: '#5b4ce5',
          700: '#4a3bc3',
          900: '#2b1b8c',
        }
      },
      borderRadius: {
        'clay-sm': '16px',
        'clay-md': '22px',
        'clay-lg': '28px',
        'clay-xl': '32px',
      },
      boxShadow: {
        'clay-card': '12px 12px 28px rgba(163, 177, 198, 0.35), -10px -10px 24px rgba(255, 255, 255, 0.95)',
        'clay-card-hover': '16px 16px 36px rgba(163, 177, 198, 0.45), -12px -12px 28px rgba(255, 255, 255, 1)',
        'clay-btn': '6px 6px 16px rgba(163, 177, 198, 0.35), -6px -6px 14px rgba(255, 255, 255, 0.95)',
        'clay-btn-primary': '6px 6px 18px rgba(109, 94, 245, 0.4), -4px -4px 12px rgba(255, 255, 255, 0.6)',
        'clay-input': 'inset 4px 4px 8px rgba(163, 177, 198, 0.35), inset -4px -4px 8px rgba(255, 255, 255, 0.95)',
        'clay-pill': '8px 8px 20px rgba(163, 177, 198, 0.3), -6px -6px 16px rgba(255, 255, 255, 0.9)',
      }
    },
  },
  plugins: [],
}
