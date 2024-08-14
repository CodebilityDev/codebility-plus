// This is a dummy tailwind config file used to provide intellisense.
// To configure your global tailwind settings, modify the imported theme object.
const { theme } = require('app/design/tailwind/theme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.{js,jsx,ts,tsx}'],
  theme: {
    ...theme,
    extend: {
      colors: {
        custom: {
          green: '#22C55E',
          black: '#1e1e1e',
          gray: '#ededed',
          textGray: '#454545',
          badge: {
            greenbg: '#bcf6cc',
            redbg: '#fecdcd',
          },
        },
      },
    },
  },
}
