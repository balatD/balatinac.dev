import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { buildDeMap, getLocalizedEntry } from '../lib/content-helpers';

// The feed declares German and sits at the root, so it has to resolve German
// titles and German `urlSlug`s. Deriving links from the English collection ids
// instead emits URLs that were never built.
export async function GET(context: APIContext) {
  const blog = await getCollection('blog');
  const blogDe = await getCollection('blogDe');
  const projects = await getCollection('projects');
  const projectsDe = await getCollection('projectsDe');

  const blogDeMap = buildDeMap(blogDe);
  const projectsDeMap = buildDeMap(projectsDe);

  const blogItems = blog
    .filter((p) => !p.data.draft)
    .map((post) => {
      const { title, description, slug } = getLocalizedEntry(post, blogDeMap, 'de');
      return {
        title,
        description,
        pubDate: post.data.publishedAt,
        link: `/blog/${slug}/`,
        categories: post.data.tags,
      };
    });

  const projectItems = projects.map((project) => {
    const { title, description, slug } = getLocalizedEntry(project, projectsDeMap, 'de');
    return {
      title,
      description,
      pubDate: project.data.publishedAt,
      link: `/work/${slug}/`,
      categories: project.data.tags,
    };
  });

  const items = [...blogItems, ...projectItems].sort(
    (a, b) => b.pubDate.valueOf() - a.pubDate.valueOf()
  );

  return rss({
    title: 'Dragan Balatinac — Projekte & Texte',
    description: 'Aktuelle Arbeiten und Texte von Dragan Balatinac.',
    site: context.site!,
    items,
    customData: `<language>de</language>`,
  });
}
