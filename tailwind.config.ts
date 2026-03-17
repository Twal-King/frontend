import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        main: '#0A0A0F',
        card: '#141419',
        input: '#1A1A22',
        hover: '#1E1E28',
        primary: '#E5E5EA',
        secondary: '#6E6E80',
        disabled: '#3A3A4A',
        accent: {
          DEFAULT: '#4A7CFF',
          hover: '#3A6AEE',
        },
        success: '#34C759',
        warning: '#FFB340',
        error: '#FF453A',
        border: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          focus: 'rgba(74,124,255,0.4)',
        },
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '1.5' }],
        sm: ['14px', { lineHeight: '1.6' }],
        xl: ['20px', { lineHeight: '1.4' }],
      },
      width: {
        sidebar: '260px',
      },
      maxWidth: {
        chat: '768px',
        table: '1200px',
      },
    },
  },
  plugins: [],
};

export default config;
