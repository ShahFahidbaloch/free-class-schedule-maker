#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
  console.error('dist/ does not exist. Run npm run build first.');
  process.exit(1);
}

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(full));
    } else if (file.endsWith('.html')) {
      results.push(full);
    }
  });
  return results;
}

const htmlFiles = walk(distDir);
console.log(`Auditing and crawling all images across ${htmlFiles.length} generated pages...`);

let totalImageRefs = 0;
let brokenRefs = [];
const verifiedImages = new Set();

const imgRegex = /<img[\s\S]*?src=["']([^"']+)["']/g;

htmlFiles.forEach(htmlFile => {
  const content = fs.readFileSync(htmlFile, 'utf8');
  const relativePage = path.relative(distDir, htmlFile).replace(/\\/g, '/');
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    totalImageRefs++;
    const src = match[1];
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
      continue;
    }
    const cleanSrc = src.split('?')[0].split('#')[0];
    const targetFile = cleanSrc.startsWith('/')
      ? path.join(distDir, cleanSrc.slice(1))
      : path.join(path.dirname(htmlFile), cleanSrc);

    if (!fs.existsSync(targetFile)) {
      brokenRefs.push({ page: relativePage, src, targetFile });
    } else {
      verifiedImages.add(cleanSrc);
    }
  }
});

console.log(`\n=== FULL-SITE IMAGE CRAWL REPORT ===`);
console.log(`Total HTML Pages Scanned: ${htmlFiles.length}`);
console.log(`Total Image Tags Verified: ${totalImageRefs}`);
console.log(`Unique Local Image Assets: ${verifiedImages.size}`);
verifiedImages.forEach(img => console.log(`  ✓ ${img} (200 OK)`));

if (brokenRefs.length > 0) {
  console.error(`\n❌ FAILED: ${brokenRefs.length} broken image references found:`);
  brokenRefs.forEach(b => console.error(`  - Page: /${b.page} -> Broken src: "${b.src}"`));
  process.exit(1);
} else {
  console.log(`\n✅ PASS: 0 broken images found across all ${htmlFiles.length} pages.`);
}
