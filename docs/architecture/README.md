# Architecture decision log

The decisions behind the portfolio, one file each, in the order they were made.
Each record follows the same shape: **Context → Decision → Consequences**.

| #                                            | Decision                                                                           | Status   | Date       |
| -------------------------------------------- | ---------------------------------------------------------------------------------- | -------- | ---------- |
| [0001](0001-scope-and-audience.md)           | Scope: a calm, honest, three-page portfolio                                        | Accepted | 2026-11-22 |
| [0002](0002-content-sources.md)              | Content lives in Markdown files in the repo                                        | Accepted | 2026-11-22 |
| [0003](0003-projects-from-github.md)         | Projects come from GitHub repos tagged `portfolio`                                 | Accepted | 2026-11-22 |
| [0004](0004-no-backend-build-time-data.md)   | No backend: all data is fetched at build time                                      | Accepted | 2026-11-22 |
| [0005](0005-rendering-and-stack.md)          | Static site generation with Astro and TypeScript                                   | Accepted | 2026-11-22 |
| [0006](0006-project-structure.md)            | Project structure and frontend architecture                                        | Accepted | 2026-11-22 |
| [0007](0007-build-pipeline.md)               | Build pipeline and GitHub data                                                     | Accepted | 2026-11-22 |
| [0008](0008-hosting-and-deployment.md)       | Hosting on Cloudflare Pages (`vatsaljain.pages.dev`), deployed from GitHub Actions | Accepted | 2026-11-22 |
| [0009](0009-security.md)                     | Security: headers, secrets, supply chain, accounts                                 | Accepted | 2026-11-22 |
| [0010](0010-quality-workflow-and-sharing.md) | Quality checks, git workflow, link previews (SEO skipped)                          | Accepted | 2026-11-22 |

**Architecture phase complete.** Next: implementation.

## How to add a decision

1. Copy the newest record and give it the next number.
2. Keep the **Context, Decision, Consequences** sections short and plain.
3. Don't edit or delete old decisions. When a decision changes, write a new record and mark the old one `Superseded by 00XX`.

Related: the visual design system lives in [`/design-system`](../../design-system/design-system-v2.html).
