import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";

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
  site: "http://novage.com.ua/",
  integrations: [
    sitemap({
      priority: 0.8,
      lastmod: new Date(),
    }),
  ],
});
