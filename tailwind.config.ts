import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // A nice blue for primary actions
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efad',
          400: '#4ade80',
          500: '#22c55e', // A vibrant green for secondary actions
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#0f3d23',
        },
        // Custom glow for hover effects
        glow: 'rgba(87, 84, 255, 0.5)', // Matches your scrollbar thumb color
      },
      boxShadow: {
        glow: '0 0 15px var(--tw-shadow-color)',
      },
      borderRadius: {
        '4xl': '2rem', // Custom rounded corners
      },
    },
  },
  plugins: [],
  darkMode: 'class', // Enable dark mode with class strategy
};
export default config;
