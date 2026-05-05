# src/components/sections/

## Responsibility
Provides top-level content sections for the homepage (`src/pages/index.astro`). Each component corresponds to a vertical block on the homepage — Hero, About, Work, Writing, Contact — in display order. These sections are self-contained: they fetch their own data (via `astro:content`), handle i18n, and render using atomic components from `src/components/ui/` and inline Tailwind classes. They encapsulate both layout and data-dependency logic for a single page region.

## Design Patterns
- **Data-fetching sections**: `Work.astro` and `Writing.astro` call `getCollection()` at the top level (Astro frontmatter) to load content from Astro Content Collections (`projects`/`projectsDe` and `blog`/`blogDe` respectively). This is a deliberate server-only pattern — data is fetched at build time with zero client overhead.
- **Bilingual content resolution**: `Work` and `Writing` both use the `buildDeMap()` / `getLocalizedEntry()` helpers from `../../lib/content-helpers` to resolve bilingual content. The pattern: load EN items as the canonical list, build a `Map<string, T>` from DE items keyed by matching filename, then for each EN entry check if a DE translation exists and use its title/description/slug if `lang === 'de'`.
- **Consistent section chrome**: Every section follows the same structural pattern: `<section id="...">` → `<div>max-w-wrap px-5 sm:px-7 md:px-8</div>` → `<p class="section-label ...">{t('section.label', lang)}</p>` → content list or text. This gives visual consistency across sections.
- **Empty state handling**: `Work` and `Writing` guard against empty collections. If `hasProjects`/`hasPosts` is false, they render a translated empty-state message (`t('empty.work', lang)` / `t('empty.blog', lang)`) instead of a list.
- **CTA links**: `Work` and `Writing` render an "All work" / "All writing" link at the bottom of the list, pointing to `/work/` or `/blog/` with the appropriate language prefix.
- **Inline rich text via set:html**: `Hero` and `About` use `set:html={t('...', lang)}` to render i18n strings containing inline HTML (spans with tooltip triggers, accent-colored text). This allows rich formatting within translated content without breaking the server-render model.

## Data & Control Flow
- **Hero.astro**: Receives `lang`, computes `prefix` via `langPrefix()`. Renders heading and subheading from i18n keys `hero.heading` and `hero.sub`, plus two CTA links (`hero.cta.work`, `hero.cta.notes`) pointing to `/#work` and `/#writing` with language prefix.
- **About.astro**: Receives `lang`. Renders 4 paragraphs (`about.p1` through `about.p4`) from i18n, each as a `<p>` with `set:html`. No data fetching, no sub-components. Pure translation lookup.
- **Work.astro**: Receives `lang`. Calls `getCollection('projects')` (EN) and `getCollection('projectsDe')` (DE), builds a DE map, sorts EN projects by `data.order` ascending, slices to first 4. For each project, calls `getLocalizedEntry()` to extract title/description/slug in the requested language. Renders as an `<ul>` of linked list items (title, description, year). CTA: "All work →" linking to `/{prefix}/work/`.
- **Writing.astro**: Receives `lang`. Calls `getCollection('blog')` (EN) and `getCollection('blogDe')` (DE), builds DE map, sorts EN posts by `data.publishedAt` descending, slices to first 4. For each post, calls `getLocalizedEntry()` and formats `publishedAt` as `'Mon YYYY'` via `toLocaleDateString`. Renders as an `<ul>` of linked list items (title, description, date). CTA: "All writing →" linking to `/{prefix}/blog/`.
- **Contact.astro**: Receives `lang`. Renders a 3-row grid (email, GitHub, LinkedIn) with labels pulled from i18n (`contact.email`, `contact.code`, `contact.network`). Each link uses `target="_blank"` + `rel="noopener"` for external URLs.

## Integration Points
- **Depends on**:
  - `../../lib/i18n` — all sections use `t()` for translated strings, `langPrefix()` for URL prefixing. `Hero`, `Work`, `Writing` also use `langPrefix`.
  - `../../lib/content-helpers` — `Work` and `Writing` use `buildDeMap()` and `getLocalizedEntry()` for bilingual content resolution.
  - `astro:content` — `Work` imports `getCollection` from `'astro:content'` for `projects`/`projectsDe`; `Writing` imports it for `blog`/`blogDe`.
  - Content collections (defined in `src/content/config.ts` or equivalent): `projects`, `projectsDe`, `blog`, `blogDe`.
  - `Tag` and `ListItem` from `src/components/ui/` — `Work` and `Writing` inline their own list-item markup rather than using `ListItem.astro` directly.
- **Consumed by**: `src/pages/index.astro` renders all five sections in order: `<Hero />` → `<About />` → `<Work />` → `<Writing />` → `<Contact />`. Sections may also be reused by specialized layouts or future pages (e.g., a lightweight "about + contact" page).
- **Styling surface**: All sections use Tailwind utility classes and reference CSS custom properties (`--fg`, `--muted`, `--accent`, `--rule`) defined in `src/styles/global.css`. They rely on the `.section-label` and `.h1-hero` global styles (defined in `global.css`).
