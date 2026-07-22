/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#ffffff',
          70: 'rgba(255, 255, 255, 0.7)',
          50: 'rgba(255, 255, 255, 0.5)',
          45: 'rgba(255, 255, 255, 0.45)',
          35: 'rgba(255, 255, 255, 0.35)',
          30: 'rgba(255, 255, 255, 0.3)',
          20: 'rgba(255, 255, 255, 0.2)',
          15: 'rgba(255, 255, 255, 0.15)',
          '06': 'rgba(255, 255, 255, 0.06)',
          '04': 'rgba(255, 255, 255, 0.04)',
          'dim': '#dadada',
          'faint': 'rgba(255, 255, 255, 0.15)',
        },
        red: {
          DEFAULT: '#ff571a',
          glow: 'rgba(255, 87, 26, 0.5)',
        },
        ink: {
          DEFAULT: '#000000',
        },
        border: {
          DEFAULT: '#2e2d2d',
          dim: 'rgba(46, 45, 45, 0.5)',
        },
        green: {
          DEFAULT: '#22c55e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        pixel: ['"Geist Pixel"', 'monospace'],
      },
      keyframes: {
        'signal-flicker': {
          '0%, 92%, 100%': { opacity: '1', transform: 'translate(0)' },
          '93%': { opacity: '0.4', transform: 'translate(-2px, 1px)' },
          '95%': { opacity: '0.8', transform: 'translate(1px, -1px)' },
          '97%': { opacity: '0.3', transform: 'translate(-1px)' },
        },
        'watermark-glitch': {
          '0%': { transform: 'translateY(-50%) translate(0)', filter: 'none', opacity: '0.08' },
          '2%': { transform: 'translateY(-50%) translate(8px, -3px)', filter: 'hue-rotate(90deg) saturate(3)', opacity: '0.12' },
          '4%': { transform: 'translateY(-50%) translate(-6px, 2px)', filter: 'hue-rotate(-60deg)', opacity: '0.06' },
          '5%': { transform: 'translateY(-50%) translate(0)', filter: 'none', opacity: '0.08' },
          '15%': { transform: 'translateY(-50%) translate(0)', filter: 'none', opacity: '0.08' },
          '15.5%': { transform: 'translateY(-50%) translate(-10px) skew(-3deg)', filter: 'hue-rotate(180deg) saturate(4)', opacity: '0.15' },
          '16%': { transform: 'translateY(-50%) translate(5px, -2px) skew(2deg)', filter: 'hue-rotate(-90deg) brightness(1.5)', opacity: '0.1' },
          '17%': { transform: 'translateY(-50%) translate(-3px, 1px)', filter: 'saturate(2)', opacity: '0.12' },
          '18%': { transform: 'translateY(-50%) translate(0)', filter: 'none', opacity: '0.08' },
          '40%': { transform: 'translateY(-50%) translate(0)', filter: 'none', opacity: '0.08' },
          '40.3%': { transform: 'translateY(-50%) translate(12px) scaleX(1.02)', filter: 'hue-rotate(120deg) saturate(5)', opacity: '0.18' },
          '40.6%': { transform: 'translateY(-50%) translate(-8px, 3px) scaleX(0.98)', filter: 'hue-rotate(-45deg)', opacity: '0.05' },
          '41%': { transform: 'translateY(-50%) translate(4px, -1px)', filter: 'brightness(1.3)', opacity: '0.1' },
          '41.5%': { transform: 'translateY(-50%) translate(0)', filter: 'none', opacity: '0.08' },
          '65%': { transform: 'translateY(-50%) translate(0)', filter: 'none', opacity: '0.08' },
          '65.2%': { transform: 'translateY(-50%) translate(-5px, -4px) skew(-5deg)', filter: 'hue-rotate(200deg) saturate(3) brightness(1.4)', opacity: '0.2' },
          '65.5%': { transform: 'translateY(-50%) translate(7px, 2px) skew(2deg)', filter: 'hue-rotate(-120deg)', opacity: '0.04' },
          '66%': { transform: 'translateY(-50%) translate(-2px)', filter: 'saturate(2)', opacity: '0.1' },
          '66.5%': { transform: 'translateY(-50%) translate(0)', filter: 'none', opacity: '0.08' },
          '100%': { transform: 'translateY(-50%) translate(0)', filter: 'none', opacity: '0.08' },
        },
        'ticker': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pupil-glitch': {
          '0%, 100%': { opacity: '1', transform: 'translate(0)' },
          '2%': { opacity: '0.8', transform: 'translate(2px, -1px)' },
          '3%': { opacity: '0.5', transform: 'translate(-2px, 1px)' },
          '4%': { opacity: '1', transform: 'translate(0)' },
          '40%': { opacity: '1', transform: 'translate(0)' },
          '40.3%': { opacity: '0.6', transform: 'translate(-3px, 0)' },
          '40.8%': { opacity: '0.3', transform: 'translate(2px, -1px)' },
          '41.5%': { opacity: '1', transform: 'translate(0)' },
          '75%': { opacity: '1', transform: 'translate(0)' },
          '75.2%': { opacity: '0.7', transform: 'translate(1px, 2px)' },
          '75.6%': { opacity: '0.4', transform: 'translate(-2px, -1px)' },
          '76%': { opacity: '1', transform: 'translate(0)' }
        },
        'disconnect-drift-left': {
          '0%, 80%, 100%': { transform: 'translate(0)', opacity: '0.5' },
          '85%': { transform: 'translate(-6px, 2px)', opacity: '0.3' },
          '90%': { transform: 'translate(-10px, 4px)', opacity: '0.15' },
          '95%': { transform: 'translate(-4px, 1px)', opacity: '0.4' },
        },
        'disconnect-drift-right': {
          '0%, 80%, 100%': { transform: 'translate(0)', opacity: '0.5' },
          '85%': { transform: 'translate(6px, -2px)', opacity: '0.3' },
          '90%': { transform: 'translate(10px, -4px)', opacity: '0.15' },
          '95%': { transform: 'translate(4px, -1px)', opacity: '0.4' },
        },
        'terminalLineIn': {
          '0%': { opacity: '0' },
          '0.01%': { opacity: '1' },
          '100%': { opacity: '1' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'howProgressFill': {
          '0%': { height: '0%' },
          '100%': { height: '100%' },
        }
      },
      animation: {
        'signal-flicker': 'signal-flicker 4s ease-in-out infinite',
        'watermark-glitch': 'watermark-glitch 4s linear infinite',
        'ticker': 'ticker 18s linear infinite',
        'pupil-glitch': 'pupil-glitch 4s linear infinite',
        'disconnect-drift-left': 'disconnect-drift-left 6s ease-in-out infinite',
        'disconnect-drift-right': 'disconnect-drift-right 6s ease-in-out infinite',
        'terminalLineIn': 'terminalLineIn 0.01s step-end forwards',
        'blink': 'blink 1.5s step-end infinite',
        'howProgressFill': 'howProgressFill 6s linear forwards',
      }
    },
  },
  plugins: [],
}
