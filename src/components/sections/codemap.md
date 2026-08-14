# src/components/sections/

<!-- Fixer: Fill in this section with architectural understanding -->

## Responsibility

<!-- What is this folder's job in the system? -->

## Design

<!-- Key patterns, abstractions, architectural decisions -->

## Flow

<!-- How does data/control flow through this module? -->

## Integration

<!-- How does it connect to other parts of the system? -->
# Homepage Sections

## Responsibility

Composes localized home pages from hero, biography, project, writing, and contact sections.

## Files And Flow

- `Hero.astro`: localized headline, cycling accent words, introduction, and anchor calls to action.
- `About.astro`: translated biography content.
- `Work.astro`: loads projects, orders by `order`, selects four, and overlays German content when requested.
- `Writing.astro`: loads posts, orders by publication date, selects four, and overlays German content when requested.
- `Contact.astro`: localized email and social links.

`pages/index.astro` and `pages/en/index.astro` instantiate these sections. Content sections call `getCollection()`, use `buildDeMap()` and `getLocalizedEntry()`, then emit links under the appropriate language prefix. `BaseLayout` consumes section reveal attributes for motion choreography.
