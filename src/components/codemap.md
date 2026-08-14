# src/components/

<!-- Fixer: Fill in this section with architectural understanding -->

## Responsibility

<!-- What is this folder's job in the system? -->

## Design

<!-- Key patterns, abstractions, architectural decisions -->

## Flow

<!-- How does data/control flow through this module? -->

## Integration

<!-- How does it connect to other parts of the system? -->
# Components Map

## Responsibility

Contains prop-driven Astro components for global chrome, homepage sections, and reusable UI controls.

## Design

- Components render server-side HTML and expose DOM hooks to scripts instead of hydrating islands.
- Most localized components accept `lang: 'de' | 'en'` and resolve strings through `lib/i18n.ts`.
- Reveal sequencing is declarative through `data-reveal` and `data-reveal-group` attributes.

## Subdirectories

| Directory | Responsibility | Detailed map |
|---|---|---|
| `layout/` | Header, footer, metadata, structured data, branding, and decorative background. | [Layout components](layout/codemap.md) |
| `sections/` | Content-aware sections composing the localized home pages. | [Homepage sections](sections/codemap.md) |
| `ui/` | Filtering, breadcrumbs, list rows, and tooltip primitives. | [UI components](ui/codemap.md) |

## Integration

Components are consumed by `layouts/BaseLayout.astro` and route files. Collection-aware sections depend on `astro:content` and localization helpers; global scripts in `BaseLayout` consume their IDs, classes, and data attributes.
