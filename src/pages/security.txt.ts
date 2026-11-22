// security.txt (RFC 9116, decision 0009). Built at /security.txt; public/_redirects serves it at the
// standard /.well-known/security.txt too (Cloudflare Pages uploads skip dot-folders).
// Built from site.config so the contact address lives in one place.
// "Expires" is always one year after the latest build,
// and the daily rebuild keeps it fresh.
import type { APIContext } from "astro";
import { site } from "../site.config";

export function GET(context: APIContext) {
  const expires = new Date();
  expires.setUTCFullYear(expires.getUTCFullYear() + 1);
  const base = context.site ?? new URL("https://vatsaljain.pages.dev");

  const body = [
    `Contact: mailto:${site.links.email}`,
    `Expires: ${expires.toISOString()}`,
    "Preferred-Languages: en",
    `Canonical: ${new URL("/.well-known/security.txt", base)}`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
