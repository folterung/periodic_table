import { build } from 'esbuild';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
await mkdir('.qa-runtime/assets',{recursive:true});
await build({entryPoints:['scripts/browser-qa.js'],outdir:'.qa-runtime/assets',bundle:true,splitting:true,format:'esm',target:'es2022'});
await writeFile('.qa-runtime/index.html',(await readFile('dist/index.html','utf8')).replace('src="assets/main.js"','src="/__qa/assets/browser-qa.js"').replace('href="style.css"','href="/style.css"'));
await build({entryPoints:['src/main.js'],outdir:'.qa-runtime/fallback-assets',bundle:true,splitting:true,format:'esm',target:'es2022'});
await writeFile('.qa-runtime/fallback.html',(await readFile('dist/index.html','utf8')).replace('src="assets/main.js"','src="/__qa/fallback-assets/main.js"').replace('href="style.css"','href="/style.css"').replace('<body>','<body><script>const nativeContext=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type===\'webgl2\'?null:nativeContext.call(this,type,...args)};</script>'));
console.log('Browser verification at http://127.0.0.1:4173/__qa/');
