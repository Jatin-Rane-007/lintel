/**
 * Tailwind/NativeWind config — the utility mirror of `src/theme/tokens.ts`.
 *
 * Two rules keep this honest:
 * 1. Colours are the raw brand palette only (`bg-paper`, `text-ink`,
 *    `dark:bg-night-800`). Dark mode is always explicit, so a class can never
 *    silently render an unverified contrast pair.
 * 2. Semantic names (surface, text, accent…) live in the TS theme, because
 *    React Native has no CSS cascade to swap them. Use `useTheme()` for
 *    runtime colours, `dark:` utilities for static layout.
 */

const palette = require('./src/theme/palette.json');
const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    // Raw palette only. Utilities such as `bg-red-500` do not exist on purpose.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: palette.white,
      paper: { DEFAULT: palette.paper[50], 100: palette.paper[100] },
      linen: { DEFAULT: palette.linen[200], 200: palette.linen[200] },
      ink: {
        DEFAULT: palette.ink[900],
        900: palette.ink[900],
        700: palette.ink[700],
        500: palette.ink[500],
      },
      stone: { 400: palette.stone[400], 500: palette.stone[500], 600: palette.stone[600] },
      night: {
        950: palette.night[950],
        800: palette.night[800],
        700: palette.night[700],
        600: palette.night[600],
      },
      ember: {
        DEFAULT: palette.ember[500],
        50: palette.ember[50],
        400: palette.ember[400],
        500: palette.ember[500],
        550: palette.ember[550],
        700: palette.ember[700],
        tint: palette.ember.darkTint,
      },
      sky: {
        DEFAULT: palette.sky[500],
        50: palette.sky[50],
        300: palette.sky[300],
        500: palette.sky[500],
        700: palette.sky[700],
        dark: palette.sky.darkBg,
      },
      moss: {
        DEFAULT: palette.moss[500],
        50: palette.moss[50],
        300: palette.moss[300],
        500: palette.moss[500],
        700: palette.moss[700],
        dark: palette.moss.darkBg,
      },
      amber: {
        DEFAULT: palette.amber[700],
        50: palette.amber[50],
        300: palette.amber[300],
        700: palette.amber[700],
        dark: palette.amber.darkBg,
      },
      danger: {
        DEFAULT: palette.error[700],
        50: palette.error[50],
        300: palette.error[300],
        700: palette.error[700],
        dark: palette.error.darkBg,
      },
    },
    extend: {
      // Weight lives in the family name: Android ignores fontWeight on custom faces.
      fontFamily: {
        display: ['Poppins_600SemiBold'],
        'display-medium': ['Poppins_500Medium'],
        'display-regular': ['Poppins_400Regular'],
        text: ['Lora_400Regular'],
        'text-italic': ['Lora_400Regular_Italic'],
        'text-semibold': ['Lora_600SemiBold'],
      },
      // DESIGN.md §3.2 type scale (compact values).
      fontSize: {
        display: ['36px', { lineHeight: '40px', letterSpacing: '-0.02em' }],
        h1: ['28px', { lineHeight: '34px', letterSpacing: '-0.015em' }],
        h2: ['22px', { lineHeight: '28px', letterSpacing: '-0.01em' }],
        h3: ['20px', { lineHeight: '28px', letterSpacing: '-0.005em' }],
        h4: ['16px', { lineHeight: '24px' }],
        'price-xl': ['32px', { lineHeight: '35px', letterSpacing: '-0.01em' }],
        'price-lg': ['22px', { lineHeight: '28px', letterSpacing: '-0.005em' }],
        'price-sm': ['14px', { lineHeight: '17px' }],
        'body-lg': ['18px', { lineHeight: '30px' }],
        body: ['16px', { lineHeight: '26px' }],
        'body-sm': ['14px', { lineHeight: '22px' }],
        ui: ['15px', { lineHeight: '21px' }],
        'ui-sm': ['14px', { lineHeight: '20px' }],
        meta: ['14px', { lineHeight: '20px' }],
        spec: ['16px', { lineHeight: '19px' }],
        label: ['12px', { lineHeight: '16px', letterSpacing: '0.08em' }],
        caption: ['12px', { lineHeight: '17px', letterSpacing: '0.01em' }],
      },
      // 4 px grid. 11 = 44 px minimum touch target.
      spacing: {
        0: '0px',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        7: '28px',
        8: '32px',
        9: '36px',
        10: '40px',
        11: '44px',
        12: '48px',
        16: '64px',
        20: '80px',
        24: '96px',
      },
      borderRadius: {
        none: '0px',
        xs: '2px',
        sm: '4px',
        md: '8px',
        sheet: '12px',
        full: '9999px',
      },
      borderWidth: {
        hairline: hairlineWidth(),
        control: 1.5,
        strong: 1.5,
      },
      letterSpacing: {
        display: '-0.02em',
        heading: '-0.015em',
        tight: '-0.01em',
        label: '0.08em',
      },
      screens: {
        medium: '600px',
        expanded: '1024px',
        wide: '1440px',
      },
      zIndex: {
        sticky: '100',
        tray: '200',
        drawer: '300',
        modal: '400',
        toast: '500',
        tooltip: '600',
      },
    },
  },
  plugins: [],
};
