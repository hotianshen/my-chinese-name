/** @type {import('tailwindcss').Config} */
// Design system — "My Chinese Name" · literati-luxe, East-meets-West.
// Colours are driven by CSS variables (see src/index.css) so the lacquer dark
// theme is a single [data-theme="dark"] swap. The 90 / 8 / 2 rule governs use:
// ~90% paper+ink, ~8% gold (hairlines, numerals, eyebrows), ~2% vermilion (seal + 1 CTA).
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        paper: {
          100: 'var(--paper-100)',
          200: 'var(--paper-200)',
          300: 'var(--paper-300)',
          400: 'var(--paper-400)',
        },
        ink: {
          900: 'var(--ink-900)',
          700: 'var(--ink-700)',
          500: 'var(--ink-500)',
          300: 'var(--ink-300)',
        },
        seal: {
          600: 'var(--seal-600)',
          500: 'var(--seal-500)',
          400: 'var(--seal-400)',
          100: 'var(--seal-100)',
        },
        gold: {
          600: 'var(--gold-600)',
          500: 'var(--gold-500)',
          300: 'var(--gold-300)',
          100: 'var(--gold-100)',
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        info: 'var(--info)',
      },
      fontFamily: {
        // Fraunces — literary display serif. Inter — body/UI.
        // Noto Serif SC — Han display (the name as artifact). LXGW WenKai — warm brush accent.
        display: ['Fraunces', 'Noto Serif SC', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        han: ['"Noto Serif SC"', 'Fraunces', 'serif'],
        brush: ['"LXGW WenKai"', '"Noto Serif SC"', 'serif'],
      },
      fontSize: {
        eyebrow: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.18em' }],
        caption: ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        body: ['1.0625rem', { lineHeight: '1.7' }],
        lede: ['1.375rem', { lineHeight: '1.55' }],
        'heading-3': ['1.5rem', { lineHeight: '1.25', letterSpacing: '-0.005em' }],
        'display-2': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-1': ['3.25rem', { lineHeight: '1.08', letterSpacing: '-0.015em' }],
        'display-hero': ['4.5rem', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
      },
      letterSpacing: { eyebrow: '0.18em', han: '0.04em' },
      maxWidth: {
        reading: '680px',
        'reading-han': '620px',
        band: '1200px',
        canvas: '1440px',
      },
      spacing: {
        '2xs': '4px', xs: '8px', sm: '12px', md: '16px', lg: '24px',
        '2lg': '32px', xl: '48px', '2xl': '64px', '3xl': '96px',
        '4xl': '128px', '5xl': '192px', '6xl': '256px',
      },
      borderRadius: { chip: '2px', card: '4px', modal: '8px' },
      boxShadow: {
        paper: '0 1px 2px rgba(28,27,24,.05), 0 8px 24px rgba(28,27,24,.06)',
        lift: '0 2px 4px rgba(28,27,24,.06), 0 18px 48px rgba(28,27,24,.10)',
        seal: '0 0 0 rgba(200,52,31,0)',
      },
      transitionTimingFunction: { expo: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'draw-line': { '0%': { transform: 'scaleX(0)' }, '100%': { transform: 'scaleX(1)' } },
        breathe: { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.008)' } },
        'seal-press': {
          '0%': { opacity: '0', transform: 'scale(1.4) rotate(-4deg)' },
          '60%': { opacity: '1', transform: 'scale(0.97) rotate(1deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both',
        'draw-line': 'draw-line 0.7s cubic-bezier(0.22,1,0.36,1) both',
        breathe: 'breathe 6s ease-in-out infinite',
        'seal-press': 'seal-press 0.7s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
}
