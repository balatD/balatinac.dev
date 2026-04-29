/**
 * UI string translations only.
 * Content translations (project/blog titles, descriptions) come from
 * German .md files in de/ subdirectories and are embedded as data-de attributes.
 */
export const translations: Record<string, Record<string, string>> = {
  // === Nav ===
  'nav.about': { en: 'About', de: 'Über mich' },
  'nav.work': { en: 'Work', de: 'Projekte' },
  'nav.writing': { en: 'Writing', de: 'Texte' },
  'nav.contact': { en: 'Contact', de: 'Kontakt' },

  // === Page titles ===
  'title.home': { en: 'Dragan Balatinac', de: 'Dragan Balatinac' },
  'title.work': { en: 'Selected Work — Dragan Balatinac', de: 'Ausgewählte Arbeiten — Dragan Balatinac' },
  'title.blog': { en: 'Writing — Dragan Balatinac', de: 'Texte — Dragan Balatinac' },
  'title.404': { en: '404 — Not found — Dragan Balatinac', de: '404 — Nicht gefunden — Dragan Balatinac' },

  // === Homepage — Hero ===
  'hero.greeting': { en: 'Hello — I\'m Dragan.', de: 'Hallo — ich bin Dragan.' },
  'hero.heading': {
    en: 'Backend developer from NRW. I build <span class="text-accent">quiet, reliable</span> systems with <span class="text-accent">TYPO3</span>, <span class="text-accent">PHP</span>, <em class="not-italic text-muted">and the DevOps glue around them.</em>',
    de: 'Backend-Entwickler aus NRW. Ich baue <span class="text-accent">ruhige, zuverlässige</span> Systeme mit <span class="text-accent">TYPO3</span>, <span class="text-accent">PHP</span> <em class="not-italic text-muted">und dem DevOps-Klebstoff drumherum.</em>',
  },
  'hero.sub': {
    en: 'This is where I keep my work, my notes, and the occasional opinion about why the boring choice is usually the right one.',
    de: 'Hier sammle ich meine Arbeit, meine Notizen und gelegentlich die Meinung, warum die langweilige Lösung meist die richtige ist.',
  },
  'hero.cta.work': { en: 'See the work →', de: 'Zur Arbeit →' },
  'hero.cta.notes': { en: 'Read the notes', de: 'Notizen lesen' },

  // === Homepage — About ===
  'about.label': { en: 'About', de: 'Über mich' },
  'about.p1': {
    en: 'I\'ve been at home on the web for a while — working professionally as a web developer since 2018. Most of that time in the unglamorous middle: schemas, editorial workflows, deployment pipelines, and the hundred small choices that decide whether a CMS is a tool or a tax.',
    de: 'Im Web bin ich schon länger zu Hause — professionell als Webentwickler arbeite ich seit 2018. Die meiste Zeit davon in der unspektakulären Mitte: Schemata, redaktionelle Workflows, Deployment-Pipelines und die hundert kleinen Entscheidungen, die darüber bestimmen, ob ein CMS ein Werkzeug oder eine Last ist.',
  },
  'about.p2': {
    en: 'My home is <span class="text-accent">TYPO3</span>, but I like to look beyond the horizon: with <span class="text-accent">Astro</span> and <span class="text-accent">Payload CMS</span> I work on headless setups — a different perspective on the same questions, often with surprisingly similar answers. What works well, I learn from. What doesn\'t work, I learn from even more.',
    de: 'Mein Zuhause ist <span class="text-accent">TYPO3</span>, aber ich schaue gerne über den Tellerrand: mit <span class="text-accent">Astro</span> und <span class="text-accent">Payload CMS</span> arbeite ich an headless Setups — eine andere Perspektive auf dieselben Fragen, oft mit überraschend ähnlichen Antworten. Was gut funktioniert, lerne ich mit, was nicht funktioniert, lerne ich erst recht.',
  },
  'about.p3': {
    en: 'Over time I\'ve led and delivered several larger <span class="text-accent">TYPO3</span> and web projects — from the first architecture sketch to go-live and beyond. Today I\'m responsible for the backend team at a mid-sized agency in Essen. On top of that, I hold a certified trainer qualification, because I believe good backend work and good mentoring need the same foundation: patience, clear structures, and the willingness to explain things twice.',
    de: 'Im Laufe der Zeit habe ich mehrere größere <span class="text-accent">TYPO3</span>- und Web-Projekte geleitet und umgesetzt — von der ersten Architekturskizze bis zum Go-live und darüber hinaus. Heute verantworte ich das Backend-Team einer mittelgroßen Agentur in Essen. Dazu kommt ein Ausbilderschein, weil ich glaube, dass gutes Backend und gute Nachwuchsförderung dieselbe Grundhaltung brauchen: Geduld, klare Strukturen und die Bereitschaft, Dinge zweimal zu erklären.',
  },
  'about.p4': {
    en: 'Currently responsible for multiple <span class="text-accent">TYPO3</span> instances, the associated infrastructure, server management, and everything else that falls in between — and on the side, slowly turning my opinions into writing.',
    de: 'Aktuell verantwortlich für mehrere <span class="text-accent">TYPO3</span>-Instanzen, die zugehörige Infrastruktur, das Server-Management und vieles, was sonst noch so dazwischen liegt — und nebenbei dabei, meine Meinungen langsam in Texte zu verwandeln.',
  },

  // === Section labels ===
  'work.label': { en: 'Selected work', de: 'Ausgewählte Arbeiten' },
  'work.all': { en: 'All work', de: 'Alle Arbeiten' },
  'writing.label': { en: 'Writing', de: 'Texte' },
  'writing.all': { en: 'All writing', de: 'Alle Texte' },

  // === Contact ===
  'contact.label': { en: 'Contact', de: 'Kontakt' },
  'contact.email': { en: 'Email', de: 'E-Mail' },
  'contact.code': { en: 'Code', de: 'Code' },
  'contact.network': { en: 'Network', de: 'Netzwerk' },

  // === Footer ===
  'footer.built': {
    en: 'No tracking.',
    de: 'Kein Tracking.',
  },

  // === Empty states ===
  'empty.work': { en: 'Projects coming soon.', de: 'Projekte folgen in Kürze.' },
  'empty.blog': { en: 'Posts coming soon.', de: 'Beiträge folgen in Kürze.' },

  // === Work index ===
  'workIndex.crumb': { en: 'Selected Work', de: 'Ausgewählte Arbeiten' },
  'workIndex.heading': {
    en: 'Things I\'ve worked on — and <span class="text-accent">learned</span> from.',
    de: 'Sachen, an denen ich <span class="text-accent">gearbeitet</span> habe — und aus denen ich etwas mitgenommen habe.',
  },
  'workIndex.sub': {
    en: 'Backend platforms, custom CMS work, and the DevOps glue that holds them together.',
    de: 'Backend-Plattformen, individuelle CMS-Arbeit und der DevOps-Klebstoff, der alles zusammenhält.',
  },

  // === Blog index ===
  'blogIndex.crumb': { en: 'Writing', de: 'Texte' },
  'blogIndex.label': { en: 'Writing · Notes from the server room', de: 'Texte · Notizen aus dem Serverraum' },
  'blogIndex.heading': {
    en: 'Written down before I <span class="text-accent">forget</span> again.',
    de: 'Aufgeschrieben, bevor ich es wieder <span class="text-accent">vergesse</span>.',
  },
  'blogIndex.sub': {
    en: 'Short posts from my day-to-day between TYPO3, Astro, PHP, Docker, AI, and everything else that ends up on my servers. Mostly so future-me can skip the research.',
    de: 'Kurze Beiträge aus meinem Alltag zwischen TYPO3, Astro, PHP, Docker, KI und allem, was sonst auf meinen Servern landet. Vor allem, damit Zukunfts-Ich sich die Recherche spart.',
  },
  'blogIndex.draft': { en: 'Draft', de: 'Entwurf' },

  // === Detail page meta labels ===
  'meta.caseStudy': { en: 'Case study', de: 'Fallstudie' },
  'meta.year': { en: 'Year', de: 'Jahr' },
  'meta.duration': { en: 'Duration', de: 'Dauer' },
  'meta.role': { en: 'Role', de: 'Rolle' },
  'meta.team': { en: 'Team', de: 'Team' },
  'meta.status': { en: 'Status', de: 'Status' },
  'meta.next': { en: 'Next', de: 'Weiter' },
  'meta.published': { en: 'Published', de: 'Veröffentlicht' },
  'meta.readTime': { en: 'Read time', de: 'Lesezeit' },
  'blog.backToWriting': { en: '← Back to writing', de: '← Zurück zu Texte' },
  'blog.allPosts': { en: 'All posts', de: 'Alle Beiträge' },
  'blog.nextPost': { en: 'Next post', de: 'Nächster Beitrag' },

  // === Breadcrumbs ===
  'crumb.home': { en: 'Home', de: 'Start' },
  'crumb.work': { en: 'Work', de: 'Projekte' },
  'crumb.writing': { en: 'Writing', de: 'Texte' },

  // === Skip link ===
  'skip': { en: 'Skip to content', de: 'Zum Inhalt springen' },

  // === 404 ===
  '404.heading': { en: 'Page not found.', de: 'Seite nicht gefunden.' },
  '404.sub': {
    en: 'Whatever was here isn\'t anymore — or never was. Either way, let\'s get you back.',
    de: 'Was auch immer hier war, ist nicht mehr da — oder war nie hier. So oder so, lass uns zurückgehen.',
  },
  '404.home': { en: '← Home', de: '← Start' },
  '404.work': { en: 'Work', de: 'Projekte' },
  '404.writing': { en: 'Writing', de: 'Texte' },
};
