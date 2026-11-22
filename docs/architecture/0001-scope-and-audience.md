# 0001 — Scope: a calm, honest, three-page portfolio

- **Status:** Accepted
- **Date:** 2026-11-22

## Context

I'm an engineering student and I want a personal website that shows me and my work. The site will keep growing as I do. I don't have a lot of content yet, and I don't want to make it look like more than it is.

## Decision

- **Purpose:** a calm, simple personal portfolio that evolves over time.
- **Audience:** anyone interested in my work. Content is shown the way I like, not tailored to recruiters or any one group.
- **Pages:** exactly three: **Home**, **Projects**, **Blog**.
- **Launch:** no MVP. What we build is the complete site that goes live.
- **Metrics:** none. No analytics, click tracking or conversion goals.
- **Content principle: honesty.** No faking, no inflated claims, no show-off. Every sentence and every number must be true and checkable. Keeping the content small is fine.

### Page contents

| Page     | Contents                                                                                                                                                                                             |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home     | Intro (who I am, what I study) → story so far (college life and engineering, in short) → philosophy (a few simple lines) → recent work + GitHub contribution graph → links (email, GitHub, LinkedIn) |
| Projects | Dated list of my GitHub projects as expandable rows (see [0003](0003-projects-from-github.md))                                                                                                       |
| Blog     | Markdown posts. Until the first post exists, an honest empty state, e.g. "Nothing written yet."                                                                                                      |

## Consequences

- No analytics means no cookies and no consent banner, which keeps privacy simple.
- With only three pages, navigation stays a single row and the site is easy to maintain.
- I write all the Home page text myself. Nothing on it is generated.
- Contact is by links only. There's no contact form, newsletter or comments, so no backend is needed for them. Adding any of these later needs a new decision.
- Visual design follows [design system v2](../../design-system/design-system-v2.html).
