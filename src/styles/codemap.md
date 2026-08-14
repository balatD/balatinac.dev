# src/styles/

<!-- Fixer: Fill in this section with architectural understanding -->

## Responsibility

<!-- What is this folder's job in the system? -->

## Design

<!-- Key patterns, abstractions, architectural decisions -->

## Flow

<!-- How does data/control flow through this module? -->

## Integration

<!-- How does it connect to other parts of the system? -->
# Styles Map

## Responsibility

`global.css` defines the complete visual system and global behavior styling.

## Design

- Self-hosted font faces and semantic typography roles.
- Light/dark CSS variables bridged into Tailwind v4 through `@theme`.
- Shared layout dimensions, frame rails, buttons, rows, prose, tooltip, filter, and lightbox styles.
- Astro view-transition pseudo-elements and reveal/magnetic motion states.
- Responsive and `prefers-reduced-motion` adaptations.

## Integration

Imported once by `BaseLayout.astro`. Components combine Tailwind utility classes with shared semantic classes and custom properties. Client scripts toggle `data-theme`, `data-open`, `has-motion`, `is-visible`, and `lightbox-open` states consumed by this stylesheet.
