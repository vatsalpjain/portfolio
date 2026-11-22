# 0002 — Content lives in Markdown files in the repo

- **Status:** Accepted
- **Date:** 2026-11-22

## Context

A website can get its content from many places: hard-coded HTML, Markdown files, JSON/YAML data files, a headless CMS, a git-based CMS, a database, a custom admin panel, or external APIs. The content here is written only by me, changes slowly, and the site has no user-generated data.

## Decision

| Content                                          | Source                                                                                                                |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| Home page text (intro, story, philosophy, links) | Markdown file(s) in the repo                                                                                          |
| Blog posts                                       | One Markdown/MDX file per post, with front matter (title, date, tags, summary)                                        |
| Projects                                         | GitHub API at build time (see [0003](0003-projects-from-github.md)), plus an optional small override file in the repo |
| Images                                           | Stored in the repo, optimized at build time                                                                           |

No database, no headless CMS, and no admin panel.

## Consequences

- Free, fast, and versioned in git: every change is reviewable and reversible.
- Publishing means writing a file and pushing to git, which triggers a rebuild.
- Nothing is live that could be attacked or go down.
- If I later want to write from a browser, a git-based CMS (Decap, Tina, Keystatic) can be added on top without changing the content format.
