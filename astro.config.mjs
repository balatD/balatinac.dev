// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { unified, rehypeHeadingIds } from '@astrojs/markdown-remark';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeProseImages from './plugins/rehype-prose-images.mjs';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://balatinac.dev',

  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
    // Astro 7 defaults to the Sätteri pipeline; rehype-autolink-headings is a
    // unified plugin, so this project stays on unified(). rehypeHeadingIds must
    // run first so autolink has an id to point at.
    processor: unified({
      rehypePlugins: [
        rehypeHeadingIds,
        [rehypeAutolinkHeadings, {
          behavior: 'append',
          content: { type: 'text', value: '#' },
          properties: { class: 'heading-link', ariaHidden: true, tabIndex: -1 },
        }],
        rehypeProseImages,
      ],
    }),
  },

  trailingSlash: 'always',

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  vite: {
    plugins: [tailwindcss()],
  },

  build: {
    inlineStylesheets: 'auto',
  },

  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => !page.includes('/draft/'),
    }),
  ],

  adapter: cloudflare(),
});