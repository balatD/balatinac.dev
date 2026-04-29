# balatinac.dev

Personal portfolio and blog built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com).

## Stack

- **Astro 6.1** — static site generation
- **Tailwind CSS v4** — utility-first styling via Vite plugin
- **TypeScript** — type-safe components and content
- **Shiki** — syntax highlighting with dual light/dark themes

## Features

- Bilingual content (EN/DE) with client-side language toggle
- Dark/light theme with system preference detection
- Content collections with Markdown (blog posts + projects)
- View transitions between pages
- Tag filtering on index pages
- RSS feed, sitemap, JSON-LD structured data
- Zero JS on pages without interactivity
- WCAG 2.2 AA accessible

## Development

```bash
npm install
npm run dev       # Start dev server at localhost:4321
npm run build     # Build static site to dist/
npm run preview   # Preview production build
```

## Content

Blog posts and projects live in `src/content/` as Markdown files. German translations go in `de/` subdirectories.

```
src/content/
├── blog/
│   ├── my-post.md          # English
│   └── de/
│       └── my-post.md      # German
└── projects/
    ├── my-project.md
    └── de/
        └── my-project.md
```

Use `/new-blog-post` and `/new-project` Claude Code skills to generate new content.

## Deployment

Static output deploys to Cloudflare Pages.

- Build command: `npm run build`
- Output directory: `dist`
- Node version: `20`
