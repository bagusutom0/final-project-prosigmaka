import type { Config } from 'tailwindcss';

export default {
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
      },
      keyframes: {
        appear: {
          '0%, 50%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        disappear: {
          '0%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },
      animation: {
        appear: 'appear 0.5s ease-in-out forwards',
        dissapear: 'dissapear 0.5s ease-in-out forwards',
      },
    },
  },
  plugins: [],
} satisfies Config;
