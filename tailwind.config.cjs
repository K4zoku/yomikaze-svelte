/** @type {import('tailwindcss').Config} */
const { addIconSelectors } = require('@iconify/tailwind');

module.exports = {
  content: ['./src/**/*.{svelte,js,ts}'],
  theme: {
    extend: {
      scale: {
        flip: '-1'
      },
      spacing: {
        '112': '28rem',
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
        '192': '48rem',
        '224': '56rem',
        '256': '64rem',
      }
    }
  },
  plugins: [require('@tailwindcss/typography'), require('tailwind-scrollbar'), require('daisyui'), addIconSelectors(['lucide', 'hugeicons', 'la'])],
  daisyui: {
    darkTheme: 'ayu-mirage',
    themes: [
      {
        'ayu-light': {
          primary: '#399EE6',
          secondary: '#6CBF43',
          accent: '#FA8D3E',
          'accent-content': '#FCFCFC',
          neutral: '#ACB6BF',
          'base-100': '#FCFCFC',
          'base-200': '#F3F4F5',
          'base-300': '#E5E7E9',
          info: '#399EE6',
          'info-content': '#FCFCFC',
          success: '#6CBF43',
          'success-content': '#FCFCFC',
          warning: '#F2AE49',
          'warning-content': '#FCFCFC',
          error: '#E65050',
          'error-content': '#FCFCFC',
        },
        'ayu-mirage': {
          primary: '#5CCFE6',
          secondary: '#87D96C',
          accent: '#FFCC66',
          neutral: '#B8CFE6',
          'base-100': '#242936',
          'base-200': '#1F2430',
          'base-300': '#1C212B',
          info: '#73D0FF',
          success: '#87D96C',
          warning: '#FFD173',
          error: '#FF6666'
        },
        'ayu-dark': {
          primary: '#39BAE6',
          secondary: '#7FD962',
          accent: '#E6B450',
          neutral: '#ACB6BF',
          'base-100': '#0F131A',
          'base-200': '#0D1017',
          'base-300': '#0B0E14',
          info: '#59C2FF',
          success: '#7FD962',
          warning: '#FFB454',
          error: '#D95757'
        }
      }
    ]
  }
};
