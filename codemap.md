# Repository Atlas: balatinac.dev

## Project Responsibility

A statically generated bilingual personal portfolio and blog. German routes live at the root and English routes under `/en/`. Astro content collections supply Markdown content, vanilla browser scripts provide interaction, and Wrangler deploys the generated site as a Cloudflare Worker with static assets.

## System Entry Points

- `src/pages/index.astro` and `src/pages/en/index.astro`: localized home pages.
- `src/pages/blog/`, `src/pages/work/`, and their `en/` counterparts: collection indexes and detail route generation.
- `src/layouts/BaseLayout.astro`: document shell and global browser behavior.
- `src/content.config.ts`: content collection schemas and loaders.
- `astro.config.mjs`: Astro, Markdown, sitemap, Tailwind, and Cloudflare configuration.
- `wrangler.jsonc`: Cloudflare Worker deployment configuration.
- `package.json`: development, validation, build, preview, and deployment commands.

## Architecture

1. Markdown files are validated into four collections: canonical English blog/projects and paired German translations.
2. Route and section components query collections during the build.
3. `src/lib/content-helpers.ts` pairs translations by filename and resolves localized slugs.
4. Pages compose components inside `BaseLayout`, which owns metadata, language alternates, theme state, navigation, lightbox behavior, and page transitions.
5. Astro prerenders all routes; Wrangler publishes static assets through a generated Worker bundle.

## Directory Map

| Directory | Responsibility | Detailed map |
|---|---|---|
| `src/` | Routes, content model, localization, layout, styling, and client behavior. | [Source map](src/codemap.md) |
| `src/components/` | Site chrome, homepage sections, and UI primitives. | [Components map](src/components/codemap.md) |
| `src/layouts/` | Shared HTML document and global interaction lifecycle. | [Layouts map](src/layouts/codemap.md) |
| `src/lib/` | Translation registry and localized-content pairing helpers. | [Library map](src/lib/codemap.md) |
| `src/styles/` | Global design tokens, typography, transitions, and utility-level styling. | [Styles map](src/styles/codemap.md) |

Page-specific maps intentionally live in `src/codemap.md`: Markdown files inside Astro's `src/pages` directory become public routes.
