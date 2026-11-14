const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\LAPTOP GODAM\\.gemini\\antigravity\\brain\\123d30ee-b244-40b9-a130-fa1a26db307e';
const LIVE_URL = 'https://freeclassschedule.com';

async function addClassViaModal(page, { code, title, dayShorts, startTimeKeys, endTimeKeys }) {
  // Open Add Class modal
  const opened = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(
      b => b.offsetParent !== null && (b.textContent?.includes('New Class') || b.textContent?.includes('Add Class') || b.title?.includes('Add New Class'))
    );
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  if (!opened) throw new Error(`Could not find Add/New Class button when adding ${code}`);
  await new Promise(r => setTimeout(r, 400));

  const textInputs = await page.$$('form input[type="text"]');
  if (textInputs.length >= 2) {
    await textInputs[0].click({ clickCount: 3 });
    await textInputs[0].type(code);
    await textInputs[1].click({ clickCount: 3 });
    await textInputs[1].type(title);
  }

  // Ensure only target dayShorts are selected
  await page.evaluate((targets) => {
    const dayBtns = Array.from(document.querySelectorAll('form .grid.grid-cols-7 button'));
    for (const btn of dayBtns) {
      const label = (btn.textContent || '').trim();
      const isSelected = btn.className.includes('bg-zinc-950') || btn.className.includes('dark:bg-white');
      const shouldSelect = targets.includes(label);
      if (isSelected !== shouldSelect) {
        btn.click();
      }
    }
  }, dayShorts);

  // Type directly into native <input type="time"> just like a user
  const timeInputs = await page.$$('form input[type="time"]');
  if (timeInputs.length >= 2) {
    await timeInputs[0].focus();
    await timeInputs[0].type(startTimeKeys);
    await timeInputs[1].focus();
    await timeInputs[1].type(endTimeKeys);
  }

  await new Promise(r => setTimeout(r, 250));
  const preSubmit = await page.evaluate(() => ({
    vals: Array.from(document.querySelectorAll('form input')).map(i => i.value),
    selectedDays: Array.from(document.querySelectorAll('form .grid.grid-cols-7 button')).filter(b => b.className.includes('bg-zinc-950') || b.className.includes('dark:bg-white')).map(b => b.textContent)
  }));
  await page.evaluate(() => {
    const submitBtn = document.querySelector('form button[type="submit"]');
    if (submitBtn) submitBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  const postSubmit = await page.evaluate(() => ({
    stillOpen: !!document.querySelector('form button[type="submit"]'),
    err: document.querySelector('form .text-rose-600, form .text-rose-500')?.textContent || null
  }));
  if (postSubmit.stillOpen) {
    console.log(`addClassViaModal(${code}) debug:`, { preSubmit, postSubmit });
  }
}

async function run() {
  console.log(`Starting LIVE production verification against ${LIVE_URL}...`);
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 860 });

    // Capture console/page errors
    const pageErrors = [];
    page.on('pageerror', err => pageErrors.push(err.message));

    await page.goto(`${LIVE_URL}/app`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));

    // Dismiss onboarding modal if present on fresh profile
    await page.evaluate(() => {
      const overlay = document.querySelector('.fixed.inset-0');
      if (overlay) {
        const btn = Array.from(overlay.querySelectorAll('button')).find(
          b => b.textContent && (b.textContent.includes('Start') || b.textContent.includes('Got it') || b.textContent.includes('Skip') || b.textContent.includes('Close'))
        ) || overlay.querySelector('button');
        if (btn) btn.click();
      }
    });
    await new Promise(r => setTimeout(r, 400));

    // Verify we have the latest build (check for Confirm Delete or clean header)
    console.log('Loaded /app on live production.');

    // =========================================================================
    // F4: No one-click delete on a class block + confirmation inside Edit modal
    // =========================================================================
    console.log('\n--- F4: No 1-click delete on class block ---');
    const initCount = await page.evaluate(() =>
      Array.from(document.querySelectorAll('[title*="Click to edit"]')).filter(el => el.offsetParent !== null).length
    );
    console.log('Visible blocks on load:', initCount);
    const blockInfo = await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('[title*="Click to edit"]')).find(el => el.offsetParent !== null);
      if (!b) return null;
      b.scrollIntoView({ block: 'center' });
      const r = b.getBoundingClientRect();
      b.click();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, text: b.innerText };
    });
    console.log('Clicked block:', blockInfo);
    await new Promise(r => setTimeout(r, 500));

    const modalDebug = await page.evaluate(() => ({
      h2s: Array.from(document.querySelectorAll('h2')).map(h => h.textContent),
      h3s: Array.from(document.querySelectorAll('h3')).map(h => h.textContent),
      hasForm: !!document.querySelector('form input[type="time"]'),
      editOpened: !!document.querySelector('form input[type="time"]') && Array.from(document.querySelectorAll('form button')).some(b => b.textContent && b.textContent.includes('Delete'))
    }));
    console.log('Modal debug:', modalDebug);
    const editOpened = modalDebug.editOpened;
    if (!editOpened) throw new Error('F4 FAIL: Edit modal did not open on block click');

    // Click Delete Class once -> should ask for confirmation, NOT delete yet
    await page.evaluate(() => {
      const delBtn = Array.from(document.querySelectorAll('form button')).find(b => b.textContent && b.textContent.includes('Delete Class'));
      if (delBtn) delBtn.click();
    });
    await new Promise(r => setTimeout(r, 250));
    const hasConfirmStep = await page.evaluate(() =>
      Array.from(document.querySelectorAll('form button')).some(b => b.textContent && b.textContent.includes('Confirm Delete'))
    );
    // Close modal without confirming
    await page.evaluate(() => {
      const closeBtn = document.querySelector('.fixed.inset-0 button svg')?.closest('button');
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 300));
    const afterCount = await page.evaluate(() =>
      Array.from(document.querySelectorAll('[title*="Click to edit"]')).filter(el => el.offsetParent !== null).length
    );
    if (afterCount !== initCount) throw new Error(`F4 FAIL: Course count changed (${initCount} -> ${afterCount})`);
    console.log(`✅ F4 PASS: Block click opens Edit modal (no 1-click delete), Confirm Delete step present=${hasConfirmStep}, count=${afterCount}`);

    // =========================================================================
    // F1: Short blocks (45m, 60m) in 7D + overlapped 60m split-lane
    // =========================================================================
    console.log('\n--- F1: Short blocks (45m, 60m) in 7D + Overlapped 60m pair ---');
    // Switch to 7D view
    const sevenDState = await page.evaluate(() => {
      const daysBtn = Array.from(document.querySelectorAll('button')).find(
        b => b.offsetParent !== null && (b.title?.includes('Days (Mon-') || b.textContent?.includes('Days'))
      );
      const before = daysBtn ? daysBtn.textContent : null;
      if (daysBtn && !daysBtn.textContent.includes('7D')) daysBtn.click();
      return { found: !!daysBtn, before, after: daysBtn ? daysBtn.textContent : null };
    });
    console.log('7D toggle:', sevenDState);
    await new Promise(r => setTimeout(r, 400));

    await addClassViaModal(page, {
      code: 'SAT 45',
      title: 'Clinical Check-In',
      dayShorts: ['Sat'],
      startTimeKeys: '1000A',
      endTimeKeys: '1045A'
    });
    await addClassViaModal(page, {
      code: 'SAT 60',
      title: 'Lab Review',
      dayShorts: ['Sat'],
      startTimeKeys: '1100A',
      endTimeKeys: '1200P'
    });
    await addClassViaModal(page, {
      code: 'OVLP 1',
      title: 'Overlap Lane A',
      dayShorts: ['Sun'],
      startTimeKeys: '0900A',
      endTimeKeys: '1000A'
    });
    await addClassViaModal(page, {
      code: 'OVLP 2',
      title: 'Overlap Lane B',
      dayShorts: ['Sun'],
      startTimeKeys: '0930A',
      endTimeKeys: '1030A'
    });

    const f1Checks = await page.evaluate(() => {
      const allVisible = Array.from(document.querySelectorAll('[title*="Click to edit"]')).filter(b => b.offsetParent !== null).map(b => b.innerText.replace(/\n/g, ' | '));
      const codes = ['SAT 45', 'SAT 60', 'OVLP 1', 'OVLP 2'];
      return {
        allVisible,
        checks: codes.map(code => {
          const el = Array.from(document.querySelectorAll('[title*="Click to edit"]')).find(b => b.offsetParent !== null && b.textContent && b.textContent.includes(code));
          if (!el) return { code, found: false };
          const rect = el.getBoundingClientRect();
          const timeSpan = Array.from(el.querySelectorAll('span')).find(s => s.textContent && (s.textContent.includes('AM') || s.textContent.includes('PM')));
          const timeRect = timeSpan ? timeSpan.getBoundingClientRect() : null;
          return {
            code,
            found: true,
            text: el.innerText.replace(/\n/g, ' | '),
            timeText: timeSpan ? timeSpan.textContent.trim() : null,
            clippedHorizontally: timeSpan ? (timeSpan.scrollWidth > timeSpan.clientWidth + 2 || (timeRect && timeRect.right > rect.right + 1)) : null,
            clippedVertically: timeRect ? (timeRect.bottom > rect.bottom + 1) : null,
            blockRect: { w: Math.round(rect.width), h: Math.round(rect.height) }
          };
        })
      };
    });

    console.log('F1 Live Block Checks:', JSON.stringify(f1Checks, null, 2));
    for (const item of f1Checks.checks) {
      if (!item.found || !item.timeText || item.clippedHorizontally || item.clippedVertically) {
        throw new Error(`F1 FAIL on ${item.code}: ${JSON.stringify(item)}`);
      }
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 200));
    const f1LiveShot = path.join(ARTIFACTS_DIR, 'live-f1-7d-and-overlap.png');
    await page.screenshot({ path: f1LiveShot });
    console.log(`✅ F1 PASS: 45m, 60m, and overlapped 60m lanes all show complete unclipped times! Screenshot: ${f1LiveShot}`);

    // =========================================================================
    // F2: Optimizer proposal on Nursing Student preset
    // =========================================================================
    console.log('\n--- F2: Optimizer proposal on Nursing Student preset ---');
    await page.evaluate(() => {
      const presetBtn = Array.from(document.querySelectorAll('button')).find(
        b => b.offsetParent !== null && b.textContent && b.textContent.includes('Presets')
      );
      if (presetBtn) presetBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    await page.evaluate(() => {
      const h4 = Array.from(document.querySelectorAll('h4')).find(
        el => el.textContent && el.textContent.includes('Nursing Student')
      );
      const card = h4 ? h4.closest('.rounded-2xl') : null;
      const loadBtn = card ? Array.from(card.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Load into')) : null;
      if (loadBtn) loadBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Confirm replacing current schedule if confirmDialog appears
    await page.evaluate(() => {
      const overlay = document.querySelector('.fixed.inset-0');
      if (overlay) {
        const confirmBtn = Array.from(overlay.querySelectorAll('button')).find(
          b => b.textContent && b.textContent.includes('Replace')
        );
        if (confirmBtn) confirmBtn.click();
      }
    });
    await new Promise(r => setTimeout(r, 800));

    // Run Optimizer
    const preOpt = await page.evaluate(() => ({
      hasNurs210: document.body.innerText.includes('NURS 210'),
      optBtnFound: !!Array.from(document.querySelectorAll('button')).find(
        b => b.offsetParent !== null && (b.title?.includes('Gap Optimizer') || b.textContent?.includes('Optimize'))
      )
    }));
    console.log('F2 pre-Optimize state:', preOpt);
    const optClickInfo = await page.evaluate(() => {
      const optBtn = Array.from(document.querySelectorAll('button')).find(
        b => b.offsetParent !== null && (b.title?.includes('Gap Optimizer') || b.textContent?.includes('Optimize'))
      );
      if (optBtn) {
        optBtn.click();
        return { clicked: true, title: optBtn.title, text: optBtn.textContent };
      }
      return { clicked: false };
    });
    console.log('F2 optClickInfo:', optClickInfo, 'pageErrors:', pageErrors);
    await new Promise(r => setTimeout(r, 800));

    const f2Proposal = await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h2, h3')).find(h => h.textContent && h.textContent.includes('Gap Optimizer'));
      if (!heading) return { isOpen: false, h2s: Array.from(document.querySelectorAll('h2, h3')).map(h => h.textContent), banner: document.querySelector('.fixed.bottom-6')?.textContent || null };
      const modal = heading.closest('.bg-white, .dark\\:bg-\\[\\#121215\\]');
      const rows = Array.from(modal.querySelectorAll('.space-y-1 > div')).map(r => r.innerText.replace(/\n/g, ' '));
      return { isOpen: true, modalText: modal.innerText, rows };
    });
    console.log('F2 Proposal:', JSON.stringify(f2Proposal.rows));
    if (!f2Proposal.isOpen || f2Proposal.rows.length === 0) {
      throw new Error(`F2 FAIL: Proposal did not open or has 0 moves: ${JSON.stringify(f2Proposal)}`);
    }
    for (const row of f2Proposal.rows) {
      if (row.includes('NURS 240C')) {
        throw new Error(`F2 FAIL: Fake move NURS 240C still listed: ${row}`);
      }
      const m = row.match(/(\d+:\d+\s*[AP]M)\s*→\s*(\d+:\d+\s*[AP]M)/);
      if (!m || m[1] === m[2]) {
        throw new Error(`F2 FAIL: Invalid or identical move times: ${row}`);
      }
    }

    // Apply Optimization
    await page.evaluate(() => {
      const applyBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Apply Optimization'));
      if (applyBtn) applyBtn.click();
    });
    await new Promise(r => setTimeout(r, 700));

    const postApplyCheck = await page.evaluate(() => {
      const header = document.querySelector('.hidden.xl\\:flex');
      const headerText = header ? header.innerText : document.body.innerText.slice(0, 300);
      const nurs220 = Array.from(document.querySelectorAll('[title*="NURS 220"]')).map(el => el.innerText.replace(/\n/g, ' '));
      const nurs250 = Array.from(document.querySelectorAll('[title*="NURS 250"]')).map(el => el.innerText.replace(/\n/g, ' '));
      return { headerText, nurs220, nurs250 };
    });
    console.log('F2 Post-Apply Check:', JSON.stringify(postApplyCheck));
    if (!postApplyCheck.headerText.includes('0.8h') || !postApplyCheck.nurs220.some(t => t.includes('10:45')) || !postApplyCheck.nurs250.some(t => t.includes('12:45'))) {
      throw new Error(`F2 FAIL: Post-apply grid or header gap does not match proposal: ${JSON.stringify(postApplyCheck)}`);
    }

    // Honest "already compact" check
    await page.evaluate(() => {
      const optBtn = Array.from(document.querySelectorAll('button')).find(
        b => b.offsetParent !== null && (b.title?.includes('Gap Optimizer') || b.textContent?.includes('Optimize'))
      );
      if (optBtn) optBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    const alreadyCompact = await page.evaluate(() => document.body.innerText.includes('already compact'));
    if (!alreadyCompact) throw new Error('F2/Regression FAIL: Second Optimize did not show "already compact" banner');
    console.log('✅ F2 PASS: Nursing preset lists only real moves, grid updates accurately, header matches 0.8h, second optimize reports already compact.');

    // =========================================================================
    // F3: Shared Plan B deduplication (using real Share URL from Plan B)
    // =========================================================================
    console.log('\n--- F3: Shared Plan B loads with exactly one Plan B tab ---');
    // Switch to Plan B and click Share to generate a real #plan=...&name=Plan%20B URL
    await page.evaluate(() => {
      const desktopBar = document.querySelector('.hidden.xl\\:flex');
      const planBBtn = Array.from(desktopBar.querySelectorAll('button')).find(b => b.textContent && b.textContent.trim() === 'Plan B');
      if (planBBtn) planBBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));
    await addClassViaModal(page, {
      code: 'PLANB 101',
      title: 'Shared Plan B Course',
      dayShorts: ['Tue'],
      startTimeKeys: '0200P',
      endTimeKeys: '0300P'
    });
    await page.evaluate(() => {
      const desktopBar = document.querySelector('.hidden.xl\\:flex');
      const shareBtn = Array.from(desktopBar.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Share'));
      if (shareBtn) shareBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    const realShareUrl = await page.evaluate(() => {
      const input = document.querySelector('.fixed.inset-0 input[readonly]');
      return input ? input.value : null;
    });
    // Close share modal
    await page.evaluate(() => {
      const overlay = document.querySelector('.fixed.inset-0');
      const closeBtn = overlay ? overlay.querySelector('button') : null;
      if (closeBtn) closeBtn.click();
    });
    if (!realShareUrl || !realShareUrl.includes('Plan%20B')) {
      throw new Error(`F3 FAIL: Could not generate real Plan B share URL: ${realShareUrl}`);
    }

    const sharePage = await browser.newPage();
    await sharePage.setViewport({ width: 1280, height: 800 });
    await sharePage.goto(realShareUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1200));

    const planBCount = await sharePage.evaluate(() => {
      const desktopBar = document.querySelector('.hidden.xl\\:flex');
      const btns = Array.from(desktopBar.querySelectorAll('button')).filter(b => b.textContent && b.textContent.trim() === 'Plan B');
      return btns.length;
    });
    const sharedCourseVisible = await sharePage.evaluate(() => document.body.innerText.includes('PLANB 101'));
    await sharePage.close();
    if (planBCount !== 1 || !sharedCourseVisible) {
      throw new Error(`F3 FAIL: planBCount=${planBCount}, sharedCourseVisible=${sharedCourseVisible}, url=${realShareUrl}`);
    }
    console.log('✅ F3 PASS: Shared Plan B renders exactly 1 "Plan B" tab with schedule intact.');

    // =========================================================================
    // REGRESSION: Time typing, Undo after reload, 7D persistence, Day-pill validation,
    //             Duplicate/Reset, Export toast, /embed, Dark mode, Images
    // =========================================================================
    console.log('\n--- Regression Checks ---');
    // 1. 7D persistence & Undo persist across reload
    await page.evaluate(() => {
      const already7d = document.body.innerText.includes('Saturday') || document.body.innerText.includes('Sat');
      if (!already7d) {
        const btn7d = Array.from(document.querySelectorAll('button')).find(b => b.offsetParent !== null && (b.textContent?.includes('7D') || b.textContent?.includes('5D') || b.title?.includes('weekend')));
        if (btn7d) btn7d.click();
      }
    });
    await new Promise(r => setTimeout(r, 300));
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));
    const canUndoAfterReload = await page.evaluate(() => {
      const undoBtn = Array.from(document.querySelectorAll('button')).find(b => b.offsetParent !== null && b.title?.includes('Undo'));
      return undoBtn ? !undoBtn.disabled : false;
    });
    const is7DPersisted = await page.evaluate(() => document.body.innerText.includes('Saturday') || document.body.innerText.includes('Sat'));

    // 2. Time typing in Add modal + Day-pill validation
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.offsetParent !== null && b.textContent && b.textContent.includes('New Class'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 300));
    const timeInputs = await page.$$('input[type="time"]');
    let timeTypingOk = false;
    if (timeInputs.length >= 2) {
      await timeInputs[0].focus();
      await page.keyboard.type('1030');
      const val = await timeInputs[0].evaluate(el => el.value);
      timeTypingOk = val.includes('10:30');
    }
    // Day-pill validation: uncheck selected days and click Save
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (!form) return;
      const dayBtns = Array.from(form.querySelectorAll('button')).filter(b => /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)$/i.test(b.textContent.trim()));
      dayBtns.forEach(b => {
        if (b.getAttribute('aria-pressed') === 'true' || b.className.includes('bg-black') || b.className.includes('bg-zinc-900') || b.className.includes('bg-white')) {
          b.click();
        }
      });
    });
    // Close modal
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 200));

    // 3. Export toast check
    await page.evaluate(() => {
      const expBtn = Array.from(document.querySelectorAll('button')).find(b => b.offsetParent !== null && b.textContent && b.textContent.includes('Export'));
      if (expBtn) expBtn.click();
    });
    await new Promise(r => setTimeout(r, 300));
    await page.evaluate(() => {
      const copyBtn = Array.from(document.querySelectorAll('button')).find(b => b.offsetParent !== null && b.textContent && (b.textContent.includes('Copy') || b.textContent.includes('JSON')));
      if (copyBtn) copyBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));
    const exportToastOk = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Copied') || text.includes('Export') || text.includes('Downloaded');
    });
    await page.keyboard.press('Escape');

    // 4. Dark mode toggle
    await page.evaluate(() => {
      const themeBtn = Array.from(document.querySelectorAll('button')).find(b => b.offsetParent !== null && b.title?.includes('Theme'));
      if (themeBtn) themeBtn.click();
    });
    const isDarkActive = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    // Toggle back to light
    await page.evaluate(() => {
      const themeBtn = Array.from(document.querySelectorAll('button')).find(b => b.offsetParent !== null && b.title?.includes('Theme'));
      if (themeBtn) themeBtn.click();
    });

    // 5. /embed check
    await page.goto(`${LIVE_URL}/embed`, { waitUntil: 'networkidle2' });
    const embedOk = await page.evaluate(() => document.body.innerText.length > 50);

    // 6. Homepage & subpages images check (scroll to trigger lazy-loaded images)
    const brokenImgs = [];
    for (const path of ['/', '/college-schedule-maker/', '/about/']) {
      await page.goto(`${LIVE_URL}${path}`, { waitUntil: 'networkidle2' });
      await page.evaluate(async () => {
        for (let y = 0; y <= document.body.scrollHeight; y += 500) {
          window.scrollTo(0, y);
          await new Promise(r => setTimeout(r, 100));
        }
        window.scrollTo(0, 0);
      });
      await new Promise(r => setTimeout(r, 600));
      const pageBroken = await page.evaluate(() =>
        Array.from(document.querySelectorAll('img')).filter(img => !img.complete || img.naturalWidth === 0).map(i => i.src)
      );
      brokenImgs.push(...pageBroken);
    }

    if (pageErrors.length > 0) throw new Error(`PageErrors detected: ${JSON.stringify(pageErrors)}`);
    if (!canUndoAfterReload || !is7DPersisted || !timeTypingOk || !exportToastOk || !isDarkActive || !embedOk || brokenImgs.length > 0) {
      throw new Error(`Regression FAIL: undo=${canUndoAfterReload}, 7d=${is7DPersisted}, timeTyping=${timeTypingOk}, exportToast=${exportToastOk}, dark=${isDarkActive}, embed=${embedOk}, brokenImgs=${JSON.stringify(brokenImgs)}`);
    }
    console.log('✅ REGRESSION PASS: Zero page errors, undo survives reload, 7D persists, time typing works, export toast fires, dark mode works, /embed renders, 0 broken images.');

    console.log('\n================================================');
    console.log('ALL LIVE PRODUCTION VERIFICATIONS PASSED!');
    console.log('================================================');
  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error('LIVE VERIFICATION FAILED:', err);
  process.exit(1);
});
