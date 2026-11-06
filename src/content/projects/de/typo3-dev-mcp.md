---
title: "typo3-dev-mcp — Live-TYPO3-Kontext für KI-Agenten"
description: "Ein MCP-Server nur für die Entwicklung, der KI-Assistenten den aufgelösten Laufzeit-Zustand von TYPO3 zeigt — mit abgesicherten Tools, einem Installer für mehrere Agenten und Benchmarks, die Nutzen und Kontextkosten messen."
urlSlug: "typo3-dev-mcp"
tags: ["typo3", "mcp", "ai", "php"]
year: 2026
order: 2
featured: true
publishedAt: 2026-08-12
meta:
  duration: "Sommer–Herbst 2026"
  role: "Autor & Maintainer"
  team: "Solo"
  status: "Veröffentlicht · v1.2.1"
---

Die Antwort, die eine KI brauchte, existierte in TYPO3. Nur nicht in einer einzelnen Datei.

Fragt man nach der tatsächlichen TCA einer Tabelle, den effektiven Site-Settings nach der Dependency-Auflösung oder dem finalen TypoScript-Wert einer Seite, hat ein Coding-Agent ein Problem. Er kann Extension-Dateien und Konfigurationsfragmente lesen, aber TYPO3 kompiliert, merged, dekoriert und cached einen großen Teil seines echten Zustands zur Laufzeit. Der Agent muss die Anwendung aus Indizien rekonstruieren — langsam und manchmal falsch.

[`typo3-dev-mcp`](https://github.com/balatD/typo3-dev-mcp) ist ein MCP-Server nur für Entwicklungsumgebungen mit TYPO3 13.4 und 14. Er bootet innerhalb der Anwendung und gibt KI-Assistenten eine typisierte Sicht auf das System, das TYPO3 tatsächlich ausführt.

## Die Anwendung lesen, nicht die Indizien

Der Server stellt Tools in vier Bereichen bereit:

- **Anwendung und Daten** — installierte Versionen und Extensions, Datenbankschema, abgesicherte SQL-Abfragen, Sites, Sprachen, TCA und Content-Elemente.
- **Aufgelöste Konfiguration** — kompiliertes TypoScript, Page TSconfig, Site Sets, FlexForms, Middleware-Reihenfolge und ausgewählte `TYPO3_CONF_VARS`-Werte.
- **API-Erkundung** — ViewHelper mit exakten Argumenten, PSR-14-Events und Listener, Backend-Module, Console Commands und installierte Content Blocks.
- **Dokumentation und Diagnose** — auf die installierte Major-Version begrenzte TYPO3-Dokumentation, Core-Changelog, Extension-Kompatibilität und strukturierte Log-Fehler.

Der Unterschied ist entscheidend. `Configuration/TCA/Overrides/tt_content.php` zu lesen zeigt einen Input. `tca_schema` abzufragen zeigt das gemergte Schema, nachdem jede aktive Extension ihre Änderungen eingebracht hat. Eine Site-Set-Definition zeigt Defaults. `site_sets` zeigt den effektiven Wert nach Dependencies und Site-Overrides.

> Der nützliche Kontext ist oft nicht versteckt. Er existiert nur erst, nachdem TYPO3 ihn aufgelöst hat.

## Installation, die das Projekt verständlich lässt

Das Paket wird als Development-Dependency installiert:

```bash
composer require --dev balatd/typo3-dev-mcp
vendor/bin/typo3 devmcp:install
```

Der Installer erledigt zwei Aufgaben. Er registriert den Stdio-Server bei den Agenten des Projekts — Claude Code, Codex, Cursor, VS Code (Copilot) und OpenCode, jeweils in deren projektbezogener Konfigurationsdatei — und verwendet automatisch `ddev exec`, wenn DDEV erkannt wird. Außerdem schreibt er eine Tool-Referenz nach `.ai/guidelines/typo3.md`, importiert sie in `CLAUDE.md` und kopiert sie in `AGENTS.md`, jeweils zwischen idempotenten Markern. Die Kopie ist Absicht: Codex und OpenCode lesen `AGENTS.md` als Text und folgen keinen Links, mit einem Link hätten ihre Agenten die Referenz also nie gesehen.

Dieser zweite Teil ist genauso wichtig wie das Protokoll, und er ist mit der Zeit kleiner geworden. Die frühen Alphas komponierten sieben Dateien mit TYPO3-Framework-Ratschlägen — PSR-14-Events nutzen, keine fileadmin-Pfade hartkodieren, Ausgaben escapen. Ein kompetenter Agent weiß das alles schon, und jede Anfrage hat dafür als Kontext bezahlt. Die Guidelines sind jetzt eine Tool-Referenz und nichts sonst: welche Tools es gibt und was jedes davon liefert, gekürzt von 9.806 auf 2.304 Zeichen. Bestehende Projektanweisungen bleiben erhalten, und ein erneuter Installer-Lauf aktualisiert den eigenen Block, statt ihn zu duplizieren.

## Ein Development-Tool braucht eine harte Sicherheitsgrenze

Live-Zugriff für einen Agenten kann schnell zu einer verkleideten Remote-Shell werden. Dieser Server stellt bewusst keine bereit.

- Tools sind standardmäßig read-only und tragen MCP-`readOnlyHint`-Annotationen.
- Konfigurationswerte, die wie Passwörter, Encryption Keys oder Tokens aussehen, werden maskiert, bevor sie TYPO3 verlassen.
- `database_query` akzeptiert nur `SELECT`, `SHOW`, `EXPLAIN`, `DESCRIBE` und `WITH`, außer der Entwickler setzt ausdrücklich `DEV_MCP_ALLOW_WRITE=1`.
- Nur Dokumentationssuche und Extension-Lookup nutzen das Netzwerk; `DEV_MCP_NO_NETWORK=1` deaktiviert beide, während lokale Tools verfügbar bleiben.
- `flush_cache` ist das einzige zustandsverändernde Tool.
- Es gibt kein Tool für beliebige PHP- oder Command-Ausführung.

Eine frühe Alpha enthielt ein doppelt abgesichertes `tinker`-Tool. Ich habe es entfernt. Ein Feature, das Kontextzugriff in Code-Ausführung verwandelt, schwächt jede andere Sicherheitsbehauptung — auch wenn es hinter Opt-ins liegt.

## Erweiterbar, ohne jede Projektkonvention zu besitzen

TYPO3-Projekte tragen Wissen, das kein generisches Paket liefern kann. Ein Sitepackage möchte vielleicht Deployment-Ziele, redaktionelle Regeln, domänenspezifische Datensätze oder eigene Diagnosen bereitstellen.

Jede Extension kann ein Tool hinzufügen, indem sie ein Interface implementiert:

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

Die normale TYPO3-Service-Autokonfiguration findet es automatisch. Drei PSR-14-Events erlauben Projekten, Tools hinzuzufügen, zu entfernen oder zu ersetzen, vor der Ausführung Argumente anzupassen, einen Aufruf selbst zu beantworten oder ihn abzulehnen, und erfolgreiche Ergebnisse für zusätzliche Maskierung oder Audit-Logging nachzubearbeiten. Die Extension liefert Transport und Konventionen, ohne zu einem Register für jedes denkbare Projektproblem zu werden.

## Die Behauptung messen, statt sie zu wiederholen

„Der Agent fühlt sich schneller an“ ist kein Beleg. Deshalb enthält das Repository einen A/B-Benchmark gegen eine normale Claude-Code-Session mit vollem Datei- und Shell-Zugriff.

Das Harness baut host-gemountete Projekte mit TYPO3 13.4 und 14.3, erzeugt Live-Zustand über eine Fixture-Extension, generiert Ground Truth unabhängig vom MCP-Server, setzt Datenbank und Worktree zwischen Läufen zurück und bewertet 17 Aufgaben aus Live-State-Fragen, Code-Änderungen, Debugging und negativen Kontrollen.

Der aktuelle Durchlauf umfasst 680 Läufe mit `claude-opus-5-5`, 1.0.0 und 1.1.0 unter demselben Harness. Bei Fragen zur laufenden Installation — TCA, kompiliertes TypoScript, FlexForms, Site Sets — sanken die Mediankosten pro Aufgabe von **0,079 $ auf 0,032 $** unter TYPO3 13.4 und von **0,076 $ auf 0,035 $** unter 14.3: 59 und 53 Prozent günstiger, und das bei allen acht Live-State-Aufgaben auf beiden Versionen. Der größte Einzelfall ist die Auflösung von `lib.contentElement.templateRootPaths` nach Site-Set-Merging: Die Baseline las das 4,4-Fache an Tokens, um einen Wert zu rekonstruieren, der in keiner einzelnen Quelldatei existiert.

Das ehrliche Ergebnis ist nützlicher als eine Siegesrunde:

- Der Task-Erfolg lag in beiden Armen bei 100 Prozent — 520 von 520 automatisch geprüften Läufen —, und keine bewertete Antwort enthielt eine halluzinierte Behauptung. Ein kompetenter Agent mit grep und Shell hat alles gelöst. Die Tools bringen Effizienz, nicht Fähigkeit.
- Debugging und kleine Aufgaben werden nicht durchweg günstiger. Eine Debugging-Aufgabe kostet weiterhin etwa 0,03 $ mehr, weil der Agent die Antwort der Tools gegenprüft.
- In Claude Code fügt der Server jeder Anfrage etwa 1.700 Tokens hinzu, ob ein Tool genutzt wird oder nicht — Schemas werden dort erst bei Bedarf geladen. Ein Client, der alle Schemas vorab lädt, zahlt etwa 6.400.
- Der installierte Arm enthält Tools und generierte Guidelines; der Benchmark isoliert noch nicht, welchen Anteil beide jeweils haben.

Das Harness brauchte dieselbe Skepsis wie das Produkt. Eine liegengebliebene Auto-Memory-Notiz hatte jeden TYPO3-13-Lauf des ersten 1.0.0-Durchlaufs verzerrt. Diese Zahlen wurden zurückgezogen, und das Harness leert den Speicher jetzt vor jedem Lauf.

## Der Benchmark fand einen Fehler

Das Nützlichste, was der Benchmark hervorgebracht hat, war keine Prozentzahl. Es war ein Defekt.

In 1.0.0 bootete der Server TYPO3 einmal und beantwortete jeden Aufruf aus diesem Prozess. Ein Agent, der gerade ein TCA-Feld angelegt hatte und seine Arbeit mit `tca_schema` prüfen wollte, bekam die Antwort, das Feld existiere nicht — auch nach `flush_cache`. Code-Änderungen kosteten 61 bis 87 Prozent mehr als die Baseline.

1.1.0 führt jeden Aufruf in einem frischen `typo3 devmcp:call`-Prozess aus. Das kostet etwa 0,1 bis 0,25 Sekunden pro Aufruf, die Antworten sind byte-identisch zu vorher, und Code-Änderungen liegen wieder gleichauf mit der Baseline. `flush_cache` ruft jetzt das `cache:flush` des Cores auf, damit neue Listener und Services auch wirklich erscheinen.

Frühere Runden hatten das Produkt bereits verändert. Die größten Log- und Application-Info-Antworten schrumpften um 87 bis 89 Prozent, mit optionalen vollständigen Payloads, `get_config` liefert keine 74-KB-Teilbäume mehr, `get_url` flog nach null Aufrufen in 170 Läufen raus, und die Guidelines empfehlen keinen bedingungslosen Tool-Call mehr am Anfang jeder Session.

## Gegen zwei TYPO3-Generationen gebaut

Das Paket unterstützt PHP 8.2 bis 8.5 sowie TYPO3 13.4 und 14. Die CI fährt die Unit-Tests auf allen acht Kombinationen, die Functional-Suite auf beiden Majors und einen `--prefer-lowest`-Job, der die deklarierte Abhängigkeitsuntergrenze beweist. Die Functional-Suite führt alle 23 Tools gegen ein gebootetes TYPO3 aus und prüft jedes Eingabeschema — ein einziges fehlerhaftes Schema bringt MCP-Clients dazu, die gesamte `tools/list` abzulehnen. Ein DDEV-Harness betreibt beide TYPO3-Generationen parallel, PHPStan Level 8 und die TYPO3 Coding Standards prüfen den Rest.

Einige der wertvollsten Laufzeitinformationen stellt TYPO3 nur über als `@internal` markierte APIs bereit. Diese Integrationen sind isoliert, gegen beide unterstützten Major-Versionen verifiziert und so gebaut, dass sie bei Core-Änderungen mit einem verständlichen Tool-Fehler abbrechen, statt den Server zu crashen.

1.0 kam mit einem bewusst engen Versprechen. Semantische Versionierung gilt für `ToolInterface`, die drei Events, die beiden Command-Namen und die beiden Umgebungsvariablen. Sie gilt nicht für die Form dessen, was ein Tool zurückgibt: Drei der acht Alphas haben eine Payload verkleinert, diese Arbeit ist nicht abgeschlossen, und Payloads an die Major-Version zu binden, hätte sie zu teuer gemacht.

## Was ich gelernt habe

Kontext-Tools sollten einen Agenten nicht allmächtig machen. Sie sollten eine kleine Klasse teurer Fragen günstig und exakt beantworten.

Die überraschende Arbeit war nicht, mehr Tools zu implementieren. Es war zu entscheiden, was *nicht* zurückgegeben wird, wann überhaupt kein Tool laufen sollte und welche Fähigkeit gar nicht existieren darf. Ein 16-KB-Stacktrace ist im Terminal nützlich und in einer Konversation verschwenderisch. Dreiundzwanzig Schemas sind bei TYPO3-Arbeit mächtig und bei einem unabhängigen Refactoring reine Steuer. Beliebige Code-Ausführung ist bequem und unvereinbar mit einer engen Vertrauensgrenze.

Der Benchmark machte diese Zielkonflikte sichtbar, und er fand den Fehler, den kein Unit-Test gefunden hätte: einen Server, der über den Zustand beim Booten richtig Auskunft gab und über den Zustand, den der Agent gerade erst erzeugt hatte, falsch. Das ist der Teil, den ich behalten will: nicht „MCP macht KI besser“, sondern eine engere Behauptung mit Zahlen, Grenzen und einer Architektur, die sich anpassen lässt, wenn die Evidenz widerspricht.

`typo3-dev-mcp` ist [auf GitHub](https://github.com/balatD/typo3-dev-mcp), [Packagist](https://packagist.org/packages/balatd/typo3-dev-mcp) und im [TER](https://extensions.typo3.org/extension/dev_mcp) als `dev_mcp` verfügbar. MIT, nur für Entwicklungsumgebungen.
