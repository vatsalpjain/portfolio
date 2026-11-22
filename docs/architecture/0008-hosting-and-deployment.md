# 0008 — Hosting on Cloudflare, deployed from GitHub Actions

- **Status:** Accepted
- **Date:** 2026-11-22

## Context

The build outputs static files ([0005](0005-rendering-and-stack.md), [0007](0007-build-pipeline.md)). The host needs to:

- serve them from a CDN over HTTPS
- support custom **security headers**
- ideally offer preview deploys

Options considered: Cloudflare, Netlify, Vercel and GitHub Pages. GitHub Pages was ruled out because it can't set custom headers and has no previews. The other three are all capable and free for a site this size. nadh.in is also served through Cloudflare.

## Decision

- **Host: Cloudflare**, serving static assets from its global network. Free tier, with custom headers via a `_headers` file.
- **Build: GitHub Actions** builds, checks and uploads the finished `dist/` folder to Cloudflare. Cloudflare doesn't build anything.

| Event                         | Workflow does                                             |
| ----------------------------- | --------------------------------------------------------- |
| Push to `main`                | build → check → deploy to **production**                  |
| Push to any other branch / PR | build → check → deploy a **preview URL** (not production) |
| Daily schedule                | rebuild + deploy production (fresh GitHub data)           |
| Manual button                 | same as daily (`workflow_dispatch`)                       |

**Secrets** (GitHub repo secrets only):

- `GH_DATA_TOKEN`: fine-grained, no permissions, for build-time data ([0007](0007-build-pipeline.md)). GitHub doesn't allow secret names starting with `GITHUB_`.
- `CLOUDFLARE_API_TOKEN`: a custom token with only the **Cloudflare Pages: Edit** permission, limited to my account. Cloudflare can't scope tokens to a single Pages project, so the account should hold nothing else important.
- `CLOUDFLARE_ACCOUNT_ID`

**Other settings:**

- Cloudflare **analytics stay off**, per [0001](0001-scope-and-audience.md): no metrics.
- **Domain:** the free Cloudflare Pages subdomain **`vatsaljain.pages.dev`**, if the project name is available when the project is created. If it's taken, Cloudflare adds a random suffix, so pick an alternative name rather than accept that.
  - To get a `*.pages.dev` address, deploy with the **Cloudflare Pages** product (direct upload from GitHub Actions). Workers addresses are longer (`<project>.<account>.workers.dev`).
  - Preview deploys get URLs under the same name, e.g. `<branch>.vatsaljain.pages.dev`.
  - A custom domain may be added later (e.g. via the GitHub Student Developer Pack or a paid domain). The canonical URL comes from one setting in `site.config.ts` / `astro.config.mjs`, so changing domains is a one-line change plus a redirect.

## Consequences

- All build logic and secrets live in GitHub. Cloudflare only receives finished files, so switching hosts later means changing one deploy step.
- The checks run before every deploy, and a failed check never reaches production.
- Preview URLs let me review drafts and changes on a real URL before merging.
- The Cloudflare API token is scoped narrowly, so a leak could only redeploy this site.
- When a custom domain is added:
  - set it as canonical
  - redirect the free subdomain to it
  - update the RSS and sitemap URLs (automatic from the config)
