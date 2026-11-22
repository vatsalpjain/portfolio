# 0010 — Quality checks, git workflow and link previews (SEO skipped)

- **Status:** Accepted
- **Date:** 2026-11-22

## Context

The remaining production topics are performance, SEO, accessibility, testing and workflow. For a calm personal site, most of these are already covered by earlier decisions or don't justify dedicated work:

- **Performance:** static HTML, no client JS, optimized images, self-hosted subset fonts ([0005](0005-rendering-and-stack.md), [0007](0007-build-pipeline.md)).
- **Accessibility:**
  - WCAG AA contrast on all readable text
  - reduced-motion support
  - semantic HTML
  - native `<details>` for the expandable rows

  All of these come from design system v2 and [0003](0003-projects-from-github.md).

- **SEO:** static HTML is fully crawlable by default.

## Decision

### SEO: intentionally skipped

No keyword work, structured data, ranking goals or SEO tooling. Only the basics come for free from the base layout:

- a unique `<title>` and meta description per page
- a canonical URL
- `sitemap.xml` and `robots.txt`
- RSS for the blog

### Link previews (for sharing, not SEO)

- Open Graph and Twitter-card tags on every page, with title, description and URL.
- **One site-wide preview image** in the design system v2 style, used for all pages. Per-post images are possible later.

### Quality checks in CI

These run on every push and every PR, and **block deploys** when they fail:

1. `astro check`: TypeScript and content schema errors.
2. **Prettier** in check mode, for consistent formatting.
3. A **broken-link check** on the built site (internal links, plus external links in reporting-only mode).
4. `npm audit --audit-level=high` ([0009](0009-security.md)).

No unit or end-to-end test suite for now. Add tests if logic grows (e.g. README summary parsing in `lib/github/`).

### Git workflow

- `main` is always deployable and protected ([0009](0009-security.md)).
- Each change goes on its own branch → preview URL → merge to `main` → production.
- Commit messages are short and descriptive, with no strict convention.

### Small items handled during the build

These don't need decisions:

- favicon
- 404 page
- project README
- a reminder to rotate the yearly GitHub token

## Consequences

- The architecture phase is complete. Next is implementation.
- If discoverability ever matters, a new decision can add structured data or per-post preview images without restructuring anything.
- Without automated tests, the type, schema and link checks are the safety net. Keep `lib/github/` small so it stays easy to verify.
