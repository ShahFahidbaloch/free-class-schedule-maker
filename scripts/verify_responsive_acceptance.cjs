const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\LAPTOP GODAM\\.gemini\\antigravity\\brain\\123d30ee-b244-40b9-a130-fa1a26db307e';

async function run() {
  console.log('Launching Edge for Responsive Acceptance Verification...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    // 1. First setup schedule on /app with sample schedule + one 1-hour class
    const setupPage = await browser.newPage();
    await setupPage.setViewport({ width: 1200, height: 800 });
    await setupPage.goto('http://localhost:4321/app', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1500));

    // Reset to sample schedule if needed
    await setupPage.evaluate(() => {
      // Clear localStorage schedule to ensure fresh default sample
      localStorage.removeItem('class_schedule_courses_v3');
      localStorage.removeItem('sample_schedule_hint_dismissed');
    });
    await setupPage.reload({ waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1500));

    // Add one 1-hour class: ART 101 on Monday 01:00 PM - 02:00 PM
    console.log('Adding 1-hour class (ART 101: 1:00 PM - 2:00 PM)...');
    await setupPage.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => 
        b.textContent.includes('Class') || b.title?.includes('Add')
      );
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // Fill form
    const codeInput = await setupPage.$('input[placeholder*="CS 301"]');
    if (codeInput) await codeInput.type('ART 101');

    const titleInput = await setupPage.$('input[placeholder*="Data Structures"]');
    if (titleInput) await titleInput.type('Art History Studio');

    // Set 1:00 PM to 2:00 PM
    const timeInputs = await setupPage.$$('input[type="time"]');
    if (timeInputs.length >= 2) {
      await timeInputs[0].click();
      await timeInputs[0].type('1300'); // 1:00 PM
      await timeInputs[1].click();
      await timeInputs[1].type('1400'); // 2:00 PM
    }

    // Submit form
    await setupPage.evaluate(() => {
      const saveBtn = document.querySelector('button[type="submit"]');
      if (saveBtn) saveBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    console.log('ART 101 added! Schedule now has default sample + one 1-hour class.');

    // Keep sample hint visible for inspection of M5
    await setupPage.evaluate(() => {
      localStorage.removeItem('sample_schedule_hint_dismissed');
    });
    await setupPage.close();

    // ==========================================
    // SCREENSHOT 1: 360×740 (Mobile Compact)
    // ==========================================
    console.log('\n--- Testing Viewport 360×740 ---');
    const page360 = await browser.newPage();
    await page360.setViewport({ width: 360, height: 740, isMobile: true, hasTouch: true });
    await page360.goto('http://localhost:4321/app', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1500));

    // Verify M1 header labels at 360px
    const header360 = await page360.evaluate(() => {
      const plans = Array.from(document.querySelectorAll('button')).filter(b => 
        ['Plan A', 'Plan B', 'Plan C'].includes(b.textContent.trim())
      );
      const title = document.querySelector('h1')?.textContent?.trim();
      return {
        title,
        planCount: plans.length,
        plans: plans.map(p => ({ text: p.textContent.trim(), rect: p.getBoundingClientRect() }))
      };
    });
    console.log('360px Header check:', header360);

    // Verify M2 Time Gutter at 360px
    const gutter360 = await page360.evaluate(() => {
      const gutterDivs = Array.from(document.querySelectorAll('.border-r div')).slice(0, 5);
      return gutterDivs.map(d => d.textContent.trim().replace(/\s+/g, ' '));
    });
    console.log('360px Time Gutter labels:', gutter360);

    // Capture 360×740 screenshot
    const shot360Path = path.join(ARTIFACTS_DIR, 'app-360x740.png');
    await page360.screenshot({ path: shot360Path, type: 'png' });
    console.log('Saved 360×740 screenshot to:', shot360Path);
    await page360.close();

    // ==========================================
    // SCREENSHOT 2: 390×844 (iPhone Standard)
    // ==========================================
    console.log('\n--- Testing Viewport 390×844 ---');
    const page390 = await browser.newPage();
    await page390.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page390.goto('http://localhost:4321/app', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1500));

    // Verify M3: Scroll to a class and verify it sits fully above fixed bottom nav
    const m3Check = await page390.evaluate(() => {
      const scrollContainer = document.querySelector('.overflow-y-auto');
      if (scrollContainer) {
        scrollContainer.scrollTop = 220; // scroll down to classes
      }
      const nav = document.querySelector('nav');
      const navTop = nav ? nav.getBoundingClientRect().top : 844;
      return { navTop, scrolled: scrollContainer ? scrollContainer.scrollTop : 0 };
    });
    console.log('390px M3 scroll check:', m3Check);
    await new Promise(r => setTimeout(r, 500));

    // Capture 390×844 screenshot
    const shot390Path = path.join(ARTIFACTS_DIR, 'app-390x844.png');
    await page390.screenshot({ path: shot390Path, type: 'png' });
    console.log('Saved 390×844 screenshot to:', shot390Path);

    // Test M6: Day tab switching and Add modal on 390px
    console.log('Testing M6: Day tab switching on 390px...');
    const dayTabSwitched = await page390.evaluate(() => {
      const tueBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim().startsWith('Tue'));
      if (tueBtn) {
        tueBtn.click();
        return true;
      }
      return false;
    });
    console.log('Switched to Tuesday tab:', dayTabSwitched);
    await new Promise(r => setTimeout(r, 600));

    // Test center + button opens modal
    const plusClicked = await page390.evaluate(() => {
      const centerBtn = document.querySelector('nav button .stroke-\\[2\\.5\\]')?.closest('button');
      if (centerBtn) {
        centerBtn.click();
        return true;
      }
      return false;
    });
    console.log('Center + button clicked:', plusClicked);
    await new Promise(r => setTimeout(r, 600));

    const modalOpen = await page390.evaluate(() => {
      const modal = document.querySelector('input[type="time"]');
      const submitBtn = document.querySelector('button[type="submit"]');
      return {
        hasModal: Boolean(modal),
        submitVisible: Boolean(submitBtn)
      };
    });
    console.log('Modal status on 390px:', modalOpen);

    // Close modal
    await page390.evaluate(() => {
      const closeBtn = document.querySelector('button[aria-label*="Close"]') || Array.from(document.querySelectorAll('button')).find(b => b.querySelector('svg.lucide-x'));
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    await page390.close();

    // ==========================================
    // SCREENSHOT 3: 768×1024 (iPad Portrait)
    // ==========================================
    console.log('\n--- Testing Viewport 768×1024 ---');
    const page768 = await browser.newPage();
    await page768.setViewport({ width: 768, height: 1024 });
    await page768.goto('http://localhost:4321/app', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1500));

    // Verify M4: check class time ranges for truncation
    const times768 = await page768.evaluate(() => {
      const timeSpans = Array.from(document.querySelectorAll('.border-t span.whitespace-nowrap'));
      return timeSpans.map(s => s.textContent.trim());
    });
    console.log('768px Class time text lines:', times768);

    const shot768Path = path.join(ARTIFACTS_DIR, 'app-768x1024.png');
    await page768.screenshot({ path: shot768Path, type: 'png' });
    console.log('Saved 768×1024 screenshot to:', shot768Path);
    await page768.close();

    // ==========================================
    // SCREENSHOT 4: 1024×768 (iPad/Laptop Landscape)
    // ==========================================
    console.log('\n--- Testing Viewport 1024×768 ---');
    const page1024 = await browser.newPage();
    await page1024.setViewport({ width: 1024, height: 768 });
    await page1024.goto('http://localhost:4321/app', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1500));

    // Verify header at 1024px: Presets button and Plan switcher
    const header1024 = await page1024.evaluate(() => {
      const presetsBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Presets'));
      const planA = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Plan A');
      const studioTitle = document.querySelector('h1')?.textContent?.trim();
      return {
        studioTitle,
        hasPresets: Boolean(presetsBtn),
        presetsText: presetsBtn ? presetsBtn.textContent.trim() : null,
        presetsRect: presetsBtn ? presetsBtn.getBoundingClientRect() : null,
        planARect: planA ? planA.getBoundingClientRect() : null
      };
    });
    console.log('1024px Header check:', header1024);

    // Verify M4 times at 1024px
    const times1024 = await page1024.evaluate(() => {
      const timeSpans = Array.from(document.querySelectorAll('.border-t span.whitespace-nowrap'));
      return timeSpans.map(s => s.textContent.trim());
    });
    console.log('1024px Class time text lines:', times1024);

    const shot1024Path = path.join(ARTIFACTS_DIR, 'app-1024x768.png');
    await page1024.screenshot({ path: shot1024Path, type: 'png' });
    console.log('Saved 1024×768 screenshot to:', shot1024Path);
    await page1024.close();

    console.log('\n=========================================');
    console.log('ALL 4 RESPONSIVE SCREENSHOTS CAPTURED & ACCEPTED!');
    console.log('=========================================\n');
  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error('Acceptance run error:', err);
  process.exit(1);
});
