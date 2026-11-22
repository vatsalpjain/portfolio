# 0007 — Build pipeline and GitHub data

- **Status:** Accepted
- **Date:** 2026-11-22

## Context

The site is static ([0005](0005-rendering-and-stack.md)), and its only outside data comes from GitHub at build time ([0003](0003-projects-from-github.md), [0004](0004-no-backend-build-time-data.md)). The pipeline has to be:

- reliable, so it never publishes broken or empty data
- safe with the token
- easy to run locally
- fast for visitors

## Decision

### Stages

1. **Install:** pinned Node version (`.nvmrc`) and a lockfile.
2. **Fetch:** the GitHub content loader gets the tagged repos, their READMEs and the contribution calendar.
3. **Validate:** schemas check blog front matter and GitHub data.
4. **Render:** Astro builds every page to static HTML.
5. **Optimize:** images and fonts (see below).
6. **Check:** type check, then broken-link check. Details belong to the testing decision.

### Triggers

- every push to `main`
- a daily scheduled rebuild
- a manual "rebuild now" button (`workflow_dispatch`)

Where the build runs (host vs GitHub Actions) is decided with hosting.

### Failure behavior

- If the GitHub API fails, **the build fails loudly**. On a static host a failed build never replaces the live site, so the last good version stays up. An empty Projects page can never be published.
- **Local development without a token** uses a committed sample data file, so the site runs offline and needs no secrets.

### Token

- A **fine-grained GitHub token with no permissions**. It can read public data only, so a leak can't modify anything.
- Stored only as a GitHub Actions secret named **`GH_DATA_TOKEN`**. GitHub doesn't allow secret names starting with `GITHUB_`, and the name avoids confusion with Actions' built-in `GITHUB_TOKEN`. Documented in `.env.example`, and never committed or sent to the browser.

### README summaries

- Source: the `## Summary` section if there is one, otherwise the first paragraph.
- Badges, images and HTML are stripped, and the text is trimmed to about 300 characters.
- Rendered **as plain text only**. No README HTML is ever inserted raw.

### Contribution graph

- **Range:** the last 12 months.
- **Includes private contributions as anonymous counts.** This requires the "Private contributions" setting to be on in my GitHub profile, which makes those counts public on GitHub too. No private repo names or details are ever shown.
- **Honesty:** the graph is labeled so it's clear it includes private work, e.g. "312 contributions in the last year, including private repositories." That way nothing looks like more public work than it is.
- **Rendering:** an SVG built at build time, with 5 sage levels and an accessible text label. No JavaScript.

### Fonts

- EB Garamond is **self-hosted**, subset to Latin, using only the weights in use (400, 500, italic 400/500), with `font-display: swap`. The regular weight is preloaded.
- No requests to Google Fonts, so no visitor data goes to a third party.

### Images

- Astro's built-in image optimization:
  - AVIF and WebP output
  - responsive sizes
  - explicit width and height (no layout shift)
  - lazy loading below the fold
- Blog images sit next to their post file.

## Consequences

- Failure is always safe: the worst case is that the site is a day stale, never broken.
- Anyone can clone and run the site without credentials.
- README quality directly drives project summaries, so writing good READMEs is part of maintaining the site.
- The contribution graph is fuller with private counts, and the label keeps it honest.
- Self-hosted fonts add about 100–150 KB of font files to the repo and the first visit, but remove an external dependency and a privacy leak.
