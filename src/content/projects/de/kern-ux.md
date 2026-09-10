---
title: "kern_ux — der KERN UX-Standard für TYPO3"
description: "Vierzig barrierefreie Fluid Components, zwanzig Content Blocks und ein ext:form-Theme bringen den Standard der öffentlichen Verwaltung nach TYPO3 13.4 und 14.3 — mit KERN-Markup, das genau einmal existiert und von Tests unter beiden Majors festgenagelt wird."
urlSlug: "kern-ux"
tags: ["typo3", "accessibility", "fluid", "content-blocks"]
year: 2026
order: 3
featured: true
publishedAt: 2026-09-10
meta:
  duration: "Spätsommer 2026"
  role: "Autor & Maintainer"
  team: "Solo"
  status: "Public Alpha · 1.0.0-alpha"
---

Ein Barrierefreiheits-Standard ist keine Farbpalette. Er ist eine Menge Klassennamen und ARIA-Attribute, die exakt stimmen müssen.

Genau das ist das Problem, wenn ein Design-System in ein CMS soll. [KERN](https://www.kern-ux.de/) — der UX-Standard für die deutsche öffentliche Verwaltung — macht konkrete Zusagen: BITV 2.0 AA über EN 301 549, zusätzlich gegen WCAG 2.2 getestet. Diese Zusagen stehen nicht in einem Spezifikationsdokument. Sie hängen daran, ob ein `fieldset` das `aria-required` trägt, ob die Fehlermeldung in `aria-describedby` nach dem Hinweis kommt, ob der Text einer Bühne im Quelltext vor ihrem Bild steht. Kopiert man dieses Markup in dreißig Templates, hat man dreißig Stellen, an denen es still auseinanderläuft.

[`kern_ux`](https://github.com/balatD/kern_ux) bringt KERN nach TYPO3 13.4 und 14.3: 40 barrierefreie Fluid Components, 20 Content Blocks für Redakteure, ein `ext:form`-Theme und vier Seiten-Templates mit passenden Backend-Layouts.

> Das ist eine unabhängige Community-Integration. Sie gehört nicht zum KERN-Team und ist kein offizielles KERN-Kit.

## Das Markup existiert genau einmal

Eine Schicht nativer Fluid Components ist die einzige Quelle für KERN-Markup. Content Blocks, Formular-Templates und Seiten-Templates rufen dieselben Components auf und bilden nur Daten darauf ab.

Vierzig davon, gebaut gegen KERN 2.7.2:

- **Atome** (15) — Badge, Body, Button, Divider, Error, Heading, Hint, Icon, Label, Link, List, Loader, Preline, Progress, Subline.
- **Moleküle** (16) — AccordionItem, Alert, Breadcrumb, ButtonGroup, Card, ContentHeader, DescriptionList, DownloadList, Figure, Hgroup, MediaPlayer, NavigationList, Section, SkipLink, SummaryItem, TaskListItem.
- **Organismen** (9) — CardGrid, Dialog, Footer, Gallery, Header, Hero, Kopfzeile, TaskList, TaskListGroup.

Der Namespace `k` ist global registriert, `<k:atom.button>` löst also ohne `xmlns` im Template auf. Das echte Markup einer Component sieht man ohne Browser und ohne Datenbank:

```bash
vendor/bin/typo3 kern-ux:component:render '<k:atom.button icon="arrow-forward">Weiter</k:atom.button>'
```

Der Sinn dieser Schicht ist nicht Wiederverwendung. Er ist, dass es genau eine Stelle gibt, an der es richtig sein muss — und Tests, die sie unter beiden TYPO3-Majors dort halten.

## Formularregeln gehören in zwei Partials, nicht in dreißig

`ext:form` liefert rund dreißig Element-Partials mit. KERNs Feld-Kontrakt in jedes davon zu schreiben, hieße dreißig Kopien derselben ARIA-Verdrahtung. Stattdessen sitzt er in zwei: `Field/Field.html` für die `kern-form-input`-Familie, `Field/Group.html` für Checkbox- und Radio-Gruppen.

Was das bringt, einmal implementiert:

- **Optionale Felder werden markiert, nicht die Pflichtfelder** — die Umkehrung der `ext:form`-Konvention. Pflicht wird über `aria-required` vermittelt, nicht über das native `required`-Attribut.
- **Drei Fehlersignale gleichzeitig**: Modifier am Wrapper, Modifier am Feld, `aria-invalid`. Jedes einzelne allein wäre Zustand nur durch Farbe (WCAG 1.4.1).
- **`aria-describedby` in der Reihenfolge Hinweis, dann Fehler** — so wie KERNs eigenes Plain-Kit. Das React-Kit macht es umgekehrt; das Plain-Kit gewinnt.
- **Bei Gruppen** trägt das `fieldset` sowohl `aria-describedby` als auch `aria-required`, denn es bildet `role="group"` ab und seine `legend` ist der zugängliche Name. `aria-required` an jedem Kind zu wiederholen hieße, jede Option sei für sich erforderlich — falsch für eine Radio-Gruppe und für eine Checkbox-Gruppe, die mindestens eine Auswahl verlangt. Jeder Kind-Input trägt aber weiterhin `aria-invalid` und die Fehlerklasse.
- **Die `fluidAdditionalAttributes` des Elements werden durchgereicht**, mit den ARIA-Attributen des Kontrakts darüber. Ohne das fällt alles weg, was der Formular-Editor in diese Eigenschaft schreibt — vor allem `autocomplete`, ohne das WCAG 1.3.5 gar nicht erfüllbar ist. Attribute, die den Kontrakt selbst überschreiben würden, werden verworfen: kein Redakteur soll die Zusagen von Hand aushängen können.

`KernDate` rendert ein Datum als drei Felder, wie KERN es vorschreibt — kein `<input type="date">`.

## Geprüft wird der Standard, nicht die Component

axe läuft gegen eine Component-Galerie, die jede Component in ihren dokumentierten Zuständen zeigt — lebende Doku, Sichtprüfung und Testziel in einem. Sie braucht weder Webserver noch Datenbank:

```bash
vendor/bin/typo3 kern-ux:styleguide:dump --target=var/styleguide
cd Tests/A11y && npm install && npx playwright install chromium && npm test
```

Drei Details in diesem Lauf sind Entscheidungen und keine Voreinstellungen.

**Die Regelmenge enthält `best-practice`.** Nicht als Kür: `heading-order`, `region`, `landmark-unique`, `landmark-one-main`, `page-has-heading-one` und `skip-link` tragen in axe-core keinen `wcag`-Tag, sondern nur diesen. Genau diese sechs sind der ganze Grund, aus dem überhaupt vollständige Seiten geprüft werden. Ohne den Tag beantwortet der Lauf eine andere Frage als die behauptete.

**Jede Seite läuft dreimal** — helles Thema auf 1280px, dunkles Thema auf 1280px, helles Thema auf 390px. Kontrast hängt am Thema, `target-size` und `reflow` hängen an der Breite. Ein einzelner Desktop-Durchgang lässt das dunkle Thema und das gesamte Mobil-Layout samt Navigationspanel ungeprüft.

**Der Lauf bricht ab, wenn das KERN-Stylesheet nicht geladen wurde.** Ohne CSS überspringt axe still alle Kontrastregeln, und die Suite wird aus dem falschen Grund grün.

Die Galerie beantwortet außerdem nur die halbe Frage — ob jede Component *einzeln* barrierefrei ist. Ob sie es *zusammen* noch sind, zeigt erst eine echte Seite, deshalb nimmt derselbe Lauf beliebig viele:

```bash
node axe.mjs --sitemap https://v14.kern-ux.ddev.site kern-ux-demo kern-ux-demo/elemente/hinweis …
```

Fünf der Barrierefreiheitsfehler in dieser Extension sind genau so gefunden worden und nicht von den Unit- oder Markup-Tests. Alle fünf lagen *zwischen* den geprüften Einheiten — Überschriftenordnung über eine ganze Seite, Eindeutigkeit der Landmarken, Kontrast im echten Layout. Keine davon ist eine Eigenschaft, die eine Component allein haben kann.

Die Galerie ist standardmäßig aus, weil sie ein Entwicklungs- und Prüfwerkzeug ist und nicht Seiteninhalt. Im Kontext `Production` genügt die Einstellung allein nicht: dort wird sie nur an eine angemeldete Backend-Sitzung ausgeliefert. Ein Schalter in den Site-Settings ist zu wenig, um auf einer Produktivseite eine zusätzliche öffentliche Route zu öffnen.

## Zwei Majors, eine Codebase, unvereinbare Abhängigkeiten

Content Blocks 1.x ist TYPO3-13-only, 2.x ist 14-only. Eine Codebase, die beide bedient, heißt also, dass sich die Abhängigkeitsgraphen gegenseitig ausschließen — deshalb bringt das Repository einen DDEV-Harness mit, der beide Majors parallel betreibt:

```bash
ddev install-all          # oder: ddev install-v13 / ddev install-v14
```

„Tests laufen lassen" heißt hier folglich immer *einen Major festpinnen, auflösen, testen* — ein nacktes `phpunit` würde nur den zuletzt installierten Major prüfen. Die CI fährt dieselbe Matrix: statische Analyse, Unit- und Functional-Tests über TYPO3 13/14 × PHP 8.2/8.3/8.4, ein `--prefer-lowest`-Lauf je Major und der axe-Lauf gegen die Galerie.

Die KERN-Distribution wird bewusst nicht mitgeliefert. Sie wird einmalig zur Installationszeit von npm geholt und per SHA-512 geprüft — zur Laufzeit gibt es also keine Fremd-Requests und kein CDN in der Seite:

```bash
composer require balatd/kern-ux:^1.0@alpha
vendor/bin/typo3 extension:setup
vendor/bin/typo3 kern-ux:assets:install
```

Das Zielverzeichnis ist nicht eingecheckt, damit gehört der letzte Schritt in jedes Deployment und ist keine Einmal-Aufgabe.

## Kleine Entscheidungen, die keine Einstellung sind

Ein paar Verhaltensweisen sehen wie fehlende Optionen aus und sind es nicht.

Der Block **Bühne** stellt seinen Text im Quelltext immer vor das Bild, auch wenn das Bild links gezeigt wird — die Seite ist eine Grid-Reihenfolge, damit die Lesereihenfolge dem Inhalt folgt und nicht dem Layout. Das Bild trägt keine Bildunterschrift und ist keine `figure`: ein Bühnenbild illustriert, und was ein Besucher wirklich braucht, steht im Vorspann. Ein Bild mit eigener Aussage gehört in *Bild* oder *Text und Medien*.

**Semantik und Optik** einer Component sind getrennte Argumente. Die Überschriftenstufe ist ein Argument, die visuelle Größe ein zweites. KERN verlangt das ausdrücklich, damit eine Component in jede Dokumentstruktur passt, ohne ihr Aussehen zu ändern.

Quellsprache ist **Englisch, die deutsche Übersetzung liegt in `de.*.xlf`** — die TYPO3-Konvention, und das ist nicht kosmetisch. TYPO3 behandelt `en` als Default-Sprachschlüssel und liest dann die `<source>`-Werte, statt nach einer `en.`-Übersetzung zu suchen. Mit deutscher Quelle zeigte eine englische Seite auf TYPO3 13 deutsche Texte, während TYPO3 14 die Übersetzung fand.

## Was ich gelernt habe

Die interessante Arbeit war nicht, vierzig Components zu bauen. Sie war die Entscheidung, wo eine Zusage leben darf.

Jede Barrierefreiheits-Zusage in dieser Extension steht in genau einem Partial, einer Component oder einem Test — und wo das nicht so war, ist sie gebrochen. Die fünf Fehler, die erst die Ganzseiten-Läufe gefunden haben, sind der deutlichste Beleg: Unit-Tests können nur die Einheiten prüfen, und „barrierefreie Components" und „eine barrierefreie Seite" sind zwei verschiedene Behauptungen. Genauso wie „axe ist grün" und „axe wurde die richtige Frage gestellt" — weshalb Regelmenge, drei Viewport-Durchgänge und Stylesheet-Wächter alle begründet werden mussten, statt sie aus einer Vorlage zu übernehmen.

Was Automatisierung weiterhin nicht fängt, steht geschrieben statt angedeutet: Tastaturbedienung durch mehrstufige Formulare mit Fehlern, Screenreader-Ausgabe bei Feldern mit Hinweis *und* Fehler, und die Überschriftenordnung ganzer Seiten. Das wird von Hand abgenommen. Das Alpha-Label ist ehrlich — der Nutzen ist echt, aber ein Standard, an dem öffentliche Stellen rechtlich gemessen werden, verdient Praxis-Kilometer, bevor er 1.0 behauptet.

`kern_ux` liegt auf [GitHub](https://github.com/balatD/kern_ux) und [Packagist](https://packagist.org/packages/balatd/kern-ux). GPL-2.0-or-later, Public Alpha, TYPO3 13.4 und 14.3.
