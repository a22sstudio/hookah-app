/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Тёплая тёмная тема
        dark: {
          DEFAULT: '#0D0D0F',
          50: '#2C2C2E',
          100: '#1C1C1E',
          200: '#161618',
          300: '#131315',
          400: '#0D0D0F',
        },
        // Акцентные цвета (Apple-style)
        accent: {
          DEFAULT: '#34C759',
          green: '#34C759',
          blue: '#007AFF',
          orange: '#FF9500',
          red: '#FF3B30',
          purple: '#AF52DE',
          pink: '#FF2D55',
        },
        // Текст
        text: {
          primary: '#FFFFFF',
          secondary: '#8E8E93',
          tertiary: '#636366',
        },
        // Поверхности
        surface: {
          DEFAULT: 'rgba(28, 28, 30, 0.8)',
          solid: '#1C1C1E',
          elevated: '#2C2C2E',
        },
        // Границы
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          light: 'rgba(255, 255, 255, 0.12)',
        }
      },
      fontFamily: {
        heading: ['Manrope', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // iOS Typography Scale
        'display': ['34px', { lineHeight: '41px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'title-1': ['28px', { lineHeight: '34px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'title-2': ['22px', { lineHeight: '28px', letterSpacing: '-0.01em', fontWeight: '700' }],
        'title-3': ['20px', { lineHeight: '25px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline': ['17px', { lineHeight: '22px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body': ['17px', { lineHeight: '22px', letterSpacing: '-0.01em', fontWeight: '400' }],
        'callout': ['16px', { lineHeight: '21px', letterSpacing: '-0.01em', fontWeight: '400' }],
        'subheadline': ['15px', { lineHeight: '20px', letterSpacing: '-0.01em', fontWeight: '400' }],
        'footnote': ['13px', { lineHeight: '18px', letterSpacing: '-0.01em', fontWeight: '400' }],
        'caption-1': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'caption-2': ['11px', { lineHeight: '13px', fontWeight: '400' }],
      },
      borderRadius: {
        'ios': '12px',
        'ios-lg': '16px',
        'ios-xl': '20px',
        'ios-2xl': '24px',
        'ios-3xl': '32px',
      },
      spacing: {
        'ios-sm': '8px',
        'ios': '16px',
        'ios-lg': '20px',
        'ios-xl': '24px',
      },
      boxShadow: {
        'ios': '0 2px 8px rgba(0, 0, 0, 0.15)',
        'ios-md': '0 4px 16px rgba(0, 0, 0, 0.2)',
        'ios-lg': '0 8px 32px rgba(0, 0, 0, 0.25)',
        'ios-glow': '0 0 20px rgba(52, 199, 89, 0.3)',
      },
      backdropBlur: {
        'ios': '20px',
        'ios-lg': '40px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
