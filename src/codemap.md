# src/

## Responsibility
Source root for the balatinac.dev Astro project. Contains all components, layouts, pages, styles, content collections, and shared libraries.

## Design Patterns
- **Astro Islands Architecture** — server-rendered by default, zero `client:*` directives
- **CSS Variable Theming** — `:root` / `:root[data-theme="dark"]` with Tailwind `@theme` bridge
- **Bilingual Content Collections** — separate Zod-validated collections per language (`blog` / `blogDe`, `projects` / `projectsDe`)
- **Vanilla Script Interactivity** — theme toggle, mobile menu, lightbox, tag filter all in inline `<script>` blocks

## Data & Control Flow
1. Astro build → `getStaticPaths()` generates all routes from content collections
2. Content Collections (`src/content.config.ts`) validate frontmatter via Zod
3. `src/lib/i18n.ts` provides `t(key, lang)` for all UI strings
4. `src/lib/content-helpers.ts` provides `buildDeMap()`, `getLocalizedEntry()`, `getDeSlug()` for cross-language resolution
5. Pages compose sections inside `BaseLayout.astro`, which injects `<head>`, SEO, theme init, and global scripts

## Integration Points
- **Upstream**: Content Collections (Markdown files in `src/content/`)
- **Downstream**: Static HTML output deployed to Cloudflare Pages
- **Config**: `astro.config.mjs` (root), `src/content.config.ts`
- **Shared libs**: `src/lib/i18n.ts`, `src/lib/content-helpers.ts`

## Subdirectory Map

| Directory | Responsibility | Detailed Map |
|-----------|---------------|--------------|
| `components/layout/` | Header, Footer, SEO, JsonLd, Wordmark, AmbientBlobs | [codemap.md](components/layout/codemap.md) |
| `components/ui/` | Breadcrumbs, FilterBar, ListItem, Tooltip | [codemap.md](components/ui/codemap.md) |
| `components/sections/` | Hero, About, Work, Writing, Contact | [codemap.md](components/sections/codemap.md) |
| `layouts/` | BaseLayout — root HTML shell, theme, lightbox, scripts | [codemap.md](layouts/codemap.md) |
| `lib/` | i18n translations, content-helpers | [codemap.md](lib/codemap.md) |
| `pages/` | DE routes (home, blog, work, 404, RSS) | [codemap.md](pages/codemap.md) |
| `pages/en/` | EN routes (home, blog, work) | [codemap.md](pages/en/codemap.md) |
| `styles/` | Global CSS (Tailwind tokens, fonts, theme, prose, lightbox) | [codemap.md](styles/codemap.md) |