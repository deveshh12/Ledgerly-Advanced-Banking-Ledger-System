/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'ui-sans-serif', 'sans-serif']
      },
      colors: {
        ink: {
          950: '#05070d',
          900: '#0a0e1a',
          850: '#0d1220',
          800: '#111827',
          700: '#1a2236',
          600: '#242e47',
          500: '#334063'
        },
        gold: {
          400: '#f2cd7c',
          500: '#e8b84b',
          600: '#c9982f'
        },
        emerald: {
          400: '#3ddc97',
          500: '#22c58b'
        },
        mist: {
          300: '#c9d2e3',
          400: '#a3aec7',
          500: '#7d8aa8'
        }
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(232,184,75,0.15), 0 20px 60px -20px rgba(232,184,75,0.25)',
        card: '0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 50px -24px rgba(0,0,0,0.6)',
        soft: '0 10px 40px -14px rgba(0,0,0,0.5)'
      },
      backgroundImage: {
        'grid-fade': 'radial-gradient(circle at 20% -10%, rgba(232,184,75,0.14), transparent 45%), radial-gradient(circle at 100% 0%, rgba(61,220,151,0.10), transparent 40%)',
        'card-sheen': 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0) 40%)'
      },
      animation: {
        'fade-up': 'fadeUp .5s ease both',
        shimmer: 'shimmer 2.2s linear infinite'
      },
      keyframes: {
        fadeUp: { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-700px 0' }, '100%': { backgroundPosition: '700px 0' } }
      }
    }
  },
  plugins: []
}
