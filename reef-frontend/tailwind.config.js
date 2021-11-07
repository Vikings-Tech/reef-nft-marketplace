
module.exports =
{
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'], theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF0066",
          light: "#F7EBEF",
          dark: "#A77289",
        }
      },
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/forms'),

  ],
}
