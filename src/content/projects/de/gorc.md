---
title: "gorc — eine Conductor-Flotte für opencode"
description: "Ein opencode-Plugin, das einen primären Conductor-Agenten plus vier billige Subagenten liefert — Research, Reader, Implementer, QA — mit einer Delegationsgrenze, die der Conductor nicht versehentlich aufweiten kann."
urlSlug: "gorc"
tags: ["opencode", "agents", "typescript", "plugin"]
year: 2026
order: 1
featured: true
publishedAt: 2026-07-06
meta:
  duration: "Frühjahr 2026"
  role: "Autor & Maintainer"
  team: "Solo"
  status: "Veröffentlicht · v0.1.2"
---

Das teuerste Modell der Flotte las Dateien. Das war der Fehler.

Ich hatte eine Weile mit [opencode](https://opencode.ai) gearbeitet — dem Open-Source-Coding-Agent-CLI — und mir fiel immer dasselbe auf: das starke, teure Modell verbrachte seinen Zug damit, eine Codebase zu durchsuchen, ein README zusammenzufassen, ein Rename über zwölf Dateien zu ziehen. Wenn es ans eigentliche Denken ging, war halb das Kontextfenster weg, und der schwere Teil der Aufgabe bekam die billige Aufmerksamkeit des Modells.

Die Lösung war kein schlauereres Modell. Sondern eine bessere Arbeitsteilung. `gorc` ist diese Arbeitsteilung, verpackt als opencode-Plugin.

## Ein Agent, der denkt, vier, die arbeiten

`gorc` liefert fünf Agenten. Nur einer davon — der **Conductor** — ist ein primärer Agent. Er plant, denkt, delegiert. Die anderen vier sind Subagenten, jeweils auf einem billigeren Modell, jeweils auf eine Art Hilfsarbeit begrenzt:

- **`go-research`** — Websuche, Web-Fetch und nur-lesendes Erkunden unbekannten Codes. Der einzige Subagent mit Webzugriff.
- **`go-reader`** — gezielte Lesezugriffe auf Code, dessen Ort der Conductor schon kennt. Der am stärksten eingesperrte Agent der Flotte: lesen, grep, glob, sonst nichts.
- **`go-implementer`** — der einzige Subagent, der editieren und bash ausführen darf. Er wendet geplante Edits an, führt den Build aus und verifiziert seine eigene Arbeit.
- **`go-qa`** — nur-lesende Testbarkeits-Prüfung. Er liest, was der Implementer gerade geschrieben hat, und liefert eine Einschätzung in einem Wort: `testable`, `nearly` oder `not testable`.

> Das teure Modell darf niemals das sein, das Dateien durchwühlt. Es muss das sein, das entscheidet, welche Dateien durchwühlt werden.

Der Conductor ist der einzige Agent mit `task`-Berechtigung — dem Tool, das einen Subagenten startet. Die vier Subagenten können nicht weiter delegieren, also gibt es keine Delegationsketten und keine entlaufenden Agent-Bäume.

## Eine Grenze, die man nicht versehentlich aufweitet

Das ist der Teil, der mir am wichtigsten war. Viele Agent-Setups haben ein Muster „Hauptagent delegiert an Helfer“. Der Fehlermodus ist immer derselbe: die Grenze ist ein Vorschlag, und über eine lange Session hinweg driftet sie. Der Conductor delegiert irgendwann an alles, was gerade da ist. Die Flotte leckt.

`gorc` verhindert das auf Plugin-Ebene. Nach dem Injizieren der Agenten schreibt das Plugin die `task`-Berechtigung des Conductors bedingungslos neu:

```ts
task: {
  "*": "deny",
  "go-research": "allow",
  "go-reader": "allow",
  "go-implementer": "allow",
  "go-qa": "allow",
}
```

Dieser Stempel läuft, egal ob der Conductor vom Plugin injiziert oder vom Benutzer in der eigenen Konfig definiert wurde. Man kann den Prompt des Conductors überschreiben, sein Modell, seine anderen Berechtigungen — aber die `task`-Grenze wird bei jedem Init neu gestempelt. Die Flotte lässt sich nicht aufweiten, ohne das Plugin zu forken.

Kein Subagent bekommt `task` überhaupt. Der Implementer darf editieren und bash ausführen, aber keine Helfer starten. Der Reader darf keine Rückfragen stellen. Jeder Agent ist auf seine Spur festgenagelt.

## Prompts als Markdown, nicht als Template-Strings

Jeder System-Prompt eines Agenten liegt in einer benachbarten `.md`-Datei — `agents/conductor.md`, `agents/go-qa.md` und so weiter — und wird beim Plugin-Init per `fs.readFileSync` von der Platte gelesen. Nicht zur Build-Zeit in ein TypeScript-Template-Literal inlineiert.

Das klingt nach einer Nicht-Entscheidung. Ist es nicht. Agent-Prompts stecken voller Backticks, Code-Fences und spitzen Klammern. Sobald man einen in ein TS-Template-Literal stopft, escaped man ein Leben lang — oder man inlinet den Prompt als Base64-Blob, was schlimmer ist. Prompts als reine Markdown-Dateien zu halten bedeutet: sie sind diffbar, editierbar und in jedem Editor lesbar. Der Build-Schritt fasst sie nicht an; das Paket liefert sie unverändert neben `dist/index.js` aus.

## `/test`, und die Weigerung, automatisch zu schleifen

`gorc` liefert einen `/test`-Befehl. Er nimmt die Pfade, die in der Session zuletzt editiert wurden — oder einen Pfad, den man ihm gibt — und delegiert sie an `go-qa`. `go-qa` liest den Code und liefert sein Urteil.

Hier kommt der Teil, der Zurückhaltung brauchte: der Befehl leitet das Urteil **nicht** an `go-implementer` für einen automatischen Fix weiter. Er zeigt die Empfehlung und stoppt. Der Conductor — oder der Mensch, der ihn steuert — entscheidet, ob sich eine zweite Implementer-Runde lohnt.

Auto-Schleifen „fix, was QA gefunden hat“ klingt produktiv. In der Praxis verbrennt sie Tokens damit, Dinge zu polieren, die nicht wichtig waren, und sie versteckt dem Menschen die Einschätzungs-Entscheidung. Die langweilige Wahl — Urteil weiterreichen, eine Person entscheiden lassen — ist hier die richtige.

## Klein gebaut

- **Keine Runtime-Abhängigkeiten.** Die einzige Dev-Abhängigkeit sind die opencode-Plugin-SDK-Typen. Das ausgelieferte `dist/index.js` ist eine einzige gebundelte Datei ohne eigenes `node_modules`.
- **Bun für den Build**, Node als Ziel. `bun build src/index.ts --outfile dist/index.js --target node`.
- **Tests sind pures `node:assert/strict`** — kein Vitest, kein Jest, kein Runner. Fünf Szenarien in einer Datei: leere Konfig, Options-Overrides, eigener Agent wird nicht überschrieben, default-Agent wird nicht überschrieben, Delegations-Logging. `bun ./test/smoke.mjs`.
- **Veröffentlicht via npm Trusted Publishing** — OIDC bei Tag-Push, `npm publish --provenance`. Das Paket auf npm ist kryptografisch mit dem GitHub-Actions-Lauf und dem Commit verknüpft, der es erzeugt hat. Kein langlebiger npm-Token in einem Secret.

## Was ich gelernt habe

Das Flotten-Muster funktioniert, weil die Modelle nicht symmetrisch sind. Ein billiges Modell, das drei Dateien liest und eine Zusammenfassung zurückgibt, ist billig. Ein teures Modell, das dasselbe tut, ist teuer *und* verschwendet. Der Gewinn ist nicht „mehr Agenten“ — es ist, die richtige Modell-Stufe auf die richtige Arbeit-Stufe zu legen, und die Grenze dazwischen strukturell statt habituell zu machen.

Dazu habe ich gelernt, dass die verteidigungsstärkste Zeile Code im ganzen Plugin der Berechtigungs-Stempel ist. Features kommen dazu; Prompts werden getweakt; Modelle werden getauscht. Das eine, was jede zukünftige Änderung überstehen muss, ist die Garantie, dass der Conductor nur an die vier Agenten delegieren kann, an die er soll. Alles andere ist verhandelbar. Das nicht.

`gorc` liegt [auf GitHub](https://github.com/balatD/gorc) und [auf npm](https://www.npmjs.com/package/@balatd/gorc) als `@balatd/gorc`. MIT.

*— DB, geschrieben während sein Conductor leise die Hilfsarbeit an ein Modell delegierte, das einen Zehntel kostet.*
