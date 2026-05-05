# src/layouts/

## Responsibility

Single root layout template (`BaseLayout.astro`) wrapping every page on the site. Provides the complete HTML shell — doctype, `<head>` (SEO meta, font preloads, hreflang alternates, RSS link, ClientRouter, theme init script), `<body>` (skip link, ambient blobs, wordmark, header, main slot, footer, lightbox dialog) — and all runtime client JS (theme toggling, mobile menu, tooltip clamping, lightbox, View Transition lifecycle management).

## Design Patterns

- **Slot composition**: Astro's `<slot />` for page-specific content injection into `<main>`. No layout nesting — `BaseLayout` is the single root.
- **Typed Props interface**: `Props` type defines all configurable data (title, description, OG metadata, activeNav, lang, altLangUrl) with sensible defaults (lang defaults to `'de'`, description to a portfolio tagline).
- **Inline theme init (FOUC prevention)**: A synchronous, inlined `<script is:inline>` reads `localStorage('theme')` or `prefers-color-scheme` and sets `data-theme` on `<html>` before any rendering, preventing a flash of un-themed content.
- **Clone-and-replace event rebinding**: `initPage()` clones theme toggle and mobile menu buttons with `cloneNode(true) + replaceChild()` to strip stale event listeners left over from View Transition swaps. This avoids memory leaks without needing a dedicated framework.
- **Lifecycle hooks**: Re-initializes interactive JS on `astro:page-load` (theme icons, toggles, menu, tooltips, lightbox) and re-patches theme on `astro:after-swap` (ensuring `data-theme` persists through soft navigations).
- **Browser sniffing**: Detects Safari to choose crossfade over circular clip-path for theme View Transitions, working around Safari's compositing jank.
- **Progressive enhancement**: Lightbox uses native `<dialog>` with `showModal()`/`close()`; no lightbox when JS is unavailable — images remain inline.
- **Focus management**: Lightbox saves/restores `previouslyFocused` element, locks background scroll via `body.lightbox-open`, traps Tab focus within the dialog.

## Data & Control Flow

1. **Page frontmatter → Props**: Each page sets `layout: ../layouts/BaseLayout.astro` and passes `title`, `description`, `ogImage`, `ogType`, `publishedAt`, `noindex`, `activeNav`, `lang`, `altLangUrl`.
2. **i18n resolution**: `lang` defaults to `'de'`. `altLangUrl` defaults to `langSwitchUrl(Astro.url.pathname, lang)`. `altLang` is the complement (`de` ↔ `en`). `t('skip', lang)` translates the skip-link text.
3. **hreflang generation**: Three `<link rel="alternate">` tags emitted — one for current `lang`, one for `altLang`, and `x-default` pointing to the German URL (or English if current is English).
4. **Sub-component wiring**:
   - `SEO` receives all SEO-related props.
   - `Header` receives `activeNav`, `lang`, `altLangUrl`.
   - `Wordmark` receives `href` (prefixed home URL via `langPrefix`).
   - `Footer` receives `lang`.
   - `AmbientBlobs` receives no props (purely decorative).
5. **Runtime JS control flow**:
   - **Inline init**: Sets `data-theme` on `<html>` from localStorage or system preference — fires synchronously in `<head>`.
   - **`astro:page-load` → `initPage()`**: Syncs theme icon visibility, clones theme toggles + menu toggle (rebinding click handlers), adds `pointerenter`/`focusin`/`touchstart` listeners to tooltip triggers for clamping.
   - **`astro:page-load` → `initLightbox()`**: Wires close button, backdrop click, image click, Tab trap on `<dialog>`. Makes all `.prose-article img` clickable (unless wrapped in `<a>`), setting `role="button"`, `tabindex="0"`, and `aria-label`.
   - **`astro:after-swap`**: Re-reads theme from localStorage and reapplies `data-theme` + icon sync to handle View Transition soft navigations.
   - **Global `keydown`**: `Escape` closes mobile menu (registered once via `__menuEscBound` guard).

## Integration Points

- **Depends on**:
  - `../styles/global.css` — Tailwind base + design tokens + all custom utility classes
  - `../components/layout/Header.astro` — main/page navigation (desktop + mobile)
  - `../components/layout/Footer.astro` — site footer
  - `../components/layout/Wordmark.astro` — site logo/wordmark link
  - `../components/layout/AmbientBlobs.astro` — decorative background blobs
  - `../components/layout/SEO.astro` — typed meta/OG tag generator
  - `../lib/i18n` — `t()`, `langPrefix()`, `langSwitchUrl()`, `Lang` type
  - `astro:transitions` — `ClientRouter` for View Transitions SPA navigation
- **Consumed by**: Every `.astro` page in `src/pages/` (and any layout extending this one). Pages set `layout: ../layouts/BaseLayout.astro` in frontmatter and pass props via the `frontmatter` interface.
