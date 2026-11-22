# 0009 — Security

- **Status:** Accepted
- **Date:** 2026-11-22

## Context

The site is fully static ([0004](0004-no-backend-build-time-data.md), [0005](0005-rendering-and-stack.md)). There's no server, database, login or form, so the classic web attack surface is gone. What remains:

- **Account takeover:** GitHub or Cloudflare.
- **Supply chain:** npm packages and GitHub Actions running in the build.
- **Leaked secrets.**
- **Content injection:** untrusted text such as READMEs.
- **Browser-level attacks:** clickjacking, injected scripts, referrer leaks.
- **Email scraping.**

## Decision

### Security headers (`public/_headers`, served by Cloudflare)

| Header                       | Value                                                                                                                                                                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Content-Security-Policy`    | `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests` |
| `Strict-Transport-Security`  | `max-age=31536000; includeSubDomains`                                                                                                                                                                                           |
| `X-Content-Type-Options`     | `nosniff`                                                                                                                                                                                                                       |
| `Referrer-Policy`            | `strict-origin-when-cross-origin`                                                                                                                                                                                               |
| `Permissions-Policy`         | `camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()`                                                                                                                                              |
| `Cross-Origin-Opener-Policy` | `same-origin`                                                                                                                                                                                                                   |
| `X-Frame-Options`            | `DENY`                                                                                                                                                                                                                          |

- **Strict CSP, no `unsafe-inline`:** Astro is configured to never inline styles or scripts (`build.inlineStylesheets: 'never'`), and `v2.js` is an external file. Possible because fonts are self-hosted and there are no third-party scripts.
- **Preview deploys** also send `X-Robots-Tag: noindex`.
- The `.dev` TLD is HSTS-preloaded in browsers, so HTTPS on `pages.dev` is enforced even before the header.
- Verify the headers after the first deploy with a header scanner (e.g. securityheaders.com, Mozilla Observatory). Target: A or better.

### Secrets

- Stored only in GitHub repo secrets, each with least privilege:
  - GitHub token: read-only, no permissions
  - Cloudflare token: only the "Cloudflare Pages: Edit" permission on my account (Cloudflare can't scope a token to a single Pages project)
- The GitHub token **expires after 1 year**. If it expires, the build fails safely and that's the reminder to rotate it.
- `.env` is git-ignored, and `.env.example` documents the variable names only.
- **Secret scanning + push protection** are enabled on the repo.

### Supply chain

- `npm ci` with a committed lockfile. Keep dependencies few, and question every new one.
- `npm audit --audit-level=high` runs in CI and fails the build.
- **Dependabot** runs weekly for npm and GitHub Actions, with updates grouped.
- GitHub Actions are **pinned to full commit SHAs**.
- Workflows default to `permissions: contents: read`. No `pull_request_target`, and builds from forks never get secrets.

### Accounts and repo

- **Passkey or hardware-key 2FA** on GitHub and Cloudflare.
- `main` is protected: required checks must pass, and force-pushes and deletion are blocked.
- **The repo is public.** The code doubles as a showcase, and no secrets live in it.

### Content and privacy

- README summaries are rendered as plain text only ([0007](0007-build-pipeline.md)). Markdown and MDX are rendered only from my own files.
- No cookies, no analytics, no third-party requests, so no consent banner is needed.
- **Email:** a plain `mailto:` link. It's simple and accessible, and inbox spam filtering handles scraping.
- `/.well-known/security.txt` publishes a contact for security reports.

## Consequences

- With no server, the realistic risks are reduced to accounts, dependencies and secrets, and each has a specific control.
- The strict CSP means **any future third-party embed** (video, comments, analytics) needs a deliberate CSP change and a new decision.
- The public repo means every commit is visible, so commit hygiene matters. Push protection is the safety net.
- Some spam to the published email address is expected and accepted.
