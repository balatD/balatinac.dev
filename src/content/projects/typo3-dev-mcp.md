---
title: "typo3-dev-mcp — live TYPO3 context for AI agents"
description: "A development-only MCP server that exposes TYPO3's resolved runtime state to AI assistants — with guarded tools, a multi-agent installer, and benchmarks measuring where the context pays off."
tags: ["typo3", "mcp", "ai", "php"]
year: 2026
order: 2
featured: true
publishedAt: 2026-08-12
meta:
  duration: "Summer–autumn 2026"
  role: "Author & Maintainer"
  team: "Solo"
  status: "Shipped · v1.2.1"
---

The answer an AI needed existed in TYPO3. Just not in any one file.

Ask for a table's actual TCA, the effective site settings after dependency resolution, or the final TypoScript value for a page and a coding agent has a problem. It can inspect extension files and configuration fragments, but TYPO3 compiles, merges, decorates, and caches much of its real state at runtime. The agent is left reconstructing the application from clues — slowly, and sometimes incorrectly.

[`typo3-dev-mcp`](https://github.com/balatD/typo3-dev-mcp) is a development-only MCP server for TYPO3 13.4 and 14. It boots inside the application and gives AI assistants a typed view of the system TYPO3 is actually running.

## Read the application, not the clues

The server exposes tools across four areas:

- **Application and data** — installed versions and extensions, database schema, guarded SQL queries, sites, languages, TCA and content elements.
- **Resolved configuration** — compiled TypoScript, Page TSconfig, site sets, FlexForms, middleware order and selected `TYPO3_CONF_VARS` values.
- **API discovery** — ViewHelpers with their exact arguments, PSR-14 events and listeners, backend modules, console commands and installed Content Blocks.
- **Documentation and diagnostics** — version-pinned TYPO3 documentation, core changelog entries, extension compatibility and structured log errors.

The distinction is important. Reading `Configuration/TCA/Overrides/tt_content.php` shows one input. Asking `tca_schema` shows the merged schema after every active extension has had its say. Reading a site-set definition shows its defaults. Asking `site_sets` shows the effective value after dependencies and site overrides.

> The useful context is often not hidden. It simply does not exist until TYPO3 resolves it.

## Installation that leaves the project understandable

The package installs as a development dependency:

```bash
composer require --dev balatd/typo3-dev-mcp
vendor/bin/typo3 devmcp:install
```

The installer does two jobs. It registers the stdio server with the project's agents — Claude Code, Codex, Cursor, VS Code (Copilot) and OpenCode, each in its own project-scoped config file — automatically using `ddev exec` when DDEV is present. It also writes a tool reference into `.ai/guidelines/typo3.md`, imports it into `CLAUDE.md` and copies it into `AGENTS.md`, between idempotent markers. The copy is deliberate: Codex and OpenCode read `AGENTS.md` as text and do not follow links, so a link meant their agents never saw the reference.

That second part matters as much as the protocol, and it got smaller over time. The early alphas composed seven files of TYPO3 framework advice — use PSR-14 events, don't hardcode fileadmin paths, escape output. A competent agent already knows all of that, and every request paid for it as context. The guidelines are now a tool reference and nothing else: which tools exist and what each one reports, cut from 9,806 to 2,304 characters. Existing project instructions remain intact, and running the installer again refreshes its own block rather than duplicating it.

## A development tool needs a hard safety boundary

Giving an agent live application access can easily become a disguised remote shell. This server deliberately does not expose one.

- Tools are read-only by default and carry MCP `readOnlyHint` annotations.
- Configuration values that look like passwords, encryption keys or tokens are masked before leaving TYPO3.
- `database_query` accepts only `SELECT`, `SHOW`, `EXPLAIN`, `DESCRIBE` and `WITH` unless the developer explicitly sets `DEV_MCP_ALLOW_WRITE=1`.
- Only documentation search and extension lookup use the network; `DEV_MCP_NO_NETWORK=1` disables both while leaving local tools available.
- `flush_cache` is the sole state-changing tool.
- There is no arbitrary PHP or command-execution tool.

An early alpha did include a double-gated `tinker` tool. I removed it. A feature that turns contextual access into code execution weakens every other safety claim, even when hidden behind opt-ins.

## Extensible without owning every project convention

TYPO3 projects carry knowledge no generic package can provide. A sitepackage may need to expose deployment targets, editorial rules, domain-specific records or its own diagnostics.

Any extension can add a tool by implementing one interface:

```php
final class ProjectInfoTool implements ToolInterface
{
    public function getName(): string
    {
        return 'project_info';
    }

    public function getDescription(): string
    {
        return 'Project-specific conventions the AI should know.';
    }

    public function getInputSchema(): array
    {
        return ['type' => 'object', 'properties' => new \stdClass()];
    }

    public function isReadOnly(): bool
    {
        return true;
    }

    public function execute(array $arguments): mixed
    {
        return ['deployTarget' => 'staging.example.com'];
    }
}
```

TYPO3's normal service autoconfiguration discovers it. Three PSR-14 events let projects add, remove or replace tools; adjust arguments, answer a call themselves or veto it before execution; and post-process successful results for extra masking or audit logging. The extension supplies the transport and conventions without becoming a registry of every possible project concern.

## Measuring the claim instead of repeating it

“The agent feels faster” is not evidence, so the repository includes an A/B benchmark against a normal Claude Code session with full file and shell access.

The harness builds host-mounted TYPO3 13.4 and 14.3 projects, seeds live state through a fixture extension, generates ground truth independently of the MCP server, resets the database and worktree between runs, and grades 17 tasks across live-state questions, code changes, debugging and negative controls.

The current sweep is 680 runs on `claude-opus-5-5`, with 1.0.0 and 1.1.0 under one harness. On questions about the running installation — TCA, compiled TypoScript, FlexForms, site sets — the median cost per task fell from **$0.079 to $0.032** on TYPO3 13.4 and from **$0.076 to $0.035** on 14.3: 59% and 53% cheaper, winning all eight live-state tasks on both. The widest case is resolving `lib.contentElement.templateRootPaths` after site-set merging, where the baseline read 4.4× the tokens rebuilding a value that exists in no single source file.

The honest result is more useful than a victory lap:

- Task success was 100% in both arms — 520 of 520 checker-graded runs — and no judged answer contained a hallucinated claim. A competent agent with grep and a shell solved everything. The tools buy efficiency, not capability.
- Debugging and small tasks are not cheaper across the board. One debugging task still costs about $0.03 more while the agent double-checks the tools' answer.
- In Claude Code the server adds about 1,700 tokens to every request, used or not — schemas load on demand there. A client that loads every schema up front pays about 6,400.
- The installed arm includes both the tools and the generated guidelines, so the benchmark does not yet isolate how much each contributes.

The harness needed the same scrutiny as the product. A stray auto-memory note had skewed every TYPO3 13 run of the first 1.0.0 sweep, so those figures were withdrawn, and the harness now clears memory before every run.

## The benchmark found a bug

The most useful thing the benchmark produced was not a percentage. It was a defect.

In 1.0.0, the server booted TYPO3 once and answered every call from that process. An agent that had just added a TCA field and asked `tca_schema` to check its work was told the field did not exist — even after `flush_cache`. Code changes cost 61–87% more than the baseline.

1.1.0 runs every call in a fresh `typo3 devmcp:call` process. That adds about 0.1–0.25 seconds per call, the responses are byte-identical to before, and code changes are back at parity with the baseline. `flush_cache` now runs core's `cache:flush`, so new listeners and services actually appear.

Earlier rounds had already changed the product. The largest log and application-info responses shrank by 87–89% with optional full payloads, `get_config` stopped returning 74 KB subtrees, `get_url` was removed after zero calls in 170 runs, and the guidelines stopped recommending an unconditional tool call at the start of every session.

## Built against two TYPO3 generations

The package targets PHP 8.2 through 8.5 and TYPO3 13.4 and 14. CI runs the unit tests on all eight combinations, the functional suite on both majors, and a `--prefer-lowest` job that proves the declared dependency floor. The functional suite executes all 23 tools against a booted TYPO3 and checks every input schema — a single malformed schema makes MCP clients reject the whole `tools/list`. A DDEV harness runs both TYPO3 generations side by side, while PHPStan level 8 and TYPO3 coding standards cover the rest.

Some of TYPO3's most valuable runtime information is exposed only through APIs marked `@internal`. Those integrations are isolated, verified against both supported majors, and designed to fail with an actionable tool error instead of crashing the server when core changes shape.

1.0 came with a deliberately narrow promise. Semantic versioning covers `ToolInterface`, the three events, the two command names and the two environment flags. It does not cover the shape of what a tool returns: three of the eight alphas shrank a payload, that work is not finished, and pinning payloads to the major version would have priced it out.

## What I learned

Context tools should not try to make an agent omnipotent. They should make a small class of expensive questions cheap and exact.

The surprising work was not implementing more tools. It was deciding what *not* to return, when not to call anything, and which capability should not exist at all. A 16 KB stack trace is useful in a terminal and wasteful in a conversation. Twenty-three schemas are powerful on TYPO3 work and pure tax on an unrelated refactor. Arbitrary execution is convenient and incompatible with a narrow trust boundary.

The benchmark made those trade-offs visible, and it caught the bug no unit test would have: a server that answered correctly about the state it booted with and wrongly about the state the agent had just created. That is the part I want to keep: not “MCP makes AI better,” but a narrower claim with numbers, limits, and an architecture that can be adjusted when the evidence disagrees.

`typo3-dev-mcp` is [available on GitHub](https://github.com/balatD/typo3-dev-mcp), [Packagist](https://packagist.org/packages/balatd/typo3-dev-mcp) and in the [TER](https://extensions.typo3.org/extension/dev_mcp) as `dev_mcp`. MIT, development environments only.
