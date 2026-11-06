import React, { useState, useEffect } from 'react';
import { 
  type Course, 
  type DayOfWeek, 
  APPLE_TAG_PALETTES, 
  formatClassTimeRange,
  parseFlexibleTime,
  VALID_DAYS,
  normalizeDayOfWeek
} from './AcademicStudioApp';
import { MAJOR_PRESETS } from '../data/schedulePresets';
import { Clock, MapPin, Calendar, ExternalLink } from 'lucide-react';

const CALENDAR_START_HOUR = 8;
const CALENDAR_END_HOUR = 20;
const HOUR_ROW_HEIGHT = 64;

export default function EmbedScheduleView() {
  const [courses, setCourses] = useState<Course[]>(MAJOR_PRESETS['computer-science'].courses);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeDay, setActiveDay] = useState<DayOfWeek>('Mon');
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsNarrow(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    try {
      const hash = window.location.hash || '';
      const search = window.location.search || '';
      let rawData: string | null = null;

      if (hash.includes('plan=')) {
        rawData = hash.split('plan=')[1]?.split('&')[0];
      } else if (hash.includes('share=')) {
        rawData = hash.split('share=')[1]?.split('&')[0];
      } else if (search.includes('plan=')) {
        rawData = new URLSearchParams(search).get('plan');
      } else if (search.includes('share=')) {
        rawData = new URLSearchParams(search).get('share');
      }

      if (rawData) {
        const decoded = decodeURIComponent(escape(atob(decodeURIComponent(rawData))));
        const parsed = JSON.parse(decoded);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Reconstruct standard courses
          const reconstructed: Course[] = parsed.map((item: any, idx: number) => {
            const code = item.c || item.code || `CLASS ${idx + 1}`;
            const title = item.t || item.title || '';
            const credits = Number(item.cr ?? item.credits ?? 3);
            const colorIndex = Number(item.cl ?? item.colorIndex ?? idx);
            const rawSections = item.s || item.sections || [];
            const sections = rawSections.map((s: any, sIdx: number) => ({
              id: `sec-${idx}-${sIdx}`,
              name: `Section 0${sIdx + 1}`,
              days: (s.d || s.days || []).map((d: string) => normalizeDayOfWeek(d)).filter(Boolean) as DayOfWeek[],
              startTime: s.st || s.startTime || '09:00 AM',
              endTime: s.et || s.endTime || '10:15 AM',
              room: s.r || s.room || 'Campus'
            }));
            return {
              id: `course-${idx}`,
              code,
              title,
              credits,
              colorIndex,
              selectedSectionId: sections[0]?.id || `sec-${idx}-0`,
              sections
            };
          });
          setCourses(reconstructed);
        }
      }
    } catch (e) {
      console.warn('Could not parse shared embed schedule, using default.');
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const activeDaysList: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const calendarStartMins = CALENDAR_START_HOUR * 60;
  const calendarEndMins = CALENDAR_END_HOUR * 60;
  const totalGridHeight = (CALENDAR_END_HOUR - CALENDAR_START_HOUR) * HOUR_ROW_HEIGHT;

  const hoursList = [];
  for (let h = CALENDAR_START_HOUR; h <= CALENDAR_END_HOUR; h++) {
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    hoursList.push({
      hour: h,
      label: `${displayH}:00 ${ampm}`
    });
  }

  // Map events to days
  const eventsByDay: Record<DayOfWeek, any[]> = {
    Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: []
  };

  courses.forEach(course => {
    const sec = course.sections.find(s => s.id === course.selectedSectionId) || course.sections[0];
    if (!sec) return;

    sec.days.forEach(d => {
      const normDay = normalizeDayOfWeek(d);
      if (!normDay || !eventsByDay[normDay]) return;

      const startM = parseFlexibleTime(sec.startTime);
      const endM = parseFlexibleTime(sec.endTime);
      const clampedStart = Math.max(calendarStartMins, startM);
      const clampedEnd = Math.min(calendarEndMins, endM);

      if (clampedEnd > clampedStart) {
        const topPx = ((clampedStart - calendarStartMins) / 60) * HOUR_ROW_HEIGHT;
        const dur = clampedEnd - clampedStart;
        const heightPx = Math.max((dur / 60) * HOUR_ROW_HEIGHT, 40);

        eventsByDay[normDay].push({
          id: `${course.id}-${normDay}`,
          code: course.code,
          title: course.title,
          credits: course.credits,
          room: sec.room,
          colorIndex: course.colorIndex,
          startTime: sec.startTime,
          endTime: sec.endTime,
          startMins: startM,
          endMins: endM,
          topPx,
          heightPx
        });
      }
    });
  });

  const totalCredits = courses.reduce((sum, c) => sum + (c.credits || 0), 0);

  return (
    <div className="w-full h-full min-h-screen bg-[#FBFBFD] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans p-2 sm:p-4 flex flex-col justify-between">
      <div>
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-zinc-950 dark:text-white">
              Class Schedule
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono font-semibold">
              {totalCredits} Credits
            </span>
          </div>
          <a
            href="https://freeclassschedule.com/app"
            target="_blank"
            rel="noopener"
            className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white flex items-center gap-1 transition"
          >
            <span>Open in Studio</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Mobile Day Tabs */}
        {isNarrow && (
          <div className="flex items-center gap-1 mb-3">
            {activeDaysList.map(d => (
              <button
                key={d}
                type="button"
                onClick={() => setActiveDay(d)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                  activeDay === d
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                    : 'bg-zinc-100 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        )}

        {/* Grid Canvas */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] shadow-xs overflow-hidden">
          {/* Day Headers */}
          {!isNarrow && (
            <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
              <div className="w-14 shrink-0 border-r border-zinc-200 dark:border-zinc-800 py-2 text-center text-[10px] font-mono font-bold text-zinc-500">
                TIME
              </div>
              <div className="flex-1 grid grid-cols-5">
                {activeDaysList.map(day => (
                  <div key={day} className="py-2 text-center border-r border-zinc-200 dark:border-zinc-800 last:border-r-0 text-xs font-bold">
                    {day}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Body */}
          <div className="relative flex" style={{ height: `${totalGridHeight}px` }}>
            {/* Time gutter */}
            <div className="w-14 shrink-0 relative border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 select-none">
              {hoursList.slice(0, -1).map(h => (
                <div
                  key={h.hour}
                  style={{ height: `${HOUR_ROW_HEIGHT}px` }}
                  className="border-b border-zinc-200 dark:border-zinc-800 pr-2 pt-1 text-[10px] font-mono text-zinc-400 text-right"
                >
                  {h.label.split(' ')[0]}
                </div>
              ))}
            </div>

            {/* Event Columns */}
            <div className="flex-1 relative h-full">
              {/* Hour Lines */}
              <div className="absolute inset-0 pointer-events-none select-none">
                {hoursList.slice(0, -1).map(h => (
                  <div key={h.hour} style={{ height: `${HOUR_ROW_HEIGHT}px` }} className="border-b border-zinc-100 dark:border-zinc-800/60" />
                ))}
              </div>

              {/* Columns */}
              <div className={`grid h-full relative ${isNarrow ? 'grid-cols-1' : 'grid-cols-5'}`}>
                {(isNarrow ? [activeDay] : activeDaysList).map(day => (
                  <div key={day} className="relative h-full border-r border-zinc-200 dark:border-zinc-800 last:border-r-0">
                    {eventsByDay[day].map(ev => {
                      const pal = APPLE_TAG_PALETTES[ev.colorIndex % APPLE_TAG_PALETTES.length];
                      return (
                        <div
                          key={ev.id}
                          style={{
                            top: `${ev.topPx}px`,
                            height: `${ev.heightPx}px`,
                            left: '4px',
                            width: 'calc(100% - 8px)'
                          }}
                          className={`absolute rounded-xl border p-2 overflow-hidden flex flex-col justify-between ${pal.cardBg} ${pal.cardBorder} border-l-4 ${pal.leftBar}`}
                        >
                          <div>
                            <div className={`font-bold text-xs ${pal.textCode}`}>{ev.code}</div>
                            {ev.title && <div className={`text-[10px] font-medium leading-tight ${pal.textTitle}`}>{ev.title}</div>}
                            {ev.room && (
                              <div className={`text-[9px] font-mono flex items-center gap-1 mt-0.5 opacity-80 ${pal.textMeta}`}>
                                <MapPin className="w-2.5 h-2.5 shrink-0" />
                                <span>{ev.room}</span>
                              </div>
                            )}
                          </div>
                          <div className={`text-[9px] font-mono font-semibold pt-0.5 flex items-center gap-1 border-t border-black/5 dark:border-white/10 ${pal.textMeta}`}>
                            <Clock className="w-2.5 h-2.5 shrink-0" />
                            <span>{formatClassTimeRange(ev.startTime, ev.endTime)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Powered by Link (Followable SEO Backlink for Part B-4) */}
      <footer className="pt-3 pb-1 text-center">
        <a
          href="https://freeclassschedule.com"
          target="_blank"
          rel="noopener"
          className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition font-medium inline-flex items-center gap-1.5"
        >
          <span>Powered by</span>
          <strong class="font-bold underline text-zinc-900 dark:text-white">FreeClassSchedule.com</strong>
          <span>— Free Online Timetable Studio</span>
        </a>
      </footer>
    </div>
  );
}

