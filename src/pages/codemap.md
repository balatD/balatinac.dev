# src/pages/

## Responsibility
Root-level page routes for the German (default) locale. Entry points for the home page, 404 fallback, and an RSS feed. These files are the outermost routing layer — they compose layout, section components, and content collections into fully rendered HTML pages served at the site root.

## Design Patterns
- **Static prerendering**: Every page exports `prerender = true` for static HTML generation at build time.
- **Layout composition**: All pages use `BaseLayout` as the single root layout wrapper, receiving `title`, `description`, `lang`, and `activeNav` props. Sections (`Hero`, `About`, `Work`, `Writing`, `Contact`) are composed as children via `<slot />`.
- **Islands of interactivity**: Zero client JS on these pages — interactivity (theme toggle, lightbox, mobile menu) lives in `BaseLayout` scripts and is inherited by all pages.
- **i18n via translation map**: The `t()` function from `lib/i18n` resolves all user-facing strings at build time against a key-value map for `de`/`en`.
- **Structured data injection**: Home page renders two `JsonLd` schemas (`Person` and `WebSite`) for SEO. The 404 page is set to `noindex`.
- **RSS as API endpoint**: `rss.xml.ts` is a static endpoint that reads content collections and returns an RSS feed — no route path, pure data.

## Data & Control Flow

### index.astro (Home — German)
1. `t('title.home', 'de')` resolves `"Dragan Balatinac"` as the page title.
2. `BaseLayout` receives `lang="de"`, which triggers `langPrefix('de')` → `''` (root-relative URLs). `hreflang` tags in `<head>` link to `/en` variant.
3. Two `JsonLd` components inject `<script type="application/ld+json">` into the layout `<head>`:
   - `Person` schema with name, URL, jobTitle, sameAs (GitHub, LinkedIn).
   - `WebSite` schema.
4. Five section components (`Hero`, `About`, `Work`, `Writing`, `Contact`) are rendered serially inside `<BaseLayout>`, each receiving `lang="de"`. These sections load their own content from `lib/i18n` translation keys.

### 404.astro
1. Sets `noindex={true}` — no search indexing.
2. Renders a simple section with translated heading, subtext, and three navigation links (`/`, `/work/`, `/blog/`).
3. All text resolved via `t()` with `lang="de"`.

### rss.xml.ts
1. `GET()` fetches all entries from two content collections: `blog` and `projects`.
2. Filters out draft blog posts. Sorts each collection by `publishedAt` descending.
3. Merges both lists and re-sorts chronologically.
4. Returns RSS 2.0 XML via `@astrojs/rss` with title, description, site URL, and merged items.
5. Collection IDs become URL path segments: `/blog/{id}/` and `/work/{id}/`.

## Integration Points
| Dependency | Role | Direction |
|---|---|---|
| `layouts/BaseLayout.astro` | Root HTML shell — `<head>`, `<body>`, Header, Footer, theme, lightbox | Consumed by all pages |
| `components/layout/JsonLd.astro` | Injects structured data JSON-LD | Used by `index.astro` |
| `components/sections/Hero.astro` | Hero section content | Used by `index.astro` |
| `components/sections/About.astro` | About section content | Used by `index.astro` |
| `components/sections/Work.astro` | Work preview section | Used by `index.astro` |
| `components/sections/Writing.astro` | Writing preview section | Used by `index.astro` |
| `components/sections/Contact.astro` | Contact section content | Used by `index.astro` |
| `lib/i18n.ts` | Translation function `t()` and `Lang` type | Consumed by all pages |
| `astro:content` (`getCollection`) | Fetches `blog` and `projects` collections | Used by `rss.xml.ts` |
| `@astrojs/rss` | RSS XML generation | Used by `rss.xml.ts` |
| `@astrojs/sitemap` (config) | Auto-generates sitemap from all routes | Integration in `astro.config.mjs` |
| Consumers: `pages/blog/`, `pages/work/`, `pages/en/` (sibling/deep routes) | Delegate detail/index routes | These pages handle sub-path routing |
