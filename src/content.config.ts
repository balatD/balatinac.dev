import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
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

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    publishedAt: z.coerce.date(),
    readTime: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, blog };
