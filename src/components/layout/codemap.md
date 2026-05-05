# src/components/layout/

## Responsibility
Provides the structural shell rendered by `BaseLayout.astro` on every page. This directory owns the global UI frame: navigation chrome (`Header`, `Footer`), `<head>` metadata (`SEO`, `JsonLd`), decorative background (`AmbientBlobs`), and a vestigial wordmark component (`Wordmark`). Each component concerns itself with layout-level concerns (positioning, z-index stacking, ARIA landmarks, SEO) rather than page-specific content.

## Design Patterns
- **Server-only rendering**: Zero `client:*` directives. All components render to static HTML at build time. Client interactivity (theme toggle, mobile menu) is handled via inline `<script>` elements in `BaseLayout`, not in these components.
- **Props-based i18n**: `Header`, `Footer`, and `SEO` accept an optional `lang?: Lang` prop (defaulting to `'de'`) and use the shared `t()` function from `../../lib/i18n` for string resolution. `Header` also accepts `activeNav` for marking the current page in navigation.
- **Composition in BaseLayout**: `BaseLayout.astro` imports all layout components and renders them in order: `AmbientBlobs` (decorative z-index layer) → `Wordmark` (legacy, now renders only a comment) → `Header` (fixed position, top) → `<slot />` (page content via `<main>`) → `Footer` (bottom). `SEO` is rendered inside `<head>`.
- **Facade over `<head>`**: `SEO` centralizes all meta tag generation (title, description, Open Graph, Twitter Card, canonical URL, robots). `JsonLd` is a generic script injector accepting `schema: Record<string, unknown>` — consumers pass pre-built JSON-LD objects.
- **Legacy stub**: `Wordmark.astro` once rendered an inline wordmark but now contains only a comment noting the desktop wordmark moved into `Header`. It remains imported in `BaseLayout` for backward compatibility.

## Data & Control Flow
- `Header` receives `lang` and `activeNav` from `BaseLayout`, which receives them from page-level layouts or pages. It derives `navLinks` (4 entries: about, work, writing, contact) by calling `t()` per label and prefixes hrefs via `langPrefix()`. The language switch href is computed via `langSwitchUrl()`. Mobile nav is toggled via CSS `data-open` attribute controlled by `BaseLayout`'s inline script.
- `Footer` receives `lang`, renders a translated string via `t('footer.built', lang)`, and shows the current year via `new Date().getFullYear()`.
- `SEO` receives `title`, `description`, `ogImage`, `ogType`, `publishedAt`, `noindex`. It constructs `canonical` URL from `Astro.url.pathname + Astro.site` and `ogImageUrl` similarly. The full `<title>` is composed as `"{title} — Dragan Balatinac"` unless title equals `'Dragan Balatinac'` (homepage).
- `JsonLd` is a pure render component: receives a `schema` object and serializes it into `<script type="application/ld+json">` via `set:html`.
- `AmbientBlobs` has no props, no imports, no data dependencies. It renders a purely decorative `<div>` with CSS-only background blobs using CSS custom properties (`--accent`, `--fg`).

## Integration Points
- **Depends on**: `../../lib/i18n` (all components except `AmbientBlobs` and `JsonLd`). `Header` and `Footer` use `t()` for string lookup, `langPrefix()` for URL prefixing, and `langSwitchUrl()` for language-switch URL generation. `SEO` relies on `Astro.url` and `Astro.site` globals.
- **Consumed by**: `BaseLayout.astro` (src/layouts/BaseLayout.astro) imports and renders all 6 components. `BaseLayout` is consumed by all page-level `.astro` files (`src/pages/**`).
- **SEO and JsonLd also used directly** by `ProjectLayout.astro` or individual pages where additional structured data is required beyond what `BaseLayout` provides. `SEO` may also be used in standalone contexts (e.g., OG image generation endpoints).
