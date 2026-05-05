# src/pages/en/

## Responsibility
English locale landing page. Serves as the English home at `/en/`. A near-identical mirror of `pages/index.astro` with `lang="en"` and no `WebSite` JSON-LD block. All content sections render English strings via `t(key, 'en')`.

## Design Patterns
- **Static prerendering**: `prerender = true`.
- **Layout composition**: Identical to German home — `BaseLayout` with same sections.
- **i18n-driven strings**: All labels, headings, and body text resolved via `t()` with `lang='en'`.
- **Root-relative paths**: `langPrefix('en')` → `'/en'`, so internal links in `BaseLayout` point to `/en/` prefixed paths.

## Data & Control Flow
1. `t('title.home', 'en')` resolves `"Dragan Balatinac"`.
2. `BaseLayout` receives `lang="en"`, which triggers:
   - `langPrefix('en')` → `'/en'` for the Wordmark href and Header links.
   - `hreflang` tags: `lang="en"`, `altLang="de"` with `x-default` pointing to the German URL.
3. Single `JsonLd` component injects `Person` schema (no `WebSite` block — differs from the German home).
4. Five section components (`Hero`, `About`, `Work`, `Writing`, `Contact`) render with `lang='en'`, pulling English translations from `lib/i18n`.

## Integration Points
| Dependency | Role | Direction |
|---|---|---|
| `layouts/BaseLayout.astro` | Root HTML shell — handles hreflang, theme, layout | Consumed by page |
| `components/layout/JsonLd.astro` | Injects Person schema JSON-LD | Used once |
| `components/sections/Hero.astro` | Hero section content | Used |
| `components/sections/About.astro` | About section content | Used |
| `components/sections/Work.astro` | Work preview section | Used |
| `components/sections/Writing.astro` | Writing preview section | Used |
| `components/sections/Contact.astro` | Contact section content | Used |
| `lib/i18n.ts` | `t()` for all UI strings, `Lang` type | Consumed |
| Consumers: `pages/index.astro` (DE home) | Mirror page with `lang='de'` | Sibling route |
| Consumers: `pages/en/blog/`, `pages/en/work/` | Sub-routes under `/en/` | Children |
