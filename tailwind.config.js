/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        display: [
          'Playfair Display',
          'ui-serif',
          'Georgia',
          'serif',
        ],
      },
      colors: {
        primary: {
          DEFAULT: '#1E40AF',
          500: '#1E40AF',
        },
        accent: {
          DEFAULT: '#F97316',
          500: '#F97316',
        },
        gray: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      spacing: {
        1: '8px',
        2: '16px',
        3: '24px',
        4: '32px',
        5: '40px',
        6: '48px',
        7: '56px',
        8: '64px',
      },
    },
  },
  plugins: [],
}
