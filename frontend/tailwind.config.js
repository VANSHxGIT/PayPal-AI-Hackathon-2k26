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
          DEFAULT: '#0B0E14',
          subtle: '#10141D',
          deep: '#080A0F',
          card: '#131924'
        },
        surface: {
          base: '#0F141F',
          card: '#141B28',
          elevated: '#1A2333',
          border: '#222C3F',
          light: '#F8FAFC',
          lightsubtle: '#EDF2F7',
          lightborder: '#CBD5E1'
        },
        ink: {
          DEFAULT: '#F1F5F9',
          secondary: '#CBD5E1',
          muted: '#8A99AD',
          faint: '#4E5D73'
        },
        accent: {
          DEFAULT: '#3B82F6',
          navy: '#1E3A8A',
          steel: '#4A628A',
          emerald: '#10B981',
          amber: '#F59E0B',
          cyan: '#0284C7'
        },
        borderline: {
          DEFAULT: '#1E293B',
          light: '#334155',
          dark: '#131B27',
          subtle: '#192231'
        }
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Cinzel"', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      borderRadius: {
        none: '0px',
        xs: '1px',
        sm: '2px',
        DEFAULT: '2px',
        md: '2px',
        lg: '3px',
        xl: '4px'
      },
      boxShadow: {
        none: 'none'
      }
    },
  },
  plugins: [],
}
