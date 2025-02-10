import { defineConfig } from "astro/config";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [
      nodePolyfills({
        exclude: ["path", "os"],
      }),
    ],
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
  integrations: [react(), mdx()],
});
