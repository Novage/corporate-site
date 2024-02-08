import { defineConfig } from "astro/config";

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
});
