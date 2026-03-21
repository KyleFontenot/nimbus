import type { BuildConfig } from "bun";
import { glob } from "glob";

const utilEntrypoints = await glob("src/utils/*.ts");

const config: BuildConfig = {
  entrypoints: [
    "./src/index.ts",
    ...utilEntrypoints,
  ],
  outdir: "./dist",
  target: "browser",
  minify: true,
  packages: "external",
  external: ["svelte", "svelte/*", "highlight.js", "highlight.js/*"],
};

const result = await Bun.build(config);

if (!result.success) {
  console.error("Build failed:");
  for (const log of result.logs) {
    console.error(log);
  }
  process.exit(1);
}

console.log(`Built ${result.outputs.length} files to ./dist`);
