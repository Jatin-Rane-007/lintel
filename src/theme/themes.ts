/**
 * Semantic themes. Components consume these, never the raw palette.
 *
 * Every pair below is a verified WCAG 2.2 AA combination (DESIGN.md §2.6):
 * text ≥ 4.5:1, UI borders and icons ≥ 3:1, in light and in "Lamplight" dark.
 */

import { palette } from './tokens';

export type ThemeScheme = 'light' | 'dark';

export type ThemeColors = {
  /** Page background. Paper in light, warm near-black in dark — never pure white/black. */
  bg: string;
  /** Recessed areas, image placeholders. */
  bgSunk: string;
  /** Cards, inputs, chips. */
  surface: string;
  /** Menus, popovers, sheets. */
  surfaceRaised: string;
  /** Skeleton blocks. */
  skeleton: string;

  borderHairline: string;
  borderControl: string;
  borderStrong: string;

  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  inverseBg: string;

  /** The single "act here" fill. */
  accentFill: string;
  accentFillHover: string;
  accentFillPressed: string;
  /** Text/icon colour on top of accentFill (ink — 5.9:1). */
  onAccent: string;
  /** Accent used as text/icon, safe in both modes. */
  accentText: string;
  /** Tinted background for selected/compare rows. */
  accentTint: string;
  /** Accent text drawn on `inverseBg` (toast action links). */
  accentTextOnInverse: string;

  focus: string;

  successText: string;
  successBg: string;
  warningText: string;
  warningBg: string;
  errorText: string;
  errorBg: string;
  infoText: string;
  infoBg: string;

  unavailableBg: string;
  unavailableText: string;
  disabledBg: string;
  disabledText: string;

  /** Modal / lightbox scrim. */
  scrim: string;
};

export type ThemeGradients = {
  /** Functional photo scrim: [start, end] for a vertical gradient. */
  mediaScrim: readonly [string, string];
};

export type Theme = {
  scheme: ThemeScheme;
  dark: boolean;
  /** `expo-status-bar` style: "dark" = dark glyphs on a light surface. */
  statusBarStyle: 'light' | 'dark';
  colors: ThemeColors;
  gradients: ThemeGradients;
};

const lightColors: ThemeColors = {
  bg: palette.paper[50],
  bgSunk: palette.paper[100],
  surface: palette.white,
  surfaceRaised: palette.white,
  skeleton: palette.linen[200],

  borderHairline: palette.linen[200],
  borderControl: palette.stone[500],
  borderStrong: palette.ink[900],

  text: palette.ink[900],
  textSecondary: palette.ink[700],
  textMuted: palette.ink[500],
  textInverse: palette.paper[50],
  inverseBg: palette.ink[900],

  accentFill: palette.ember[500],
  accentFillHover: palette.ember[400],
  accentFillPressed: palette.ember[550],
  onAccent: palette.ink[900],
  accentText: palette.ember[700],
  accentTint: palette.ember[50],
  accentTextOnInverse: palette.ember[400],

  focus: palette.sky[700],

  successText: palette.moss[700],
  successBg: palette.moss[50],
  warningText: palette.amber[700],
  warningBg: palette.amber[50],
  errorText: palette.error[700],
  errorBg: palette.error[50],
  infoText: palette.sky[700],
  infoBg: palette.sky[50],

  unavailableBg: palette.ink[500],
  unavailableText: palette.paper[50],
  disabledBg: palette.linen[200],
  disabledText: palette.stone[500],

  scrim: `rgba(20, 20, 19, ${0.56})`,
};

const darkColors: ThemeColors = {
  bg: palette.ink[900],
  bgSunk: palette.night[950],
  surface: palette.night[800],
  surfaceRaised: palette.night[700],
  skeleton: palette.night[700],

  borderHairline: palette.night[600],
  borderControl: palette.stone[600],
  borderStrong: palette.paper[50],

  text: palette.paper[50],
  textSecondary: palette.linen[200],
  textMuted: palette.stone[400],
  textInverse: palette.ink[900],
  inverseBg: palette.paper[50],

  accentFill: palette.ember[500],
  accentFillHover: palette.ember[400],
  accentFillPressed: palette.ember[550],
  onAccent: palette.ink[900],
  accentText: palette.ember[400],
  accentTint: palette.ember.darkTint,
  accentTextOnInverse: palette.ember[700],

  focus: palette.sky[300],

  successText: palette.moss[300],
  successBg: palette.moss.darkBg,
  warningText: palette.amber[300],
  warningBg: palette.amber.darkBg,
  errorText: palette.error[300],
  errorBg: palette.error.darkBg,
  infoText: palette.sky[300],
  infoBg: palette.sky.darkBg,

  unavailableBg: palette.ink[500],
  unavailableText: palette.paper[50],
  disabledBg: palette.night[600],
  disabledText: palette.stone[600],

  scrim: `rgba(14, 14, 13, ${0.72})`,
};

const lightGradients: ThemeGradients = {
  mediaScrim: ['rgba(20, 20, 19, 0.72)', 'rgba(20, 20, 19, 0)'],
};

export const themes: Record<ThemeScheme, Theme> = {
  light: {
    scheme: 'light',
    dark: false,
    statusBarStyle: 'dark',
    colors: lightColors,
    gradients: lightGradients,
  },
  dark: {
    scheme: 'dark',
    dark: true,
    statusBarStyle: 'light',
    colors: darkColors,
    gradients: lightGradients,
  },
};

export type ThemeColorToken = keyof ThemeColors;
