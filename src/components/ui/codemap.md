# src/components/ui/

<!-- Fixer: Fill in this section with architectural understanding -->

## Responsibility

<!-- What is this folder's job in the system? -->

## Design

<!-- Key patterns, abstractions, architectural decisions -->

## Flow

<!-- How does data/control flow through this module? -->

## Integration

<!-- How does it connect to other parts of the system? -->
# UI Components

## Responsibility

Defines reusable controls and navigation patterns for collection routes and inline explanatory content.

## Files

- `AsciiArt.astro`: a randomly picked ASCII painting of one slot, filling its positioned parent behind the content (placement via `ascii-cover--hero`, `--band`, `--bottom` or `--side`); its script fetches the current theme's glyphs and colour maps from `public/ascii/`, decodes the painting in, keeps it moving, and swaps to the other theme's glyphs on a theme change.
- `Breadcrumbs.astro`: renders ancestor links and the current-page label.
- `Card.astro`: double-rule card used by the work and writing lists; carries `data-tags` for `FilterBar`.
- `FilterBar.astro`: filters list items by `data-tags`, initializes from `?tag=`, and updates a visible count.
- `ListItem.astro`: generic metadata/tag list row; current route templates mostly inline equivalent markup.
- `Tooltip.astro`: focusable explanatory tooltip wrapper positioned by the layout script.

## Integration

Blog and work indexes provide tags and list items using the `#list`, `data-tags`, and `data-filters` conventions. `BaseLayout.clampTooltip()` positions tooltip bubbles. Shared styles define row links, focus state, and tooltip visibility.
