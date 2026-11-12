/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '.dark'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'db': {
          'bg': 'rgb(var(--db-bg) / <alpha-value>)',
          'surface': 'rgb(var(--db-surface) / <alpha-value>)',
          'panel': 'rgb(var(--db-panel) / <alpha-value>)',
          'border': 'rgb(var(--db-border) / <alpha-value>)',
          'accent': 'rgb(var(--db-accent) / <alpha-value>)',
          'accent2': 'rgb(var(--db-accent2) / <alpha-value>)',
          'text': 'rgb(var(--db-text) / <alpha-value>)',
          'muted': 'rgb(var(--db-muted) / <alpha-value>)',
          'dim': 'rgb(var(--db-dim) / <alpha-value>)',
          'error': 'rgb(var(--db-error) / <alpha-value>)',
          'warn': 'rgb(var(--db-warn) / <alpha-value>)',
          'info': 'rgb(var(--db-info) / <alpha-value>)',
          'solar': 'rgb(var(--db-solar) / <alpha-value>)',
          'wind': 'rgb(var(--db-wind) / <alpha-value>)',
          'forecast': 'rgb(var(--db-forecast) / <alpha-value>)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Source Serif 4', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        display: ['Playfair Display', 'Source Serif 4', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
