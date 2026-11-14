const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\LAPTOP GODAM\\.gemini\\antigravity\\brain\\123d30ee-b244-40b9-a130-fa1a26db307e';
const LIVE_URL = 'https://freeclassschedule.com';

async function addClassViaModal(page, { code, title, dayShorts, startTimeKeys, endTimeKeys }) {
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(
      b => b.offsetParent !== null && (b.textContent?.includes('New Class') || b.title?.includes('Add New Class'))
    );
    if (btn) btn.click();
  });
  await page.waitForSelector('form input[type="time"]', { timeout: 5000 });
  await new Promise(r => setTimeout(r, 150));

  await page.evaluate((c, t) => {
    const form = document.querySelector('form');
    const textInputs = Array.from(form.querySelectorAll('input[type="text"], input:not([type])'));
    const setVal = (el, val) => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(el, val);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    };
    if (textInputs[0]) setVal(textInputs[0], c);
    if (textInputs[1]) setVal(textInputs[1], t);
  }, code, title);

  await page.evaluate((days) => {
    const form = document.querySelector('form');
    const dayBtns = Array.from(form.querySelectorAll('button')).filter(b =>
      /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)$/i.test(b.textContent.trim())
    );
    dayBtns.forEach(b => {
      const isSelected = b.className.includes('bg-zinc-950') || b.className.includes('bg-white text-zinc-950');
      const shouldSelect = days.includes(b.textContent.trim());
      if (isSelected !== shouldSelect) b.click();
    });
  }, dayShorts);

  const timeInputs = await page.$$('form input[type="time"]');
  if (timeInputs.length >= 2) {
    await timeInputs[0].focus();
    await page.keyboard.type(startTimeKeys);
    await timeInputs[1].focus();
    await page.keyboard.type(endTimeKeys);
  }

  await page.evaluate(() => {
    const form = document.querySelector('form');
    const submitBtn = Array.from(form.querySelectorAll('button[type="submit"]'))[0] ||
      Array.from(form.querySelectorAll('button')).find(b => b.textContent?.includes('Add') || b.textContent?.includes('Save'));
    if (submitBtn) submitBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));
}

async function inspectSplitLaneTimes(page, codes) {
  return page.evaluate((targetCodes) => {
    const blocks = Array.from(document.querySelectorAll('[title*="Click to edit"]')).filter(el => el.offsetParent !== null);
    return targetCodes.map(code => {
      const block = blocks.find(b => b.innerText.includes(code));
      if (!block) return { code, found: false };
      const spans = Array.from(block.querySelectorAll('span'));
      const timeSpan = spans.find(s => /\d:\d{2}.*(AM|PM)/i.test(s.textContent || ''));
      if (!timeSpan) return { code, found: true, hasTimeSpan: false };
      const r = timeSpan.getBoundingClientRect();
      const parentR = (timeSpan.parentElement || block).getBoundingClientRect();
      const blockR = block.getBoundingClientRect();
      const style = window.getComputedStyle(timeSpan);
      return {
        code,
        found: true,
        text: timeSpan.textContent,
        fontSize: style.fontSize,
        textOverflow: style.textOverflow,
        hasEllipsisStyle: style.textOverflow === 'ellipsis',
        clippedHorizontally: r.right > parentR.right + 1 || r.right > blockR.right + 1,
        clippedVertically: r.bottom > blockR.bottom + 1,
        blockRect: { x: Math.round(blockR.x), y: Math.round(blockR.y), w: Math.round(blockR.width), h: Math.round(blockR.height) },
        spanScrollW: timeSpan.scrollWidth,
        parentClientW: timeSpan.parentElement?.clientWidth || 0
      };
    });
  }, codes);
}

async function run() {
  console.log('Starting LIVE G1 & G2 verification against', LIVE_URL);
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    const pageErrors = [];
    page.on('pageerror', err => pageErrors.push(err.message));

    await page.goto(`${LIVE_URL}/app`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 800));
    await page.keyboard.press('Escape');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && (b.textContent.includes('Got it') || b.textContent.includes('Start') || b.textContent.includes('Build')));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // =========================================================================
    // G1: Overlapped pair with long times (10:00–11:15 AM and 10:30 AM–12:45 PM / 11:30 AM–12:45 PM)
    //     in BOTH 5D and 7D
    // =========================================================================
    console.log('\n--- G1: Split-lane long times in 5D & 7D ---');
    // Ensure 5D first
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.offsetParent !== null && b.textContent?.includes('7D'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 300));

    // Add two overlapping long-time classes on Thursday (visible in both 5D and 7D!)
    // Pair: 10:00 AM - 11:15 AM (same period) & 11:00 AM - 12:45 PM (crosses noon AM->PM!)
    await addClassViaModal(page, {
      code: 'SPLIT A',
      title: 'Split Lane Morning',
      dayShorts: ['Thu'],
      startTimeKeys: '1000',
      endTimeKeys: '1115'
    });
    await addClassViaModal(page, {
      code: 'SPLIT B',
      title: 'Split Lane Noon Cross',
      dayShorts: ['Thu'],
      startTimeKeys: '1100',
      endTimeKeys: '1245p'
    });
    await new Promise(r => setTimeout(r, 500));

    // Check in 5D
    const g1_5d = await inspectSplitLaneTimes(page, ['SPLIT A', 'SPLIT B']);
    console.log('G1 5D Checks:', JSON.stringify(g1_5d, null, 2));

    // Zoomed screenshot of Thursday split lanes in 5D
    await page.evaluate(() => window.scrollTo(0, 0));
    const clip5d = await page.evaluate(() => {
      const blocks = Array.from(document.querySelectorAll('[title*="Click to edit"]')).filter(el => el.offsetParent !== null && (el.innerText.includes('SPLIT A') || el.innerText.includes('SPLIT B')));
      if (blocks.length === 0) return { x: 0, y: 0, width: 1280, height: 800 };
      const rects = blocks.map(b => b.getBoundingClientRect());
      const minX = Math.max(0, Math.min(...rects.map(r => r.left)) - 40);
      const minY = Math.max(0, Math.min(...rects.map(r => r.top)) - 40);
      const maxX = Math.min(1280, Math.max(...rects.map(r => r.right)) + 40);
      const maxY = Math.min(800, Math.max(...rects.map(r => r.bottom)) + 40);
      return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
    });
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'live-g1-5d-split-zoom.png'), clip: clip5d });

    // Toggle to 7D
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.offsetParent !== null && b.textContent?.includes('5D'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    const g1_7d = await inspectSplitLaneTimes(page, ['SPLIT A', 'SPLIT B']);
    console.log('G1 7D Checks:', JSON.stringify(g1_7d, null, 2));

    await page.evaluate(() => window.scrollTo(0, 0));
    const clip7d = await page.evaluate(() => {
      const blocks = Array.from(document.querySelectorAll('[title*="Click to edit"]')).filter(el => el.offsetParent !== null && (el.innerText.includes('SPLIT A') || el.innerText.includes('SPLIT B')));
      if (blocks.length === 0) return { x: 0, y: 0, width: 1280, height: 800 };
      const rects = blocks.map(b => b.getBoundingClientRect());
      const minX = Math.max(0, Math.min(...rects.map(r => r.left)) - 40);
      const minY = Math.max(0, Math.min(...rects.map(r => r.top)) - 40);
      const maxX = Math.min(1280, Math.max(...rects.map(r => r.right)) + 40);
      const maxY = Math.min(800, Math.max(...rects.map(r => r.bottom)) + 40);
      return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
    });
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'live-g1-7d-split-zoom.png'), clip: clip7d });

    for (const c of [...g1_5d, ...g1_7d]) {
      if (!c.found || c.hasEllipsisStyle || c.clippedHorizontally || c.clippedVertically) {
        throw new Error(`G1 FAIL on ${c.code}: ${JSON.stringify(c)}`);
      }
    }
    console.log('✅ G1 PASS: Both 5D and 7D split-lane long times render completely with zero ellipsis/clipping.');

    // =========================================================================
    // G2: Nursing preset -> Optimize opens first click in Tab 1, after hard reload, AND in Tab 2
    // =========================================================================
    console.log('\n--- G2: Nursing preset Optimize across hard reload & 2 tabs ---');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.offsetParent !== null && b.textContent?.includes('Presets'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 300));
    await page.evaluate(() => {
      const h4 = Array.from(document.querySelectorAll('h4')).find(el => el.textContent?.includes('Nursing Student'));
      const card = h4 ? h4.closest('.rounded-2xl') : null;
      const loadBtn = card ? Array.from(card.querySelectorAll('button')).find(b => b.textContent?.includes('Load into')) : null;
      if (loadBtn) loadBtn.click();
    });
    await new Promise(r => setTimeout(r, 300));
    await page.evaluate(() => {
      const overlay = document.querySelector('.fixed.inset-0');
      const confirmBtn = overlay ? Array.from(overlay.querySelectorAll('button')).find(b => b.textContent?.includes('Replace')) : null;
      if (confirmBtn) confirmBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // Attempt 1 in Tab 1
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.offsetParent !== null && b.title === 'Run Gap Optimizer Engine');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 400));
    const tab1FirstClick = await page.evaluate(() => document.body.innerText.includes('Gap Optimizer Proposal'));

    // Close modal without applying, then hard reload Tab 1
    await page.keyboard.press('Escape');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Keep Mine'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 200));

    const cdp = await page.target().createCDPSession();
    await cdp.send('Page.reload', { ignoreCache: true });
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 800));

    // Attempt 2 in Tab 1 after hard reload
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.offsetParent !== null && b.title === 'Run Gap Optimizer Engine');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 400));
    const tab1AfterHardReload = await page.evaluate(() => document.body.innerText.includes('Gap Optimizer Proposal'));

    // Open Tab 2 (fresh tab in same browser context) and click Optimize first click
    const page2 = await browser.newPage();
    await page2.setViewport({ width: 1280, height: 800 });
    await page2.goto(`${LIVE_URL}/app`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 800));
    await page2.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.offsetParent !== null && b.title === 'Run Gap Optimizer Engine');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 400));
    const tab2FirstClick = await page2.evaluate(() => document.body.innerText.includes('Gap Optimizer Proposal'));
    await page2.close();

    if (!tab1FirstClick || !tab1AfterHardReload || !tab2FirstClick || pageErrors.length > 0) {
      throw new Error(`G2 FAIL: tab1FirstClick=${tab1FirstClick}, tab1AfterHardReload=${tab1AfterHardReload}, tab2FirstClick=${tab2FirstClick}, pageErrors=${JSON.stringify(pageErrors)}`);
    }
    console.log('✅ G2 PASS: Optimize opened on FIRST click in Tab 1, after hard reload in Tab 1, and in fresh Tab 2!');
  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error('G1/G2 LIVE VERIFICATION FAILED:', err);
  process.exit(1);
});
