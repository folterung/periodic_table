import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const staticRoot = resolve('dist'),qaRoot=resolve('.qa-runtime');
createServer(async (req, res) => {
  let uri=decodeURIComponent(new URL(req.url, 'http://localhost').pathname),root=staticRoot;
  if(uri.startsWith('/__qa/')){root=qaRoot;uri=uri.slice(5);}
  const path = resolve(root, '.' + (uri === '/' ? '/index.html' : uri));
  if (!path.startsWith(root + sep)) { res.writeHead(403).end(); return; }
  try {
    const body = await readFile(path);
    res.writeHead(200, { 'Content-Type': ({ '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.txt': 'text/plain' })[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); res.end(body);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(4173, '127.0.0.1', () => console.log('Element Atlas at http://127.0.0.1:4173'));
