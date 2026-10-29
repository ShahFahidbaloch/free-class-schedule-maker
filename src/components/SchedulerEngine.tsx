import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Download, 
  Printer, 
  Calendar, 
  AlertTriangle, 
  Clock, 
  BookOpen, 
  RotateCcw, 
  Check, 
  ChevronRight,
  Layers
} from 'lucide-react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';

export interface TimeSlot {
  day: DayOfWeek;
  startTime: string; // e.g. "10:00"
  endTime: string;   // e.g. "11:15"
}

export interface Section {
  id: string;
  name: string;
  slots: TimeSlot[];
}

export interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  colorIndex: number;
  sections: Section[];
  selectedSectionId: string;
}

// 5 Preset Apple Pastel Palettes (Linear & Apple Calendar inspired)
export const PASTEL_PALETTES = [
  {
    name: 'Muted Emerald',
    bg: 'bg-emerald-50/90 dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-800/80',
    text: 'text-emerald-900 dark:text-emerald-200',
    sub: 'text-emerald-700/80 dark:text-emerald-400/80',
    dot: 'bg-emerald-500'
  },
  {
    name: 'Soft Sky',
    bg: 'bg-sky-50/90 dark:bg-sky-950/40',
    border: 'border-sky-200 dark:border-sky-800/80',
    text: 'text-sky-900 dark:text-sky-200',
    sub: 'text-sky-700/80 dark:text-sky-400/80',
    dot: 'bg-sky-500'
  },
  {
    name: 'Lilac',
    bg: 'bg-purple-50/90 dark:bg-purple-950/40',
    border: 'border-purple-200 dark:border-purple-800/80',
    text: 'text-purple-900 dark:text-purple-200',
    sub: 'text-purple-700/80 dark:text-purple-400/80',
    dot: 'bg-purple-500'
  },
  {
    name: 'Peach',
    bg: 'bg-orange-50/90 dark:bg-orange-950/40',
    border: 'border-orange-200 dark:border-orange-800/80',
    text: 'text-orange-900 dark:text-orange-200',
    sub: 'text-orange-700/80 dark:text-orange-400/80',
    dot: 'bg-orange-500'
  },
  {
    name: 'Slate',
    bg: 'bg-slate-100/90 dark:bg-zinc-800/60',
    border: 'border-slate-300 dark:border-zinc-700/80',
    text: 'text-slate-900 dark:text-zinc-200',
    sub: 'text-slate-600 dark:text-zinc-400',
    dot: 'bg-slate-500'
  }
];

const DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const DAY_LABELS: Record<DayOfWeek, string> = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday'
};

const START_HOUR = 8;  // 8:00 AM
const END_HOUR = 18;   // 6:00 PM
const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60; // 600 mins

function toMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function formatTime12(timeStr: string): string {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  const displayM = m < 10 ? `0${m}` : m;
  return `${displayH}:${displayM} ${ampm}`;
}

// 2 Pre-Filled Demo Courses as Requested
const DEMO_COURSES: Course[] = [
  {
    id: 'demo-c1',
    code: 'CS 101',
    title: 'Intro to Computer Science',
    credits: 4,
    colorIndex: 0, // Muted Emerald
    selectedSectionId: 'sec-1a',
    sections: [
      {
        id: 'sec-1a',
        name: 'Sec 01 (Morning MWF)',
        slots: [
          { day: 'Mon', startTime: '10:00', endTime: '11:15' },
          { day: 'Wed', startTime: '10:00', endTime: '11:15' },
          { day: 'Fri', startTime: '10:00', endTime: '11:15' }
        ]
      },
      {
        id: 'sec-1b',
        name: 'Sec 02 (Afternoon TTh)',
        slots: [
          { day: 'Tue', startTime: '13:30', endTime: '15:00' },
          { day: 'Thu', startTime: '13:30', endTime: '15:00' }
        ]
      }
    ]
  },
  {
    id: 'demo-c2',
    code: 'Calculus I',
    title: 'Differential Calculus & Modeling',
    credits: 4,
    colorIndex: 1, // Soft Sky
    selectedSectionId: 'sec-2a',
    sections: [
      {
        id: 'sec-2a',
        name: 'Sec 01 (Midday MWF)',
        slots: [
          { day: 'Mon', startTime: '11:30', endTime: '12:45' },
          { day: 'Wed', startTime: '11:30', endTime: '12:45' },
          { day: 'Fri', startTime: '11:30', endTime: '12:45' }
        ]
      },
      {
        id: 'sec-2b',
        name: 'Sec 02 (Morning TTh)',
        slots: [
          { day: 'Tue', startTime: '09:00', endTime: '10:30' },
          { day: 'Thu', startTime: '09:00', endTime: '10:30' }
        ]
      }
    ]
  }
];

export default function SchedulerEngine() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [mobileDay, setMobileDay] = useState<DayOfWeek>('Mon');
  const [banner, setBanner] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const timetableRef = useRef<HTMLDivElement>(null);

  // Initialize from LocalStorage or Load 2-Course Demo
  useEffect(() => {
    try {
      const saved = localStorage.getItem('class_scheduler_notion_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCourses(parsed);
          setSelectedCourseId(parsed[0].id);
          return;
        }
      }
    } catch (e) {
      // ignore
    }
    setCourses(DEMO_COURSES);
    setSelectedCourseId(DEMO_COURSES[0].id);
  }, []);

  // Save changes to LocalStorage
  useEffect(() => {
    if (courses.length > 0) {
      try {
        localStorage.setItem('class_scheduler_notion_v1', JSON.stringify(courses));
      } catch (e) {}
    }
  }, [courses]);

  // Active Selected Course
  const activeCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  // Compute Placed Events on Matrix
  const placedEvents = useMemo(() => {
    const list: Array<{
      courseId: string;
      code: string;
      title: string;
      credits: number;
      colorIndex: number;
      day: DayOfWeek;
      startTime: string;
      endTime: string;
      startMins: number;
      endMins: number;
      topPercent: number;
      heightPercent: number;
    }> = [];

    courses.forEach(course => {
      const activeSection = course.sections.find(s => s.id === course.selectedSectionId);
      if (!activeSection) return;

      activeSection.slots.forEach(slot => {
        const startM = toMinutes(slot.startTime);
        const endM = toMinutes(slot.endTime);
        const dayStartM = START_HOUR * 60; // 480
        const dayEndM = END_HOUR * 60;     // 1080

        const clampedStart = Math.max(dayStartM, startM);
        const clampedEnd = Math.min(dayEndM, endM);

        if (clampedEnd > clampedStart) {
          const topPercent = ((clampedStart - dayStartM) / TOTAL_MINUTES) * 100;
          const heightPercent = ((clampedEnd - clampedStart) / TOTAL_MINUTES) * 100;

          list.push({
            courseId: course.id,
            code: course.code,
            title: course.title,
            credits: course.credits,
            colorIndex: course.colorIndex,
            day: slot.day,
            startTime: slot.startTime,
            endTime: slot.endTime,
            startMins: startM,
            endMins: endM,
            topPercent,
            heightPercent
          });
        }
      });
    });
    return list;
  }, [courses]);

  // Compute Metrics: Total Credits, Idle Gaps, Overlaps
  const metrics = useMemo(() => {
    const totalCredits = courses.reduce((sum, c) => sum + (c.credits || 0), 0);
    let totalGapMinutes = 0;
    let longestGapMinutes = 0;
    let longestGapDay: DayOfWeek | null = null;
    let overlaps = 0;

    DAYS.forEach(day => {
      const daySlots = placedEvents
        .filter(e => e.day === day)
        .sort((a, b) => a.startMins - b.startMins);

      for (let i = 0; i < daySlots.length; i++) {
        // Clash detection
        for (let j = i + 1; j < daySlots.length; j++) {
          if (daySlots[i].endMins > daySlots[j].startMins) {
            overlaps++;
          }
        }

        // Gap calculation
        if (i < daySlots.length - 1) {
          const gap = daySlots[i + 1].startMins - daySlots[i].endMins;
          if (gap > 0) {
            totalGapMinutes += gap;
            if (gap > longestGapMinutes) {
              longestGapMinutes = gap;
              longestGapDay = day;
            }
          }
        }
      }
    });

    const gapHours = (totalGapMinutes / 60).toFixed(1);
    const longestGapHours = (longestGapMinutes / 60).toFixed(1);

    return {
      totalCredits,
      gapHours,
      longestGapMinutes,
      longestGapHours,
      longestGapDay,
      overlaps
    };
  }, [courses, placedEvents]);

  // Add a new Class
  const handleAddClass = () => {
    const newId = `c_${Date.now()}`;
    const newSecId = `s_${Date.now()}`;
    const nextColor = courses.length % PASTEL_PALETTES.length;

    const newCourse: Course = {
      id: newId,
      code: `Course ${courses.length + 1}`,
      title: 'General Elective',
      credits: 3,
      colorIndex: nextColor,
      selectedSectionId: newSecId,
      sections: [
        {
          id: newSecId,
          name: 'Section A (Default)',
          slots: [
            { day: 'Tue', startTime: '14:00', endTime: '15:15' },
            { day: 'Thu', startTime: '14:00', endTime: '15:15' }
          ]
        }
      ]
    };

    setCourses(prev => [...prev, newCourse]);
    setSelectedCourseId(newId);
  };

  // Delete Class
  const handleDeleteClass = (courseId: string) => {
    setCourses(prev => {
      const remaining = prev.filter(c => c.id !== courseId);
      if (selectedCourseId === courseId) {
        setSelectedCourseId(remaining.length > 0 ? remaining[0].id : null);
      }
      return remaining;
    });
  };

  // Add alternative section
  const handleAddSection = (courseId: string) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id !== courseId) return c;
        const newSecId = `sec_${Date.now()}`;
        const letter = String.fromCharCode(65 + c.sections.length);
        const newSec: Section = {
          id: newSecId,
          name: `Section ${letter} (Alternate)`,
          slots: [
            { day: 'Mon', startTime: '13:00', endTime: '14:15' },
            { day: 'Wed', startTime: '13:00', endTime: '14:15' }
          ]
        };
        return { ...c, sections: [...c.sections, newSec] };
      })
    );
  };

  // Delete alternative section
  const handleDeleteSection = (courseId: string, secId: string) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id !== courseId) return c;
        if (c.sections.length <= 1) return c;
        const remaining = c.sections.filter(s => s.id !== secId);
        const nextSelected = c.selectedSectionId === secId ? remaining[0].id : c.selectedSectionId;
        return {
          ...c,
          sections: remaining,
          selectedSectionId: nextSelected
        };
      })
    );
  };

  // Add slot to section
  const handleAddSlot = (courseId: string, secId: string) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          sections: c.sections.map(s => {
            if (s.id !== secId) return s;
            return {
              ...s,
              slots: [...s.slots, { day: 'Fri', startTime: '11:00', endTime: '12:15' }]
            };
          })
        };
      })
    );
  };

  // Remove slot from section
  const handleRemoveSlot = (courseId: string, secId: string, slotIdx: number) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          sections: c.sections.map(s => {
            if (s.id !== secId) return s;
            if (s.slots.length <= 1) return s;
            return {
              ...s,
              slots: s.slots.filter((_, idx) => idx !== slotIdx)
            };
          })
        };
      })
    );
  };

  // Update slot time or day
  const handleUpdateSlot = (
    courseId: string,
    secId: string,
    slotIdx: number,
    field: keyof TimeSlot,
    value: string
  ) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          sections: c.sections.map(s => {
            if (s.id !== secId) return s;
            return {
              ...s,
              slots: s.slots.map((slot, idx) => (idx === slotIdx ? { ...slot, [field]: value } : slot))
            };
          })
        };
      })
    );
  };

  // One-Click Gap Optimizer
  const handleOptimize = () => {
    if (courses.length === 0) return;

    // Cartesian product of sections
    const options = courses.map(c => c.sections.map(s => ({ courseId: c.id, sectionId: s.id, slots: s.slots })));
    function cartesian<T>(arrays: T[][]): T[][] {
      return arrays.reduce<T[][]>((acc, curr) => acc.flatMap(x => curr.map(y => [...x, y])), [[]]);
    }

    const combos = cartesian(options);
    let bestCombo: { courseId: string; sectionId: string }[] | null = null;
    let minPenalty = Infinity;

    for (const combo of combos) {
      const allSlots: { day: DayOfWeek; s: number; e: number }[] = [];
      let clash = false;

      for (const item of combo) {
        for (const slot of item.slots) {
          const s = toMinutes(slot.startTime);
          const e = toMinutes(slot.endTime);

          for (const existing of allSlots) {
            if (existing.day === slot.day) {
              if (Math.max(existing.s, s) < Math.min(existing.e, e)) {
                clash = true;
                break;
              }
            }
          }
          if (clash) break;
          allSlots.push({ day: slot.day, s, e });
        }
        if (clash) break;
      }

      if (clash) continue;

      let totalGaps = 0;
      DAYS.forEach(day => {
        const sorted = allSlots.filter(x => x.day === day).sort((a, b) => a.s - b.s);
        for (let i = 0; i < sorted.length - 1; i++) {
          const gap = sorted[i + 1].s - sorted[i].e;
          if (gap > 0) totalGaps += gap;
        }
      });

      if (totalGaps < minPenalty) {
        minPenalty = totalGaps;
        bestCombo = combo;
      }
    }

    if (bestCombo) {
      setCourses(prev =>
        prev.map(c => {
          const match = bestCombo!.find(b => b.courseId === c.id);
          return match ? { ...c, selectedSectionId: match.sectionId } : c;
        })
      );
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
      setBanner(`Optimized! Found conflict-free timetable with only ${(minPenalty / 60).toFixed(1)}h of idle time.`);
      setTimeout(() => setBanner(null), 5000);
    } else {
      setBanner('No conflict-free combination found. Try adding alternate section options.');
      setTimeout(() => setBanner(null), 5000);
    }
  };

  // Export PNG
  const handleExportPNG = async () => {
    if (!timetableRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(timetableRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: 2
      });
      const a = document.createElement('a');
      a.download = 'weekly-class-schedule.png';
      a.href = dataUrl;
      a.click();
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  // Export .ICS
  const handleExportICS = () => {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ClassScheduleOptimizer//AppleCalendar//EN',
      'CALSCALE:GREGORIAN'
    ];
    const dayMap: Record<DayOfWeek, string> = { Mon: 'MO', Tue: 'TU', Wed: 'WE', Thu: 'TH', Fri: 'FR' };
    const today = new Date();
    const dayIdx = today.getDay();
    const daysUntilMon = (1 + 7 - dayIdx) % 7 || 7;
    const baseMon = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysUntilMon);

    courses.forEach(c => {
      const sec = c.sections.find(s => s.id === c.selectedSectionId);
      if (!sec) return;

      sec.slots.forEach(slot => {
        const offset = DAYS.indexOf(slot.day);
        const evDate = new Date(baseMon.getTime() + offset * 86400000);
        const y = evDate.getFullYear();
        const m = String(evDate.getMonth() + 1).padStart(2, '0');
        const d = String(evDate.getDate()).padStart(2, '0');

        const [sh, sm] = slot.startTime.split(':');
        const [eh, em] = slot.endTime.split(':');

        lines.push('BEGIN:VEVENT');
        lines.push(`SUMMARY:${c.code} - ${c.title}`);
        lines.push(`DTSTART:${y}${m}${d}T${sh}${sm}00`);
        lines.push(`DTEND:${y}${m}${d}T${eh}${em}00`);
        lines.push(`RRULE:FREQ=WEEKLY;BYDAY=${dayMap[slot.day]};COUNT=15`);
        lines.push('BEGIN:VALARM');
        lines.push('TRIGGER:-PT15M');
        lines.push('ACTION:DISPLAY');
        lines.push(`DESCRIPTION:Class Reminder: ${c.code}`);
        lines.push('END:VALARM');
        lines.push('END:VEVENT');
      });
    });

    lines.push('END:VCALENDAR');
    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'college-class-schedule.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Reset demo
  const handleReset = () => {
    if (confirm('Reset to default 2-course demo schedule?')) {
      setCourses(DEMO_COURSES);
      setSelectedCourseId(DEMO_COURSES[0].id);
      localStorage.removeItem('class_scheduler_notion_v1');
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto space-y-6">
      {/* Toast Banner */}
      {banner && (
        <div className="p-4 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-between text-xs sm:text-sm font-medium shadow-md transition-all">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{banner}</span>
          </div>
          <button onClick={() => setBanner(null)} className="text-xs opacity-70 hover:opacity-100">
            Dismiss
          </button>
        </div>
      )}

      {/* Top Action & Metrics Bar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#18181B] border border-slate-200/90 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Live Metrics */}
        <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span className="text-slate-500 dark:text-zinc-400">Total Credits:</span>
            <span className="font-bold text-slate-900 dark:text-white">{metrics.totalCredits}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-slate-500 dark:text-zinc-400">Weekly Gaps:</span>
            <span className="font-bold text-slate-900 dark:text-white">{metrics.gapHours} hrs</span>
          </div>

          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-4 h-4 ${metrics.longestGapMinutes > 90 ? 'text-amber-500' : 'text-slate-400'}`} />
            <span className="text-slate-500 dark:text-zinc-400">Longest Gap:</span>
            <span className={`font-semibold ${metrics.longestGapMinutes > 90 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
              {metrics.longestGapHours}h {metrics.longestGapDay ? `(${metrics.longestGapDay})` : ''}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {metrics.overlaps === 0 ? (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-xs">
                <Check className="w-3.5 h-3.5" /> No Conflicts
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium text-xs">
                <AlertTriangle className="w-3.5 h-3.5" /> {metrics.overlaps} Overlap(s)
              </span>
            )}
          </div>
        </div>

        {/* Buttons Suite */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleOptimize}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-zinc-950 hover:bg-black dark:hover:bg-zinc-100 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all active:scale-98 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Optimize Gaps
          </button>

          <button
            onClick={handleExportPNG}
            disabled={isExporting}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/80 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download high-resolution image"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save PNG</span>
          </button>

          <button
            onClick={handleExportICS}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/80 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Export to Apple Calendar and Google Calendar"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Export .ICS</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/80 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Print clean timetable"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Reset to demo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Two-Column Spacious Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Panel: Course Deck (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#18181B] border border-slate-200/90 dark:border-zinc-800 shadow-sm space-y-6">
            {/* Header + Add Class Button */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800/60">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">Enrolled Classes</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">Click a course tab to edit timings or add alternative sections</p>
              </div>

              <button
                onClick={handleAddClass}
                className="px-3.5 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-zinc-950 hover:bg-black dark:hover:bg-zinc-100 text-xs font-medium flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                + Add Class
              </button>
            </div>

            {/* Course Selector Tabs */}
            <div className="flex flex-wrap gap-2">
              {courses.map(course => {
                const palette = PASTEL_PALETTES[course.colorIndex % PASTEL_PALETTES.length];
                const isSelected = activeCourse && course.id === activeCourse.id;
                return (
                  <button
                    key={course.id}
                    onClick={() => setSelectedCourseId(course.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 border transition-all cursor-pointer ${
                      isSelected
                        ? `${palette.bg} ${palette.border} ${palette.text} shadow-xs font-semibold`
                        : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${palette.dot}`}></span>
                    <span>{course.code || 'Untitled'}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Class Form */}
            {activeCourse && (
              <div className="space-y-5 pt-2">
                <div className="p-4 sm:p-5 rounded-xl bg-slate-50/80 dark:bg-zinc-900/50 border border-slate-200/80 dark:border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600 dark:text-zinc-300 uppercase tracking-wider">
                      Course Parameters
                    </span>
                    {courses.length > 1 && (
                      <button
                        onClick={() => handleDeleteClass(activeCourse.id)}
                        className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Class
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1.5">
                        Course Code
                      </label>
                      <input
                        type="text"
                        value={activeCourse.code}
                        onChange={e => {
                          const val = e.target.value;
                          setCourses(prev => prev.map(c => (c.id === activeCourse.id ? { ...c, code: val } : c)));
                        }}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
                        placeholder="e.g. CS 101"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1.5">
                        Credits
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="8"
                        value={activeCourse.credits}
                        onChange={e => {
                          const val = Number(e.target.value);
                          setCourses(prev => prev.map(c => (c.id === activeCourse.id ? { ...c, credits: val } : c)));
                        }}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1.5">
                      Course Title
                    </label>
                    <input
                      type="text"
                      value={activeCourse.title}
                      onChange={e => {
                        const val = e.target.value;
                        setCourses(prev => prev.map(c => (c.id === activeCourse.id ? { ...c, title: val } : c)));
                      }}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
                      placeholder="e.g. Differential Calculus"
                    />
                  </div>

                  {/* 5 Preset Apple Pastel Pill Colors */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-2">
                      Color Tag
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      {PASTEL_PALETTES.map((pal, idx) => {
                        const isChosen = activeCourse.colorIndex % PASTEL_PALETTES.length === idx;
                        return (
                          <button
                            key={pal.name}
                            type="button"
                            onClick={() => {
                              setCourses(prev =>
                                prev.map(c => (c.id === activeCourse.id ? { ...c, colorIndex: idx } : c))
                              );
                            }}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${pal.bg} ${pal.border} ${pal.text} ${
                              isChosen ? 'ring-2 ring-slate-900 dark:ring-white font-semibold' : 'opacity-70 hover:opacity-100'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${pal.dot}`}></span>
                            <span>{pal.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Alternative Section Slots */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Section Timings & Alternatives</h4>
                      <p className="text-[11px] text-slate-500">Pick which section is active, or let the Gap Optimizer decide</p>
                    </div>
                    <button
                      onClick={() => handleAddSection(activeCourse.id)}
                      className="text-xs font-medium text-slate-900 dark:text-white hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Section Option
                    </button>
                  </div>

                  {activeCourse.sections.map((section, secIdx) => {
                    const isSelectedSec = activeCourse.selectedSectionId === section.id;
                    return (
                      <div
                        key={section.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isSelectedSec
                            ? 'bg-slate-50 dark:bg-zinc-900/60 border-slate-900 dark:border-white shadow-2xs'
                            : 'bg-white dark:bg-zinc-900/20 border-slate-200 dark:border-zinc-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`section_${activeCourse.id}`}
                              checked={isSelectedSec}
                              onChange={() => {
                                setCourses(prev =>
                                  prev.map(c => (c.id === activeCourse.id ? { ...c, selectedSectionId: section.id } : c))
                                );
                              }}
                              className="text-slate-900 focus:ring-0 cursor-pointer"
                              id={`sec_radio_${section.id}`}
                            />
                            <label htmlFor={`sec_radio_${section.id}`} className="text-xs font-semibold text-slate-900 dark:text-white cursor-pointer">
                              {section.name}
                            </label>
                            {isSelectedSec && (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-white dark:bg-white dark:text-zinc-950 font-medium">
                                Active on Grid
                              </span>
                            )}
                          </div>

                          {activeCourse.sections.length > 1 && (
                            <button
                              onClick={() => handleDeleteSection(activeCourse.id, section.id)}
                              className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                              title="Delete alternative section"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Slots */}
                        <div className="space-y-2">
                          {section.slots.map((slot, sIdx) => (
                            <div key={sIdx} className="grid grid-cols-12 gap-2 items-center">
                              <div className="col-span-4">
                                <select
                                  value={slot.day}
                                  onChange={e => handleUpdateSlot(activeCourse.id, section.id, sIdx, 'day', e.target.value)}
                                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white cursor-pointer"
                                >
                                  {DAYS.map(d => (
                                    <option key={d} value={d}>
                                      {DAY_LABELS[d]}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="col-span-3">
                                <input
                                  type="time"
                                  value={slot.startTime}
                                  onChange={e => handleUpdateSlot(activeCourse.id, section.id, sIdx, 'startTime', e.target.value)}
                                  className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white font-mono"
                                />
                              </div>

                              <div className="col-span-1 text-center text-slate-400 text-xs">-</div>

                              <div className="col-span-3">
                                <input
                                  type="time"
                                  value={slot.endTime}
                                  onChange={e => handleUpdateSlot(activeCourse.id, section.id, sIdx, 'endTime', e.target.value)}
                                  className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white font-mono"
                                />
                              </div>

                              <div className="col-span-1 text-center">
                                {section.slots.length > 1 && (
                                  <button
                                    onClick={() => handleRemoveSlot(activeCourse.id, section.id, sIdx)}
                                    className="text-slate-400 hover:text-rose-500 cursor-pointer"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-zinc-800/60 flex justify-end">
                          <button
                            onClick={() => handleAddSlot(activeCourse.id, section.id)}
                            className="text-[11px] text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" /> Add recurring class day
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Spacious Visual Matrix (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Mobile Day Selector Tabs */}
          <div className="flex md:hidden items-center justify-between p-1 rounded-xl bg-white dark:bg-[#18181B] border border-slate-200 dark:border-zinc-800">
            {DAYS.map(day => (
              <button
                key={day}
                onClick={() => setMobileDay(day)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  mobileDay === day
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-zinc-950'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Grid Card */}
          <div
            ref={timetableRef}
            className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#18181B] border border-slate-200/90 dark:border-zinc-800 shadow-sm timetable-print-target overflow-hidden"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800/80 mb-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">Weekly Visual Timetable</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">8:00 AM to 6:00 PM • Clear campus hours</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Viewing Load:</span>{' '}
                <span className="text-xs font-bold text-slate-900 dark:text-white">{metrics.totalCredits} Credit Hours</span>
              </div>
            </div>

            {/* Matrix Viewport */}
            <div className="relative overflow-x-auto">
              <div className="min-w-[580px] md:min-w-0">
                {/* Day Headers */}
                <div className="grid grid-cols-11 border-b border-slate-200 dark:border-zinc-800 pb-2.5 mb-2">
                  <div className="col-span-1 text-[11px] font-medium text-slate-400 text-center">Time</div>
                  {DAYS.map(d => (
                    <div
                      key={d}
                      className={`col-span-2 text-center text-xs font-semibold ${
                        mobileDay === d ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-600 dark:text-zinc-400'
                      }`}
                    >
                      {DAY_LABELS[d]}
                    </div>
                  ))}
                </div>

                {/* Grid Canvas: 8 AM to 6 PM (10 Hours, 620px height) */}
                <div className="relative h-[620px] grid grid-cols-11 select-none">
                  {/* Left Column: Hour Markings */}
                  <div className="col-span-1 relative border-r border-slate-100 dark:border-zinc-800/60">
                    {Array.from({ length: END_HOUR - START_HOUR + 1 }).map((_, idx) => {
                      const hour = START_HOUR + idx;
                      const topPercent = (idx / (END_HOUR - START_HOUR)) * 100;
                      const displayH = hour % 12 === 0 ? 12 : hour % 12;
                      const ampm = hour >= 12 ? 'PM' : 'AM';
                      return (
                        <div
                          key={hour}
                          style={{ top: `${topPercent}%` }}
                          className="absolute -translate-y-2 left-0 right-1.5 text-right text-[10px] text-slate-400 font-mono"
                        >
                          {displayH} {ampm}
                        </div>
                      );
                    })}
                  </div>

                  {/* Day Columns */}
                  <div className="col-span-10 grid grid-cols-5 relative h-full">
                    {/* Hour Lines */}
                    {Array.from({ length: END_HOUR - START_HOUR + 1 }).map((_, idx) => {
                      const topPercent = (idx / (END_HOUR - START_HOUR)) * 100;
                      return (
                        <div
                          key={idx}
                          style={{ top: `${topPercent}%` }}
                          className="absolute left-0 right-0 border-t border-slate-100 dark:border-zinc-800/40 pointer-events-none"
                        />
                      );
                    })}

                    {/* Columns */}
                    {DAYS.map(day => {
                      const dayEvents = placedEvents.filter(e => e.day === day);
                      return (
                        <div
                          key={day}
                          className={`relative h-full border-r border-slate-100 dark:border-zinc-800/60 last:border-r-0 ${
                            mobileDay === day ? 'bg-slate-50/40 dark:bg-zinc-900/20' : ''
                          }`}
                        >
                          {dayEvents.map(event => {
                            const palette = PASTEL_PALETTES[event.colorIndex % PASTEL_PALETTES.length];
                            return (
                              <div
                                key={`${event.courseId}-${event.day}-${event.startTime}`}
                                style={{
                                  top: `${event.topPercent}%`,
                                  height: `${event.heightPercent}%`
                                }}
                                onClick={() => setSelectedCourseId(event.courseId)}
                                className={`absolute inset-x-1.5 p-2.5 rounded-xl border transition-all cursor-pointer shadow-2xs hover:shadow-md hover:z-20 overflow-hidden flex flex-col justify-between ${palette.bg} ${palette.border} ${palette.text}`}
                              >
                                <div className="leading-tight">
                                  <div className="flex items-center justify-between gap-1 mb-0.5">
                                    <span className="font-bold text-xs tracking-tight truncate">{event.code}</span>
                                    <span className="text-[10px] font-mono opacity-80">{event.credits}cr</span>
                                  </div>
                                  <div className="text-[11px] truncate opacity-90">{event.title}</div>
                                </div>
                                <div className={`text-[10px] font-mono ${palette.sub} pt-1 flex items-center justify-between`}>
                                  <span>{formatTime12(event.startTime)}</span>
                                  <span>{formatTime12(event.endTime)}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
