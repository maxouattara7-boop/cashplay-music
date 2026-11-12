/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cashplay: {
          green: '#008A3B',
          darkgreen: '#006B2E',
          lightgreen: '#E8F5ED',
          dark: '#111111',
          gray: '#5E6661',
          surface: '#18181b',
          card: '#27272a',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
