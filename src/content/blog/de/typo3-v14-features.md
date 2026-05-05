---
title: "TYPO3 v14 — was ist wirklich neu und worauf ich mich freue"
description: "Ein praktischer Blick auf die Features von TYPO3 v14 LTS — vom Form Framework-Overhaul und der System Resource API bis zu Extbase-Upgrades und das Ende von ext_emconf.php."
urlSlug: "typo3-v14-features"
tags: ["typo3", "php", "cms", "backend"]
publishedAt: 2026-05-05
readTime: "~9 Min."
draft: false
---

Ich baue seit lang genug mit TYPO3, um mich daran zu erinnern, als `ext_emconf.php` noch unverzichtbar war und Form-Definitionen in YAML-Dateien lebten, die niemand ohne Suchtrupp finden konnte. Als die v14 LTS-Release-Notes ankamen, habe ich sie gelesen wie immer: Die Marketing-Absätze übersprungen und direkt zu den Dingen gegangen, die meine tägliche Arbeit verändern.

Hier ist, was mir tatsächlich aufgefallen ist — und was meiner Meinung nach wichtiger ist, als die Release-Notes suggerieren.

## Das Form Framework wird endlich erwachsen

Wer in TYPO3 jemals mehr als ein einfaches Kontaktformular gebaut hat, kennt das Form Framework. Und kennt seine Schmerzpunkte. v14.2 adressiert mehrere davon gleichzeitig, und das ist die Aktualisierung, die ich als wirklich wirkungsvoll bezeichnen würde.

### Multi-Datei-Uploads in einem Feld

Das hätte es schon vor Jahren geben müssen. Bis jetzt musste man für mehrere Datei-Uploads — Bewerbungen, Wettbewerbseinträge, Veranstaltungsanmeldungen — separate Upload-Elemente für jede Datei anlegen. Das ist nicht nur mühsam für Integratoren; es ist verwirrend für Redakteure, die dann jedes einzelne unabhängig konfigurieren müssen.

Ein Feld, mehrere Dateien. Endlich.

### Rich Text in Formularfeldern

Textbereich-Felder in Formularen unterstützen jetzt CKEditor 5. Das bedeutet, Redakteure können Inhalte direkt in Formularen formatieren, und die Bearbeitungserfahrung ist konsistent mit dem restlichen Backend. Keine Erklärungen mehr an den Kunden, warum die Formular-Textarea aussieht wie aus dem Jahr 2003, während alles andere einen modernen Editor hat.

### Der Form-Editor-Baum, neu aufgebaut

Der linke Baum im Form-Editor — der die gesamte Formular-Workflow-Struktur zeigt — wurde mit Web Components neu aufgebaut und entspricht jetzt der Architektur des Seiten- und Dateibaums. Das ist nicht nur ein optisches Update. Es bietet Suche, eine Alle-zuklappen-Funktion und flüssigere Interaktion. Wer jemals ein Formular mit mehr als ein paar Schritten gebaut hat, weiß, wie sehr der alte Baum damit überfordert war.

![Das Kontext-Panel gleitet von rechts ein und hält das Seitenlayout beim Bearbeiten sichtbar](/images/blog/typo3-context-panel-content.webp)

### Form-Definitionen ziehen in die Datenbank um

Das ist die große strukturelle Änderung. Seit das Form Framework in TYPO3 v8 eingeführt wurde, lagen Form-Definitionen als YAML-Dateien im Dateisystem. Dieser Ansatz ist jetzt zugunsten der Datenbankspeicherung über den neuen `DatabaseStorageAdapter` deprecated.

Der Adapter unterstützt eine Kette von Storage-Backends, einschließlich extension-basierter Quellen, die schreibgeschützt sind. Und um die Migration weniger schmerzhaft zu machen, gibt es einen neuen CLI-Befehl:

```bash
form:definition:transfer
```

Er verschiebt Form-Definitionen zwischen Storages. Kein manuelles YAML-Chirurgie erforderlich.

Außerdem gibt es den Befehl `form:cleanup:uploads` zum Aufräumen alter Upload-Ordner — eine kleine, aber nützliche Verbesserung, die mit der Zeit Speicherplatz spart.

### ICU-Message-Format und bessere Datumsverarbeitung

Das Form Framework unterstützt jetzt das ICU-Message-Format für Übersetzungslabels, was korrekte Behandlung von Pluralen und Variableninterpolation ermöglicht. Datumsfelder erhalten eine neue Web-Komponente für Standardwerte und Datumsbereiche — eine kleine Sache, die überraschend viel Reibung beim Konfigurieren datumsabhängiger Formulare entfernt.

## System Resource API — ein Weg, alles aufzulösen

Das ist die Änderung, von der ich nicht wusste, dass ich sie brauchte, bis ich sie gesehen habe.

![Das neu gestaltete TYPO3 v14 Backend](/images/blog/typo3-backend-ui.webp)

In TYPO3 waren Ressourcen schon immer ein bisschen ein Chaos. Extension-Dateien nutzen eine Syntax, FAL-Referenzen eine andere, Projektdateien haben ihre eigenen Konventionen, und externe URIs sind einfach Strings. Die neue System Resource API vereinheitlicht all das über eine einzige Schnittstelle mit klaren Schlüsselwörtern: **EXT**, **FAL** und **PKG**.

Egal ob in PHP, TypoScript oder Fluid — Ressourcen werden konsistent aufgelöst. Das reduziert die Art von subtilen Fehlern, die zu Sicherheitsproblemen führen: falsche Pfadauflösung, fehlende Dateiprüfungen, inkonsistente URL-Generierung.

Sie ist auch erweiterbar. Wer ein CDN oder ein benutzerdefiniertes Storage-Backend integriert, kann einen eigenen Resolver hinzufügen, ohne den Core anzufassen.

## Datenbank-Pagination richtig gemacht

Der neue `QueryBuilderPaginator` integriert sich in TYPO3s bestehendes Paginierungssystem und macht die Paginierung von Datenbankergebnissen unkompliziert. Wer jemals eine eigene paginierte Liste in TYPO3 gebaut hat — und das hat wahrscheinlich jeder, weil die bestehenden Optionen entweder zu starr oder zu manuell waren — wird das zu schätzen wissen.

Es ist nicht revolutionär. Es ist die Art von Ding, die von Anfang an hätte da sein sollen. Aber genau deshalb ist es wichtig: Die langweiligen Infrastruktur-Bausteine sind es, mit denen man jeden Tag interagiert.

## Extension-Dateien: das Cleanup, das wir brauchten

Drei Änderungen hier, und alle bringen TYPO3 näher an moderne PHP-Konventionen:

- **`composer.json` ist jetzt Pflicht** in jeder Extension, auch bei Legacy-Installationen. Das schafft eine konsistente Grundlage, unabhängig von der Installationsart.
- **`ext_emconf.php` ist Geschichte.** Extension-Metadaten leben jetzt in `composer.json`. Wer jemals beide Dateien gepflegt und synchron gehalten hat, weiß, was für eine Erleichterung das ist.
- **`ext_tables.php` ist Geschichte.** Ihre Aufgaben wurden durch modernere Konfigurationsansätze ersetzt.

Das ist die Art von Änderung, die für Redakteure unsichtbar ist, aber für Entwickler bedeutend. Weniger Dateien zum Pflegen, weniger Inkonsistenzen, ein Setup, das endlich so funktioniert, wie das PHP-Ökosystem es tatsächlich vorsieht.

## Extbase bekommt ernsthafte Upgrades

Extbase in v14 LTS erhält mehrere Verbesserungen, die es näher an moderne PHP-Standards bringen:

### Symfony-Validatoren

Die Validierung unterstützt jetzt Symfony-Constraint-Attribute auf Domain-Modellen und Controller-Methoden. Statt eigene Validatoren für gängige Fälle zu schreiben, kann man die volle Palette der eingebauten Symfony-Validatoren nutzen. Das macht die Validierung konsistenter und wartbarer.

### SQL-Funktionsausdrücke in ORDER BY

Extbase unterstützt jetzt SQL-Funktionsausdrücke in `ORDER BY`-Klauseln über eine Fluent API. Methoden wie `orderBy()`, `addOrderBy()`, `concat()`, `trim()` und `coalesce()` geben mehr Kontrolle über Abfrageergebnisse, ohne auf rohes SQL ausweichen zu müssen.

### Das `#[Authorize]`-Attribut

Zugriffskontrolle direkt an Controller-Aktionen. Man kann Regeln durchsetzen wie einen eingeloggten Frontend-User oder Gruppenmitgliedschaft prüfen — sauber, deklarativ und wartbar. Kein Verstreuung von Berechtigungsprüfungen über alle Action-Methoden mehr.

### Das `#[RateLimit]`-Attribut

Rate-Limiting als PHP-Attribut. Es begrenzt, wie oft eine bestimmte Aktion in einem Zeitraum aufgerufen werden kann, basierend auf der Client-IP und Symfony's RateLimiter-Komponente. Besonders nützlich für Formular-Übermittlungen, Login-Prozesse und alle Endpunkte, die teuer zu berechnen oder sensibel für Missbrauch sind.

## Exception-Handling, bei dem man nicht squinted

Der verbesserte Debugging-Exception-Handler präsentiert Stack Traces übersichtlicher, zeigt genau wo ein Problem auftritt und bietet einen One-Click-Kopierbutton für Dateipfade. Kleine Sache, aber wenn man um 23 Uhr ein Produktionsproblem debuggt, zählt jede Sekunde, die man nicht auf eine Textwand starrt.

## Backend-UX: Lesezeichen, Short URLs, Scheduler-Wizard

Noch ein paar Dinge, die Erwähnung verdienen:

![Der neue Page-Creation-Wizard führt Redakteure Schritt für Schritt durch die Seitenerstellung](/images/blog/typo3-page-creation-wizard.webp)

- **Backend-Lesezeichen** — Nutzer können eigene Lesezeichen verwalten und direkte Einstiegspunkte zu häufig genutzten Seiten erstellen. Spart Zeit, reduziert Navigationsfehler.
- **Short URLs** — mit Hit-Countern, erzwungenem SSL und konfigurierbaren Ablaufdaten. Nützlich zum Teilen von Seiten-Links oder Workspace-Vorschauen mit Kunden.
- **Scheduler-Task-Wizard** — eine moderne, kategorisierte Oberfläche zum Erstellen geplanter Aufgaben, ähnlich dem Content-Element-Wizard. Suche, Filter, Icons, Beschreibungen. Deutlich besser als das alte Dropdown.

![Der zentralisierte Lesezeichen-Manager in TYPO3 v14](/images/blog/typo3-bookmark-manager.webp)

## Worauf ich mich tatsächlich freue

Wenn ich ehrlich bin, sind die Änderungen, die mir am meisten bedeuten, die unglamourösen. Das Form Framework, das in die Datenbank zieht. Das Ende von `ext_emconf.php`. Die System Resource API, die Pfadauflösung berechenbar macht. Die `#[Authorize]`- und `#[RateLimit]`-Attribute, die Boilerplate aus meinen Controllern entfernen.

Das sind nicht die Features, die für aufregende Release-Ankündigungen sorgen. Aber es sind die, die die tägliche Reibung beim Arbeiten mit einem CMS reduzieren — und genau das macht ein Long-Term-Release wertvoll.

TYPO3 v14 LTS ist keine radikale Neuerfindung. Es ist eine Verfeinerung. Die Art, bei der man upgradet und eine Woche später merkt, dass fünf kleine Dinge, die man immer umgangen hat, einfach... weg sind. Das ist die beste Art von Release.

*— DB, geschrieben während seine TYPO3-Instanzen immer noch ext_emconf.php ausführten und taten, als wäre alles in Ordnung.*