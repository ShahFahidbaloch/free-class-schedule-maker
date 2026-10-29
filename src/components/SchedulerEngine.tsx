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
  Info
} from 'lucide-react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';

export interface TimeSlot {
  day: DayOfWeek;
  startTime: string; // "09:00"
  endTime: string;   // "10:30"
  room: string;
}

export interface Section {
  id: string;
  name: string;
  instructor?: string;
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

// Enterprise Muted Slate / Navy / Charcoal Palettes
export const ENTERPRISE_PALETTES = [
  {
    name: 'Muted Navy',
    card: 'bg-slate-100/90 text-slate-900 border-l-[#1e293b] border border-slate-200/90 dark:bg-[#1e293b]/50 dark:text-slate-100 dark:border-l-sky-400 dark:border-slate-800',
    bar: 'bg-[#1e293b] dark:bg-sky-400',
    badge: 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200',
    subText: 'text-slate-500 dark:text-slate-400'
  },
  {
    name: 'Slate Zinc',
    card: 'bg-zinc-100 text-zinc-900 border-l-zinc-700 border border-zinc-200 dark:bg-zinc-800/80 dark:text-zinc-100 dark:border-l-zinc-300 dark:border-zinc-700',
    bar: 'bg-zinc-700 dark:bg-zinc-300',
    badge: 'bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200',
    subText: 'text-zinc-500 dark:text-zinc-400'
  },
  {
    name: 'Deep Charcoal',
    card: 'bg-neutral-100 text-neutral-900 border-l-neutral-800 border border-neutral-200 dark:bg-neutral-900/90 dark:text-neutral-100 dark:border-l-neutral-400 dark:border-neutral-800',
    bar: 'bg-neutral-800 dark:bg-neutral-400',
    badge: 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200',
    subText: 'text-neutral-500 dark:text-neutral-400'
  },
  {
    name: 'Muted Indigo',
    card: 'bg-indigo-50/70 text-indigo-950 border-l-indigo-700 border border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-100 dark:border-l-indigo-400 dark:border-indigo-900',
    bar: 'bg-indigo-700 dark:bg-indigo-400',
    badge: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200',
    subText: 'text-indigo-600/70 dark:text-indigo-400'
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

const START_HOUR = 8;  // 08:00 AM
const END_HOUR = 18;   // 06:00 PM (10 Academic Hours)
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

// Preloaded University LMS Demo Data
const DEMO_COURSES: Course[] = [
  {
    id: 'c-cs301',
    code: 'CS301',
    title: 'Data Structures & Algorithms',
    credits: 4,
    colorIndex: 0, // Muted Navy
    selectedSectionId: 'sec-cs301-a',
    sections: [
      {
        id: 'sec-cs301-a',
        name: 'Sec 01 (Morning MWF)',
        instructor: 'Dr. E. Dijkstra',
        slots: [
          { day: 'Mon', startTime: '10:00', endTime: '11:15', room: 'Lab 3 (Turing Wing)' },
          { day: 'Wed', startTime: '10:00', endTime: '11:15', room: 'Lab 3 (Turing Wing)' },
          { day: 'Fri', startTime: '10:00', endTime: '11:15', room: 'Lab 3 (Turing Wing)' }
        ]
      },
      {
        id: 'sec-cs301-b',
        name: 'Sec 02 (Afternoon TTh)',
        instructor: 'Dr. K. Thompson',
        slots: [
          { day: 'Tue', startTime: '13:30', endTime: '15:00', room: 'Gates Hall 104' },
          { day: 'Thu', startTime: '13:30', endTime: '15:00', room: 'Gates Hall 104' }
        ]
      }
    ]
  },
  {
    id: 'c-math201',
    code: 'MATH201',
    title: 'Multivariable Calculus',
    credits: 4,
    colorIndex: 1, // Slate Zinc
    selectedSectionId: 'sec-math201-a',
    sections: [
      {
        id: 'sec-math201-a',
        name: 'Sec 01 (Midday MWF)',
        instructor: 'Prof. L. Euler',
        slots: [
          { day: 'Mon', startTime: '11:30', endTime: '12:45', room: 'Science Quad Rm 304' },
          { day: 'Wed', startTime: '11:30', endTime: '12:45', room: 'Science Quad Rm 304' },
          { day: 'Fri', startTime: '11:30', endTime: '12:45', room: 'Science Quad Rm 304' }
        ]
      },
      {
        id: 'sec-math201-b',
        name: 'Sec 02 (Morning TTh)',
        instructor: 'Prof. C. Gauss',
        slots: [
          { day: 'Tue', startTime: '09:00', endTime: '10:30', room: 'Math Hall 210' },
          { day: 'Thu', startTime: '09:00', endTime: '10:30', room: 'Math Hall 210' }
        ]
      }
    ]
  },
  {
    id: 'c-eng102',
    code: 'ENG102',
    title: 'Technical Report Writing',
    credits: 3,
    colorIndex: 2, // Deep Charcoal
    selectedSectionId: 'sec-eng102-a',
    sections: [
      {
        id: 'sec-eng102-a',
        name: 'Sec 01 (Afternoon TTh)',
        instructor: 'Dr. M. Shelley',
        slots: [
          { day: 'Tue', startTime: '11:00', endTime: '12:15', room: 'Humanities Hall 108' },
          { day: 'Thu', startTime: '11:00', endTime: '12:15', room: 'Humanities Hall 108' }
        ]
      }
    ]
  }
];

export default function SchedulerEngine() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [mobileDay, setMobileDay] = useState<DayOfWeek>('Mon');

  // New Course Registration Form State
  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCredits, setNewCredits] = useState(3);
  const [newSlots, setNewSlots] = useState<TimeSlot[]>([
    { day: 'Tue', startTime: '13:00', endTime: '14:15', room: 'Hall B' }
  ]);

  const timetableRef = useRef<HTMLDivElement>(null);

  // Initialize from LocalStorage or Load VULMS Demo
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lms_workbench_schedule_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCourses(parsed);
          setActiveCourseId(parsed[0].id);
          return;
        }
      }
    } catch (e) {}
    setCourses(DEMO_COURSES);
    setActiveCourseId(DEMO_COURSES[0].id);
  }, []);

  // Save changes to LocalStorage
  useEffect(() => {
    if (courses.length > 0) {
      try {
        localStorage.setItem('lms_workbench_schedule_v1', JSON.stringify(courses));
      } catch (e) {}
    }
  }, [courses]);

  // Compute Placed Events on Matrix
  const placedEvents = useMemo(() => {
    const list: Array<{
      courseId: string;
      code: string;
      title: string;
      credits: number;
      room: string;
      instructor?: string;
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
      const activeSec = course.sections.find(s => s.id === course.selectedSectionId);
      if (!activeSec) return;

      activeSec.slots.forEach(slot => {
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
            room: slot.room || 'Main Hall',
            instructor: activeSec.instructor,
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

  // Compute Live Metrics
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
        for (let j = i + 1; j < daySlots.length; j++) {
          if (daySlots[i].endMins > daySlots[j].startMins) {
            overlaps++;
          }
        }

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

  // Register New Course from LMS form
  const handleRegisterCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const courseId = `c_${Date.now()}`;
    const secId = `sec_${Date.now()}`;
    const nextColor = courses.length % ENTERPRISE_PALETTES.length;

    const newCourseObj: Course = {
      id: courseId,
      code: newCode.trim().toUpperCase(),
      title: newTitle.trim() || 'Academic Subject',
      credits: Number(newCredits) || 3,
      colorIndex: nextColor,
      selectedSectionId: secId,
      sections: [
        {
          id: secId,
          name: 'Section 01',
          slots: [...newSlots]
        }
      ]
    };

    setCourses(prev => [...prev, newCourseObj]);
    setActiveCourseId(courseId);
    setNewCode('');
    setNewTitle('');
    setNewSlots([{ day: 'Tue', startTime: '13:00', endTime: '14:15', room: 'Hall B' }]);
    setBanner(`Registered ${newCourseObj.code} into timetable matrix.`);
    setTimeout(() => setBanner(null), 4000);
  };

  // Add slot row in new course form
  const handleAddSlotToNew = () => {
    setNewSlots(prev => [...prev, { day: 'Thu', startTime: '13:00', endTime: '14:15', room: 'Hall B' }]);
  };

  const handleRemoveSlotFromNew = (idx: number) => {
    if (newSlots.length <= 1) return;
    setNewSlots(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateNewSlot = (idx: number, field: keyof TimeSlot, value: string) => {
    setNewSlots(prev => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  };

  // Delete Course
  const handleDeleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    if (activeCourseId === id) {
      const remaining = courses.filter(c => c.id !== id);
      setActiveCourseId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  // Permutation Gap Optimizer
  const handleOptimizeGaps = () => {
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
      setBanner(`Optimized! Conflict-free sections applied. Total idle gap: ${(minGaps / 60).toFixed(1)}h.`);
      setTimeout(() => setBanner(null), 5000);
    } else {
      setBanner('No conflict-free combination found across active sections.');
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
      a.download = 'academic-timetable.png';
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
      'PRODID:-//AcademicWorkbench//DesktopTimetable//EN',
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
        lines.push(`LOCATION:${slot.room}`);
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
    a.download = 'lms-class-schedule.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (confirm('Reset to standard academic demo courses?')) {
      setCourses(DEMO_COURSES);
      setActiveCourseId(DEMO_COURSES[0].id);
      localStorage.removeItem('lms_workbench_schedule_v1');
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Toast Notification */}
      {banner && (
        <div className="p-3 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-between text-xs font-mono shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            <span>{banner}</span>
          </div>
          <button onClick={() => setBanner(null)} className="text-xs opacity-75 hover:opacity-100 cursor-pointer">
            [Dismiss]
          </button>
        </div>
      )}

      {/* Unified 12-Column Workbench Grid (Zero Scroll Top Area) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Left Column: LMS Course Registration Form (Col 1-4) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Registration Form Card */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-xs bg-zinc-900 dark:bg-white"></span>
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                  Course Enrollment
                </h2>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">LMS MODULE</span>
            </div>

            <form onSubmit={handleRegisterCourse} className="space-y-3.5">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-[11px] font-mono font-medium text-zinc-500 mb-1">COURSE CODE</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={e => setNewCode(e.target.value)}
                    placeholder="e.g. CS301"
                    required
                    className="w-full h-8 px-2.5 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-medium text-zinc-500 mb-1">CREDITS</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={newCredits}
                    onChange={e => setNewCredits(Number(e.target.value))}
                    className="w-full h-8 px-2 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-medium text-zinc-500 mb-1">COURSE TITLE</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Data Structures & Algorithms"
                  className="w-full h-8 px-2.5 text-xs rounded-md border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white transition"
                />
              </div>

              {/* Timing Slots Table */}
              <div className="space-y-2 pt-1">
                <label className="block text-[11px] font-mono font-medium text-zinc-500">SECTION TIMINGS & ROOM</label>
                
                {newSlots.map((slot, sIdx) => (
                  <div key={sIdx} className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800 space-y-2">
                    <div className="grid grid-cols-12 gap-1.5 items-center">
                      <div className="col-span-4">
                        <select
                          value={slot.day}
                          onChange={e => handleUpdateNewSlot(sIdx, 'day', e.target.value)}
                          className="w-full h-7 text-[11px] font-mono rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white px-1"
                        >
                          {DAYS.map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-3">
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={e => handleUpdateNewSlot(sIdx, 'startTime', e.target.value)}
                          className="w-full h-7 text-[11px] font-mono rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white px-1"
                        />
                      </div>

                      <div className="col-span-1 text-center text-zinc-400 text-xs">-</div>

                      <div className="col-span-3">
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={e => handleUpdateNewSlot(sIdx, 'endTime', e.target.value)}
                          className="w-full h-7 text-[11px] font-mono rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white px-1"
                        />
                      </div>

                      <div className="col-span-1 text-center">
                        {newSlots.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSlotFromNew(sIdx)}
                            className="text-zinc-400 hover:text-rose-500 text-xs font-bold"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={slot.room}
                        onChange={e => handleUpdateNewSlot(sIdx, 'room', e.target.value)}
                        placeholder="Venue / Room (e.g. Lab 3, Hall B)"
                        className="w-full h-6 px-2 text-[11px] rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddSlotToNew}
                  className="text-[11px] font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 cursor-pointer pt-0.5"
                >
                  <Plus className="w-3 h-3" /> + Add Section Slot
                </button>
              </div>

              <button
                type="submit"
                className="w-full h-9 rounded-md bg-zinc-900 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs font-mono font-semibold transition active:scale-98 cursor-pointer mt-2"
              >
                + Register Course
              </button>
            </form>
          </div>

          {/* Enrolled Courses List Card */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                Enrolled Roster ({courses.length})
              </span>
              <span className="text-[11px] font-mono text-zinc-500 font-semibold">{metrics.totalCredits} Total Cr</span>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {courses.map(course => {
                const palette = ENTERPRISE_PALETTES[course.colorIndex % ENTERPRISE_PALETTES.length];
                const activeSec = course.sections.find(s => s.id === course.selectedSectionId);
                return (
                  <div
                    key={course.id}
                    className="p-2.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 flex items-center justify-between text-xs transition"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-xs ${palette.bar}`}></span>
                        <span className="font-mono font-bold text-zinc-900 dark:text-white">{course.code}</span>
                        <span className="text-[10px] font-mono text-zinc-400">({course.credits}cr)</span>
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate max-w-[200px]">{course.title}</div>
                    </div>

                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="text-zinc-400 hover:text-rose-500 p-1 cursor-pointer transition"
                      title="Drop course"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Calendar Grid & Live Toolbar (Col 5-12) */}
        <div className="lg:col-span-8 space-y-3">
          
          {/* Top Integrated Action & Metrics Bar */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            
            {/* Left Metrics Tags */}
            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700">
                CREDITS: <span className="font-bold">{metrics.totalCredits}</span>
              </div>

              <div className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700">
                GAPS: <span className="font-bold">{metrics.gapHours}h</span>
              </div>

              <div className="hidden sm:inline-flex px-2.5 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900">
                {metrics.overlaps === 0 ? (
                  <span className="text-zinc-600 dark:text-zinc-300 font-medium">0 CONFLICTS</span>
                ) : (
                  <span className="text-rose-600 dark:text-rose-400 font-bold">{metrics.overlaps} OVERLAPS DETECTED</span>
                )}
              </div>
            </div>

            {/* Right Export & Optimizer Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleOptimizeGaps}
                className="h-8 px-3 rounded-md bg-zinc-900 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs font-mono font-medium flex items-center gap-1.5 shadow-2xs transition active:scale-98 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600" />
                <span>Optimize Gaps</span>
              </button>

              <button
                onClick={handleExportICS}
                className="h-8 px-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-mono font-medium flex items-center gap-1.5 transition cursor-pointer"
                title="Export Apple / Google .ICS file"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Export ICS</span>
              </button>

              <button
                onClick={handleExportPNG}
                disabled={isExporting}
                className="h-8 px-2.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-mono transition cursor-pointer"
                title="Download PNG wallpaper"
              >
                <Download className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => window.print()}
                className="h-8 px-2.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-mono transition cursor-pointer"
                title="Print timetable"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleReset}
                className="h-8 w-8 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
                title="Reset demo data"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Mobile Day Selector Tabs */}
          <div className="flex md:hidden items-center justify-between p-1 rounded-lg bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800">
            {DAYS.map(day => (
              <button
                key={day}
                onClick={() => setMobileDay(day)}
                className={`flex-1 py-1 text-xs font-mono font-semibold rounded transition cursor-pointer ${
                  mobileDay === day
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Real Desktop macOS/Google Calendar Grid (08:00 AM – 06:00 PM) */}
          <div
            ref={timetableRef}
            className="p-5 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/80 shadow-2xs timetable-print-target overflow-hidden"
          >
            <div className="relative overflow-x-auto">
              <div className="min-w-[620px] md:min-w-0">
                
                {/* Column Headers (Mon, Tue, Wed, Thu, Fri) */}
                <div className="grid grid-cols-11 border-b border-zinc-200 dark:border-zinc-800 pb-2.5 mb-1.5">
                  <div className="col-span-1 text-[11px] font-mono font-bold text-zinc-400 text-center uppercase">
                    TIME
                  </div>
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

                {/* Grid Body: 10 Hours (8 AM to 6 PM) - 600px total height, exactly 60px/hr */}
                <div className="relative h-[600px] grid grid-cols-11 select-none">
                  
                  {/* Left Column: Bold Font-Mono Hour Markers */}
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
                          className="absolute -translate-y-2 left-0 right-2 text-right text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500"
                        >
                          {displayH}:00 {ampm}
                        </div>
                      );
                    })}
                  </div>

                  {/* Day Columns */}
                  <div className="col-span-10 grid grid-cols-5 relative h-full">
                    
                    {/* Horizontal Divider Lines */}
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
                            const palette = ENTERPRISE_PALETTES[event.colorIndex % ENTERPRISE_PALETTES.length];
                            return (
                              <div
                                key={`${event.courseId}-${event.day}-${event.startTime}`}
                                style={{
                                  top: `${event.topPercent}%`,
                                  height: `${event.heightPercent}%`
                                }}
                                className={`absolute inset-x-1 p-2 rounded-md border-l-4 transition-all shadow-xs hover:shadow-md hover:scale-[1.01] hover:z-20 overflow-hidden flex flex-col justify-between group ${palette.card}`}
                                title={`${event.code}: ${event.title} (${event.room})`}
                              >
                                <div className="leading-tight">
                                  <div className="flex items-center justify-between gap-1 mb-0.5">
                                    <span className="font-mono font-bold text-xs tracking-tight truncate">
                                      {event.code}
                                    </span>
                                    <span className="text-[10px] font-mono opacity-70">
                                      {event.credits}cr
                                    </span>
                                  </div>
                                  <div className="text-[11px] truncate font-medium text-zinc-700 dark:text-zinc-200">
                                    {event.title}
                                  </div>
                                  <div className="text-[10px] font-mono truncate text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-2.5 h-2.5 shrink-0" />
                                    <span>{event.room}</span>
                                  </div>
                                </div>

                                <div className="text-[10px] font-mono font-medium text-zinc-500 dark:text-zinc-400 pt-1 flex items-center justify-between border-t border-black/5 dark:border-white/5">
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
