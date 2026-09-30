import { build } from 'esbuild';
import { mkdir, readdir, unlink, copyFile } from 'node:fs/promises';
await mkdir('dist/assets', { recursive: true });
for (const f of await readdir('dist/assets')) if (f.endsWith('.js')) await unlink(`dist/assets/${f}`);
await build({ entryPoints: ['src/main.js'], outdir: 'dist/assets', bundle: true, splitting: true, format: 'esm', minify: true, target: ['es2022'], legalComments: 'eof', entryNames: '[name]', chunkNames: '[name]-[hash]' });
await copyFile('node_modules/three/LICENSE', 'dist/THREE-LICENSE.txt');
console.log('Built self-contained WebGL experience.');
