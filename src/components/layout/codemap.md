# src/components/layout/

<!-- Fixer: Fill in this section with architectural understanding -->

## Responsibility

<!-- What is this folder's job in the system? -->

## Design

<!-- Key patterns, abstractions, architectural decisions -->

## Flow

<!-- How does data/control flow through this module? -->

## Integration

<!-- How does it connect to other parts of the system? -->
# Layout Components

## Responsibility

Provides site-wide navigation, branding, metadata, structured data, and footer content.

## Files

- `Header.astro`: navigation (wraps to its own row on small screens), active-route state, language switch, and theme toggle.
- `Footer.astro`: localized footer content and brand treatment.
- `SEO.astro`: title composition, canonical, robots, Open Graph, article, and Twitter metadata.
- `JsonLd.astro`: embeds page-provided schema objects as JSON-LD.

## Flow And Integration

`BaseLayout.astro` supplies language and navigation state. `Header` emits the `#theme-toggle` ID used by the global theme handler. Route files supply page-specific schema directly to `JsonLd`; `SEO` derives canonical URLs from `Astro.url` and `Astro.site`.
