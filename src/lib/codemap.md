# src/lib/

<!-- Fixer: Fill in this section with architectural understanding -->

## Responsibility

<!-- What is this folder's job in the system? -->

## Design

<!-- Key patterns, abstractions, architectural decisions -->

## Flow

<!-- How does data/control flow through this module? -->

## Integration

<!-- How does it connect to other parts of the system? -->
# Library Map

## Responsibility

Provides bilingual string lookup, route-prefix helpers, and translation pairing for content collections.

## `i18n.ts`

- Defines `Lang = 'de' | 'en'` and the flat translation dictionary.
- `t(key, lang)` resolves UI copy with a German fallback.
- `langPrefix(lang)` maps German to `''` and English to `'/en'`.
- `langSwitchUrl(path, lang)` adds or removes the English prefix for structurally identical routes.

## `content-helpers.ts`

- `buildDeMap()` strips the `de/` prefix and maps German entries by canonical English ID.
- `getLocalizedEntry()` chooses German fields/body/slug when requested and available, otherwise English data.
- `getDeSlug()` resolves alternate-language detail URLs.

## Data Flow And Constraints

English entry IDs act as translation keys. Route generation, homepage lists, collection indexes, and detail pages all rely on matching filenames across collections. Localized `urlSlug` values affect public German URLs but not pair identity.
