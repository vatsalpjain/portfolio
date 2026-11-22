# vatsaljain.pages.dev

My personal site: a calm, static portfolio with three pages (Home, Projects, Blog).

Built with [Astro](https://astro.build) and TypeScript, styled with a small hand-made design system (warm paper, EB Garamond, sage green), and hosted on Cloudflare Pages. There's no backend, database or tracking.

## How it works

- **Home** text lives in [`src/content/home.md`](src/content/home.md).
- **Blog** posts are Markdown files in [`src/content/blog/`](src/content/blog/) (`.mdx` when a post needs a component).
- **Projects** come straight from GitHub: every public repo with the topic `portfolio` appears automatically, with its README's first paragraph (or `## Summary` section) as the summary. Optional overrides go in [`src/content/projects.yaml`](src/content/projects.yaml).
- The **contribution graph** is fetched at build time and drawn as an SVG.
- The site rebuilds on every push and once a day, so GitHub data stays fresh.

## Run it locally

Requires Node 24 (see `.nvmrc`).

```sh
npm install
npm run dev        # http://localhost:4321
```

On Windows with **Smart App Control** on, Windows blocks Astro's native compiler file. Run `npm run setup:wasm` once after installing. It adds Astro's official WebAssembly compiler locally, without changing `package.json`.

Without a token the site uses clearly-marked **sample** GitHub data. To use real data, copy `.env.example` to `.env` and add a fine-grained GitHub token (public repositories, read-only, no permissions).

```sh
npm run verify     # type check, formatting, build, broken-link check
npm run preview    # serve the built site
```

## Writing a post

Create `src/content/blog/my-post.md`:

```md
---
title: My post
date: 2026-12-01
summary: One sentence about what it's about.
tags: [learning]
draft: false
---

The post text…
```

## Decisions

Why things are the way they are: [`docs/architecture/`](docs/architecture/README.md).
The design system reference: [`design-system/design-system-v2.html`](design-system/design-system-v2.html).
