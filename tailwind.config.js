/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lilac: {
          300: '#C7B5F2',
          400: '#B29CEB',
          500: '#9B84D6',
          600: '#876CC4',
          700: '#7256B0',
          800: '#5E4398'
        },
        console: {
          shell: '#9D85D8',
          shellDark: '#856BC3',
          shellHighlight: '#B5A0EC',
          bezel: '#181726',
          screenBg: '#0b0f19',
          wine: '#8E2856',
          wineActive: '#6B1B3E',
          wineHover: '#A83266',
          dpad: '#282732',
          dpadActive: '#1A1922'
        },
        retro: {
          mint: '#34d399',
          neonCyan: '#22d3ee',
          amber: '#fbbf24',
          pink: '#f43f5e'
        }
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        retro: ['"Silkscreen"', 'monospace'],
        lcd: ['"VT323"', 'monospace'],
        mono: ['"Fira Code"', 'monospace'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif']
      },
      boxShadow: {
        'shell-outer': '0 35px 80px -15px rgba(12, 9, 30, 0.8), 0 20px 45px -18px rgba(0, 0, 0, 0.6), inset 0 3px 6px rgba(255, 255, 255, 0.45), inset 0 -6px 10px rgba(0, 0, 0, 0.35)',
        'bezel-inner': 'inset 0 6px 14px rgba(0,0,0,0.85), inset 0 -2px 5px rgba(255,255,255,0.06)',
        'btn-wine': '0 5px 0 #581432, 0 10px 18px rgba(0,0,0,0.45)',
        'btn-wine-pressed': '0 2px 0 #581432, 0 3px 8px rgba(0,0,0,0.45)',
        'dpad-btn': '0 5px 0 #15151c, 0 8px 14px rgba(0,0,0,0.5)',
        'dpad-pressed': '0 2px 0 #15151c, inset 0 2px 5px rgba(0,0,0,0.65)',
        'terminal-glow': '0 0 25px rgba(155, 132, 214, 0.15), inset 0 1px 1px rgba(255,255,255,0.1)'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
