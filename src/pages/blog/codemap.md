# src/pages/blog/

## Responsibility
German (default) locale blog routes — list and detail views for blog posts. The index at `/blog/` renders a filterable list of all posts. The dynamic route `[post].astro` handles individual post rendering, including i18n content resolution and cross-linking to the English variant.

## Design Patterns
- **Content Collection-driven**: Both files query `astro:content` collections (`blog` for English entries, `blogDe` for German translations). The English collection is the canonical source; German entries are looked up by ID via a `buildDeMap()`.
- **Static path generation**: `[post].astro` uses `getStaticPaths()` to generate one page per English blog entry, resolving the German slug from `blogDe`. This produces paths like `/blog/warum-astro-nicht-typo3/` for German visitors.
- **i18n fallback**: On detail pages, the German entry is preferred; if absent, the English entry renders directly. Titles, descriptions, read times, and slugs fall back through this chain.
- **FilterBar + client-side filtering**: The index page renders a `FilterBar` with hardcoded tags and a `<ul id="list">`. FilterBar attaches a click handler to filter `<li>` elements by `data-tags` attribute.
- **Empty state**: If no posts exist, a centered message replaces the list.
- **Pagination via next-post**: The detail page computes `nextPost` by finding the current index in the sorted English list and linking to the next entry (with German slug resolution).
- **Breadcrumbs**: Both pages render `Breadcrumbs` for navigation context.

## Data & Control Flow

### blog/index.astro
1. Fetches `blog` (English) and `blogDe` (German) collections at the top level.
2. Sorts English entries by `publishedAt` descending.
3. Builds a `Map<englishId, germanEntry>` via `buildDeMap(dePosts)`.
4. Renders `FilterBar` with tags `['TYPO3', 'PHP', 'DevOps', 'Tooling']`.
5. Iterates `sorted` entries; for each:
   - Calls `getLocalizedEntry(post, deMap, 'de')` to get the German `{ title, description, slug }`.
   - If no German entry exists, falls back to English values.
   - Formats date using `en-US` locale (shared format for both languages).
   - Renders each post as a `<li>` with `data-tags` attribute for FilterBar JS.
   - Links to `/blog/{slug}/` using the resolved German slug.

### blog/[post].astro
1. `getStaticPaths()`:
   - Fetches `blog` and `blogDe`.
   - Builds `deMap`.
   - For each English post, resolves `deSlug` from the German entry (or falls back to English ID).
   - Returns `{ params: { post: deSlug }, props: { post, deSlug } }`.
2. On render:
   - Re-fetches collections to compute navigation (sibling order).
   - Resolves `contentEntry = de || post` — prefers German entry for `render()`.
   - Calls `render(contentEntry)` — Astro's content rendering pipeline (MDX → HTML).
   - Displays German title/description/readTime if available, else English.
   - Computes `nextPost` from the sorted English list (ordered by `publishedAt` descending).
   - Computes `altLangUrl = /en/blog/{post.id}/` for hreflang switching.
3. Renders:
   - `JsonLd` with `BlogPosting` schema.
   - `Breadcrumbs` (Home → Writing → Post title).
   - Header with date, read time, and title.
   - Meta bar with tags rendered as `#tag` spans.
   - Article body via `<Content />` with `.prose-article` scoped styles.
   - Navigation block: "All posts" link + optional "Next post" link.

## Integration Points
| Dependency | Role | Direction |
|---|---|---|
| `layouts/BaseLayout.astro` | Root HTML shell — inherits Header, Footer, SEO, theme | Consumed by both files |
| `components/ui/Breadcrumbs.astro` | Renders breadcrumb navigation | Used by both files |
| `components/ui/FilterBar.astro` | Tag-based filter UI for the list | Used by `index.astro` |
| `components/layout/JsonLd.astro` | BlogPosting structured data | Used by `[post].astro` |
| `lib/i18n.ts` | `t()` for all UI strings, `Lang` type | Consumed by both files |
| `lib/content-helpers.ts` | `buildDeMap()`, `getLocalizedEntry()`, `getDeSlug()` | Core i18n content resolution helpers |
| `astro:content` (`getCollection`, `render`) | Fetches `blog` + `blogDe` collections, renders MDX | Core data source |
| Consumers: `pages/en/blog/` (sibling EN locale) | Shares same content collections, different slug resolution | Mirror routes |
