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

Provides site-wide navigation, branding, metadata, structured data, footer content, and decorative background layers.

## Files

- `Header.astro`: desktop/mobile navigation, active-route state, language switch, and theme/menu controls.
- `Footer.astro`: localized footer content and brand treatment.
- `SEO.astro`: title composition, canonical, robots, Open Graph, article, and Twitter metadata.
- `JsonLd.astro`: embeds page-provided schema objects as JSON-LD.
- `AmbientBlobs.astro`: fixed decorative background gradients.

## Flow And Integration

`BaseLayout.astro` supplies language and navigation state. `Header` emits IDs used by the global theme and mobile-menu handlers. Route files supply page-specific schema directly to `JsonLd`; `SEO` derives canonical URLs from `Astro.url` and `Astro.site`.
