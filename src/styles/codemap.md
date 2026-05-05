# src/styles/

## Responsibility

Single global stylesheet (`global.css`) that is the sole source of all visual design for the site. Bootstraps Tailwind v4 utility framework via `@import "tailwindcss"`, self-hosts two font families (Space Grotesk + Space Mono) with `unicode-range` splitting, defines the complete design token system through CSS custom properties (light + dark theme), and provides all custom utility/component classes used across every page and component.

## Design Patterns

- **CSS custom property theme system**: All color tokens are defined as CSS custom properties on `:root` (light) and `:root[data-theme="dark"]` (dark). No Tailwind `dark:` variant — everything is driven by `var(--*)`. The `@theme` block maps these to Tailwind utility names (`bg-bg`, `text-fg`, `text-muted`, `border-rule`, `text-accent`).
- **Self-hosted fonts with `unicode-range` splitting**: Each font family (Space Grotesk variable weight 300–700, Space Mono 400/700) is split across two `@font-face` blocks — Latin Extended first (fallback for accented characters) and Latin Basic second (core subset). This reduces initial font download size. Both use `font-display: swap` to prevent invisible text during load.
- **Shiki dual-theme syntax highlighting**: CSS-only approach — when `[data-theme="dark"]` is present on `:root`, `.astro-code` and its `<span>` children inherit `var(--shiki-dark)` / `var(--shiki-dark-bg)` overrides. No JS runtime required for code block theming.
- **View Transitions API customization**: Overrides default crossfade with `fade-and-shrink` / `fade-and-grow` keyframe pair for page navigation (root view transition). Theme toggle transitions are disabled via `.theme-transition` class (JS controls the animation).
- **Reduced motion global override**: `@media (prefers-reduced-motion: reduce)` block kills all `animation`, `transition-duration`, and `scroll-behavior` across the entire site with `!important`, plus disables `.blob` drift entirely.
- **Atomic/utility class naming**: Custom classes are single-responsibility and composable: `.skip-link`, `.tooltip-trigger`/`.tooltip-bubble`, `.wordmark`, `.mobile-menu`, `.nav-link`, `.section-label`, `.tick`, `.cta-link`, `.h1-hero`, `.h1-page`, `.lang-btn`, `.blob`, `.dash-list`, `.ord-list`, `.lightbox-*`, `.prose-article`.
- **`:focus-visible` global ring**: A single rule sets a consistent `2px solid var(--accent)` outline with offset on all `:focus-visible` elements, ensuring WCAG 2.2 AA compliance without per-component repetition.

## Data & Control Flow

- **Build-time (static)**:
  1. `@import "tailwindcss"` is processed by `@tailwindcss/vite` (registered in `astro.config.mjs`). Tailwind scans all `.astro`/`.ts` files for utility class usage and tree-shakes unused styles.
  2. The `@theme` block registers `--color-{bg,fg,muted,rule,accent}` and `--font-{sans,mono}` as Tailwind design tokens, making them available as `bg-bg`, `text-fg`, `font-sans`, etc.
  3. All custom class definitions are static CSS, emitted as-is.
- **Runtime (reactive)**:
  - **Theme switching**: The `data-theme` attribute on `<html>` (set by inline JS in `BaseLayout.astro`) is the sole runtime toggle. CSS reacts via `:root[data-theme="dark"]` selector to swap `--bg`, `--fg`, `--muted`, `--rule`, `--accent` values.
  - **Shiki dark mode**: `.astro-code span` color override activates only when `[data-theme="dark"]` is on `:root`.
  - **`::selection`**: Always uses `var(--accent)` as background — dynamically inherits whichever accent color is active.
  - **View Transitions**: Keyframe-based `::view-transition-old(root)` / `::view-transition-new(root)` animations run automatically on every page navigation. The `.theme-transition` class disables them during JS-driven theme toggles.
  - **`prefers-reduced-motion`**: OS-level media query overrides all animations globally.
  - **Lightbox**: Classes `.lightbox-open` (body scroll lock) and `.lightbox-dialog[open]` (entry animation) are reactive — driven by JS adding/removing classes and calling `dialog.showModal()`/`close()`.
- **No dynamic data injection**: All token values are hardcoded in `:root` / `:root[data-theme="dark"]`. No runtime variable computation or CSS-in-JS.

## Integration Points

- **Depends on**:
  - Tailwind v4 (`@tailwindcss/vite` plugin in `astro.config.mjs`) — provides the utility framework, `@theme` token mapping, and tree-shaking
  - Self-hosted font files in `/public/fonts/` — `space-grotesk-latin-400-500-700.woff2`, `space-grotesk-latin-ext.woff2`, `space-mono-latin-400.woff2`, `space-mono-latin-ext-400.woff2`, `space-mono-latin-700.woff2`, `space-mono-latin-ext-700.woff2`
- **Consumed by**:
  - `BaseLayout.astro` (line 2: `import '../styles/global.css'`) — every page transitively imports this file
  - All `.astro` components in `src/components/` — via Tailwind utility classes mapped through `@theme` (`bg-bg`, `text-fg`, `font-sans`, `font-mono`, etc.) and via custom CSS class names (`.skip-link`, `.tooltip-*`, `.wordmark`, `.mobile-menu`, `.nav-link`, `.section-label`, `.h1-hero`, `.h1-page`, `.cta-link`, `.lang-btn`, `.blob`, `.dash-list`, `.ord-list`)
  - `BaseLayout.astro` runtime JS — references `.lightbox-*`, `.prose-article`, `.tooltip-trigger`, `.tooltip-bubble`, `.mobile-menu`, `.icon-sun`, `.icon-moon`, `.theme-transition`
  - Content pages using `.prose-article` for blog/project article styling (image zoom, figures, figcaptions)
