# src/layouts/

<!-- Fixer: Fill in this section with architectural understanding -->

## Responsibility

<!-- What is this folder's job in the system? -->

## Design

<!-- Key patterns, abstractions, architectural decisions -->

## Flow

<!-- How does data/control flow through this module? -->

## Integration

<!-- How does it connect to other parts of the system? -->
# Layouts Map

## Responsibility

`BaseLayout.astro` is the single document shell and global browser-behavior coordinator for all HTML pages.

## Design

- Composes SEO, hreflang links, fonts, transitions, header, content slot, footer, and native dialog lightbox.
- Initializes persisted light/dark theme before first paint.
- Uses Astro `ClientRouter` and `astro:page-load`, `astro:after-swap`, and `astro:before-swap` lifecycle events.
- Clone-and-replace rebinding is used for theme and menu controls after navigation.
- Motion observers and effects are initialized globally and cleaned up before swaps.

## Control Flow

1. A route passes title, description, content language, navigation state, and optional alternate-language URL.
2. The layout computes default language-switch and hreflang URLs.
3. It renders global chrome around the route slot.
4. Client scripts bind theme, menu, tooltip, lightbox, reveal, and magnetic interactions.
5. Navigation lifecycle handlers restore theme state and dispose motion observers.

## Integration

Consumed by every Astro HTML route. Depends on `components/layout/*`, `lib/i18n.ts`, `styles/global.css`, `astro:transitions`, and `motion`. Its scripts consume DOM hooks emitted by headers, prose Markdown, tooltips, and reveal-enabled sections.
