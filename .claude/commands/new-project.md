# New Project (Case Study)

Create a new bilingual (EN + DE) project / case study for the balatinac.dev portfolio site.

## Input

The user will describe the project. Ask clarifying questions if needed before writing.

## Instructions

1. **Gather info** — If the user hasn't provided all of these, ask:
   - Project title
   - Brief description (one sentence for listings)
   - Tags (common tags: `typo3`, `php`, `devops`, `api`, `tooling`)
   - Year completed
   - Duration (e.g., `"9 months"` / `"9 Monate"`)
   - Your role (e.g., `"Lead Backend"`, `"Solo"`)
   - Team composition (e.g., `"3 devs · 2 editors"`)
   - Status (`"Live"`, `"In progress"`, `"Internal"`)
   - Whether it should be featured on the homepage (`featured: true/false`)

2. **Generate a URL-safe slug** from the title (lowercase, hyphens, no special chars). Example: `multi-site-typo3-platform`

3. **Determine the `order` number** by reading existing projects in `src/content/projects/*.md` (exclude `de/` subfolder). Find the highest `order` value and add 1.

4. **Write TWO markdown files** with the following structure:

### English file: `src/content/projects/{slug}.md`

```markdown
---
title: "English project title"
description: "One-sentence English description for listings and SEO."
tags: ["tag1", "tag2"]
year: 2025
order: N
featured: true/false
publishedAt: YYYY-MM-DD
meta:
  duration: "X months"
  role: "Role here"
  team: "Team composition"
  status: "Live"
---

## Context

What was the situation before this project? What problem existed?

## The problem

What made this hard? List the specific challenges:

- Challenge one with detail.
- Challenge two with detail.
- Challenge three with detail.

> A punchy one-liner summarizing the core tension.

## Approach

### Sub-approach 1

What you did and why.

### Sub-approach 2

What you did and why.

## Stack & decisions

- **Tech A** — why this choice.
- **Tech B** — why this choice.

### Things we said no to

What you deliberately didn't do and why.

## Results

Concrete outcomes — numbers if possible.

## Lessons

- **Lesson one.** Explanation.
- **Lesson two.** Explanation.
```

### German file: `src/content/projects/de/{slug}.md`

```markdown
---
title: "German project title"
description: "German one-sentence description for listings."
tags: ["tag1", "tag2"]
year: 2025
order: N
featured: true/false
publishedAt: YYYY-MM-DD
meta:
  duration: "X Monate"
  role: "German role"
  team: "German team composition"
  status: "Live"
---

## Kontext

German context...

## Das Problem

German problem description...

## Ansatz

### German sub-approach

...

## Stack & Entscheidungen

...

## Ergebnisse

...

## Erkenntnisse

...
```

## Writing Style

Match the voice of existing case studies on balatinac.dev:
- **Tone**: Practical, understated, occasionally dry humor. "The boring choice is usually the right one."
- **Structure**: Numbered sections with `## Heading` (Context → Problem → Approach → Stack → Results → Lessons).
- **Lists**: Dash-style (`- **Bold lead.** Explanation.`) for stack decisions and lessons.
- **Blockquotes**: `>` for memorable one-liners about the project.
- **Code blocks**: Only if there's a concrete, illustrative snippet (deploy scripts, config examples).
- **No fluff**: Skip "In today's fast-paced world..." — go straight to what happened and why.

## Important

- The German version is a **proper translation**, not machine-literal. It should read naturally in German.
- Both files MUST have **identical** `tags`, `year`, `order`, `featured`, and `publishedAt` values.
- The `meta.duration` and `meta.team` should be translated (e.g., `"months"` → `"Monate"`, `"devs"` → `"Devs"`, `"editors"` → `"Redakteure"`).
- Tags should be **lowercase**.
- Filenames must match exactly: `{slug}.md` and `de/{slug}.md`.
- The `order` number must be unique and sequential — read existing files to determine the next value.

$ARGUMENTS
