import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Download, 
  Printer, 
  Calendar, 
  Clock, 
  BookOpen, 
  RotateCcw, 
  Check, 
  MapPin,
  AlertCircle,
  Layers,
  ChevronDown,
  Share2
} from 'lucide-react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';

export interface TimeSlot {
  day: DayOfWeek;
  startTime: string; // "10:00"
  endTime: string;   // "11:15"
}

export interface Section {
  id: string;
  name: string;
  room: string;
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

// 5 Sophisticated Muted Apple/Google Calendar Palettes with border-l-4
export const SOPHISTICATED_PALETTES = [
  {
    name: 'Muted Navy',
    card: 'bg-blue-50/90 text-blue-950 border-l-blue-600 border border-blue-200/70 dark:bg-blue-950/40 dark:text-blue-100 dark:border-l-blue-500 dark:border-blue-900/60',
    tag: 'bg-blue-100 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700',
    accent: 'bg-blue-600',
    timeText: 'text-blue-700 dark:text-blue-300'
  },
  {
    name: 'Soft Forest',
    card: 'bg-emerald-50/90 text-emerald-950 border-l-emerald-600 border border-emerald-200/70 dark:bg-emerald-950/40 dark:text-emerald-100 dark:border-l-emerald-500 dark:border-emerald-900/60',
    tag: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700',
    accent: 'bg-emerald-600',
    timeText: 'text-emerald-700 dark:text-emerald-300'
  },
  {
    name: 'Warm Clay',
    card: 'bg-amber-50/90 text-amber-950 border-l-amber-600 border border-amber-200/70 dark:bg-amber-950/40 dark:text-amber-100 dark:border-l-amber-500 dark:border-amber-900/60',
    tag: 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700',
    accent: 'bg-amber-600',
    timeText: 'text-amber-700 dark:text-amber-300'
  },
  {
    name: 'Pale Amethyst',
    card: 'bg-purple-50/90 text-purple-950 border-l-purple-600 border border-purple-200/70 dark:bg-purple-950/40 dark:text-purple-100 dark:border-l-purple-500 dark:border-purple-900/60',
    tag: 'bg-purple-100 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-700',
    accent: 'bg-purple-600',
    timeText: 'text-purple-700 dark:text-purple-300'
  },
  {
    name: 'Apple Slate',
    card: 'bg-zinc-100 text-zinc-900 border-l-zinc-600 border border-zinc-300/70 dark:bg-zinc-800/80 dark:text-zinc-100 dark:border-l-zinc-400 dark:border-zinc-700/60',
    tag: 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-200 border-zinc-400 dark:border-zinc-600',
    accent: 'bg-zinc-600',
    timeText: 'text-zinc-700 dark:text-zinc-300'
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
const END_HOUR = 19;   // 7:00 PM (11 hours total)
const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60; // 660 mins

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

// 2 Pre-Filled Real Demo Courses
const DEMO_COURSES: Course[] = [
  {
    id: 'demo-cs101',
    code: 'CS 101',
    title: 'Programming Foundations',
    credits: 4,
    colorIndex: 0, // Muted Navy
    selectedSectionId: 'sec-cs101-a',
    sections: [
      {
        id: 'sec-cs101-a',
        name: 'Section 01 (Morning MWF)',
        room: 'Turing Hall 102',
        slots: [
          { day: 'Mon', startTime: '10:00', endTime: '11:15' },
          { day: 'Wed', startTime: '10:00', endTime: '11:15' },
          { day: 'Fri', startTime: '10:00', endTime: '11:15' }
        ]
      },
      {
        id: 'sec-cs101-b',
        name: 'Section 02 (Afternoon TTh)',
        room: 'Gates Building 204',
        slots: [
          { day: 'Tue', startTime: '13:30', endTime: '15:00' },
          { day: 'Thu', startTime: '13:30', endTime: '15:00' }
        ]
      }
    ]
  },
  {
    id: 'demo-math21',
    code: 'MATH 21',
    title: 'Calculus & Analytical Geometry',
    credits: 4,
    colorIndex: 1, // Soft Forest
    selectedSectionId: 'sec-math21-a',
    sections: [
      {
        id: 'sec-math21-a',
        name: 'Section 01 (Midday MWF)',
        room: 'Science Quad 304',
        slots: [
          { day: 'Mon', startTime: '11:30', endTime: '12:45' },
          { day: 'Wed', startTime: '11:30', endTime: '12:45' },
          { day: 'Fri', startTime: '11:30', endTime: '12:45' }
        ]
      },
      {
        id: 'sec-math21-b',
        name: 'Section 02 (Morning TTh)',
        room: 'Math Corner 110',
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
      const saved = localStorage.getItem('schedule_os_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCourses(parsed);
          setSelectedCourseId(parsed[0].id);
          return;
        }
      }
    } catch (e) {}
    setCourses(DEMO_COURSES);
    setSelectedCourseId(DEMO_COURSES[0].id);
  }, []);

  // Save changes to LocalStorage
  useEffect(() => {
    if (courses.length > 0) {
      try {
        localStorage.setItem('schedule_os_v1', JSON.stringify(courses));
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
      room: string;
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
        const dayEndM = END_HOUR * 60;     // 1140

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
            room: activeSection.room || 'Main Hall',
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
    const nextColor = courses.length % SOPHISTICATED_PALETTES.length;

    const newCourse: Course = {
      id: newId,
      code: `PHYS 41`,
      title: 'Mechanics & Relativity',
      credits: 4,
      colorIndex: nextColor,
      selectedSectionId: newSecId,
      sections: [
        {
          id: newSecId,
          name: 'Section 01 (Regular)',
          room: 'Hewlett 200',
          slots: [
            { day: 'Tue', startTime: '11:00', endTime: '12:30' },
            { day: 'Thu', startTime: '11:00', endTime: '12:30' }
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
          room: 'Main Campus 101',
          slots: [
            { day: 'Tue', startTime: '14:00', endTime: '15:15' },
            { day: 'Thu', startTime: '14:00', endTime: '15:15' }
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
              slots: [...s.slots, { day: 'Fri', startTime: '13:00', endTime: '14:15' }]
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

  // Update room
  const handleUpdateRoom = (courseId: string, secId: string, room: string) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          sections: c.sections.map(s => (s.id === secId ? { ...s, room } : s))
        };
      })
    );
  };

  // One-Click Gap Optimizer
  const handleOptimize = () => {
    if (courses.length === 0) return;

    const options = courses.map(c => c.sections.map(s => ({ courseId: c.id, sectionId: s.id, slots: s.slots })));
    function cartesian<T>(arrays: T[][]): T[][] {
      return arrays.reduce<T[][]>((acc, curr) => acc.flatMap(x => curr.map(y => [...x, y])), [[]]);
    }

    const combos = cartesian(options);
    let bestCombo: { courseId: string; sectionId: string }[] | null = null;
    let minGaps = Infinity;

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

      if (totalGaps < minGaps) {
        minGaps = totalGaps;
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
        confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
      setBanner(`Optimized! Found conflict-free timetable with ${(minGaps / 60).toFixed(1)}h total idle time.`);
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
      a.download = 'timetable-os-schedule.png';
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
      'PRODID:-//TimetableOS//DesktopCalendar//EN',
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
        lines.push(`LOCATION:${sec.room}`);
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
    a.download = 'academic-schedule.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Reset demo
  const handleReset = () => {
    if (confirm('Reset schedule to default demonstration courses?')) {
      setCourses(DEMO_COURSES);
      setSelectedCourseId(DEMO_COURSES[0].id);
      localStorage.removeItem('schedule_os_v1');
    }
  };

  return (
    <div id="scheduler" class="w-full max-w-7xl mx-auto space-y-6">
      {/* Toast Alert Banner */}
      {banner && (
        <div className="p-4 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-between text-xs sm:text-sm font-medium shadow-md transition-all">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{banner}</span>
          </div>
          <button onClick={() => setBanner(null)} className="text-xs opacity-75 hover:opacity-100 cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Control Console & Metrics Toolbar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Metrics Bar */}
        <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-zinc-400" />
            <span className="text-zinc-500 dark:text-zinc-400">Total Credits:</span>
            <span className="font-bold text-zinc-900 dark:text-white font-mono">{metrics.totalCredits}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-zinc-400" />
            <span className="text-zinc-500 dark:text-zinc-400">Idle Gaps:</span>
            <span className="font-bold text-zinc-900 dark:text-white font-mono">{metrics.gapHours} hrs</span>
          </div>

          <div className="flex items-center gap-2">
            <AlertCircle className={`w-4 h-4 ${metrics.longestGapMinutes > 90 ? 'text-amber-500' : 'text-zinc-400'}`} />
            <span className="text-zinc-500 dark:text-zinc-400">Longest Gap:</span>
            <span className={`font-semibold font-mono ${metrics.longestGapMinutes > 90 ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-900 dark:text-white'}`}>
              {metrics.longestGapHours}h {metrics.longestGapDay ? `(${metrics.longestGapDay})` : ''}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {metrics.overlaps === 0 ? (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                <Check className="w-3.5 h-3.5" /> 0 Conflicts
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold text-xs">
                <AlertCircle className="w-3.5 h-3.5" /> {metrics.overlaps} Overlap(s)
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleOptimize}
            className="h-10 px-4 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 text-xs font-semibold flex items-center gap-2 shadow-xs transition active:scale-98 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Optimize Gaps
          </button>

          <button
            onClick={handleExportPNG}
            disabled={isExporting}
            className="h-10 px-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
            title="Download high-resolution wallpaper"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save PNG</span>
          </button>

          <button
            id="action-export-ics"
            onClick={handleExportICS}
            className="h-10 px-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
            title="Export to Apple Calendar and Google Calendar"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Export .ICS</span>
          </button>

          <button
            onClick={handleReset}
            className="h-10 w-10 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
            title="Reset to default demonstration"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Two-Column Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Panel: Course Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            
            {/* Header + Add Class Button */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white tracking-tight">Enrolled Courses</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Configure sections and lecture timings</p>
              </div>

              <button
                onClick={handleAddClass}
                className="h-9 px-3 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Class
              </button>
            </div>

            {/* Course Selector Tabs */}
            <div className="flex flex-wrap gap-2">
              {courses.map(course => {
                const palette = SOPHISTICATED_PALETTES[course.colorIndex % SOPHISTICATED_PALETTES.length];
                const isSelected = activeCourse && course.id === activeCourse.id;
                return (
                  <button
                    key={course.id}
                    onClick={() => setSelectedCourseId(course.id)}
                    className={`h-9 px-3.5 rounded-lg text-xs font-medium flex items-center gap-2 border transition cursor-pointer ${
                      isSelected
                        ? `${palette.tag} shadow-xs font-semibold`
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/40'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${palette.accent}`}></span>
                    <span>{course.code || 'Untitled'}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Class Form Fields */}
            {activeCourse && (
              <div className="space-y-5 pt-1">
                <div className="p-5 rounded-xl bg-zinc-50/60 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                      Course Parameters
                    </span>
                    {courses.length > 1 && (
                      <button
                        onClick={() => handleDeleteClass(activeCourse.id)}
                        className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Class
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Course Code
                      </label>
                      <input
                        type="text"
                        value={activeCourse.code}
                        onChange={e => {
                          const val = e.target.value;
                          setCourses(prev => prev.map(c => (c.id === activeCourse.id ? { ...c, code: val } : c)));
                        }}
                        className="w-full h-10 px-3 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition"
                        placeholder="e.g. CS 101"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
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
                        className="w-full h-10 px-3 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Course Title
                    </label>
                    <input
                      type="text"
                      value={activeCourse.title}
                      onChange={e => {
                        const val = e.target.value;
                        setCourses(prev => prev.map(c => (c.id === activeCourse.id ? { ...c, title: val } : c)));
                      }}
                      className="w-full h-10 px-3 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition"
                      placeholder="e.g. Programming Foundations"
                    />
                  </div>

                  {/* Sophisticated Palette Color Picker */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Calendar Style Accent
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      {SOPHISTICATED_PALETTES.map((pal, idx) => {
                        const isChosen = activeCourse.colorIndex % SOPHISTICATED_PALETTES.length === idx;
                        return (
                          <button
                            key={pal.name}
                            type="button"
                            onClick={() => {
                              setCourses(prev =>
                                prev.map(c => (c.id === activeCourse.id ? { ...c, colorIndex: idx } : c))
                              );
                            }}
                            className={`h-8 px-3 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${pal.tag} ${
                              isChosen ? 'ring-2 ring-zinc-950 dark:ring-white font-semibold' : 'opacity-70 hover:opacity-100'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${pal.accent}`}></span>
                            <span>{pal.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Section Timing Options */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-900 dark:text-white">Section Timings</h4>
                      <p className="text-[11px] text-zinc-500">Add alternative sections to calculate optimal combinations</p>
                    </div>
                    <button
                      onClick={() => handleAddSection(activeCourse.id)}
                      className="text-xs font-medium text-zinc-900 dark:text-white hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Section
                    </button>
                  </div>

                  {activeCourse.sections.map((section, secIdx) => {
                    const isSelectedSec = activeCourse.selectedSectionId === section.id;
                    return (
                      <div
                        key={section.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isSelectedSec
                            ? 'bg-zinc-50/80 dark:bg-zinc-800/60 border-zinc-900 dark:border-white shadow-2xs'
                            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
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
                              className="text-zinc-950 focus:ring-0 cursor-pointer"
                              id={`sec_radio_${section.id}`}
                            />
                            <label htmlFor={`sec_radio_${section.id}`} className="text-xs font-semibold text-zinc-900 dark:text-white cursor-pointer">
                              {section.name}
                            </label>
                            {isSelectedSec && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-mono font-medium">
                                Active
                              </span>
                            )}
                          </div>

                          {activeCourse.sections.length > 1 && (
                            <button
                              onClick={() => handleDeleteSection(activeCourse.id, section.id)}
                              className="text-zinc-400 hover:text-rose-500 transition cursor-pointer"
                              title="Delete alternative section"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Room input */}
                        <div className="mb-3">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-zinc-400" />
                            <input
                              type="text"
                              value={section.room || ''}
                              onChange={e => handleUpdateRoom(activeCourse.id, section.id, e.target.value)}
                              placeholder="Hall / Room (e.g. Turing Hall 102)"
                              className="w-full text-xs bg-transparent border-b border-zinc-200 dark:border-zinc-700 py-1 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                            />
                          </div>
                        </div>

                        {/* Slots */}
                        <div className="space-y-2">
                          {section.slots.map((slot, sIdx) => (
                            <div key={sIdx} className="grid grid-cols-12 gap-2 items-center">
                              <div className="col-span-4">
                                <select
                                  value={slot.day}
                                  onChange={e => handleUpdateSlot(activeCourse.id, section.id, sIdx, 'day', e.target.value)}
                                  className="w-full h-8 px-2 text-xs rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white cursor-pointer"
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
                                  className="w-full h-8 px-2 text-xs rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono"
                                />
                              </div>

                              <div className="col-span-1 text-center text-zinc-400 text-xs">-</div>

                              <div className="col-span-3">
                                <input
                                  type="time"
                                  value={slot.endTime}
                                  onChange={e => handleUpdateSlot(activeCourse.id, section.id, sIdx, 'endTime', e.target.value)}
                                  className="w-full h-8 px-2 text-xs rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono"
                                />
                              </div>

                              <div className="col-span-1 text-center">
                                {section.slots.length > 1 && (
                                  <button
                                    onClick={() => handleRemoveSlot(activeCourse.id, section.id, sIdx)}
                                    className="text-zinc-400 hover:text-rose-500 cursor-pointer font-bold"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                          <button
                            onClick={() => handleAddSlot(activeCourse.id, section.id)}
                            className="text-[11px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-medium flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" /> Add day
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

        {/* Right Panel: Spacious Visual Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Mobile Day Selector Tabs */}
          <div className="flex md:hidden items-center justify-between p-1 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            {DAYS.map(day => (
              <button
                key={day}
                onClick={() => setMobileDay(day)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  mobileDay === day
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Real Desktop Calendar Matrix */}
          <div
            ref={timetableRef}
            className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm timetable-print-target overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight">Weekly Calendar Matrix</h3>
                <p className="text-xs text-zinc-500 font-mono">08:00 AM – 07:00 PM (11 Academic Hours)</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-zinc-400">Total Credits:</span>{' '}
                <span className="text-xs font-bold text-zinc-900 dark:text-white font-mono">{metrics.totalCredits}</span>
              </div>
            </div>

            {/* Matrix Viewport */}
            <div className="relative overflow-x-auto">
              <div className="min-w-[620px] md:min-w-0">
                {/* Day Headers (Bold, Legible) */}
                <div className="grid grid-cols-11 border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-2">
                  <div className="col-span-1 text-xs font-mono font-medium text-zinc-400 text-center">TIME</div>
                  {DAYS.map(d => (
                    <div
                      key={d}
                      className={`col-span-2 text-center text-sm font-semibold tracking-tight ${
                        mobileDay === d ? 'text-zinc-950 dark:text-white font-bold' : 'text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {DAY_LABELS[d]}
                    </div>
                  ))}
                </div>

                {/* Calendar Canvas: 680px Height (62px per hour slot) */}
                <div className="relative h-[680px] grid grid-cols-11 select-none">
                  
                  {/* Left Column: Hours 8:00 AM to 7:00 PM */}
                  <div className="col-span-1 relative border-r border-zinc-100 dark:border-zinc-800/80">
                    {Array.from({ length: END_HOUR - START_HOUR + 1 }).map((_, idx) => {
                      const hour = START_HOUR + idx;
                      const topPercent = (idx / (END_HOUR - START_HOUR)) * 100;
                      const displayH = hour % 12 === 0 ? 12 : hour % 12;
                      const ampm = hour >= 12 ? 'PM' : 'AM';
                      return (
                        <div
                          key={hour}
                          style={{ top: `${topPercent}%` }}
                          className="absolute -translate-y-2 left-0 right-2 text-right text-xs text-zinc-400 dark:text-zinc-500 font-mono font-medium"
                        >
                          {displayH}:00 {ampm}
                        </div>
                      );
                    })}
                  </div>

                  {/* 5 Day Columns */}
                  <div className="col-span-10 grid grid-cols-5 relative h-full">
                    {/* Horizontal Hour Lines */}
                    {Array.from({ length: END_HOUR - START_HOUR + 1 }).map((_, idx) => {
                      const topPercent = (idx / (END_HOUR - START_HOUR)) * 100;
                      return (
                        <div
                          key={idx}
                          style={{ top: `${topPercent}%` }}
                          className="absolute left-0 right-0 border-t border-zinc-100 dark:border-zinc-800/50 pointer-events-none"
                        />
                      );
                    })}

                    {/* Columns */}
                    {DAYS.map(day => {
                      const dayEvents = placedEvents.filter(e => e.day === day);
                      return (
                        <div
                          key={day}
                          className={`relative h-full border-r border-zinc-100 dark:border-zinc-800/60 last:border-r-0 ${
                            mobileDay === day ? 'bg-zinc-50/40 dark:bg-zinc-800/20' : ''
                          }`}
                        >
                          {dayEvents.map(event => {
                            const palette = SOPHISTICATED_PALETTES[event.colorIndex % SOPHISTICATED_PALETTES.length];
                            return (
                              <div
                                key={`${event.courseId}-${event.day}-${event.startTime}`}
                                style={{
                                  top: `${event.topPercent}%`,
                                  height: `${event.heightPercent}%`
                                }}
                                onClick={() => setSelectedCourseId(event.courseId)}
                                className={`absolute inset-x-1.5 p-2.5 rounded-lg border-l-4 transition-all cursor-pointer shadow-xs hover:shadow-md hover:z-20 overflow-hidden flex flex-col justify-between ${palette.card}`}
                              >
                                <div>
                                  <div className="flex items-center justify-between gap-1 mb-0.5">
                                    <span className="font-bold text-xs tracking-tight truncate leading-tight">
                                      {event.code}
                                    </span>
                                    <span className="text-[10px] font-mono opacity-75 font-semibold">
                                      {event.credits}cr
                                    </span>
                                  </div>
                                  <div className="text-xs truncate font-medium leading-tight">
                                    {event.title}
                                  </div>
                                  <div className="text-[11px] truncate opacity-80 flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-2.5 h-2.5 shrink-0" />
                                    <span>{event.room}</span>
                                  </div>
                                </div>

                                <div className={`text-[10px] font-mono font-semibold ${palette.timeText} pt-1 flex items-center justify-between border-t border-black/5 dark:border-white/5`}>
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
