/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F7F6F2',
        surface: '#FFFFFF',
        ink: '#17181C',
        'ink-muted': '#565A63',
        border: '#E4E2DB',
        accent: '#1D4ED8',
        'accent-soft': '#EEF2FF',
        status: {
          completed: '#15803D',
          prototype: '#1D4ED8',
          progress: '#B45309',
          concept: '#6B7280',
        },
        navy: '#101820',
        'navy-surface': '#1B2934',
        mint: '#67E8B5',
        offwhite: '#F7F8F6',
        'offwhite-ink': '#18212B',
        'offwhite-muted': '#667085',
        'offwhite-border': '#E2E7E5',
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      maxWidth: {
        content: '72rem',
      },
    },
  },
  plugins: [],
}
