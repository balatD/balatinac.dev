---
title: "typo3-dev-mcp — Live-TYPO3-Kontext für KI-Agenten"
description: "Ein MCP-Server nur für die Entwicklung, der KI-Assistenten den aufgelösten Laufzeit-Zustand von TYPO3 zeigt — mit abgesicherten Tools, komponierbaren Projektregeln und Benchmarks, die Nutzen und Kontextkosten messen."
urlSlug: "typo3-dev-mcp"
tags: ["typo3", "mcp", "ai", "php"]
year: 2026
order: 2
featured: true
publishedAt: 2026-08-12
meta:
  duration: "Sommer 2026"
  role: "Autor & Maintainer"
  team: "Solo"
  status: "Public Alpha · 0.1.0-alpha.6"
---

Die Antwort, die eine KI brauchte, existierte in TYPO3. Nur nicht in einer einzelnen Datei.

Fragt man nach der tatsächlichen TCA einer Tabelle, den effektiven Site-Settings nach der Dependency-Auflösung oder dem finalen TypoScript-Wert einer Seite, hat ein Coding-Agent ein Problem. Er kann Extension-Dateien und Konfigurationsfragmente lesen, aber TYPO3 kompiliert, merged, dekoriert und cached einen großen Teil seines echten Zustands zur Laufzeit. Der Agent muss die Anwendung aus Indizien rekonstruieren — langsam und manchmal falsch.

[`typo3-dev-mcp`](https://github.com/balatD/typo3-dev-mcp) ist ein MCP-Server nur für Entwicklungsumgebungen mit TYPO3 13.4 und 14. Er bootet innerhalb der Anwendung und gibt KI-Assistenten eine typisierte Sicht auf das System, das TYPO3 tatsächlich ausführt.

## Die Anwendung lesen, nicht die Indizien

Der Server stellt Tools in vier Bereichen bereit:

- **Anwendung und Daten** — installierte Versionen und Extensions, Datenbankschema, abgesicherte SQL-Abfragen, Sites, Sprachen, TCA, Content-Elemente und geroutete URLs.
- **Aufgelöste Konfiguration** — kompiliertes TypoScript, Page TSconfig, Site Sets, FlexForms, Middleware-Reihenfolge und ausgewählte `TYPO3_CONF_VARS`-Werte.
- **API-Erkundung** — ViewHelper mit exakten Argumenten, PSR-14-Events und Listener, Backend-Module, Console Commands und installierte Content Blocks.
- **Dokumentation und Diagnose** — auf die installierte Major-Version begrenzte TYPO3-Dokumentation, Core-Changelog, Extension-Kompatibilität und strukturierte Log-Fehler.

Der Unterschied ist entscheidend. `Configuration/TCA/Overrides/tt_content.php` zu lesen zeigt einen Input. `tca_schema` abzufragen zeigt das gemergte Schema, nachdem jede aktive Extension ihre Änderungen eingebracht hat. Eine Site-Set-Definition zeigt Defaults. `site_sets` zeigt den effektiven Wert nach Dependencies und Site-Overrides.

> Der nützliche Kontext ist oft nicht versteckt. Er existiert nur erst, nachdem TYPO3 ihn aufgelöst hat.

## Installation, die das Projekt verständlich lässt

Das Paket wird als Development-Dependency installiert:

```bash
composer require --dev "balatd/typo3-dev-mcp:^0.1@alpha"
vendor/bin/typo3 devmcp:install
```

Der Installer erledigt zwei Aufgaben. Er registriert den Stdio-Server in der `.mcp.json` des Projekts und verwendet automatisch `ddev exec`, wenn DDEV erkannt wird. Außerdem komponiert er versionsspezifische TYPO3-Regeln in `.ai/guidelines/typo3.md` und verlinkt diese Datei zwischen idempotenten Markern aus `CLAUDE.md` oder `AGENTS.md`.

Dieser zweite Teil ist genauso wichtig wie das Protokoll. Tools beantworten Fragen; Guidelines bringen dem Agenten bei, wann er sie stellen soll, welche TYPO3-Konventionen gelten und wann gewöhnliches Dateilesen günstiger ist. Bestehende Projektanweisungen bleiben erhalten, und ein erneuter Installer-Lauf aktualisiert den eigenen Block, statt ihn zu duplizieren.

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

Die normale TYPO3-Service-Autokonfiguration findet es automatisch. Drei PSR-14-Events erlauben Projekten, Tools hinzuzufügen oder zu ersetzen, Argumente vor der Ausführung anzupassen oder abzulehnen und erfolgreiche Ergebnisse für zusätzliche Maskierung oder Audit-Logging nachzubearbeiten. Die Extension liefert Transport und Konventionen, ohne zu einem Register für jedes denkbare Projektproblem zu werden.

## Die Behauptung messen, statt sie zu wiederholen

„Der Agent fühlt sich schneller an“ ist kein Beleg. Deshalb enthält das Repository einen A/B-Benchmark gegen eine normale Claude-Code-Session mit vollem Datei- und Shell-Zugriff.

Das Harness baut ein host-gemountetes TYPO3-13.4-Projekt, erzeugt Live-Zustand über eine Fixture-Extension, generiert Ground Truth unabhängig vom MCP-Server, setzt Datenbank und Worktree zwischen Läufen zurück und bewertet 17 Aufgaben aus Live-State-Fragen, Code-Änderungen, Debugging und negativen Kontrollen.

Über 170 Läufe mit `claude-opus-5` sanken Live-State-Aufgaben von **0,208 $ und 10 Turns** im Baseline-Arm auf **0,097 $ und 4 Turns** mit Installation: 53 Prozent weniger Kosten und 60 Prozent weniger Turns. Im größten Einzelfall sparte die Auflösung eines TypoScript-Werts nach Site-Set-Merging 458.000 Tokens, weil die Baseline einen Wert rekonstruieren musste, der in keiner einzelnen Quelldatei existierte.

Das ehrliche Ergebnis ist nützlicher als eine Siegesrunde:

- Der Task-Erfolg lag in beiden Armen bei 100 Prozent. Die Tools verbesserten Effizienz und Zuverlässigkeit, nicht die grundsätzliche Fähigkeit.
- Debugging kostete mit dem Server etwas mehr, während die gemessene Halluzinationsrate von 7 auf 0 Prozent sank.
- Die Tool-Schemas kosten ungefähr 6.800 Tokens bei jeder Anfrage, selbst wenn kein Tool verwendet wird.
- Der installierte Arm enthält Tools und generierte Guidelines; der Benchmark isoliert noch nicht, welchen Anteil beide jeweils haben.

Diese Ergebnisse haben das Produkt verändert. Die größten Log- und Application-Info-Antworten wurden um 87 bis 89 Prozent verkleinert, vollständige Payloads optional gemacht und die Guidelines empfehlen keinen bedingungslosen Tool-Call mehr am Anfang jeder Session.

## Gegen zwei TYPO3-Generationen gebaut

Das Paket unterstützt PHP 8.2 bis 8.4 sowie TYPO3 13.4 und 14. CI deckt alle sechs Kombinationen ab. Ein DDEV-Harness betreibt beide TYPO3-Generationen parallel, während PHPUnit, PHPStan Level 8 und die TYPO3 Coding Standards die PHP-Implementierung prüfen.

Einige der wertvollsten Laufzeitinformationen stellt TYPO3 nur über als `@internal` markierte APIs bereit. Diese Integrationen sind isoliert, gegen beide unterstützten Major-Versionen verifiziert und so gebaut, dass sie bei Core-Änderungen mit einem verständlichen Tool-Fehler abbrechen, statt den Server zu crashen. Das Public-Alpha-Label ist Absicht: Der Nutzen ist real, aber diese Grenzen brauchen vor 1.0 noch Praxiserfahrung.

## Was ich gelernt habe

Kontext-Tools sollten einen Agenten nicht allmächtig machen. Sie sollten eine kleine Klasse teurer Fragen günstig und exakt beantworten.

Die überraschende Arbeit war nicht, mehr Tools zu implementieren. Es war zu entscheiden, was *nicht* zurückgegeben wird, wann überhaupt kein Tool laufen sollte und welche Fähigkeit gar nicht existieren darf. Ein 16-KB-Stacktrace ist im Terminal nützlich und in einer Konversation verschwenderisch. Vierundzwanzig Schemas sind bei TYPO3-Arbeit mächtig und bei einem unabhängigen Refactoring reine Steuer. Beliebige Code-Ausführung ist bequem und unvereinbar mit einer engen Vertrauensgrenze.

Der Benchmark machte diese Zielkonflikte sichtbar. Das ist der Teil, den ich behalten will: nicht „MCP macht KI besser“, sondern eine engere Behauptung mit Zahlen, Grenzen und einer Architektur, die sich anpassen lässt, wenn die Evidenz widerspricht.

`typo3-dev-mcp` ist [auf GitHub](https://github.com/balatD/typo3-dev-mcp) und [Packagist](https://packagist.org/packages/balatd/typo3-dev-mcp) verfügbar. MIT, Public Alpha, nur für Entwicklungsumgebungen.
