// Local-only fix for Windows machines where Smart App Control blocks Astro's native
// compiler (".node" file). Installs Astro's official WebAssembly build of the same
// compiler; Astro falls back to it automatically. Does not change package.json or the
// lockfile, and is not needed in CI (Linux). Re-run after a fresh `npm install`.

import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const require = createRequire(import.meta.url);

try {
  require("@astrojs/compiler-binding");
  console.log("✓ Astro compiler loads fine on this machine. Nothing to do.");
  process.exit(0);
} catch {
  // Native binding blocked or missing: install the WASM build.
}

const { version } = JSON.parse(
  readFileSync(
    require.resolve("@astrojs/compiler-binding/package.json"),
    "utf8",
  ),
);
const pkg = `@astrojs/compiler-binding-wasm32-wasi@${version}`;
console.log(
  `Native Astro compiler is blocked. Installing ${pkg} (local only)…`,
);
execSync(`npm install --no-save --force ${pkg}`, { stdio: "inherit" });
console.log("✓ Done. Astro will use the WebAssembly compiler on this machine.");
