import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
  type: "content", // v2.5.0 and later
  schema: z.object({
    title: z.string(),
    date: z.string(),
    description: z.string(),
    author: z.string(),
  }),
});

export const collections = {
  blog: blogCollection,
};
