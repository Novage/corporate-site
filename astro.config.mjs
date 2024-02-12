import { defineConfig } from "astro/config";

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
});
