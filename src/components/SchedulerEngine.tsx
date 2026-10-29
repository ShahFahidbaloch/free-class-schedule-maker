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
  ChevronRight, 
  Layers, 
  Check, 
  Sliders,
  Info
} from 'lucide-react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

// Types
export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';

export interface TimeSlot {
  day: DayOfWeek;
  startTime: string; // "09:00"
  endTime: string;   // "10:30"
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

// 8 Apple-grade subtle pastel palettes
export const PASTEL_PALETTES = [
  {
    name: 'Soft Emerald',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-800/60',
    text: 'text-emerald-900 dark:text-emerald-200',
    chip: 'bg-emerald-500',
    badge: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
  },
  {
    name: 'Muted Sky',
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    border: 'border-sky-200 dark:border-sky-800/60',
    text: 'text-sky-900 dark:text-sky-200',
    chip: 'bg-sky-500',
    badge: 'bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300'
  },
  {
    name: 'Lavender',
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    border: 'border-indigo-200 dark:border-indigo-800/60',
    text: 'text-indigo-900 dark:text-indigo-200',
    chip: 'bg-indigo-500',
    badge: 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300'
  },
  {
    name: 'Subtle Rose',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-200 dark:border-rose-800/60',
    text: 'text-rose-900 dark:text-rose-200',
    chip: 'bg-rose-500',
    badge: 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300'
  },
  {
    name: 'Warm Amber',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800/60',
    text: 'text-amber-900 dark:text-amber-200',
    chip: 'bg-amber-500',
    badge: 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
  },
  {
    name: 'Cool Slate',
    bg: 'bg-zinc-100 dark:bg-zinc-900/70',
    border: 'border-zinc-300 dark:border-zinc-700/60',
    text: 'text-zinc-900 dark:text-zinc-200',
    chip: 'bg-zinc-500',
    badge: 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300'
  },
  {
    name: 'Lilac Violet',
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    border: 'border-purple-200 dark:border-purple-800/60',
    text: 'text-purple-900 dark:text-purple-200',
    chip: 'bg-purple-500',
    badge: 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300'
  },
  {
    name: 'Mint Teal',
    bg: 'bg-teal-50 dark:bg-teal-950/40',
    border: 'border-teal-200 dark:border-teal-800/60',
    text: 'text-teal-900 dark:text-teal-200',
    chip: 'bg-teal-500',
    badge: 'bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300'
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

const START_HOUR = 8; // 8:00 AM
const END_HOUR = 20;  // 8:00 PM
const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60; // 720 minutes

// Helper to convert "09:30" -> minutes from midnight
function toMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

// Convert minutes to clean 12-hour format "9:30 AM"
function formatTime12(timeStr: string): string {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  const displayM = m < 10 ? `0${m}` : m;
  return `${displayH}:${displayM} ${ampm}`;
}

// Default Ivy League Sample Courses
const SAMPLE_COURSES: Course[] = [
  {
    id: 'c1',
    code: 'CS 106A',
    title: 'Programming Methodology',
    credits: 4,
    colorIndex: 1, // Muted Sky
    selectedSectionId: 's1-a',
    sections: [
      {
        id: 's1-a',
        name: 'Sec 01 (MWF Morning)',
        slots: [
          { day: 'Mon', startTime: '10:00', endTime: '11:15' },
          { day: 'Wed', startTime: '10:00', endTime: '11:15' },
          { day: 'Fri', startTime: '10:00', endTime: '11:15' }
        ]
      },
      {
        id: 's1-b',
        name: 'Sec 02 (TTh Afternoon)',
        slots: [
          { day: 'Tue', startTime: '13:30', endTime: '15:00' },
          { day: 'Thu', startTime: '13:30', endTime: '15:00' }
        ]
      }
    ]
  },
  {
    id: 'c2',
    code: 'MATH 51',
    title: 'Linear Algebra & Multivariable',
    credits: 4,
    colorIndex: 0, // Soft Emerald
    selectedSectionId: 's2-a',
    sections: [
      {
        id: 's2-a',
        name: 'Sec 01 (MWF Late Morning)',
        slots: [
          { day: 'Mon', startTime: '11:30', endTime: '12:45' },
          { day: 'Wed', startTime: '11:30', endTime: '12:45' },
          { day: 'Fri', startTime: '11:30', endTime: '12:45' }
        ]
      },
      {
        id: 's2-b',
        name: 'Sec 02 (TTh Morning)',
        slots: [
          { day: 'Tue', startTime: '09:00', endTime: '10:30' },
          { day: 'Thu', startTime: '09:00', endTime: '10:30' }
        ]
      }
    ]
  },
  {
    id: 'c3',
    code: 'PHYS 41',
    title: 'Mechanics & Kinetics',
    credits: 4,
    colorIndex: 4, // Warm Amber
    selectedSectionId: 's3-a',
    sections: [
      {
        id: 's3-a',
        name: 'Sec 01 (MWF Early Afternoon)',
        slots: [
          { day: 'Mon', startTime: '13:30', endTime: '14:45' },
          { day: 'Wed', startTime: '13:30', endTime: '14:45' },
          { day: 'Fri', startTime: '13:30', endTime: '14:45' }
        ]
      },
      {
        id: 's3-b',
        name: 'Sec 02 (TTh Midday)',
        slots: [
          { day: 'Tue', startTime: '11:00', endTime: '12:30' },
          { day: 'Thu', startTime: '11:00', endTime: '12:30' }
        ]
      }
    ]
  },
  {
    id: 'c4',
    code: 'ECON 50',
    title: 'Economic Analysis & Decision',
    credits: 3,
    colorIndex: 2, // Lavender
    selectedSectionId: 's4-a',
    sections: [
      {
        id: 's4-a',
        name: 'Sec 01 (MW Afternoon)',
        slots: [
          { day: 'Mon', startTime: '15:15', endTime: '16:45' },
          { day: 'Wed', startTime: '15:15', endTime: '16:45' }
        ]
      },
      {
        id: 's4-b',
        name: 'Sec 02 (TTh Late Afternoon)',
        slots: [
          { day: 'Tue', startTime: '15:30', endTime: '17:00' },
          { day: 'Thu', startTime: '15:30', endTime: '17:00' }
        ]
      }
    ]
  }
];

export default function SchedulerEngine() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [strategy, setStrategy] = useState<'compact' | 'balanced'>('compact');
  const [mobileDay, setMobileDay] = useState<DayOfWeek>('Mon');
  const [optimizationMessage, setOptimizationMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  const timetableRef = useRef<HTMLDivElement>(null);

  // Initialize from LocalStorage or Load Ivy League Sample
  useEffect(() => {
    try {
      const saved = localStorage.getItem('class_schedule_optimizer_state_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCourses(parsed);
          setEditingCourseId(parsed[0].id);
          return;
        }
      }
    } catch {
      // ignore
    }
    setCourses(SAMPLE_COURSES);
    setEditingCourseId(SAMPLE_COURSES[0].id);
  }, []);

  // Sync to LocalStorage on change
  useEffect(() => {
    if (courses.length > 0) {
      try {
        localStorage.setItem('class_schedule_optimizer_state_v2', JSON.stringify(courses));
      } catch {
        // ignore
      }
    }
  }, [courses]);

  // Compute Placed Events on Grid
  interface PlacedEvent {
    courseId: string;
    courseCode: string;
    courseTitle: string;
    sectionName: string;
    credits: number;
    colorIndex: number;
    day: DayOfWeek;
    startTime: string;
    endTime: string;
    startMins: number;
    endMins: number;
    topPercent: number;
    heightPercent: number;
  }

  const placedEvents = useMemo(() => {
    const list: PlacedEvent[] = [];
    courses.forEach(course => {
      const activeSection = course.sections.find(s => s.id === course.selectedSectionId);
      if (!activeSection) return;

      activeSection.slots.forEach(slot => {
        const startMins = toMinutes(slot.startTime);
        const endMins = toMinutes(slot.endTime);
        const dayStartMins = START_HOUR * 60; // 480

        const clampedStart = Math.max(dayStartMins, startMins);
        const clampedEnd = Math.min(END_HOUR * 60, endMins);

        if (clampedEnd > clampedStart) {
          const topPercent = ((clampedStart - dayStartMins) / TOTAL_MINUTES) * 100;
          const heightPercent = ((clampedEnd - clampedStart) / TOTAL_MINUTES) * 100;

          list.push({
            courseId: course.id,
            courseCode: course.code,
            courseTitle: course.title,
            sectionName: activeSection.name,
            credits: course.credits,
            colorIndex: course.colorIndex,
            day: slot.day,
            startTime: slot.startTime,
            endTime: slot.endTime,
            startMins,
            endMins,
            topPercent,
            heightPercent
          });
        }
      });
    });
    return list;
  }, [courses]);

  // Metrics Calculation: Total Credits, Idle Gaps, Clashes & Warnings
  const metrics = useMemo(() => {
    const totalCredits = courses.reduce((acc, c) => acc + (c.credits || 0), 0);

    let totalGapMinutes = 0;
    let longestGapMinutes = 0;
    let longestGapDay: DayOfWeek | null = null;
    let clashCount = 0;

    // Check each day's intervals
    DAYS.forEach(day => {
      const dayEvents = placedEvents
        .filter(e => e.day === day)
        .sort((a, b) => a.startMins - b.startMins);

      for (let i = 0; i < dayEvents.length; i++) {
        // Clash detection with subsequent events
        for (let j = i + 1; j < dayEvents.length; j++) {
          if (dayEvents[i].endMins > dayEvents[j].startMins) {
            clashCount++;
          }
        }

        // Gap calculation between consecutive events
        if (i < dayEvents.length - 1) {
          const gap = dayEvents[i + 1].startMins - dayEvents[i].endMins;
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
      totalGapMinutes,
      gapHours,
      longestGapMinutes,
      longestGapHours,
      longestGapDay,
      clashCount
    };
  }, [courses, placedEvents]);

  // One-Click Gap Optimizer Algorithm
  const handleOptimizeGaps = () => {
    if (courses.length === 0) return;

    // Generate Cartesian product of all section choices
    const courseSectionsList = courses.map(c => c.sections.map(s => ({ courseId: c.id, sectionId: s.id, slots: s.slots })));

    function cartesian<T>(arrays: T[][]): T[][] {
      return arrays.reduce<T[][]>(
        (acc, curr) => acc.flatMap(x => curr.map(y => [...x, y])),
        [[]]
      );
    }

    const allCombinations = cartesian(courseSectionsList);

    let bestCombination: { courseId: string; sectionId: string }[] | null = null;
    let lowestPenalty = Infinity;
    let validCombosCount = 0;

    for (const combo of allCombinations) {
      // Gather all slots in this combination
      const allSlots: { day: DayOfWeek; startMins: number; endMins: number }[] = [];
      let hasClash = false;

      for (const item of combo) {
        for (const slot of item.slots) {
          const sMin = toMinutes(slot.startTime);
          const eMin = toMinutes(slot.endTime);

          // Check clash against existing slots
          for (const existing of allSlots) {
            if (existing.day === slot.day) {
              if (Math.max(existing.startMins, sMin) < Math.min(existing.endMins, eMin)) {
                hasClash = true;
                break;
              }
            }
          }
          if (hasClash) break;
          allSlots.push({ day: slot.day, startMins: sMin, endMins: eMin });
        }
        if (hasClash) break;
      }

      if (hasClash) continue;
      validCombosCount++;

      // Calculate penalties based on strategy
      let totalGaps = 0;
      let maxSingleGap = 0;
      const activeDays = new Set<DayOfWeek>();

      DAYS.forEach(day => {
        const slotsOnDay = allSlots.filter(s => s.day === day).sort((a, b) => a.startMins - b.startMins);
        if (slotsOnDay.length > 0) activeDays.add(day);

        for (let i = 0; i < slotsOnDay.length - 1; i++) {
          const gap = slotsOnDay[i + 1].startMins - slotsOnDay[i].endMins;
          if (gap > 0) {
            totalGaps += gap;
            if (gap > maxSingleGap) maxSingleGap = gap;
          }
        }
      });

      let penalty = 0;
      if (strategy === 'compact') {
        // Heavily favor fewer campus days and least idle gap time
        penalty = totalGaps * 1.5 + (activeDays.size * 90) + maxSingleGap;
      } else {
        // Balanced spread: penalize extreme daily concentrations
        const dayCountVariance = Math.abs(activeDays.size - 4) * 60;
        penalty = totalGaps + dayCountVariance + (maxSingleGap > 90 ? 150 : 0);
      }

      if (penalty < lowestPenalty) {
        lowestPenalty = penalty;
        bestCombination = combo;
      }
    }

    if (bestCombination) {
      // Apply the winning combination
      setCourses(prev =>
        prev.map(c => {
          const match = bestCombination!.find(b => b.courseId === c.id);
          return match ? { ...c, selectedSectionId: match.sectionId } : c;
        })
      );

      // Trigger Celebration Fireworks
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      setOptimizationMessage(`Found optimal conflict-free timetable across ${validCombosCount} valid permutations!`);
      setTimeout(() => setOptimizationMessage(null), 6000);
    } else {
      setOptimizationMessage("No conflict-free combination found. Try adding alternate section timings.");
      setTimeout(() => setOptimizationMessage(null), 6000);
    }
  };

  // Add New Course
  const handleAddCourse = () => {
    const nextColor = courses.length % PASTEL_PALETTES.length;
    const newCourseId = `c_${Date.now()}`;
    const newSectionId = `s_${Date.now()}`;

    const newCourse: Course = {
      id: newCourseId,
      code: `COURSE ${courses.length + 1}01`,
      title: 'New Academic Subject',
      credits: 3,
      colorIndex: nextColor,
      selectedSectionId: newSectionId,
      sections: [
        {
          id: newSectionId,
          name: 'Section A (Primary)',
          slots: [
            { day: 'Mon', startTime: '09:00', endTime: '10:15' },
            { day: 'Wed', startTime: '09:00', endTime: '10:15' }
          ]
        }
      ]
    };

    setCourses(prev => [...prev, newCourse]);
    setEditingCourseId(newCourseId);
  };

  // Delete Course
  const handleDeleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    if (editingCourseId === id) {
      const remaining = courses.filter(c => c.id !== id);
      setEditingCourseId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  // Add Alternative Section to a Course
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
            { day: 'Tue', startTime: '10:00', endTime: '11:15' },
            { day: 'Thu', startTime: '10:00', endTime: '11:15' }
          ]
        };
        return {
          ...c,
          sections: [...c.sections, newSec]
        };
      })
    );
  };

  // Delete Section
  const handleDeleteSection = (courseId: string, sectionId: string) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id !== courseId) return c;
        if (c.sections.length <= 1) return c; // keep at least 1
        const remaining = c.sections.filter(s => s.id !== sectionId);
        const newSelected = c.selectedSectionId === sectionId ? remaining[0].id : c.selectedSectionId;
        return {
          ...c,
          sections: remaining,
          selectedSectionId: newSelected
        };
      })
    );
  };

  // Add Slot to Section
  const handleAddSlot = (courseId: string, sectionId: string) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          sections: c.sections.map(s => {
            if (s.id !== sectionId) return s;
            return {
              ...s,
              slots: [...s.slots, { day: 'Fri', startTime: '13:00', endTime: '14:15' }]
            };
          })
        };
      })
    );
  };

  // Remove Slot
  const handleRemoveSlot = (courseId: string, sectionId: string, slotIdx: number) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          sections: c.sections.map(s => {
            if (s.id !== sectionId) return s;
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

  // Update Slot
  const handleUpdateSlot = (
    courseId: string, 
    sectionId: string, 
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
            if (s.id !== sectionId) return s;
            return {
              ...s,
              slots: s.slots.map((slot, idx) => (idx === slotIdx ? { ...slot, [field]: value } : slot))
            };
          })
        };
      })
    );
  };

  // Export to High-Res PNG
  const handleExportPNG = async () => {
    if (!timetableRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(timetableRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2
      });
      const link = document.createElement('a');
      link.download = 'college-class-schedule-optimizer.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('PNG export failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Print Timetable
  const handlePrint = () => {
    window.print();
  };

  // Export to .ics Calendar (RFC 5545)
  const handleExportICS = () => {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ClassScheduleOptimizer//Academic Timetable//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    const dayToIcal: Record<DayOfWeek, string> = {
      Mon: 'MO',
      Tue: 'TU',
      Wed: 'WE',
      Thu: 'TH',
      Fri: 'FR'
    };

    // Calculate next Monday date for recurring start
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sun, 1 is Mon
    const daysUntilMonday = (1 + 7 - dayOfWeek) % 7 || 7;
    const baseMonday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysUntilMonday);

    courses.forEach(c => {
      const activeSection = c.sections.find(s => s.id === c.selectedSectionId);
      if (!activeSection) return;

      activeSection.slots.forEach(slot => {
        const dayOffset = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].indexOf(slot.day);
        const eventDate = new Date(baseMonday.getTime() + dayOffset * 86400000);

        const y = eventDate.getFullYear();
        const m = String(eventDate.getMonth() + 1).padStart(2, '0');
        const d = String(eventDate.getDate()).padStart(2, '0');

        const [startH, startM] = slot.startTime.split(':');
        const [endH, endM] = slot.endTime.split(':');

        const dtStart = `${y}${m}${d}T${startH}${startM}00`;
        const dtEnd = `${y}${m}${d}T${endH}${endM}00`;

        // 15 weeks semester until date
        const untilDate = new Date(baseMonday.getTime() + 15 * 7 * 86400000);
        const uy = untilDate.getFullYear();
        const um = String(untilDate.getMonth() + 1).padStart(2, '0');
        const ud = String(untilDate.getDate()).padStart(2, '0');
        const untilStr = `${uy}${um}${ud}T235959Z`;

        lines.push('BEGIN:VEVENT');
        lines.push(`UID:${c.id}-${slot.day}-${slot.startTime}-${Date.now()}@classscheduleoptimizer.com`);
        lines.push(`SUMMARY:${c.code} - ${c.title}`);
        lines.push(`DESCRIPTION:Section: ${activeSection.name} (${c.credits} Credit Hours)`);
        lines.push(`DTSTART:${dtStart}`);
        lines.push(`DTEND:${dtEnd}`);
        lines.push(`RRULE:FREQ=WEEKLY;BYDAY=${dayToIcal[slot.day]};UNTIL=${untilStr}`);
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
    a.download = 'semester-class-schedule.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Reset to Ivy League defaults
  const handleReset = () => {
    if (confirm("Reset to default Ivy League sample schedule?")) {
      setCourses(SAMPLE_COURSES);
      setEditingCourseId(SAMPLE_COURSES[0].id);
      localStorage.removeItem('class_schedule_optimizer_state_v2');
    }
  };

  const activeCourse = courses.find(c => c.id === editingCourseId);

  return (
    <div className="w-full space-y-6">
      {/* Optimization Notice Banner */}
      {optimizationMessage && (
        <div className="p-4 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-between text-sm font-medium shadow-lg animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{optimizationMessage}</span>
          </div>
          <button 
            onClick={() => setOptimizationMessage(null)}
            className="text-xs opacity-75 hover:opacity-100 transition-opacity"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Control Bar: Strategies & Action Suite */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-xs font-medium text-zinc-600 dark:text-zinc-300">
            <button
              onClick={() => setStrategy('compact')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                strategy === 'compact'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs font-semibold'
                  : 'hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              Prioritize Smallest Gaps
            </button>
            <button
              onClick={() => setStrategy('balanced')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                strategy === 'balanced'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs font-semibold'
                  : 'hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              Balanced Spread (MWF / TTh)
            </button>
          </div>

          <button
            onClick={handleOptimizeGaps}
            className="px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 text-xs font-semibold flex items-center gap-2 shadow-xs transition-all active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5" />
            One-Click Gap Optimizer
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPNG}
            disabled={isExporting}
            className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Download visual schedule as PNG"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PNG</span>
          </button>

          <button
            onClick={handleExportICS}
            className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Export to Apple / Google Calendar (.ics)"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Sync iCal</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Print schedule"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            title="Reset sample schedule"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Live Metrics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80">
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Enrolled Credits</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{metrics.totalCredits}</span>
            <span className="text-[11px] text-zinc-400">
              {metrics.totalCredits >= 12 && metrics.totalCredits <= 18 ? 'Full-Time Optimal' : 'Part-Time / Overload'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80">
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Total Dead Gaps</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{metrics.gapHours}h</span>
            <span className="text-[11px] text-zinc-400">weekly idle limbo</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80">
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium mb-1">
            <AlertTriangle className={`w-3.5 h-3.5 ${metrics.longestGapMinutes > 90 ? 'text-amber-500' : 'text-zinc-400'}`} />
            <span>Longest Single Gap</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold tracking-tight ${metrics.longestGapMinutes > 90 ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-900 dark:text-white'}`}>
              {metrics.longestGapHours}h
            </span>
            <span className="text-[11px] text-zinc-400">
              {metrics.longestGapDay ? `on ${metrics.longestGapDay}` : 'none'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80">
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Clash Status</span>
          </div>
          <div className="flex items-baseline gap-2">
            {metrics.clashCount === 0 ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                <Check className="w-4 h-4" /> 0 Conflicts
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-4 h-4" /> {metrics.clashCount} Conflict(s)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Two-Deck Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Deck: Course & Section Input (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Registered Courses ({courses.length})</h3>
                <p className="text-xs text-zinc-500">Configure alternative timing slots for optimization</p>
              </div>
              <button
                onClick={handleAddCourse}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Course
              </button>
            </div>

            {/* Course Selector Tabs */}
            <div className="flex flex-wrap gap-2">
              {courses.map(course => {
                const palette = PASTEL_PALETTES[course.colorIndex % PASTEL_PALETTES.length];
                const isSelected = course.id === editingCourseId;
                return (
                  <button
                    key={course.id}
                    onClick={() => setEditingCourseId(course.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 border transition-all ${
                      isSelected
                        ? `${palette.bg} ${palette.border} ${palette.text} shadow-xs font-semibold`
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-xs ${palette.chip}`}></span>
                    <span>{course.code || 'Untitled'}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Course Editor */}
            {activeCourse ? (
              <div className="pt-2 space-y-4">
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                      Course Parameters
                    </span>
                    <button
                      onClick={() => handleDeleteCourse(activeCourse.id)}
                      className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove Course
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="block text-[11px] font-medium text-zinc-500 mb-1">Course Code</label>
                      <input
                        type="text"
                        value={activeCourse.code}
                        onChange={e => {
                          const val = e.target.value;
                          setCourses(prev => prev.map(c => (c.id === activeCourse.id ? { ...c, code: val } : c)));
                        }}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                        placeholder="e.g. CS101"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-500 mb-1">Credits</label>
                      <input
                        type="number"
                        min="1"
                        max="8"
                        value={activeCourse.credits}
                        onChange={e => {
                          const val = Number(e.target.value);
                          setCourses(prev => prev.map(c => (c.id === activeCourse.id ? { ...c, credits: val } : c)));
                        }}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 mb-1">Course Title</label>
                    <input
                      type="text"
                      value={activeCourse.title}
                      onChange={e => {
                        const val = e.target.value;
                        setCourses(prev => prev.map(c => (c.id === activeCourse.id ? { ...c, title: val } : c)));
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                      placeholder="e.g. Intro to Computer Science"
                    />
                  </div>

                  {/* Pastel Color Tag Picker */}
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 mb-1.5">Color Tag</label>
                    <div className="flex items-center gap-2">
                      {PASTEL_PALETTES.map((pal, idx) => (
                        <button
                          key={pal.name}
                          type="button"
                          onClick={() => {
                            setCourses(prev => prev.map(c => (c.id === activeCourse.id ? { ...c, colorIndex: idx } : c)));
                          }}
                          className={`w-5 h-5 rounded-md ${pal.chip} flex items-center justify-center transition-all ${
                            activeCourse.colorIndex % PASTEL_PALETTES.length === idx ? 'ring-2 ring-zinc-900 dark:ring-white scale-105' : 'opacity-70 hover:opacity-100'
                          }`}
                          title={pal.name}
                        >
                          {activeCourse.colorIndex % PASTEL_PALETTES.length === idx && (
                            <Check className="w-3.5 h-3.5 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section Alternatives Deck */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-900 dark:text-white">Alternative Section Timings</h4>
                      <p className="text-[11px] text-zinc-500">Add lecture / lab options so the optimizer can find the best fit</p>
                    </div>
                    <button
                      onClick={() => handleAddSection(activeCourse.id)}
                      className="text-xs font-medium text-zinc-900 dark:text-white hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Section
                    </button>
                  </div>

                  {activeCourse.sections.map((section, secIdx) => {
                    const isSelectedSection = activeCourse.selectedSectionId === section.id;
                    return (
                      <div
                        key={section.id}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isSelectedSection
                            ? 'bg-zinc-50/80 dark:bg-zinc-900/60 border-zinc-900 dark:border-white shadow-xs'
                            : 'bg-white dark:bg-zinc-900/20 border-zinc-200 dark:border-zinc-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`active_section_${activeCourse.id}`}
                              checked={isSelectedSection}
                              onChange={() => {
                                setCourses(prev =>
                                  prev.map(c => (c.id === activeCourse.id ? { ...c, selectedSectionId: section.id } : c))
                                );
                              }}
                              className="text-zinc-900 dark:text-white focus:ring-0 cursor-pointer"
                              id={`radio_${section.id}`}
                            />
                            <label htmlFor={`radio_${section.id}`} className="text-xs font-semibold text-zinc-900 dark:text-white cursor-pointer">
                              {section.name}
                            </label>
                            {isSelectedSection && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium">
                                Active on Grid
                              </span>
                            )}
                          </div>

                          {activeCourse.sections.length > 1 && (
                            <button
                              onClick={() => handleDeleteSection(activeCourse.id, section.id)}
                              className="text-zinc-400 hover:text-rose-500 transition-colors"
                              title="Delete this section"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Slots for this Section */}
                        <div className="space-y-2">
                          {section.slots.map((slot, slotIdx) => (
                            <div key={slotIdx} className="grid grid-cols-12 gap-1.5 items-center">
                              {/* Day Selector */}
                              <div className="col-span-4">
                                <select
                                  value={slot.day}
                                  onChange={e => handleUpdateSlot(activeCourse.id, section.id, slotIdx, 'day', e.target.value)}
                                  className="w-full px-2 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                                >
                                  {DAYS.map(d => (
                                    <option key={d} value={d}>
                                      {DAY_FULL_NAMES[d]}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Start Time */}
                              <div className="col-span-3">
                                <input
                                  type="time"
                                  value={slot.startTime}
                                  onChange={e => handleUpdateSlot(activeCourse.id, section.id, slotIdx, 'startTime', e.target.value)}
                                  className="w-full px-1.5 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                                />
                              </div>

                              <div className="col-span-1 text-center text-zinc-400 text-xs">-</div>

                              {/* End Time */}
                              <div className="col-span-3">
                                <input
                                  type="time"
                                  value={slot.endTime}
                                  onChange={e => handleUpdateSlot(activeCourse.id, section.id, slotIdx, 'endTime', e.target.value)}
                                  className="w-full px-1.5 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                                />
                              </div>

                              {/* Remove Slot */}
                              <div className="col-span-1 flex justify-center">
                                {section.slots.length > 1 && (
                                  <button
                                    onClick={() => handleRemoveSlot(activeCourse.id, section.id, slotIdx)}
                                    className="text-zinc-400 hover:text-rose-500"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex justify-end">
                          <button
                            onClick={() => handleAddSlot(activeCourse.id, section.id)}
                            className="text-[11px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 font-medium"
                          >
                            <Plus className="w-3 h-3" /> Add recurring class day
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-zinc-400 text-xs">
                No course selected. Click "Add Course" above to start.
              </div>
            )}
          </div>
        </div>

        {/* Right Deck: Visual Timetable Grid (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Mobile Day Selector Tabs */}
          <div className="flex md:hidden items-center justify-between p-1.5 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800">
            {DAYS.map(day => (
              <button
                key={day}
                onClick={() => setMobileDay(day)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  mobileDay === day
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* The Calendar Matrix Target */}
          <div
            ref={timetableRef}
            className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs timetable-print-target overflow-hidden"
          >
            {/* Header info bar */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800/60 mb-3">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Weekly Class Schedule</h3>
                <p className="text-xs text-zinc-500">8:00 AM – 8:00 PM • Monday through Friday</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-medium text-zinc-500">Active Load:</span>{' '}
                <span className="text-xs font-bold text-zinc-900 dark:text-white">{metrics.totalCredits} Credits</span>
              </div>
            </div>

            {/* Grid Container */}
            <div className="relative overflow-x-auto">
              <div className="min-w-[620px] md:min-w-0">
                {/* Day Headers */}
                <div className="grid grid-cols-11 border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-2">
                  <div className="col-span-1 text-[11px] font-medium text-zinc-400 text-center">Time</div>
                  {DAYS.map(d => (
                    <div
                      key={d}
                      className={`col-span-2 text-center text-xs font-semibold ${
                        mobileDay === d ? 'text-zinc-900 dark:text-white font-bold' : 'text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {DAY_FULL_NAMES[d]}
                    </div>
                  ))}
                </div>

                {/* Grid Body */}
                <div className="relative h-[660px] grid grid-cols-11 select-none">
                  {/* Left Column: Time Markings */}
                  <div className="col-span-1 relative border-r border-zinc-100 dark:border-zinc-800/60">
                    {Array.from({ length: END_HOUR - START_HOUR + 1 }).map((_, idx) => {
                      const hour = START_HOUR + idx;
                      const topPercent = (idx / (END_HOUR - START_HOUR)) * 100;
                      const displayH = hour % 12 === 0 ? 12 : hour % 12;
                      const ampm = hour >= 12 ? 'PM' : 'AM';
                      return (
                        <div
                          key={hour}
                          style={{ top: `${topPercent}%` }}
                          className="absolute -translate-y-2 left-0 right-1 text-right text-[10px] text-zinc-400 font-mono"
                        >
                          {displayH} {ampm}
                        </div>
                      );
                    })}
                  </div>

                  {/* Day Columns & Horizontal Guidelines */}
                  <div className="col-span-10 grid grid-cols-5 relative h-full">
                    {/* Horizontal Hour Lines */}
                    {Array.from({ length: END_HOUR - START_HOUR + 1 }).map((_, idx) => {
                      const topPercent = (idx / (END_HOUR - START_HOUR)) * 100;
                      return (
                        <div
                          key={idx}
                          style={{ top: `${topPercent}%` }}
                          className="absolute left-0 right-0 border-t border-zinc-100 dark:border-zinc-800/40 pointer-events-none"
                        />
                      );
                    })}

                    {/* Day Column Containers */}
                    {DAYS.map((day, dayIdx) => {
                      const dayEvents = placedEvents.filter(e => e.day === day);
                      return (
                        <div
                          key={day}
                          className={`relative h-full border-r border-zinc-100 dark:border-zinc-800/60 last:border-r-0 ${
                            mobileDay === day ? 'bg-zinc-50/50 dark:bg-zinc-900/20' : ''
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
                                onClick={() => setEditingCourseId(event.courseId)}
                                className={`absolute inset-x-1 p-2 rounded-xl border transition-all cursor-pointer shadow-2xs hover:shadow-md hover:z-20 overflow-hidden flex flex-col justify-between ${palette.bg} ${palette.border} ${palette.text}`}
                              >
                                <div className="leading-tight">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="font-bold text-xs tracking-tight truncate">{event.courseCode}</span>
                                    <span className="text-[10px] opacity-75 font-mono">{event.credits}cr</span>
                                  </div>
                                  <div className="text-[11px] truncate opacity-90">{event.courseTitle}</div>
                                </div>
                                <div className="text-[10px] font-mono opacity-80 pt-1 flex items-center justify-between">
                                  <span>{formatTime12(event.startTime)}</span>
                                  <span className="opacity-60">•</span>
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

