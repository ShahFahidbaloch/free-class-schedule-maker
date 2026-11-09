const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../src/components/AcademicStudioApp.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Add StudioErrorBoundary class component and wrap default export
const errorBoundaryCode = `// Recoverable React Error Boundary (S1)
interface ErrorBoundaryProps {
  children: React.ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}
export class StudioErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('StudioErrorBoundary caught error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBFD] dark:bg-[#09090b] p-6 text-center">
          <div className="max-w-md w-full bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            <h2 className="text-lg font-bold text-zinc-950 dark:text-white">
              Something went wrong
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Something went wrong — your schedule is saved. Reload the studio to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="h-10 px-6 rounded-xl bg-zinc-950 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Reload Studio
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
`;

if (!content.includes('class StudioErrorBoundary')) {
  content = content.replace(
    'export default function AcademicStudioApp() {',
    errorBoundaryCode + '\nexport default function AcademicStudioApp() {\n  return (\n    <StudioErrorBoundary>\n      <AcademicStudioAppInner />\n    </StudioErrorBoundary>\n  );\n}\n\nfunction AcademicStudioAppInner() {'
  );
  content = content.replace(/\n\}\s*$/, '\n}\n');
}

// 2. Add time24To12 and time12To24 converters
const converters = `
// 12-hour <-> 24-hour time format utilities for native <input type="time"> (S1)
export function time24To12(t24: string): string {
  if (!t24) return '09:00 AM';
  const clean = t24.trim();
  if (clean.includes('AM') || clean.includes('PM')) return clean;
  const [hStr, mStr] = clean.split(':');
  const h = parseInt(hStr, 10) || 0;
  const m = parseInt(mStr, 10) || 0;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  const hh = displayH < 10 ? \`0\${displayH}\` : \`\${displayH}\`;
  const mm = m < 10 ? \`0\${m}\` : \`\${m}\`;
  return \`\${hh}:\${mm} \${ampm}\`;
}

export function time12To24(t12: string): string {
  if (!t12) return '09:00';
  const clean = t12.trim();
  if (!clean.includes('AM') && !clean.includes('PM') && clean.includes(':')) {
    const parts = clean.split(':');
    const h = parseInt(parts[0], 10) || 0;
    const m = parseInt(parts[1], 10) || 0;
    return \`\${String(h).padStart(2, '0')}:\${String(m).padStart(2, '0')}\`;
  }
  const mins = parseFlexibleTime(clean);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return \`\${String(h).padStart(2, '0')}:\${String(m).padStart(2, '0')}\`;
}
`;

if (!content.includes('function time24To12')) {
  content = content.replace('export const DEFAULT_SAMPLE_COURSES', converters + '\nexport const DEFAULT_SAMPLE_COURSES');
}

// 3. Move Undo & Weekend restore to top of mount useEffect (S3 & S6)
const oldUndoMountPattern = `    // Restore Undo history across reload (R4)
    try {
      const savedUndo = localStorage.getItem('class_schedule_undo_snapshot_v1');
      if (savedUndo) {
        const parsedUndo = JSON.parse(savedUndo);
        if (parsedUndo && Array.isArray(parsedUndo.courses)) {
          historyStackRef.current = [parsedUndo];
          setCanUndo(true);
        }
      }
    } catch (e) {}

    // Restore 5D/7D view preference across reload (R6)
    try {
      const savedWeekend = localStorage.getItem('class_schedule_include_weekend_v1');
      if (savedWeekend === 'true') {
        setIncludeWeekend(true);
      }
    } catch (e) {}`;

if (content.includes(oldUndoMountPattern)) {
  content = content.replace(oldUndoMountPattern, '');
}

const topMountRestore = `    // 0. Restore Undo history & 5D/7D view preference across reload BEFORE any early return (S3 & S6)
    try {
      const savedUndo = localStorage.getItem('class_schedule_undo_snapshot_v1');
      if (savedUndo) {
        const parsedUndo = JSON.parse(savedUndo);
        if (parsedUndo && Array.isArray(parsedUndo.courses)) {
          historyStackRef.current = [parsedUndo];
          setCanUndo(true);
        }
      }
    } catch (e) {}
    try {
      const savedWeekend = localStorage.getItem('class_schedule_include_weekend_v1');
      if (savedWeekend === 'true') {
        setIncludeWeekend(true);
      }
    } catch (e) {}
`;

if (!content.includes('// 0. Restore Undo history & 5D/7D view preference across reload')) {
  content = content.replace('try {\n      // 1. Check if URL hash has a shared schedule', topMountRestore + '    try {\n      // 1. Check if URL hash has a shared schedule');
}

// 4. Fix day-pill toggle bug in toggleFormDay (S8: remove length > 1 restriction)
const oldToggleFormDay = `  const toggleFormDay = (d: DayOfWeek) => {
    const norm = normalizeDayOfWeek(d) || d;
    setFormDays(prev => {
      const normalizedPrev = prev.map(p => normalizeDayOfWeek(p) || p);
      if (normalizedPrev.includes(norm)) {
        if (normalizedPrev.length > 1) {
          return normalizedPrev.filter(day => day !== norm);
        }
        return normalizedPrev;
      } else {
        return [...normalizedPrev, norm];
      }
    });
  };`;

const newToggleFormDay = `  const toggleFormDay = (d: DayOfWeek) => {
    const norm = normalizeDayOfWeek(d) || d;
    setFormDays(prev => {
      const normalizedPrev = prev.map(p => normalizeDayOfWeek(p) || p);
      if (normalizedPrev.includes(norm)) {
        return normalizedPrev.filter(day => day !== norm);
      } else {
        return [...normalizedPrev, norm];
      }
    });
  };`;

content = content.replace(oldToggleFormDay, newToggleFormDay);

// 5. Update formStartTime & formEndTime state initialization and setters to use 24-hr format (S1)
content = content.replace(
  "const [formStartTime, setFormStartTime] = useState('09:00 AM');\n  const [formEndTime, setFormEndTime] = useState('10:15 AM');",
  "const [formStartTime, setFormStartTime] = useState('09:00');\n  const [formEndTime, setFormEndTime] = useState('10:15');"
);

// In handleOpenNewClassModal:
content = content.replace(
  "setFormStartTime(defaultStart);\n      const startM = parseFlexibleTime(defaultStart);\n      const endM = startM + 75; // default 1h 15m\n      const h = Math.floor(endM / 60);\n      const m = endM % 60;\n      const ampm = h >= 12 ? 'PM' : 'AM';\n      const displayH = h % 12 === 0 ? 12 : h % 12;\n      const displayM = m < 10 ? `0${m}` : m;\n      setFormEndTime(`${displayH}:${displayM} ${ampm}`);",
  "setFormStartTime(time12To24(defaultStart));\n      const startM = parseFlexibleTime(defaultStart);\n      const endM = startM + 75;\n      const h = Math.floor(endM / 60);\n      const m = endM % 60;\n      setFormEndTime(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);"
);
content = content.replace(
  "setFormStartTime('09:00 AM');\n      setFormEndTime('10:15 AM');",
  "setFormStartTime('09:00');\n      setFormEndTime('10:15');"
);

// In event click for Edit:
content = content.replace(
  "setFormStartTime(event.rawSection.startTime);\n                setFormEndTime(event.rawSection.endTime);",
  "setFormStartTime(time12To24(event.rawSection.startTime));\n                setFormEndTime(time12To24(event.rawSection.endTime));"
);

// In handleSaveCourse: convert to 12-hr format when saving:
content = content.replace(
  "startTime: formStartTime.trim(),\n                endTime: formEndTime.trim(),",
  "startTime: time24To12(formStartTime),\n                endTime: time24To12(formEndTime),"
);
content = content.replace(
  "startTime: formStartTime.trim(),\n            endTime: formEndTime.trim(),",
  "startTime: time24To12(formStartTime),\n            endTime: time24To12(formEndTime),"
);

// In handleSaveCourse startM and endM validation:
content = content.replace(
  "const startM = parseFlexibleTime(formStartTime);\n    const endM = parseFlexibleTime(formEndTime);",
  "const startM = parseFlexibleTime(time24To12(formStartTime));\n    const endM = parseFlexibleTime(time24To12(formEndTime));"
);

// 6. Replace modal time inputs with native <input type="time" step="900"> and remove datalists (S1)
const oldModalTimeBlockRegex = /\{\/\* Start & End Times \+ Room \*\/\}[\s\S]*?<datalist id="modal-times-end">[\s\S]*?<\/datalist>\s*<\/div>/;
const newNativeTimeInputs = `{/* Start & End Times + Room (S1: Native <input type="time" step="900"> per platform standard) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-start">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    {t.form.startTime}
                  </label>
                  <input
                    type="time"
                    step="900"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    required
                    className="w-full h-10 px-3 text-xs font-mono font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-850 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition scheme-light dark:scheme-dark"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    {t.form.endTime}
                  </label>
                  <input
                    type="time"
                    step="900"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    required
                    className="w-full h-10 px-3 text-xs font-mono font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-850 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition scheme-light dark:scheme-dark"
                  />
                </div>`;

if (oldModalTimeBlockRegex.test(content)) {
  content = content.replace(oldModalTimeBlockRegex, newNativeTimeInputs + '\n                </div>');
}

// 7. Fix S4: Optimizer "Saves" calculation must match displayed Before - After
content = content.replace(
  "const savedHours = (Math.max(0, currentTotalGaps - newTotalGaps) / 60).toFixed(1);",
  "const savedHours = Math.max(0, parseFloat(currentHours) - parseFloat(proposedHours)).toFixed(1);"
);

// 8. Fix S5: Ensure export toasts fire on PNG, PDF, and .ICS
if (!content.includes("setBanner('PNG exported — downloaded successfully.');")) {
  content = content.replace(
    "a.download = 'weekly-class-schedule.png';\n      a.href = dataUrl;\n      a.click();",
    "a.download = 'weekly-class-schedule.png';\n      a.href = dataUrl;\n      a.click();\n      setBanner('PNG exported — downloaded successfully.');\n      setTimeout(() => setBanner(null), 3500);"
  );
}

if (!content.includes("setBanner('.ICS calendar file downloaded — import into Google Calendar or Apple Calendar.');")) {
  content = content.replace(
    "a.download = 'semester-class-schedule.ics';\n    a.click();\n    URL.revokeObjectURL(url);\n    setIsExportModalOpen(false);",
    "a.download = 'semester-class-schedule.ics';\n    a.click();\n    URL.revokeObjectURL(url);\n    setIsExportModalOpen(false);\n    setBanner('.ICS calendar file downloaded — import into Google Calendar or Apple Calendar.');\n    setTimeout(() => setBanner(null), 3500);"
  );
}

// Quick Print helper with toast
if (!content.includes("const handlePrint = () => {")) {
  const printHelper = `  const handlePrint = () => {
    setBanner('PDF / Print dialog opened.');
    setTimeout(() => setBanner(null), 3500);
    window.print();
  };
`;
  content = content.replace('const handleExportPNG = async () => {', printHelper + '\n  const handleExportPNG = async () => {');
  content = content.replace('onClick={() => window.print()}', 'onClick={handlePrint}');
  content = content.replace('onClick={() => {\n                  setIsExportModalOpen(false);\n                  window.print();\n                }}', 'onClick={() => {\n                  setIsExportModalOpen(false);\n                  handlePrint();\n                }}');
}

// 9. Fix S7: Adaptive event card layout for short classes (< 75m)
const oldCardInteriorRegex = /<div className="leading-tight">\s*<div className=\{`flex items-center justify-between gap-1 mb-0\.5`\}>[\s\S]*?<div className=\{`text-\[10px\] font-mono font-semibold pt-0\.5 pb-0\.5 truncate shrink-0 flex items-center gap-1 border-t border-black\/5 dark:border-white\/10 \$\{pal\.textMeta\}`\}>[\s\S]*?<\/div>/;

const newCardInterior = `{/* Adaptive Card Layout (S7: short classes < 75m adapt gracefully) */}
              {event.heightPx < 65 ? (
                // Ultra-compact layout (e.g. 45m blocks): Code + Time on top line, single-line Title below
                <div className="flex flex-col justify-between h-full leading-tight">
                  <div className="flex items-center justify-between gap-1">
                    <span className={\`font-bold text-[11px] sm:text-xs tracking-tight truncate \${pal.textCode}\`}>
                      {event.code}
                    </span>
                    <span className={\`text-[9px] font-mono font-semibold truncate shrink-0 opacity-85 \${pal.textMeta}\`}>
                      {formatClassTimeRange(event.startTime, event.endTime, true)}
                    </span>
                  </div>
                  {event.title && (
                    <div className={\`text-[10px] font-medium truncate leading-none mt-0.5 \${pal.textTitle}\`}>
                      {event.title}
                    </div>
                  )}
                </div>
              ) : (
                // Standard / Compact layout (>= 60m blocks)
                <div className="flex flex-col justify-between h-full leading-tight">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className={\`font-bold text-xs sm:text-sm tracking-tight truncate \${pal.textCode}\`}>
                        {event.code}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCourse(event.courseId);
                        }}
                        className="opacity-60 md:opacity-0 md:group-hover:opacity-100 hover:text-rose-600 transition p-0.5 rounded cursor-pointer"
                        title="Delete class"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {event.title && (
                      <div className={\`text-[10px] sm:text-[11px] font-medium \${event.heightPx <= 85 ? "truncate" : "line-clamp-2 break-words"} leading-tight \${pal.textTitle}\`}>
                        {event.title}
                      </div>
                    )}

                    {event.room && event.heightPx > 70 && (
                      <div className={\`text-[10px] font-mono truncate flex items-center gap-1 mt-0.5 opacity-80 \${pal.textMeta}\`}>
                        <MapPin className="w-2.5 h-2.5 shrink-0" />
                        <span>{event.room}</span>
                      </div>
                    )}
                  </div>

                  <div className={\`text-[9px] sm:text-[10px] font-mono font-semibold pt-0.5 truncate shrink-0 flex items-center gap-1 border-t border-black/5 dark:border-white/10 \${pal.textMeta}\`}>
                    <Clock className="w-2.5 h-2.5 shrink-0 opacity-75" />
                    <span className="truncate">{formatClassTimeRange(event.startTime, event.endTime, !isMobileSingle && totalCols > 1)}</span>
                  </div>
                </div>
              )}`;

if (oldCardInteriorRegex.test(content)) {
  content = content.replace(oldCardInteriorRegex, newCardInterior);
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully applied Round 3 code updates to AcademicStudioApp.tsx.');
