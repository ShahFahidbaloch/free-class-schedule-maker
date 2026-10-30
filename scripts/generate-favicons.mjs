import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Clean, valid vector SVG representation of the user's logo
// Black background with squircle rounded corners and centered white graduation cap
const svgVector = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600" fill="none">
  <rect width="600" height="600" rx="120" fill="#000000"/>
  <g transform="translate(100, 100) scale(16.666667)" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </g>
</svg>`;

const publicDir = path.resolve('public');

async function generate() {
  console.log('Generating favicon and logo assets...');

  // 1. Write public/logo.svg and public/favicon.svg
  fs.writeFileSync(path.join(publicDir, 'logo.svg'), svgVector, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgVector, 'utf-8');
  console.log('✓ logo.svg & favicon.svg saved');

  const svgBuffer = Buffer.from(svgVector);

  // 2. Generate PNGs of various sizes
  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 },
    { name: 'logo.png', size: 600 },
    { name: 'favicon.png', size: 64 },
  ];

  for (const { name, size } of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, name));
    console.log(`✓ ${name} (${size}x${size})`);
  }

  // 3. Generate a genuine multi-resolution favicon.ico
  // An ICO header followed by 16x16, 32x32, 48x48 PNG frames
  const b16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const b32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const b48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();

  const icoBuffer = createIco([
    { size: 16, buffer: b16 },
    { size: 32, buffer: b32 },
    { size: 48, buffer: b48 }
  ]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('✓ favicon.ico (16, 32, 48 multi-res) saved');

  // 4. Update site.webmanifest
  const manifest = {
    name: "Class Schedule & Timetable Planner",
    short_name: "ClassSchedule",
    description: "The Smart Class Schedule Maker & Academic Planner",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ],
    theme_color: "#09090b",
    background_color: "#09090b",
    display: "standalone",
    start_url: "/app",
    orientation: "portrait"
  };
  fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2), 'utf-8');
  console.log('✓ site.webmanifest updated');

  console.log('All favicon and logo assets generated successfully!');
}

// Minimal standard ICO builder supporting embedded PNGs
function createIco(images) {
  const headerSize = 6;
  const dirEntrySize = 16;
  const numImages = images.length;
  let offset = headerSize + dirEntrySize * numImages;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO type (1 for ico)
  header.writeUInt16LE(numImages, 4);

  const dirEntries = [];
  const buffers = [];

  for (const img of images) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 0); // width
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 1); // height
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // image byte size
    entry.writeUInt32LE(offset, 12); // offset in file

    dirEntries.push(entry);
    buffers.push(img.buffer);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...buffers]);
}

generate().catch(console.error);
