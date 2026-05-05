---
title: "TYPO3 v14 — what's actually new and what I'm looking forward to"
description: "A practical look at the features coming to TYPO3 v14 LTS — from the Form Framework overhaul and System Resource API to Extbase upgrades and the death of ext_emconf.php."
tags: ["typo3", "php", "cms", "backend"]
publishedAt: 2026-05-05
readTime: "~9 min"
draft: false
---

I've been building things with TYPO3 long enough to remember when `ext_emconf.php` was non-negotiable and form definitions lived in YAML files that nobody could find without a search party. So when the v14 LTS release notes started landing, I read them the way I always do: skipping the marketing paragraphs and going straight for the things that change my daily work.

Here's what actually caught my attention — and what I think matters more than the release notes let on.

## The Form Framework finally grows up

If you've built anything beyond a simple contact form in TYPO3, you know the Form Framework. You also know its pain points. v14.2 addresses several of them at once, and this is the update I'd call genuinely impactful.

### Multi-file uploads in a single field

This should have existed years ago. Until now, if a form needed multiple file uploads — job applications, competition entries, event registrations — you had to add separate upload elements for each file. That's not just tedious for integrators; it's confusing for editors who then have to configure each one independently.

One field, multiple files. Finally.

### Rich text in form fields

Text area fields in forms now support CKEditor 5. This means editors can format content directly within forms, and the editing experience is consistent with the rest of the backend. No more explaining to a client why the form textarea looks like it's from 2003 while everything else has a modern editor.

### The form editor tree, rebuilt

The form editor's left-hand tree — the one that shows the full form workflow — has been rebuilt using Web Components, matching the architecture of the page and file trees. This isn't just a visual refresh. It adds search, a collapse-all function, and smoother interaction. If you've ever built a form with more than a handful of steps, you know how much the old tree struggled.

![The context panel slides in from the right, keeping the page layout visible while editing](/images/blog/typo3-context-panel-content.webp)

### Form definitions move to the database

This is the big structural change. Since the Form Framework was introduced in TYPO3 v8, form definitions have been stored as YAML files in the file system. That approach is now deprecated in favor of database storage via the new `DatabaseStorageAdapter`.

The adapter supports a chain of storage backends, including extension-based sources that are read-only. And to make the migration less painful, there's a new CLI command:

```bash
form:definition:transfer
```

It moves form definitions between storages. No manual YAML surgery required.

There's also a `form:cleanup:uploads` command for cleaning up old upload folders — small quality-of-life improvement that saves disk space over time.

### ICU message format and better date handling

The Form Framework now supports the ICU message format for translation labels, which means proper handling of plurals and variable interpolation. Date fields get a new web component for setting default values and date ranges — a small thing that removes a surprising amount of friction when configuring date-dependent forms.

## System Resource API — one way to resolve everything

This is the change I didn't know I needed until I saw it.

![The redesigned TYPO3 v14 backend interface](/images/blog/typo3-backend-ui.webp)

In TYPO3, resources have always been a bit of a mess. Extension files use one syntax, FAL references use another, project files have their own conventions, and external URIs are just strings. The new System Resource API unifies all of this through a single interface using clear keywords: **EXT**, **FAL**, and **PKG**.

Whether you're working in PHP, TypoScript, or Fluid, resources are resolved consistently. This reduces the kind of subtle errors that lead to security issues — wrong path resolution, missing file checks, inconsistent URL generation.

It's also extensible. If you're integrating a CDN or a custom storage backend, you can add your own resolver without touching the core.

## Database pagination done right

The new `QueryBuilderPaginator` integrates with TYPO3's existing pagination system and makes paginating database results straightforward. If you've ever built a custom paginated list in TYPO3 — and you probably have, because the existing options were either too rigid or too manual — this is a welcome addition.

It's not revolutionary. It's the kind of thing that should have been there from the start. But that's exactly why it matters: the boring infrastructure pieces are what you interact with every day.

## Extension files: the cleanup we needed

Three changes here, and all of them move TYPO3 closer to modern PHP conventions:

- **`composer.json` is now required** in every extension, including legacy installations. This creates a consistent foundation regardless of how the extension was installed.
- **`ext_emconf.php` is gone.** Extension metadata lives in `composer.json` now. If you've ever maintained both files and kept them in sync, you know this is a relief.
- **`ext_tables.php` is gone.** Its responsibilities have been replaced by more modern configuration approaches.

This is the kind of change that's invisible to editors but meaningful to developers. Fewer files to maintain, fewer inconsistencies, and a setup that finally aligns with how the PHP ecosystem actually works.

## Extbase gets serious upgrades

Extbase in v14 LTS receives several improvements that bring it closer to modern PHP standards:

### Symfony Validators

Validation now supports Symfony constraint attributes on domain models and controller methods. Instead of writing custom validators for common cases, you can use the full range of Symfony's built-in validators. This makes validation more consistent and easier to maintain.

### SQL function expressions in ORDER BY

Extbase now supports SQL function expressions in `ORDER BY` clauses through a fluent API. Methods like `orderBy()`, `addOrderBy()`, `concat()`, `trim()`, and `coalesce()` give you more control over query results without dropping down to raw SQL.

### The `#[Authorize]` attribute

Access control directly on controller actions. You can enforce rules like requiring a logged-in frontend user or checking group membership — clean, declarative, and maintainable. No more scattering permission checks across your action methods.

### The `#[RateLimit]` attribute

Rate limiting as a PHP attribute. It limits how often a specific action can be accessed within a time frame, using the client's IP and Symfony's RateLimiter component. This is particularly useful for form submissions, login processes, and any endpoint that's expensive to compute or sensitive to abuse.

## Exception handling that doesn't make you squint

The improved debugging exception handler presents stack traces more clearly, shows exactly where an issue occurs, and includes a one-click copy option for file paths. Small detail, but when you're debugging a production issue at 11pm, every second of squinting at a wall of text matters.

## Backend UX: bookmarks, short URLs, scheduler wizard

A few more things worth mentioning:

![The new page creation wizard guides editors step by step](/images/blog/typo3-page-creation-wizard.webp)

- **Backend bookmarks** — users can save and manage their own set of bookmarks, creating direct entry points to frequently used pages. Saves time, reduces navigation errors.
- **Short URLs** — with hit counters, enforced SSL, and configurable expiry dates. Useful for sharing page links or workspace previews with clients.
- **Scheduler task wizard** — a modern, categorized interface for creating scheduled tasks, similar to the content element wizard. Search, filter, icons, descriptions. Much better than the old dropdown.

![The centralized bookmark manager in TYPO3 v14](/images/blog/typo3-bookmark-manager.webp)

## What I'm actually looking forward to

If I'm honest, the changes that matter most to me are the unglamorous ones. The Form Framework moving to database storage. The death of `ext_emconf.php`. The System Resource API making path resolution predictable. The `#[Authorize]` and `#[RateLimit]` attributes removing boilerplate from my controllers.

These aren't the features that make for exciting release announcements. But they're the ones that reduce the daily friction of working with a CMS — and that's what makes a long-term release worth upgrading for.

TYPO3 v14 LTS isn't a radical reinvention. It's a refinement. The kind where you upgrade, and a week later you realize that five small things you used to work around are just... gone. That's the best kind of release.

*— DB, written while his TYPO3 instances were still running ext_emconf.php and pretending everything was fine.*