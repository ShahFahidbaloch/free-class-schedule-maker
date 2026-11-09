const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../src/components/AcademicStudioApp.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Update formatClassTimeRange (M4: Always compact range, never truncate)
const oldFormatRange = `export function formatClassTimeRange(startTime: string, endTime: string, isNarrow: boolean = false): string {
  const startFmt = formatTime12(startTime);
  const endFmt = formatTime12(endTime);
  if (!startFmt && !endFmt) return '';
  if (!startFmt) return endFmt;
  if (!endFmt) return startFmt;

  if (isNarrow) {
    const sParts = startFmt.split(' ');
    const eParts = endFmt.split(' ');
    if (sParts[1] === eParts[1]) {
      return \`\${sParts[0]}–\${endFmt}\`;
    }
  }
  return \`\${startFmt} – \${endFmt}\`;
}`;

const newFormatRange = `export function formatClassTimeRange(startTime: string, endTime: string, isNarrow: boolean = true): string {
  const startFmt = formatTime12(startTime);
  const endFmt = formatTime12(endTime);
  if (!startFmt && !endFmt) return '';
  if (!startFmt) return endFmt;
  if (!endFmt) return startFmt;

  const sParts = startFmt.split(' ');
  const eParts = endFmt.split(' ');
  // Always compact when AM/PM matches (e.g. 10:00–11:15 AM)
  if (sParts[1] === eParts[1]) {
    return \`\${sParts[0]}–\${endFmt}\`;
  }
  return \`\${startFmt}–\${endFmt}\`;
}`;

content = content.replace(oldFormatRange, newFormatRange);

// 2. Class Block Card Interior in renderDayColumn (M4: Responsive typography, never amputate time)
const oldCardBlockRegex = /<div className="leading-tight">\s*<div className=\{`flex items-center justify-between gap-1 mb-0\.5`\}>[\s\S]*?<div className=\{`text-\[10px\] font-mono font-semibold pt-0\.5 pb-0\.5 truncate shrink-0 flex items-center gap-1 border-t border-black\/5 dark:border-white\/10 \$\{pal\.textMeta\}`\}>[\s\S]*?<\/div>\s*<\/div>/;

const newCardBlock = `<div className="flex flex-col justify-between h-full leading-tight">
                <div>
                  {/* Line 1: Course Code + Delete affordance */}
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className={\`font-bold text-[11px] sm:text-xs md:text-sm tracking-tight truncate \${pal.textCode}\`}>
                      {event.code}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCourse(event.courseId);
                      }}
                      className="opacity-60 md:opacity-0 md:group-hover:opacity-100 hover:text-rose-600 transition p-0.5 rounded cursor-pointer shrink-0"
                      title="Delete class"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line 2: Title (allows 2 lines wrapping, break-words) */}
                  {event.title && event.heightPx > 45 && (
                    <div className={\`text-[10px] sm:text-[11px] font-medium leading-tight \${event.heightPx <= 70 ? "truncate" : "line-clamp-2 break-words"} \${pal.textTitle}\`}>
                      {event.title}
                    </div>
                  )}

                  {/* Line 3: Room (Lowest priority: dropped if column is cramped to preserve time) */}
                  {event.room && event.heightPx >= 75 && (
                    <div className={\`hidden xl:flex items-center gap-1 text-[9px] sm:text-[10px] font-mono truncate mt-0.5 opacity-80 \${pal.textMeta}\`}>
                      <MapPin className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{event.room}</span>
                    </div>
                  )}
                </div>

                {/* Line 4 / Bottom: Time Range (CRITICAL: NEVER TRUNCATED, whitespace-nowrap) */}
                <div className={\`text-[9px] sm:text-[10px] font-mono font-semibold pt-0.5 shrink-0 flex items-center gap-1 border-t border-black/5 dark:border-white/10 \${pal.textMeta}\`}>
                  <Clock className="w-2.5 h-2.5 shrink-0 opacity-75" />
                  <span className="whitespace-nowrap tracking-tight">{formatClassTimeRange(event.startTime, event.endTime, true)}</span>
                </div>
              </div>`;

if (oldCardBlockRegex.test(content)) {
  content = content.replace(oldCardBlockRegex, newCardBlock);
}

// 3. Mobile Left Time Gutter (M2: 50px width, complete hour + AM/PM with zero truncation)
const oldMobileGutter = `<div className="w-[44px] shrink-0 relative border-r border-zinc-200 dark:border-zinc-800 select-none bg-zinc-50/50 dark:bg-zinc-900/60">
                {hoursList.slice(0, -1).map(item => (
                  <div
                    key={item.hour}
                    style={{ height: \`\${HOUR_ROW_HEIGHT}px\` }}
                    className="border-b border-zinc-200 dark:border-zinc-800 flex items-start justify-center pt-1.5 text-[10px] font-mono font-bold text-zinc-400 dark:text-zinc-500"
                  >
                    {item.hour % 12 === 0 ? 12 : item.hour % 12}
                    <span className="text-[8px] font-sans ml-0.5">{item.hour >= 12 ? 'P' : 'A'}</span>
                  </div>
                ))}
              </div>`;

const newMobileGutter = `<div className="w-[50px] shrink-0 relative border-r border-zinc-200 dark:border-zinc-800 select-none bg-zinc-50/50 dark:bg-zinc-900/60">
                {hoursList.slice(0, -1).map(item => (
                  <div
                    key={item.hour}
                    style={{ height: \`\${HOUR_ROW_HEIGHT}px\` }}
                    className="border-b border-zinc-200 dark:border-zinc-800 flex items-start justify-end pr-2 pt-1.5 text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-400"
                  >
                    <span>{item.hour % 12 === 0 ? 12 : item.hour % 12}</span>
                    <span className="text-[8px] font-semibold text-zinc-400 dark:text-zinc-500 ml-0.5">{item.hour >= 12 ? 'PM' : 'AM'}</span>
                  </div>
                ))}
              </div>`;

content = content.replace(oldMobileGutter, newMobileGutter);

// 4. Mobile Bottom Nav Clearance (M3: safe-area padding and bottom spacer)
content = content.replace(
  '<div className="flex md:hidden flex-1 flex-col overflow-y-auto px-3 py-2 pb-24 timetable-print-target">',
  '<div className="flex md:hidden flex-1 flex-col overflow-y-auto px-3 py-2 timetable-print-target" style={{ paddingBottom: "calc(5.5rem + env(safe-area-inset-bottom, 24px))" }}>'
);

// Add bottom clearance spacer at the bottom of mobile card
content = content.replace(
  '            </div>\n\n          </div>\n        </div>\n\n      </div>\n\n      {/* Mobile Bottom Navigation Bar',
  '            </div>\n\n            {/* Bottom Clearance Spacer for Nav Bar */} \n            <div className="h-16 shrink-0" />\n          </div>\n        </div>\n\n      </div>\n\n      {/* Mobile Bottom Navigation Bar'
);

// 5. Sample Hint Banner (M5: compact single line on phone)
const oldSampleBanner = `{/* Sample Schedule Dismissible Hint Banner (P11) */}
        {showSampleHint && courses === DEFAULT_SAMPLE_COURSES && (
          <div className="mx-3 sm:mx-6 mt-2.5 px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 flex items-center justify-between gap-3 animate-in fade-in shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-900 dark:text-white">Sample Timetable:</span>
              <span>This is a sample schedule — add your own classes, or Start empty (Plan Options).</span>
            </div>
            <button
              onClick={() => {
                setShowSampleHint(false);
                try {
                  localStorage.setItem('sample_schedule_hint_dismissed', 'true');
                } catch (e) {}
              }}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer"
              title="Dismiss hint"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}`;

const newSampleBanner = `{/* Sample Schedule Dismissible Hint Banner (P11 & M5: compact single line on phone) */}
        {showSampleHint && courses === DEFAULT_SAMPLE_COURSES && (
          <div className="mx-3 sm:mx-6 mt-2 px-3 py-1.5 sm:py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 flex items-center justify-between gap-2.5 animate-in fade-in shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="hidden sm:flex items-center gap-1.5 truncate">
                <span className="font-bold text-zinc-900 dark:text-white">Sample Timetable:</span>
                <span>This is a sample schedule — add your own classes, or Start empty (Plan Options).</span>
              </div>
              <div className="sm:hidden text-[11px] text-zinc-700 dark:text-zinc-300 truncate">
                <span>Sample schedule — tap ✕ to dismiss, or Start empty via Plan Options</span>
              </div>
            </div>
            <button
              onClick={() => {
                setShowSampleHint(false);
                try {
                  localStorage.setItem('sample_schedule_hint_dismissed', 'true');
                } catch (e) {}
              }}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer shrink-0"
              title="Dismiss hint"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}`;

content = content.replace(oldSampleBanner, newSampleBanner);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Applied responsive typography, time gutter, bottom nav, and sample banner updates.');

