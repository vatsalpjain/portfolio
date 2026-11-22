# 0006 — Project structure and frontend architecture

- **Status:** Accepted
- **Date:** 2026-11-22

## Context

With Astro + TypeScript chosen ([0005](0005-rendering-and-stack.md)), the project needs a layout where content, presentation, external data and routing are clearly separated. That way the site can grow for years without turning into a tangle.

## Decision

### Folder layout

```
portfolio/
├── docs/architecture/          decision log
├── design-system/              v2 reference page (documentation only)
├── src/
│   ├── pages/                  routes: one file = one URL
│   │   ├── index.astro             /
│   │   ├── projects.astro          /projects
│   │   ├── blog/index.astro        /blog
│   │   ├── blog/[slug].astro       /blog/<post>
│   │   ├── rss.xml.ts              /rss.xml
│   │   └── 404.astro
│   ├── layouts/                BaseLayout (html/head/SEO/header/footer), PostLayout
│   ├── components/             design system v2 as .astro components
│   ├── content/                everything I write
│   │   ├── home.md                 the whole Home page text, one file
│   │   ├── blog/                   one .md or .mdx per post
│   │   └── projects.yaml           optional overrides (hide / better summary)
│   ├── content.config.ts       collection schemas
│   ├── lib/github/             build-time GitHub layer (client, repos, contributions)
│   ├── styles/                 tokens.css + global.css
│   ├── assets/                 images optimized by Astro
│   └── site.config.ts          name, links, nav: one place to edit
├── public/                     copied as-is: favicon, robots.txt, fonts
├── .github/workflows/          CI + scheduled daily rebuild
├── astro.config.mjs · tsconfig.json · package.json
├── .env.example                documents GH_DATA_TOKEN (real .env is git-ignored)
└── .nvmrc                      pinned Node version
```

**Rule:** each folder has one job.

- `content/` = **what** I say
- `components/` and `layouts/` = **how** it looks
- `lib/github/` = **where** outside data comes from
- `pages/` = **which** URLs exist

### Styling

- `tokens.css` and base styles (body, type, links) are **global**.
- Every component carries **its own scoped CSS** inside its `.astro` file. Astro scopes it automatically and ships only the CSS for components actually used on a page.
- `design-system/v2.css` stays as the reference. Its rules are split into the matching components.

### Content

- **Home:** a single `home.md` written as plain prose (intro, story so far, philosophy). **No timeline or structured data.** The page template adds the recent-projects list, contribution graph and links around it.
- **Blog:** Markdown by default. **MDX is allowed** only when a post needs a component (callout, diagram).
- **Schemas** in `content.config.ts` validate front matter (title, date, summary, tags, draft). A mistake fails the build with a clear message instead of breaking a page.

### Projects data

- `lib/github/` is implemented as an **Astro content loader**. Tagged repos load as a `projects` collection, just like local files: typed, schema-checked, and cached between builds.
- `projects.yaml` overrides are merged in by the loader.

## Consequences

- Adding a post means adding one file. Changing my name or links means editing one file.
- Pages don't know whether data came from Markdown or GitHub. Both are collections.
- Scoped CSS means changing one component can't accidentally restyle another.
- New components needed beyond v2: **ProjectRow** (expandable `<details>` row), **ContributionGraph** (build-time SVG), **EmptyState**.
- Decision 0001's Home contents still hold. They're written as prose in one file rather than as separate data.
