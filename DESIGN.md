# design.md — Daylight Folio

**Design specification for a property discovery app** (discover · browse · explore · compare · save)
Version 1.0 · Last updated 2026-10-29 · Applies to responsive web and any native shell that shares these tokens.

> **Brand foundation.** The seven core colors and the Poppins + Lora type pairing come from the brand guidelines supplied for this project. Everything else in this document (tints, states, dark mode, components) is derived from them. Every contrast ratio quoted here was calculated with the WCAG 2.x relative-luminance formula, not estimated.

---

## 0. How to use this document

**For developers and AI coding agents.**

1. **Precedence:** tokens (§11) → component specs (§8) → screen guidance (§5) → prose. If two rules conflict, the higher one wins.
2. **Never hard-code** a HEX value, pixel spacing, radius, duration, or font stack in a component. Reference a token.
3. **If a value is missing,** derive it from the nearest token. Do not invent a new color, radius, or shadow.
4. **Keywords:** MUST / MUST NOT are mandatory; SHOULD is the default unless there is a written reason; MAY is optional.
5. **Naming:** CSS prefix `df-` (Daylight Folio). Tokens are `--ref-*` (raw palette), `--color-*`, `--space-*`, `--radius-*`, `--shadow-*`, `--motion-*`, `--font-*`, `--text-*` (semantic). Components use BEM: `.df-card`, `.df-card__media`, `.df-card--selected`.
6. **Placeholders:** `{AppName}` is the product name. Example data in this document is fictional.

---

## 1. Design vision and identity

### 1.1 Design manifesto

1. **Light is the product.** People choose homes by how they feel at 8 a.m. and 6 p.m. The interface steps back so photographs carry the light.
2. **Photographs first, chrome second.** Every listing view gives the photo the largest area and never covers it with interface.
3. **Numbers are drawn, not decorated.** Price, beds, baths, and area live in ruled "title blocks" borrowed from architectural drawing sheets. They are compact, aligned, and instantly comparable.
4. **One point of light.** Ember orange appears once per view area: the single thing to act on, or the single thing that is selected. It is never scattered.
5. **Quiet paper, confident ink.** Warm paper backgrounds, near-black ink, hairline rules. Structure comes from lines and spacing, not boxes and shadows.
6. **Honest information.** Every figure has a source or a date. No fake urgency, no vague superlatives.
7. **Designed per screen.** Phone, tablet, and desktop each get their own composition.

### 1.2 Name and concept: **Daylight Folio**

A _folio_ is both an editorial page and a numbered drawing sheet. Daylight Folio treats every property as a page in a well-lit architect's portfolio: a large photograph, a ruled title block, and a single ember "sun-line" that marks where light enters the frame.

| Attribute       | Decision                                                                                                          |
| --------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Design type** | Editorial–architectural hybrid: warm minimalism with drafting conventions (hairlines, title blocks, survey marks) |
| **Personality** | Calm, precise, warm, unhurried. A studio with big windows, not a showroom                                         |
| **Surface**     | Warm paper (`#faf9f5`), ink (`#141413`), hairline rules, almost-square corners                                    |
| **Accent**      | Ember (`#d97757`) as a single point of light                                                                      |
| **Typography**  | Poppins for structure and numbers; Lora for reading                                                               |
| **Dark mode**   | "Lamplight": warm near-black, not pure black                                                                      |

### 1.3 Why this direction suits real estate discovery

- **Emotion and evidence are both required.** Buyers respond to atmosphere and then check numbers. Editorial photography handles the first; title-block data handles the second.
- **Trust comes from precision.** Ruled grids, consistent units, and dated information read as careful. Rounded pastel pills and red price tags read as promotional.
- **Warm paper separates it from the category.** Most listing apps use white backgrounds, saturated blue actions, and red or green price emphasis. A paper-and-ink base with a single orange accent is recognizable at thumbnail size.
- **It scales.** Hairline structure and a restrained palette stay readable from a 360 px phone to a 1440 px desktop with a map.

### 1.4 Voice and tone (UI copy)

| Attribute     | We are                      | We are not             | Sounds like                                     | Does not sound like                  |
| ------------- | --------------------------- | ---------------------- | ----------------------------------------------- | ------------------------------------ |
| **Warm**      | Friendly, plain, human      | Gushing or salesy      | "3 homes match. Want to widen the price range?" | "Amazing deals await you!!!"         |
| **Precise**   | Specific, dated, unit-aware | Vague or inflated      | "Updated 3 hours ago · 128 m²"                  | "Spacious and newly listed"          |
| **Unhurried** | Calm, no pressure           | Urgent or manipulative | "Saved. You can find it in Shortlist."          | "Hurry, 12 people are viewing this!" |
| **Plain**     | Short words, everyday terms | Jargon-heavy           | "Book a visit"                                  | "Initiate a viewing request"         |

**Style rules:** sentence case for headings, buttons, and labels; contractions allowed; Oxford comma; no exclamation marks in system UI; numerals for all quantities; `%` symbol; locale-aware dates, times, currency, and units (via `Intl`).

**Preferred terms**

| Use                 | Avoid                                   | Note                                                                      |
| ------------------- | --------------------------------------- | ------------------------------------------------------------------------- |
| Save / Saved        | Favorite, Like                          | Save is an action with a result (a list). "Favorite" implies ranking      |
| Book a visit        | Schedule a viewing, Request showing     | One verb for the primary action everywhere                                |
| Message agent       | Contact seller                          | Keeps it conversational                                                   |
| Compare             | Versus                                  |                                                                           |
| Beds, baths         | BR, BA (except where space-constrained) | Spell out in prose; compact form only inside map pins and tables ≤ 360 px |
| No longer available | Sold out, Gone                          | Neutral, accurate                                                         |
| Estimate            | Valuation                               | Anything calculated by us is labeled "Estimate"                           |

**Compliance guardrails (SHOULD be confirmed with counsel for each market).**

- System copy MUST NOT use superlatives ("best", "perfect", "dream home") or claims it cannot substantiate. Agent-written descriptions are shown as written and attributed to the agent.
- Neighborhood or amenity labels MUST NOT describe the kind of people who live there or who would suit a home. Describe places and facilities, not residents.
- Calculated values (mortgage, rent yield, valuation) MUST be labeled "Estimate" with a one-line plain-language caveat and a link to assumptions.
- Show the listing agent or agency name and the "Updated {time}" stamp on every detail page.
- Where exact addresses are withheld, show an "Approximate location" label (see §5.6).

---

## 2. Theme and color system

### 2.1 Core palette (exact HEX)

| Role                   | Token             | HEX       | Use                                                       |
| ---------------------- | ----------------- | --------- | --------------------------------------------------------- |
| **Primary (ink)**      | `--ref-ink-900`   | `#141413` | Text, icons, strong borders, dark background              |
| **Background (paper)** | `--ref-paper-50`  | `#faf9f5` | App background, light text on dark                        |
| **Secondary (linen)**  | `--ref-linen-200` | `#e8e6dc` | Hairlines, skeleton base, quiet fills                     |
| **Neutral (stone)**    | `--ref-stone-400` | `#b0aea5` | Decorative strokes, disabled glyphs, dark-mode muted text |
| **Accent (ember)**     | `--ref-ember-500` | `#d97757` | Primary action fill, selection, sun-line, saved state     |
| **Support (sky)**      | `--ref-sky-500`   | `#6a9bcc` | Water and info fills, chart series, map water             |
| **Support (moss)**     | `--ref-moss-500`  | `#788c5d` | Parks, positive fills, chart series                       |

> **Raw-color rule.** The raw accents fail 4.5:1 as text on paper: ember 2.96:1, sky 2.78:1, moss 3.49:1, stone 2.11:1. Use them as **fills, shapes, and decoration only**. For text and icons use the `-700` (light) or `-300/-400` (dark) steps below.

### 2.2 Derived scales

| Family              | 50 (tint) | 300 / 400 (dark-mode text) | 500 (brand) | 550 (pressed) | 700 (light-mode text) |
| ------------------- | --------- | -------------------------- | ----------- | ------------- | --------------------- |
| **Ember**           | `#fbece6` | 400 `#e4a085`              | `#d97757`   | `#cf6c47`     | `#9c4124`             |
| **Sky**             | `#e9f1f8` | 300 `#8fb4d9`              | `#6a9bcc`   |               | `#3a6a99`             |
| **Moss**            | `#eef2e7` | 300 `#9bb07d`              | `#788c5d`   |               | `#56683c`             |
| **Amber** (warning) | `#fbf1d9` | 300 `#e0b04a`              |             |               | `#8a5a00`             |
| **Error**           | `#fbe9e7` | 300 `#f0897f`              |             |               | `#b3261e`             |

**Neutrals**

| Token             | HEX       | Use                                |
| ----------------- | --------- | ---------------------------------- |
| `--ref-white`     | `#ffffff` | Card and input surfaces on paper   |
| `--ref-paper-100` | `#f1efe6` | Recessed areas, image placeholders |
| `--ref-ink-700`   | `#3d3d3a` | Secondary text                     |
| `--ref-ink-500`   | `#5e5d57` | Muted text, metadata               |
| `--ref-stone-500` | `#8a887f` | Control borders (light)            |
| `--ref-stone-600` | `#7a786f` | Control borders (dark)             |
| `--ref-night-950` | `#0e0e0d` | Recessed areas (dark)              |
| `--ref-night-800` | `#1e1e1c` | Surface (dark)                     |
| `--ref-night-700` | `#2a2a27` | Raised surface (dark)              |
| `--ref-night-600` | `#34342f` | Hairlines (dark)                   |

### 2.3 Semantic colors

| State       | Light text/icon     | Light background   | Dark text/icon      | Dark background | Non-color cue (required)    |
| ----------- | ------------------- | ------------------ | ------------------- | --------------- | --------------------------- |
| **Success** | Moss-700 `#56683c`  | Moss-50 `#eef2e7`  | Moss-300 `#9bb07d`  | `#232a1b`       | Check icon + text label     |
| **Warning** | Amber-700 `#8a5a00` | Amber-50 `#fbf1d9` | Amber-300 `#e0b04a` | `#33270b`       | Triangle icon + text label  |
| **Error**   | Error-700 `#b3261e` | Error-50 `#fbe9e7` | Error-300 `#f0897f` | `#3a1e1b`       | Octagon icon + message text |
| **Info**    | Sky-700 `#3a6a99`   | Sky-50 `#e9f1f8`   | Sky-300 `#8fb4d9`   | `#1b2835`       | Info icon + text label      |

### 2.4 Color usage rules by element

| Element                    | Rule                                                                                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Page background**        | Paper `#faf9f5`. Never pure white as a page background                                                                                           |
| **Property card**          | White surface, 1 px linen hairline, ink text. Ember appears only as the sun-line and the saved state                                             |
| **Price**                  | **Ink, Poppins 600.** Never orange, red, or green. Price changes use a moss "Price reduced" badge with an arrow icon; the price itself stays ink |
| **Primary CTA**            | Ember fill `#d97757` with **ink** text (5.90:1). One primary CTA per view area                                                                   |
| **Secondary button**       | Transparent, 1.5 px ink border, ink text. Hover fills ink with paper text                                                                        |
| **Text button / link**     | Ink-700 text with underline; accent links use Ember-700 `#9c4124` (6.24:1 on paper)                                                              |
| **Search field**           | White surface, 1.5 px control border `#8a887f` (3.37:1 on paper). Focus ring in sky-700                                                          |
| **Filter chip (idle)**     | White surface, control border, ink text                                                                                                          |
| **Filter chip (selected)** | **Ink fill, paper text, check icon.** Selection is never ember, so ember keeps its "act here" meaning                                            |
| **Navigation**             | Paper background, ink text; active item gets a 2 px ember underline **plus** ink bold text (ember alone is 2.96:1, not sufficient)               |
| **Saved state**            | Heart filled ember with a 1.5 px ink stroke (ember against ink is 5.90:1)                                                                        |
| **Map pins**               | Paper pill with ink border; selected pin is ember fill with ink text                                                                             |
| **Status**                 | See §2.3 and §8.4 badges. Always icon + text                                                                                                     |
| **Photo overlays**         | Only solid paper chips with ink text, or the functional scrim in §4.6                                                                            |

**Rule of one ember:** within any visible screen region (header, results pane, detail sidebar, modal) at most one element may use the ember fill as a _call to act_. The sun-line, saved hearts, and the selected map pin are state markers and do not count, but a view SHOULD NOT show more than three ember state markers at once.

### 2.5 Light and dark strategy

- **Default:** follow `prefers-color-scheme`; offer a manual **System / Light / Dark** control in account settings. Store the choice per user.
- **Dark mode ("Lamplight")** is a warm near-black (`#141413`), never `#000`. Surfaces step up in lightness (`#1e1e1c` → `#2a2a27`) instead of using shadows.
- **Ember stays ember** as a fill in both modes. In dark mode, accent _text_ shifts to Ember-400 `#e4a085`.
- **Photographs are never filtered, dimmed, or recolored** in either mode. Surrounding chrome adapts; the photo is the constant.
- **Maps** use a dedicated dark basemap built from the Night tokens (do not invert the light map).
- **Emphasis surfaces invert.** Wherever this document says "ink fill, paper text" for an emphasis surface (selected chips, selected segments, hovered pins, cluster markers, count badges, the "New" badge, tooltips, toasts), implement it with `--color-inverse-bg` and `--color-text-inverse`, so it becomes paper fill with ink text in dark mode. Selected chips keep their check icon in both modes.

### 2.6 Verified contrast (WCAG 2.2 AA: text ≥ 4.5:1, large text and UI components ≥ 3:1)

**Light**

| Foreground on background                                | Ratio                     | Status                                                |
| ------------------------------------------------------- | ------------------------- | ----------------------------------------------------- |
| Ink `#141413` on Paper `#faf9f5`                        | 17.50:1                   | Pass                                                  |
| Ink-700 `#3d3d3a` on Paper                              | 10.34:1                   | Pass                                                  |
| Ink-500 `#5e5d57` on Paper / White / Linen / Paper-100  | 6.27 / 6.61 / 5.28 / 5.73 | Pass                                                  |
| **Ink on Ember `#d97757`** (primary button)             | **5.90:1**                | Pass                                                  |
| Ink on Ember-400 `#e4a085` (button hover)               | 8.48:1                    | Pass                                                  |
| Ink on Ember-550 `#cf6c47` (button pressed)             | 5.17:1                    | Pass                                                  |
| Ember-700 `#9c4124` on Paper / White / Linen / Ember-50 | 6.24 / 6.57 / 5.25 / 5.71 | Pass                                                  |
| Sky-700 `#3a6a99` on Paper / Sky-50                     | 5.39 / 4.97               | Pass                                                  |
| Moss-700 `#56683c` on Paper / Moss-50 / White           | 5.79 / 5.37 / 6.10        | Pass                                                  |
| Amber-700 `#8a5a00` on Paper / Amber-50                 | 5.63 / 5.27               | Pass                                                  |
| Error-700 `#b3261e` on Paper / Error-50                 | 6.20 / 5.58               | Pass                                                  |
| Control border `#8a887f` on Paper / White               | 3.37 / 3.55               | Pass (non-text 3:1)                                   |
| Paper text on 72 % ink scrim over pure white            | 6.97:1                    | Pass (worst case)                                     |
| Raw Ember on Paper                                      | 2.96:1                    | **Fail as text or sole indicator**                    |
| Raw Sky / Stone on Paper                                | 2.78 / 2.11               | **Fail as text**                                      |
| Hairline linen `#e8e6dc` on Paper                       | 1.19:1                    | Decorative only; never the sole boundary of a control |

**Dark**

| Foreground on background                                  | Ratio              | Status              |
| --------------------------------------------------------- | ------------------ | ------------------- |
| Paper on Night `#141413` / Night-800 `#1e1e1c`            | 17.50 / 15.85      | Pass                |
| Linen (secondary text) on Night / Night-800               | 14.73 / 13.34      | Pass                |
| Stone (muted text) on Night / Night-800 / Night-700       | 8.29 / 7.51 / 6.47 | Pass                |
| Ember `#d97757` on Night / Night-800                      | 5.90 / 5.35        | Pass                |
| Ember-400 text on Night / Night-800 / dark tint `#3a2219` | 8.48 / 7.69 / 6.79 | Pass                |
| Sky-300 on Night / Night-800 / `#1b2835`                  | 8.51 / 7.71 / 6.92 | Pass                |
| Moss-300 on Night / Night-800 / `#232a1b`                 | 7.81 / 7.08 / 6.27 | Pass                |
| Amber-300 on Night / Night-800 / `#33270b`                | 9.20 / 8.33 / 7.30 | Pass                |
| Error-300 on Night / Night-800 / `#3a1e1b`                | 7.54 / 6.83 / 6.22 | Pass                |
| Control border `#7a786f` on Night / Night-800 / Night-700 | 4.16 / 3.77 / 3.25 | Pass (non-text 3:1) |

**Hierarchy rule:** ink is the only high-emphasis color. Everything else (secondary text, metadata, hairlines) steps down in strength. A viewer should be able to identify, in order: photograph → price → address → specs → actions, even with the screen desaturated.

---

## 3. Typography and visual hierarchy

### 3.1 Families

| Role                                                              | Family      | Fallback stack                                   | Weights                                                      |
| ----------------------------------------------------------------- | ----------- | ------------------------------------------------ | ------------------------------------------------------------ |
| **Structure** (headings, prices, labels, buttons, metadata, UI)   | **Poppins** | `"Poppins", "Helvetica Neue", Arial, sans-serif` | 400, 500, 600                                                |
| **Reading** (descriptions, neighborhood notes, editorial, quotes) | **Lora**    | `"Lora", Georgia, "Times New Roman", serif`      | 400, 400 italic, 600 (variable axis 400–700 where available) |

**Why two families:** Poppins's geometric, even-width forms keep numbers and labels crisp and scannable. Lora's calligraphic serif gives long descriptions a human, editorial voice. Poppins is not used for paragraphs longer than three lines; Lora is not used below 14 px or inside buttons, chips, or tables.

**Loading:** self-host WOFF2, subset to the languages you ship, `font-display: swap`, preload Poppins 500/600 and Lora 400, and define metric-adjusted fallbacks (`size-adjust`, `ascent-override`) to prevent layout shift.

### 3.2 Type scale

Fluid values use `clamp(min, preferred, max)` interpolated between a 375 px and a 1280 px viewport. Non-fluid tokens step at the 1024 px breakpoint.

| Token             | Family  | Compact → Expanded size                                | Weight | Line height | Letter spacing     | Use                                        |
| ----------------- | ------- | ------------------------------------------------------ | ------ | ----------- | ------------------ | ------------------------------------------ |
| `--text-display`  | Poppins | `clamp(2.25rem, 1.73rem + 2.21vw, 3.5rem)` (36 → 56)   | 600    | 1.1         | −0.02em            | Home headline only                         |
| `--text-h1`       | Poppins | `clamp(1.75rem, 1.44rem + 1.33vw, 2.5rem)` (28 → 40)   | 600    | 1.2         | −0.015em           | Page titles, property name on detail       |
| `--text-h2`       | Poppins | `clamp(1.375rem, 1.22rem + 0.66vw, 1.75rem)` (22 → 28) | 600    | 1.25        | −0.01em            | Section headings                           |
| `--text-h3`       | Poppins | 1.25rem (20)                                           | 600    | 1.4         | −0.005em           | Subsections, drawer titles                 |
| `--text-h4`       | Poppins | 1rem (16)                                              | 600    | 1.5         | 0                  | Card titles, list headings                 |
| `--text-price-xl` | Poppins | 2rem → 2.5rem (32 → 40)                                | 600    | 1.1         | −0.01em            | Detail page price                          |
| `--text-price-lg` | Poppins | 1.375rem (22)                                          | 600    | 1.25        | −0.005em           | Card price                                 |
| `--text-price-sm` | Poppins | 0.875rem (14)                                          | 600    | 1.2         | 0                  | Map pins, compact rows                     |
| `--text-body-lg`  | Lora    | 1.125rem (18)                                          | 400    | 1.65        | 0                  | Detail description                         |
| `--text-body`     | Lora    | 1rem (16)                                              | 400    | 1.6         | 0                  | Default prose                              |
| `--text-body-sm`  | Lora    | 0.875rem (14)                                          | 400    | 1.55        | 0                  | Secondary prose, agent notes               |
| `--text-ui`       | Poppins | 0.9375rem (15)                                         | 500    | 1.4         | 0                  | Buttons, inputs, tabs                      |
| `--text-ui-sm`    | Poppins | 0.875rem (14)                                          | 500    | 1.4         | 0                  | Chips, dropdown items                      |
| `--text-meta`     | Poppins | 0.875rem (14)                                          | 400    | 1.4         | 0                  | Location, "Updated 3 h ago"                |
| `--text-spec`     | Poppins | 1rem (16)                                              | 600    | 1.2         | 0                  | Spec values in title blocks                |
| `--text-label`    | Poppins | 0.75rem (12)                                           | 500    | 1.3         | +0.08em, uppercase | Spec labels, ref numbers, section eyebrows |
| `--text-caption`  | Poppins | 0.75rem (12)                                           | 400    | 1.4         | +0.01em            | Photo counts, footnotes                    |

**Minimums:** no text below 12 px. Body copy is never smaller than 16 px on compact screens unless it is explicitly secondary (`--text-body-sm`, 14 px). Reading measure for Lora: 60–75 characters (≈ 680 px at 18 px).

**Numbers:** apply `font-variant-numeric: tabular-nums` to prices, specs, and comparison tables where the font supports it, and verify column alignment during QA. If digits do not align, right-align numeric cells and fix the cell width.

### 3.3 Presentation rules

| Content                          | Rule                                                                                                                                                                                                                                                                                                                        |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Property name / address line** | Poppins 600 `--text-h4` on cards, `--text-h1` on detail. Truncate to 2 lines on cards with `line-clamp`; never truncate on detail. Street address first, unit second                                                                                                                                                        |
| **Price**                        | Poppins 600. Currency symbol at 0.75× size and weight 500, amount at full size. Locale-formatted with `Intl.NumberFormat`. Map pins abbreviate (`$1.2M`, `$850K`); cards and detail never abbreviate. Rent adds `/mo` in Poppins 400, ink-500. No price: show "Price on request" in Poppins 500, ink-700; never leave a gap |
| **Location**                     | Poppins 400 `--text-meta`, ink-500, format `Neighborhood, City`. Full street address on detail only if the listing allows it                                                                                                                                                                                                |
| **Specifications**               | Value (`--text-spec`) above label (`--text-label`) in a ruled cell: `3` over `BEDS`. Order is always beds, baths, area, then one extra fact (parking, floor, or lot)                                                                                                                                                        |
| **Description**                  | Lora 400 `--text-body-lg` on detail. Show 6 lines, then "Read more" (text button). Agent-written text is attributed: "Description by {Agent name}"                                                                                                                                                                          |
| **Eyebrow / reference**          | `--text-label`, ink-500, e.g. `Nº 0427 · APARTMENT`                                                                                                                                                                                                                                                                         |
| **Buttons**                      | `--text-ui`, sentence case, no icons in the label unless they add meaning (e.g., a heart in Save)                                                                                                                                                                                                                           |
| **Dates and freshness**          | `--text-meta`: "Updated 3 hours ago", with the exact timestamp in a tooltip and in the accessible name                                                                                                                                                                                                                      |

### 3.4 Hierarchy on a card (top to bottom)

1. Photograph (≥ 60 % of card height)
2. Price (22 px, 600)
3. Property name / address (16 px, 600)
4. Location (14 px, muted)
5. Title-block specs (16 px values, 12 px labels)
6. Reference and freshness (12 px labels)

---

## 4. Design language and UI style

### 4.1 Layout philosophy and whitespace

**"Generous margins, tight data."** Section spacing is large (64–96 px on expanded screens, 40–56 px on compact) so photographs breathe; information inside title blocks is compact and aligned to hairlines so it scans fast. Structure is created by **rules (1 px hairlines) and whitespace**, not by cards-inside-cards, boxes, or shadows.

- Left-align text. Center only the home headline on compact screens and empty-state illustrations.
- Align prices, specs, and metadata on a shared left edge within a card and across a grid row.
- Do not put more than two type sizes of Poppins inside a single text block.

### 4.2 Grid and spacing

**Base unit: 4 px.**

| Token        | Value | Typical use                                                 |
| ------------ | ----- | ----------------------------------------------------------- |
| `--space-0`  | 0     |                                                             |
| `--space-1`  | 4 px  | Icon-to-text gap                                            |
| `--space-2`  | 8 px  | Between chips, tight stacks                                 |
| `--space-3`  | 12 px | Card inner padding (compact)                                |
| `--space-4`  | 16 px | Card inner padding (medium/expanded), page margin (compact) |
| `--space-5`  | 20 px |                                                             |
| `--space-6`  | 24 px | Grid gutter (expanded), spacing between card groups         |
| `--space-8`  | 32 px | Between subsections, page margin (medium)                   |
| `--space-10` | 40 px | Section spacing (compact)                                   |
| `--space-12` | 48 px | Page margin (expanded)                                      |
| `--space-16` | 64 px | Section spacing (medium/expanded)                           |
| `--space-20` | 80 px |                                                             |
| `--space-24` | 96 px | Hero and home section spacing (expanded)                    |

**Grid**

| Class    | Viewport  | Columns | Gutter | Page margin | Max content width |
| -------- | --------- | ------- | ------ | ----------- | ----------------- |
| Compact  | < 600     | 4       | 16     | 16          | fluid             |
| Medium   | 600–1023  | 8       | 16     | 32          | fluid             |
| Expanded | 1024–1439 | 12      | 24     | 48          | fluid             |
| Wide     | ≥ 1440    | 12      | 24     | auto        | 1360              |

Reading columns (descriptions, guides) cap at 720 px.

### 4.3 Radii, borders, shadows, elevation

**Almost-square corners** echo printed photographs and drawing sheets; large pill radii are avoided because they are the dominant look of the category.

| Token            | Value                    | Use                                         |
| ---------------- | ------------------------ | ------------------------------------------- |
| `--radius-none`  | 0                        | Full-bleed photos, table cells              |
| `--radius-xs`    | 2 px                     | Photos, chips, badges, map pins, buttons    |
| `--radius-sm`    | 4 px                     | Cards, inputs, dropdown menus, toasts       |
| `--radius-md`    | 8 px                     | Modals, popovers, tooltips                  |
| `--radius-sheet` | 12 px (top corners only) | Mobile bottom sheets                        |
| `--radius-full`  | 9999 px                  | Avatars, count badges, cluster markers only |

**Borders:** hairline = 1 px `--color-border-hairline` (decorative structure). Control = 1.5 px `--color-border-control` (inputs, idle chips, checkboxes). Strong = 1.5 px `--color-border-strong` (secondary buttons, selected cards).

**Elevation** is mostly flat. Level changes are shown with rules and surface color. Shadows are reserved for elements that float above content.

| Level | Token        | Value                              | Use                               |
| ----- | ------------ | ---------------------------------- | --------------------------------- |
| 0     | none         |                                    | Page, cards, inline panels        |
| 1     | `--shadow-1` | `0 1px 0 rgb(20 20 19 / 0.06)`     | Sticky header edge, compare tray  |
| 2     | `--shadow-2` | `0 2px 8px rgb(20 20 19 / 0.10)`   | Dropdowns, popovers, map controls |
| 3     | `--shadow-3` | `0 12px 32px rgb(20 20 19 / 0.18)` | Modals, drawers, bottom sheets    |

In dark mode, elevation is expressed by surface lightness (Night-800 → Night-700) and a 1 px hairline; shadows remain at the same values but are not relied on.

### 4.4 Iconography and illustration

- **Icons:** 24 px grid, **1.5 px monoline stroke**, butt caps, mitered joins, drawn in `currentColor`. Sizes 16, 20, 24, 32. Filled variants are used only for _state_ (saved heart, selected pin).
- **Source:** a 1.5 px-stroke open-source set (Lucide with `strokeWidth=1.5`, or equivalent) for general icons. Custom drawn for brand-specific glyphs: daylight dial, floor plan, survey mark, compare, 360° tour.
- **Every icon that carries meaning has a text label or an accessible name.** Decorative icons are `aria-hidden="true"`.
- **Illustrations (empty states, onboarding):** architectural elevations and plans in 1.5 px ink monoline on paper; **one ember element** (a sun-point, a lit window) per illustration; no people, no gradients, no fills beyond Ember-50 for a window or door. Maximum 160 px tall on compact, 240 px on expanded.

### 4.5 Controls: look and shape

| Control                            | Shape                                                                                | Notes                                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| **Button**                         | 2 px radius, 48 px tall (44 px compact-dense), 20 px horizontal padding              | Primary = ember fill + ink text. Secondary = 1.5 px ink outline. Tertiary = underlined text |
| **Input / search**                 | 4 px radius, white, 1.5 px control border, 52 px tall (48 px dense)                  | Visible label above or inside as a floating label; never placeholder-only                   |
| **Dropdown / select**              | Same as input; menu uses `--shadow-2`, 4 px radius, 44 px rows                       |                                                                                             |
| **Chip**                           | 2 px radius, 40 px tall (44 px hit area), 12 px horizontal padding                   | Rectangular "tag", not a pill                                                               |
| **Tabs**                           | Text only, `--text-ui`, 2 px underline (ember) on the active tab plus weight 600     | Underline sits on a 1 px hairline baseline                                                  |
| **Segmented control** (Buy / Rent) | 2 px radius container, selected segment = ink fill + paper text                      |                                                                                             |
| **Checkbox / radio**               | 24 px, 1.5 px control border, ink fill + paper check when selected                   |                                                                                             |
| **Switch**                         | 48 × 28 px, 2 px radius track, selected = ink track; **plus** an "On/Off" text label |                                                                                             |

### 4.6 Image treatments, overlays, gradients, decoration

- **Photographs are shown unfiltered.** No tints, duotones, blur, or desaturation (except the "no longer available" state in §5.12, which is always paired with a text label).
- **Corners:** 2 px. No borders on photos; the sun-line sits on the photo's bottom edge (§9.1).
- **Overlays on photos** are solid paper chips (`--color-surface`, ink text, 2 px radius) for badges, counts, and buttons.
- **The only gradient allowed** is a _functional legibility scrim_ where text sits on a photograph (hero caption, map-card overlay): `linear-gradient(to top, rgb(20 20 19 / 0.72), rgb(20 20 19 / 0) 60%)`. Paper text on this scrim is 6.97:1 even over pure white.
- **Placeholders:** `--color-bg-sunk` background with a centered 32 px house-outline icon while loading or on error. No blurhash colors that shift the palette.
- **Decorative elements:** only hairlines, the sun-line, title-block rules, survey-mark ticks, and the ember sun-point in the wordmark and illustrations. No confetti, blobs, patterned backgrounds, or stock illustration.

### 4.7 Approaches to use, and to avoid

| Approach                                                               | Decision  | Why                                                                                                 |
| ---------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------- |
| **Editorial layout** (large photography, Lora reading text)            | **Use**   | Property decisions are emotional; photography and narrative carry that                              |
| **Architectural drawing cues** (hairlines, title blocks, survey ticks) | **Use**   | Reinforces precision and trust; makes numbers scannable                                             |
| **Single-accent restraint**                                            | **Use**   | A rare accent is recognizable and keeps the primary action obvious                                  |
| **Flat surfaces with hairlines**                                       | **Use**   | Cheaper to render and easier to keep accessible than layered shadows                                |
| **Glassmorphism / backdrop blur**                                      | **Avoid** | Blur over photographs makes text contrast unpredictable and costs GPU on mid-range phones           |
| **Neumorphism**                                                        | **Avoid** | Soft low-contrast edges fail the 3:1 non-text contrast requirement and hide interactive affordances |
| **Neo-brutalist hard offset shadows, thick borders**                   | **Avoid** | Loud and playful; conflicts with the calm, refined tone                                             |
| **Decorative gradients**                                               | **Avoid** | Only the functional scrim is permitted                                                              |
| **Pill-shaped everything**                                             | **Avoid** | Reads as generic; it is the category default                                                        |
| **Red/green price coloring, "hot deal" banners**                       | **Avoid** | Pressure tactics undermine trust                                                                    |
| **Auto-playing carousels, parallax, scroll-jacking**                   | **Avoid** | Slows discovery and harms accessibility                                                             |
| **Hover zoom on photos**                                               | **Avoid** | Crops information and shifts the composition                                                        |
| **Motion for feedback and orientation**                                | **Use**   | See §7                                                                                              |
| **Dark mode**                                                          | **Use**   | Evening browsing is common; implemented as Lamplight with the same hierarchy                        |

### 4.8 Balancing uniqueness and usability

Distinctiveness lives in a _small set of repeatable moves_ (§9): the sun-line, the title block, the daylight dial, survey pins, and the contact-sheet gallery. Everything else is a conventional pattern executed carefully (standard search, familiar filters, recognizable map controls). **Never reinvent a control's behavior for the sake of identity.** Style it; keep its interaction standard.

---

## 5. Property discovery and browsing experience

### 5.1 Home and discovery screen

**Composition (expanded):** a two-part editorial opening, not a centered hero over a stock image.

- **Left (cols 1–6):** eyebrow (`--text-label`), display headline (Poppins 600, ≤ 8 words, sentence case, e.g. "Find a home with good light"), one line of Lora supporting text, then the **search ledger** (§5.2). Below it: 3 recent searches or "Continue where you left off" if the user has history.
- **Right (cols 8–12):** one large portrait photograph (4:5) of a listing ("Today's folio"), with a title-block caption beneath (ref, type, location, price) that links to the property. It changes at most daily, never auto-rotates, and shows a "See all new homes" text link.
- **Compact:** the search ledger comes first, then a 4:3 version of the photograph.

**Below the opening (in this order, each optional when empty):** Continue browsing (recently viewed), New this week (card row), Browse by type (index tabs), Neighborhood guides (editorial cards with Lora excerpts), Saved searches with new matches. Limit to **five sections**. Each section has an `h2`, a "See all" text link, and 64–96 px spacing above it.

**Browse by type:** an "index" row of text tabs with 24 px line icons: Apartments, Houses, Townhomes, Land, Commercial. Selecting one goes to results with that filter applied.

### 5.2 Search bar and location-based discovery

**The search ledger** is a single ruled form, not a floating pill.

- Row 1: segmented control **Buy | Rent**.
- Row 2: **Where?** combobox (required), then **Price** and **Beds** as optional selects, then the **Search** primary button (ember). On compact, price and beds collapse into a "Filters" button; Where? and Search remain visible.
- Field height 56 px (expanded), 52 px (compact). Labels are always visible.

**Location combobox (ARIA 1.2 pattern):** `role="combobox"`, `aria-expanded`, `aria-controls` the listbox, `aria-activedescendant` for the highlighted option; options announced with their group.

Suggestion groups, in order: _Near me_ (only after a tap on "Use my location"; explain why before the permission prompt), _Recent_, _Areas_, _Addresses_, _Listing refs (Nº)_. Show match highlighting in `font-weight: 600`, not color. Multiple areas become removable chips beneath the field.

**Rules:** do not request device location on load. If permission is denied, show the manual field with a one-line explanation. Allow Enter to submit the highlighted option, and Escape to close the list.

### 5.3 Property listing cards and image galleries

Card anatomy (the **Folio card**):

```
┌──────────────────────────────────────────┐
│ [New]                              [♥]   │  Photo, 4:3
│                                          │  TL: status badge (max 1)
│ [1 / 12]                  [▶ Tour][Plan] │  TR: Save (44 px target)
│▔▔▔▔ ember sun-line (24 px stub) ▔▔▔▔▔▔▔▔│  BL: photo count chip
│ Nº 0427 · APARTMENT                      │  BR: tour / plan chips
│ $1,250,000                               │  Label
│ Willow Court, Unit 4B                    │  Price (22/600)
│ Old Quarter, Harbourside                 │  Name (16/600)
│──────────────────────────────────────────│  Location (14/400 muted)
│  3     │  2     │  128   │  ◐ S           │  Title block (hairlines)
│ BEDS   │ BATHS  │  M²    │ FACING         │
│──────────────────────────────────────────│
│ Updated 3 h ago          ☐ Compare       │  Footer, 12 px / 44 px target
└──────────────────────────────────────────┘
```

- **Card surface:** white, 1 px hairline, 4 px radius. Padding 12 px (compact) / 16 px (medium) / 16 px (expanded).
- **Whole card is one link** (the name is the link text; a stretched `::after` makes the card clickable). Save, gallery arrows, and Compare sit above it with their own focus targets. Never nest interactive elements inside the anchor.
- **Photo carousel in cards:** swipe on touch; arrow buttons on hover and focus for pointer devices (44 px targets, paper chips). No autoplay. Limit to 5 photos in the card, then "See all {n} photos" on detail. The photo count chip announces "Photo 1 of 12".
- **Price never overlays the photo** (exception: map pins).
- **The daylight dial** cell appears only when orientation data exists. If absent, the title block shows 3 cells and the fourth is omitted, not empty.
- **Card gallery behavior:** first photo is the agent's cover. If the cover is a floor plan or a low-resolution image (< 800 px wide), the next photo is used.

### 5.4 Prices, location, amenities, specifications

- **Title block** is the standard way to show specs everywhere (cards, detail header, compare, saved): a row of hairline-separated cells, `value` above `label`.
- **Key facts grid** on detail: two columns of `label — value` rows with hairlines: property type, year built, floor, parking, heating, energy rating, tenure, service charge. Show only facts that exist; do not display "N/A" rows.
- **Amenities:** grouped (Interior, Building, Outdoor, Transport) with 20 px line icons and text labels. Show 8, then "Show all {n} amenities" opens a drawer. Text label is always present.
- **Price history (detail):** a compact table (date, event, price), most recent first. Reductions use the moss "Price reduced" badge with a down-arrow icon.
- **Estimates** (mortgage, yield): a bordered panel labeled **Estimate**, with an editable assumptions row and a text link "How we calculate this".

### 5.5 Search filters, sorting, categories

**Quick-filter row** (sticky under the search on results): Buy/Rent segmented · Price · Beds · Property type · **All filters** (shows a count badge when filters are active). Chips open a **popover** (expanded) or a **bottom sheet** (compact) for that one filter.

**All-filters panel:** right drawer 480 px on expanded and medium; full-screen sheet on compact. Sections (each an `h3` with a hairline above): Price, Beds & baths, Property type, Area, Features, Availability, Listing age. A **sticky footer** has "Clear all" (text button) and the primary button **"Show 1,284 homes"** whose count updates live (debounced 300 ms) and announces politely.

- **Price range:** a dual-thumb slider **and** two numeric inputs that stay in sync. The inputs are the keyboard-friendly alternative to dragging. An optional distribution histogram uses linen bars with the selected range in ink; no gradient.
- **Beds:** a row of 44 px segment buttons: Any, 1, 2, 3, 4, 5+. **Property type:** multi-select chips.
- **Active filters** appear as removable chips above the results ("2+ beds ×"), each with an accessible name "Remove filter: 2+ beds".
- **Sort:** a dropdown labeled "Sort", options: Recommended, Newest, Price: low to high, Price: high to low, Largest. "Recommended" has a help tooltip describing what it considers. Changing sort keeps scroll at the top of the results and does not reset filters.
- **Result count:** "1,284 homes in {Area}" is an `h1` or live-region sibling and updates politely (`aria-live="polite"`).

### 5.6 Map and list integration

| Viewport            | Default                                                                                | Behavior                                                                                                                           |
| ------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Expanded / Wide** | **Split:** list 5/12, map 7/12, both scroll independently                              | Layout toggle: List · Split · Map. Hovering a card highlights its pin; hovering a pin highlights its card and scrolls it into view |
| **Medium**          | List (2 columns) with a "Map" toggle                                                   | Map opens full-width; selected pin shows a card at the bottom                                                                      |
| **Compact**         | List with a floating **Map** button (ink pill, 48 px, bottom center above the tab bar) | Map is full-screen with a bottom sheet holding a horizontal snap-scroll card strip; sheet snap points: 120 px peek, 50 %, 90 %     |

- **Search this area:** after the user pans or zooms, a "Search this area" button appears at the top center of the map. Results never change on pan without this explicit action unless the user turns on "Update as I move the map".
- **Map controls:** zoom in / zoom out buttons (44 px), "Locate me", layer toggle (Map / Satellite). All keyboard accessible; arrow keys pan, `+`/`−` zoom. **Every map task has a list alternative:** the list reflects exactly what the map shows.
- **Approximate location:** when an exact address is withheld, draw a 300 m circle (1.5 px dashed ink stroke, Ember-50 fill at 60 % opacity, no gradient) with the label "Approximate location".
- **Basemap:** desaturated warm tones. Water Sky-50, parks Moss-50, roads white with linen casing, labels Ink-700. Dark basemap uses Night tokens.
- **Pins:** see §8.8.

### 5.7 Property detail page

**Structure (expanded):**

1. **Back to results** (preserves filters and scroll position) and breadcrumb.
2. **Contact-sheet gallery** (see §5.8), max height 560 px.
3. **Two-column body.** Main column (cols 1–8): title block header → section anchors → description → key facts → amenities → floor plans → location → price history → similar homes. Sticky aside (cols 9–12): the **enquiry card**.
4. **Header block:** reference and type label, `h1` name/address, location, price (`--text-price-xl`), the title-block specs row, then "Updated {time}" and listing agency.
5. **Section anchors:** a sticky text-link nav (Overview · Details · Plans · Location) with `aria-current="location"` on the active link and the ember underline. These are links, not ARIA tabs.
6. **Enquiry card (sticky, 24 px from top):** price, **Book a visit** (primary, ember), **Message agent** (secondary), Save, Compare, Share (secondary icon buttons with labels). Agent block below: photo (48 px circle), name, agency, and licence or registration number where the market requires it.

**Compact and medium:** single column. The gallery is full-bleed. A **sticky action bar** (56 px + safe-area inset) shows the price on the left and **Book a visit** on the right, with a "Message" icon button. The enquiry card content moves to the bottom of the page.

### 5.8 Gallery, carousel, floor plans, virtual-tour entry

**Contact-sheet gallery (expanded):** one large photo (8 cols, 3:2) plus a 2 × 2 grid (4 cols). The bottom-left chip reads `1 / 24` in `--text-caption` (film-frame numbering). Buttons on the grid: **All photos (24)**, and distinct tiles for **Floor plan** and **360° tour** when present. Each tile has a text label inside a paper chip.

**Compact:** a swipeable 4:3 carousel with a `1 / 24` counter and a **"Photos · Plans · Tour"** segmented control below it. No dots (they do not scale); the counter is the indicator.

**Lightbox (All photos):** full-screen on ink at 96 %. Photo is shown with `object-fit: contain`, never cropped. Controls: Close, Previous, Next, counter, and an optional caption (Lora italic, `--text-body-sm`) beneath. Keyboard: `←` `→` navigate, `Esc` closes, focus is trapped and returns to the trigger. A thumbnail strip appears on expanded screens.

**Floor plans:** shown as a tab inside the gallery and as a section in the body. Plans are rendered as high-contrast line drawings on paper; the viewer has **+ / − / Reset** buttons (not pinch-only), pan by drag or arrow keys, a room-labels toggle, and a "Download PDF" link. Provide a text alternative listing rooms and dimensions.

**Virtual tour entry:** a labeled tile "360° tour" with a play-style icon. It is **never autoplay**. The first interaction opens the tour in a full-screen viewer with a visible Close button. Provide an equivalent set of still photos in the gallery. If a tour fails to load, show "Tour unavailable right now" with a link to the photos.

### 5.9 Favorites, saved properties, comparison

**Save**

- The heart button (44 px target, 36 px visual circle, paper chip) toggles `aria-pressed`. Saved = ember-filled heart with an ink stroke.
- On first save, ask nothing; save to **Shortlist** by default and show a toast: "Saved to Shortlist · Change list · Undo".
- **Saved screen:** list/grid toggle; Lists (user-named); sort by Date saved, Price, Status; per-card note field ("Add a note"); price-change and availability indicators. Unavailable listings stay in place with the "No longer available" treatment (§5.12) so the user keeps their notes.
- Saved properties sync across devices when signed in. Signed-out users can save locally with a gentle, dismissible prompt to create an account (once per session, never blocking).

**Compare**

- Each card and detail page has a **Compare** checkbox (label visible). Maximum **4** properties; the fifth attempt shows a toast: "You can compare up to 4 homes. Remove one to add another."
- **Compare tray:** once ≥ 1 home is selected, a 72 px tray docks at the bottom (above the tab bar on compact), showing 4 slots with 48 px thumbnails (empty slots are hairline rectangles), a "Clear" text button, and the primary button **"Compare ({n})"** (enabled at ≥ 2).
- **Compare screen:** columns per property, header row with photo (4:3), price, name, remove button. Rows are grouped (Price, Size, Rooms, Building, Location, Energy). A sticky first column holds the row labels. A **"Show differences only"** switch collapses identical rows.
- Rows that differ get an Ember-50 background **and** a "≠" glyph in the row label; no row is declared a "winner", and no color is used to say which value is "better".
- **Compact:** two properties fit side by side with a sticky label column above each value (stacked label/value); additional properties scroll horizontally with scroll-snap and a visible "Showing 1–2 of 4" indicator.

### 5.10 Contact agent, schedule a visit, inquiry actions

- **Primary: "Book a visit"** opens a modal (expanded) or a full-screen sheet (compact): Step 1 choose a date (a 7-day strip of buttons with weekday and date, plus "More dates"), Step 2 choose a time slot (chip group; unavailable slots are disabled **and** labeled "Unavailable"), Step 3 contact details, then a summary and **Confirm visit**.
- **Secondary: "Message agent"** opens a form with a prefilled, editable message: "Hello, I'm interested in Nº 0427, Willow Court Unit 4B. Is it still available?" Fields: name, email or phone (one is required), message.
- **Rules:** remember details the user already provided (WCAG 3.3.7 Redundant Entry); label every field; use inline validation after blur with text errors; never block with a puzzle CAPTCHA (WCAG 3.3.8) and prefer invisible risk checks or email confirmation.
- **Confirmation:** a calm confirmation panel with the visit summary, "Add to calendar", and "Message agent". Toast and live-region announcement: "Visit requested for Sat 14 Nov, 10:30."
- **Failure:** preserve all entered data, show the error summary at the top of the form with links to each field, and offer "Try again" and "Copy my message".

### 5.11 Loading skeletons

- Skeletons are **structural replicas** of the content: card skeleton = 4:3 photo block, one 22 px price bar (40 % width), a 16 px name bar (70 %), a 14 px location bar (50 %), a four-cell title block. This prevents layout shift.
- Colors: `--color-skeleton` (linen in light, Night-700 in dark). Animation is a gentle opacity pulse (0.6 → 1, 1.4 s, ease-in-out); under `prefers-reduced-motion` it is static.
- **Delay 200 ms** before showing a skeleton; if data arrives sooner, show nothing. Never show a spinner over content that is already visible.
- Loading regions have `aria-busy="true"` and a visually hidden "Loading homes" status.
- Progressive image loading: the card text appears first; each photo fades in over 120 ms when it decodes (opacity only).

### 5.12 Empty states, errors, unavailable properties

| Situation                           | Treatment                                                                                                                                                                                                     | Copy pattern                                                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **No results**                      | Illustration (empty door frame), `h2`, 1–2 suggestions with live counts, primary action                                                                                                                       | "No homes match these filters yet." · "Widen price to $1.5M (+38 homes)" · [Clear filters] [Save this search] |
| **No saved homes**                  | Illustration, short explanation, primary "Explore homes"                                                                                                                                                      | "Nothing saved yet. Tap the heart on any home to keep it here."                                               |
| **Compare empty**                   | Three empty slots, instruction                                                                                                                                                                                | "Choose 2–4 homes to compare. Use the Compare checkbox on any home."                                          |
| **Network error (list)**            | Keep previously loaded results; inline error banner above the grid                                                                                                                                            | "We couldn't load homes. Check your connection and try again." [Try again]                                    |
| **Map failed**                      | Switch to list automatically; banner                                                                                                                                                                          | "The map isn't available right now. Your results are listed below."                                           |
| **Property not found / removed**    | Full-page message with search and similar homes                                                                                                                                                               | "This listing is no longer available." [See similar homes]                                                    |
| **Unavailable property (in lists)** | Photo desaturated 100 %, sun-line replaced by a 2 px stone rule, **"No longer available"** label in a stone chip (paper text on `#5e5d57`, 6.27:1), price shown struck-through with a text label "Last price" | CTA replaced by [Find similar homes]                                                                          |
| **Under offer**                     | Amber badge with clock icon, text "Under offer"; Book a visit becomes secondary "Join waiting list" if supported, otherwise hidden                                                                            |                                                                                                               |
| **Form error**                      | Error summary + inline messages; icon + text                                                                                                                                                                  | "Enter an email address or phone number so the agent can reply."                                              |

Errors are blame-free, say what happened and what to do next, and are never shown as a toast alone.

---

## 6. Layouts and responsive behavior

### 6.1 Breakpoints

| Name         | Range     | Intent                                | Grid             | Primary navigation           |
| ------------ | --------- | ------------------------------------- | ---------------- | ---------------------------- |
| **Compact**  | 0–599     | One-handed phone                      | 4 col            | Bottom tab bar (5 items)     |
| **Medium**   | 600–1023  | Tablet, large foldable, small windows | 8 col            | Top bar with icons + labels  |
| **Expanded** | 1024–1439 | Laptop, desktop                       | 12 col           | Top bar with full text links |
| **Wide**     | ≥ 1440    | Large desktop                         | 12 col, max 1360 | Same as expanded             |

Use `min-width` media queries (`--bp-medium: 600px`, `--bp-expanded: 1024px`, `--bp-wide: 1440px`). Also design for **320 px** reflow (WCAG 1.4.10): no horizontal scrolling except in compare tables, maps, and floor-plan viewers, which have their own scroll containers.

### 6.2 Navigation patterns

| Viewport            | Pattern                                                                                                                                                                                                              |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Compact**         | **Bottom tab bar**, 56 px + safe-area inset: Explore · Map · Saved · Compare (count badge) · Account. Top: a slim search trigger bar on Explore; a back arrow + title on detail. The tab bar does not hide on scroll |
| **Medium**          | Top bar 64 px: wordmark, search trigger, **Saved** and **Compare** as icon + label, account menu                                                                                                                     |
| **Expanded / Wide** | Top bar 72 px: wordmark (left), text links **Buy · Rent · Saved · Compare**, account menu (right). A condensed 56 px sticky version appears after scrolling past the header, keeping the search trigger              |

The active destination has `aria-current="page"` and the ember underline plus bold ink text. The bar is a `<nav aria-label="Primary">`. Provide a "Skip to results" link as the first focusable element.

### 6.3 Property card adaptations

| Viewport | Columns (list only) | In split view                            | Card layout                                         |
| -------- | ------------------- | ---------------------------------------- | --------------------------------------------------- |
| Compact  | 1                   | n/a (map is a separate screen)           | Full-width, photo 4:3 swipe carousel, 12 px padding |
| Medium   | 2                   | n/a                                      | Photo 4:3, 16 px padding                            |
| Expanded | 3                   | 1 column (list pane 5/12) or 2 at ≥ 1280 | Photo 4:3 with hover arrows                         |
| Wide     | 4                   | 2 columns                                | Same as expanded                                    |

Use `grid-template-columns: repeat(auto-fill, minmax(288px, 1fr))` for list-only layouts. Gap = gutter. **Compact variants:** a **horizontal compact card** (photo 112 × 112 left, text right, title block collapsed into one line "3 bd · 2 ba · 128 m²") is used in the map bottom sheet, the compare tray, and "Similar homes".

### 6.4 Filter panel and mobile search

- **Compact:** tapping the search trigger opens a full-screen search sheet: Where? combobox with suggestions, the Buy/Rent segmented control, and a "Filters" row. Quick-filter chips scroll horizontally (no edge-fade gradient; the last chip is partly visible to hint at scrolling). The filter sheet's footer is sticky above the safe-area inset.
- **Medium and Expanded:** filter chips open anchored popovers; **All filters** opens the 480 px right drawer.
- Applying filters never causes a full page reload; the list updates in place and focus stays on the control that was used.

### 6.5 Touch targets, accessibility, responsive images

- **Targets:** minimum **44 × 44 CSS px** for every interactive element on touch (this exceeds the WCAG 2.2 AA minimum of 24 × 24, criterion 2.5.8). Adjacent targets are separated by ≥ 8 px. Visual size may be smaller than the hit area (e.g., 36 px heart in a 44 px target).
- **Safe areas:** use `env(safe-area-inset-*)` for the tab bar, sticky action bar, and bottom sheets.
- **Text zoom:** layouts MUST work at 200 % text size and 400 % zoom (1.4.4, 1.4.10).
- **Responsive images:** see §10.6.

### 6.6 "Designed, not scaled" checklist

| Screen  | Compact                                   | Medium                           | Expanded                                   |
| ------- | ----------------------------------------- | -------------------------------- | ------------------------------------------ |
| Home    | Search first, photo second, single column | Two-column intro, 2-up card rows | Split editorial opening, 3–4-up card rows  |
| Results | List + Map button, filters in sheets      | 2-up grid, popovers              | Split list/map, filter popovers + drawer   |
| Detail  | Swipe gallery, sticky action bar          | Single column, sticky action bar | Contact-sheet gallery, sticky enquiry card |
| Compare | 2 visible, horizontal scroll              | 3 visible                        | 4 visible, sticky label column             |
| Saved   | 1-up cards                                | 2-up                             | 3-up with Lists sidebar                    |

---

## 7. Motion and interaction design

### 7.1 Principles

1. **Motion explains, it does not decorate.** Use it to show cause and effect (a card saved, a panel opening, a pin selected).
2. **Fast by default.** Most transitions are 120–200 ms. Nothing in the discovery path exceeds 360 ms.
3. **Animate only `transform` and `opacity`** (and `clip-path` for the sun-line). Never animate layout properties such as `height`, `top`, or `width` on large elements.
4. **No autoplay, no looping, no parallax.** The only repeating animation is the skeleton pulse, and it stops under reduced motion.
5. **Never block input.** Interactions are interruptible and the interface is usable while an animation runs.

### 7.2 Tokens

| Token              | Value                        | Use                                               |
| ------------------ | ---------------------------- | ------------------------------------------------- |
| `--motion-instant` | 80 ms                        | Pressed states, checkbox ticks                    |
| `--motion-fast`    | 120 ms                       | Hover, focus, chip selection, image fade-in       |
| `--motion-base`    | 200 ms                       | Sun-line, popovers, toasts, tab underline         |
| `--motion-slow`    | 320 ms                       | Drawers, modals, bottom sheets                    |
| `--ease-standard`  | `cubic-bezier(0.2, 0, 0, 1)` | Entering and moving elements                      |
| `--ease-exit`      | `cubic-bezier(0.4, 0, 1, 1)` | Leaving elements (use 75 % of the enter duration) |

### 7.3 Interaction states (applies to all controls)

| State                                                     | Visual                                                                                                                  | Notes                                                                                                                                                                                                 |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Default**                                               | Spec'd in §8                                                                                                            |                                                                                                                                                                                                       |
| **Hover** (pointer only; wrap in `@media (hover: hover)`) | Primary: ember → Ember-400. Secondary: fill ink, text paper. Chip: border → ink. Card: sun-line extends                 | Hover never reveals information that is not reachable otherwise                                                                                                                                       |
| **Focus-visible**                                         | 2 px `--color-focus` ring with a 2 px paper gap (`box-shadow: 0 0 0 2px var(--color-bg), 0 0 0 4px var(--color-focus)`) | Sky-700 is 5.39:1 against paper; Sky-300 is 8.51:1 on dark. The paper gap guarantees visibility over photographs. Never remove the outline without replacing it                                       |
| **Pressed / active**                                      | Primary: Ember-550. Others: translate-Y 1 px, 80 ms                                                                     |                                                                                                                                                                                                       |
| **Selected**                                              | Chips: ink fill + paper text + check. Tabs: ember underline + weight 600. Cards: 1.5 px ink border + full sun-line      | Never selection by color alone                                                                                                                                                                        |
| **Disabled**                                              | Fill `--color-disabled-bg`, text `--color-disabled-text`, `cursor: not-allowed`, `aria-disabled="true"`                 | Disabled controls are exempt from contrast rules but MUST be explained (tooltip or helper text) when the reason is not obvious. Prefer `aria-disabled` so the control stays focusable and explainable |
| **Loading**                                               | Button label replaced by a 16 px ring spinner and the text "Saving…" (live region); width held constant                 |                                                                                                                                                                                                       |
| **Error**                                                 | 1.5 px error-700 border, icon, text message below                                                                       |                                                                                                                                                                                                       |

### 7.4 Transitions by feature

| Feature           | Behavior                                                                                                                                                                                                                           |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Filters**       | Popover: opacity 0→1 + translate-Y 4→0 px, `--motion-base`. Drawer: translate-X 100%→0, `--motion-slow`. Result grid: previous results fade to 0.6 opacity while loading (no layout change), new results swap in without animation |
| **Image gallery** | Next/previous crossfade, 120 ms (opacity). Swipe follows the finger 1:1, then settles in `--motion-base`. Lightbox opens with an opacity fade (`--motion-base`)                                                                    |
| **Save / unsave** | Heart fill changes in `--motion-fast`; a single 1.12→1 scale "settle" (160 ms) when saving. Toast slides up 8 px and fades in. Undo restores instantly                                                                             |
| **Map**           | Pin hover: translate-Y −4 px, `--motion-fast`. Selected pin: fill changes to ember, z-index rises. Map camera easing ≤ 350 ms to a selected pin; no animation when the user has reduced motion                                     |
| **Navigation**    | Route changes: content fades 0→1 in `--motion-fast`. Tab underline slides in `--motion-base`. No page-slide transitions                                                                                                            |
| **Compare tray**  | Rises from the bottom, `--motion-base`; thumbnails fade in as added                                                                                                                                                                |
| **Bottom sheet**  | Snap-to-position springs are disallowed; use `--motion-slow` with `--ease-standard`                                                                                                                                                |

### 7.5 Micro-interactions

- **Sun-line:** the 2 px ember line under the card photo is a 24 px stub by default and extends to full width on card hover or focus (`clip-path`, `--motion-base`). When the card is selected it stays full.
- **Price pin settle:** when a card is hovered, its pin raises 4 px and a 1.5 px ink ring appears; no pulsing.
- **Count updates:** the "Show 1,284 homes" button number cross-fades (opacity, `--motion-fast`) and is announced politely once per settled value.
- **Copy/Share:** the label changes to "Link copied" for 2 s, announced via `role="status"`.

### 7.6 Reduced-motion and accessibility

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
  .df-skeleton {
    animation: none;
    opacity: 1;
  }
}
```

- Under reduced motion: no translate or scale transitions; popovers and sheets appear instantly; the map jumps rather than flies; the sun-line is simply full-width on hover.
- Provide an in-app "Reduce motion" setting that sets `data-motion="reduced"` for users whose OS setting is not available.
- No content flashes more than 3 times per second. No motion is required to understand or operate anything.

---

## 8. Component design system

> **Shared rules.** Every interactive component supports the states in §7.3, has a visible focus ring, a minimum 44 px touch target, and uses only tokens from §11. All text uses the type tokens in §3.2.

### 8.1 Buttons and icon buttons

| Variant         | Fill                            | Text                          | Border                  | Use                                                                  |
| --------------- | ------------------------------- | ----------------------------- | ----------------------- | -------------------------------------------------------------------- |
| **Primary**     | `--color-accent-fill` `#d97757` | `--color-on-accent` `#141413` | none                    | The single main action in a region: Search, Book a visit, Show homes |
| **Secondary**   | transparent                     | ink                           | 1.5 px ink              | Message agent, Share, Cancel                                         |
| **Tertiary**    | transparent                     | ink-700, underlined           | none                    | Clear all, Read more, See all                                        |
| **Destructive** | Error-700 fill                  | paper                         | none                    | Delete list, Remove account (rare)                                   |
| **Icon button** | `--color-surface`               | ink icon                      | 1 px hairline on photos | Save, Close, Share. Always has a tooltip and an accessible name      |

**Sizes:** Large 56 px (home search), Default 48 px, Compact 40 px (dense toolbars; hit area stays 44 px). Min width 96 px. Radius 2 px. Padding 0 20 px. Icon + label gap 8 px.

| State    | Primary                    | Secondary                       |
| -------- | -------------------------- | ------------------------------- |
| Hover    | Fill Ember-400             | Fill ink, text paper            |
| Pressed  | Fill Ember-550             | Fill ink-700                    |
| Focus    | Focus ring (§7.3)          | Focus ring                      |
| Disabled | Linen fill, `#8a887f` text | Hairline border, `#8a887f` text |
| Loading  | Spinner + "Saving…"        | Spinner                         |

**Icon buttons on photographs** use a 36 px paper circle (visual) inside a 44 px hit area. The Save button's heart is outlined (idle) or ember-filled with an ink stroke (saved).

### 8.2 Search fields and location selectors

| Property         | Spec                                                                                               |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| Height           | 56 px (home), 52 px (default), 48 px (dense)                                                       |
| Surface / border | `--color-surface`, 1.5 px `--color-border-control`, radius 4 px                                    |
| Label            | `--text-label` above the field (or floating); never placeholder-only                               |
| Left icon        | 20 px search/pin, ink-500                                                                          |
| Clear button     | 44 px target, appears when text is present, label "Clear search"                                   |
| Focus            | 2 px `--color-focus` ring with paper gap; border becomes ink                                       |
| Error            | Error-700 border + icon + message below                                                            |
| Suggestion list  | `--shadow-2`, radius 4 px, 44 px rows, group headers in `--text-label`, max height 320 px, scrolls |

### 8.3 Property cards

See §5.3 for anatomy. Variants: **Standard** (grid), **Compact horizontal** (112 px photo, for sheets/tray/similar), **Feature** (home "Today's folio": 4:5 photo with a caption title block), **Saved** (adds note field and list selector), **Compare header** (photo, price, name, remove).

| State                          | Spec                                                                                       |
| ------------------------------ | ------------------------------------------------------------------------------------------ |
| Default                        | White, 1 px hairline, sun-line stub                                                        |
| Hover                          | Hairline → `--color-border-control`; sun-line extends to 100 %; arrows appear on the photo |
| Focus-visible                  | Focus ring around the card (the link element)                                              |
| Selected (linked to a map pin) | 1.5 px ink border, full sun-line                                                           |
| Saved                          | Heart filled; no additional card decoration                                                |
| Unavailable                    | See §5.12                                                                                  |
| Loading                        | Skeleton (§8.12)                                                                           |

### 8.4 Badges

Badges are rectangular (2 px radius), 24 px tall, `--text-label` (12 px, uppercase, +0.08em), 8 px horizontal padding, **always with an icon or text that does not rely on color**.

| Badge                   | Fill / text                                                            | Icon       |
| ----------------------- | ---------------------------------------------------------------------- | ---------- |
| **New**                 | Ink / paper                                                            | none       |
| **Price reduced**       | Moss-50 / Moss-700                                                     | Down arrow |
| **Open house**          | Sky-50 / Sky-700                                                       | Calendar   |
| **Under offer**         | Amber-50 / Amber-700                                                   | Clock      |
| **No longer available** | `#5e5d57` / paper                                                      | Slash      |
| **Verified**            | Only where a documented verification process exists; Ink-outline / ink | Check      |

Maximum **one** status badge and one "New" badge per card. Badges sit top-left on the photo.

### 8.5 Filter chips and filter panels

- **Chip:** 40 px tall (44 px target), 2 px radius, `--text-ui-sm`, white fill, 1.5 px control border, 12 px horizontal padding. With a dropdown, a 16 px chevron.
- **Selected chip:** ink fill, paper text, leading 16 px check icon, and (if removable) a trailing × (44 px target, "Remove filter: …").
- **Chip groups** wrap on expanded and medium; scroll horizontally on compact with the next chip partly visible.
- **Panel:** see §5.5. Section headers use `--text-h4` with a hairline above; inputs follow §8.2.
- **Counts:** the "All filters" chip shows a count badge (circle, 20 px, ink fill, paper text) when ≥ 1 filter is active.

### 8.6 Navigation bars and menus

- **Top bar:** paper background, 1 px hairline bottom edge (`--shadow-1` when scrolled). Wordmark: Poppins 600, lowercase, −0.02em, with a trailing **ember sun-point** (a 0.3em solid circle) where a period would be.
- **Links:** `--text-ui`, ink-700; active = ink, weight 600, 2 px ember underline offset 6 px.
- **Bottom tab bar (compact):** paper background, 1 px hairline top edge, 5 items, each 56 px tall with a 24 px icon over a 12 px label. Active item: ink icon and label weight 600 with a 2 px ember bar above the icon. Badge counts are circles (20 px, ink fill).
- **Account menu / dropdown menu:** `role="menu"`, 44 px items, `--shadow-2`, radius 4 px; Escape closes; arrow keys move; focus returns to the trigger.

### 8.7 Price labels and property metadata

| Component                  | Spec                                                                                                                                                                          |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Price label**            | Poppins 600; sizes `--text-price-xl / lg / sm`; ink; currency symbol 0.75× weight 500; optional suffix (`/mo`) in Poppins 400, ink-500                                        |
| **Price on request**       | Poppins 500, ink-700                                                                                                                                                          |
| **Title block (spec row)** | 3–4 equal cells, 1 px hairline vertical dividers, 1 px hairline top and bottom, cell padding 8 px, value `--text-spec` over label `--text-label` ink-500, center-left aligned |
| **Daylight dial**          | 24 px semicircle glyph + text ("S", "SE", etc.); see §9.3                                                                                                                     |
| **Reference tag**          | `--text-label`: `Nº 0427`, ink-500                                                                                                                                            |
| **Freshness**              | `--text-caption`, ink-500: "Updated 3 hours ago"                                                                                                                              |

### 8.8 Image galleries and map markers

**Gallery:** see §5.8. Tiles are 2 px radius, no border, `object-fit: cover` with the listing's focal point (`object-position` from `focal_x`/`focal_y`, default `50% 50%`). Tile captions are paper chips. Focus ring is shown on each tile.

**Map markers ("survey pins")**

| Pin                           | Spec                                                                                                                                                                                                                  |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Default**                   | Paper fill, 1.5 px ink border, 2 px radius, 28 px tall, 8 px horizontal padding, `--text-price-sm` ink. A 6 px stem and an 8 px **survey cross** (two 1.5 px ink strokes) sit under the label to mark the exact point |
| **Hover / linked card hover** | Ink fill, paper text, raised 4 px, z-index up                                                                                                                                                                         |
| **Selected**                  | Ember fill, ink text, 1.5 px ink border, 2 px paper outer ring                                                                                                                                                        |
| **Visited**                   | Linen fill, ink-500 text                                                                                                                                                                                              |
| **Saved**                     | Adds an 8 px ember dot (1 px ink ring) at the pin's top-right corner                                                                                                                                                  |
| **Unavailable**               | Dashed 1.5 px ink-500 border, ink-500 text, struck price                                                                                                                                                              |
| **Cluster**                   | 36–56 px circle, ink fill, paper count (Poppins 600), 1.5 px paper outer ring. Tapping zooms to fit                                                                                                                   |
| **Hit area**                  | ≥ 44 × 44 px (transparent padding)                                                                                                                                                                                    |
| **Overlap**                   | Collision handling: cluster at zoom ≤ 14; at higher zoom, stagger labels and prefer the selected, saved, and lowest-priced pins                                                                                       |

Pins are focusable in the map region (arrow keys move between pins in reading order); Enter selects; the selected card is announced.

### 8.9 Modals, drawers, tooltips, notifications

| Component                    | Spec                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Modal**                    | Max width 560 px, radius 8 px, `--shadow-3`, scrim `rgb(20 20 19 / 0.56)`. `role="dialog"`, `aria-modal="true"`, `aria-labelledby` the title. Focus trapped; Escape and an explicit Close button dismiss; focus returns to the trigger                                                                                                                                                                                                                                                                                                                                         |
| **Drawer (expanded/medium)** | Right-anchored, 480 px, full height, `--shadow-3`; header (title + Close), scrollable body, sticky footer                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Bottom sheet (compact)**   | Full width, top radius 12 px, grab handle (decorative) **plus** a Close button, snap points as needed, content scrolls independently                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Tooltip**                  | Inverse surface (`--color-inverse-bg`), 13 px Poppins 400, radius 4 px, max width 240 px, 8 px padding. Appears after 400 ms on hover **and** on keyboard focus; dismissible with Escape; hoverable. Never contains essential or interactive content                                                                                                                                                                                                                                                                                                                           |
| **Popover**                  | White, radius 8 px, `--shadow-2`, 16 px padding, anchored; closes on Escape and outside click; trigger has `aria-expanded`                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Toast / notification**     | Bottom-left (expanded), above the tab bar (compact). Width 360 px max, radius 4 px, inverse surface (`--color-inverse-bg`) with `--color-text-inverse` text, plus an optional single action (e.g., Undo) as underlined text in `--color-accent-text-on-inverse` (Ember-400 on the ink toast in light mode, 8.48:1; Ember-700 on the paper toast in dark mode, 6.24:1). Auto-dismiss after 5 s; **errors persist** until dismissed. `role="status"` (polite) for success; `role="alert"` for errors. Pause on hover and focus. Max one visible; new toasts replace the previous |

### 8.10 Inputs and form controls

Text input, textarea, select, checkbox, radio, switch, slider, date strip. Label above, helper text below (`--text-caption`, ink-500), error text below in Error-700 with an icon. Required fields are marked with the text "(required)" rather than an asterisk alone. Select menus use native `<select>` on touch devices for reliable accessibility, and a custom listbox on pointer devices only when features require it.

### 8.11 Tabs, segmented controls, and pagination

- **Tabs:** `role="tablist"` with arrow-key navigation; selected tab = ink text weight 600 + 2 px ember underline. Panels are not hidden from search engines.
- **Segmented control:** radio-group semantics; arrows move; selected = ink fill, paper text.
- **Pagination vs. infinite scroll:** results use **"Load more" button + page URL parameters** (24 per page). No automatic infinite scroll; the footer must stay reachable and focus management stays predictable. After loading more, focus moves to the first new card.

### 8.12 Skeleton loaders, empty states, error messages

- **Skeleton:** blocks in `--color-skeleton`, radius 2 px; structure mirrors the final component (§5.11).
- **Empty state:** centered stack: illustration (≤ 240 px), `h2` (`--text-h3`), one sentence in Lora `--text-body`, primary action, optional tertiary action.
- **Inline error:** icon + message in the error semantic colors, placed adjacent to the field or region; links to fix the cause where possible.
- **Page error:** `h1`, one-sentence explanation, primary action (Try again / Go home), reference code in `--text-caption` for support.

---

## 9. Distinctive features and brand personality

Five signature elements make the app recognizable without its logo. Each does a functional job, so none is decoration.

### 9.1 The Sun-line

A **2 px ember rule** that runs along the bottom edge of the primary photograph on every card, on the detail hero, and on the compare headers. It is a 24 px stub by default and extends to full width on hover, focus, or selection.

- **Function:** shows interactivity and selection state; ties the photograph to its title block.
- **Why it works:** a single thin orange line on a calm paper-and-ink page is recognizable at thumbnail size.
- **Constraint:** the sun-line is never the _only_ indicator of state (ember vs. paper is 2.96:1); selection also changes the border and, where relevant, text.

### 9.2 The Title Block

Every property is accompanied by a ruled **title block**: reference number, type, and a row of hairline-separated cells with values over labels. It appears identically on cards, detail, saved, and compare.

- **Function:** instant, aligned scanning and comparison across properties.
- **Why it works:** drawing-sheet conventions say "precise and trustworthy" without a word of marketing.
- **Constraint:** at most 4 cells; never add decorative cells.

### 9.3 The Daylight Dial

A 24 px semicircle glyph that shows the direction the main living space faces, with the matching sun arc highlighted (ink stroke, ember sun-point). The cardinal direction is always written next to it ("S", "SE").

- **Function:** orientation and light are decisive in a home and are rarely communicated visually.
- **Why it works:** it expresses the brand idea (light) as information.
- **Constraints:** shown **only when orientation data exists**; never inferred or estimated by the app; a tooltip explains it; the detail page may show a full "light through the day" panel with the same visual language when the data supports it.

### 9.4 Survey Pins

Map markers are price tags with a small **survey cross** marking the exact coordinate (§8.8). Selected pins turn ember. This replaces generic teardrop pins and makes the map immediately recognizable in screenshots.

### 9.5 The Contact-Sheet Gallery

The detail gallery is composed like a photographer's contact sheet: one large frame, a 2 × 2 grid, film-style frame counters (`03 / 24`), and labeled tiles for plans and tours (§5.8).

### 9.6 How these reinforce identity without clutter

- Each element is **1–2 px of ink or ember** plus text; none adds a new box, shadow, or color.
- Each appears **in the same place every time**, so users learn them once.
- Each can be **removed without breaking** the interface (the sun-line, dial, and survey cross are additive).
- The brand voice (§1.4) and the wordmark's ember sun-point repeat the same idea: one point of light.

---

## 10. Accessibility and implementation standards

### 10.1 WCAG 2.2 AA requirements

| Area                      | Requirement                                                                                                                                                                                        |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Contrast**              | Text 4.5:1 (3:1 large text ≥ 24 px, or ≥ 18.66 px bold); UI components and graphics 3:1. Verified values in §2.6. Re-verify any new pair                                                           |
| **Reflow and zoom**       | Works at 320 px width and 400 % zoom; 200 % text-only resize without loss (1.4.4, 1.4.10); text spacing overrides tolerated (1.4.12)                                                               |
| **Target size**           | ≥ 44 × 44 px target; WCAG 2.5.8 minimum 24 × 24 px                                                                                                                                                 |
| **Dragging alternatives** | Every drag action has a non-drag alternative: price slider has numeric inputs; map has buttons and keyboard; bottom sheet has a close button and tap-to-expand; floor-plan pan has buttons (2.5.7) |
| **Focus not obscured**    | Sticky headers, the compare tray, and sticky action bars MUST NOT cover the focused element; use `scroll-padding-top` / `scroll-padding-bottom` equal to the sticky heights (2.4.11)               |
| **Authentication**        | No cognitive-function tests (puzzles, transcribing) for sign-in; support password managers, passkeys, and email links (3.3.8)                                                                      |
| **Redundant entry**       | Do not ask users to re-enter information already provided in the same flow (3.3.7)                                                                                                                 |
| **Consistent help**       | Place "Help" in the same location on every page (3.2.6)                                                                                                                                            |
| **Motion**                | Respect `prefers-reduced-motion`; no auto-playing content; no flashing                                                                                                                             |
| **Orientation**           | Support portrait and landscape                                                                                                                                                                     |

### 10.2 Keyboard and focus

- Every function is reachable by keyboard in a logical order that matches visual order.
- **Skip links:** "Skip to results", "Skip to main content".
- **Focus ring:** §7.3, always visible, never clipped by `overflow: hidden` (use `outline-offset` and padding).
- **Patterns:** combobox (§5.2), menu, tabs, dialog (trap + return), listbox, carousel (previous/next buttons; no auto-advance), toast (does not steal focus).
- **After actions:** after applying filters, keep focus on the control; after loading more results, move focus to the first new card; after closing an overlay, return focus to its trigger; after route changes, move focus to the page's `h1`.
- **Map keyboard:** Tab to the map region; arrow keys pan; `+` / `−` zoom; Tab again moves into the pins.

### 10.3 Semantics and screen readers

- Landmarks: `header`, `nav` (labeled), `main`, `aside`, `footer`. One `h1` per page; headings never skip levels.
- **Card:** `<article>` with an `h3` containing the link. Accessible name example: "Willow Court, Unit 4B, Old Quarter, $1,250,000, 3 beds, 2 baths, 128 square meters, updated 3 hours ago." The visual order (photo first) differs from the logical reading order (name and price first); use DOM order that reads well and visually reorder with CSS only if the sequence is still logical.
- **Buttons:** state is in the name or state attribute: `aria-pressed` for Save and Compare, `aria-expanded` for disclosures and filters. Save label: "Save Willow Court, Unit 4B" / "Remove Willow Court, Unit 4B from saved".
- **Live regions:** result counts, filter updates, save/undo toasts, and form confirmations use polite live regions; errors use `role="alert"`.
- **Photos:** meaningful `alt` text that describes the scene ("Living room with a south-facing bay window and oak floor"), written by the agent or generated and agent-approved. Decorative duplicates use `alt=""`. Floor plans have a text alternative (room list with dimensions). Gallery counters are text, not images.
- **Maps:** the map region has `role="application"` only if custom keyboard handling is implemented; otherwise use a labeled `role="region"`. The list is the primary accessible alternative.
- **Language:** set `lang` on the document and on any foreign-language content.

### 10.4 Color and non-color indicators

| Information                 | Color cue       | Required non-color cue                     |
| --------------------------- | --------------- | ------------------------------------------ |
| Saved                       | Ember heart     | Filled shape + `aria-pressed` + toast text |
| Selected chip               | Ink fill        | Check icon + `aria-pressed`                |
| Price reduced               | Moss badge      | Down-arrow icon + text                     |
| Under offer / unavailable   | Amber / stone   | Icon + text label                          |
| Different values in Compare | Ember-50 row    | "≠" glyph + row label                      |
| Error                       | Error-700       | Icon + message text                        |
| Current page                | Ember underline | Bold weight + `aria-current`               |

### 10.5 Image aspect ratios, cropping, fallbacks

| Context                 | Ratio                    | Behavior                                 |
| ----------------------- | ------------------------ | ---------------------------------------- |
| Card photo              | 4:3                      | `object-fit: cover`, focal point honored |
| Compact horizontal card | 1:1 (112 px)             | Cover, focal point                       |
| Detail hero (single)    | 3:2                      | Cover                                    |
| Gallery grid tiles      | 3:2 (large), 3:2 (small) | Cover                                    |
| Lightbox                | Original                 | `object-fit: contain`, never cropped     |
| Feature photo (home)    | 4:5                      | Cover                                    |
| Agent avatar            | 1:1 circle               | Cover, face-centered                     |

- **Reserve space** with `aspect-ratio` and intrinsic `width`/`height` so no layout shift occurs.
- **Portrait photos in landscape frames:** cover with the focal point, never stretch.
- **Fallback:** on error, show `--color-bg-sunk` with a 32 px house icon and the text "Photo unavailable"; retry once automatically, then offer "Reload photo" on the detail page.
- **Minimum uploaded size:** 1600 px on the long edge; the UI warns agents below 1200 px in the listing tool.

### 10.6 Performance-conscious images and animation

- Formats: serve **AVIF** and **WebP** with a JPEG fallback via `<picture>`.
- Widths: generate `320, 480, 640, 800, 1024, 1280, 1600, 2048`. Use `srcset` with accurate `sizes`, for example `(min-width: 1440px) 25vw, (min-width: 1024px) 33vw, (min-width: 600px) 50vw, 100vw` for grid cards.
- Loading: the first row of cards and the detail hero use `loading="eager"` and `fetchpriority="high"` (only for the single LCP image); everything else uses `loading="lazy"` and `decoding="async"`.
- Do not load full-size gallery photos until the lightbox opens; prefetch the next one while it is open.
- Cache with immutable, content-hashed URLs.
- **Performance targets (75th percentile, mobile):** LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. Treat regressions as defects.
- **Animation:** `transform`/`opacity` only; avoid `box-shadow` or `filter` transitions on lists; `will-change` only briefly during interaction; no JavaScript-driven per-frame animation for card hovers.
- **Map:** vector tiles, deferred load until the map is visible or requested; cap pins at ~300 rendered with clustering beyond.

### 10.7 Naming conventions and component architecture

- **Layers:** `tokens` → `primitives` (Button, Input, Chip, Badge, Icon, Tooltip) → `patterns` (PropertyCard, TitleBlock, PriceLabel, FilterPanel, Gallery, MapPin, CompareTray) → `templates` (HomeTemplate, ResultsSplit, DetailTemplate, CompareTemplate) → `pages`.
- **Components:** PascalCase (`PropertyCard`); CSS: BEM with `df-` prefix; data attributes for state (`data-state="selected"`), ARIA for semantics.
- **Props:** `variant`, `size`, `state`, `density` as enumerated strings; avoid boolean prop explosions.
- **Tokens:** kebab-case. Reference (`--ref-*`) tokens are never used in components; semantic (`--color-*`) tokens are.
- **Files:** one component per folder: `PropertyCard/{PropertyCard.tsx, PropertyCard.css, PropertyCard.test.tsx, PropertyCard.stories.tsx}`.
- **Testing:** every pattern ships with stories for all states, an axe accessibility check, a keyboard test, and a visual-regression snapshot in light, dark, compact, and expanded.

---

## 11. Design tokens and final deliverable

### 11.1 CSS custom properties

Semantic tokens use `light-dark()` so a single declaration serves both modes. If you must support browsers without `light-dark()`, generate two blocks (default light, plus `@media (prefers-color-scheme: dark)` and `[data-theme="dark"]`) from the same source values.

```css
:root {
  color-scheme: light dark;

  /* ---------- Reference palette (do not use directly in components) ---------- */
  --ref-ink-900: #141413;
  --ref-ink-700: #3d3d3a;
  --ref-ink-500: #5e5d57;
  --ref-stone-400: #b0aea5;
  --ref-stone-500: #8a887f;
  --ref-stone-600: #7a786f;
  --ref-linen-200: #e8e6dc;
  --ref-paper-100: #f1efe6;
  --ref-paper-50: #faf9f5;
  --ref-white: #ffffff;

  --ref-night-950: #0e0e0d;
  --ref-night-800: #1e1e1c;
  --ref-night-700: #2a2a27;
  --ref-night-600: #34342f;

  --ref-ember-50: #fbece6;
  --ref-ember-400: #e4a085;
  --ref-ember-500: #d97757;
  --ref-ember-550: #cf6c47;
  --ref-ember-700: #9c4124;
  --ref-ember-dark-tint: #3a2219;

  --ref-sky-50: #e9f1f8;
  --ref-sky-300: #8fb4d9;
  --ref-sky-500: #6a9bcc;
  --ref-sky-700: #3a6a99;
  --ref-sky-dark-bg: #1b2835;

  --ref-moss-50: #eef2e7;
  --ref-moss-300: #9bb07d;
  --ref-moss-500: #788c5d;
  --ref-moss-700: #56683c;
  --ref-moss-dark-bg: #232a1b;

  --ref-amber-50: #fbf1d9;
  --ref-amber-300: #e0b04a;
  --ref-amber-700: #8a5a00;
  --ref-amber-dark-bg: #33270b;

  --ref-error-50: #fbe9e7;
  --ref-error-300: #f0897f;
  --ref-error-700: #b3261e;
  --ref-error-dark-bg: #3a1e1b;

  /* ---------- Semantic color ---------- */
  --color-bg: light-dark(var(--ref-paper-50), var(--ref-ink-900));
  --color-bg-sunk: light-dark(var(--ref-paper-100), var(--ref-night-950));
  --color-surface: light-dark(var(--ref-white), var(--ref-night-800));
  --color-surface-raised: light-dark(var(--ref-white), var(--ref-night-700));
  --color-skeleton: light-dark(var(--ref-linen-200), var(--ref-night-700));

  --color-border-hairline: light-dark(
    var(--ref-linen-200),
    var(--ref-night-600)
  );
  --color-border-control: light-dark(
    var(--ref-stone-500),
    var(--ref-stone-600)
  );
  --color-border-strong: light-dark(var(--ref-ink-900), var(--ref-paper-50));

  --color-text: light-dark(var(--ref-ink-900), var(--ref-paper-50));
  --color-text-secondary: light-dark(var(--ref-ink-700), var(--ref-linen-200));
  --color-text-muted: light-dark(var(--ref-ink-500), var(--ref-stone-400));
  --color-text-inverse: light-dark(var(--ref-paper-50), var(--ref-ink-900));
  --color-inverse-bg: light-dark(var(--ref-ink-900), var(--ref-paper-50));

  --color-accent-fill: var(--ref-ember-500);
  --color-accent-fill-hover: var(--ref-ember-400);
  --color-accent-fill-pressed: var(--ref-ember-550);
  --color-on-accent: var(--ref-ink-900);
  --color-accent-text: light-dark(var(--ref-ember-700), var(--ref-ember-400));
  --color-accent-tint: light-dark(
    var(--ref-ember-50),
    var(--ref-ember-dark-tint)
  );
  --color-accent-text-on-inverse: light-dark(
    var(--ref-ember-400),
    var(--ref-ember-700)
  );

  --color-focus: light-dark(var(--ref-sky-700), var(--ref-sky-300));

  --color-success-text: light-dark(var(--ref-moss-700), var(--ref-moss-300));
  --color-success-bg: light-dark(var(--ref-moss-50), var(--ref-moss-dark-bg));
  --color-warning-text: light-dark(var(--ref-amber-700), var(--ref-amber-300));
  --color-warning-bg: light-dark(var(--ref-amber-50), var(--ref-amber-dark-bg));
  --color-error-text: light-dark(var(--ref-error-700), var(--ref-error-300));
  --color-error-bg: light-dark(var(--ref-error-50), var(--ref-error-dark-bg));
  --color-info-text: light-dark(var(--ref-sky-700), var(--ref-sky-300));
  --color-info-bg: light-dark(var(--ref-sky-50), var(--ref-sky-dark-bg));

  --color-unavailable-bg: var(--ref-ink-500);
  --color-disabled-bg: light-dark(var(--ref-linen-200), var(--ref-night-600));
  --color-disabled-text: light-dark(var(--ref-stone-500), var(--ref-stone-600));

  --color-scrim: rgb(20 20 19 / 0.56);
  --scrim-media: linear-gradient(
    to top,
    rgb(20 20 19 / 0.72),
    rgb(20 20 19 / 0) 60%
  );

  /* ---------- Type ---------- */
  --font-display: "Poppins", "Helvetica Neue", Arial, sans-serif;
  --font-text: "Lora", Georgia, "Times New Roman", serif;

  --text-display: clamp(2.25rem, 1.73rem + 2.21vw, 3.5rem);
  --text-h1: clamp(1.75rem, 1.44rem + 1.33vw, 2.5rem);
  --text-h2: clamp(1.375rem, 1.22rem + 0.66vw, 1.75rem);
  --text-h3: 1.25rem;
  --text-h4: 1rem;
  --text-price-xl: 2rem; /* 2.5rem at >= 1024px */
  --text-price-lg: 1.375rem;
  --text-price-sm: 0.875rem;
  --text-body-lg: 1.125rem;
  --text-body: 1rem;
  --text-body-sm: 0.875rem;
  --text-ui: 0.9375rem;
  --text-ui-sm: 0.875rem;
  --text-meta: 0.875rem;
  --text-spec: 1rem;
  --text-label: 0.75rem;
  --text-caption: 0.75rem;

  --leading-tight: 1.1;
  --leading-heading: 1.25;
  --leading-ui: 1.4;
  --leading-body: 1.6;
  --tracking-display: -0.02em;
  --tracking-label: 0.08em;

  /* ---------- Space (4 px base) ---------- */
  --space-0: 0;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  /* ---------- Shape ---------- */
  --radius-none: 0;
  --radius-xs: 2px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-sheet: 12px;
  --radius-full: 9999px;

  --border-hairline: 1px solid var(--color-border-hairline);
  --border-control: 1.5px solid var(--color-border-control);
  --border-strong: 1.5px solid var(--color-border-strong);

  /* ---------- Elevation ---------- */
  --shadow-1: 0 1px 0 rgb(20 20 19 / 0.06);
  --shadow-2: 0 2px 8px rgb(20 20 19 / 0.1);
  --shadow-3: 0 12px 32px rgb(20 20 19 / 0.18);

  /* ---------- Motion ---------- */
  --motion-instant: 80ms;
  --motion-fast: 120ms;
  --motion-base: 200ms;
  --motion-slow: 320ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);

  /* ---------- Layout ---------- */
  --bp-medium: 600px;
  --bp-expanded: 1024px;
  --bp-wide: 1440px;
  --content-max: 1360px;
  --reading-max: 720px;
  --target-min: 44px;
  --header-h: 72px; /* 64px medium, 56px compact top bar */
  --tabbar-h: 56px;

  /* ---------- Z-index ---------- */
  --z-sticky: 100;
  --z-tray: 200;
  --z-drawer: 300;
  --z-modal: 400;
  --z-toast: 500;
  --z-tooltip: 600;
}

:root[data-theme="light"] {
  color-scheme: light;
}
:root[data-theme="dark"] {
  color-scheme: dark;
}

@media (min-width: 1024px) {
  :root {
    --text-price-xl: 2.5rem;
  }
}
```

### 11.2 Core component CSS (reference implementation)

```css
body {
  background: var(--color-bg);
  color: var(--color-text);
  font: 400 var(--text-body)/var(--leading-body) var(--font-text);
}

:where(a, button, input, select, textarea, [tabindex]):focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px var(--color-bg),
    0 0 0 4px var(--color-focus);
}

.df-btn {
  min-height: 48px;
  min-width: 96px;
  padding: 0 var(--space-5);
  font: 500 var(--text-ui)/var(--leading-ui) var(--font-display);
  border: 0;
  border-radius: var(--radius-xs);
  transition: background-color var(--motion-fast) var(--ease-standard);
}
.df-btn--primary {
  background: var(--color-accent-fill);
  color: var(--color-on-accent);
}
.df-btn--secondary {
  background: transparent;
  color: var(--color-text);
  border: var(--border-strong);
}
@media (hover: hover) {
  .df-btn--primary:hover {
    background: var(--color-accent-fill-hover);
  }
  .df-btn--secondary:hover {
    background: var(--color-border-strong);
    color: var(--color-text-inverse);
  }
}
.df-btn--primary:active {
  background: var(--color-accent-fill-pressed);
}

.df-card {
  position: relative;
  background: var(--color-surface);
  border: var(--border-hairline);
  border-radius: var(--radius-sm);
}
.df-card__media {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: var(--radius-xs);
}
.df-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: var(--focal, 50% 50%);
}
.df-card__sunline {
  position: absolute;
  inset: auto 0 0 0;
  height: 2px;
  background: var(--color-accent-fill);
  clip-path: inset(0 calc(100% - 24px) 0 0);
  transition: clip-path var(--motion-base) var(--ease-standard);
}
.df-card:is(:hover, :focus-within, [data-state="selected"]) .df-card__sunline {
  clip-path: inset(0 0 0 0);
}
.df-card__link::after {
  content: "";
  position: absolute;
  inset: 0;
} /* stretched link */
.df-card__actions {
  position: relative;
  z-index: 1;
} /* above stretched link */

.df-titleblock {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  border-block: var(--border-hairline);
}
.df-titleblock > * {
  padding: var(--space-2) var(--space-3);
  border-inline-start: var(--border-hairline);
}
.df-titleblock > :first-child {
  border-inline-start: 0;
}
.df-titleblock__value {
  font: 600 var(--text-spec)/1.2 var(--font-display);
  font-variant-numeric: tabular-nums;
}
.df-titleblock__label {
  font: 500 var(--text-label)/1.3 var(--font-display);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--color-text-muted);
}
```

### 11.3 Tailwind mapping (optional)

```js
// tailwind.config.js (theme.extend)
colors: {
  bg: "var(--color-bg)", sunk: "var(--color-bg-sunk)", surface: "var(--color-surface)",
  ink: "var(--color-text)", "ink-2": "var(--color-text-secondary)", "ink-3": "var(--color-text-muted)",
  hairline: "var(--color-border-hairline)", control: "var(--color-border-control)",
  ember: { DEFAULT: "var(--color-accent-fill)", hover: "var(--color-accent-fill-hover)",
           pressed: "var(--color-accent-fill-pressed)", text: "var(--color-accent-text)",
           tint: "var(--color-accent-tint)" },
  success: "var(--color-success-text)", warning: "var(--color-warning-text)",
  danger: "var(--color-error-text)", info: "var(--color-info-text)",
},
fontFamily: { display: ["Poppins", "Helvetica Neue", "Arial", "sans-serif"],
              text: ["Lora", "Georgia", "Times New Roman", "serif"] },
borderRadius: { xs: "2px", sm: "4px", md: "8px", sheet: "12px" },
screens: { medium: "600px", expanded: "1024px", wide: "1440px" },
transitionDuration: { fast: "120ms", base: "200ms", slow: "320ms" },
```

### 11.4 Screen inventory (build order)

1. Tokens, type, icon set, primitives
2. Property card, title block, price label, badges
3. Results screen (list + map + filters)
4. Detail page (gallery, enquiry, floor plan, tour entry)
5. Save, Shortlist, Compare
6. Home
7. Contact / Book a visit flows
8. States: skeletons, empty, errors, unavailable
9. Dark mode pass and responsive QA

### 11.5 Do and Don't

| Do                                                              | Don't                                                       |
| --------------------------------------------------------------- | ----------------------------------------------------------- |
| Let the photograph be the largest element on every listing view | Cover photos with text, gradients, or heavy overlays        |
| Show price in ink, Poppins 600                                  | Color prices orange, red, or green                          |
| Use ember for one primary action per region                     | Use ember for several buttons, tags, or links on one screen |
| Use ink fill + check for selected chips                         | Rely on color alone to show selection                       |
| Use title blocks for specs everywhere                           | Invent a new spec layout for a new screen                   |
| Keep corners at 2–4 px                                          | Use large pill radii or blob shapes                         |
| Use hairlines and whitespace for structure                      | Stack cards inside cards or add drop shadows to everything  |
| Show "Updated {time}" and the listing agency                    | Use "Hurry", "Only 2 left", or fake viewer counts           |
| Give every map task a list alternative                          | Make the map the only way to complete a task                |
| Provide numeric inputs next to sliders                          | Require dragging for any action                             |
| Use 44 px targets and 8 px spacing on touch                     | Hide controls behind hover only                             |
| Write `alt` text that describes the scene                       | Leave `alt` empty on meaningful photos                      |
| Preserve filters and scroll position on Back                    | Reset the results when returning from detail                |
| Label calculated figures "Estimate"                             | Present calculations as facts                               |
| Animate `transform` and `opacity` for feedback                  | Animate layout, parallax, or auto-rotate content            |
| Honor `prefers-reduced-motion`                                  | Make motion required to understand the UI                   |
| Use dark "Lamplight" tokens from the same hierarchy             | Invert colors or dim photographs in dark mode               |
| Reuse tokens                                                    | Hard-code HEX, px, or ms values                             |

### 11.6 Final visual consistency checklist

Use before every release and in code review. A "no" on any item is a defect.

**Identity**

- [ ] Ember appears at most once as a call to act per screen region (state markers excluded).
- [ ] The sun-line, title block, and (when data exists) daylight dial appear on every property representation.
- [ ] Prices are ink, Poppins 600, locale-formatted, never abbreviated outside map pins.
- [ ] No gradients except the functional photo scrim; no glass blur, neumorphism, or hard offset shadows.

**Color and contrast**

- [ ] No raw ember, sky, moss, or stone is used as text color.
- [ ] Every text pair is ≥ 4.5:1 and every control border or icon is ≥ 3:1, in light and dark.
- [ ] Every status shows an icon or text in addition to color.

**Type**

- [ ] Poppins for structure and numbers; Lora only for prose at 14 px or larger (primary prose 16 px or larger).
- [ ] No text below 12 px; reading measure ≤ 75 characters.
- [ ] Type uses `--text-*` tokens only.

**Layout and responsive**

- [ ] Spacing is on the 4 px scale; margins and gutters follow §4.2.
- [ ] Compact, medium, and expanded each have their own composition (§6.6).
- [ ] No horizontal scroll at 320 px outside scroll containers.
- [ ] Touch targets ≥ 44 × 44 px with ≥ 8 px between them.

**Components and states**

- [ ] All components show default, hover, focus-visible, pressed, selected, disabled, loading, and error where applicable.
- [ ] Focus is visible, unclipped, and not covered by sticky UI.
- [ ] Skeletons match the final layout and do not shift the page.

**Content**

- [ ] Copy follows the voice rules (§1.4): sentence case, no exclamation marks, no superlatives, no urgency tricks.
- [ ] Calculated values are labeled "Estimate"; "Updated {time}" and agency name are visible on detail.
- [ ] Approximate locations are labeled as such.

**Media and performance**

- [ ] Photos are unfiltered, use focal points, reserve space, and fall back gracefully.
- [ ] Only the LCP image is eager; the rest are lazy; AVIF/WebP with JPEG fallback.
- [ ] Animations use `transform`/`opacity` only and respect reduced motion.

**Accessibility**

- [ ] Keyboard-only walkthrough completes search, filter, save, compare, and book a visit.
- [ ] Screen-reader walkthrough announces card contents, result counts, saved state, and errors.
- [ ] Axe (or equivalent) reports no critical or serious issues in light, dark, compact, and expanded.

---

_End of design.md. Update the version and date at the top whenever tokens or rules change._
