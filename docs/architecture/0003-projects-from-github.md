# 0003 — Projects come from GitHub repos tagged `portfolio`

- **Status:** Accepted
- **Date:** 2026-11-22

## Context

All my work is already on GitHub. Keeping a separate project list on the site by hand would drift out of date, and it would be easy to over-describe things there. GitHub should be the single source of truth.

## Decision

- **Selection:** only public repos with the GitHub topic **`portfolio`** appear. I control what's shown from GitHub itself.
- **Data fetched at build time:**
  - name and one-line description
  - primary language
  - created and last-pushed dates
  - stars
  - repo URL and homepage URL (if any)
  - README
- **Presentation:** a dated list on `/projects`. Each row is **expandable** (a native `<details>` element) rather than a separate page:
  - **Collapsed:** year · name · one-line description.
  - **Expanded:**
    - a short summary
    - facts: language · last updated · stars
    - links: GitHub, plus a live demo only if one exists
- **Summary source:** the `## Summary` section of the README if there is one, otherwise the README's first paragraph.
- **Overrides (optional):** a small file in the repo can hide a repo or replace its summary or description.
- **Home page:** shows the few most recently updated tagged projects, linking to `/projects`.

## Consequences

- The Projects page grows by itself as I tag repos. No site edit is needed.
- All facts come straight from GitHub, so nothing can be invented.
- The quality of the page depends on my repo descriptions and READMEs. To-do: write a clear description and an opening summary for each tagged repo.
- Expandable rows work without JavaScript, are keyboard and screen-reader accessible, and keep all text in the HTML so search engines can read it.
- Needs a new design system v2 component: the **expandable row**.
- Needs a GitHub token at build time (see [0004](0004-no-backend-build-time-data.md)).
