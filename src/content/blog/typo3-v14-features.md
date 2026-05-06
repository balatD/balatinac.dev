---
title: "TYPO3 v14 — what's actually new and what I'm looking forward to"
description: "A practical look at the features coming to TYPO3 v14 LTS — from the Form Framework overhaul and System Resource API to Extbase upgrades and the death of ext_emconf.php."
tags: ["typo3", "php", "cms", "backend"]
publishedAt: 2026-05-05
readTime: "~9 min"
draft: false
---

I've been building with TYPO3 long enough to remember when `ext_emconf.php` was non-negotiable and form definitions lived in YAML files buried somewhere in the file system — in places you couldn't find again without `find` and a bit of luck. When the v14 LTS release notes came through, I read them the way I always do: skimming past the marketing copy, heading straight for the things that change my daily work.

Here's what actually caught my eye — and what I think matters more than the release notes let on.

---

## The Form Framework finally grows up

If you've ever built more than a basic contact form in TYPO3, you know the Form Framework — and you know its pain points. v14.2 addresses several of them at once, and this is the update with the biggest day-to-day impact, as far as I'm concerned.

### Multi-file uploads in a single field

This should have existed years ago. Until now, multiple file uploads — job applications, competition entries, event registrations — required a separate upload element for each file. Tedious for integrators, confusing for editors who then had to configure each one independently.

Now: one field, multiple files. Finally.

### Rich text in form fields

Textarea fields now support CKEditor 5. Editors can format content directly within forms, and the editing experience is consistent with the rest of the backend. No more explaining to clients why the form field looks like it's from 2003 while everything else has a modern editor.

### The form editor tree, rebuilt

The left-hand tree in the form editor — the one that maps the entire workflow structure — has been rebuilt with Web Components and now follows the same architecture as the page and file trees. More than a visual refresh: it adds search, a *collapse all* function, and noticeably smoother interaction. If you've ever built a multi-step form, you know how badly the old tree struggled with that.

### Form definitions move to the database

This is the big structural change. Since the Form Framework was introduced in TYPO3 v8, form definitions lived as YAML files in the file system. That approach is now deprecated in favor of database storage via the new `DatabaseStorageAdapter`.

The adapter supports a chain of storage backends, including extension-based sources that are mounted read-only. To keep the migration from turning into YAML surgery, the core ships with a new CLI command:

```bash
vendor/bin/typo3 form:formdefinition:transfer
```

It moves form definitions between storages — cleanly and traceably.

### ICU message format and better date handling

Translation labels now support the ICU message format, which means proper plural handling and clean variable interpolation. Date fields get a new web component for default values and date ranges — a small thing that removes a surprising amount of friction when configuring date-dependent forms.

---

## System Resource API — one way to resolve everything

This is the change I didn't know I needed until I saw it.

Resources in TYPO3 have always been a bit of a mess: extension files used one syntax, FAL references another, project files had their own conventions, and external URIs were just strings. The new **System Resource API** unifies all of this through a single interface with clear keywords: `EXT`, `FAL`, and `PKG`.

Whether in PHP, TypoScript, or Fluid — resources are resolved consistently. This eliminates exactly the kind of subtle errors that have led to security issues in the past: wrong path resolution, missing file checks, inconsistent URL generation.

And it's extensible. Want to integrate a CDN or a custom storage backend? Register your own resolver without touching the core.

---

## Database pagination, done right

The new `QueryBuilderPaginator` integrates with TYPO3's existing pagination system and makes paginating database results straightforward. If you've ever built a custom paginated list in TYPO3 — and you probably have, because the existing options were either too rigid or too manual — you'll appreciate this.

It's not revolutionary. It's the kind of thing that should have been there from the start. But that's exactly why it matters: the boring infrastructure pieces are what you work with every single day.

---

## Extension files: the cleanup we needed

Three changes, all moving TYPO3 closer to modern PHP conventions:

- **`composer.json` is now required** in every extension, including legacy installations. This creates a consistent foundation regardless of how the extension was installed.
- **`ext_emconf.php` is gone.** Extension metadata now lives in `composer.json`. If you've ever had to keep both files in sync, you know what a relief this is.
- **`ext_tables.php` is gone.** Its responsibilities have been taken over by more modern configuration mechanisms.

Invisible to editors, but meaningful for developers: fewer files to maintain, fewer inconsistencies, and a setup that finally works the way the PHP ecosystem expects it to.

---

## Extbase gets serious upgrades

Extbase in v14 LTS moves noticeably closer to modern PHP standards.

### Symfony validators

Validation now supports **Symfony constraint attributes** on domain models and controller methods. Instead of writing custom validators for common cases, you use the full range of Symfony's built-in constraints. More consistent, more maintainable, less code.

```php
use Symfony\Component\Validator\Constraints as Assert;

class ContactRequest
{
    #[Assert\NotBlank]
    #[Assert\Length(min: 2, max: 80)]
    public string $name = '';

    #[Assert\Email]
    public string $email = '';
}
```

### SQL function expressions in `ORDER BY`

Extbase now supports SQL function expressions in `ORDER BY` clauses through a fluent API. Methods like `orderBy()`, `addOrderBy()`, `concat()`, `trim()`, and `coalesce()` give you more control over sorting without dropping down to raw SQL.

### The `#[Authorize]` attribute

Access control, declarative and directly on the controller action: logged-in frontend user, group membership, custom voters. Clean, readable, maintainable — and finally an end to permission checks scattered across every action method.

```php
#[Authorize(requireLogin: true)]
#[Authorize(requireGroups: [42])]
public function showAction(): ResponseInterface
{
    // …
}
```

### The `#[RateLimit]` attribute

Rate limiting as a PHP attribute, built on Symfony's `RateLimiter` component and keyed to the client IP by default. Particularly valuable for form submissions, login endpoints, and anything that's expensive to compute or vulnerable to abuse.

```php
#[RateLimit(limit: 5, interval: '1 minute')]
public function submitAction(): ResponseInterface
{
    // …
}
```

---

## Exception handling that doesn't make you squint

The revamped debugging exception handler presents stack traces more cleanly, pinpoints the error location more precisely, and offers one-click copy for file paths. Sounds cosmetic — but when you're debugging a production issue at 11pm, every second you don't spend squinting at a wall of text counts.

---

## Backend UX: bookmarks, short URLs, scheduler wizard

![The redesigned TYPO3 v14 backend](/images/blog/typo3-backend-ui.webp)

Three smaller things that make a daily difference:

- **Backend bookmarks** — users can manage their own bookmarks and create direct entry points to frequently used pages. Saves time, reduces click detours.

![The centralized bookmark manager in TYPO3 v14](/images/blog/typo3-bookmark-manager.webp)

- **Short URLs** with hit counters, enforced SSL, and configurable expiry dates. Handy for sharing page links or workspace previews with clients.

- **Scheduler task wizard** — a modern, categorized interface for creating scheduled tasks, similar to the content element wizard. Search, filters, icons, descriptions. A quantum leap over the old dropdown.

![The new page creation wizard guides editors step by step](/images/blog/typo3-page-creation-wizard.webp)

![The context panel slides in from the right, keeping the page layout visible while editing](/images/blog/typo3-context-panel-content.webp)

---

## What I'm actually looking forward to

If I'm honest, the changes that matter most to me are the unglamorous ones. Form definitions moving to the database. The death of `ext_emconf.php`. The System Resource API making path resolution predictable. `#[Authorize]` and `#[RateLimit]` stripping boilerplate from my controllers.

These aren't the features that make for loud release announcements. But they're the ones that reduce daily friction with a CMS — and that's exactly what makes an LTS worth upgrading for.

TYPO3 v14 LTS isn't a radical reinvention. It's a refinement. The kind of release where you upgrade, and a week later you realize that five small things you used to work around are just… gone. That's the best kind of release.

*— DB, written while his TYPO3 instances were still running ext_emconf.php and pretending everything was fine.*