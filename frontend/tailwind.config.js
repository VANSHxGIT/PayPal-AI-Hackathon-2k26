/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#ECEEF1',
          subtle: '#E4E8EE',
          deep: '#DCE1E8'
        },
        surface: {
          light: '#F4F6F9',
          card: '#FAFBFD',
          dark: '#181C24',
          darkalt: '#11141B'
        },
        ink: {
          DEFAULT: '#11141A',
          secondary: '#363D4D',
          muted: '#5C667A',
          faint: '#8C96A8'
        },
        periwinkle: {
          DEFAULT: '#566794',
          dark: '#3E4D73',
          light: '#7283B0',
          tint: '#E4E8F2'
        },
        borderline: {
          DEFAULT: '#D2D7E0',
          dark: '#292F3E',
          muted: '#E0E4EB'
        },
        mono: {
          dark: '#161920',
          light: '#F5F7FA'
        }
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Cinzel"', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      borderRadius: {
        none: '0px',
        xs: '2px',
        sm: '3px',
        DEFAULT: '4px',
        md: '4px',
        lg: '4px',
        xl: '4px'
      },
      boxShadow: {
        none: 'none'
      }
    },
  },
  plugins: [],
}
