/** @type {import('tailwindcss').Config} */
const { addIconSelectors } = require('@iconify/tailwind');

module.exports = {
  content: ['./src/**/*.{svelte,js,ts}', './src/app.html'],
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
  plugins: [require('@tailwindcss/typography'), require('tailwind-scrollbar')({ nocompatible: true }), require('daisyui'), addIconSelectors(['lucide', 'hugeicons', 'la', 'fluent'])],
  daisyui: {
    darkTheme: 'ayu-mirage',
    themes: [
      {
        'ayu-light': {
          primary: '#399EE6',
          secondary: '#6CBF43',
          neutral: '#ACB6BF',
          'base-100': '#FCFCFC',
          'base-200': '#F3F4F5',
          'base-300': '#E5E7E9',
          accent: '#FA8D3E',
          info: '#399EE6',
          success: '#6CBF43',
          warning: '#F2AE49',
          error: '#E65050',
          'base-content': '#242936',
          'accent-content': '#FCFCFC',
          'primary-content': '#FCFCFC',
          'secondary-content': '#FCFCFC',
          'info-content': '#FCFCFC',
          'success-content': '#FCFCFC',
          'warning-content': '#FCFCFC',
          'error-content': '#FCFCFC',
          "--rounded-box": "1rem", // border radius rounded-box utility class, used in card and other large boxes
          "--rounded-btn": "0.25rem", // border radius rounded-btn utility class, used in buttons and similar element
          "--rounded-badge": "1.9rem", // border radius rounded-badge utility class, used in badges and similar
          "--animation-btn": "0.25s", // duration of animation when you click on button
          "--animation-input": "0.2s", // duration of animation for inputs like checkbox, toggle, radio, etc
          "--btn-focus-scale": "0.95", // scale transform of button when you focus on it
          "--border-btn": "1px", // border width of buttons
          "--tab-border": "1px", // border width of tabs
          "--tab-radius": "0.5rem", // border radius of tabs
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
