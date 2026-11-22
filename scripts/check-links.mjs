// Broken-link check on the built site (decision 0010). No dependencies.
// Every internal href/src in dist/**/*.html must point to a file that exists.
// External links are not fetched (reporting them would need network access in CI).

import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative, posix } from "node:path";

const DIST = "dist";

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

async function exists(p) {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
}

async function resolves(urlPath) {
  const clean = decodeURI(urlPath.split(/[?#]/)[0]);
  const base = join(DIST, clean);
  return (
    (await exists(base)) ||
    (await exists(join(base, "index.html"))) ||
    (await exists(`${base}.html`))
  );
}

const files = (await walk(DIST)).filter((f) => f.endsWith(".html"));
const attr = /\s(?:href|src)="([^"]+)"/g;
const broken = [];
let checked = 0;

for (const file of files) {
  const html = await readFile(file, "utf8");
  const pagePath =
    "/" +
    relative(DIST, file)
      .split("\\")
      .join("/")
      .replace(/index\.html$/, "");
  for (const [, raw] of html.matchAll(attr)) {
    if (/^(?:[a-z]+:|\/\/|#|data:)/i.test(raw)) continue; // external, mailto, anchors
    const target = raw.startsWith("/")
      ? raw
      : posix.join(posix.dirname(pagePath + "x"), raw);
    checked++;
    if (!(await resolves(target))) broken.push(`${pagePath} → ${raw}`);
  }
}

if (broken.length) {
  console.error(`✗ ${broken.length} broken internal link(s):`);
  for (const b of broken) console.error(`  ${b}`);
  process.exit(1);
}
console.log(
  `✓ ${checked} internal links checked across ${files.length} pages, none broken.`,
);
