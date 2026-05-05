# src/components/ui/

## Responsibility
Provides reusable, presentational "atomic" UI components with no page-level logic. These components are shared across multiple pages and sections. Each encapsulates a single interaction pattern (breadcrumb navigation, tag filtering, list item display, tooltip) with typed props and zero or minimal client scripting. They serve as the design system's primitive building blocks.

## Design Patterns
- **Server-first with targeted client islands**: `Breadcrumbs`, `ListItem`, and `Tooltip` are fully static (server-rendered). `FilterBar` includes an inline `<script>` with a `data-filters`-based client-side filter mechanism that runs on `astro:page-load` — this is the only component in `ui/` with client JS. No `client:*` directives are used; the script runs globally via event delegation.
- **Typed props with defaults**: Every component declares a `Props` interface. `ListItem` accepts `tags?: string` (comma-separated) and `draft?: boolean` (renders a "Draft" badge). `Tooltip` accepts `de: string` and `en: string` for bilingual tooltip content, plus `lang: Lang` to select which to display.
- **Generic data display pattern**: `ListItem` is a generic tile used by both `Work.astro` and `Writing.astro` (and potentially project/blog listing pages). It renders a two-column grid (title + description | meta) with hover transitions and optional draft badge.
- **Hooks-based filtering**: `FilterBar` uses `data-*` attributes for DOM-based state: `data-tag` on filter buttons, `data-on` for active state, `data-tags` on `<li>` items. The inline `initFilters()` function reads these attributes, applies hide/show on matching items, and updates a count display. This avoids any framework or reactive state library.
- **Language-adaptive tooltip**: `Tooltip` selects between `de`/`en` strings at render time based on `lang` prop, rendering a `data-tooltip` attribute and an absolutely-positioned bubble. CSS handles the visual reveal on hover/focus.
- **Breadcrumb tail rendering**: `Breadcrumbs` maps over an `items: BreadcrumbItem[]` array, rendering each crumb as a link (if `href` is present) or plain text with `aria-current="page"` (for the last/current item). Separators (`/`) are inserted between items.

## Data & Control Flow
- **Breadcrumbs**: Receives `items: Array<{ label: string; href?: string }>` from page-level callers. Purely presentational — no data fetching. Consumed by e.g., `src/pages/work/index.astro`, `src/pages/blog/[...slug].astro`.
- **FilterBar**: Receives `tags: string[]` (the tag set) and `total: number` (total item count). The component renders filter buttons and a count display. Client-side JS (`initFilters`) attaches click handlers to buttons, reads `data-tags` from sibling `<li>` elements (selected via `document.getElementById('list')`), and toggles visibility. The count updates reflect `shown / total`. Expected DOM structure: `FilterBar` + a `<ul id="list">` in the same page.
- **ListItem**: Receives `href`, `title`, `description`, `meta`, optional `tags` and `draft`. Renders a semantic `<li>` with an `<a>` containing a two-column grid layout. The `meta` slot typically receives a year or date string. `tags` is a comma-separated string passed through as `data-tags` for `FilterBar` integration.
- **Tooltip**: Receives `de`, `en`, `lang`, optional `class`. Selects the correct string at build time, renders a `<span data-tooltip>` wrapper around `<slot />` content, plus a hidden tooltip bubble. The `BaseLayout.astro` inline script handles positioning via `clampTooltip()` which adjusts `--tip-shift` CSS custom property.

## Integration Points
- **Depends on**: `../../lib/i18n` (only `Tooltip`). No component depends on external data fetching libraries or content collections.
- **Consumed by**:
  - `Breadcrumbs` — used in `/src/pages/work/index.astro`, `/src/pages/blog/[...slug].astro`, and project detail pages.
  - `FilterBar` — used in listing pages (work index, blog index) alongside `ListItem` components.
  - `ListItem` — used by `Work.astro` and `Writing.astro` (sections/), and by listing pages (pages/work/index.astro, pages/blog/[...slug].astro).
  - `Tooltip` — used inline within `Hero.astro` heading text (via `set:html` from i18n strings) and potentially by detail pages for role/duration labels.
- **Styling surface**: All components use Tailwind utility classes directly. No CSS modules or `<style>` blocks. They rely on theme tokens defined in `src/styles/global.css` (`--fg`, `--muted`, `--accent`, `--rule`, `--bg`, `--bg-hover`).
