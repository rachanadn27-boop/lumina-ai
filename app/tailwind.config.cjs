/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/renderer/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          dark: '#0B0B0C',
          darkSecondary: '#121315',
          darkTertiary: '#1A1C1F',
          light: '#F8F9FA',
          lightSecondary: '#FFFFFF',
          lightTertiary: '#F1F3F5',
        },
        border: {
          dark: '#2A2D31',
          light: '#E9ECEF',
        },
        text: {
          darkPrimary: '#F8F9FA',
          darkSecondary: '#9CA3AF',
          lightPrimary: '#1E293B',
          lightSecondary: '#64748B',
        },
        brand: {
          primary: '#6366F1', // Indigo accent
          hover: '#4F46E5',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'premium': '0 4px 30px rgba(0, 0, 0, 0.4)',
        'premium-light': '0 4px 30px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
