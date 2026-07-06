---
title: "gorc — a conductor fleet for opencode"
description: "An opencode plugin that ships a conductor primary agent plus four budget subagents — research, reader, implementer, QA — with a delegation boundary the conductor can't widen by accident."
tags: ["opencode", "agents", "typescript", "plugin"]
year: 2026
order: 1
featured: true
publishedAt: 2026-07-06
meta:
  duration: "Spring 2026"
  role: "Author & Maintainer"
  team: "Solo"
  status: "Shipped · v0.1.2"
---

The most expensive model in the fleet was reading files. That was the bug.

I'd been working with [opencode](https://opencode.ai) — the open-source coding agent CLI — and kept noticing the same thing: the strong, costly model would spend its turn grepping a codebase, summarizing a README, applying a rename across twelve files. By the time it got to the actual reasoning, half the context window was gone, and the hard part of the task got the cheap end of the model's attention.

The fix wasn't a smarter model. It was a better division of labor. `gorc` is that division, packaged as an opencode plugin.

## One agent that thinks, four that grind

`gorc` ships five agents. Only one of them — the **conductor** — is a primary agent. It plans, reasons, and delegates. The other four are subagents, each on a cheaper model, each scoped to one kind of grunt work:

- **`go-research`** — web search, web fetch, and read-only exploration of unfamiliar code. The only subagent with web access.
- **`go-reader`** — targeted reads of code the conductor already knows the location of. The most locked-down agent in the fleet: read, grep, glob, nothing else.
- **`go-implementer`** — the only subagent allowed to edit and run bash. It applies planned edits, runs the build, and verifies its own work.
- **`go-qa`** — read-only testability review. It reads what the implementer just wrote and returns a one-word verdict: `testable`, `nearly`, or `not testable`.

> The expensive model should never be the one trawling files. It should be the one deciding which files get trawled.

The conductor is the only agent with `task` permission — the tool that spawns a subagent. The four subagents can't delegate further, so there are no delegation chains and no runaway agent trees.

## A boundary that can't be widened by accident

This is the part I cared about most. Plenty of agent setups have a "main agent delegates to helpers" pattern. The failure mode is always the same: the boundary is a suggestion, and over a long session it drifts. The conductor starts delegating to whatever's handy. The fleet leaks.

`gorc` prevents that at the plugin level. After injecting the agents, the plugin unconditionally rewrites the conductor's `task` permission:

```ts
task: {
  "*": "deny",
  "go-research": "allow",
  "go-reader": "allow",
  "go-implementer": "allow",
  "go-qa": "allow",
}
```

That stamp runs whether the conductor was injected by the plugin or defined by the user in their own config. You can override the conductor's prompt, its model, its other permissions — but the `task` boundary is force-stamped on every init. The fleet can't be widened without forking the plugin.

No subagent gets `task` at all. The implementer can edit and run bash but can't spawn helpers. The reader can't ask clarifying questions. Each agent is pinned to its lane.

## Prompts as markdown, not template literals

Every agent's system prompt lives in a sibling `.md` file — `agents/conductor.md`, `agents/go-qa.md`, and so on — read from disk at plugin init via `fs.readFileSync`. Not inlined into a TypeScript template literal at build time.

That sounds like a nothing decision. It isn't. Agent prompts are full of backticks, code fences, and angle brackets. The moment you stuff one into a TS template literal, you're escaping for the rest of your life — or you inline the prompt as a base64 blob, which is worse. Keeping prompts as plain markdown files means they're diffable, editable, and readable in any editor. The build step doesn't touch them; the package ships them as-is alongside `dist/index.js`.

## `/test`, and the refusal to auto-loop

`gorc` ships a `/test` command. It takes the paths most recently edited in the session — or a path you hand it — and delegates them to `go-qa`. `go-qa` reads the code and returns its verdict.

Here's the part that took restraint: the command does **not** forward that verdict to `go-implementer` for an automatic fix. It surfaces the recommendation and stops. The conductor — or the human driving it — decides whether a second implementer round is worth it.

Auto-looping "fix what QA found" sounds productive. In practice it burns tokens polishing things that didn't matter, and it hides the human from the judgment call. The boring choice — relay the verdict, let a person decide — is the right one here.

## Built small

- **Zero runtime dependencies.** The only dev dependency is the opencode plugin SDK types. The shipped `dist/index.js` is a single bundled file with no `node_modules` of its own.
- **Bun for the build**, Node target for the output. `bun build src/index.ts --outfile dist/index.js --target node`.
- **Tests are plain `node:assert/strict`** — no Vitest, no Jest, no runner. Five scenarios in one file: empty config, option overrides, user-defined-agent-not-clobbered, default-agent-not-clobbered, and delegation logging. `bun ./test/smoke.mjs`.
- **Published via npm Trusted Publishing** — OIDC on tag push, `npm publish --provenance`. The package on npm is cryptographically linked to the GitHub Actions run and commit that produced it. No long-lived npm token sitting in a secret.

## What I learned

The fleet pattern works because the models aren't symmetric. A cheap model reading three files and returning a summary is cheap. An expensive model doing the same is expensive *and* wasted. The win isn't "more agents" — it's putting the right tier of model on the right tier of work, and making the boundary between them structural instead of habitual.

I also learned that the most defensive line of code in the whole plugin is the permission stamp. Features get added; prompts get tweaked; models get swapped. The one thing that has to survive every future change is the guarantee that the conductor can only delegate to the four agents it's supposed to. Everything else is negotiable. That isn't.

`gorc` is [on GitHub](https://github.com/balatD/gorc) and [on npm](https://www.npmjs.com/package/@balatd/gorc) as `@balatd/gorc`. MIT.

*— DB, written while his conductor was quietly delegating the grunt work to a model a tenth of the price.*
