# Lintel

A property discovery app for browsing homes, building a shortlist, and comparing
what you saved. A lintel is the beam that carries the weight above an opening —
the brand's idea is structure that lets the light in.

Built with Expo (SDK 58) and Expo Router on React Native.

## Getting started

```bash
npm install
npm start          # then press `a` for the Android emulator
```

`.env.local` must define the Clerk keys — the app throws on boot without the
publishable one:

```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

## Scripts

| Command             | What it does                              |
| ------------------- | ----------------------------------------- |
| `npm start`         | Dev server (Metro + Expo Router)          |
| `npm run android`   | Build and run a local Android dev build   |
| `npm run lint`      | ESLint (`eslint-config-expo`)             |
| `npm run typecheck` | `tsc --noEmit`                            |

Run lint and typecheck before calling any change done.

## Structure

```
src/app/                 routes only — every file here is a screen
  _layout.tsx            fonts, Clerk, theme, and the signed-in / signed-out guard
  (auth)/                sign-in, sign-up — reached when signed out
  (root)/(tabs)/         the five destinations behind the tab bar
src/components/          everything else: ui/ primitives, auth/ scaffold, tab bar
src/hooks/               theme, breakpoints, motion
src/theme/               design tokens, light/dark palettes, navigation theme
```

Navigation uses `Stack.Protected` on Clerk's `isLoaded` / `isSignedIn`, so the
route tree itself is the gate: there is no redirect effect and no flash of the
wrong screen.

## Design

`DESIGN.md` is the source of truth ("Daylight Folio"): paper and ink with a
single ember accent, Poppins for structure and Lora for reading, hairline rules
instead of boxes, 44 px touch targets, and motion that only touches transform
and opacity. Every value lives in `src/theme/tokens.ts`; components reference a
token rather than a hex, px, radius, or duration.

Two rules keep that true: a component never hard-codes a visual value, and
nothing in `src/components` imports from `src/app` (routes depend on components,
never the reverse).

## Assets

`lintel-brand-kit/` holds the logo system, app icons, favicons, and banners. The
wordmark on screen is typography (`components/ui/wordmark.tsx`), not an image, so
it stays crisp at every size and follows the theme.
