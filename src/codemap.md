# src/

<!-- Fixer: Fill in this section with architectural understanding -->

## Responsibility

<!-- What is this folder's job in the system? -->

## Design

<!-- Key patterns, abstractions, architectural decisions -->

## Flow

<!-- How does data/control flow through this module? -->

## Integration

<!-- How does it connect to other parts of the system? -->
# Source Map

## Responsibility

Implements the Astro application: bilingual file-based routes, typed Markdown content, localized rendering, global layout, and progressively enhanced browser interactions.

## Design

- Static generation: route files prerender HTML at build time.
- Canonical-entry localization: English IDs drive both language route sets; German files are overlays paired by filename.
- Root-locale routing: German uses `/`, English uses `/en/`.
- Server-first rendering: there are no hydrated framework islands; scripts use Astro navigation lifecycle events.
- Shared layout composition: every HTML page renders through `BaseLayout.astro`.

## Data And Control Flow

1. `content.config.ts` loads `blog`, `blogDe`, `projects`, and `projectsDe` and validates frontmatter with Zod.
2. Pages and homepage sections call `getCollection()` during static generation.
3. `lib/content-helpers.ts` joins German entries to English IDs and chooses localized copy and slugs.
4. Route files pass page metadata and language to `layouts/BaseLayout.astro`.
5. The layout composes SEO, structured data, header/footer, and page content, then binds client behavior on `astro:page-load`.

## Routes

| Route source | Output |
|---|---|
| `pages/index.astro` | `/` German home |
| `pages/en/index.astro` | `/en/` English home |
| `pages/blog/index.astro` | `/blog/` German writing index |
| `pages/en/blog/index.astro` | `/en/blog/` English writing index |
| `pages/blog/[post].astro` | `/blog/{German urlSlug or English ID}/` |
| `pages/en/blog/[post].astro` | `/en/blog/{English ID}/` |
| `pages/work/index.astro` | `/work/` German project index |
| `pages/en/work/index.astro` | `/en/work/` English project index |
| `pages/work/[post].astro` | `/work/{German urlSlug or English ID}/` |
| `pages/en/work/[post].astro` | `/en/work/{English ID}/` |
| `pages/rss.xml.ts` | Combined RSS feed |
| `pages/404.astro` | Static noindex error page |

Dynamic paths are generated from English collections. German detail pages render the paired German body when present and otherwise fall back to English. Blog relations use tag overlap; project navigation uses the `order` field.

## Content

- `content/blog/*.md`: canonical English articles.
- `content/blog/de/*.md`: German article translations and localized slugs.
- `content/projects/*.md`: canonical English projects.
- `content/projects/de/*.md`: German project translations and localized slugs.

Frontmatter drives route identity, list sorting, filters, SEO, JSON-LD, and RSS. Translation identity is currently implicit in matching filenames.

## Integration Points

- `astro:content` for collection loading and Markdown rendering.
- `astro:transitions` for client-side navigation.
- `@astrojs/rss` and `@astrojs/sitemap` for discovery feeds.
- `motion` for reveal and magnetic effects.
- Tailwind CSS v4 and `styles/global.css` for the visual system.
- Cloudflare adapter and Wrangler for deployment.
