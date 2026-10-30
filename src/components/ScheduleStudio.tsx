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
  CalendarDays,
  X,
  ArrowLeft,
  Sun,
  Moon,
  AlertCircle,
  Maximize2,
  Minimize2,
  Sliders,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';

export interface Section {
  id: string;
  name: string;
  days: DayOfWeek[];
  startTime: string; // e.g. "10:00 AM"
  endTime: string;   // e.g. "11:15 AM"
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

// Strict Apple Slate / Monochrome Muted Pastel Palette (Zero AI slop, No green badges)
export const SLATE_PALETTES = [
  {
    id: 'slate-blue',
    name: 'Slate Blue',
    cardBg: 'bg-slate-100/90 dark:bg-[#151c28]',
    cardBorder: 'border-slate-300 dark:border-slate-700',
    bar: 'bg-slate-700 dark:bg-slate-400',
    textCode: 'text-slate-900 dark:text-white',
    textTitle: 'text-slate-700 dark:text-slate-200',
    textMeta: 'text-slate-600 dark:text-slate-300',
    dot: 'bg-slate-600'
  },
  {
    id: 'zinc-charcoal',
    name: 'Charcoal',
    cardBg: 'bg-zinc-100/90 dark:bg-[#1a1a1f]',
    cardBorder: 'border-zinc-300 dark:border-zinc-700',
    bar: 'bg-zinc-800 dark:bg-zinc-300',
    textCode: 'text-zinc-950 dark:text-white',
    textTitle: 'text-zinc-700 dark:text-zinc-200',
    textMeta: 'text-zinc-600 dark:text-zinc-300',
    dot: 'bg-zinc-800'
  },
  {
    id: 'neutral-indigo',
    name: 'Muted Indigo',
    cardBg: 'bg-indigo-50/70 dark:bg-[#181a2e]',
    cardBorder: 'border-indigo-200/90 dark:border-indigo-800/80',
    bar: 'bg-indigo-700 dark:bg-indigo-400',
    textCode: 'text-indigo-950 dark:text-white',
    textTitle: 'text-indigo-800 dark:text-indigo-200',
    textMeta: 'text-indigo-700 dark:text-indigo-300',
    dot: 'bg-indigo-600'
  },
  {
    id: 'stone-sand',
    name: 'Warm Stone',
    cardBg: 'bg-stone-100/80 dark:bg-[#201d1a]',
    cardBorder: 'border-stone-300 dark:border-stone-700',
    bar: 'bg-stone-700 dark:bg-stone-400',
    textCode: 'text-stone-950 dark:text-white',
    textTitle: 'text-stone-700 dark:text-stone-200',
    textMeta: 'text-stone-600 dark:text-stone-300',
    dot: 'bg-stone-600'
  },
  {
    id: 'neutral-violet',
    name: 'Muted Violet',
    cardBg: 'bg-violet-50/70 dark:bg-[#20182b]',
    cardBorder: 'border-violet-200/90 dark:border-violet-800/80',
    bar: 'bg-violet-700 dark:bg-violet-400',
    textCode: 'text-violet-950 dark:text-white',
    textTitle: 'text-violet-800 dark:text-violet-200',
    textMeta: 'text-violet-700 dark:text-violet-300',
    dot: 'bg-violet-600'
  }
];

const DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const DAY_LABELS: Record<DayOfWeek, { short: string; full: string; pill: string }> = {
  Mon: { short: 'Mon', full: 'Monday', pill: 'M' },
  Tue: { short: 'Tue', full: 'Tuesday', pill: 'T' },
  Wed: { short: 'Wed', full: 'Wednesday', pill: 'W' },
  Thu: { short: 'Thu', full: 'Thursday', pill: 'Th' },
  Fri: { short: 'Fri', full: 'Friday', pill: 'F' }
};

const COMMON_START_TIMES = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', 
  '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', 
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', 
  '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM'
];

const COMMON_END_TIMES = [
  '08:50 AM', '09:15 AM', '09:30 AM', '10:15 AM', '10:30 AM', 
  '11:15 AM', '11:30 AM', '12:15 PM', '12:30 PM', '01:15 PM', 
  '01:45 PM', '02:00 PM', '02:15 PM', '02:45 PM', '03:15 PM', 
  '03:30 PM', '04:15 PM', '04:45 PM', '05:15 PM', '06:00 PM', '07:00 PM'
];

const CALENDAR_START_HOUR = 8;  // 8:00 AM
const CALENDAR_END_HOUR = 20;   // 8:00 PM (12 hours)
const HOUR_ROW_HEIGHT = 74;     // 74px per hour -> very clean & accessible

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

export function formatClassTimeRange(startTime: string, endTime: string, isNarrow: boolean = false): string {
  const startFmt = formatTime12(startTime);
  const endFmt = formatTime12(endTime);
  if (!startFmt && !endFmt) return '';
  if (!startFmt) return endFmt;
  if (!endFmt) return startFmt;

  if (isNarrow) {
    const sParts = startFmt.split(' ');
    const eParts = endFmt.split(' ');
    if (sParts[1] === eParts[1]) {
      return `${sParts[0]} – ${endFmt}`;
    }
  }
  return `${startFmt} – ${endFmt}`;
}

// Clean Default Courses
const INITIAL_DEMO_COURSES: Course[] = [
  {
    id: 'demo-cs101',
    code: 'CS 101',
    title: 'Intro to Computer Science',
    credits: 3,
    colorIndex: 0,
    selectedSectionId: 'sec-cs101-1',
    sections: [
      {
        id: 'sec-cs101-1',
        name: 'Sec 01 (MWF)',
        days: ['Mon', 'Wed', 'Fri'],
        startTime: '10:00 AM',
        endTime: '11:15 AM',
        room: 'Turing Hall 101'
      }
    ]
  },
  {
    id: 'demo-math21',
    code: 'MATH 21',
    title: 'Calculus & Analytic Geometry',
    credits: 4,
    colorIndex: 1,
    selectedSectionId: 'sec-math21-1',
    sections: [
      {
        id: 'sec-math21-1',
        name: 'Sec 01 (MWF)',
        days: ['Mon', 'Wed', 'Fri'],
        startTime: '11:30 AM',
        endTime: '12:45 PM',
        room: 'Science Quad 304'
      }
    ]
  },
  {
    id: 'demo-eng102',
    code: 'ENG 102',
    title: 'Academic Writing & Research',
    credits: 3,
    colorIndex: 2,
    selectedSectionId: 'sec-eng102-1',
    sections: [
      {
        id: 'sec-eng102-1',
        name: 'Sec 01 (TTh)',
        days: ['Tue', 'Thu'],
        startTime: '11:00 AM',
        endTime: '12:15 PM',
        room: 'Humanities 202'
      }
    ]
  }
];

export default function ScheduleStudio() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [banner, setBanner] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  
  // Timetable Display Mode: 'modal' drawer vs 'split' side-by-side
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  // Active Sidebar Item
  const [activeTab, setActiveTab] = useState<'form' | 'optimizer' | 'conflicts'>('form');

  // Form State
  const [courseName, setCourseName] = useState('');
  const [credits, setCredits] = useState(3);
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(['Mon', 'Wed', 'Fri']);
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('10:15 AM');
  const [room, setRoom] = useState('');
  const [colorIndex, setColorIndex] = useState(0);

  const timetableRef = useRef<HTMLDivElement>(null);

  // Initialize
  useEffect(() => {
    try {
      const saved = localStorage.getItem('class_schedule_studio_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCourses(parsed);
          return;
        }
      }
    } catch (e) {}
    setCourses(INITIAL_DEMO_COURSES);
  }, []);

  // Theme Sync
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkTheme(isDark);
  }, []);

  const toggleTheme = () => {
    if (isDarkTheme) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkTheme(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkTheme(true);
    }
  };

  // Save to LocalStorage
  useEffect(() => {
    if (courses.length > 0) {
      try {
        localStorage.setItem('class_schedule_studio_v1', JSON.stringify(courses));
      } catch (e) {}
    }
  }, [courses]);

  // Toggle Day Pill
  const toggleDay = (d: DayOfWeek) => {
    if (selectedDays.includes(d)) {
      if (selectedDays.length > 1) {
        setSelectedDays(prev => prev.filter(day => day !== d));
      }
    } else {
      setSelectedDays(prev => [...prev, d]);
    }
  };

  // Add Course
  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim()) return;

    const courseId = `c_${Date.now()}`;
    const secId = `sec_${Date.now()}`;

    const newCourse: Course = {
      id: courseId,
      code: courseName.trim().toUpperCase(),
      title: 'Course Lecture',
      credits: Number(credits) || 3,
      colorIndex: colorIndex,
      selectedSectionId: secId,
      sections: [
        {
          id: secId,
          name: `Section 01`,
          days: [...selectedDays],
          startTime: startTime.trim(),
          endTime: endTime.trim(),
          room: room.trim() || 'Campus'
        }
      ]
    };

    setCourses(prev => [...prev, newCourse]);
    setCourseName('');
    setRoom('');
    setColorIndex((colorIndex + 1) % SLATE_PALETTES.length);
    setBanner(`Course ${newCourse.code} added to your schedule.`);
    setTimeout(() => setBanner(null), 3000);
  };

  // Delete Course
  const handleDeleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  // Reset
  const handleReset = () => {
    if (confirm('Reset timetable to demonstration course schedule?')) {
      setCourses(INITIAL_DEMO_COURSES);
      localStorage.removeItem('class_schedule_studio_v1');
      setBanner('Schedule reset to demo courses.');
      setTimeout(() => setBanner(null), 3000);
    }
  };

  // Grid Event Structure & Calculations
  interface GridEvent {
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
    topPx: number;
    heightPx: number;
    hasClash: boolean;
    lane: number;
    totalLanes: number;
  }

  const placedEventsByDay = useMemo(() => {
    const dayMap: Record<DayOfWeek, GridEvent[]> = {
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: []
    };

    const calendarStartMins = CALENDAR_START_HOUR * 60; // 480
    const calendarEndMins = CALENDAR_END_HOUR * 60;     // 1200

    courses.forEach(course => {
      const activeSec = course.sections.find(s => s.id === course.selectedSectionId);
      if (!activeSec) return;

      activeSec.days.forEach(day => {
        const startM = parseFlexibleTime(activeSec.startTime);
        const endM = parseFlexibleTime(activeSec.endTime);

        const clampedStart = Math.max(calendarStartMins, startM);
        const clampedEnd = Math.min(calendarEndMins, endM);

        if (clampedEnd > clampedStart) {
          const topPx = ((clampedStart - calendarStartMins) / 60) * HOUR_ROW_HEIGHT;
          const durationMins = clampedEnd - clampedStart;
          const heightPx = Math.max((durationMins / 60) * HOUR_ROW_HEIGHT, 44);

          dayMap[day].push({
            id: `${course.id}-${day}-${activeSec.startTime}`,
            courseId: course.id,
            code: course.code,
            title: course.title,
            credits: course.credits,
            room: activeSec.room || 'Campus',
            colorIndex: course.colorIndex,
            day,
            startTime: activeSec.startTime,
            endTime: activeSec.endTime,
            startMins: startM,
            endMins: endM,
            topPx,
            heightPx,
            hasClash: false,
            lane: 0,
            totalLanes: 1
          });
        }
      });
    });

    // Conflict Cluster & Graph Coloring Lane Placement
    DAYS.forEach(day => {
      const events = dayMap[day];
      if (events.length === 0) return;

      events.sort((a, b) => a.startMins - b.startMins || (b.endMins - b.startMins) - (a.endMins - a.startMins));

      const clusters: GridEvent[][] = [];
      let currentCluster: GridEvent[] = [];
      let clusterEnd = -1;

      events.forEach(ev => {
        if (currentCluster.length === 0) {
          currentCluster.push(ev);
          clusterEnd = ev.endMins;
        } else if (ev.startMins < clusterEnd) {
          currentCluster.push(ev);
          clusterEnd = Math.max(clusterEnd, ev.endMins);
        } else {
          clusters.push(currentCluster);
          currentCluster = [ev];
          clusterEnd = ev.endMins;
        }
      });
      if (currentCluster.length > 0) {
        clusters.push(currentCluster);
      }

      clusters.forEach(cluster => {
        const laneEnds: number[] = [];

        cluster.forEach(ev => {
          let placedLane = -1;
          for (let l = 0; l < laneEnds.length; l++) {
            if (laneEnds[l] <= ev.startMins) {
              placedLane = l;
              laneEnds[l] = ev.endMins;
              break;
            }
          }
          if (placedLane === -1) {
            placedLane = laneEnds.length;
            laneEnds.push(ev.endMins);
          }
          ev.lane = placedLane;
        });

        const totalLanes = laneEnds.length;
        cluster.forEach(ev => {
          ev.totalLanes = totalLanes;
          ev.hasClash = totalLanes > 1;
        });
      });
    });

    return dayMap;
  }, [courses]);

  // Compute Metrics
  const metrics = useMemo(() => {
    const totalCredits = courses.reduce((sum, c) => sum + (c.credits || 0), 0);
    let totalGapMinutes = 0;
    let conflicts = 0;
    const clashingDays: string[] = [];

    DAYS.forEach(day => {
      const daySlots = (placedEventsByDay[day] || []).sort((a, b) => a.startMins - b.startMins);

      let dayHasClash = false;
      for (let i = 0; i < daySlots.length; i++) {
        if (daySlots[i].hasClash) {
          conflicts++;
          dayHasClash = true;
        }

        if (i < daySlots.length - 1) {
          const gap = daySlots[i + 1].startMins - daySlots[i].endMins;
          if (gap > 0 && gap < 360) {
            totalGapMinutes += gap;
          }
        }
      }
      if (dayHasClash) clashingDays.push(day);
    });

    return {
      totalCredits,
      coursesCount: courses.length,
      gapHours: (totalGapMinutes / 60).toFixed(1),
      conflicts: Math.floor(conflicts / 2),
      clashingDays
    };
  }, [courses, placedEventsByDay]);

  // Gap Optimizer Engine
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

          if (allSlots.some(x => x.day === day && Math.max(x.s, s) < Math.min(x.e, e))) {
            clash = true;
            break;
          }
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
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
      } catch (e) {}
      setBanner(`Optimized! Lowest campus idle gap: ${(minGaps / 60).toFixed(1)}h.`);
      setTimeout(() => setBanner(null), 3500);
    } else {
      setBanner('No conflict-free combination found across active section timings.');
      setTimeout(() => setBanner(null), 3500);
    }
  };

  // Export .ICS
  const handleExportICS = () => {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//TimetableOS//ClassSchedule//EN',
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
        lines.push(`SUMMARY:${c.code}`);
        lines.push(`LOCATION:${sec.room}`);
        lines.push(`DTSTART:${y}${m}${d}T${sh}${sm}00`);
        lines.push(`DTEND:${y}${m}${d}T${eh}${em}00`);
        lines.push(`RRULE:FREQ=WEEKLY;BYDAY=${dayMap[day]};COUNT=16`);
        lines.push('BEGIN:VALARM');
        lines.push('TRIGGER:-PT15M');
        lines.push('ACTION:DISPLAY');
        lines.push(`DESCRIPTION:Class reminder: ${c.code}`);
        lines.push('END:VALARM');
        lines.push('END:VEVENT');
      });
    });

    lines.push('END:VCALENDAR');
    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-class-timetable.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export PNG Image
  const handleExportPNG = async () => {
    if (!timetableRef.current) return;
    setIsExporting(true);
    try {
      const isDark = document.documentElement.classList.contains('dark');
      const dataUrl = await toPng(timetableRef.current, {
        backgroundColor: isDark ? '#121215' : '#ffffff',
        pixelRatio: 2
      });
      const a = document.createElement('a');
      a.download = 'my-class-schedule.png';
      a.href = dataUrl;
      a.click();
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  // Hours List
  const hoursList = useMemo(() => {
    const list: { hour: number; label: string }[] = [];
    for (let h = CALENDAR_START_HOUR; h <= CALENDAR_END_HOUR; h++) {
      const ampm = h >= 12 ? 'PM' : 'AM';
      const displayH = h % 12 === 0 ? 12 : h % 12;
      list.push({ hour: h, label: `${displayH} ${ampm}` });
    }
    return list;
  }, []);

  const totalGridHeight = (CALENDAR_END_HOUR - CALENDAR_START_HOUR) * HOUR_ROW_HEIGHT;

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFD] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950">
      
      {/* 1. App-Specific Minimal Top Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-[#09090b]/90 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          
          {/* Left: Brand + Back to Home */}
          <div className="flex items-center gap-4">
            <a 
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition"
              title="Return to Public Landing Page"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </a>

            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold tracking-wider text-zinc-900 dark:text-white px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                TIMETABLE // OS
              </span>
            </div>
          </div>

          {/* Center: Live Metrics Pill (Strict Monochrome Slate - Zero Green Tacky Badges) */}
          <div className="hidden md:flex items-center gap-3 text-xs font-mono font-medium px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
            <span className="text-zinc-700 dark:text-zinc-300">
              Credits: <strong className="font-bold text-zinc-900 dark:text-white">{metrics.totalCredits}</strong>
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span className="text-zinc-700 dark:text-zinc-300">
              Gaps: <strong className="font-bold text-zinc-900 dark:text-white">{metrics.gapHours}h</strong>
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            {metrics.conflicts === 0 ? (
              <span className="text-zinc-600 dark:text-zinc-400 font-semibold">
                Conflicts: None
              </span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400 font-bold">
                Conflicts: {metrics.conflicts} Overlap(s)
              </span>
            )}
          </div>

          {/* Right: Apple-Style Primary Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* View Weekly Timetable Button */}
            <button
              onClick={() => setShowCalendarModal(true)}
              className="h-9 px-3.5 rounded-xl bg-zinc-900 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs font-bold flex items-center gap-2 shadow-xs transition active:scale-[0.98] cursor-pointer"
            >
              <CalendarDays className="w-4 h-4" />
              <span>View Weekly Timetable</span>
            </button>

            {/* Export .ICS */}
            <button
              onClick={handleExportICS}
              className="hidden sm:inline-flex h-9 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold items-center gap-1.5 transition cursor-pointer"
              title="Export standard .ICS calendar file"
            >
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              <span>Export .ICS</span>
            </button>

            {/* Print PDF */}
            <button
              onClick={() => window.print()}
              className="h-9 w-9 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center transition cursor-pointer"
              title="Print Timetable"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="h-9 w-9 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition cursor-pointer"
              title="Toggle Light / Dark mode"
            >
              {isDarkTheme ? <Sun className="w-4 h-4 text-zinc-200" /> : <Moon className="w-4 h-4 text-zinc-700" />}
            </button>
          </div>

        </div>
      </header>

      {/* Main Studio Body: Sidebar + Workspace Form */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* 2. Minimal Left App Sidebar (Col 1-3) */}
        <aside className="lg:col-span-3 space-y-4">
          
          {/* Navigation Card */}
          <div className="p-3 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-1">
            <button
              onClick={() => setActiveTab('form')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-2xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Course Intake Form</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('optimizer');
                handleOptimizeGaps();
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition cursor-pointer ${
                activeTab === 'optimizer'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-2xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
              }`}
            >
              <Sliders className="w-4 h-4 text-zinc-500" />
              <span>Gap Optimizer Engine</span>
            </button>

            <button
              onClick={() => setActiveTab('conflicts')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition cursor-pointer ${
                activeTab === 'conflicts'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-2xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span>Conflict Detector ({metrics.conflicts})</span>
            </button>

            <button
              onClick={handleReset}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Schedule</span>
            </button>
          </div>

          {/* Quick Enrolled Summary Card */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800 text-xs font-bold">
              <span className="uppercase tracking-wider text-zinc-500">Active Courses</span>
              <span className="font-mono text-zinc-900 dark:text-white">{courses.length} enrolled</span>
            </div>

            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {courses.map(c => (
                <div 
                  key={c.id}
                  className="py-1.5 px-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{c.code}</span>
                  <span className="text-[11px] font-mono text-zinc-500">{c.credits} cr</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowCalendarModal(true)}
              className="w-full h-9 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-800/70 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Open Calendar Matrix</span>
            </button>
          </div>

        </aside>

        {/* 3. Main Workspace Area: Google Forms / Admission Portal Style Form (Col 4-12) */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* Toast Banner */}
          {banner && (
            <div className="p-3.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-between text-xs font-mono shadow-sm">
              <div className="flex items-center gap-2">
                <span>{banner}</span>
              </div>
              <button onClick={() => setBanner(null)} className="text-xs opacity-75 hover:opacity-100 cursor-pointer">
                [Dismiss]
              </button>
            </div>
          )}

          {/* Conflict Alert (Minimal, non-clashing, monochrome alert text) */}
          {metrics.conflicts > 0 && (
            <div className="p-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100/80 dark:bg-zinc-900/80 flex items-start gap-3 text-xs text-zinc-800 dark:text-zinc-200">
              <AlertCircle className="w-4 h-4 text-zinc-700 dark:text-zinc-300 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Schedule Conflict Detected:</span>
                <p className="mt-0.5 text-zinc-600 dark:text-zinc-400">
                  {metrics.conflicts} lecture overlap(s) identified on {metrics.clashingDays.join(', ')}. Use the Gap Optimizer or adjust section timings.
                </p>
              </div>
            </div>
          )}

          {/* The Google Forms / Admission Portal Style Course Intake Card */}
          <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
            
            {/* Header */}
            <div className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Course Intake Form
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Structured course entry & section allocation. Simple, accessible, and conflict-aware.
              </p>
            </div>

            <form onSubmit={handleAddCourse} className="space-y-6">
              
              {/* Row 1: Course Name & Credit Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">
                    Course Name / Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={courseName}
                    onChange={e => setCourseName(e.target.value)}
                    placeholder="e.g. Data Structures"
                    required
                    className="w-full h-11 px-3.5 text-sm font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">
                    Credit Hours <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={credits}
                    onChange={e => setCredits(Number(e.target.value))}
                    className="w-full h-11 px-3 text-sm font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map(cr => (
                      <option key={cr} value={cr}>{cr} Credits</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Class Timings (LMS-style structured row) */}
              <div className="p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block">
                  Session Timings & Schedule
                </span>

                {/* Day Selector: Segmented Toggle Pills [ M ] [ T ] [ W ] [ Th ] [ F ] */}
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Class Days (Select all that apply)
                  </label>
                  <div className="grid grid-cols-5 gap-2 max-w-md">
                    {DAYS.map(day => {
                      const isSelected = selectedDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`h-11 rounded-xl text-xs sm:text-sm font-bold transition border cursor-pointer flex items-center justify-center ${
                            isSelected
                              ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-950 dark:border-white shadow-2xs'
                              : 'bg-white border-zinc-300 text-zinc-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                          }`}
                        >
                          {DAY_LABELS[day].pill}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Times & Room */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                      Start Time <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                      placeholder="09:00 AM"
                      list="times-studio-start"
                      className="w-full h-10 px-3 text-xs font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    />
                    <datalist id="times-studio-start">
                      {COMMON_START_TIMES.map(t => <option key={t} value={t} />)}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                      End Time <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                      placeholder="10:15 AM"
                      list="times-studio-end"
                      className="w-full h-10 px-3 text-xs font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    />
                    <datalist id="times-studio-end">
                      {COMMON_END_TIMES.map(t => <option key={t} value={t} />)}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                      Room / Hall <span className="text-zinc-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={room}
                      onChange={e => setRoom(e.target.value)}
                      placeholder="e.g. Hall 101"
                      className="w-full h-10 px-3 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400"
                    />
                  </div>
                </div>

              </div>

              {/* Card Color (Monochrome / Slate Tones) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
                  Tone Style
                </label>
                <div className="flex items-center gap-2.5">
                  {SLATE_PALETTES.map((pal, idx) => (
                    <button
                      key={pal.id}
                      type="button"
                      onClick={() => setColorIndex(idx)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer ${pal.dot} ${
                        colorIndex === idx
                          ? 'ring-2 ring-offset-2 ring-zinc-900 dark:ring-white scale-110'
                          : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                      title={pal.name}
                    >
                      {colorIndex === idx && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Solid Action Button */}
              <button
                type="submit"
                className="w-full h-11 bg-zinc-900 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs active:scale-[0.99]"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>+ Add Course to Schedule</span>
              </button>
            </form>
          </div>

          {/* Underneath: Clean, minimal list of enrolled courses */}
          <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                Enrolled Courses ({courses.length})
              </span>
              <span className="text-xs font-mono text-zinc-500">
                Total: {metrics.totalCredits} Credit Hours
              </span>
            </div>

            {courses.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-400">
                No courses added yet. Fill in the intake form above to add your first course.
              </div>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                {courses.map(course => {
                  const sec = course.sections.find(s => s.id === course.selectedSectionId);
                  const pal = SLATE_PALETTES[course.colorIndex % SLATE_PALETTES.length];
                  return (
                    <div 
                      key={course.id}
                      className="py-3 px-2 flex items-center justify-between gap-4 hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 rounded-xl transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full shrink-0 ${pal.dot}`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-zinc-900 dark:text-white">
                              {course.code}
                            </span>
                            <span className="text-xs font-mono text-zinc-500">
                              ({course.credits} cr)
                            </span>
                          </div>
                          {sec && (
                            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1.5 font-mono">
                              <span className="font-bold text-zinc-700 dark:text-zinc-300">{sec.days.join(', ')}</span>
                              <span>&bull;</span>
                              <span>{formatClassTimeRange(sec.startTime, sec.endTime)}</span>
                              {sec.room && (
                                <>
                                  <span>&bull;</span>
                                  <span>{sec.room}</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
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

        </main>

      </div>

      {/* 4. Sliding Modal / Fullscreen Drawer: 5-Day Weekly Timetable (Mon-Fri, 08:00 AM - 08:00 PM) */}
      {showCalendarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-[1400px] max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            
            {/* Modal Topbar */}
            <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4 bg-zinc-50/80 dark:bg-zinc-900/80">
              <div className="flex items-center gap-2.5">
                <CalendarDays className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
                <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                  Weekly Class Timetable Matrix
                </h2>
                <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
                  &bull; Monday to Friday (08:00 AM – 08:00 PM)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportPNG}
                  disabled={isExporting}
                  className="h-8.5 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium flex items-center gap-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                  title="Download Image"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download PNG</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="h-8.5 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium flex items-center gap-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                  title="Print"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Print</span>
                </button>

                <button
                  onClick={() => setShowCalendarModal(false)}
                  className="h-8.5 w-8.5 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer ml-1"
                  title="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Matrix Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 timetable-print-target" ref={timetableRef}>
              <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215]">
                <div className="min-w-[720px]">
                  
                  {/* Header Row */}
                  <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-850/80">
                    <div className="w-[64px] shrink-0 border-r border-zinc-200 dark:border-zinc-800 py-3 text-center">
                      <span className="text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase">
                        TIME
                      </span>
                    </div>

                    <div className="flex-1 grid grid-cols-5">
                      {DAYS.map(day => (
                        <div
                          key={day}
                          className="py-3 text-center border-r border-zinc-200 dark:border-zinc-800 last:border-r-0"
                        >
                          <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
                            {DAY_LABELS[day].full}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Grid Canvas */}
                  <div className="relative flex" style={{ height: `${totalGridHeight}px` }}>
                    
                    {/* Time labels axis */}
                    <div className="w-[64px] shrink-0 relative border-r border-zinc-200 dark:border-zinc-800 select-none bg-zinc-50/50 dark:bg-zinc-900">
                      {hoursList.slice(0, -1).map(item => (
                        <div
                          key={item.hour}
                          style={{ height: `${HOUR_ROW_HEIGHT}px` }}
                          className="border-b border-zinc-200 dark:border-zinc-800 flex items-start justify-end pr-2.5 pt-1.5 text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400"
                        >
                          {item.label}
                        </div>
                      ))}
                    </div>

                    {/* 5 Day Columns Area */}
                    <div className="flex-1 relative h-full">
                      
                      {/* Grid background lines */}
                      <div className="absolute inset-0 pointer-events-none select-none">
                        {hoursList.slice(0, -1).map(item => (
                          <div
                            key={item.hour}
                            style={{ height: `${HOUR_ROW_HEIGHT}px` }}
                            className="border-b border-zinc-200 dark:border-zinc-800 relative"
                          >
                            <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-zinc-100 dark:border-zinc-800/60" />
                          </div>
                        ))}
                      </div>

                      {/* Day Columns */}
                      <div className="grid grid-cols-5 h-full relative">
                        {DAYS.map(day => {
                          const events = placedEventsByDay[day] || [];
                          return (
                            <div
                              key={day}
                              className="relative h-full border-r border-zinc-200 dark:border-zinc-800 last:border-r-0"
                            >
                              {events.map(event => {
                                const pal = SLATE_PALETTES[event.colorIndex % SLATE_PALETTES.length];
                                const isClashed = event.hasClash;
                                const totalCols = event.totalLanes || 1;
                                const colWidthPercent = 100 / totalCols;

                                const leftPos = totalCols === 1
                                  ? '3px'
                                  : `calc(${event.lane * colWidthPercent}% + 2px)`;
                                const blockWidth = totalCols === 1
                                  ? 'calc(100% - 6px)'
                                  : `calc(${colWidthPercent}% - 4px)`;

                                return (
                                  <div
                                    key={event.id}
                                    style={{
                                      top: `${event.topPx}px`,
                                      height: `${event.heightPx}px`,
                                      left: leftPos,
                                      width: blockWidth
                                    }}
                                    className={`absolute rounded-xl border p-2 sm:p-2.5 transition-all shadow-xs hover:shadow-md hover:scale-[1.01] hover:z-30 overflow-hidden flex flex-col justify-between group cursor-default select-none ${pal.cardBg} ${pal.cardBorder} border-l-4 ${pal.bar} ${
                                      isClashed ? 'ring-2 ring-rose-500 border-rose-500' : ''
                                    }`}
                                  >
                                    <div className="leading-tight">
                                      <div className="flex items-center justify-between gap-1 mb-0.5">
                                        <span className={`font-bold text-xs sm:text-sm tracking-tight truncate ${pal.textCode}`}>
                                          {event.code}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteCourse(event.courseId)}
                                          className="opacity-0 group-hover:opacity-100 hover:text-rose-600 transition p-0.5 rounded cursor-pointer"
                                          title="Delete course"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>

                                      {event.room && (
                                        <div className={`text-[10px] font-mono truncate flex items-center gap-1 mt-0.5 opacity-80 ${pal.textMeta}`}>
                                          <MapPin className="w-2.5 h-2.5 shrink-0" />
                                          <span>{event.room}</span>
                                        </div>
                                      )}
                                    </div>

                                    <div className={`text-[10px] font-mono font-semibold pt-1 truncate flex items-center gap-1 border-t border-black/5 dark:border-white/10 ${pal.textMeta}`}>
                                      <Clock className="w-2.5 h-2.5 shrink-0 opacity-75" />
                                      <span className="truncate">{formatClassTimeRange(event.startTime, event.endTime, totalCols > 1)}</span>
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
      )}

    </div>
  );
}

