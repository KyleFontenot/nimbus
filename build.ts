import type { BuildConfig } from "bun";
import { glob } from 'glob';

// const utilsglobs = await glob('src/utils/*.ts');
// console.log('inspect::', utilsglobs)
const config: BuildConfig = {
  entrypoints: ["./src/utils/debounce.ts"],
  outdir: './dist',
  target: 'node',
  minify: true,
  packages: 'external',
};

const building = await Bun.build(config);
console.log('inspect::', building)
