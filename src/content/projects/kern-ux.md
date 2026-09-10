---
title: "kern_ux — the KERN UX-Standard for TYPO3"
description: "Forty accessible Fluid components, twenty Content Blocks and an ext:form theme bringing Germany's public-sector design standard to TYPO3 13.4 and 14.3 — with the KERN markup living exactly once and pinned by tests under both majors."
tags: ["typo3", "accessibility", "fluid", "content-blocks"]
year: 2026
order: 3
featured: true
publishedAt: 2026-09-10
meta:
  duration: "Late summer 2026"
  role: "Author & Maintainer"
  team: "Solo"
  status: "Public alpha · 1.0.0-alpha"
---

An accessibility standard is not a colour palette. It is a set of class names and ARIA attributes that have to be exactly right.

That is the whole problem with putting a design system into a CMS. [KERN](https://www.kern-ux.de/) — the UX standard for German public administration — makes concrete promises: BITV 2.0 AA via EN 301 549, tested additionally against WCAG 2.2. Those promises do not live in a spec document. They live in whether a `fieldset` carries `aria-required`, whether the error message comes after the hint in `aria-describedby`, whether a hero's text precedes its image in the source order. Copy that markup into thirty templates and you have thirty places for it to quietly drift.

[`kern_ux`](https://github.com/balatD/kern_ux) brings KERN to TYPO3 13.4 and 14.3: 40 accessible Fluid components, 20 Content Blocks for editors, an `ext:form` theme and four page templates with matching backend layouts.

> This is an independent community integration. It is not part of the KERN team and not an official KERN kit.

## The markup exists exactly once

A layer of native Fluid components is the single source of KERN markup. Content Blocks, form templates and page templates all call the same components and only map data onto them.

Forty of them, built against KERN 2.7.2:

- **Atoms** (15) — Badge, Body, Button, Divider, Error, Heading, Hint, Icon, Label, Link, List, Loader, Preline, Progress, Subline.
- **Molecules** (16) — AccordionItem, Alert, Breadcrumb, ButtonGroup, Card, ContentHeader, DescriptionList, DownloadList, Figure, Hgroup, MediaPlayer, NavigationList, Section, SkipLink, SummaryItem, TaskListItem.
- **Organisms** (9) — CardGrid, Dialog, Footer, Gallery, Header, Hero, Kopfzeile, TaskList, TaskListGroup.

The `k` namespace is registered globally, so `<k:atom.button>` resolves without any `xmlns` in the template. You can see a component's real output without a browser or a database:

```bash
vendor/bin/typo3 kern-ux:component:render '<k:atom.button icon="arrow-forward">Weiter</k:atom.button>'
```

The point of the layer is not reuse. It is that there is one place to be correct, and tests that hold it there under both TYPO3 majors.

## Form rules belong in two partials, not thirty

`ext:form` ships around thirty element partials. Putting KERN's field contract in each of them would mean thirty copies of the same ARIA wiring. Instead it sits in two: `Field/Field.html` for the `kern-form-input` family, `Field/Group.html` for checkbox and radio groups.

What that buys, implemented once:

- **Optional fields are marked, not required ones** — the inverse of the `ext:form` convention. Requiredness is conveyed with `aria-required`, not the native `required` attribute.
- **Three simultaneous error signals**: a modifier on the wrapper, a modifier on the field, and `aria-invalid`. Any one alone would be state conveyed by colour (WCAG 1.4.1).
- **`aria-describedby` in the order hint, then error** — the way KERN's own plain kit does it. Their React kit does the reverse; the plain kit wins.
- **For groups**, the `fieldset` carries both `aria-describedby` and `aria-required`, because it is what maps to `role="group"` and its `legend` is the accessible name. Repeating `aria-required` on every child would claim each option is individually mandatory — untrue for a radio group and for a checkbox group that wants at least one selection. Each child input still carries `aria-invalid` and the error class.
- **The element's `fluidAdditionalAttributes` are passed through**, with the contract's ARIA attributes layered on top. Without that you lose everything the form editor writes into that property — above all `autocomplete`, without which WCAG 1.3.5 simply cannot be met. Attributes that would overwrite the contract itself are dropped: no editor should be able to unhook the promises by hand.

`KernDate` renders a date as three fields, the way KERN prescribes — not an `<input type="date">`.

## Testing the standard, not the components

axe runs against a component gallery that shows every component in its documented states — living documentation, visual check and test target in one. It needs neither a web server nor a database:

```bash
vendor/bin/typo3 kern-ux:styleguide:dump --target=var/styleguide
cd Tests/A11y && npm install && npx playwright install chromium && npm test
```

Three details in that run were decisions, not defaults.

**The rule set includes `best-practice`.** Not as a bonus round: `heading-order`, `region`, `landmark-unique`, `landmark-one-main`, `page-has-heading-one` and `skip-link` carry no `wcag` tag in axe-core, only that one. Those six are the entire reason for checking whole pages. Without the tag the run answers a different question than the one it claims to.

**Every page runs three times** — light theme at 1280px, dark theme at 1280px, light theme at 390px. Contrast depends on the theme; `target-size` and `reflow` depend on the width. A single desktop pass leaves the dark theme and the whole mobile layout, navigation panel included, unchecked.

**The run aborts if the KERN stylesheet failed to load.** Without CSS, axe silently skips every contrast rule and the suite goes green for the wrong reason.

And the gallery only answers half the question — whether each component is accessible *on its own*. Whether they still are *together* takes a real page, so the same runner accepts arbitrarily many:

```bash
node axe.mjs --sitemap https://v14.kern-ux.ddev.site kern-ux-demo kern-ux-demo/elemente/hinweis …
```

Five of the accessibility bugs in this extension were found exactly that way, and not by the unit or markup tests. All five sat *between* the tested units — heading order across a full page, landmark uniqueness, contrast in the real layout. None of those are properties a component can have by itself.

The gallery is off by default, because it is a development and audit tool rather than page content. In the `Production` context the setting alone is not enough: there it is served only to a logged-in backend session. A switch in site settings is too little to open an extra public route on a live site.

## Two majors, one codebase, mutually exclusive dependencies

Content Blocks 1.x is TYPO3 13 only; 2.x is 14 only. One codebase serving both means the dependency graphs exclude each other, so the repo ships a DDEV harness that runs both majors side by side:

```bash
ddev install-all          # or: ddev install-v13 / ddev install-v14
```

"Run the tests" therefore always means *pin a major, resolve, test* — a bare `phpunit` would only check whichever major was installed last. CI runs the same matrix: static analysis, unit and functional tests across TYPO3 13/14 × PHP 8.2/8.3/8.4, a `--prefer-lowest` pass per major, and the axe run against the gallery.

The KERN distribution is deliberately not vendored. It is fetched once from npm at install time and verified by SHA-512, so there are no third-party requests at runtime and no CDN in the page:

```bash
composer require balatd/kern-ux:^1.0@alpha
vendor/bin/typo3 extension:setup
vendor/bin/typo3 kern-ux:assets:install
```

The target directory is not checked in, which makes that last step part of every deployment rather than a one-time chore.

## Small decisions that were not settings

A few behaviours look like missing options and are not.

The **Hero** block always puts its text before its image in the source order, even when the image is shown on the left — the layout is a grid order, so reading order follows the content rather than the visual arrangement. Its image carries no caption and is not a `figure`: a hero image illustrates, and what a visitor actually needs is in the lede. An image that makes its own point belongs in *Image* or *Text and Media*.

Component **semantics and appearance are separate arguments**. Heading level is one argument, visual size a second. KERN requires this explicitly, so a component can slot into any document structure without changing how it looks.

The source language is **English, with the German translation in `de.*.xlf`** — the TYPO3 convention, and not cosmetic. TYPO3 treats `en` as the default language key and then reads the `<source>` values instead of looking for an `en.` translation. With a German source, an English page on TYPO3 13 showed German text while TYPO3 14 found the translation.

## What I learned

The interesting work was not building forty components. It was deciding where a promise is allowed to live.

Every accessibility guarantee in this extension is either in one partial, one component, or one test — and where it wasn't, it broke. The five bugs the whole-page runs caught are the clearest evidence: unit tests can only check the units, and "accessible components" and "an accessible page" are different claims. So are "axe passes" and "axe was asked the right question", which is why the rule set, the three viewport passes and the stylesheet guard all had to be argued for rather than accepted from a template.

What automation still does not catch is written down instead of implied: keyboard operation through multi-step forms with errors, screen reader output for fields carrying both a hint *and* an error, and heading order across whole pages. Those get checked by hand. The alpha label is honest — the value is real, but a standard that public bodies are legally measured against deserves production mileage before it claims 1.0.

`kern_ux` is [available on GitHub](https://github.com/balatD/kern_ux) and [Packagist](https://packagist.org/packages/balatd/kern-ux). GPL-2.0-or-later, public alpha, TYPO3 13.4 and 14.3.
