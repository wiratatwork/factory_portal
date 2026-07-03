/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        toyota: {
          red: '#EB0A1E',
          'red-dark': '#C40016',
          charcoal: '#1A1A1A',
          slate: '#334155',
          'slate-deep': '#0F172A',
          gray: '#64748B',
          mist: '#F8FAFC',
          border: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
