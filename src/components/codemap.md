# src/components/

## Responsibility
Central component registry for the entire Astro site. All reusable UI is organized into three subdirectories by architectural role: `layout/` (page shell and chrome), `sections/` (homepage content regions), and `ui/` (atomic primitives shared across pages). Together they form a three-tier component hierarchy that enforces separation of concerns: structure → content → presentation.

## Design Patterns
- **Three-tier composability**: Components flow top-down: `layout/` components wrap page output, `sections/` components are the primary content blocks rendered into layouts, and `ui/` components are the smallest reusable elements used by sections and pages. No component crosses tiers upward (e.g., `ui/` never imports `sections/`).
- **Server-only by default**: Of all 15 components across the three directories, only `FilterBar` (ui/) and the inline scripts in `BaseLayout` contain client-side JavaScript. Every other component renders to static HTML at build time. This aligns with the project's ≤5 KB JS budget target.
- **Content Collections as data source**: `sections/Work.astro` and `sections/Writing.astro` fetch data at build time via `getCollection()` from `astro:content`. They are the only components with direct data-fetching dependencies — all other components receive data exclusively through props.
- **i18n via prop injection**: All components accept a `lang: Lang` prop (defaulting to `'de'`). Translation lookup (`t()`) happens at the component level, keeping translation concerns local rather than centralized in layouts. URLs are language-prefixed via `langPrefix()`.
- **Shared dependency on `../../lib`**: All components that need i18n depend on `../../lib/i18n` for string lookup (`t()`), prefix generation (`langPrefix()`), and language switch URLs (`langSwitchUrl()`). `Work` and `Writing` additionally depend on `../../lib/content-helpers` for bilingual content resolution.
- **No cross-directory imports within `components/`**: Sections do not import from `ui/` for list items (they inline their own markup). Layout does not import from `ui/` or `sections/`. The three subdirectories are independent of each other — all composition happens in `BaseLayout.astro` (which imports from `layout/`) and page files (which import from `sections/` and `ui/`).

## Data & Control Flow

```
Page (.astro in pages/)
  │
  ├── BaseLayout.astro
  │     ├── layout/AmbientBlobs     (no props, decorative)
  │     ├── layout/Wordmark          (legacy stub)
  │     ├── layout/Header            (props: lang, activeNav, altLangUrl)
  │     ├── layout/SEO               (props: title, description, ogImage, ...)
  │     └── layout/Footer            (props: lang)
  │
  ├── sections/Hero                  (props: lang)
  ├── sections/About                 (props: lang)
  ├── sections/Work                  (props: lang) → getCollection('projects') + getCollection('projectsDe')
  ├── sections/Writing               (props: lang) → getCollection('blog') + getCollection('blogDe')
  ├── sections/Contact               (props: lang)
  │
  └── ui/Breadcrumbs                 (props: items)
      ui/FilterBar                   (props: tags, total) + client-side filtering
      ui/ListItem                    (props: href, title, description, meta, tags, draft)
      ui/Tooltip                     (props: de, en, lang, class)
```

Data enters the system through:
1. **Content Collections** (`astro:content`) → `sections/Work` and `sections/Writing`
2. **i18n translation maps** (`../../lib/i18n`) → all components via `t()` and `langPrefix()`
3. **Page props** (Astro frontmatter in page files) → passed down through `BaseLayout`, sections, and UI components
4. **Inline script DOM reads** (ui/FilterBar, BaseLayout theme/menu/lightbox) → client-side only, no server data flow

## Integration Points
- **Depends on**:
  - `../../lib/i18n` — used by all components in `layout/` and `sections/`, plus `ui/Tooltip`.
  - `../../lib/content-helpers` — used by `sections/Work` and `sections/Writing`.
  - `astro:content` (`getCollection`) — used by `sections/Work` and `sections/Writing`.
  - `astro:transitions` (`ClientRouter`) — used by `BaseLayout.astro` (imports from `layout/`).
  - `src/styles/global.css` — imported by `BaseLayout`, defines all theme tokens consumed by components via Tailwind utilities and CSS custom properties (`--fg`, `--accent`, `--muted`, `--rule`, `--bg`).
- **Consumed by**:
  - `src/layouts/BaseLayout.astro` — imports all `layout/` components.
  - `src/pages/index.astro` — imports all `sections/` components.
  - `src/pages/work/index.astro` — imports `ui/Breadcrumbs`, `ui/FilterBar`, `ui/ListItem` + sections for archive layouts.
  - `src/pages/blog/[...slug].astro` — imports `ui/Breadcrumbs`, `ui/ListItem` for post listing.
  - Project/blog detail pages — may import `ui/Tooltip`, `layout/JsonLd`, `layout/SEO` directly.
- **External consumers**: Any future page or layout added to `src/pages/` or `src/layouts/` can import from any of the three subdirectories as needed, following the same prop-based composition pattern.

## Component Inventory

| Path | Type | Client JS | Data Source |
|------|------|-----------|-------------|
| `layout/AmbientBlobs` | decorative | none | none |
| `layout/Wordmark` | legacy stub | none | none |
| `layout/Header` | navigation shell | none (via BaseLayout) | i18n + props |
| `layout/Footer` | footer | none | i18n + props |
| `layout/SEO` | head metadata | none | props |
| `layout/JsonLd` | structured data | none | props |
| `sections/Hero` | homepage hero | none | i18n |
| `sections/About` | bio section | none | i18n |
| `sections/Work` | project list (max 4) | none | Content Collections |
| `sections/Writing` | blog list (max 4) | none | Content Collections |
| `sections/Contact` | contact links | none | i18n |
| `ui/Breadcrumbs` | nav trail | none | props |
| `ui/FilterBar` | tag filter | yes (astro:page-load) | props |
| `ui/ListItem` | list item tile | none | props |
| `ui/Tooltip` | hover tooltip | none (via BaseLayout) | i18n + props |
