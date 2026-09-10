# balatinac.dev — Project Guide

## Overview

**Domain:** balatinac.dev  
**Type:** Personal portfolio website (bilingual DE/EN)  
**Goal:** Ultra-performant, statically-rendered portfolio with WCAG 2.2 AA accessibility and best-in-class SEO.

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Framework | Astro | 7.3 | Static site generation, islands architecture |
| Styling | Tailwind CSS | v4.x (via Vite plugin) | Utility-first CSS |
| Language | TypeScript | latest | Type safety for components and content |
| Package Manager | pnpm (recommended) / npm | latest | Dependency management |
| Runtime | Node.js | ≥ 22.12.0 | Build environment |
| Deploy | Cloudflare Pages | — | Edge CDN, free hosting |

> **Shell setup required:** The default shell (zsh) doesn't have Node/npm on PATH. Before running `npm` or `pnpm` commands, switch to fish shell and activate Node: `fish && nvm use latest`. Alternatively, prefix commands: `fish -c 'nvm use latest && npm run build'`.

---

## Architecture

### Key Decisions

1. **No `client:*` directives** — zero hydration; all interactivity is vanilla `<script>` blocks in BaseLayout
2. **CSS-variable theming** — `:root` / `:root[data-theme="dark"]` with `@theme` bridge to Tailwind. No `dark:` variant.
3. **Bilingual content** — DE at root (`/`), EN under `/en/`. Separate content collections per language (`blog` / `blogDe`, `projects` / `projectsDe`). German posts use `urlSlug` in frontmatter for clean URLs.
4. **View Transitions API** — circular reveal for theme toggle (clip-path animation), fade+scale for page navigation. Safari gets a fast crossfade instead.
5. **Lightbox via `<dialog>`** — native focus trap, Esc to close, scroll lock via `body.lightbox-open` class.
6. **Clone-and-replace event rebinding** — buttons are cloned before adding listeners to survive Astro view transitions.

### Color Palette

| Token | Light | Dark |
|-------|-------|------|
| `--bg` | `#f4f2ec` | `#0e0e0e` |
| `--fg` | `#111` | `#ececec` |
| `--muted` | `#6f6c66` | `#9a9892` |
| `--rule` | `#e3e0d8` | `#1f1f1f` |
| `--accent` | `#ff4500` | `#ff5a1a` |

Fonts: **Space Grotesk** (sans) + **Space Mono** (mono), self-hosted WOFF2.

### Project Structure

```
src/
├── components/
│   ├── layout/       # Header, Footer, SEO, JsonLd, Wordmark, AmbientBlobs
│   ├── sections/     # Hero, About, Work, Writing, Contact
│   └── ui/           # Breadcrumbs, FilterBar, ListItem, Tooltip
├── content/
│   ├── blog/         # EN blog posts (.md)
│   ├── blog/de/      # DE blog posts (.md)
│   ├── projects/     # EN project entries (.md)
│   └── projects/de/  # DE project entries (.md)
├── layouts/
│   └── BaseLayout.astro  # Single root layout — head, fonts, SEO, theme, lightbox, scripts
├── lib/
│   ├── i18n.ts           # t(key, lang), langPrefix(), langSwitchUrl()
│   └── content-helpers.ts # buildDeMap(), getLocalizedEntry(), getDeSlug()
├── pages/
│   ├── index.astro       # DE home
│   ├── blog/             # DE blog index + [post] detail
│   ├── work/             # DE work index + [post] detail
│   ├── en/               # EN routes (home, blog, work)
│   ├── 404.astro
│   └── rss.xml.ts
├── styles/
│   └── global.css         # Tailwind @theme, fonts, CSS vars, prose, lightbox, animations
└── content.config.ts      # Zod schemas for all 4 collections
```

---

## Content Collections

Four collections defined in `src/content.config.ts`:

| Collection | Pattern | Key Fields |
|------------|---------|-------------|
| `blog` | `*.md` in `content/blog/` | title, description, tags, publishedAt, readTime?, draft |
| `blogDe` | `de/*.md` in `content/blog/` | same + `urlSlug` (overrides URL path) |
| `projects` | `*.md` in `content/projects/` | title, description, tags, year, order, featured, publishedAt, meta? |
| `projectsDe` | `de/*.md` in `content/projects/` | same + `urlSlug` |

Blog post frontmatter example (EN):
```yaml
title: "Post title"
description: "Short description for listing and SEO."
tags: ["tag1", "tag2"]
publishedAt: 2026-05-05
readTime: "~8 min"
draft: false
```

Blog post frontmatter example (DE):
```yaml
title: "Deutscher Titel"
description: "Kurze Beschreibung."
urlSlug: "deutscher-slug"  # Required for clean DE URLs
tags: ["tag1", "tag2"]
publishedAt: 2026-05-05
readTime: "~8 Min."
draft: false
```

---

## Interactivity

All JS is vanilla `<script>` in `BaseLayout.astro`, using `astro:page-load` and `astro:after-swap` events:

| Feature | Mechanism |
|---------|-----------|
| Theme toggle | `data-theme` attribute on `<html>`, View Transitions API circular reveal (crossfade on Safari) |
| Mobile menu | `data-open` attribute on `#mobile-menu`, max-height transition |
| Lightbox | `<dialog id="lightbox">`, scroll lock via `body.lightbox-open`, focus trap, `aria-describedby` |
| Tag filter | `FilterBar.astro` inline `<script>`, hides/shows `.filter-item` elements |
| Tooltip | `clampTooltip()` positions `.tooltip-bubble` within viewport |

---

## Performance Targets

| Metric | Target |
|--------|--------|
| LCP | < 1.5 s |
| INP | < 100 ms |
| CLS | < 0.05 |
| Total JS (home) | < 5 KB |
| Total CSS (home) | < 15 KB |

---

## Accessibility (WCAG 2.2 AA)

- One `<h1>` per page, hierarchical headings
- Landmark elements (`<header>`, `<nav>`, `<main>`, `<footer>`) with unique `aria-label`
- Skip link as first focusable element
- `:focus-visible` rings using `var(--accent)` color
- `prefers-reduced-motion: reduce` kills all animations and transitions
- Lightbox: `<dialog>` for native focus trap, `role="button"` + `tabindex="0"` on images, keyboard activation (Enter/Space)
- Color contrast ≥ 4.5:1 for text, ≥ 3:1 for non-text

---

## SEO

- `<SEO />` component in BaseLayout: title, description, canonical, OG, Twitter cards
- `<JsonLd />` component for structured data (Person, BlogPosting, CreativeWork)
- `hreflang` alternates for DE/EN
- Sitemap via `@astrojs/sitemap`
- RSS feed at `/rss.xml`
- `robots.txt` and `_headers` in `public/`

---

## Deployment

**Cloudflare Pages** via `@astrojs/cloudflare` adapter.

- Build command: `astro build`
- Output: static HTML + `_routes.json` for Cloudflare
- `_headers` file sets security headers and cache policy
- `trailingSlash: 'always'` in Astro config

---

## Acceptance Criteria

**Performance**
- [ ] Lighthouse Performance ≥ 95 (mobile, throttled)
- [ ] LCP < 1.5 s, INP < 100 ms, CLS < 0.05
- [ ] Zero hydration on home page
- [ ] Total JS < 5 KB on home, total CSS < 15 KB

**Accessibility**
- [ ] Lighthouse Accessibility = 100
- [ ] Full keyboard navigation on every page
- [ ] Screen reader pass (VoiceOver) on home + blog detail
- [ ] All color pairings ≥ 4.5:1 contrast
- [ ] `prefers-reduced-motion` respected

**SEO**
- [ ] Lighthouse SEO = 100
- [ ] Unique `<title>`, `<meta description>`, `<h1>`, canonical per page
- [ ] Open Graph + Twitter cards validated
- [ ] Valid JSON-LD on all pages
- [ ] `sitemap-index.xml`, `robots.txt`, `rss.xml` reachable

**Engineering**
- [ ] `astro check` passes with no TS errors
- [ ] All images have meaningful `alt` text
- [ ] Deployed to `balatinac.dev` with HTTPS and security headers

## Repository Map

A full codemap is available at `codemap.md` in the project root.

Before working on any task, read `codemap.md` to understand:
- Project architecture and entry points
- Directory responsibilities and design patterns
- Data flow and integration points between modules

For deep work on a specific folder, also read that folder's `codemap.md`.
