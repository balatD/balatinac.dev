# balatinac.dev — Technical Documentation

## Project Overview

**Domain:** balatinac.dev
**Type:** Personal portfolio website
**Build Tool:** Claude Code
**Goal:** Ultra-performant, statically-rendered portfolio site with pixel-perfect implementation of provided designs, full WCAG 2.2 AA accessibility, and best-in-class SEO.

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Framework | Astro | 6.1 | Static site generation, islands architecture |
| Styling | Tailwind CSS | latest (v4.x via Vite plugin) | Utility-first CSS |
| Language | TypeScript | latest | Type safety for components and content |
| Package Manager | pnpm (recommended) / npm | latest | Dependency management |
| Runtime | Node.js | ≥ 20.x LTS | Build environment |

---

## 1. Project Setup

### 1.1 Initialize Astro 6.1

```bash
# Create project with the exact Astro version
pnpm create astro@6.1 balatinac-dev -- --template minimal --typescript strict --install --git

cd balatinac-dev
```

Pin the version explicitly in `package.json`:

```json
{
  "dependencies": {
    "astro": "6.1.x"
  }
}
```

### 1.2 Add Tailwind CSS

Astro 6.x integrates Tailwind via the official Vite plugin (Tailwind v4 approach):

```bash
pnpm astro add tailwind
```

This will:
- Install `@tailwindcss/vite` and `tailwindcss`
- Register the Vite plugin in `astro.config.mjs`
- Create a global stylesheet entry

`astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://balatinac.dev',
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: 'auto',
  },
  image: {
    // Use the built-in sharp service for optimized images
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
```

`src/styles/global.css`:

```css
@import "tailwindcss";

@theme {
  /* Define design tokens here (colors, fonts, spacing) */
  /* Pulled from /design analysis – see Section 3 */
}
```

Import once in the root layout (see Section 4).

---

## 2. Project Structure

```
balatinac-dev/
├── design/                    # Source design files (Figma exports, mockups)
├── public/                    # Static assets (favicon, robots.txt)
├── src/
│   ├── assets/                # Images processed by Astro (optimized)
│   ├── components/
│   │   ├── ui/                # Atomic components (Button, Badge, Card)
│   │   ├── sections/          # Page sections (Hero, Projects, About, Contact)
│   │   └── layout/            # Header, Footer, Nav, SEO, JsonLd
│   ├── content/               # Content Collections
│   │   ├── projects/          # .md / .mdx project entries
│   │   └── config.ts          # Collection schemas (Zod)
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── projects/
│   │   │   ├── index.astro
│   │   │   └── [...slug].astro
│   │   ├── og/
│   │   │   └── [slug].png.ts  # Dynamic OG image generation
│   │   ├── rss.xml.ts
│   │   └── 404.astro
│   ├── styles/
│   │   └── global.css
│   └── lib/                   # Helpers, types, utils
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

---

## 3. Design → Component Workflow

### 3.1 Design Analysis Phase

Before writing code, instruct Claude Code to analyze `/design`:

1. **Extract design tokens** — colors, typography scale, spacing, radii, shadows → register in `@theme` block of `global.css`.
2. **Identify reusable patterns** — buttons, cards, tags. Promote to `components/ui/`.
3. **Identify page sections** — hero, project grid, about, contact form. Place in `components/sections/`.
4. **Map breakpoints** — confirm mobile, tablet, desktop targets and align with Tailwind's defaults (`sm`, `md`, `lg`, `xl`, `2xl`).

### 3.2 Component Conversion Rules

- **One `.astro` component per discrete UI unit.** No god-components.
- **Use semantic HTML first** (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- **Tailwind utilities only** — no `<style>` blocks unless absolutely necessary (e.g. complex keyframes).
- **Props are typed** with TypeScript interfaces using Astro's `Props` pattern.
- **Responsive-first** — mobile layout is the baseline, desktop via `md:` / `lg:` modifiers.
- **No client JS unless required** — every component is server-rendered to HTML by default.

Example component skeleton:

```astro
---
// src/components/ui/Button.astro
interface Props {
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  class?: string;
}

const { href, variant = 'primary', class: className = '' } = Astro.props;
const Tag = href ? 'a' : 'button';

const styles = {
  primary: 'bg-accent text-bg hover:bg-accent/90',
  secondary: 'border border-fg/20 text-fg hover:bg-fg/5',
  ghost: 'text-fg hover:bg-fg/5',
};
---

<Tag
  href={href}
  class={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${styles[variant]} ${className}`}
>
  <slot />
</Tag>
```

---

## 4. Layouts

### 4.1 BaseLayout

`src/layouts/BaseLayout.astro` is the single root layout. It handles `<head>`, fonts, SEO, and global styles.

```astro
---
import '../styles/global.css';
import Header from '../components/layout/Header.astro';
import Footer from '../components/layout/Footer.astro';
import SEO from '../components/layout/SEO.astro';
import { ClientRouter } from 'astro:transitions';

interface Props {
  title: string;
  description?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedAt?: Date;
  noindex?: boolean;
}

const {
  title,
  description = 'Portfolio of Balatinac — software & design.',
  ogImage,
  ogType,
  publishedAt,
  noindex,
} = Astro.props;
---

<!doctype html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <SEO
      title={title}
      description={description}
      ogImage={ogImage}
      ogType={ogType}
      publishedAt={publishedAt}
      noindex={noindex}
    />

    <!-- Preload critical fonts (woff2, self-hosted) -->
    <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin />

    <!-- RSS -->
    <link rel="alternate" type="application/rss+xml" title="Balatinac RSS" href="/rss.xml" />

    <ClientRouter />

    <meta name="generator" content={Astro.generator} />
  </head>
  <body class="bg-bg text-fg antialiased">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-bg"
    >
      Skip to main content
    </a>
    <Header />
    <main id="main" tabindex="-1"><slot /></main>
    <Footer />
  </body>
</html>
```

### 4.2 Specialized Layouts

- `ProjectLayout.astro` — wraps `BaseLayout`, adds project-specific frontmatter rendering (title, hero image, meta).
- Use Astro's **slot composition** rather than duplicating layouts.

---

## 5. Astro 6.1 Features to Leverage

### 5.1 Content Collections (typed Markdown/MDX)

`src/content/config.ts`:

```ts
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    cover: image(),
    tags: z.array(z.string()),
    year: z.number(),
    url: z.string().url().optional(),
    repo: z.string().url().optional(),
    featured: z.boolean().default(false),
    publishedAt: z.date(),
  }),
});

export const collections = { projects };
```

Render dynamically in `src/pages/projects/[...slug].astro` using `getStaticPaths()`.

### 5.2 Image Optimization (`astro:assets`)

Always use the `<Image />` component for responsive, optimized images:

```astro
---
import { Image } from 'astro:assets';
import cover from '../assets/projects/example.jpg';
---

<Image
  src={cover}
  alt="Project cover"
  widths={[400, 800, 1200, 1600]}
  sizes="(max-width: 768px) 100vw, 50vw"
  format="avif"
  loading="lazy"
  decoding="async"
/>
```

For above-the-fold hero images use `loading="eager"` and `fetchpriority="high"`.

### 5.3 View Transitions

`ClientRouter` is already wired up in `BaseLayout` (Section 4.1). Apply transition names selectively, e.g. on project cards:

```astro
<article transition:name={`project-${slug}`}>
```

### 5.4 Server Islands (selective hydration)

For interactive widgets (theme toggle, contact form validation) only:

```astro
<ThemeToggle client:idle />
<ContactForm client:visible />
```

Default to **zero JavaScript** — only opt in where interactivity is required.

### 5.5 Prefetching

Enable in `astro.config.mjs`:

```js
export default defineConfig({
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
```

### 5.6 Sitemap & RSS

```bash
pnpm astro add sitemap
```

```js
// astro.config.mjs
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: 'https://balatinac.dev',
  integrations: [sitemap()],
});
```

---

## 6. Performance Strategy

The site must score ≥ 95 on all Lighthouse categories. Enforce the following:

### 6.1 Build-time

- **Static output only** (`output: 'static'`, default in Astro 6).
- **Inline critical CSS** via `build.inlineStylesheets: 'auto'`.
- **Tree-shake Tailwind** automatically — Tailwind v4 scans templates at build.
- **Compress HTML** — Astro 6 minifies by default; verify in build output.

### 6.2 Assets

- Self-host fonts as **WOFF2** with `font-display: swap`.
- Limit to **one font family**, max 2 weights (e.g. 400 + 600).
- All raster images go through `astro:assets` → AVIF/WebP with fallbacks.
- SVGs inlined for icons (no icon font, no large icon library).

### 6.3 JavaScript Budget

- **Target ≤ 0 KB JS on the home page** before opting into islands.
- Use `client:idle` or `client:visible`, never `client:load` unless mandatory.
- No client-side analytics SDK — use server-side / edge analytics (e.g. Cloudflare Web Analytics).

### 6.4 Network

- Deploy behind a CDN with HTTP/3 + Brotli (Cloudflare Pages, Netlify, or Vercel Edge).
- Set long `Cache-Control` for hashed assets (`max-age=31536000, immutable`).
- Add a `_headers` file (Cloudflare/Netlify) for security and caching:

```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload

/_astro/*
  Cache-Control: public, max-age=31536000, immutable
```

### 6.5 Core Web Vitals Targets

| Metric | Target |
|--------|--------|
| LCP | < 1.5 s |
| INP | < 100 ms |
| CLS | < 0.05 |
| TTFB | < 200 ms (CDN edge) |
| Total JS (home) | < 5 KB |
| Total CSS (home) | < 15 KB |

---

## 7. Development Workflow with Claude Code

### Recommended Iteration Loop

1. **Scaffold** — Claude Code runs setup commands (Section 1).
2. **Audit `/design`** — Claude Code lists all design files and proposes a token map + component inventory. Approve before coding.
3. **Build tokens** — populate `@theme` in `global.css`.
4. **Build atoms** — `components/ui/` (Button, Tag, Card, Heading).
5. **Build sections** — `components/sections/` consuming atoms.
6. **Compose pages** — `pages/index.astro` etc. wire sections inside `BaseLayout`.
7. **Wire content collections** — migrate project data from design into `src/content/projects/*.md`.
8. **Add interactivity** — only where the design requires it, as islands.
9. **Performance, A11y & SEO pass** — run `pnpm build && pnpm preview`, then Lighthouse + axe + pa11y. Iterate until targets are met.

### Useful Scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "lint": "eslint . --ext .astro,.ts,.tsx",
    "format": "prettier --write \"**/*.{astro,ts,tsx,md,mdx,css}\"",
    "a11y:axe": "axe http://localhost:4321 --exit",
    "a11y:pa11y": "pa11y http://localhost:4321 --standard WCAG2AA",
    "lh": "lighthouse http://localhost:4321 --preset=desktop --view"
  }
}
```

Install dev tooling:

```bash
pnpm add -D prettier prettier-plugin-astro prettier-plugin-tailwindcss \
  eslint eslint-plugin-astro @typescript-eslint/parser \
  @axe-core/cli pa11y lighthouse
```

---

## 8. Deployment

**Recommended:** Cloudflare Pages (free, edge CDN, fast builds).

- Connect Git repo
- Build command: `pnpm build`
- Output directory: `dist`
- Node version: `20`
- Add custom domain `balatinac.dev` + automatic HTTPS

Alternatively: Netlify or Vercel (both work out-of-the-box with Astro 6 static output).

---

## 9. Accessibility (WCAG 2.2 AA)

The site must meet **WCAG 2.2 Level AA** as a baseline. Accessibility is not a post-launch audit — it is enforced at the component level.

### 9.1 Semantic Structure

- **One `<h1>` per page**, hierarchical headings (no skipped levels).
- Use landmark elements: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`.
- Each `<nav>` has a unique `aria-label` (e.g. `"Primary"`, `"Footer"`).
- Lists of items (projects, tags, social links) use `<ul>`/`<li>`, not `<div>` soup.
- Decorative SVGs: `aria-hidden="true"` and `focusable="false"`.
- Meaningful SVGs: `<title>` element + `role="img"` + `aria-labelledby`.

### 9.2 Keyboard & Focus

- Every interactive element reachable via `Tab` in logical DOM order.
- **Visible focus rings** — never `outline: none` without a replacement.
  ```css
  @layer base {
    :focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 2px;
      border-radius: 4px;
    }
  }
  ```
- **Skip link** as the first focusable element in `BaseLayout` (already wired, see Section 4.1).
- No keyboard traps. Modals/menus must close on `Esc` and restore focus to the trigger.

### 9.3 Color & Contrast

- **Text contrast ≥ 4.5:1** (normal), **≥ 3:1** (large ≥ 18.66 px / 24 px bold).
- **Non-text contrast ≥ 3:1** for icons, focus rings, form borders.
- Verify all `@theme` color pairings (text-on-bg, text-on-accent, muted-on-bg) with a contrast checker before merging.
- **Never rely on color alone** — pair status colors with icons or text labels.

### 9.4 Motion & Preferences

Respect user OS settings:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

For Astro view transitions:

```astro
<ClientRouter fallback="none" />
```

…and gate `transition:animate` directives behind reduced-motion checks where appropriate.

### 9.5 Forms (Contact Section)

- Every input has a visible `<label for>` — no placeholder-only labels.
- Required fields marked with both `required` attribute **and** visible indicator.
- Errors announced via `aria-describedby` pointing to the error message, plus `aria-invalid="true"`.
- Live regions (`role="status"` / `aria-live="polite"`) for success/error feedback.
- Group related controls with `<fieldset>` + `<legend>` where applicable.

### 9.6 Images & Media

- Every `<Image />` has a meaningful `alt`. Decorative images: `alt=""`.
- Project covers: alt text describes the *project*, not "image of…".
- No autoplay video. If video is used, provide captions and controls.

### 9.7 Language & Reading

- `<html lang="en">` set explicitly. If sections use other languages, mark with `lang="de"` etc.
- Avoid justified text and ALL CAPS for body copy (use `text-transform: uppercase` visually, keep underlying text mixed-case for screen readers).

### 9.8 Tooling & Verification

Automated checks (scripts already added in Section 7):

```bash
pnpm a11y:axe
pnpm a11y:pa11y
```

Manual verification checklist before each release:
- [ ] Tab through every page end-to-end with keyboard only
- [ ] Test with VoiceOver (macOS) or NVDA (Windows) on home + project detail
- [ ] Zoom to 200% — no horizontal scroll, no clipped content
- [ ] Disable CSS — content order still makes sense

---

## 10. SEO

Goal: full first-page indexability, rich social previews, strong Core Web Vitals signals.

### 10.1 On-Page Fundamentals

Centralize meta tags via a typed `<SEO />` component (already wired into `BaseLayout`):

```astro
---
// src/components/layout/SEO.astro
interface Props {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedAt?: Date;
  noindex?: boolean;
}

const {
  title,
  description,
  ogImage = '/og-default.png',
  ogType = 'website',
  publishedAt,
  noindex = false,
} = Astro.props;

const canonical = new URL(Astro.url.pathname, Astro.site).toString();
const ogImageUrl = new URL(ogImage, Astro.site).toString();
const fullTitle = title === 'Balatinac' ? title : `${title} — Balatinac`;
---

<title>{fullTitle}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />
{noindex && <meta name="robots" content="noindex, nofollow" />}

<!-- Open Graph -->
<meta property="og:type" content={ogType} />
<meta property="og:site_name" content="Balatinac" />
<meta property="og:title" content={fullTitle} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta property="og:image" content={ogImageUrl} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="en_US" />
{publishedAt && <meta property="article:published_time" content={publishedAt.toISOString()} />}

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={fullTitle} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImageUrl} />
```

### 10.2 Structured Data (JSON-LD)

Inject Schema.org markup per page type. Use a `<JsonLd />` helper component:

```astro
---
// src/components/layout/JsonLd.astro
interface Props {
  schema: Record<string, unknown>;
}
const { schema } = Astro.props;
---
<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

**Home page** — `Person` + `WebSite`:

```js
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Balatinac",
  "url": "https://balatinac.dev",
  "jobTitle": "…",
  "sameAs": [
    "https://github.com/…",
    "https://www.linkedin.com/in/…"
  ]
}
```

**Project pages** — `CreativeWork` or `SoftwareSourceCode`:

```js
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "{project.title}",
  "description": "{project.description}",
  "image": "{absolute cover URL}",
  "datePublished": "{ISO date}",
  "author": { "@type": "Person", "name": "Balatinac" },
  "url": "{canonical}"
}
```

Validate with [Google Rich Results Test](https://search.google.com/test/rich-results) and [Schema.org Validator](https://validator.schema.org/).

### 10.3 Dynamic Open Graph Images

Generate per-project OG images at build time using `satori` + `@resvg/resvg-js`:

```bash
pnpm add -D satori @resvg/resvg-js
```

Create `src/pages/og/[slug].png.ts` to emit a 1200×630 PNG per project from a JSX/HTML template. Reference the generated URL in each project's frontmatter.

### 10.4 Sitemap

```bash
pnpm astro add sitemap
```

```js
// astro.config.mjs
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://balatinac.dev',
  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => !page.includes('/draft/'),
    }),
  ],
});
```

### 10.5 robots.txt

`public/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /404

Sitemap: https://balatinac.dev/sitemap-index.xml
```

### 10.6 RSS Feed

```bash
pnpm astro add rss
```

`src/pages/rss.xml.ts`:

```ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const projects = await getCollection('projects');
  return rss({
    title: 'Balatinac — Projects',
    description: 'Latest work and writing.',
    site: context.site,
    items: projects
      .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf())
      .map((p) => ({
        title: p.data.title,
        description: p.data.description,
        pubDate: p.data.publishedAt,
        link: `/projects/${p.slug}/`,
      })),
    customData: `<language>en-us</language>`,
  });
}
```

The `<link rel="alternate" type="application/rss+xml">` tag is already present in `BaseLayout`.

### 10.7 URL & Content Hygiene

- **Lowercase, hyphenated slugs** — `/projects/portfolio-redesign/`.
- **Trailing slashes consistent** — set `trailingSlash: 'always'` (or `'never'`) in `astro.config.mjs` and stick to it.
- **No duplicate content** — `canonical` always set; pagination uses `rel="next"`/`rel="prev"`.
- **Meaningful `<title>` and `<h1>`** per page, both unique across the site.
- **Internal linking** — every project links back to a hub; hub links to all projects.
- **404 page** returns proper status and offers navigation back to main sections.

### 10.8 Performance as SEO

Core Web Vitals are ranking signals — the targets in Section 6.5 (LCP < 1.5 s, INP < 100 ms, CLS < 0.05) directly serve SEO.

### 10.9 Verification

Pre-launch checks:
- [ ] Submit sitemap in Google Search Console + Bing Webmaster Tools
- [ ] Validate all JSON-LD with Rich Results Test
- [ ] Verify OG previews in [opengraph.xyz](https://www.opengraph.xyz/) and X Card Validator
- [ ] Run `lighthouse --preset=desktop` and `--preset=mobile`, SEO score = 100
- [ ] Crawl with Screaming Frog (free up to 500 URLs) — no broken links, no missing meta
- [ ] Verify `hreflang` if/when adding additional languages

---

## 11. Acceptance Criteria

**Performance**
- [ ] Lighthouse Performance ≥ 95 (mobile, throttled)
- [ ] LCP < 1.5 s, INP < 100 ms, CLS < 0.05
- [ ] Zero hydration on home page (or strictly justified islands)
- [ ] Total JS < 5 KB on home, total CSS < 15 KB

**Accessibility**
- [ ] Lighthouse Accessibility = 100
- [ ] axe-core and pa11y report zero violations at WCAG 2.2 AA
- [ ] Full keyboard navigation verified on every page
- [ ] Screen reader pass (VoiceOver or NVDA) on home + project detail
- [ ] All color pairings ≥ 4.5:1 contrast (3:1 for large text and UI)
- [ ] `prefers-reduced-motion` respected

**SEO**
- [ ] Lighthouse SEO = 100
- [ ] Unique `<title>`, `<meta description>`, `<h1>`, canonical per page
- [ ] Open Graph + Twitter cards validated, per-project OG images generated
- [ ] Valid JSON-LD on home (Person/WebSite) and project pages (CreativeWork)
- [ ] `sitemap-index.xml`, `robots.txt`, `rss.xml` reachable and valid
- [ ] Submitted to Google Search Console, no crawl errors

**Engineering**
- [ ] Site passes `astro check` with no TS errors
- [ ] Prettier + ESLint pass in CI
- [ ] Design tokens extracted from `/design` and reflected in Tailwind theme
- [ ] All images served as AVIF/WebP with explicit `width`/`height`
- [ ] Deployed to `balatinac.dev` with HTTPS and security headers (`_headers` file)
