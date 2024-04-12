import { defineConfig } from "astro/config";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [nodePolyfills()],
  },
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
  integrations: [react()],
});
