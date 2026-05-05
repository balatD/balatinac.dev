# src/pages/work/

## Responsibility
German (default) locale work/project routes — list and detail views for case studies. The index at `/work/` renders a filterable list of projects sorted by custom `order`. The dynamic route `[post].astro` handles individual project rendering with i18n content resolution.

## Design Patterns
- **Content Collection-driven**: Both files query `astro:content` collections (`projects` for English entries, `projectsDe` for German translations). English entries are the canonical source.
- **Static path generation**: `[post].astro` uses `getStaticPaths()` to generate one page per English project entry, resolving the German slug from `projectsDe`.
- **i18n fallback chain**: German entries preferred; English entries serve as fallback for title, description, meta fields (duration, role, team, status).
- **Custom ordering**: Projects are sorted by `data.order` (numeric ascending), unlike blog posts which sort by date descending.
- **Sequential navigation**: Detail pages include sequential pagination ("Next project") based on `order` — unlike the blog which uses date-based ordering.
- **FilterBar integration**: Same pattern as blog — `FilterBar` with hardcoded tags, `data-tags` on `<li>` elements for client-side filtering.
- **Meta bar**: Detail page renders a metadata section (year, duration, role, team, status) from `project.data.meta` — conditionally rendered only if `meta` exists.
- **Case study labeling**: Header shows "Case study · 01 / 04" format with zero-padded ordering.

## Data & Control Flow

### work/index.astro
1. Fetches `projects` (English) and `projectsDe` (German) collections.
2. Sorts English entries by `data.order` ascending.
3. Builds `deMap` via `buildDeMap(deProjects)`.
4. Renders `FilterBar` with tags `['TYPO3', 'PHP', 'DevOps', 'API']`.
5. Iterates sorted entries; for each:
   - Calls `getLocalizedEntry(project, deMap, 'de')` for German `{ title, description, slug }`.
   - Falls back to English values if no German entry.
   - Links to `/work/{slug}/` using resolved German slug.
   - Displays year (not date) as a secondary column.

### work/[post].astro
1. `getStaticPaths()`:
   - Fetches `projects` and `projectsDe`.
   - Builds `deMap`.
   - For each English project, resolves `deSlug` from the German entry (or falls back to ID).
   - Returns `{ params: { post: deSlug }, props: { project } }`.
2. On render:
   - Re-fetches collections to compute navigation.
   - Resolves `contentEntry = de || project` — prefers German for `render()`.
   - Computes `nextProject` by order index + 1.
   - Computes `orderStr` (zero-padded) and `totalStr` for the "N / M" case study label.
   - Computes `altLangUrl = /en/work/{project.id}/` for hreflang.
3. Renders:
   - `JsonLd` with `CreativeWork` schema.
   - `Breadcrumbs` (Home → Work → Title).
   - Header with case study label, title, and description.
   - Meta section (year, duration, role, team, status) — only if `meta` exists.
   - Article body via `<Content />` with `.prose-article` scoped styles.
   - Navigation: "Next project" link with order label.

## Integration Points
| Dependency | Role | Direction |
|---|---|---|
| `layouts/BaseLayout.astro` | Root HTML shell — inherits Header, Footer, SEO, theme | Consumed by both files |
| `components/ui/Breadcrumbs.astro` | Renders breadcrumb navigation | Used by both files |
| `components/ui/FilterBar.astro` | Tag-based filter UI for the list | Used by `index.astro` |
| `components/layout/JsonLd.astro` | CreativeWork structured data | Used by `[post].astro` |
| `lib/i18n.ts` | `t()` for all UI strings, `Lang` type | Consumed by both files |
| `lib/content-helpers.ts` | `buildDeMap()`, `getLocalizedEntry()`, `getDeSlug()` | Core i18n content resolution helpers |
| `astro:content` (`getCollection`, `render`) | Fetches `projects` + `projectsDe` collections, renders MDX | Core data source |
| Consumers: `pages/en/work/` (sibling EN locale) | Shares same content collections, different slug resolution | Mirror routes |
