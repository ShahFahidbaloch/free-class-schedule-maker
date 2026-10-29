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
  Edit3,
  CalendarDays,
  ListPlus
} from 'lucide-react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';

export interface TimeSlot {
  day: DayOfWeek;
  startTime: string; // e.g. "10:00 AM" or "10:00"
  endTime: string;   // e.g. "11:15 AM" or "11:15"
  room: string;
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

// Enterprise Muted Slate / Navy / Charcoal Palettes with crisp left border
export const PALETTES = [
  {
    name: 'Muted Navy',
    card: 'bg-slate-100 text-slate-900 border-l-[#1e293b] border border-slate-200/90 dark:bg-[#1e293b]/50 dark:text-slate-100 dark:border-l-sky-400 dark:border-slate-800',
    bar: 'bg-[#1e293b] dark:bg-sky-400',
    badge: 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
  },
  {
    name: 'Slate Zinc',
    card: 'bg-zinc-100 text-zinc-900 border-l-zinc-700 border border-zinc-200 dark:bg-zinc-800/80 dark:text-zinc-100 dark:border-l-zinc-300 dark:border-zinc-700',
    bar: 'bg-zinc-700 dark:bg-zinc-300',
    badge: 'bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200'
  },
  {
    name: 'Deep Charcoal',
    card: 'bg-neutral-100 text-neutral-900 border-l-neutral-800 border border-neutral-200 dark:bg-neutral-900/90 dark:text-neutral-100 dark:border-l-neutral-400 dark:border-neutral-800',
    bar: 'bg-neutral-800 dark:bg-neutral-400',
    badge: 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200'
  },
  {
    name: 'Muted Indigo',
    card: 'bg-indigo-50/70 text-indigo-950 border-l-indigo-700 border border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-100 dark:border-l-indigo-400 dark:border-indigo-900',
    bar: 'bg-indigo-700 dark:bg-indigo-400',
    badge: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
  }
];

const DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const DAY_FULL_NAMES: Record<DayOfWeek, string> = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday'
};

const START_HOUR = 8;  // 08:00 AM
const END_HOUR = 18;   // 06:00 PM (10 Hours)
const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60; // 600 mins

// Flexible Time Parser: Allows typing "10:00 AM", "10:00", "2:30 PM", "14:30", "9:00"
export function parseFlexibleTime(input: string): number {
  if (!input) return 0;
  const clean = input.trim().toLowerCase();
  
  const isPM = clean.includes('pm') || clean.includes('p');
  const isAM = clean.includes('am') || clean.includes('a');
  
  const rawNum = clean.replace(/[^0-9:]/g, '');
  if (!rawNum) return 0;
  
  let hours = 0;
  let minutes = 0;
  
  if (rawNum.includes(':')) {
    const parts = rawNum.split(':');
    hours = parseInt(parts[0], 10) || 0;
    minutes = parseInt(parts[1], 10) || 0;
  } else {
    hours = parseInt(rawNum, 10) || 0;
  }

  if (isPM && hours < 12) {
    hours += 12;
  } else if (isAM && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

// Standard 12-Hour display formatter
export function formatTime12(timeStr: string): string {
  if (!timeStr) return '';
  const totalMins = parseFlexibleTime(timeStr);
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  const displayM = m < 10 ? `0${m}` : m;
  return `${displayH}:${displayM} ${ampm}`;
}

// Default Demonstration Courses
const DEMO_COURSES: Course[] = [
  {
    id: 'course-cs101',
    code: 'CS 101',
    title: 'Intro to Computer Science',
    credits: 4,
    colorIndex: 0,
    selectedSectionId: 'sec-cs101-a',
    sections: [
      {
        id: 'sec-cs101-a',
        name: 'Section 01 (Morning MWF)',
        slots: [
          { day: 'Mon', startTime: '10:00 AM', endTime: '11:15 AM', room: 'Turing Hall 102' },
          { day: 'Wed', startTime: '10:00 AM', endTime: '11:15 AM', room: 'Turing Hall 102' },
          { day: 'Fri', startTime: '10:00 AM', endTime: '11:15 AM', room: 'Turing Hall 102' }
        ]
      },
      {
        id: 'sec-cs101-b',
        name: 'Section 02 (Afternoon TTh)',
        slots: [
          { day: 'Tue', startTime: '01:30 PM', endTime: '03:00 PM', room: 'Gates Hall 204' },
          { day: 'Thu', startTime: '01:30 PM', endTime: '03:00 PM', room: 'Gates Hall 204' }
        ]
      }
    ]
  },
  {
    id: 'course-math21',
    code: 'MATH 21',
    title: 'Calculus & Analytical Geometry',
    credits: 4,
    colorIndex: 1,
    selectedSectionId: 'sec-math21-a',
    sections: [
      {
        id: 'sec-math21-a',
        name: 'Section 01 (Midday MWF)',
        slots: [
          { day: 'Mon', startTime: '11:30 AM', endTime: '12:45 PM', room: 'Science Quad 304' },
          { day: 'Wed', startTime: '11:30 AM', endTime: '12:45 PM', room: 'Science Quad 304' },
          { day: 'Fri', startTime: '11:30 AM', endTime: '12:45 PM', room: 'Science Quad 304' }
        ]
      },
      {
        id: 'sec-math21-b',
        name: 'Section 02 (Morning TTh)',
        slots: [
          { day: 'Tue', startTime: '09:00 AM', endTime: '10:30 AM', room: 'Math Hall 110' },
          { day: 'Thu', startTime: '09:00 AM', endTime: '10:30 AM', room: 'Math Hall 110' }
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

  // Mobile Views: 'calendar' or 'courses'
  const [mobileView, setMobileView] = useState<'calendar' | 'courses'>('calendar');
  // Mobile Day Filter: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'all'
  const [mobileDay, setMobileDay] = useState<DayOfWeek | 'all'>('Mon');

  // New Course Registration Form State
  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCredits, setNewCredits] = useState(3);
  const [newSlots, setNewSlots] = useState<TimeSlot[]>([
    { day: 'Tue', startTime: '10:00 AM', endTime: '11:15 AM', room: 'Room 201' }
  ]);

  const timetableRef = useRef<HTMLDivElement>(null);

  // Initialize from LocalStorage or Load Demo Courses
  useEffect(() => {
    try {
      const saved = localStorage.getItem('class_schedule_app_v1');
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

  // Sync to LocalStorage
  useEffect(() => {
    if (courses.length > 0) {
      try {
        localStorage.setItem('class_schedule_app_v1', JSON.stringify(courses));
      } catch (e) {}
    }
  }, [courses]);

  // Compute Placed Events on Timetable Matrix
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
      const activeSec = course.sections.find(s => s.id === course.selectedSectionId);
      if (!activeSec) return;

      activeSec.slots.forEach(slot => {
        const startM = parseFlexibleTime(slot.startTime);
        const endM = parseFlexibleTime(slot.endTime);
        const dayStartM = START_HOUR * 60; // 480 (8:00 AM)
        const dayEndM = END_HOUR * 60;     // 1080 (6:00 PM)

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

  // Compute Live Metrics (Credits, Gaps, Overlaps)
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

  // Register New Course from Form
  const handleRegisterCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const courseId = `course_${Date.now()}`;
    const secId = `sec_${Date.now()}`;
    const nextColor = courses.length % PALETTES.length;

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
    setNewSlots([{ day: 'Tue', startTime: '10:00 AM', endTime: '11:15 AM', room: 'Room 201' }]);
    setBanner(`Added ${newCourseObj.code} to your schedule.`);
    setTimeout(() => setBanner(null), 4000);
  };

  const handleAddSlotToNew = () => {
    setNewSlots(prev => [...prev, { day: 'Thu', startTime: '10:00 AM', endTime: '11:15 AM', room: 'Room 201' }]);
  };

  const handleRemoveSlotFromNew = (idx: number) => {
    if (newSlots.length <= 1) return;
    setNewSlots(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateNewSlot = (idx: number, field: keyof TimeSlot, value: string) => {
    setNewSlots(prev => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  };

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
          const s = parseFlexibleTime(slot.startTime);
          const e = parseFlexibleTime(slot.endTime);

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
      setBanner(`Optimized! Found conflict-free timetable with ${(minGaps / 60).toFixed(1)}h idle gap.`);
      setTimeout(() => setBanner(null), 5000);
    } else {
      setBanner('No conflict-free combination found across active section options.');
      setTimeout(() => setBanner(null), 5000);
    }
  };

  // Export PNG Image
  const handleExportPNG = async () => {
    if (!timetableRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(timetableRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: 2
      });
      const a = document.createElement('a');
      a.download = 'class-schedule.png';
      a.href = dataUrl;
      a.click();
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  // Export .ICS File
  const handleExportICS = () => {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ClassSchedule//AcademicTimetable//EN',
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

        const startMins = parseFlexibleTime(slot.startTime);
        const endMins = parseFlexibleTime(slot.endTime);

        const sh = String(Math.floor(startMins / 60)).padStart(2, '0');
        const sm = String(startMins % 60).padStart(2, '0');
        const eh = String(Math.floor(endMins / 60)).padStart(2, '0');
        const em = String(endMins % 60).padStart(2, '0');

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
    a.download = 'class-schedule.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (confirm('Reset to standard demo courses?')) {
      setCourses(DEMO_COURSES);
      setActiveCourseId(DEMO_COURSES[0].id);
      localStorage.removeItem('class_schedule_app_v1');
    }
  };

  // Determine active visible columns on mobile vs desktop
  const activeDaysList = mobileDay === 'all' ? DAYS : [mobileDay];

  return (
    <div className="w-full space-y-3">
      {/* Toast Alert Banner */}
      {banner && (
        <div className="p-3 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-between text-xs font-mono shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{banner}</span>
          </div>
          <button onClick={() => setBanner(null)} className="text-xs opacity-75 hover:opacity-100 cursor-pointer">
            [Dismiss]
          </button>
        </div>
      )}

      {/* Mobile Mode Switcher: Timetable Grid vs. Add / Edit Classes */}
      <div className="flex lg:hidden items-center p-1 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 shadow-2xs">
        <button
          type="button"
          onClick={() => setMobileView('calendar')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
            mobileView === 'calendar'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
          }`}
        >
          <CalendarDays className="w-3.5 h-3.5" />
          <span>Timetable Grid</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileView('courses')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
            mobileView === 'courses'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
          }`}
        >
          <ListPlus className="w-3.5 h-3.5" />
          <span>Add & Edit Courses ({courses.length})</span>
        </button>
      </div>

      {/* Main 12-Column Responsive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Left Column: Course Enrollment & Roster (4 Cols) */}
        <div className={`space-y-4 lg:col-span-4 ${mobileView === 'courses' ? 'block' : 'hidden lg:block'}`}>
          
          {/* Add Course Form Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-xs bg-zinc-900 dark:bg-white"></span>
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                  Add Course
                </h2>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">Class Schedule</span>
            </div>

            <form onSubmit={handleRegisterCourse} className="space-y-3.5">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-[11px] font-mono font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    COURSE CODE
                  </label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={e => setNewCode(e.target.value)}
                    placeholder="e.g. CS 101"
                    required
                    className="w-full h-9 px-3 text-xs font-mono rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-white transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    CREDITS
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={newCredits}
                    onChange={e => setNewCredits(Number(e.target.value))}
                    className="w-full h-9 px-2 text-xs font-mono rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  COURSE TITLE
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Intro to Computer Science"
                  className="w-full h-9 px-3 text-xs rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-white transition"
                />
              </div>

              {/* Class Timings Slots (Allows Direct Typing or Selection) */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-mono font-medium text-zinc-600 dark:text-zinc-400">
                    CLASS TIMINGS & ROOM (TYPE OR PICK)
                  </label>
                </div>
                
                {newSlots.map((slot, sIdx) => (
                  <div key={sIdx} className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 space-y-2.5">
                    <div className="grid grid-cols-12 gap-2 items-center">
                      {/* Day Selector */}
                      <div className="col-span-4">
                        <label className="block text-[10px] text-zinc-400 mb-0.5">DAY</label>
                        <select
                          value={slot.day}
                          onChange={e => handleUpdateNewSlot(sIdx, 'day', e.target.value)}
                          className="w-full h-8 text-xs font-mono rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white px-1.5 cursor-pointer"
                        >
                          {DAYS.map(d => (
                            <option key={d} value={d}>{DAY_FULL_NAMES[d]}</option>
                          ))}
                        </select>
                      </div>

                      {/* Start Time (Editable Text or Time) */}
                      <div className="col-span-4">
                        <label className="block text-[10px] text-zinc-400 mb-0.5">START TIME</label>
                        <input
                          type="text"
                          value={slot.startTime}
                          onChange={e => handleUpdateNewSlot(sIdx, 'startTime', e.target.value)}
                          placeholder="10:00 AM"
                          className="w-full h-8 text-xs font-mono rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white px-2 focus:ring-1 focus:ring-zinc-950"
                        />
                      </div>

                      {/* End Time (Editable Text or Time) */}
                      <div className="col-span-3">
                        <label className="block text-[10px] text-zinc-400 mb-0.5">END TIME</label>
                        <input
                          type="text"
                          value={slot.endTime}
                          onChange={e => handleUpdateNewSlot(sIdx, 'endTime', e.target.value)}
                          placeholder="11:15 AM"
                          className="w-full h-8 text-xs font-mono rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white px-2 focus:ring-1 focus:ring-zinc-950"
                        />
                      </div>

                      {/* Remove Button */}
                      <div className="col-span-1 pt-3 text-center">
                        {newSlots.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSlotFromNew(sIdx)}
                            className="text-zinc-400 hover:text-rose-500 text-sm font-bold cursor-pointer"
                            title="Remove timing"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Room / Hall Input */}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                        <input
                          type="text"
                          value={slot.room}
                          onChange={e => handleUpdateNewSlot(sIdx, 'room', e.target.value)}
                          placeholder="Room / Hall (e.g. Science Hall 101)"
                          className="w-full h-7 px-2 text-xs rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddSlotToNew}
                  className="text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white flex items-center gap-1 cursor-pointer pt-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add another day / time slot
                </button>
              </div>

              <button
                type="submit"
                className="w-full h-10 rounded-lg bg-zinc-900 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold tracking-wide transition active:scale-98 cursor-pointer mt-2"
              >
                + Register Course
              </button>
            </form>
          </div>

          {/* Enrolled Courses Roster Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                Enrolled Courses ({courses.length})
              </span>
              <span className="text-[11px] font-mono text-zinc-500 font-semibold">{metrics.totalCredits} Credits Total</span>
            </div>

            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {courses.map(course => {
                const palette = PALETTES[course.colorIndex % PALETTES.length];
                const activeSec = course.sections.find(s => s.id === course.selectedSectionId);
                return (
                  <div
                    key={course.id}
                    className="p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 flex items-center justify-between text-xs transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-xs ${palette.bar}`}></span>
                        <span className="font-mono font-bold text-zinc-900 dark:text-white">{course.code}</span>
                        <span className="text-[11px] font-mono text-zinc-500">({course.credits} Credits)</span>
                      </div>
                      <div className="text-[11px] text-zinc-600 dark:text-zinc-400 truncate max-w-[210px]">{course.title}</div>
                      
                      {activeSec && (
                        <div className="text-[10px] font-mono text-zinc-400 flex flex-wrap gap-1">
                          {activeSec.slots.map((sl, i) => (
                            <span key={i} className="bg-zinc-200/60 dark:bg-zinc-800 px-1 py-0.5 rounded">
                              {sl.day} {formatTime12(sl.startTime)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="text-zinc-400 hover:text-rose-500 p-1.5 cursor-pointer transition"
                      title="Delete course"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Visual Timetable & Live Toolbar (8 Cols) */}
        <div className={`space-y-3 lg:col-span-8 ${mobileView === 'calendar' ? 'block' : 'hidden lg:block'}`}>
          
          {/* Action Toolbar */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            
            {/* Live Metrics */}
            <div className="flex items-center gap-2.5 text-xs font-mono">
              <div className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 font-semibold">
                CREDITS: {metrics.totalCredits}
              </div>

              <div className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700">
                GAPS: <span className="font-bold">{metrics.gapHours}h</span>
              </div>

              <div className="hidden sm:inline-flex px-2.5 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-xs">
                {metrics.overlaps === 0 ? (
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium">0 Conflicts</span>
                ) : (
                  <span className="text-rose-600 dark:text-rose-400 font-bold">{metrics.overlaps} Conflict(s)</span>
                )}
              </div>
            </div>

            {/* Direct Tool Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleOptimizeGaps}
                className="h-8 px-3 rounded-md bg-zinc-900 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs font-mono font-medium flex items-center gap-1.5 shadow-2xs transition active:scale-98 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 dark:text-zinc-600" />
                <span>Optimize Gaps</span>
              </button>

              <button
                onClick={handleExportICS}
                className="h-8 px-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-mono font-medium flex items-center gap-1.5 transition cursor-pointer"
                title="Export .ICS to Google / Apple Calendar"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Export ICS</span>
              </button>

              <button
                onClick={handleExportPNG}
                disabled={isExporting}
                className="h-8 px-2.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-mono transition cursor-pointer"
                title="Download PNG image"
              >
                <Download className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => window.print()}
                className="h-8 px-2.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-mono transition cursor-pointer"
                title="Print schedule"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleReset}
                className="h-8 w-8 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
                title="Reset demonstration schedule"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Mobile Day Selector Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 shadow-2xs overflow-x-auto lg:hidden">
            {DAYS.map(day => (
              <button
                key={day}
                onClick={() => setMobileDay(day)}
                className={`flex-1 py-1.5 text-xs font-mono font-semibold rounded-lg transition cursor-pointer whitespace-nowrap px-2 ${
                  mobileDay === day
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
              >
                {day}
              </button>
            ))}
            <button
              onClick={() => setMobileDay('all')}
              className={`py-1.5 px-3 text-xs font-mono font-semibold rounded-lg transition cursor-pointer whitespace-nowrap ${
                mobileDay === 'all'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              All 5 Days
            </button>
          </div>

          {/* Native Timetable Matrix */}
          <div
            ref={timetableRef}
            className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/80 shadow-2xs timetable-print-target overflow-hidden"
          >
            <div className="relative overflow-x-auto">
              {/* Responsive Container width */}
              <div className={`${mobileDay === 'all' ? 'min-w-[640px]' : 'w-full'}`}>
                
                {/* Column Headers */}
                <div className={`grid pb-2.5 mb-1.5 border-b border-zinc-200 dark:border-zinc-800 ${
                  mobileDay === 'all' ? 'grid-cols-11' : 'grid-cols-6'
                }`}>
                  <div className="col-span-1 text-[11px] font-mono font-bold text-zinc-400 text-center uppercase">
                    TIME
                  </div>
                  {activeDaysList.map(d => (
                    <div
                      key={d}
                      className={`text-center text-sm font-bold tracking-tight text-zinc-900 dark:text-white ${
                        mobileDay === 'all' ? 'col-span-2' : 'col-span-5'
                      }`}
                    >
                      {DAY_FULL_NAMES[d]}
                    </div>
                  ))}
                </div>

                {/* Grid Body: 10 Hours (8:00 AM to 6:00 PM) */}
                <div className={`relative h-[600px] grid select-none ${
                  mobileDay === 'all' ? 'grid-cols-11' : 'grid-cols-6'
                }`}>
                  
                  {/* Left Column: Hours 8:00 AM to 6:00 PM */}
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
                  <div className={`relative h-full ${
                    mobileDay === 'all' ? 'col-span-10 grid grid-cols-5' : 'col-span-5'
                  }`}>
                    
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

                    {/* Columns Render */}
                    {activeDaysList.map(day => {
                      const dayEvents = placedEvents.filter(e => e.day === day);
                      return (
                        <div
                          key={day}
                          className="relative h-full border-r border-zinc-100 dark:border-zinc-800/60 last:border-r-0"
                        >
                          {dayEvents.map(event => {
                            const palette = PALETTES[event.colorIndex % PALETTES.length];
                            return (
                              <div
                                key={`${event.courseId}-${event.day}-${event.startTime}`}
                                style={{
                                  top: `${event.topPercent}%`,
                                  height: `${event.heightPercent}%`
                                }}
                                className={`absolute inset-x-1 p-2.5 rounded-md border-l-4 transition-all shadow-xs hover:shadow-md hover:scale-[1.01] hover:z-20 overflow-hidden flex flex-col justify-between ${palette.card}`}
                              >
                                <div>
                                  <div className="flex items-center justify-between gap-1 mb-0.5">
                                    <span className="font-mono font-bold text-xs tracking-tight truncate leading-tight">
                                      {event.code}
                                    </span>
                                    <span className="text-[10px] font-mono opacity-80 font-semibold">
                                      {event.credits}cr
                                    </span>
                                  </div>
                                  <div className="text-xs truncate font-medium text-zinc-800 dark:text-zinc-100">
                                    {event.title}
                                  </div>
                                  <div className="text-[11px] truncate opacity-75 flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-2.5 h-2.5 shrink-0" />
                                    <span>{event.room}</span>
                                  </div>
                                </div>

                                <div className="text-[10px] font-mono font-semibold pt-1 flex items-center justify-between border-t border-black/5 dark:border-white/5 opacity-85">
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
