# src/pages/en/blog/

## Responsibility
English locale blog routes — list and detail views served at `/en/blog/` and `/en/blog/{id}/`. Mirrors the German `pages/blog/` structure with key differences: simpler slug resolution (uses English ID directly), no German content fallback on the detail view, and `altLangUrl` pointing to the German slug.

## Design Patterns
- **Content Collection-driven**: Same `blog` collection as the German routes, but queried directly without German fallback on the detail page.
- **Simpler static paths**: `[post].astro` `getStaticPaths()` maps English posts directly — no German slug resolution needed. Props pass only `post` (not `deSlug`).
- **i18n fallback — list only**: The index page still queries `blogDe` and passes it to `getLocalizedEntry()`, but since `lang='en'`, it always returns English values (the `de` branch is skipped). This is consistent but redundant — the German map is built but not used for display.
- **Sequential navigation**: Detail page computes `nextPost` by date-sorted index, linking to `/en/blog/{nextPost.id}/`.
- **FilterBar**: Same pattern with tags `['TYPO3', 'PHP', 'DevOps', 'Tooling']`.
- **Cross-linking**: `altLangUrl` on the detail page points to `/blog/{deSlug}/` for German hreflang.

## Data & Control Flow

### en/blog/index.astro
1. Fetches `blog` and `blogDe`.
2. Sorts by `publishedAt` descending.
3. Builds `deMap` (built but unused for display — `getLocalizedEntry` with `lang='en'` returns English).
4. Renders `FilterBar` + list of posts.
5. Each post links to `/en/blog/{post.id}/` (English ID as slug).
6. Date formatted with `en-US` locale.

### en/blog/[post].astro
1. `getStaticPaths()`: Maps each English entry directly — `params: { post: post.id }`, `props: { post }`.
2. On render:
   - Renders `post` directly (no German fallback content).
   - Fetches `blogDe` to resolve `deSlug` for `altLangUrl`.
   - Computes `nextPost` from sorted English list.
   - `altLangUrl = /blog/{deSlug}/`.
3. Renders:
   - `JsonLd` with `BlogPosting` schema.
   - `Breadcrumbs` (Home → Writing → Title).
   - Header, meta bar (date, read time, tags), article body.
   - Navigation: "All posts" + optional "Next post" link.

## Integration Points
| Dependency | Role | Direction |
|---|---|---|
| `layouts/BaseLayout.astro` | Root HTML shell | Consumed by both files |
| `components/ui/Breadcrumbs.astro` | Breadcrumb navigation | Used by both files |
| `components/ui/FilterBar.astro` | Tag-based filter | Used by `index.astro` |
| `components/layout/JsonLd.astro` | BlogPosting schema | Used by `[post].astro` |
| `lib/i18n.ts` | `t()` for UI strings | Consumed by both files |
| `lib/content-helpers.ts` | `buildDeMap()`, `getLocalizedEntry()`, `getDeSlug()` | Used for DE slug resolution (altLangUrl) |
| `astro:content` (`getCollection`, `render`) | Fetches `blog`, renders MDX | Core data source |
| Consumer: `pages/blog/` (DE locale) | Shares `blog` collection, different slug resolution | Sibling mirror route |
