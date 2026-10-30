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
  CalendarDays,
  ListPlus,
  GraduationCap
} from 'lucide-react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';

export interface TimeSlot {
  day: DayOfWeek;
  startTime: string; // e.g. "10:00 AM"
  endTime: string;   // e.g. "11:15 AM"
  room: string;
}

export interface Section {
  id: string;
  name: string;
  days: DayOfWeek[]; // Multi-day support e.g. ['Mon', 'Wed', 'Fri']
  startTime: string;
  endTime: string;
  room: string;
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
const DAY_LABELS: Record<DayOfWeek, { short: string; pill: string; full: string }> = {
  Mon: { short: 'Mon', pill: 'M', full: 'Monday' },
  Tue: { short: 'Tue', pill: 'T', full: 'Tuesday' },
  Wed: { short: 'Wed', pill: 'W', full: 'Wednesday' },
  Thu: { short: 'Thu', pill: 'Th', full: 'Thursday' },
  Fri: { short: 'Fri', pill: 'F', full: 'Friday' }
};

const START_HOUR = 8;  // 08:00 AM
const END_HOUR = 20;   // 08:00 PM (12 Hours)
const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60; // 720 mins

// Flexible Time Parser
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

// 12-Hour display formatter
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

// Default Demonstration Courses (MWF and TTh Multi-Day)
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
        name: 'Section 01 (MWF Morning)',
        days: ['Mon', 'Wed', 'Fri'],
        startTime: '10:00 AM',
        endTime: '11:15 AM',
        room: 'Turing Hall 102'
      },
      {
        id: 'sec-cs101-b',
        name: 'Section 02 (TTh Afternoon)',
        days: ['Tue', 'Thu'],
        startTime: '01:30 PM',
        endTime: '03:00 PM',
        room: 'Gates Hall 204'
      }
    ]
  },
  {
    id: 'course-math21',
    code: 'MATH 21',
    title: 'Calculus & Geometry',
    credits: 4,
    colorIndex: 1,
    selectedSectionId: 'sec-math21-a',
    sections: [
      {
        id: 'sec-math21-a',
        name: 'Section 01 (MWF Midday)',
        days: ['Mon', 'Wed', 'Fri'],
        startTime: '11:30 AM',
        endTime: '12:45 PM',
        room: 'Science Quad 304'
      },
      {
        id: 'sec-math21-b',
        name: 'Section 02 (TTh Morning)',
        days: ['Tue', 'Thu'],
        startTime: '09:00 AM',
        endTime: '10:30 AM',
        room: 'Math Hall 110'
      }
    ]
  },
  {
    id: 'course-phys41',
    code: 'PHYS 41',
    title: 'Mechanics & Kinetics',
    credits: 4,
    colorIndex: 2,
    selectedSectionId: 'sec-phys41-a',
    sections: [
      {
        id: 'sec-phys41-a',
        name: 'Section 01 (TTh Midday)',
        days: ['Tue', 'Thu'],
        startTime: '11:00 AM',
        endTime: '12:15 PM',
        room: 'Physics Rm 201'
      }
    ]
  }
];

export default function SchedulerEngine() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [banner, setBanner] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Mobile Views: 'calendar' or 'courses'
  const [mobileView, setMobileView] = useState<'calendar' | 'courses'>('calendar');

  // New Course Registration Form State with Multi-Day Pills
  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCredits, setNewCredits] = useState(3);
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(['Mon', 'Wed', 'Fri']);
  const [newStartTime, setNewStartTime] = useState('09:00 AM');
  const [newEndTime, setNewEndTime] = useState('10:15 AM');
  const [newRoom, setNewRoom] = useState('Lab 2');

  const timetableRef = useRef<HTMLDivElement>(null);

  // Initialize from LocalStorage or Load Demo Courses
  useEffect(() => {
    try {
      const saved = localStorage.getItem('class_schedule_coursicle_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCourses(parsed);
          return;
        }
      }
    } catch (e) {}
    setCourses(DEMO_COURSES);
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    if (courses.length > 0) {
      try {
        localStorage.setItem('class_schedule_coursicle_v1', JSON.stringify(courses));
      } catch (e) {}
    }
  }, [courses]);

  // Compute Placed Events with Coursicle-style Side-by-Side Clash Offsets
  interface PlacedEvent {
    id: string;
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
    hasClash: boolean;
    lane: number;
    totalLanes: number;
  }

  const placedEventsByDay = useMemo(() => {
    const dayMap: Record<DayOfWeek, PlacedEvent[]> = {
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: []
    };

    // Flatten all slots from active sections
    courses.forEach(course => {
      const activeSec = course.sections.find(s => s.id === course.selectedSectionId);
      if (!activeSec) return;

      activeSec.days.forEach(day => {
        const startM = parseFlexibleTime(activeSec.startTime);
        const endM = parseFlexibleTime(activeSec.endTime);
        const dayStartM = START_HOUR * 60; // 480 (8:00 AM)
        const dayEndM = END_HOUR * 60;     // 1200 (8:00 PM)

        const clampedStart = Math.max(dayStartM, startM);
        const clampedEnd = Math.min(dayEndM, endM);

        if (clampedEnd > clampedStart) {
          const topPercent = ((clampedStart - dayStartM) / TOTAL_MINUTES) * 100;
          const heightPercent = ((clampedEnd - clampedStart) / TOTAL_MINUTES) * 100;

          dayMap[day].push({
            id: `${course.id}-${day}-${activeSec.startTime}`,
            courseId: course.id,
            code: course.code,
            title: course.title,
            credits: course.credits,
            room: activeSec.room || 'Main Hall',
            colorIndex: course.colorIndex,
            day,
            startTime: activeSec.startTime,
            endTime: activeSec.endTime,
            startMins: startM,
            endMins: endM,
            topPercent,
            heightPercent,
            hasClash: false,
            lane: 0,
            totalLanes: 1
          });
        }
      });
    });

    // Detect Overlaps and Assign Side-by-Side Lanes per Day (Coursicle mechanism)
    DAYS.forEach(day => {
      const events = dayMap[day].sort((a, b) => a.startMins - b.startMins);
      
      for (let i = 0; i < events.length; i++) {
        const colliding: number[] = [i];
        for (let j = 0; j < events.length; j++) {
          if (i !== j) {
            const overlap = Math.max(events[i].startMins, events[j].startMins) < Math.min(events[i].endMins, events[j].endMins);
            if (overlap) {
              colliding.push(j);
            }
          }
        }

        if (colliding.length > 1) {
          events[i].hasClash = true;
          colliding.sort();
          const laneIdx = colliding.indexOf(i);
          events[i].lane = laneIdx;
          events[i].totalLanes = Math.min(colliding.length, 2);
        }
      }
    });

    return dayMap;
  }, [courses]);

  // Compute Live Metrics
  const metrics = useMemo(() => {
    const totalCredits = courses.reduce((sum, c) => sum + (c.credits || 0), 0);
    let totalGapMinutes = 0;
    let longestGapMinutes = 0;
    let longestGapDay: DayOfWeek | null = null;
    let overlaps = 0;

    DAYS.forEach(day => {
      const daySlots = (placedEventsByDay[day] || []).sort((a, b) => a.startMins - b.startMins);

      for (let i = 0; i < daySlots.length; i++) {
        if (daySlots[i].hasClash) {
          overlaps++;
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
      overlaps: Math.floor(overlaps / 2)
    };
  }, [courses, placedEventsByDay]);

  // Toggle Day in Multi-Day Pill Selector [ M ] [ T ] [ W ] [ Th ] [ F ]
  const toggleDay = (d: DayOfWeek) => {
    if (selectedDays.includes(d)) {
      if (selectedDays.length > 1) {
        setSelectedDays(prev => prev.filter(day => day !== d));
      }
    } else {
      setSelectedDays(prev => [...prev, d]);
    }
  };

  // Register New Course from Form
  const handleRegisterCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const courseId = `c_${Date.now()}`;
    const secId = `sec_${Date.now()}`;
    const nextColor = courses.length % PALETTES.length;

    const newCourseObj: Course = {
      id: courseId,
      code: newCode.trim().toUpperCase(),
      title: newTitle.trim() || 'Academic Course',
      credits: Number(newCredits) || 3,
      colorIndex: nextColor,
      selectedSectionId: secId,
      sections: [
        {
          id: secId,
          name: `Section 01 (${selectedDays.map(d => DAY_LABELS[d].pill).join('')})`,
          days: [...selectedDays],
          startTime: newStartTime,
          endTime: newEndTime,
          room: newRoom.trim() || 'Room 101'
        }
      ]
    };

    setCourses(prev => [...prev, newCourseObj]);
    setNewCode('');
    setNewTitle('');
    setBanner(`Registered ${newCourseObj.code} across ${selectedDays.join(', ')}.`);
    setTimeout(() => setBanner(null), 4000);
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  // One-Click Gap Optimizer
  const handleOptimizeGaps = () => {
    if (courses.length === 0) return;

    const options = courses.map(c => c.sections.map(s => ({ courseId: c.id, sectionId: s.id, days: s.days, start: s.startTime, end: s.endTime })));
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
        for (const day of item.days) {
          const s = parseFlexibleTime(item.start);
          const e = parseFlexibleTime(item.end);

          for (const existing of allSlots) {
            if (existing.day === day) {
              if (Math.max(existing.s, s) < Math.min(existing.e, e)) {
                clash = true;
                break;
              }
            }
          }
          if (clash) break;
          allSlots.push({ day, s, e });
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
      setBanner(`Optimized! Applied clash-free sections with ${(minGaps / 60).toFixed(1)}h idle gap.`);
      setTimeout(() => setBanner(null), 5000);
    } else {
      setBanner('No conflict-free combination found across active section timings.');
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

  // Export .ICS
  const handleExportICS = () => {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ClassSchedule//CoursicleEngine//EN',
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

      sec.days.forEach(day => {
        const offset = DAYS.indexOf(day);
        const evDate = new Date(baseMon.getTime() + offset * 86400000);
        const y = evDate.getFullYear();
        const m = String(evDate.getMonth() + 1).padStart(2, '0');
        const d = String(evDate.getDate()).padStart(2, '0');

        const startMins = parseFlexibleTime(sec.startTime);
        const endMins = parseFlexibleTime(sec.endTime);

        const sh = String(Math.floor(startMins / 60)).padStart(2, '0');
        const sm = String(startMins % 60).padStart(2, '0');
        const eh = String(Math.floor(endMins / 60)).padStart(2, '0');
        const em = String(endMins % 60).padStart(2, '0');

        lines.push('BEGIN:VEVENT');
        lines.push(`SUMMARY:${c.code} - ${c.title}`);
        lines.push(`LOCATION:${sec.room}`);
        lines.push(`DTSTART:${y}${m}${d}T${sh}${sm}00`);
        lines.push(`DTEND:${y}${m}${d}T${eh}${em}00`);
        lines.push(`RRULE:FREQ=WEEKLY;BYDAY=${dayMap[day]};COUNT=15`);
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
    if (confirm('Reset to standard academic demo courses?')) {
      setCourses(DEMO_COURSES);
      localStorage.removeItem('class_schedule_coursicle_v1');
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Toast Alert Banner */}
      {banner && (
        <div className="p-3 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-between text-xs font-mono shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{banner}</span>
          </div>
          <button onClick={() => setBanner(null)} className="text-xs opacity-75 hover:opacity-100 cursor-pointer">
            [Dismiss]
          </button>
        </div>
      )}

      {/* Mobile Mode Switcher: Timetable Grid vs. Add Courses */}
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
          <span>Weekly Timetable</span>
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
          <span>Course Registration ({courses.length})</span>
        </button>
      </div>

      {/* Main 12-Column Unified Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Academic Portal / School ERP Registration Card (Col 1-4) */}
        <div className={`space-y-5 lg:col-span-4 ${mobileView === 'courses' ? 'block' : 'hidden lg:block'}`}>
          
          {/* Outer Card: High-End School ERP Registration Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-6 mb-6">
            
            {/* Section Header */}
            <div className="mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                  Course Registration
                </h2>
                <p className="text-xs text-zinc-500 font-normal mt-0.5">
                  Academic Portal &bull; Course enrollment & session allocation
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                ERP MODULE
              </span>
            </div>

            <form onSubmit={handleRegisterCourse} className="space-y-4">
              
              {/* Form Fields: Strict 2-Column Structured Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Course Code */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Course Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={e => setNewCode(e.target.value)}
                    placeholder="e.g. CS101"
                    required
                    className="w-full h-10 px-3 text-xs font-mono rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/80 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition"
                  />
                </div>

                {/* Credits */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Credits <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newCredits}
                    onChange={e => setNewCredits(Number(e.target.value))}
                    className="w-full h-10 px-3 text-xs font-mono rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/80 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map(cr => (
                      <option key={cr} value={cr}>
                        {cr} {cr === 1 ? 'Credit' : 'Credits'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Course Title: Full Width md:col-span-2 */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Course Title
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. Introduction to Database Systems"
                    className="w-full h-10 px-3 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/80 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition"
                  />
                </div>
              </div>

              {/* Section & Timing Block (ERP Style Nested Box) */}
              <div className="bg-zinc-50/70 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 mt-2 space-y-3.5">
                
                {/* Row 1 - Day Checkbox Bar */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                    Class Days (Select all that apply) <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    {DAYS.map(d => {
                      const isSelected = selectedDays.includes(d);
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => toggleDay(d)}
                          className={`flex-1 h-9 rounded-lg font-mono text-xs font-semibold transition cursor-pointer border ${
                            isSelected
                              ? 'bg-zinc-900 text-white font-semibold border-zinc-900 dark:bg-white dark:text-zinc-950 dark:border-white shadow-2xs'
                              : 'bg-white border border-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                          }`}
                          title={DAY_LABELS[d].full}
                        >
                          {DAY_LABELS[d].pill}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-zinc-400 font-mono mt-1">
                    Selected: {selectedDays.map(d => DAY_LABELS[d].short).join(', ')}
                  </p>
                </div>

                {/* Row 2 - Times & Venue (3-Column Grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  
                  {/* Start Time */}
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                      Start Time <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newStartTime}
                      onChange={e => setNewStartTime(e.target.value)}
                      placeholder="e.g. 09:00 AM"
                      className="w-full h-9 px-2.5 text-xs font-mono rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-1 focus:ring-zinc-950"
                    />
                  </div>

                  {/* End Time */}
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                      End Time <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newEndTime}
                      onChange={e => setNewEndTime(e.target.value)}
                      placeholder="e.g. 10:30 AM"
                      className="w-full h-9 px-2.5 text-xs font-mono rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-1 focus:ring-zinc-950"
                    />
                  </div>

                  {/* Room / Hall */}
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                      Room / Hall
                    </label>
                    <input
                      type="text"
                      value={newRoom}
                      onChange={e => setNewRoom(e.target.value)}
                      placeholder="e.g. Lab 2"
                      className="w-full h-9 px-2.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-1 focus:ring-zinc-950"
                    />
                  </div>
                </div>

              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs active:scale-[0.99]"
              >
                <Plus className="w-4 h-4" />
                <span>Enroll Course in Timetable</span>
              </button>
            </form>
          </div>

          {/* Enrolled Courses Summary: Clean Data-Table / Card View */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-5 space-y-3">
            
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                Enrolled Courses Summary ({courses.length})
              </span>
              <span className="text-[11px] font-mono text-zinc-500 font-semibold">
                {metrics.totalCredits} Credits Total
              </span>
            </div>

            {courses.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-400">
                No courses enrolled yet. Use the registration card above to add your first subject.
              </div>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80 max-h-[300px] overflow-y-auto">
                {courses.map(course => {
                  const palette = PALETTES[course.colorIndex % PALETTES.length];
                  const activeSec = course.sections.find(s => s.id === course.selectedSectionId);
                  return (
                    <div
                      key={course.id}
                      className="py-3 px-1.5 flex items-center justify-between text-xs hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition rounded-lg"
                    >
                      <div className="space-y-1 pr-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-xs ${palette.bar}`}></span>
                          <span className="font-mono font-bold text-zinc-900 dark:text-white">
                            {course.code}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                            {course.credits} cr
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-600 dark:text-zinc-400 truncate max-w-[210px]">
                          {course.title}
                        </div>
                        
                        {activeSec && (
                          <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                              {activeSec.days.join(', ')}
                            </span>
                            <span>&bull;</span>
                            <span>{formatTime12(activeSec.startTime)} - {formatTime12(activeSec.endTime)}</span>
                            {activeSec.room && (
                              <>
                                <span>&bull;</span>
                                <span className="truncate max-w-[80px]">{activeSec.room}</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-zinc-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                        title="Delete course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Full 5-Column Weekly Matrix (Col 5-12) */}
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

              <div className="inline-flex px-2.5 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-xs">
                {metrics.overlaps === 0 ? (
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium">0 Conflicts</span>
                ) : (
                  <span className="text-rose-600 dark:text-rose-400 font-bold">{metrics.overlaps} Overlap(s)</span>
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

          {/* Full 5-Column Weekly Timetable Matrix (Monday to Friday Concurrently) */}
          <div
            ref={timetableRef}
            className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/80 shadow-2xs timetable-print-target overflow-hidden"
          >
            <div className="relative overflow-x-auto">
              <div className="min-w-[660px]">
                
                {/* 5-Column Headers: Monday through Friday concurrently */}
                <div className="grid grid-cols-11 pb-2.5 mb-1.5 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="col-span-1 text-[11px] font-mono font-bold text-zinc-400 text-center uppercase">
                    TIME
                  </div>
                  {DAYS.map(day => (
                    <div
                      key={day}
                      className="col-span-2 text-center text-sm font-bold tracking-tight text-zinc-900 dark:text-white"
                    >
                      {DAY_LABELS[day].full}
                    </div>
                  ))}
                </div>

                {/* 12-Hour Grid Body (08:00 AM – 08:00 PM = 720px Height) */}
                <div className="relative h-[720px] grid grid-cols-11 select-none">
                  
                  {/* Left Column: 08:00 AM to 08:00 PM */}
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

                  {/* 5 Column Weekly Container: Monday, Tuesday, Wednesday, Thursday, Friday */}
                  <div className="col-span-10 grid grid-cols-5 relative h-full">
                    
                    {/* Horizontal Guideline Dividers crossing all 5 columns */}
                    {Array.from({ length: END_HOUR - START_HOUR + 1 }).map((_, idx) => {
                      const topPercent = (idx / (END_HOUR - START_HOUR)) * 100;
                      return (
                        <div
                          key={idx}
                          style={{ top: `${topPercent}%` }}
                          className="absolute left-0 right-0 border-t border-zinc-100 dark:border-zinc-800/60 pointer-events-none"
                        />
                      );
                    })}

                    {/* Monday to Friday Columns */}
                    {DAYS.map(day => {
                      const dayEvents = placedEventsByDay[day] || [];
                      return (
                        <div
                          key={day}
                          className="relative col-span-1 border-r border-zinc-100 dark:border-zinc-800/60 last:border-r-0 h-full"
                        >
                          {dayEvents.map(event => {
                            const palette = PALETTES[event.colorIndex % PALETTES.length];

                            // Coursicle Side-by-Side Offset Calculation
                            const isClashed = event.hasClash;
                            const leftPos = isClashed
                              ? event.lane === 0 ? '1%' : '50%'
                              : '2px';
                            const blockWidth = isClashed ? '48%' : 'calc(100% - 4px)';

                            return (
                              <div
                                key={event.id}
                                style={{
                                  top: `${event.topPercent}%`,
                                  height: `${event.heightPercent}%`,
                                  left: leftPos,
                                  width: blockWidth
                                }}
                                className={`absolute p-2 rounded-md border-l-4 transition-all shadow-xs hover:shadow-md hover:scale-[1.02] hover:z-30 overflow-hidden flex flex-col justify-between ${palette.card} ${
                                  isClashed ? 'border-red-500 ring-1 ring-red-400/50' : ''
                                }`}
                                title={`${event.code} - ${event.title} (${event.room}) ${isClashed ? '[Conflict Detected]' : ''}`}
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
