import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    description: z.string(),
    // Short (≤160 chars) plain-text description for search results; falls back to `description`.
    seoDescription: z.string().max(160).optional(),
    author: z.string(),
  }),
});

export const collections = {
  blog: blogCollection,
};
