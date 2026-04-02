/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        jireh: {
          purple: '#7B2DBB',
          'purple-light': '#9B4DDB',
          'purple-pale': '#F3E8FF',
          'purple-border': '#D8B4FE',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
