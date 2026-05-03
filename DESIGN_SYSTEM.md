# Design System — Capital

Swiss-inspired, warm minimal. Static, clean, fast. Editorial not corporate.

## Colour Tokens

| Token | Hex | Usage |
|---|---|---|
| `--color-background` | `#F5F5F2` | Default page background (warm off-white, NOT pure white) |
| `--color-foreground` | `#0A0A0A` | Primary text, dark backgrounds, primary buttons |
| `--color-muted` | `#8C8C88` | Labels, secondary UI text |
| `--color-muted-foreground` | `#5C5C58` | Body copy that's subordinate but still readable |
| `--color-border` | `#E5E5E0` | Structural dividers, card borders |
| `--color-accent-orange` | `#FF6A00` | Full-section backgrounds (bold, never text) |
| `--color-accent-purple` | `#5B5FBC` | Gradient start (paired with peach) |
| `--color-accent-peach` | `#E89370` | Gradient end |
| `--color-dot-inactive` | `#D8D7D2` | Decorative dot grid |

## Font Usage

| Family | Variable | Usage |
|---|---|---|
| Inter | `--font-inter` / `font-sans` | Body text, UI, form labels, nav |
| Inter Tight | `--font-inter-tight` / `font-display` | Display headlines (h1, h2, h3) |

**Rules:**
- Display headlines: `font-normal` or `font-light`. Never bold. Size does the emphasis.
- Body: `font-normal` (400). Use `font-medium` (500) sparingly for labels.
- Max 2 fonts. Ever.

## Typography Scale

| Name | Size | Line height | Letter spacing | Use |
|---|---|---|---|---|
| `display-xl` | `clamp(4rem, 10vw, 9rem)` | 0.95 | -0.04em | Hero headlines |
| `display-lg` | `clamp(3rem, 7vw, 6rem)` | 1 | -0.03em | Section headlines |
| `display-md` | `clamp(2rem, 5vw, 4rem)` | 1.05 | -0.02em | Sub-section headlines |
| `section-number` | `clamp(4rem, 10vw, 8rem)` | 1 | — | Decorative "01" numbering |

## Components

| Component | File | Purpose |
|---|---|---|
| `Section` | `components/swiss/section.tsx` | Full-width section with optional colour background and corner number |
| `Headline` | `components/swiss/headline.tsx` | Display headline (xl/lg/md) with proper tracking/leading |
| `CTAButton` | `components/swiss/cta-button.tsx` | Pill-shaped CTA (primary/secondary/outline) |
| `FeatureList` | `components/swiss/feature-list.tsx` | Square-bullet grid list (2 or 3 columns) |
| `DotPattern` | `components/swiss/dot-pattern.tsx` | Decorative SVG dot grid |
| `SectionDivider` | `components/swiss/section-divider.tsx` | Subtle `<hr>` separator |

## Spacing

| Token | Value | Use |
|---|---|---|
| `--spacing-section` | `8rem` | Standard vertical section padding |
| `--spacing-section-sm` | `5rem` | Compact sections (footer) |
| `--spacing-section-lg` | `12rem` | Hero sections |

Container max-width: `1440px` with `px-8 lg:px-12` horizontal padding.

## What NOT To Do

- **No animations** beyond hover transitions. No scroll-triggered reveals, parallax, or fade-ins.
- **No drop shadows** anywhere.
- **No gradients on text or buttons** — only on full-section backgrounds (purple→peach diagonal only).
- **No icons** except functional ones (FAQ +/−). Use square bullets for lists.
- **No rounded corners** except pill CTA buttons. Everything else is sharp.
- **No unnecessary borders** — separation comes from whitespace and colour.
- **No pure white** backgrounds. Use `--color-background` (warm off-white).
- **No cool-blue greys** — all neutrals are warm-tinted. Avoid Tailwind's default `gray-*`.
- **No bold on display headlines** — size does the emphasis.
- **No extra fonts** — Inter + Inter Tight only.
- **No CSS custom properties** beyond what next/font and the theme generate.

## Building New Pages

1. Use `<Section>` for every full-width block
2. Use `<Headline>` for all headings — never raw `<h1>` with manual font sizes
3. Use `<CTAButton>` for all call-to-action links — never raw `<a>` with button styling
4. Use the 12-column grid (`grid grid-cols-12 gap-8`) for layout within sections
5. Refer to the landing page (`app/(public)/page.tsx`) as the living reference
