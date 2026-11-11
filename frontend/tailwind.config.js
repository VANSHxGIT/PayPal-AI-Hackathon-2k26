/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Wise-inspired: Forest Ink as dominant brand dark */
        'forest-ink':   '#163300',
        'spruce':       '#054d28',
        'lime-voltage': '#9fe870',
        'linen-mist':   '#e2f6d5',
        'signal-blue':  '#0b4c72',
        'alarm-red':    '#cb272f',
        'charcoal':     '#454745',
        'obsidian':     '#0e0f0c',
        'pebble':       '#868685',
        'slate':        '#6a6c6a',
        'fog':          '#e8ebe6',
        'paper':        '#ffffff',
      },
      fontFamily: {
        display: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        body:    ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono:    ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        micro:      ['12px', { lineHeight: '1.63', letterSpacing: '-0.036px' }],
        caption:    ['14px', { lineHeight: '1.55', letterSpacing: '-0.07px'  }],
        'body-sm':  ['16px', { lineHeight: '1.5',  letterSpacing: '-0.096px' }],
        body:       ['18px', { lineHeight: '1.5',  letterSpacing: '-0.126px' }],
        'body-lg':  ['25px', { lineHeight: '1.3',  letterSpacing: '-0.225px' }],
        subheading: ['36px', { lineHeight: '1.25', letterSpacing: '-0.396px' }],
        'head-sm':  ['45px', { lineHeight: '1.1',  letterSpacing: '-0.495px' }],
        head:       ['61px', { lineHeight: '1.1',  letterSpacing: '-0.915px' }],
        'head-lg':  ['80px', { lineHeight: '0.9',  letterSpacing: '-2.4px'   }],
        display:    ['100px',{ lineHeight: '0.88', letterSpacing: '-3px'     }],
      },
      borderRadius: {
        full:  '9999px',
        image: '1000px',
        card:  '10px',
        'card-lg': '28px',
        input: '10px',
        badge: '9999px',
      },
      boxShadow: {
        subtle:   'rgba(14,15,12,0.12) 0px 0px 0px 1px',
        'subtle-2': 'rgb(134,134,133) 0px 0px 0px 1px inset',
        xl:   'rgba(0,0,0,0.15) 0px 10px 32px 0px, rgba(0,0,0,0.04) 0px 40px 40px 0px',
        lg:   'rgba(0,0,0,0.08) 0px 6px 20px 0px',
      },
      maxWidth: {
        page: '1200px',
      },
    },
  },
  plugins: [],
}
