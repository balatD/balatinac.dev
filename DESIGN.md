# DESIGN.md — balatinac.dev

Brand register: **brand** (portfolio — the design *is* the product).
Identity: **Warm Mechanical** — engineered, tactile, honest. Backend engineer who builds
"quiet, reliable systems"; the site should feel like a well-machined tool, not a magazine.

Deliberately *not* the editorial lane (display-serif + thin rule separators + tiny mono kickers)
the old site lived in. Personality comes from a characterful grotesque, a real mono *system*
(spec rows, index numbers, brackets), warm paper/charcoal surfaces, and one industrial accent.

## Typography (self-hosted, variable, latin + latin-ext)

| Role | Family | Weights | Usage |
|------|--------|---------|-------|
| Display | **Bricolage Grotesque** | 600–800 | h1/h2, wordmark, big statements. Tight tracking, opsz. |
| Body | **Hanken Grotesk** | 400–600 | paragraphs, descriptions, nav. Warm humanist grotesque. |
| Mono | **Spline Sans Mono** | 400–600 | spec labels, index numbers `[01]`, metadata, code. The "machine" voice. |

Files: `/public/fonts/{family}-latin.woff2` + `-latin-ext.woff2`. Preload Bricolage + Hanken latin.
Fluid scale via `clamp()`, ratio ≥1.25. Body cap 65–75ch.

## Color — OKLCH, warm-tinted neutrals + one clay/rust accent (Restrained→Committed)

Never `#000`/`#fff`; every neutral tinted toward warm hue ~60–75.

### Light ("warm paper")
```
--bg:      oklch(0.955 0.010 75)   /* warm paper        */
--surface: oklch(0.925 0.012 75)   /* spec-row panel    */
--fg:      oklch(0.235 0.012 60)   /* warm ink          */
--muted:   oklch(0.520 0.016 62)   /* secondary text    */
--rule:    oklch(0.875 0.013 72)   /* hairlines         */
--accent:  oklch(0.560 0.150 48)   /* clay / burnt sienna */
--accent-ink: oklch(0.985 0.004 75)/* text on accent    */
```

### Dark ("warm charcoal")
```
--bg:      oklch(0.180 0.008 62)   /* warm charcoal, not black */
--surface: oklch(0.225 0.009 62)
--fg:      oklch(0.920 0.008 75)
--muted:   oklch(0.640 0.013 66)
--rule:    oklch(0.310 0.009 62)
--accent:  oklch(0.660 0.150 52)   /* brighter amber-rust */
--accent-ink: oklch(0.160 0.010 60)
```

## Motif (replaces the accent-dot system)

- **Index numbers** `[01] [02]` in mono before sections / list rows.
- **Spec rows**: key/value rows on `--surface` panels with mono keys, not thin-rule lists.
- **[DB] monogram** wordmark in a bracketed mono tag; full "Dragan Balatinac" in Bricolage.
- **Double-rule underline** `════` under headings instead of single hairline.
- Accent used on hover, active state, index numbers, and one CTA fill. No gradient text, no glass.

## Motion — "Rich" (Motion / motion.dev ~5KB), all gated by `prefers-reduced-motion`

- **Entrance**: staggered reveal (`translateY(14px)`+opacity, ease-out-expo ~0.6s, stagger 60ms).
- **Scroll**: `inView` reveals per section + list row, once, staggered.
- **Micro**: spring on CTA/nav hover (subtle scale/translate), accent underline wipe.
- Re-init on `astro:page-load`; reduced-motion → elements rendered in final state, no JS animation.
- Never animate layout props; transform/opacity only.

## Constraints kept
WCAG 2.2 AA, light+dark via CSS vars (no `dark:`), self-hosted fonts, static output.
Motion is the one budget exception the user approved (zero-JS → ~5KB Motion).
