# Repository Atlas: balatinac.dev

## Project Responsibility
Ultra-performant, statically-rendered personal portfolio website for Dragan Balatinac — a TYPO3/PHP backend developer from NRW, Germany. Built with Astro 6.1, Tailwind CSS v4, and TypeScript. Deployed to Cloudflare Pages. Bilingual (DE/EN) with zero client-side JavaScript by default (only vanilla scripts for theme toggle, mobile menu, lightbox, and tag filtering).

## System Entry Points
- `astro.config.mjs` — Astro configuration: site URL, Tailwind v4 Vite plugin, Cloudflare adapter, sitemap, Shiki dual-theme, prefetching
- `package.json` — Dependencies: Astro 6.1, @astrojs/cloudflare, @astrojs/rss, @astrojs/sitemap, @tailwindcss/vite, tailwindcss 4.x
- `src/pages/index.astro` — DE homepage (root `/`)
- `src/pages/en/index.astro` — EN homepage (`/en/`)

## Architecture Overview
- **Static output** — all pages pre-rendered at build time, zero server runtime
- **CSS-variable theming** — `:root` / `:root[data-theme="dark"]` with Tailwind `@theme` bridge
- **View Transitions API** — circular reveal for theme toggle, fade+scale for page navigation
- **Content Collections** — Zod-validated Markdown for blog (EN + DE) and projects (EN + DE)
- **i18n** — DE at root (`/`), EN under `/en/`, with `hreflang` alternates and `lang` attribute
- **No framework islands** — all interactivity is vanilla `<script>` blocks using `astro:page-load` / `astro:after-swap`

## Directory Map (Aggregated)

| Directory | Responsibility Summary | Detailed Map |
|-----------|------------------------|--------------|
| `src/components/layout/` | Structural shell: Header, Footer, SEO, JsonLd, Wordmark, AmbientBlobs | [View Map](src/components/layout/codemap.md) |
| `src/components/ui/` | Atomic primitives: Breadcrumbs, FilterBar, ListItem, Tooltip | [View Map](src/components/ui/codemap.md) |
| `src/components/sections/` | Homepage content blocks: Hero, About, Work, Writing, Contact | [View Map](src/components/sections/codemap.md) |
| `src/layouts/` | Single root layout (BaseLayout) — head, fonts, SEO, theme init, lightbox, scripts | [View Map](src/layouts/codemap.md) |
| `src/lib/` | Shared utilities: i18n translations + helpers, content-helpers (DE/EN map builders) | [View Map](src/lib/codemap.md) |
| `src/pages/` | DE routes: home, blog index/detail, work index/detail, 404, RSS | [View Map](src/pages/codemap.md) |
| `src/pages/en/` | EN routes: home, blog index/detail, work index/detail | [View Map](src/pages/en/codemap.md) |
| `src/pages/blog/` | DE blog: index + [post] detail with i18n fallback | [View Map](src/pages/blog/codemap.md) |
| `src/pages/work/` | DE work: index + [post] detail with custom ordering | [View Map](src/pages/work/codemap.md) |
| `src/styles/` | Global CSS: Tailwind v4 @theme tokens, fonts, theme vars, prose, lightbox, animations | [View Map](src/styles/codemap.md) |
| `src/content/` | Markdown content: blog posts (EN + DE), project entries (EN + DE) | Content only, no codemap |
| `src/content.config.ts` | Zod schemas for blog, blogDe, projects, projectsDe collections | See `src/lib/codemap.md` |

## Key Design Decisions
1. **No `client:*` directives** — zero hydration; all JS is vanilla `<script>` in BaseLayout
2. **CSS variables for theming** — not Tailwind `dark:` variant; `data-theme` attribute on `<html>`
3. **Separate collections per language** — `blog` (EN) and `blogDe` (DE) with `urlSlug` override for DE URLs
4. **Clone-and-replace event rebinding** — buttons are cloned before adding listeners to survive Astro view transitions
5. **Lightbox via `<dialog>`** — native focus trap, Esc to close, scroll lock via `body.lightbox-open` class