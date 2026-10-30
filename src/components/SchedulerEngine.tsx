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
  AlertTriangle
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

// High-Contrast, Crystal-Clear Palettes (Super readable in both Light & Dark modes)
export const COLOR_PALETTES = [
  {
    id: 'blue',
    name: 'Sky Blue',
    dot: 'bg-sky-500',
    cardBg: 'bg-sky-50/95 dark:bg-[#0c1f36]',
    cardBorder: 'border-sky-300 dark:border-sky-500',
    leftBar: 'border-l-sky-500',
    textCode: 'text-sky-950 dark:text-white',
    textTitle: 'text-sky-900/90 dark:text-sky-100',
    textMeta: 'text-sky-800 dark:text-sky-200'
  },
  {
    id: 'emerald',
    name: 'Emerald Green',
    dot: 'bg-emerald-500',
    cardBg: 'bg-emerald-50/95 dark:bg-[#09261a]',
    cardBorder: 'border-emerald-300 dark:border-emerald-500',
    leftBar: 'border-l-emerald-500',
    textCode: 'text-emerald-950 dark:text-white',
    textTitle: 'text-emerald-900/90 dark:text-emerald-100',
    textMeta: 'text-emerald-800 dark:text-emerald-200'
  },
  {
    id: 'purple',
    name: 'Lavender Purple',
    dot: 'bg-purple-500',
    cardBg: 'bg-purple-50/95 dark:bg-[#25143a]',
    cardBorder: 'border-purple-300 dark:border-purple-400',
    leftBar: 'border-l-purple-500',
    textCode: 'text-purple-950 dark:text-white',
    textTitle: 'text-purple-900/90 dark:text-purple-100',
    textMeta: 'text-purple-800 dark:text-purple-200'
  },
  {
    id: 'amber',
    name: 'Warm Amber',
    dot: 'bg-amber-500',
    cardBg: 'bg-amber-50/95 dark:bg-[#2b1b0b]',
    cardBorder: 'border-amber-300 dark:border-amber-400',
    leftBar: 'border-l-amber-500',
    textCode: 'text-amber-950 dark:text-white',
    textTitle: 'text-amber-900/90 dark:text-amber-100',
    textMeta: 'text-amber-800 dark:text-amber-200'
  },
  {
    id: 'rose',
    name: 'Coral Rose',
    dot: 'bg-rose-500',
    cardBg: 'bg-rose-50/95 dark:bg-[#301019]',
    cardBorder: 'border-rose-300 dark:border-rose-400',
    leftBar: 'border-l-rose-500',
    textCode: 'text-rose-950 dark:text-white',
    textTitle: 'text-rose-900/90 dark:text-rose-100',
    textMeta: 'text-rose-800 dark:text-rose-200'
  },
  {
    id: 'indigo',
    name: 'Royal Indigo',
    dot: 'bg-indigo-500',
    cardBg: 'bg-indigo-50/95 dark:bg-[#141738]',
    cardBorder: 'border-indigo-300 dark:border-indigo-400',
    leftBar: 'border-l-indigo-500',
    textCode: 'text-indigo-950 dark:text-white',
    textTitle: 'text-indigo-900/90 dark:text-indigo-100',
    textMeta: 'text-indigo-800 dark:text-indigo-200'
  },
  {
    id: 'teal',
    name: 'Sea Teal',
    dot: 'bg-teal-500',
    cardBg: 'bg-teal-50/95 dark:bg-[#0a2324]',
    cardBorder: 'border-teal-300 dark:border-teal-400',
    leftBar: 'border-l-teal-500',
    textCode: 'text-teal-950 dark:text-white',
    textTitle: 'text-teal-900/90 dark:text-teal-100',
    textMeta: 'text-teal-800 dark:text-teal-200'
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
const HOUR_ROW_HEIGHT = 76;     // 76px per hour -> very spacious, easy to read even for kids!

// Parse time string e.g. "9:30 AM" or "09:30" or "9" or "2pm"
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

// Format minutes into clean "10:00 AM"
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

// Clean Single-Line Range Formatter (Prevents awkward wrapping)
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

// Sample Default Courses
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
      },
      {
        id: 'sec-cs101-2',
        name: 'Sec 02 (TTh)',
        days: ['Tue', 'Thu'],
        startTime: '01:00 PM',
        endTime: '02:30 PM',
        room: 'Gates Hall 204'
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
      },
      {
        id: 'sec-math21-2',
        name: 'Sec 02 (TTh)',
        days: ['Tue', 'Thu'],
        startTime: '09:00 AM',
        endTime: '10:30 AM',
        room: 'Math Hall 110'
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

export default function SchedulerEngine() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [banner, setBanner] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedDayFilter, setSelectedDayFilter] = useState<'ALL' | DayOfWeek>('ALL');

  // Mobile Tab: 'calendar' or 'form'
  const [mobileTab, setMobileTab] = useState<'calendar' | 'form'>('calendar');

  // Form Inputs
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [credits, setCredits] = useState(3);
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(['Mon', 'Wed', 'Fri']);
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('10:15 AM');
  const [room, setRoom] = useState('Room 101');
  const [colorIndex, setColorIndex] = useState(0);

  const timetableRef = useRef<HTMLDivElement>(null);

  // Initialize from LocalStorage or Demo Data
  useEffect(() => {
    try {
      const saved = localStorage.getItem('class_schedule_v3');
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

  // Save changes to LocalStorage
  useEffect(() => {
    if (courses.length > 0) {
      try {
        localStorage.setItem('class_schedule_v3', JSON.stringify(courses));
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

  // Preset Day Combos (MWF, TTh, Daily)
  const setPresetDays = (type: 'MWF' | 'TTH' | 'ALL') => {
    if (type === 'MWF') setSelectedDays(['Mon', 'Wed', 'Fri']);
    if (type === 'TTH') setSelectedDays(['Tue', 'Thu']);
    if (type === 'ALL') setSelectedDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  };

  // Add Course
  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const courseId = `c_${Date.now()}`;
    const secId = `sec_${Date.now()}`;

    const newCourse: Course = {
      id: courseId,
      code: code.trim().toUpperCase(),
      title: title.trim() || 'Class Lecture',
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
    setCode('');
    setTitle('');
    setColorIndex((colorIndex + 1) % COLOR_PALETTES.length);
    setBanner(`✓ ${newCourse.code} added to your schedule.`);
    setTimeout(() => setBanner(null), 3000);

    if (window.innerWidth < 1024) {
      setMobileTab('calendar');
    }
  };

  // Delete Course
  const handleDeleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  // Reset to Demo
  const handleReset = () => {
    if (confirm('Reset timetable to sample demonstration classes?')) {
      setCourses(INITIAL_DEMO_COURSES);
      localStorage.removeItem('class_schedule_v3');
      setBanner('Schedule reset to sample classes.');
      setTimeout(() => setBanner(null), 3000);
    }
  };

  // Clear All
  const handleClearAll = () => {
    if (confirm('Remove all classes from your timetable?')) {
      setCourses([]);
      localStorage.removeItem('class_schedule_v3');
    }
  };

  // Grid Event Structure
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

    const calendarStartMins = CALENDAR_START_HOUR * 60; // 480 (8 AM)
    const calendarEndMins = CALENDAR_END_HOUR * 60;     // 1200 (8 PM)

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
          const heightPx = Math.max((durationMins / 60) * HOUR_ROW_HEIGHT, 42); // minimum 42px height for readability

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

    DAYS.forEach(day => {
      const daySlots = (placedEventsByDay[day] || []).sort((a, b) => a.startMins - b.startMins);

      for (let i = 0; i < daySlots.length; i++) {
        if (daySlots[i].hasClash) conflicts++;

        if (i < daySlots.length - 1) {
          const gap = daySlots[i + 1].startMins - daySlots[i].endMins;
          if (gap > 0 && gap < 360) {
            totalGapMinutes += gap;
          }
        }
      }
    });

    return {
      totalCredits,
      coursesCount: courses.length,
      gapHours: (totalGapMinutes / 60).toFixed(1),
      conflicts: Math.floor(conflicts / 2)
    };
  }, [courses, placedEventsByDay]);

  // Gap Optimizer Permutation Engine
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
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
      setBanner(`✓ Optimized! Lowest gap found: ${(minGaps / 60).toFixed(1)} hrs.`);
      setTimeout(() => setBanner(null), 4000);
    } else {
      setBanner('No conflict-free combination found across active section timings.');
      setTimeout(() => setBanner(null), 4000);
    }
  };

  // Export .ICS
  const handleExportICS = () => {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ClassSchedule//ClassTimetable//EN',
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
        lines.push(`RRULE:FREQ=WEEKLY;BYDAY=${dayMap[day]};COUNT=16`);
        lines.push('BEGIN:VALARM');
        lines.push('TRIGGER:-PT15M');
        lines.push('ACTION:DISPLAY');
        lines.push(`DESCRIPTION:Upcoming Class: ${c.code}`);
        lines.push('END:VALARM');
        lines.push('END:VEVENT');
      });
    });

    lines.push('END:VCALENDAR');
    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-class-schedule.ics';
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
        backgroundColor: isDark ? '#18181b' : '#ffffff',
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

  // Hours list
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
    <div className="w-full space-y-4 font-sans text-zinc-900 dark:text-zinc-100">
      
      {/* Toast Alert Banner */}
      {banner && (
        <div className="p-3.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-between text-sm font-semibold shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <span>{banner}</span>
          </div>
          <button onClick={() => setBanner(null)} className="text-xs opacity-75 hover:opacity-100 cursor-pointer font-bold px-2 py-1">
            ✕ Dismiss
          </button>
        </div>
      )}

      {/* Mobile Top Navigation Tabs */}
      <div className="flex lg:hidden items-center p-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <button
          type="button"
          onClick={() => setMobileTab('calendar')}
          className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition ${
            mobileTab === 'calendar'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Weekly Timetable</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab('form')}
          className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition ${
            mobileTab === 'form'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Add Classes ({courses.length})</span>
        </button>
      </div>

      {/* Main Workbench Layout: 12 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Sidebar: Add Class Form (Col 1-4) */}
        <div className={`space-y-4 lg:col-span-4 ${mobileTab === 'form' ? 'block' : 'hidden lg:block'}`}>
          
          {/* Add Class Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-5 sm:p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>Add Class</span>
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Enter course details to place into your schedule
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                {courses.length} enrolled
              </span>
            </div>

            <form onSubmit={handleAddCourse} className="space-y-4">
              
              {/* Course Code & Credits */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">
                    Course Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="e.g. CS 101"
                    required
                    className="w-full h-11 px-3.5 text-sm font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">
                    Credits
                  </label>
                  <select
                    value={credits}
                    onChange={e => setCredits(Number(e.target.value))}
                    className="w-full h-11 px-2.5 text-sm font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map(cr => (
                      <option key={cr} value={cr}>{cr} cr</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Course Title */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">
                  Course Title <span className="text-zinc-400 dark:text-zinc-500 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Intro to Computer Science"
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              {/* Days Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    Days of Week <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    <button
                      type="button"
                      onClick={() => setPresetDays('MWF')}
                      className="hover:text-zinc-900 dark:hover:text-white underline cursor-pointer"
                    >
                      MWF
                    </button>
                    <span>&bull;</span>
                    <button
                      type="button"
                      onClick={() => setPresetDays('TTH')}
                      className="hover:text-zinc-900 dark:hover:text-white underline cursor-pointer"
                    >
                      TTh
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {DAYS.map(day => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`h-11 rounded-xl text-xs sm:text-sm font-bold transition border cursor-pointer flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-950 dark:border-white shadow-xs scale-[1.02]'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                        }`}
                      >
                        <span>{DAY_LABELS[day].short}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Class Timings */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">
                    Start Time <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    placeholder="09:00 AM"
                    list="start-times-list"
                    className="w-full h-11 px-3 text-sm font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                  <datalist id="start-times-list">
                    {COMMON_START_TIMES.map(t => (
                      <option key={t} value={t} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">
                    End Time <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    placeholder="10:15 AM"
                    list="end-times-list"
                    className="w-full h-11 px-3 text-sm font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                  <datalist id="end-times-list">
                    {COMMON_END_TIMES.map(t => (
                      <option key={t} value={t} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Room / Location */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">
                  Room / Location <span className="text-zinc-400 dark:text-zinc-500 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={room}
                  onChange={e => setRoom(e.target.value)}
                  placeholder="e.g. Turing Hall 101"
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              {/* Card Color Palette Selection */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-2">
                  Card Color
                </label>
                <div className="flex items-center gap-2.5">
                  {COLOR_PALETTES.map((pal, idx) => (
                    <button
                      key={pal.id}
                      type="button"
                      onClick={() => setColorIndex(idx)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer ${pal.dot} ${
                        colorIndex === idx
                          ? 'ring-3 ring-offset-2 ring-zinc-900 dark:ring-white scale-110'
                          : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                      title={pal.name}
                    >
                      {colorIndex === idx && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Big Primary Submit Button */}
              <button
                type="submit"
                className="w-full h-12 mt-2 bg-zinc-900 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-sm font-bold rounded-xl flex items-center justify-center gap-2.5 transition cursor-pointer shadow-md active:scale-[0.99]"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>+ Add Class to Timetable</span>
              </button>
            </form>
          </div>

          {/* Enrolled Classes List */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                My Classes ({courses.length})
              </span>
              {courses.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs font-semibold text-zinc-400 hover:text-rose-600 transition cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {courses.length === 0 ? (
              <div className="py-6 text-center text-xs text-zinc-400">
                No classes enrolled yet. Use the form above to add your schedule.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                {courses.map(course => {
                  const palette = COLOR_PALETTES[course.colorIndex % COLOR_PALETTES.length];
                  const sec = course.sections.find(s => s.id === course.selectedSectionId);
                  return (
                    <div
                      key={course.id}
                      className="p-3 rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/50 flex items-center justify-between gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${palette.dot}`} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-zinc-900 dark:text-white">
                              {course.code}
                            </span>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
                              ({course.credits} cr)
                            </span>
                          </div>
                          <div className="text-xs text-zinc-600 dark:text-zinc-300 truncate font-medium">
                            {course.title}
                          </div>
                          {sec && (
                            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-1 mt-0.5">
                              <span className="font-bold text-zinc-700 dark:text-zinc-200">{sec.days.join(', ')}</span>
                              <span>&bull;</span>
                              <span>{formatClassTimeRange(sec.startTime, sec.endTime)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-zinc-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition shrink-0 cursor-pointer"
                        title="Delete class"
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

        {/* Right Timetable Matrix: Real Apple/Google Calendar Layout (Col 5-12) */}
        <div className={`space-y-4 lg:col-span-8 ${mobileTab === 'calendar' ? 'block' : 'hidden lg:block'}`}>
          
          {/* Calendar Toolbar with Generous Breathing Space */}
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
            
            {/* Live Stats Chips */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm font-semibold">
              <div className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center gap-2 border border-zinc-200 dark:border-zinc-700">
                <BookOpen className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
                <span>{metrics.totalCredits} Credits</span>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center gap-2 border border-zinc-200 dark:border-zinc-700">
                <Clock className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
                <span>Gaps: {metrics.gapHours}h</span>
              </div>

              <div className="inline-flex px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-850 items-center gap-2">
                {metrics.conflicts === 0 ? (
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">Conflict-Free</span>
                ) : (
                  <span className="text-zinc-900 dark:text-white font-semibold">{metrics.conflicts} Conflict(s)</span>
                )}
              </div>
            </div>

            {/* Quick Action Buttons (Spacious, Well-Padded, Distinct Icons) */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleOptimizeGaps}
                className="h-10 px-4 rounded-xl bg-zinc-900 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition active:scale-98 cursor-pointer"
                title="Automatically choose sections with minimum campus waiting time"
              >
                <span>Auto-Optimize</span>
              </button>

              <button
                onClick={handleExportICS}
                className="h-10 px-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-100 text-xs sm:text-sm font-semibold flex items-center gap-2 transition cursor-pointer"
                title="Export .ICS for Apple Calendar, Google Calendar, and Outlook"
              >
                <Calendar className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
                <span className="hidden sm:inline">Export .ICS</span>
              </button>

              <button
                onClick={handleExportPNG}
                disabled={isExporting}
                className="w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 flex items-center justify-center transition cursor-pointer shadow-2xs"
                title="Download High-Res PNG wallpaper"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={() => window.print()}
                className="w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 flex items-center justify-center transition cursor-pointer shadow-2xs"
                title="Print timetable"
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                onClick={handleReset}
                className="w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-300 flex items-center justify-center transition cursor-pointer shadow-2xs"
                title="Reset to sample schedule"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Real Calendar Grid Container */}
          <div
            ref={timetableRef}
            className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm timetable-print-target overflow-hidden"
          >
            {/* Calendar Canvas Header */}
            <div className="px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-850">
              <div className="flex items-center gap-2.5">
                <CalendarDays className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                <span className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
                  Weekly Class Timetable
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium hidden md:inline">
                  &bull; Monday to Friday (08:00 AM – 08:00 PM)
                </span>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                {courses.length} Classes Enrolled
              </div>
            </div>

            {/* Timetable Matrix */}
            <div className="overflow-x-auto">
              <div className="min-w-[680px]">
                
                {/* Day Header Columns */}
                <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-800/80">
                  {/* Left Time Axis Spacing (64px fixed width) */}
                  <div className="w-[64px] shrink-0 border-r border-zinc-200 dark:border-zinc-800 py-3 text-center">
                    <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      TIME
                    </span>
                  </div>

                  {/* Day Columns */}
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

                {/* Calendar Body: Hours Grid & Event Overlay */}
                <div className="relative flex" style={{ height: `${totalGridHeight}px` }}>
                  
                  {/* Left Time Column (64px width, crystal-clear labels) */}
                  <div className="w-[64px] shrink-0 relative border-r border-zinc-200 dark:border-zinc-800 select-none bg-zinc-50/50 dark:bg-zinc-900">
                    {hoursList.slice(0, -1).map(item => (
                      <div
                        key={item.hour}
                        style={{ height: `${HOUR_ROW_HEIGHT}px` }}
                        className="border-b border-zinc-200 dark:border-zinc-800 flex items-start justify-end pr-2.5 pt-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400"
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>

                  {/* 5 Day Columns Area */}
                  <div className="flex-1 relative h-full">
                    
                    {/* Background Hour Lines (Solid on hour, subtle on half-hour) */}
                    <div className="absolute inset-0 pointer-events-none select-none">
                      {hoursList.slice(0, -1).map(item => (
                        <div
                          key={item.hour}
                          style={{ height: `${HOUR_ROW_HEIGHT}px` }}
                          className="border-b border-zinc-200 dark:border-zinc-800 relative"
                        >
                          {/* Half-hour marker line */}
                          <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-zinc-100 dark:border-zinc-800/60" />
                        </div>
                      ))}
                    </div>

                    {/* 5 Vertical Columns */}
                    <div className="grid grid-cols-5 h-full relative">
                      {DAYS.map(day => {
                        const events = placedEventsByDay[day] || [];
                        return (
                          <div
                            key={day}
                            className="relative h-full border-r border-zinc-200 dark:border-zinc-800 last:border-r-0"
                          >
                            {events.map(event => {
                              const palette = COLOR_PALETTES[event.colorIndex % COLOR_PALETTES.length];

                              // Dynamic Side-by-Side Collision Positioning
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
                                  className={`absolute rounded-xl border p-2 sm:p-2.5 transition-all shadow-sm hover:shadow-md hover:scale-[1.01] hover:z-30 overflow-hidden flex flex-col justify-between group cursor-default select-none ${palette.cardBg} ${palette.cardBorder} border-l-4 ${palette.leftBar} ${
                                    isClashed ? 'ring-2 ring-rose-500 border-rose-500' : ''
                                  }`}
                                  title={`${event.code} - ${event.title}\n${event.startTime} - ${event.endTime}\n${event.room}`}
                                >
                                  {/* Top Row: Code + Close Button */}
                                  <div className="leading-tight">
                                    <div className="flex items-center justify-between gap-1 mb-1">
                                      <span className={`font-bold text-xs sm:text-sm tracking-tight truncate ${palette.textCode}`}>
                                        {event.code}
                                      </span>
                                      
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteCourse(event.courseId);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 hover:text-rose-600 transition p-1 rounded-md cursor-pointer"
                                        title="Delete class"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>

                                    {/* Title */}
                                    <div className={`text-xs font-semibold truncate leading-snug ${palette.textTitle}`}>
                                      {event.title}
                                    </div>

                                    {/* Room */}
                                    {event.room && (
                                      <div className={`text-[11px] font-medium truncate flex items-center gap-1 mt-1 opacity-90 ${palette.textMeta}`}>
                                        <MapPin className="w-3 h-3 shrink-0" />
                                        <span>{event.room}</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Bottom Time Stamp (Clean single line without awkward wrapping) */}
                                  <div className={`text-[11px] font-semibold pt-1 truncate flex items-center gap-1 border-t border-black/10 dark:border-white/15 ${palette.textMeta}`}>
                                    <Clock className="w-3 h-3 shrink-0 opacity-80" />
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

    </div>
  );
}
