# 0005 — Static site generation with Astro and TypeScript

- **Status:** Accepted
- **Date:** 2026-11-22

## Context

There are six common rendering types:

- Static Site Generation (SSG)
- Server-Side Rendering (SSR)
- Incremental Static Regeneration (ISR)
- Client-Side Rendering (CSR/SPA)
- Islands
- Hybrid

These are general concepts. Frameworks just make some of them easier.

My site's content is written by me and changes slowly. GitHub data is fetched at build time ([0004](0004-no-backend-build-time-data.md)). There's no backend and no personalization, which rules out SSR, ISR and CSR. SSG fits.

For reference, [nadh.in](https://nadh.in) is built with **Hugo** (its RSS feed declares `<generator>Hugo</generator>`) and served as static files behind Cloudflare.

Candidates considered:

- **Astro:** TypeScript, zero JavaScript by default, content collections, optional islands.
- **Hugo:** Go, fastest builds, single executable, but GitHub-fetch and SVG-drawing logic is clunky in Go templates.
- **11ty:** minimal JS, but more pieces to assemble.
- **Next.js / SvelteKit / Nuxt:** app frameworks; too heavy for three static pages.

## Decision

- **Rendering:** SSG. Every page is pre-built to plain HTML at deploy time (`/projects/index.html`, etc.).
- **Framework:** **Astro**, in its default static output mode.
- **Language:** **TypeScript** everywhere, including the GitHub build script.
- **Client JavaScript:** none by default. The only script is `v2.js` (scroll reveal and progress bar), which is optional. Islands are allowed later only if a real interactive need appears.
- **Styling:** design system v2 (`tokens.css` + `v2.css`) as plain CSS. No CSS framework.

## Consequences

- The build output is a folder of static files that can be hosted anywhere. There's no lock-in to one host.
- Content collections give type-checked front matter for blog posts, so mistakes fail the build instead of breaking a page.
- The GitHub fetch ([0003](0003-projects-from-github.md), [0004](0004-no-backend-build-time-data.md)) runs inside the Astro build in TypeScript.
- Requires Node.js for development and CI. Its version must be pinned.
- If SSR is ever needed, Astro supports hybrid rendering, so no rewrite is needed. That would need a new decision.
