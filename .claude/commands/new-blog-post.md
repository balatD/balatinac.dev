# New Blog Post

Create a new bilingual (EN + DE) blog post for the balatinac.dev portfolio site.

## Input

The user will describe the blog post topic. Ask clarifying questions if needed before writing.

## Instructions

1. **Gather info** — If the user hasn't provided all of these, ask:
   - Topic / title idea
   - Brief description of what the post should cover
   - Tags (common tags: `typo3`, `php`, `devops`, `tooling`, `api`)
   - Whether it should be a draft (`draft: true`) or published (`draft: false`)

2. **Generate a URL-safe slug** from the title (lowercase, hyphens, no special chars). Example: `coolify-backup-strategy`

3. **Determine the next values:**
   - `publishedAt`: Use today's date in `YYYY-MM-DD` format
   - `readTime`: Estimate based on content length (e.g., `"~7 min"` / `"~7 Min."`)

4. **Write TWO markdown files** with the following structure:

### English file: `src/content/blog/{slug}.md`

```markdown
---
title: "English title here"
description: "One-sentence English summary for listings and SEO."
tags: ["tag1", "tag2"]
publishedAt: YYYY-MM-DD
readTime: "~X min"
draft: true/false
---

Opening paragraph — a hook or lede that sets up the problem.

## First Section Heading

Body content...

## Second Section Heading

Body content...

---

## Closing

Wrap-up paragraph.

*— DB, written [witty sign-off context].*
```

### German file: `src/content/blog/de/{slug}.md`

```markdown
---
title: "German title here"
description: "German one-sentence summary for listings."
tags: ["tag1", "tag2"]
publishedAt: YYYY-MM-DD
readTime: "~X Min."
draft: true/false
---

German opening paragraph...

## German Section Heading

German body content...
```

## Writing Style

Match the voice of existing posts on balatinac.dev:
- **Tone**: Dry, honest, slightly self-deprecating. Technical but not academic.
- **Structure**: Short paragraphs. Concrete examples over abstractions. Code snippets where they help.
- **Lists**: Use dash-style (`- item`) for unordered, numbered for sequential steps.
- **Blockquotes**: Use `>` for pull quotes — punchy one-liners that summarize a section.
- **Code blocks**: Fenced with triple backticks. Add comments for context.
- **Closing**: Always end with a `---` separator, a "Closing" section, and a sign-off in italics.

## Important

- The German version is a **proper translation**, not a machine-literal one. It should read naturally in German.
- Both files MUST have **identical** `tags`, `publishedAt`, and `draft` values.
- The `readTime` should use `"min"` for English and `"Min."` for German.
- Tags should be **lowercase**.
- Filenames must match exactly: `{slug}.md` and `de/{slug}.md`.

$ARGUMENTS
