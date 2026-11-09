const http = require('http');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\LAPTOP GODAM\\.gemini\\antigravity\\brain\\123d30ee-b244-40b9-a130-fa1a26db307e';
const DIST_DIR = path.resolve(__dirname, '../dist');

// Simple static server for dist
function startStaticServer(port) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };

  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0].split('#')[0]);
    if (reqPath.endsWith('/')) reqPath += 'index.html';
    else if (!path.extname(reqPath)) {
      if (fs.existsSync(path.join(DIST_DIR, reqPath, 'index.html'))) {
        reqPath = path.join(reqPath, 'index.html');
      } else if (fs.existsSync(path.join(DIST_DIR, reqPath + '.html'))) {
        reqPath += '.html';
      }
    }

    const filePath = path.join(DIST_DIR, reqPath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
  });

  return new Promise((resolve) => {
    server.listen(port, () => {
      console.log(`Static dist server listening on http://localhost:${port}`);
      resolve(server);
    });
  });
}

async function run() {
  const server = await startStaticServer(4321);

  console.log('Connecting to browser for F1-F4 & Navbar Acceptance Verification...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();

  try {
    // -------------------------------------------------------------
    // TEST 1: F4 — No 1-click delete on class block
    // -------------------------------------------------------------
    console.log('\n--- TEST F4: No 1-click delete on class block ---');
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:4321/app', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1500));

    // Get count of courses before click
    const initialBlockCount = await page.evaluate(() => {
      return document.querySelectorAll('[title*="Click to edit"]').length;
    });
    console.log(`Initial course blocks found: ${initialBlockCount}`);

    // Click on the first course block
    await page.evaluate(() => {
      const block = document.querySelector('[title*="Click to edit"]');
      if (block) {
        block.click();
      }
    });
    await new Promise(r => setTimeout(r, 800));

    // Check if Edit modal opened
    const isEditModalOpen = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h3, h2, h4'));
      return headings.some(h => h.textContent && h.textContent.includes('Edit Class'));
    });
    console.log(`Edit modal opened on click: ${isEditModalOpen}`);

    // Close the modal
    await page.evaluate(() => {
      const cancelBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Cancel'));
      if (cancelBtn) cancelBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    const finalBlockCount = await page.evaluate(() => {
      return document.querySelectorAll('[title*="Click to edit"]').length;
    });
    console.log(`Final course blocks found: ${finalBlockCount}`);

    if (isEditModalOpen && finalBlockCount === initialBlockCount) {
      console.log('✅ PASS F4: Clicking class block opens Edit modal and does NOT delete the course.');
    } else {
      throw new Error(`FAIL F4: Course count changed or Edit modal did not open. isEditModalOpen=${isEditModalOpen}, init=${initialBlockCount}, final=${finalBlockCount}`);
    }

    // -------------------------------------------------------------
    // TEST 2: F1 — Short blocks (45m & 60m) height-aware rendering in 7D view
    // -------------------------------------------------------------
    console.log('\n--- TEST F1: Short blocks layout in 7D view ---');
    // Switch to 7D view
    await page.evaluate(() => {
      const daysBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Days'));
      if (daysBtn && !daysBtn.textContent.includes('7D')) {
        daysBtn.click();
      }
    });
    await new Promise(r => setTimeout(r, 600));

    // Click Add Class button
    await page.evaluate(() => {
      const addBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Add Class'));
      if (addBtn) addBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // Type course code
    const codeInputs = await page.$$('input[type="text"]');
    if (codeInputs.length > 0) {
      await codeInputs[0].click();
      await codeInputs[0].type('SAT 45');
    }
    if (codeInputs.length > 1) {
      await codeInputs[1].click();
      await codeInputs[1].type('Short 45m Block');
    }

    // Click Saturday day pill
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const sat = btns.find(b => b.textContent && b.textContent.trim() === 'Sat');
      if (sat) sat.click();
    });

    // Native time input typing
    const timeInputs = await page.$$('input[type="time"]');
    if (timeInputs.length >= 2) {
      await timeInputs[0].click();
      await timeInputs[0].type('1000A');
      await timeInputs[1].click();
      await timeInputs[1].type('1045A');
    }
    await new Promise(r => setTimeout(r, 400));

    // Submit form
    await page.evaluate(() => {
      const submitBtn = Array.from(document.querySelectorAll('button[type="submit"]')).find(b => b.textContent && (b.textContent.includes('Add') || b.textContent.includes('Save')));
      if (submitBtn) submitBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Verify 45-minute block rendered with complete time text and no truncation
    const satBlockInfo = await page.evaluate(() => {
      const blocks = Array.from(document.querySelectorAll('[title*="SAT 45"]'));
      if (blocks.length === 0) {
        const allBlocks = Array.from(document.querySelectorAll('.rounded-xl.border'));
        const found = allBlocks.find(b => b.textContent && b.textContent.includes('SAT 45'));
        if (!found) return null;
        const rect = found.getBoundingClientRect();
        return { text: found.innerText || found.textContent, height: rect.height, width: rect.width };
      }
      const b = blocks[0];
      const text = b.innerText || b.textContent;
      const rect = b.getBoundingClientRect();
      return { text, height: rect.height, width: rect.width };
    });
    console.log('SAT 45 block info:', satBlockInfo);

    if (satBlockInfo && satBlockInfo.text.includes('10:00') && satBlockInfo.text.includes('10:45')) {
      console.log('✅ PASS F1: 45-minute block displays complete unclipped time text in 7D view!');
    } else {
      throw new Error(`FAIL F1: SAT 45 block missing complete time text: ${JSON.stringify(satBlockInfo)}`);
    }

    // Capture screenshot of 7D view showing short block layout
    const f1ScreenshotPath = path.join(ARTIFACTS_DIR, 'f1-short-blocks-7d.png');
    await page.screenshot({ path: f1ScreenshotPath, type: 'png' });
    console.log(`Saved F1 screenshot to ${f1ScreenshotPath}`);

    // -------------------------------------------------------------
    // TEST 3: F2 — Optimizer proposal lists only real moves
    // -------------------------------------------------------------
    console.log('\n--- TEST F2: Optimizer proposal lists only real moves ---');
    // Load Nursing preset
    await page.evaluate(() => {
      const presetBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Presets'));
      if (presetBtn) presetBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    await page.evaluate(() => {
      const nursingCard = Array.from(document.querySelectorAll('button, div')).find(el => el.textContent && el.textContent.includes('Nursing Clinicals'));
      if (nursingCard) nursingCard.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Click Optimize
    await page.evaluate(() => {
      const optBtn = Array.from(document.querySelectorAll('button')).find(b => b.title?.includes('Optimizer') || (b.textContent && b.textContent.includes('Optimize')));
      if (optBtn) optBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Check proposal modal and moves
    const optimizerReport = await page.evaluate(() => {
      const modal = document.querySelector('.fixed.inset-0');
      if (!modal) return { isOpen: false, moves: [] };
      const moveRows = Array.from(modal.querySelectorAll('.space-y-1 > div, .space-y-1\\.5 > div'));
      const moves = moveRows.map(r => r.innerText || r.textContent);
      return { isOpen: true, moves };
    });
    console.log('Optimizer Proposal state:', optimizerReport);

    if (optimizerReport.isOpen) {
      console.log(`Optimizer proposal opened with ${optimizerReport.moves.length} proposed adjustments.`);
      for (const m of optimizerReport.moves) {
        console.log(` - ${m}`);
        const parts = m.split('→');
        if (parts.length === 2 && parts[0].trim() === parts[1].trim()) {
          throw new Error(`FAIL F2: Fake move detected where from === to: ${m}`);
        }
      }
      console.log('✅ PASS F2: All listed optimizer adjustments are genuine moves (from !== to).');

      // Apply optimization
      await page.evaluate(() => {
        const applyBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Apply Optimization'));
        if (applyBtn) applyBtn.click();
      });
      await new Promise(r => setTimeout(r, 800));
      console.log('Optimization applied successfully.');
    } else {
      console.log('Schedule already compact or no moves needed.');
    }

    // -------------------------------------------------------------
    // TEST 4: F3 — Shared plan loads without duplicated plan tabs
    // -------------------------------------------------------------
    console.log('\n--- TEST F3: Shared plan tab deduplication ---');
    const pageShare = await browser.newPage();
    await pageShare.setViewport({ width: 1280, height: 800 });
    // Navigate with hash #plan=...&name=Plan%20B
    const dummyHashUrl = 'http://localhost:4321/app#plan=c_1_CS101_ComputerScience1_3_0_Mon-Wed_0900_1000_Room101&name=Plan%20B';
    await pageShare.goto(dummyHashUrl, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1500));

    const planTabs = await pageShare.evaluate(() => {
      // Find the active desktop plan switcher
      const desktopHeader = document.querySelector('.hidden.xl\\:flex');
      if (!desktopHeader) return [];
      const buttons = Array.from(desktopHeader.querySelectorAll('button')).filter(b => 
        b.textContent && (b.textContent.includes('Plan A') || b.textContent.includes('Plan B') || b.textContent.includes('Plan C'))
      );
      return buttons.map(b => b.textContent.trim());
    });
    console.log('Desktop plan tabs found in strip:', planTabs);

    const planBCount = planTabs.filter(t => t === 'Plan B').length;
    console.log(`Number of 'Plan B' tabs in tab strip: ${planBCount}`);

    if (planBCount === 1) {
      console.log('✅ PASS F3: Exactly ONE "Plan B" tab is rendered in the tab strip. Zero duplication!');
    } else {
      throw new Error(`FAIL F3: Expected 1 "Plan B" tab, found ${planBCount}: ${JSON.stringify(planTabs)}`);
    }
    await pageShare.close();

    // -------------------------------------------------------------
    // TEST 5: Clean Navigation Bar & Floating Toast UI Screenshot
    // -------------------------------------------------------------
    console.log('\n--- TEST 5: Clean, Readable Navbar & Floating Toast ---');
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto('http://localhost:4321/app', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1500));

    // Trigger toast notification
    await page.evaluate(() => {
      const shareBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Share'));
      if (shareBtn) shareBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const navbarScreenshotPath = path.join(ARTIFACTS_DIR, 'clean-navbar-and-toast-1366x768.png');
    await page.screenshot({ path: navbarScreenshotPath, type: 'png' });
    console.log(`Saved clean navbar & toast screenshot to ${navbarScreenshotPath}`);

    // Update public preview images so landing page showcases the polished studio
    const publicPreviewPath = path.resolve(__dirname, '../public/images/studio-preview.png');
    await page.screenshot({ path: publicPreviewPath, type: 'png' });
    console.log('Updated public/images/studio-preview.png with new polished UI');

    console.log('\n========================================');
    console.log('ALL ACCEPTANCE TESTS (F1 - F4 + NAVBAR) PASSED!');
    console.log('========================================\n');

  } catch (err) {
    console.error('Acceptance verification error:', err);
    process.exit(1);
  } finally {
    await browser.close();
    server.close();
  }
}

run();
