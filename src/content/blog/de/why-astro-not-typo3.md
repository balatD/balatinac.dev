---
title: "Warum ich mein Portfolio mit Astro statt TYPO3 gebaut habe"
description: "Ein TYPO3-Entwickler erklärt, warum er für seine eigene Seite einen Static Site Generator gewählt hat — und warum das kein Widerspruch ist."
tags: ["astro", "portfolio", "typo3", "cms"]
publishedAt: 2026-04-29
readTime: "~8 Min."
draft: false
---

Ich habe den größten Teil des letzten Jahrzehnts in TYPO3 verbracht. Ich kenne das Backend, das TypoScript, die Eigenheiten von FAL und die besondere Freude, einem Redakteur zu erklären, warum sein aus-Word-kopierter Inhalt das Layout gesprengt hat. TYPO3 ist mein Alltag, meine Komfortzone und — für das richtige Projekt — wirklich ausgezeichnet.

Diese Seite ist nicht das richtige Projekt.

## Die Frage, die niemand früh genug stellt

Bevor man sich für ein Framework, ein CMS oder einen Static Site Generator entscheidet, gibt es eine Frage, die mehr Zeit verdient, als sie normalerweise bekommt: **Was muss diese Seite eigentlich können?**

Nicht was sie *könnte*. Nicht was sie *vielleicht* in achtzehn Monaten braucht, wenn ein Shop, ein Mitgliederbereich und ein Newsletter dazugekommen sind. Was sie *heute* können muss, und was sie realistisch in den nächsten zwei Jahren braucht.

Für dieses Portfolio war die Antwort kurz:

- Eine Handvoll statischer Seiten anzeigen.
- Eine Liste von Projekten und Blogbeiträgen darstellen.
- Inhalte in Markdown schreiben lassen.
- Schnell laden. Sehr schnell.
- Nichts kosten beim Hosting.

> Wenn man seine Anforderungen an einer Hand abzählen kann, braucht das CMS keine Datenbank.

## Warum TYPO3 zu viel war

Ich möchte das klarstellen: Das ist keine Kritik an TYPO3. Ich nutze es jeden Tag und würde es wieder wählen für eine Corporate-Multi-Site mit redaktionellen Workflows, rollenbasiertem Zugriff und einem Dutzend Content-Typen. Dafür ist es gebaut.

Aber für ein persönliches Portfolio bringt TYPO3 Overhead mit, der nichts einbringt:

- **Eine Datenbank.** MariaDB oder PostgreSQL, 24/7 laufend, für Inhalte die sich einmal im Monat ändern. Das bedeutet eine Backup-Strategie, einen Migrationspfad und ein Monitoring-Setup — für einen Blog mit acht Beiträgen.
- **Eine PHP-Laufzeitumgebung.** FPM, OPcache-Konfiguration, Memory-Limits, ein Webserver. Alles für Seiten, die schlichte HTML-Dateien auf einem CDN sein könnten.
- **Ein redaktionelles Backend.** Ich bin der einzige Redakteur. Ich brauche keinen Login-Bildschirm, kein Berechtigungssystem, keinen Seitenbaum. Ich brauche einen Texteditor und `git push`.
- **Extension-Management.** Composer, TER, Versionsabhängigkeiten. Selbst eine minimale TYPO3-Installation zieht mehr bewegliche Teile mit als diese gesamte Seite Seiten hat.
- **Hosting-Kosten.** Ein VPS, der TYPO3 komfortabel betreiben kann, kostet 5–15 € im Monat. Diese Seite läuft auf Cloudflare Pages — kostenlos.

Das Missverhältnis ist nicht TYPO3s Schuld. Es ist ein Scope-Problem. TYPO3 für ein Portfolio zu nutzen ist wie eine Lagerhalle zu mieten, um einen Koffer abzustellen.

## Was Astro für diesen Anwendungsfall richtig macht

Astro hat bei mir sofort geklickt, als ich das Kernprinzip verstanden habe: **Standardmäßig kein JavaScript ausliefern, nur dort hinzufügen wo man es braucht.**

### Content Collections mit Markdown

Statt einer Datenbank liegen meine Inhalte in `.md`-Dateien mit typisierten Frontmatter-Feldern. Das Schema wird zur Build-Zeit mit Zod validiert — wenn ich ein Pflichtfeld vergesse, schlägt der Build fehl. Keine Migrationsskripte, keine SQL-Dumps. Inhalte sind versionskontrolliert, diffbar und portabel.

Einen neuen Beitrag erstellen heißt: Datei anlegen, Markdown schreiben, nach Git pushen. Die Startseite übernimmt die neuesten Einträge automatisch. Kein Backend, kein Cache leeren, kein "Ist der Scheduler gelaufen?"

### Statischer Output

Die gesamte Seite kompiliert zu purem HTML, CSS und einem kleinen JS-Bundle für View Transitions und den Theme-Toggle. Kein Server, keine Laufzeitumgebung, keine Cold Starts. Jede Seite ist eine Datei auf einem CDN-Edge-Node.

Build-Zeit: etwa eine Sekunde. Gesamtgröße: unter 300 KB.

### Die Island-Architektur

Die wenigen interaktiven Teile — Theme-Toggle, Sprachwechsler, Tag-Filter — laufen als kleine Skripte, die unabhängig hydrieren. Der Rest der Seite ist statisches HTML. Kein Framework-Runtime, kein Virtual DOM, kein Hydration-Wasserfall.

Für ein Portfolio bedeutet das einen Lighthouse-Performance-Score, der praktisch ohne Anstrengung das Maximum erreicht.

### Tailwind v4, kein Theme-System

TYPO3-Projekte bedeuten normalerweise SCSS, eine Fluid-Template-Struktur und ein Design-System, das Dutzende Content-Element-Typen unterstützen muss. Hier reichen Tailwinds Utility-Klassen. Die Design-Tokens leben in einer CSS-Datei, nicht in einer Datenbank oder einer TypoScript-Konstante.

## Das Entscheidungsframework, das ich empfehlen würde

Nach dieser Erfahrung denke ich so über CMS vs. Static bei neuen Projekten nach:

- **Wer bearbeitet die Inhalte?** Wenn es Entwickler oder technisch versierte Menschen sind, ist Markdown + Git schneller als jedes CMS. Wenn es ein Marketing-Team ist, brauchen die ein Backend.
- **Wie oft ändern sich die Inhalte?** Wöchentliche redaktionelle Zyklen rechtfertigen ein CMS. Monatliche Updates auf einer persönlichen Seite nicht.
- **Wie viele Content-Typen?** Wenn man strukturierte Inhalte mit Relationen, Varianten und redaktionellen Workflows braucht — das ist CMS-Territorium. Wenn man "Seite" und "Beitrag" hat — das ist ein Ordner mit Markdown-Dateien.
- **Was ist das Budget?** Eine statische Seite auf Cloudflare Pages oder Netlify kostet nichts. Ein CMS braucht Hosting, Wartung und Sicherheitsupdates.
- **Was ist der Blast Radius?** Eine statische Seite kann zur Laufzeit nicht gehackt werden. Kein Admin-Panel zum Brute-Forcen, keine SQL-Injection, keine PHP-Schwachstellen zum Patchen.

## Eine Sache, die mir fehlt

Ich bin ehrlich: TYPO3s Bildverarbeitung ist besser. Die responsive Bildausgabe, die Crop-Varianten pro Breakpoint, die automatische WebP/AVIF-Konvertierung mit Fallbacks — das lässt sich in einem statischen Setup nur schwer nachbauen. Astros `<Image />`-Komponente macht die Basics gut, aber sie spielt nicht in derselben Liga wie FAL mit einer ordentlich konfigurierten Processing-Pipeline.

Für ein Portfolio mit einer Handvoll Bildern spielt das keine Rolle. Für eine inhaltslastige Seite schon.

---

## Fazit

Die langweilige Antwort ist: Nimm das Werkzeug, das zur Aufgabe passt. TYPO3 ist ausgezeichnet darin, TYPO3 zu sein — ein vollwertiges CMS für komplexe redaktionelle Anforderungen. Astro ist ausgezeichnet darin, Astro zu sein — ein Static Site Builder für Inhalte, die in Dateien leben.

Ich habe Astro gewählt, weil diese Seite klein ist, persönlich, und von einer Person in einem Texteditor geschrieben wird. Wenn sich das ändert — wenn ich plötzlich Multi-User-Editing, strukturierte Workflows oder hundert Content-Typen brauche — weiß ich, wo ich TYPO3 finde. Es wird immer noch da sein, langweilig zuverlässig, und das ist das größte Kompliment, das ich machen kann.

*— DB, geschrieben während seine TYPO3-Instanzen leise Millionen von Seiten ausgeliefert haben, ohne irgendetwas davon zu brauchen.*
