import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// `z` re-exported from astro:content is deprecated; import zod directly.
import { z } from 'astro/zod';

const projectsDe = defineCollection({
  loader: glob({ pattern: 'de/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    urlSlug: z.string().optional(),
    tags: z.array(z.string()),
    year: z.number(),
    order: z.number(),
    featured: z.boolean().default(false),
    publishedAt: z.coerce.date(),
    meta: z.object({
      duration: z.string().optional(),
      role: z.string().optional(),
      team: z.string().optional(),
      status: z.string().optional(),
    }).optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    urlSlug: z.string().optional(),
    tags: z.array(z.string()),
    year: z.number(),
    order: z.number(),
    featured: z.boolean().default(false),
    publishedAt: z.coerce.date(),
    meta: z.object({
      duration: z.string().optional(),
      role: z.string().optional(),
      team: z.string().optional(),
      status: z.string().optional(),
    }).optional(),
  }),
});

const blogDe = defineCollection({
  loader: glob({ pattern: 'de/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    urlSlug: z.string().optional(),
    tags: z.array(z.string()),
    publishedAt: z.coerce.date(),
    readTime: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    urlSlug: z.string().optional(),
    tags: z.array(z.string()),
    publishedAt: z.coerce.date(),
    readTime: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, projectsDe, blog, blogDe };
