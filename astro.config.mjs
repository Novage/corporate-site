import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  build: {
    format: "preserve",
  },
  markdown: {
    shikiConfig: {
      theme: "material-theme-lighter",
    },
    syntaxHighlight: "shiki",
  },
  site: "https://novage.com.ua/",
  integrations: [
    react(),
    mdx(),
    sitemap({
      // List canonical pages only: /blog/blog duplicates /blog/, and the
      // /2019/ pages are old URLs whose canonical is the matching blog post.
      filter: (page) =>
        !page.endsWith("/404") &&
        !page.includes("/blog/blog") &&
        !page.includes("/2019/"),
      // The blog index lives at /blog/ (its canonical URL); /blog redirects there.
      serialize: (item) =>
        item.url.endsWith("/blog") ? { ...item, url: `${item.url}/` } : item,
    }),
  ],
});
