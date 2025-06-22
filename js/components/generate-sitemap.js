const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://promptparto.rasoulunlimited.ir';
const DIST_DIR = path.resolve('dist');
const OUTPUT_FILE = path.join(DIST_DIR, 'sitemap.xml');

function getHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getHtmlFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

if (!fs.existsSync(DIST_DIR)) {
  console.error(`Dist directory not found: ${DIST_DIR}`);
  process.exit(1);
}

const htmlFiles = getHtmlFiles(DIST_DIR);

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
htmlFiles.forEach((file) => {
  let loc = path.relative(DIST_DIR, file).replace(/\\/g, '/');
  if (loc === 'index.html') {
    loc = '';
  }
  xml += `  <url>\n    <loc>${SITE_URL}/${loc}</loc>\n  </url>\n`;
});
xml += '</urlset>\n';

fs.writeFileSync(OUTPUT_FILE, xml);
console.log(`Sitemap written to ${OUTPUT_FILE}`);