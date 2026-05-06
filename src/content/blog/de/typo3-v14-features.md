---
title: "TYPO3 v14 — was wirklich neu ist und worauf ich mich freue"
description: "Ein praktischer Blick auf die Features von TYPO3 v14 LTS — vom Form Framework-Overhaul und der System Resource API bis zu Extbase-Upgrades und das Ende von ext_emconf.php."
urlSlug: "typo3-v14-features"
tags: ["typo3", "php", "cms", "backend"]
publishedAt: 2026-05-05
readTime: "~9 Min."
draft: false
---

Ich baue lange genug mit TYPO3, um mich noch daran zu erinnern, als `ext_emconf.php` unverzichtbar war und Form-Definitionen als YAML-Dateien irgendwo im Dateisystem lagen — gerne an Stellen, die man ohne `find` und gute Laune nicht wiedergefunden hat. Als die Release-Notes zur v14 LTS kamen, habe ich sie gelesen wie immer: Marketing-Absätze überflogen, direkt zu den Stellen gesprungen, die meinen Arbeitsalltag verändern.

Hier ist, was mir tatsächlich aufgefallen ist — und was ich für wichtiger halte, als die Release-Notes vermuten lassen.

---

## Das Form Framework wird endlich erwachsen

Wer in TYPO3 jemals mehr als ein einfaches Kontaktformular gebaut hat, kennt das Form Framework — und kennt seine Schmerzpunkte. v14.2 addressiert mehrere davon auf einmal, und das ist aus meiner Sicht das Update mit dem größten Hebel im Alltag.

### Multi-Datei-Uploads in einem Feld

Das hätte es schon vor Jahren geben müssen. Bisher musste man für mehrere Datei-Uploads — Bewerbungen, Wettbewerbseinreichungen, Veranstaltungsanmeldungen — pro Datei ein eigenes Upload-Element anlegen. Das ist nicht nur mühsam für Integratoren, es ist verwirrend für Redakteurinnen und Redakteure, die anschließend jedes Element einzeln konfigurieren mussten.

Jetzt: ein Feld, mehrere Dateien. Endlich.

### Rich Text in Formularfeldern

Textarea-Felder unterstützen nun CKEditor 5. Damit lassen sich Inhalte direkt im Formular formatieren, und die Editor-Erfahrung ist konsistent mit dem restlichen Backend. Schluss mit Erklärungen an den Kunden, warum ausgerechnet das Formularfeld aussieht wie aus dem Jahr 2003.

### Der Form-Editor-Baum, neu aufgebaut

Der linke Baum im Form-Editor — der die komplette Workflow-Struktur abbildet — wurde mit Web Components neu implementiert und folgt jetzt derselben Architektur wie der Seiten- und der Dateibaum. Das ist mehr als ein Optik-Refresh: Es gibt eine Suche, eine *Alle zuklappen*-Funktion und spürbar flüssigere Interaktion. Wer schon mal ein Formular mit mehreren Schritten gebaut hat, weiß, wie sehr der alte Baum damit überfordert war.

### Form-Definitionen ziehen in die Datenbank um

Das ist die große strukturelle Änderung. Seit das Form Framework in TYPO3 v8 eingeführt wurde, lebten Form-Definitionen als YAML-Dateien im Dateisystem. Dieser Ansatz ist jetzt zugunsten der Datenbankspeicherung über den neuen `DatabaseStorageAdapter` deprecated.

Der Adapter unterstützt eine Kette von Storage-Backends, einschließlich extension-basierter Quellen, die schreibgeschützt eingebunden werden. Damit die Migration nicht in YAML-Chirurgie ausartet, bringt der Core einen neuen CLI-Befehl mit:

```bash
vendor/bin/typo3 form:formdefinition:transfer
```

Er verschiebt Form-Definitionen zwischen Storages — sauber und nachvollziehbar.

### ICU-Message-Format und bessere Datumsverarbeitung

Übersetzungslabels unterstützen jetzt das ICU-Message-Format, also korrekte Pluralbehandlung und saubere Variableninterpolation. Datumsfelder bekommen eine neue Web-Komponente für Defaultwerte und Datumsbereiche — eine kleine Sache, die überraschend viel Reibung beim Konfigurieren datumsabhängiger Formulare nimmt.

---

## System Resource API — ein Weg, alles aufzulösen

Das ist die Änderung, von der ich nicht wusste, dass ich sie brauche, bis ich sie gesehen habe.

Ressourcen waren in TYPO3 immer ein kleines Tohuwabohu: Extension-Dateien benutzten die eine Syntax, FAL-Referenzen eine andere, Projektdateien hatten ihre eigenen Konventionen, und externe URIs waren schlicht Strings. Die neue **System Resource API** vereinheitlicht das über eine einzige Schnittstelle mit klaren Schlüsselwörtern: `EXT`, `FAL` und `PKG`.

Egal ob in PHP, TypoScript oder Fluid — Ressourcen werden konsistent aufgelöst. Das reduziert genau die Klasse von subtilen Fehlern, die in der Vergangenheit zu Sicherheitsproblemen geführt hat: falsche Pfadauflösung, fehlende Existenzprüfungen, inkonsistente URL-Generierung.

Und sie ist erweiterbar. Wer ein CDN oder ein eigenes Storage-Backend einbinden will, registriert einen eigenen Resolver, ohne den Core anzufassen.

---

## Datenbank-Pagination, richtig gemacht

Der neue `QueryBuilderPaginator` integriert sich in das bestehende Paginierungs-System und macht das Paginieren von Datenbankergebnissen unkompliziert. Wer jemals eine eigene paginierte Liste in TYPO3 gebaut hat — und das hat vermutlich jeder, weil die bisherigen Optionen entweder zu starr oder zu manuell waren — wird das zu schätzen wissen.

Es ist nicht revolutionär. Es ist die Art Funktion, die von Anfang an hätte da sein sollen. Genau deshalb ist sie wichtig: Mit den langweiligen Infrastruktur-Bausteinen arbeitet man jeden Tag.

---

## Extension-Dateien: das Cleanup, das wir gebraucht haben

Drei Änderungen, alle bringen TYPO3 näher an moderne PHP-Konventionen:

- **`composer.json` ist Pflicht** in jeder Extension, auch in Legacy-Installationen. Das schafft eine einheitliche Grundlage, unabhängig vom Installationsweg.
- **`ext_emconf.php` ist Geschichte.** Extension-Metadaten leben jetzt in der `composer.json`. Wer beide Dateien je synchron halten musste, weiß, was für eine Erleichterung das ist.
- **`ext_tables.php` ist Geschichte.** Ihre Aufgaben übernehmen modernere Konfigurationsmechanismen.

Für Redakteurinnen und Redakteure ist das unsichtbar, für Entwickler bedeutend: weniger Dateien zum Pflegen, weniger Inkonsistenzen, ein Setup, das endlich so funktioniert, wie es das PHP-Ökosystem ohnehin vorsieht.

---

## Extbase bekommt ernsthafte Upgrades

Extbase rückt in v14 LTS spürbar näher an moderne PHP-Standards.

### Symfony-Validatoren

Validierung unterstützt jetzt **Symfony-Constraint-Attribute** auf Domain-Modellen und Controller-Methoden. Statt für gängige Fälle eigene Validatoren zu schreiben, nutzt man die volle Palette der eingebauten Symfony-Constraints. Konsistenter, wartbarer, weniger Code.

```php
use Symfony\Component\Validator\Constraints as Assert;

class ContactRequest
{
    #[Assert\NotBlank]
    #[Assert\Length(min: 2, max: 80)]
    public string $name = '';

    #[Assert\Email]
    public string $email = '';
}
```

### SQL-Funktionsausdrücke in `ORDER BY`

Extbase erlaubt jetzt SQL-Funktionsausdrücke in `ORDER BY`-Klauseln über eine Fluent API. Methoden wie `orderBy()`, `addOrderBy()`, `concat()`, `trim()` und `coalesce()` geben mehr Kontrolle über die Sortierung, ohne auf rohes SQL ausweichen zu müssen.

### Das `#[Authorize]`-Attribut

Zugriffskontrolle deklarativ direkt an der Controller-Action: eingeloggter Frontend-User, Gruppenmitgliedschaft, eigene Voter. Sauber, lesbar, wartbar — und endlich Schluss mit über alle Actions verstreuten Berechtigungs-Checks.

```php
#[Authorize(requireLogin: true)]
#[Authorize(requireGroups: [42])]
public function showAction(): ResponseInterface
{
    // …
}
```

### Das `#[RateLimit]`-Attribut

Rate-Limiting als PHP-Attribut, basierend auf Symfonys `RateLimiter`-Komponente und standardmäßig gegen die Client-IP. Besonders wertvoll für Formular-Submissions, Login-Endpoints und alles, was teuer zu berechnen oder anfällig für Missbrauch ist.

```php
#[RateLimit(limit: 5, interval: '1 minute')]
public function submitAction(): ResponseInterface
{
    // …
}
```

---

## Exception-Handling, ohne Augenkneifen

Der überarbeitete Debugging-Exception-Handler präsentiert Stack Traces deutlich aufgeräumter, markiert die Fehlerstelle präziser und bietet einen One-Click-Copy für Dateipfade. Klingt nach Kosmetik — aber wer um 23 Uhr ein Produktionsproblem debuggt, ist für jede Sekunde dankbar, die nicht auf eine Textwand verloren geht.

---

## Backend-UX: Lesezeichen, Short URLs, Scheduler-Wizard

![Das neu gestaltete TYPO3 v14 Backend](/images/blog/typo3-backend-ui.webp)

Drei kleinere Dinge, die im Alltag spürbar sind:

- **Backend-Lesezeichen** — Nutzerinnen und Nutzer verwalten eigene Lesezeichen und legen direkte Einstiegspunkte zu häufig genutzten Seiten an. Spart Zeit, reduziert Klick-Irrwege.

![Der zentralisierte Lesezeichen-Manager in TYPO3 v14](/images/blog/typo3-bookmark-manager.webp)

- **Short URLs** mit Hit-Countern, erzwungenem SSL und konfigurierbaren Ablaufdaten. Praktisch, um Seiten-Links oder Workspace-Vorschauen mit Kunden zu teilen.
- **Scheduler-Task-Wizard** — eine moderne, kategorisierte Oberfläche zum Anlegen geplanter Aufgaben, ähnlich dem Content-Element-Wizard. Suche, Filter, Icons, Beschreibungen. Ein Quantensprung gegenüber dem alten Dropdown.

![Der neue Page-Creation-Wizard führt Redakteure Schritt für Schritt durch die Seitenerstellung](/images/blog/typo3-page-creation-wizard.webp)

![Das Kontext-Panel gleitet von rechts ein und hält das Seitenlayout beim Bearbeiten sichtbar](/images/blog/typo3-context-panel-content.webp)

---

## Worauf ich mich tatsächlich freue

Wenn ich ehrlich bin, sind die Änderungen, die mir am meisten bedeuten, die unspektakulären: Form-Definitionen in der Datenbank. Das Ende von `ext_emconf.php`. Die System Resource API, die Pfadauflösung endlich vorhersagbar macht. `#[Authorize]` und `#[RateLimit]`, die Boilerplate aus meinen Controllern verschwinden lassen.

Das sind nicht die Features für laute Release-Ankündigungen. Aber es sind die, die die tägliche Reibung mit einem CMS reduzieren — und genau das macht ein LTS wertvoll.

TYPO3 v14 LTS ist keine radikale Neuerfindung. Es ist eine Verfeinerung. Die Art Release, bei dem man eine Woche nach dem Upgrade merkt, dass fünf kleine Dinge, um die man früher immer einen Bogen gemacht hat, einfach… weg sind. Das ist die beste Sorte Release.

*— DB, geschrieben, während seine TYPO3-Instanzen im Hintergrund noch `ext_emconf.php` ausführten und so taten, als wäre alles in Ordnung.*