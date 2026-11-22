// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// Canonical URL of the live site (decision 0008). Change here when a custom domain is added.
const SITE = "https://vatsaljain.pages.dev";

export default defineConfig({
  site: SITE,
  output: "static",
  // Cloudflare Pages serves folders at "/path/", so links use the trailing slash (no redirect hop).
  trailingSlash: "always",
  // Keep whitespace between inline elements (Astro 7 defaults to 'jsx', which strips it).
  compressHTML: true,
  integrations: [mdx(), sitemap()],
  build: {
    // Strict CSP (decision 0009): never inline styles into the HTML.
    inlineStylesheets: "never",
  },
  vite: {
    build: {
      // Never turn fonts/images into data: URIs, so everything loads from 'self'.
      assetsInlineLimit: 0,
    },
  },
});
