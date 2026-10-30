/**
 * Design tokens — the single source of truth for every value in the app.
 *
 * Values come from DESIGN.md ("Daylight Folio") and are mirrored into
 * `tailwind.config.js`, so a className and a StyleSheet object can never drift.
 * Components MUST reference a token; never hard-code a hex, px, radius or ms.
 *
 * Reference palette (`palette`) is raw material. Use `themes.ts` in components.
 */

import palette from './palette.json';

export { palette };

export const fontFamilies = {
  /** Poppins 600 — headings, prices, spec values */
  display: 'Poppins_600SemiBold',
  /** Poppins 500 — buttons, inputs, chips, labels */
  displayMedium: 'Poppins_500Medium',
  /** Poppins 400 — metadata, captions */
  displayRegular: 'Poppins_400Regular',
  /** Lora 400 — prose, descriptions */
  text: 'Lora_400Regular',
  /** Lora 400 italic — captions, quotes */
  textItalic: 'Lora_400Regular_Italic',
  /** Lora 600 — prose emphasis */
  textSemibold: 'Lora_600SemiBold',
} as const;

export type FontFamilyToken = keyof typeof fontFamilies;

/** 4 px base scale (DESIGN.md §4.2) */
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

/** Almost-square corners; pill radii are reserved for avatars and count badges. */
export const radius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  sheet: 12,
  full: 9999,
} as const;

export const borderWidth = {
  hairline: 1,
  control: 1.5,
  strong: 1.5,
} as const;

export const opacity = {
  disabled: 0.4,
  pressed: 0.7,
  scrim: 0.56,
  photoScrim: 0.72,
} as const;

/** Icon grid: 24 px, 1.5 px monoline (DESIGN.md §4.4) */
export const icon = {
  sizes: { sm: 16, md: 20, lg: 24, xl: 32 },
  strokeWidth: 1.5,
} as const;

/** Touch targets (DESIGN.md §6.5) — visual size may be smaller than the hit area. */
export const control = {
  targetMin: 44,
  gapMin: 8,
  button: { large: 56, default: 48, compact: 40 },
  field: { large: 56, default: 52, dense: 48 },
  chip: 40,
  tabBar: 56,
  header: { compact: 56, medium: 64, expanded: 72 },
} as const;

export type TextStyleToken = {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing?: number;
  textTransform?: 'uppercase' | 'none';
};

/**
 * Type scale (DESIGN.md §3.2) at compact (phone) sizes.
 * Weight lives in the font family, not in fontWeight: on Android a custom
 * family plus fontWeight resolves to the wrong face.
 */
export const type = {
  display: {
    fontFamily: fontFamilies.display,
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.72,
  },
  h1: {
    fontFamily: fontFamilies.display,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.42,
  },
  h2: {
    fontFamily: fontFamilies.display,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.22,
  },
  h3: {
    fontFamily: fontFamilies.display,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.1,
  },
  h4: {
    fontFamily: fontFamilies.display,
    fontSize: 16,
    lineHeight: 24,
  },
  priceXl: {
    fontFamily: fontFamilies.display,
    fontSize: 32,
    lineHeight: 35,
    letterSpacing: -0.32,
  },
  priceLg: {
    fontFamily: fontFamilies.display,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.11,
  },
  priceSm: {
    fontFamily: fontFamilies.display,
    fontSize: 14,
    lineHeight: 17,
  },
  bodyLg: {
    fontFamily: fontFamilies.text,
    fontSize: 18,
    lineHeight: 30,
  },
  body: {
    fontFamily: fontFamilies.text,
    fontSize: 16,
    lineHeight: 26,
  },
  bodySm: {
    fontFamily: fontFamilies.text,
    fontSize: 14,
    lineHeight: 22,
  },
  ui: {
    fontFamily: fontFamilies.displayMedium,
    fontSize: 15,
    lineHeight: 21,
  },
  uiSm: {
    fontFamily: fontFamilies.displayMedium,
    fontSize: 14,
    lineHeight: 20,
  },
  meta: {
    fontFamily: fontFamilies.displayRegular,
    fontSize: 14,
    lineHeight: 20,
  },
  spec: {
    fontFamily: fontFamilies.display,
    fontSize: 16,
    lineHeight: 19,
  },
  label: {
    fontFamily: fontFamilies.displayMedium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.96,
    textTransform: 'uppercase',
  },
  caption: {
    fontFamily: fontFamilies.displayRegular,
    fontSize: 12,
    lineHeight: 17,
    letterSpacing: 0.12,
  },
} as const satisfies Record<string, TextStyleToken>;

/** Elevation is mostly flat; shadows only for floating layers (DESIGN.md §4.3). */
const shadowInk = palette.ink[900];

export const elevation = {
  0: {},
  1: {
    shadowColor: shadowInk,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 0,
    elevation: 1,
  },
  2: {
    shadowColor: shadowInk,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  3: {
    shadowColor: shadowInk,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 8,
  },
} as const;

export const zIndex = {
  base: 0,
  sticky: 100,
  tray: 200,
  drawer: 300,
  modal: 400,
  toast: 500,
  tooltip: 600,
} as const;

/** Motion tokens (DESIGN.md §7.2). Mirrored as Reanimated presets in `motion.ts`. */
export const durations = {
  instant: 80,
  fast: 120,
  base: 200,
  slow: 320,
} as const;

export type DurationToken = keyof typeof durations;

/** cubic-bezier control points; consumers build their own easing object. */
export const easingCurves = {
  standard: [0.2, 0, 0, 1],
  exit: [0.4, 0, 1, 1],
} as const;

export const layout = {
  breakpoints: { medium: 600, expanded: 1024, wide: 1440 },
  contentMax: 1360,
  readingMax: 720,
  cardMinWidth: 288,
} as const;

export const aspectRatio = {
  cardPhoto: 4 / 3,
  featurePhoto: 4 / 5,
  heroPhoto: 3 / 2,
  square: 1,
} as const;
