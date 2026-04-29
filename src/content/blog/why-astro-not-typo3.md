---
title: "Why I built my portfolio with Astro instead of TYPO3"
description: "A TYPO3 developer explains why he picked a static site generator over the CMS he knows best — and why that's not a contradiction."
tags: ["astro", "portfolio", "typo3", "cms"]
publishedAt: 2026-04-29
readTime: "~8 min"
draft: false
---

I've spent the better part of a decade inside TYPO3. I know the backend, the TypoScript, the quirks of FAL, and the particular joy of explaining to an editor why their paste-from-Word content broke the layout again. TYPO3 is my day job, my comfort zone, and — for the right project — genuinely excellent.

This site is not the right project.

## The question nobody asks early enough

Before you pick a framework, a CMS, or a static site generator, there's one question that deserves more time than it usually gets: **what does this site actually need to do?**

Not what it *could* do. Not what it *might* do in eighteen months when you've added a shop, a member area, and a newsletter. What it needs to do *today*, and what it will realistically need to do for the next two years.

For this portfolio, the answer was short:

- Display a handful of static pages.
- Show a list of projects and blog posts.
- Let me write content in Markdown.
- Load fast. Very fast.
- Cost nothing to host.

> If you can list your requirements on one hand, your CMS shouldn't need a database.

## Why TYPO3 was too much

I want to be clear: this isn't a criticism of TYPO3. I use it every day and I'd pick it again for a corporate multi-site with editorial workflows, role-based access, and a dozen content types. That's what it's built for.

But for a personal portfolio, TYPO3 brings overhead that earns nothing:

- **A database.** MariaDB or PostgreSQL, running 24/7, serving content that changes once a month. That's a backup strategy, a migration path, and a monitoring setup — for a blog with eight posts.
- **A PHP runtime.** FPM, OPcache config, memory limits, a web server. All of it for pages that could be plain HTML files on a CDN.
- **An editorial backend.** I'm the only editor. I don't need a login screen, a permission system, or a content tree. I need a text editor and `git push`.
- **Extension management.** Composer, TER, version constraints. Even a minimal TYPO3 install pulls in more moving parts than this entire site has pages.
- **Hosting cost.** A VPS that can run TYPO3 comfortably costs €5–15/month. This site deploys to Cloudflare Pages for free.

The mismatch isn't TYPO3's fault. It's a scope problem. Using TYPO3 for a portfolio is like renting a warehouse to store a suitcase.

## What Astro gets right for this use case

Astro clicked for me the moment I understood its core premise: **ship zero JavaScript by default, add it only where you need it.**

### Content Collections with Markdown

Instead of a database, my content lives in `.md` files with typed frontmatter. The schema is validated at build time with Zod — if I forget a required field, the build fails. No migration scripts, no SQL dumps. Content is version-controlled, diffable, and portable.

```
src/content/blog/
├── why-astro-not-typo3.md      # English
└── de/
    └── why-astro-not-typo3.md  # German
```

Adding a new post means creating a file, writing Markdown, and pushing to Git. The homepage picks up the latest entries automatically. No backend, no cache clearing, no "did the scheduler run?"

### Static output

The entire site compiles to plain HTML, CSS, and a small JS bundle for view transitions and the theme toggle. There's no server, no runtime, no cold starts. Every page is a file on a CDN edge node.

Build time: about one second. Total output size: under 300 KB.

### The island architecture

The few interactive pieces — the theme toggle, the language switcher, the tag filter — run as small scripts that hydrate independently. The rest of the page is static HTML. No framework runtime, no virtual DOM, no hydration waterfall.

For a portfolio, this means a Lighthouse performance score that basically maxes out without trying.

### Tailwind v4, not a theme system

TYPO3 projects usually mean SCSS, a Fluid template structure, and a design system that needs to accommodate dozens of content element types. Here, Tailwind's utility classes are enough. The design tokens live in a CSS file, not in a database or a TypoScript constant.

## The decision framework I'd recommend

After this experience, here's how I think about CMS vs. static for new projects:

- **Who edits the content?** If it's developers or technically literate people, Markdown + Git is faster than any CMS. If it's a marketing team, they need a backend.
- **How often does content change?** Weekly editorial cycles justify a CMS. Monthly updates on a personal site don't.
- **How many content types?** If you need structured content with relations, variants, and editorial workflows — that's CMS territory. If you have "page" and "post" — that's a folder of Markdown files.
- **What's the budget?** A static site on Cloudflare Pages or Netlify costs nothing. A CMS needs hosting, maintenance, and security updates.
- **What's the blast radius?** A static site can't be hacked at runtime. There's no admin panel to brute-force, no SQL injection to worry about, no PHP vulnerabilities to patch.

## One thing I miss

I'll be honest: TYPO3's image processing is better. The responsive image handling, the crop variants per breakpoint, the automatic WebP/AVIF conversion with fallbacks — that's genuinely hard to replicate in a static setup. Astro's `<Image />` component does the basics well, but it's not in the same league as FAL with a properly configured processing pipeline.

For a portfolio with a handful of images, it doesn't matter. For a content-heavy site, it would.

---

## Closing

The boring answer is: pick the tool that matches the job. TYPO3 is excellent at being TYPO3 — a full-featured CMS for complex editorial requirements. Astro is excellent at being Astro — a static site builder for content that lives in files.

I chose Astro because this site is small, personal, and written by one person in a text editor. If that changes — if I suddenly need multi-user editing, structured workflows, or a hundred content types — I know where to find TYPO3. It'll still be there, being boringly reliable, which is the highest compliment I can pay it.

*— DB, written while his TYPO3 instances were quietly serving millions of pages without needing any of this.*
