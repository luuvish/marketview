import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#1a1a2e',
          light: '#16213e',
          card: '#0f3460',
        },
        accent: {
          green: '#00d4aa',
          red: '#ff6b6b',
          blue: '#4fc3f7',
          gold: '#ffd700',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
