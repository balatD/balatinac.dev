---
title: "typo3-dev-mcp — live TYPO3 context for AI agents"
description: "A development-only MCP server that exposes TYPO3's resolved runtime state to AI assistants — with guarded tools, composable project guidance, and benchmarks measuring where the context pays off."
tags: ["typo3", "mcp", "ai", "php"]
year: 2026
order: 2
featured: true
publishedAt: 2026-08-12
meta:
  duration: "Summer 2026"
  role: "Author & Maintainer"
  team: "Solo"
  status: "Public alpha · 0.1.0-alpha.6"
---

The answer an AI needed existed in TYPO3. Just not in any one file.

Ask for a table's actual TCA, the effective site settings after dependency resolution, or the final TypoScript value for a page and a coding agent has a problem. It can inspect extension files and configuration fragments, but TYPO3 compiles, merges, decorates, and caches much of its real state at runtime. The agent is left reconstructing the application from clues — slowly, and sometimes incorrectly.

[`typo3-dev-mcp`](https://github.com/balatD/typo3-dev-mcp) is a development-only MCP server for TYPO3 13.4 and 14. It boots inside the application and gives AI assistants a typed view of the system TYPO3 is actually running.

## Read the application, not the clues

The server exposes tools across four areas:

- **Application and data** — installed versions and extensions, database schema, guarded SQL queries, sites, languages, TCA, content elements and routed URLs.
- **Resolved configuration** — compiled TypoScript, Page TSconfig, site sets, FlexForms, middleware order and selected `TYPO3_CONF_VARS` values.
- **API discovery** — ViewHelpers with their exact arguments, PSR-14 events and listeners, backend modules, console commands and installed Content Blocks.
- **Documentation and diagnostics** — version-pinned TYPO3 documentation, core changelog entries, extension compatibility and structured log errors.

The distinction is important. Reading `Configuration/TCA/Overrides/tt_content.php` shows one input. Asking `tca_schema` shows the merged schema after every active extension has had its say. Reading a site-set definition shows its defaults. Asking `site_sets` shows the effective value after dependencies and site overrides.

> The useful context is often not hidden. It simply does not exist until TYPO3 resolves it.

## Installation that leaves the project understandable

The package installs as a development dependency:

```bash
composer require --dev "balatd/typo3-dev-mcp:^0.1@alpha"
vendor/bin/typo3 devmcp:install
```

The installer does two jobs. It registers the stdio server in the project's `.mcp.json`, automatically using `ddev exec` when DDEV is present. It also composes version-specific TYPO3 guidance into `.ai/guidelines/typo3.md` and links that file from `CLAUDE.md` or `AGENTS.md` between idempotent markers.

That second part matters as much as the protocol. Tools answer questions; guidance teaches the agent when to ask them, which TYPO3 conventions to follow, and when ordinary file reading is the cheaper choice. Existing project instructions remain intact, and running the installer again updates its own block rather than duplicating it.

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

TYPO3's normal service autoconfiguration discovers it. Three PSR-14 events let projects add or replace tools, adjust or reject arguments before execution, and post-process successful results for extra masking or audit logging. The extension supplies the transport and conventions without becoming a registry of every possible project concern.

## Measuring the claim instead of repeating it

“The agent feels faster” is not evidence, so the repository includes an A/B benchmark against a normal Claude Code session with full file and shell access.

The harness builds a host-mounted TYPO3 13.4 project, seeds live state through a fixture extension, generates ground truth independently of the MCP server, resets the database and worktree between runs, and grades 17 tasks across live-state questions, code changes, debugging and negative controls.

Across 170 runs on `claude-opus-5`, live-state tasks moved from **$0.208 and 10 turns** at baseline to **$0.097 and 4 turns** with the installation: 53% lower cost and 60% fewer turns. In the widest case, resolving a TypoScript value after site-set merging saved 458,000 tokens because the baseline had to reconstruct a value that existed in no single source file.

The honest result is more useful than a victory lap:

- Task success was 100% in both arms. The tools improved efficiency and reliability, not capability.
- Debugging cost slightly more with the server, but measured hallucination dropped from 7% to 0%.
- The tool schemas add roughly 6,800 tokens to every request, even when no tool is used.
- The installed arm includes both tools and generated guidance, so the benchmark does not yet isolate how much each contributes.

Those findings changed the product. The largest log and application-info responses were reduced by 87–89%, optional full payloads were added, and the guidance stopped recommending an unconditional tool call at the start of every session.

## Built against two TYPO3 generations

The package targets PHP 8.2 through 8.4 and TYPO3 13.4 and 14. CI covers all six combinations. A DDEV harness runs both TYPO3 generations side by side, while PHPUnit, PHPStan level 8 and TYPO3 coding standards cover the PHP implementation.

Some of TYPO3's most valuable runtime information is exposed only through APIs marked `@internal`. Those integrations are isolated, verified against both supported majors, and designed to fail with an actionable tool error instead of crashing the server when core changes shape. The public alpha label is intentional: the value is real, but these boundaries still need production mileage before 1.0.

## What I learned

Context tools should not try to make an agent omnipotent. They should make a small class of expensive questions cheap and exact.

The surprising work was not implementing more tools. It was deciding what *not* to return, when not to call anything, and which capability should not exist at all. A 16 KB stack trace is useful in a terminal and wasteful in a conversation. Twenty-four schemas are powerful on TYPO3 work and pure tax on an unrelated refactor. Arbitrary execution is convenient and incompatible with a narrow trust boundary.

The benchmark made those trade-offs visible. That is the part I want to keep: not “MCP makes AI better,” but a narrower claim with numbers, limits, and an architecture that can be adjusted when the evidence disagrees.

`typo3-dev-mcp` is [available on GitHub](https://github.com/balatD/typo3-dev-mcp) and [Packagist](https://packagist.org/packages/balatd/typo3-dev-mcp). MIT, public alpha, development environments only.
