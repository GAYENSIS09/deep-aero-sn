/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'db': {
          'bg': '#0A0A0A',
          'surface': '#121212',
          'panel': '#171717',
          'border': '#262626',
          'accent': '#AAFF00',
          'accent2': '#88CC00',
          'text': '#F2F2F2',
          'muted': '#A0A098',
          'dim': '#7A7A72',
          'error': '#FF5C57',
          'warn': '#E6C229',
          'info': '#56B6C2',
          'solar': '#10b981',
          'wind': '#8b5cf6',
          'forecast': '#3b82f6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Source Serif 4', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}