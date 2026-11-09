const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'src', 'components', 'AcademicStudioApp.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. F3: Deduplicate Plan tabs when loading from URL hash (#plan=)
const oldHashStart = 'if (rawShareCode) {';
const oldHashEnd = "setBanner(`Shared schedule \"${sharedName}\" loaded — it's now saved on this device.`);";

const idx1 = content.indexOf(oldHashStart);
const idx2 = content.indexOf(oldHashEnd);

if (idx1 !== -1 && idx2 !== -1 && idx2 > idx1) {
  const endOfReturn = content.indexOf('return;\n        }\n      }', idx2);
  if (endOfReturn !== -1) {
    const fullOldHashBlock = content.substring(idx1, endOfReturn + 'return;\n        }\n      }'.length);
    const newHashBlock = `if (rawShareCode) {
        const decoded = decodeScheduleFromShareString(rawShareCode);
        if (decoded && decoded.length > 0) {
          const nameMatch = hash.match(/name=([^&]+)/);
          const sharedName = nameMatch ? decodeURIComponent(nameMatch[1]).trim() : 'Shared Plan';

          // Check if existing saved plans exist in localStorage
          const savedV3 = localStorage.getItem(STORAGE_KEY_V3);
          if (savedV3) {
            try {
              const parsedV3 = JSON.parse(savedV3);
              if (Array.isArray(parsedV3) && parsedV3.length > 0) {
                loadedPlans = parsedV3;
              }
            } catch (e) {}
          }

          // F3 Fix: Find if a plan with sharedName already exists
          const existingIdx = loadedPlans.findIndex(p => p.name.trim().toLowerCase() === sharedName.toLowerCase());
          let targetId = 'plan-a';
          if (existingIdx !== -1) {
            // Update the existing plan in place — NEVER duplicate plan tab
            loadedPlans[existingIdx].courses = decoded;
            loadedPlans[existingIdx].tasks = [];
            targetId = loadedPlans[existingIdx].id;
          } else {
            // Update the target plan without changing other plans
            const targetPlan = loadedPlans.find(p => p.id === loadedActiveId) || loadedPlans[0];
            targetPlan.courses = decoded;
            targetPlan.name = sharedName;
            targetPlan.tasks = [];
            targetId = targetPlan.id;
          }

          setPlans(loadedPlans);
          setActivePlanId(targetId);
          setCourses(decoded);
          setTasks([]);
          setBanner(\`Shared schedule "\${sharedName}" loaded — it's now saved on this device.\`);
          setTimeout(() => setBanner(null), 5000);
          isLoadedRef.current = true;
          return;
        }
      }`;
    content = content.replace(fullOldHashBlock, newHashBlock);
    console.log('✓ Applied F3 (Hash plan loading deduplication)');
  }
}

// 2. F4 & F1: Class Block Rendering in renderDayColumn
// Remove 1-click delete button (F4) and height-aware 2-line layout for <75m blocks (F1)
const oldBlockRenderStart = '<div className="leading-tight">\n                <div className="flex items-center justify-between gap-1 mb-0.5">';
const oldBlockRenderEnd = '<span className="truncate">{formatClassTimeRange(event.startTime, event.endTime, !isMobileSingle && totalCols > 1)}</span>\n              </div>';

const bIdx1 = content.indexOf(oldBlockRenderStart);
const bIdx2 = content.indexOf(oldBlockRenderEnd);

if (bIdx1 !== -1 && bIdx2 !== -1 && bIdx2 > bIdx1) {
  const fullOldBlock = content.substring(bIdx1, bIdx2 + oldBlockRenderEnd.length);
  const newBlockRender = `{/* Height-aware Block Layout (F1: Under 75 min / heightPx < 85 = strict 2-line layout; F4: No 1-click delete button) */}
              {event.heightPx < 85 ? (
                /* Compact 2-Line Layout for Short Blocks (< 75 mins: 45m, 50m, 60m) */
                <div className="h-full flex flex-col justify-between py-0.5 leading-tight select-none">
                  <div className="flex items-center justify-between gap-1 min-w-0">
                    <span className={\`font-bold text-xs sm:text-sm tracking-tight truncate \${pal.textCode}\`}>
                      {event.code}
                    </span>
                    <span className={\`font-mono text-[10px] font-semibold whitespace-nowrap shrink-0 \${pal.textMeta}\`}>
                      {formatClassTimeRange(event.startTime, event.endTime, !isMobileSingle && totalCols > 1)}
                    </span>
                  </div>
                  {event.title && (
                    <div className={\`text-[11px] font-medium truncate leading-none mt-0.5 \${pal.textTitle}\`}>
                      {event.title}
                    </div>
                  )}
                </div>
              ) : (
                /* Standard Multi-Line Layout for Taller Blocks (>= 75 mins) */
                <div className="h-full flex flex-col justify-between leading-tight select-none">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className={\`font-bold text-xs sm:text-sm tracking-tight truncate \${pal.textCode}\`}>
                        {event.code}
                      </span>
                    </div>

                    {event.title && (
                      <div className={\`text-[11px] font-medium \${event.heightPx <= 100 ? "truncate" : "line-clamp-2 break-words"} leading-tight \${pal.textTitle}\`}>
                        {event.title}
                      </div>
                    )}

                    {event.room && event.heightPx >= 100 && (
                      <div className={\`text-[10px] font-mono truncate flex items-center gap-1 mt-0.5 opacity-80 \${pal.textMeta}\`}>
                        <MapPin className="w-2.5 h-2.5 shrink-0" />
                        <span>{event.room}</span>
                      </div>
                    )}
                  </div>

                  <div className={\`text-[10px] font-mono font-semibold pt-0.5 pb-0.5 truncate shrink-0 flex items-center gap-1 border-t border-black/5 dark:border-white/10 \${pal.textMeta}\`}>
                    <Clock className="w-2.5 h-2.5 shrink-0 opacity-75" />
                    <span className="truncate">{formatClassTimeRange(event.startTime, event.endTime, !isMobileSingle && totalCols > 1)}</span>
                  </div>
                </div>
              )}`;
  content = content.replace(fullOldBlock, newBlockRender);
  console.log('✓ Applied F1 & F4 (Height-aware class block + removed 1-click delete button)');
}

// 3. Floating Toast Banner instead of Layout-shifting in-flow bar
const oldBannerDiv = `{/* Toast Alert Banner */}
        {banner && (
          <div className="mx-3 sm:mx-6 mt-3 p-3 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-between text-xs font-semibold shadow-md animate-in fade-in duration-150 shrink-0">
            <div className="flex items-center gap-2">
              <span>{banner}</span>
            </div>
            <button onClick={() => setBanner(null)} className="text-xs opacity-75 hover:opacity-100 cursor-pointer">
              ✕
            </button>
          </div>
        )}`;

const newBannerDiv = `{/* Floating Toast Alert (Clean, modern, zero layout shift) */}
        {banner && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[calc(100%-2rem)] sm:w-auto px-4 py-3 rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-between gap-4 text-xs font-semibold shadow-2xl border border-zinc-800 dark:border-zinc-200 animate-in fade-in slide-in-from-bottom-3 duration-200 select-none">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 dark:bg-emerald-600 shrink-0" />
              <span className="truncate">{banner}</span>
            </div>
            <button 
              onClick={() => setBanner(null)} 
              className="p-1 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-400 hover:text-white dark:hover:text-zinc-950 transition cursor-pointer shrink-0"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}`;

if (content.includes(oldBannerDiv)) {
  content = content.replace(oldBannerDiv, newBannerDiv);
  console.log('✓ Applied Floating Toast Banner');
}

// 4. F2: Optimizer proposal moves calculation and rendering
// Update optimizerProposal state definition
const oldPropState = `  // Gap Optimizer Proposal State (Honest Optimization)
  const [optimizerProposal, setOptimizerProposal] = useState<{
    isOpen: boolean;
    currentGapHours: string;
    proposedGapHours: string;
    savedHours: string;
    proposedCourses: Course[];
  } | null>(null);`;

const newPropState = `  // Gap Optimizer Proposal State (Honest Optimization)
  const [optimizerProposal, setOptimizerProposal] = useState<{
    isOpen: boolean;
    currentGapHours: string;
    proposedGapHours: string;
    savedHours: string;
    proposedCourses: Course[];
    moves: Array<{
      courseCode: string;
      courseTitle: string;
      day: DayOfWeek;
      fromStart: string;
      fromEnd: string;
      toStart: string;
      toEnd: string;
    }>;
  } | null>(null);`;

if (content.includes(oldPropState)) {
  content = content.replace(oldPropState, newPropState);
  console.log('✓ Updated optimizerProposal state type');
}

// Update handleOptimizeGaps to track real moves (from !== to)
const oldOptimizeLogic = `    const candidateCourses: Course[] = JSON.parse(JSON.stringify(courses));
    let hasImprovements = false;

    for (const day of activeDaysList) {
      const daySlots = (placedEventsByDay[day] || []).slice().sort((a, b) => a.startMins - b.startMins);
      if (daySlots.length <= 1) continue;

      for (let i = 0; i < daySlots.length - 1; i++) {
        const first = daySlots[i];
        const second = daySlots[i + 1];
        const gap = second.startMins - first.endMins;

        if (gap >= 30) {
          const secondDuration = second.endMins - second.startMins;
          const proposedStart = first.endMins + 15;
          const proposedEnd = proposedStart + secondDuration;

          const targetCourse = candidateCourses.find(c => c.id === second.courseId);
          if (!targetCourse) continue;
          const targetSec = targetCourse.sections.find(s => s.id === second.rawSection.id);
          if (!targetSec) continue;

          let clash = false;
          for (const meetDay of targetSec.days) {
            const dayEvents = (placedEventsByDay[meetDay] || []).filter(e => e.courseId !== second.courseId);
            if (dayEvents.some(e => Math.max(e.startMins, proposedStart) < Math.min(e.endMins, proposedEnd))) {
              clash = true;
              break;
            }
          }

          if (!clash && proposedStart < second.startMins) {
            targetSec.startTime = minutesToTime12(proposedStart);
            targetSec.endTime = minutesToTime12(proposedEnd);
            hasImprovements = true;
          }
        }
      }
    }

    if (hasImprovements) {
      const newTotalGaps = calculateScheduleIdleGaps(candidateCourses, activeDaysList);
      if (newTotalGaps < currentTotalGaps) {
        const currentHours = (currentTotalGaps / 60).toFixed(1);
        const proposedHours = (newTotalGaps / 60).toFixed(1);
        const savedHours = Math.max(0, parseFloat(currentHours) - parseFloat(proposedHours)).toFixed(1);
        setOptimizerProposal({
          isOpen: true,
          currentGapHours: currentHours,
          proposedGapHours: proposedHours,
          savedHours,
          proposedCourses: candidateCourses
        });
        return;
      }
    }`;

const newOptimizeLogic = `    const candidateCourses: Course[] = JSON.parse(JSON.stringify(courses));
    const recordedMoves: Array<{
      courseCode: string;
      courseTitle: string;
      day: DayOfWeek;
      fromStart: string;
      fromEnd: string;
      toStart: string;
      toEnd: string;
    }> = [];

    for (const day of activeDaysList) {
      const daySlots = (placedEventsByDay[day] || []).slice().sort((a, b) => a.startMins - b.startMins);
      if (daySlots.length <= 1) continue;

      for (let i = 0; i < daySlots.length - 1; i++) {
        const first = daySlots[i];
        const second = daySlots[i + 1];
        const gap = second.startMins - first.endMins;

        if (gap >= 30) {
          const secondDuration = second.endMins - second.startMins;
          const proposedStart = first.endMins + 15;
          const proposedEnd = proposedStart + secondDuration;

          const targetCourse = candidateCourses.find(c => c.id === second.courseId);
          if (!targetCourse) continue;
          const targetSec = targetCourse.sections.find(s => s.id === second.rawSection.id);
          if (!targetSec) continue;

          let clash = false;
          for (const meetDay of targetSec.days) {
            const dayEvents = (placedEventsByDay[meetDay] || []).filter(e => e.courseId !== second.courseId);
            if (dayEvents.some(e => Math.max(e.startMins, proposedStart) < Math.min(e.endMins, proposedEnd))) {
              clash = true;
              break;
            }
          }

          if (!clash && proposedStart < second.startMins) {
            const fromStartStr = targetSec.startTime;
            const fromEndStr = targetSec.endTime;
            const toStartStr = minutesToTime12(proposedStart);
            const toEndStr = minutesToTime12(proposedEnd);

            // Self-check guard (F2): ONLY record if from !== to
            if (fromStartStr !== toStartStr || fromEndStr !== toEndStr) {
              targetSec.startTime = toStartStr;
              targetSec.endTime = toEndStr;
              recordedMoves.push({
                courseCode: targetCourse.code,
                courseTitle: targetCourse.title,
                day,
                fromStart: fromStartStr,
                fromEnd: fromEndStr,
                toStart: toStartStr,
                toEnd: toEndStr
              });
            }
          }
        }
      }
    }

    // Filter to ensure zero fake moves
    const realMoves = recordedMoves.filter(m => m.fromStart !== m.toStart || m.fromEnd !== m.toEnd);

    if (realMoves.length > 0) {
      const newTotalGaps = calculateScheduleIdleGaps(candidateCourses, activeDaysList);
      if (newTotalGaps < currentTotalGaps) {
        const currentHours = (currentTotalGaps / 60).toFixed(1);
        const proposedHours = (newTotalGaps / 60).toFixed(1);
        const savedHours = Math.max(0, parseFloat(currentHours) - parseFloat(proposedHours)).toFixed(1);
        setOptimizerProposal({
          isOpen: true,
          currentGapHours: currentHours,
          proposedGapHours: proposedHours,
          savedHours,
          proposedCourses: candidateCourses,
          moves: realMoves
        });
        return;
      }
    }`;

if (content.includes(oldOptimizeLogic)) {
  content = content.replace(oldOptimizeLogic, newOptimizeLogic);
  console.log('✓ Updated handleOptimizeGaps real moves filtering (F2)');
} else {
  console.warn('! handleOptimizeGaps logic not matched verbatim');
}

// Update Optimizer Proposal Modal UI to display real moves
const oldModalProposalBody = `            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-850/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
              <p className="text-xs text-zinc-700 dark:text-zinc-300">
                This compaction reduces your idle on-campus wait time between classes:
              </p>
              <div className="flex items-center justify-between text-xs font-mono py-1">
                <span className="text-zinc-500">Total idle wait before:</span>
                <span className="font-bold text-rose-500">{optimizerProposal.currentGapHours} hrs</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono py-1 border-t border-zinc-200/60 dark:border-zinc-700/60">
                <span className="text-zinc-500">Total idle wait after:</span>
                <span className="font-bold text-emerald-500">{optimizerProposal.proposedGapHours} hrs</span>
              </div>
              <div className="text-[11px] text-zinc-500 pt-1">
                Saves <strong className="text-zinc-900 dark:text-white">{optimizerProposal.savedHours} hours</strong> of idle wait with zero class conflicts.
              </div>
            </div>`;

const newModalProposalBody = `            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-850/60 border border-zinc-200 dark:border-zinc-800 space-y-2.5">
              <p className="text-xs text-zinc-700 dark:text-zinc-300">
                This compaction reduces your idle on-campus wait time between classes:
              </p>
              <div className="flex items-center justify-between text-xs font-mono py-1">
                <span className="text-zinc-500">Total idle wait before:</span>
                <span className="font-bold text-rose-500">{optimizerProposal.currentGapHours} hrs</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono py-1 border-t border-zinc-200/60 dark:border-zinc-700/60">
                <span className="text-zinc-500">Total idle wait after:</span>
                <span className="font-bold text-emerald-500">{optimizerProposal.proposedGapHours} hrs</span>
              </div>
              <div className="text-[11px] text-zinc-500 pt-0.5">
                Saves <strong className="text-zinc-900 dark:text-white">{optimizerProposal.savedHours} hours</strong> of idle wait with zero class conflicts.
              </div>

              {/* F2: List of Real Moves (Never renders from === to) */}
              {optimizerProposal.moves && optimizerProposal.moves.length > 0 && (
                <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800 space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Proposed Class Adjustments ({optimizerProposal.moves.length})
                  </div>
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                    {optimizerProposal.moves.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 shadow-2xs">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-bold text-zinc-900 dark:text-white truncate">{m.courseCode}</span>
                          <span className="text-[10px] text-zinc-500 shrink-0 font-medium">{DAY_LABELS[m.day].short}</span>
                        </div>
                        <div className="font-mono text-[11px] flex items-center gap-1 shrink-0">
                          <span className="text-zinc-400 line-through">{m.fromStart}</span>
                          <span className="text-zinc-400">→</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{m.toStart}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>`;

if (content.includes(oldModalProposalBody)) {
  content = content.replace(oldModalProposalBody, newModalProposalBody);
  console.log('✓ Updated Optimizer Proposal Modal with real moves list (F2)');
} else {
  console.warn('! oldModalProposalBody not matched verbatim');
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Applied all updates to AcademicStudioApp.tsx');
