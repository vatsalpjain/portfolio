# 0004 — No backend: all data is fetched at build time

- **Status:** Accepted
- **Date:** 2026-11-22

## Context

The only "live" data the site wants is from GitHub: the repo list ([0003](0003-projects-from-github.md)) and the contribution graph on the Home page. The options for the graph were:

1. Embed a third-party image service (no styling control, external dependency).
2. Fetch at build time and render it ourselves.
3. A serverless function with caching (a small backend).
4. Fetch from the visitor's browser. Not viable: GitHub's API needs a token that would be exposed, and the contributions page is blocked by CORS.

## Decision

- **No backend, server or database.**
- A **build script** calls the GitHub GraphQL API to get:
  - the tagged repos
  - the contribution calendar
- The graph is drawn as an SVG in the design system v2 style (sage squares).
- The site **rebuilds on every push**, plus a **scheduled daily rebuild** (GitHub Actions cron) so repo data and the graph stay current.
- The GitHub token is a **build-time secret only**: stored in CI/host settings and never sent to the browser or committed.

## Consequences

- The site is fully static: fast, cheap or free to host, with almost nothing to attack.
- GitHub data is at most about a day old. That's fine, because contributions are counted per day.
- If the GitHub API fails during a build, the build should fail loudly rather than publish empty data. Possible improvement: fall back to the last good cached data.
- Any future feature where visitors send data (contact form, newsletter, comments, view counts) needs a new decision. It would likely be one or two serverless functions, not a full server.
