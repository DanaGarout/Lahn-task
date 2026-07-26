/** @type {import('tailwindcss').Config} */
export default {
  // "class" strategy powers the Dark Mode bonus feature: we toggle a
  // `dark` class on <html> from the theme store instead of relying on
  // prefers-color-scheme, so the user's choice can be saved & restored.
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Custom brand palette used throughout the app (buttons, links, badges).
      // "brand" = primary indigo/violet gradient family used for CTAs.
      colors: {
        brand: {
          50: '#f2f1ff',
          100: '#e6e4ff',
          200: '#cfccff',
          300: '#aca5ff',
          400: '#8a7bff',
          500: '#6c4eff',
          600: '#5a2fe0',
          700: '#4a23b8',
          800: '#3c1d93',
          900: '#331b75',
          950: '#1f0f4d',
        },
        surface: {
          light: '#ffffff',
          dark: '#12101c',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(76, 41, 191, 0.25)',
        card: '0 4px 24px -6px rgba(15, 15, 30, 0.12)',
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(circle at 20% 20%, rgba(140,110,255,0.35), transparent 40%), radial-gradient(circle at 80% 0%, rgba(255,110,196,0.25), transparent 45%), linear-gradient(135deg, #1f0f4d 0%, #331b75 55%, #4a23b8 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        shimmer: 'shimmer 1.6s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
