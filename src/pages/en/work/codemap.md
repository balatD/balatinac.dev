# src/pages/en/work/

## Responsibility
English locale work/project routes — list and detail views served at `/en/work/` and `/en/work/{id}/`. Mirrors the German `pages/work/` structure with simpler slug resolution (English IDs) and no German meta fallback on the detail page.

## Design Patterns
- **Content Collection-driven**: Same `projects` collection as German routes. Detail page renders English entries directly without German fallback.
- **Simpler static paths**: `[post].astro` `getStaticPaths()` maps each English project by ID — no German slug resolution for routing.
- **Direct rendering**: `render(project)` with no `de || project` fallback check — the English entry is always the source of truth on the detail view.
- **Custom ordering**: Same `data.order` ascending sort as German routes.
- **Sequential navigation**: Detail page computes `nextProject` by order index + 1.
- **Meta rendering**: Meta section only if `project.data.meta` exists — no `de?.data.meta || project.data.meta` fallback chain (simpler than the German variant).
- **i18n — list still queries both collections**: Index page fetches `projectsDe` and builds `deMap`, but `getLocalizedEntry` with `lang='en'` returns English values — the DE data is fetched but unused for display (used only for altLangUrl resolution).
- **Cross-linking**: `altLangUrl` on the detail page points to `/work/{deSlug}/` for German hreflang.

## Data & Control Flow

### en/work/index.astro
1. Fetches `projects` and `projectsDe`.
2. Sorts by `data.order` ascending.
3. Builds `deMap`.
4. Renders `FilterBar` + list of projects.
5. Each project links to `/en/work/{project.id}/` (English ID as slug).

### en/work/[post].astro
1. `getStaticPaths()`: Maps each English entry directly — `params: { post: project.id }`, `props: { project }`.
2. On render:
   - Renders `project` directly with `render(project)`.
   - Fetches `projectsDe` to resolve `deSlug` for `altLangUrl`.
   - Computes `nextProject` by order index + 1.
   - Computes `orderStr` / `totalStr` for case study label.
   - `altLangUrl = /work/{deSlug}/`.
3. Renders:
   - `JsonLd` with `CreativeWork` schema.
   - `Breadcrumbs` (Home → Work → Title).
   - Header with case study label + title + description.
   - Meta section — only English `project.data.meta` fields (no DE fallback).
   - Article body via `<Content />`.
   - Navigation: "Next project" link.

## Integration Points
| Dependency | Role | Direction |
|---|---|---|
| `layouts/BaseLayout.astro` | Root HTML shell | Consumed by both files |
| `components/ui/Breadcrumbs.astro` | Breadcrumb navigation | Used by both files |
| `components/ui/FilterBar.astro` | Tag-based filter | Used by `index.astro` |
| `components/layout/JsonLd.astro` | CreativeWork schema | Used by `[post].astro` |
| `lib/i18n.ts` | `t()` for UI strings | Consumed by both files |
| `lib/content-helpers.ts` | `buildDeMap()`, `getLocalizedEntry()`, `getDeSlug()` | Used for DE slug resolution (altLangUrl) |
| `astro:content` (`getCollection`, `render`) | Fetches `projects`, renders MDX | Core data source |
| Consumer: `pages/work/` (DE locale) | Shares `projects` collection, different slug resolution | Sibling mirror route |
