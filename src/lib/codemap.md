# src/lib/

## Responsibility

Core application logic layer for internationalization (i18n) and bilingual content resolution. Provides the foundational type system (`Lang` union), string translation dictionary, URL localization, and a helper layer that bridges Astro's content collections (EN/DE pairs) into a unified, language-aware lookup. No UI, no layout — pure logic consumed by components, pages, and layout templates.

## Design Patterns

- **Dictionary-based translation** (`i18n.ts`): A flat `Record<string, Record<Lang, string>>` maps dot-separated keys (namespaced by domain, e.g. `hero.heading`, `nav.about`) to `{en, de}` pairs. Lookup is a single `t(key, lang)` function with a German fallback for missing keys.
- **Content collection bridge** (`content-helpers.ts`): DE content collection entries carry a `de/` prefix on their `id`. `buildDeMap()` strips that prefix to build a `Map<string, T>` keyed by the shared logical ID, enabling O(1) lookup from an EN entry to its DE counterpart.
- **Constrained generic helpers**: `getLocalizedEntry` and `getDeSlug` are generic over a minimal shape (`{ id, data: { title, description, urlSlug? } }`), keeping them reusable across project and blog collections without coupling to a concrete entry type.
- **Explicit fallback chain**: Translation lookup falls back `en → de → key`; content lookup falls back `DE entry → EN entry → EN id`. No implicit defaults.

## Data & Control Flow

1. **Translation strings** flow **outward** — the `translations` dictionary is the single source of truth. Components call `t('nav.about', lang)` directly; no runtime fetching, no async.
2. **Content localization** flow:
   - `buildDeMap(deEntries)` is called at **page load time** (Astro frontmatter) with all DE entries from a content collection.
   - The resulting `Map` is passed alongside individual EN entries into `getLocalizedEntry(enEntry, deMap, lang)`.
   - The function returns the EN entry (as the canonical data object) but with the DE `title`, `description`, and `slug` when `lang === 'de'` and a DE counterpart exists.
   - `getDeSlug` is a narrower variant for cases where only the URL slug is needed (e.g. alternate `hreflang` links).
3. **URL switching** (`langSwitchUrl`) takes the current path and language, then strips or prepends `/en` to produce the counterpart URL. Edge case: root path `/` → `/en` (not empty string).

## Integration Points

- **`import { Lang, t, langPrefix, langSwitchUrl } from 'src/lib/i18n'`** — consumed by every layout, section, and page component that renders text or hrefs. The `Lang` type is used as a page-level prop across the entire site.
- **`import { buildDeMap, getLocalizedEntry, getDeSlug } from 'src/lib/content-helpers'`** — consumed by dynamic page templates (`pages/projects/[...slug].astro`, `pages/blog/[...slug].astro`, and their index pages) that render bilingual content collections.
- **`Lang` dependency**: `content-helpers.ts` imports `Lang` from `i18n.ts`. This is the only intra-lib dependency.
- **External boundary**: Both modules are consumed by Astro components and pages. Neither module imports from any other `src/` directory — they are pure logic with no framework coupling beyond TypeScript.
