import { promises as fs } from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');
const TEMPLATE = path.resolve('service-worker.template.js');

async function collectFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const res = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return collectFiles(res);
    } else if (entry.isFile() && entry.name !== 'service-worker.js') {
      return res;
    }
    return null;
  }));
  return files.flat().filter(Boolean);
}

(async () => {
  if (!await fs.stat(DIST_DIR).catch(() => false)) {
    console.error(`Dist directory not found: ${DIST_DIR}`);
    process.exit(1);
  }

  const files = await collectFiles(DIST_DIR);
  const assets = files.map(f => './' + path.relative(DIST_DIR, f).replace(/\\/g, '/'));
  const cacheName = `promptparto-${Date.now()}`;

  const template = await fs.readFile(TEMPLATE, 'utf8');
  const output = template
    .replace('promptparto-v3', cacheName)
    .replace(/const ASSETS =[^;]*;?/m, `const ASSETS = ${JSON.stringify(assets, null, 2)};`);

  await fs.writeFile(path.join(DIST_DIR, 'service-worker.js'), output);
  console.log('Service worker generated with cache', cacheName);
})();