import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Primary Colors (from palette image)
        forest: {
          DEFAULT: '#2B5F5E', // Deep Forest Green from image
          light: '#3a7675',
          dark: '#1f4544',
        },
        terracotta: {
          DEFAULT: '#C76D45', // Warm Terracotta from image
          light: '#d68862',
          dark: '#a85937',
        },
        sand: {
          DEFAULT: '#EBDCC4', // Sand from image
          light: '#F5EFE3',
          dark: '#d4c7ad',
        },
        // Secondary Colors
        mustard: {
          DEFAULT: '#DAAA63', // Golden Mustard from image
          light: '#e4bc7f',
          dark: '#c99547',
        },
        charcoal: {
          DEFAULT: '#33353B', // Charcoal from image
          light: '#4a4c52',
          dark: '#1e1f22',
        },
        // Optional Tints
        cream: '#F5EFE3',
        earth: '#8B5E3C',
      },
      fontFamily: {
        sans: ['var(--font-roboto)', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      borderRadius: {
        'card': '2px',
        'card-lg': '4px',
      },
    },
  },
  plugins: [],
};
export default config;

