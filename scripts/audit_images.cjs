#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function walk(dir, exts) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(full, exts));
    } else if (exts.some(ext => full.endsWith(ext))) {
      results.push(full);
    }
  });
  return results;
}

const sourceFiles = walk(path.join(__dirname, '..', 'src'), ['.astro', '.tsx', '.jsx', '.html', '.md']);
const imgRegex = /<img[\s\S]*?src=["']([^"']+)["']/g;
const mdRegex = /!\[[^\]]*\]\(([^)]+)\)/g;

const missing = [];
const publicDir = path.join(__dirname, '..', 'public');

sourceFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    checkRef(file, match[1]);
  }
  while ((match = mdRegex.exec(content)) !== null) {
    checkRef(file, match[1]);
  }
});

function checkRef(file, src) {
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:') || src.startsWith('//')) {
    return;
  }
  const clean = src.split('?')[0].split('#')[0];
  const relativeToPublic = clean.startsWith('/') ? clean.slice(1) : clean;
  const targetPath = path.join(publicDir, relativeToPublic);
  if (!fs.existsSync(targetPath)) {
    missing.push({ file: path.relative(path.join(__dirname, '..'), file), src, targetPath });
  }
}

// Check XML validity and undeclared entities on all SVGs in public
const svgFiles = walk(publicDir, ['.svg']);
const svgErrors = [];
const allowedXmlEntities = ['&amp;', '&lt;', '&gt;', '&quot;', '&apos;'];

svgFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const entities = content.match(/&[a-zA-Z]+;/g) || [];
  const invalid = entities.filter(e => !allowedXmlEntities.includes(e));
  if (invalid.length > 0) {
    svgErrors.push({ file: path.relative(path.join(__dirname, '..'), file), invalid });
  }
});

let failed = false;

if (missing.length > 0) {
  console.error('\x1b[31m[ERROR] Missing local image references found:\x1b[0m');
  missing.forEach(m => {
    console.error(`  - In ${m.file}: image "${m.src}" does not exist at ${m.targetPath}`);
  });
  failed = true;
}

if (svgErrors.length > 0) {
  console.error('\x1b[31m[ERROR] SVG files contain invalid HTML entities (causes XML parse errors in browser):\x1b[0m');
  svgErrors.forEach(s => {
    console.error(`  - In ${s.file}: contains undeclared entity ${s.invalid.join(', ')}`);
  });
  failed = true;
}

if (failed) {
  process.exit(1);
} else {
  console.log('\x1b[32m[PASS] All referenced local images exist and SVGs contain valid XML entities.\x1b[0m');
}
