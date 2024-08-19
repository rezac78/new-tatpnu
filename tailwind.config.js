/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{html,js}',
    './pages/**/*.{html,js}',
    './public/index.html',
    './src/**/*.{html,js,jsx}'
  ],
  theme: {
    extend: {
      maxWidth: {
        "8xl": "1920px"
      },
      fontFamily: {
        'digit': ['var(--font-digit)'],
        'iransansfont': ['var(--iransansfont)'],
        'yekanbakhfont': ['var(--yekanbakhfont)'],
      },
      colors: {
        main: 'var(--main-bg)',
        'second': 'var(--second-bg)',
        'txt-color': 'var(--txt-color)',
        'main-color': 'var(--main-color)',
        'second-color': 'var(--second-color)',
        'hover': 'var(--hover-color)',

      },
      textColor: {
        base: 'var(--text-base)',
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
      },
      screens: {
        'sm': '640px',
        'md': '1024px',
        'lg': '1366px',
        'xl': '1440px',
        '2xl': '1920px',
      }
    },
  },
  plugins: [],
}
