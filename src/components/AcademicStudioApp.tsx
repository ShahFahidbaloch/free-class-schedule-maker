import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
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
  Copy,
  Star,
  MessageSquare,
  CheckSquare,
  Square,
  Sliders,
  ChevronRight,
  Share2,
  Globe
} from 'lucide-react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { 
  TRANSLATIONS, 
  LOCALES, 
  type SupportedLocale, 
  getTranslations 
} from '../i18n/uiTranslations';

export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

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

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

// Muted Apple Tag Color Palette (Strictly Anti-AI Slop)
export const APPLE_TAG_PALETTES = [
  {
    id: 'slate',
    name: 'Slate',
    dot: 'bg-zinc-600',
    cardBg: 'bg-zinc-100 dark:bg-[#18181b]',
    cardBorder: 'border-zinc-300 dark:border-zinc-700',
    leftBar: 'border-l-zinc-700 dark:border-l-zinc-300',
    textCode: 'text-zinc-950 dark:text-white',
    textTitle: 'text-zinc-700 dark:text-zinc-200',
    textMeta: 'text-zinc-600 dark:text-zinc-400'
  },
  {
    id: 'soft-sky',
    name: 'Soft Sky',
    dot: 'bg-sky-500',
    cardBg: 'bg-sky-50 dark:bg-[#0e2137]',
    cardBorder: 'border-sky-300 dark:border-sky-600',
    leftBar: 'border-l-sky-500',
    textCode: 'text-sky-950 dark:text-white',
    textTitle: 'text-sky-800 dark:text-sky-100',
    textMeta: 'text-sky-700 dark:text-sky-300'
  },
  {
    id: 'muted-sage',
    name: 'Muted Sage',
    dot: 'bg-emerald-600',
    cardBg: 'bg-emerald-50 dark:bg-[#0c261b]',
    cardBorder: 'border-emerald-300 dark:border-emerald-600',
    leftBar: 'border-l-emerald-600',
    textCode: 'text-emerald-950 dark:text-white',
    textTitle: 'text-emerald-800 dark:text-emerald-100',
    textMeta: 'text-emerald-700 dark:text-emerald-300'
  },
  {
    id: 'clay',
    name: 'Clay Amber',
    dot: 'bg-amber-600',
    cardBg: 'bg-amber-50 dark:bg-[#281b0e]',
    cardBorder: 'border-amber-300 dark:border-amber-600',
    leftBar: 'border-l-amber-600',
    textCode: 'text-amber-950 dark:text-white',
    textTitle: 'text-amber-800 dark:text-amber-100',
    textMeta: 'text-amber-700 dark:text-amber-300'
  },
  {
    id: 'lavender',
    name: 'Lavender',
    dot: 'bg-purple-500',
    cardBg: 'bg-purple-50 dark:bg-[#231536]',
    cardBorder: 'border-purple-300 dark:border-purple-600',
    leftBar: 'border-l-purple-500',
    textCode: 'text-purple-950 dark:text-white',
    textTitle: 'text-purple-800 dark:text-purple-100',
    textMeta: 'text-purple-700 dark:text-purple-300'
  }
];

const WEEKDAY_DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const FULL_WEEK_DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DAY_LABELS: Record<DayOfWeek, { short: string; full: string; pill: string }> = {
  Mon: { short: 'Mon', full: 'Monday', pill: 'M' },
  Tue: { short: 'Tue', full: 'Tuesday', pill: 'T' },
  Wed: { short: 'Wed', full: 'Wednesday', pill: 'W' },
  Thu: { short: 'Thu', full: 'Thursday', pill: 'Th' },
  Fri: { short: 'Fri', full: 'Friday', pill: 'F' },
  Sat: { short: 'Sat', full: 'Saturday', pill: 'Sa' },
  Sun: { short: 'Sun', full: 'Sunday', pill: 'Su' }
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
const CALENDAR_END_HOUR = 20;   // 8:00 PM (12 Hours)
const HOUR_ROW_HEIGHT = 74;     // 74px per hour -> very clean & legible

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

export function minutesToTime12(totalMinutes: number): string {
  const clamped = Math.max(0, Math.min(24 * 60 - 1, totalMinutes));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  const displayM = m < 10 ? `0${m}` : m;
  return `${displayH}:${displayM} ${ampm}`;
}

const DEFAULT_SAMPLE_COURSES: Course[] = [
  {
    id: 'course-cs301',
    code: 'CS 301',
    title: 'Data Structures & Algorithms',
    credits: 4,
    colorIndex: 0,
    selectedSectionId: 'sec-cs301-1',
    sections: [
      {
        id: 'sec-cs301-1',
        name: 'Sec 01 (MWF)',
        days: ['Mon', 'Wed', 'Fri'],
        startTime: '10:00 AM',
        endTime: '11:15 AM',
        room: 'Turing Hall 101'
      }
    ]
  },
  {
    id: 'course-math21',
    code: 'MATH 21',
    title: 'Calculus & Analytical Geometry',
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
    id: 'course-eng102',
    code: 'ENG 102',
    title: 'Technical Academic Writing',
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

export default function AcademicStudioApp() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [includeWeekend, setIncludeWeekend] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [mobileDay, setMobileDay] = useState<DayOfWeek>('Mon');

  // Multi-Language State & i18n
  const [locale, setLocale] = useState<SupportedLocale>('en');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('preferred_lang');
      if (savedLang && (TRANSLATIONS as any)[savedLang]) {
        setLocale(savedLang as SupportedLocale);
      } else {
        const pathPart = window.location.pathname.split('/').filter(Boolean)[0];
        if (pathPart && (TRANSLATIONS as any)[pathPart]) {
          setLocale(pathPart as SupportedLocale);
        }
      }
    } catch (e) {}

    const handleLangEvent = (e: any) => {
      const newLang = e.detail;
      if (newLang && (TRANSLATIONS as any)[newLang]) {
        setLocale(newLang as SupportedLocale);
      }
    };
    window.addEventListener('langchange', handleLangEvent);
    return () => window.removeEventListener('langchange', handleLangEvent);
  }, []);

  const changeLocale = (newLang: SupportedLocale) => {
    setLocale(newLang);
    try {
      localStorage.setItem('preferred_lang', newLang);
      document.documentElement.lang = newLang;
    } catch (e) {}
    setIsLangMenuOpen(false);
    window.dispatchEvent(new CustomEvent('langchange', { detail: newLang }));
  };

  const t = useMemo(() => getTranslations(locale), [locale]);

  // Modals state
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedEventForEdit, setSelectedEventForEdit] = useState<{
    course: Course;
    section: Section;
  } | null>(null);

  // New Class Form State (Google Forms / ERP Style)
  const [formCode, setFormCode] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formCredits, setFormCredits] = useState(3);
  const [formDays, setFormDays] = useState<DayOfWeek[]>(['Mon', 'Wed', 'Fri']);
  const [formStartTime, setFormStartTime] = useState('09:00 AM');
  const [formEndTime, setFormEndTime] = useState('10:15 AM');
  const [formRoom, setFormRoom] = useState('Hall 101');
  const [formColorIndex, setFormColorIndex] = useState(0);

  // Feedback Modal State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackCategory, setFeedbackCategory] = useState<'Feature Request' | 'Timetable Bug' | 'Export Issue' | 'Other'>('Feature Request');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Task Input State
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Drag and Drop & Validation State
  const [draggedEvent, setDraggedEvent] = useState<{
    courseId: string;
    sectionId: string;
    sourceDay: DayOfWeek;
    durationMins: number;
    code: string;
  } | null>(null);
  const [dragOverDay, setDragOverDay] = useState<DayOfWeek | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const timetableRef = useRef<HTMLDivElement>(null);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const savedCourses = localStorage.getItem('academic_planner_courses_v1');
      if (savedCourses) {
        const parsed = JSON.parse(savedCourses);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCourses(parsed);
        } else {
          setCourses(DEFAULT_SAMPLE_COURSES);
        }
      } else {
        setCourses(DEFAULT_SAMPLE_COURSES);
      }

      const savedTasks = localStorage.getItem('academic_planner_tasks_v1');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        setTasks([
          { id: 't1', title: 'Review CS301 Syllabus and office hours', completed: true },
          { id: 't2', title: 'Submit MATH 21 Homework 1', completed: false }
        ]);
      }
    } catch (e) {}

    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkTheme(isDark);
  }, []);

  // Save Courses
  useEffect(() => {
    if (courses.length > 0) {
      try {
        localStorage.setItem('academic_planner_courses_v1', JSON.stringify(courses));
      } catch (e) {}
    }
  }, [courses]);

  // Save Tasks
  useEffect(() => {
    try {
      localStorage.setItem('academic_planner_tasks_v1', JSON.stringify(tasks));
    } catch (e) {}
  }, [tasks]);

  // Theme Switcher
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

  // Days list based on weekend toggle
  const activeDaysList = includeWeekend ? FULL_WEEK_DAYS : WEEKDAY_DAYS;

  // Toggle Day selection in Form
  const toggleFormDay = (d: DayOfWeek) => {
    if (formDays.includes(d)) {
      if (formDays.length > 1) {
        setFormDays(prev => prev.filter(day => day !== d));
      }
    } else {
      setFormDays(prev => [...prev, d]);
    }
  };

  // Open Modal with optional slot prefill
  const handleOpenNewClassModal = (day?: DayOfWeek, defaultStart?: string) => {
    if (day) setFormDays([day]);
    if (defaultStart) {
      setFormStartTime(defaultStart);
      const startM = parseFlexibleTime(defaultStart);
      const endM = startM + 75; // default 1h 15m
      const h = Math.floor(endM / 60);
      const m = endM % 60;
      const ampm = h >= 12 ? 'PM' : 'AM';
      const displayH = h % 12 === 0 ? 12 : h % 12;
      const displayM = m < 10 ? `0${m}` : m;
      setFormEndTime(`${displayH}:${displayM} ${ampm}`);
    }
    setSelectedEventForEdit(null);
    setFormError(null);
    setIsClassModalOpen(true);
  };

  // Drag and drop reschedule handler
  const handleDropOnDay = (e: React.DragEvent<HTMLDivElement>, targetDay: DayOfWeek) => {
    e.preventDefault();
    setDragOverDay(null);
    if (!draggedEvent) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const dropY = e.clientY - rect.top;
    const hoursFrom8 = dropY / HOUR_ROW_HEIGHT;
    const totalDropMins = 8 * 60 + Math.floor(hoursFrom8 * 60);
    const snapStartMins = Math.floor(totalDropMins / 15) * 15;
    const validStartMins = Math.max(8 * 60, Math.min(20 * 60 - 30, snapStartMins));
    const duration = draggedEvent.durationMins || 60;
    const validEndMins = Math.min(20 * 60, validStartMins + duration);

    const newStartStr = minutesToTime12(validStartMins);
    const newEndStr = minutesToTime12(validEndMins);

    setCourses(prev => prev.map(c => {
      if (c.id !== draggedEvent.courseId) return c;
      return {
        ...c,
        sections: c.sections.map(s => {
          if (s.id !== draggedEvent.sectionId) return s;
          let updatedDays = [...s.days];
          if (draggedEvent.sourceDay !== targetDay) {
            updatedDays = updatedDays.filter(d => d !== draggedEvent.sourceDay);
            if (!updatedDays.includes(targetDay)) {
              updatedDays.push(targetDay);
            }
          }
          return {
            ...s,
            days: updatedDays,
            startTime: newStartStr,
            endTime: newEndStr
          };
        })
      };
    }));

    setBanner(`Rescheduled ${draggedEvent.code} to ${DAY_LABELS[targetDay].full} at ${newStartStr} – ${newEndStr}`);
    setDraggedEvent(null);
  };

  // Save Course (Create or Update)
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanCode = formCode.trim().toUpperCase();
    if (!cleanCode) {
      setFormError('Please enter a course code (e.g. CS101).');
      return;
    }
    if (formDays.length === 0) {
      setFormError('Please select at least one day for this class.');
      return;
    }
    const startM = parseFlexibleTime(formStartTime);
    const endM = parseFlexibleTime(formEndTime);
    if (endM <= startM) {
      setFormError('End time must be later than start time.');
      return;
    }

    if (selectedEventForEdit) {
      // Update existing course
      setCourses(prev => prev.map(c => {
        if (c.id === selectedEventForEdit.course.id) {
          return {
            ...c,
            code: formCode.trim().toUpperCase(),
            title: formTitle.trim() || 'Class Lecture',
            credits: Number(formCredits) || 3,
            colorIndex: formColorIndex,
            sections: [
              {
                id: selectedEventForEdit.section.id,
                name: 'Section 01',
                days: [...formDays],
                startTime: formStartTime.trim(),
                endTime: formEndTime.trim(),
                room: formRoom.trim() || 'Campus'
              }
            ]
          };
        }
        return c;
      }));
      setBanner(`Updated ${formCode.toUpperCase()}`);
    } else {
      // Create new
      const courseId = `c_${Date.now()}`;
      const secId = `sec_${Date.now()}`;
      const newCourse: Course = {
        id: courseId,
        code: formCode.trim().toUpperCase(),
        title: formTitle.trim() || 'Class Lecture',
        credits: Number(formCredits) || 3,
        colorIndex: formColorIndex,
        selectedSectionId: secId,
        sections: [
          {
            id: secId,
            name: 'Section 01',
            days: [...formDays],
            startTime: formStartTime.trim(),
            endTime: formEndTime.trim(),
            room: formRoom.trim() || 'Campus'
          }
        ]
      };
      setCourses(prev => [...prev, newCourse]);
      setBanner(`Added ${newCourse.code} to timetable.`);
    }

    setFormCode('');
    setFormTitle('');
    setFormRoom('');
    setSelectedEventForEdit(null);
    setIsClassModalOpen(false);
    setTimeout(() => setBanner(null), 3000);
  };

  // Delete Course
  const handleDeleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    setSelectedEventForEdit(null);
    setIsClassModalOpen(false);
  };

  // Duplicate Course to Another Day
  const handleDuplicateToDay = (targetDay: DayOfWeek) => {
    if (!selectedEventForEdit) return;
    const { course, section } = selectedEventForEdit;
    
    // Add targetDay to the course's section days
    if (!section.days.includes(targetDay)) {
      setCourses(prev => prev.map(c => {
        if (c.id === course.id) {
          return {
            ...c,
            sections: c.sections.map(s => {
              if (s.id === section.id) {
                return { ...s, days: [...s.days, targetDay] };
              }
              return s;
            })
          };
        }
        return c;
      }));
      setBanner(`Duplicated ${course.code} to ${DAY_LABELS[targetDay].full}`);
    }
    setSelectedEventForEdit(null);
    setIsClassModalOpen(false);
    setTimeout(() => setBanner(null), 3000);
  };

  // Reset Schedule
  const handleResetSchedule = () => {
    if (confirm('Reset timetable to sample course demonstrations?')) {
      setCourses(DEFAULT_SAMPLE_COURSES);
      localStorage.removeItem('academic_planner_courses_v1');
      setBanner('Schedule reset to demo courses.');
      setTimeout(() => setBanner(null), 3000);
    }
  };

  // Feedback Submission
  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    const submission = {
      id: `fb_${Date.now()}`,
      rating,
      category: feedbackCategory,
      message: feedbackMessage.trim(),
      timestamp: new Date().toISOString()
    };
    try {
      const existing = JSON.parse(localStorage.getItem('student_feedback_logs') || '[]');
      existing.push(submission);
      localStorage.setItem('student_feedback_logs', JSON.stringify(existing));
    } catch (e) {}

    setIsFeedbackModalOpen(false);
    setFeedbackMessage('');
    try {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    } catch (e) {}
    setBanner('Thank you for helping us improve!');
    setTimeout(() => setBanner(null), 3500);
  };

  // Task Toggle
  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Add Task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: TaskItem = {
      id: `t_${Date.now()}`,
      title: newTaskTitle.trim(),
      completed: false
    };
    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
  };

  // Grid Placed Events Calculation with Cluster Interval Coloring
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
    rawCourse: Course;
    rawSection: Section;
  }

  const placedEventsByDay = useMemo(() => {
    const dayMap: Record<DayOfWeek, GridEvent[]> = {
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
      Sat: [],
      Sun: []
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
            totalLanes: 1,
            rawCourse: course,
            rawSection: activeSec
          });
        }
      });
    });

    // Detect Overlaps per Day (Cluster & Greedy Lane Graph Coloring)
    FULL_WEEK_DAYS.forEach(day => {
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

  // Compute Live Metrics
  const metrics = useMemo(() => {
    const totalCredits = courses.reduce((sum, c) => sum + (c.credits || 0), 0);
    let totalGapMinutes = 0;
    let conflicts = 0;

    activeDaysList.forEach(day => {
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
      gapHours: (totalGapMinutes / 60).toFixed(1),
      conflicts: Math.floor(conflicts / 2)
    };
  }, [courses, placedEventsByDay, activeDaysList]);

  // Permutation Gap Optimizer Engine
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
      activeDaysList.forEach(day => {
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
      'PRODID:-//ClassScheduleMaker//AcademicPlanner//EN',
      'CALSCALE:GREGORIAN'
    ];
    const dayMap: Record<DayOfWeek, string> = { 
      Mon: 'MO', Tue: 'TU', Wed: 'WE', Thu: 'TH', Fri: 'FR', Sat: 'SA', Sun: 'SU' 
    };
    const today = new Date();
    const dayIdx = today.getDay();
    const daysUntilMon = (1 + 7 - dayIdx) % 7 || 7;
    const baseMon = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysUntilMon);

    courses.forEach(c => {
      const sec = c.sections.find(s => s.id === c.selectedSectionId);
      if (!sec) return;

      sec.days.forEach(day => {
        const offset = FULL_WEEK_DAYS.indexOf(day);
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
        lines.push(`DESCRIPTION:Upcoming class: ${c.code}`);
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
    setIsExportModalOpen(false);
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
      a.download = 'weekly-class-schedule.png';
      a.href = dataUrl;
      a.click();
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
      setIsExportModalOpen(false);
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
    <div className="min-h-screen flex bg-[#FBFBFD] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950">
      
      {/* 1. Left Micro-Sidebar (Inspired by schedulebuilder.net) */}
      <aside className="w-16 sm:w-20 shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] flex flex-col items-center justify-between py-5 select-none z-30 transition-colors">
        
        {/* Top: Home Link & New Class Trigger */}
        <div className="flex flex-col items-center gap-4 w-full px-2">
          
          {/* Logo / Back to Home */}
          <a
            href="/"
            className="w-11 h-11 rounded-2xl flex items-center justify-center hover:scale-105 transition-transform shadow-xs cursor-pointer overflow-hidden p-0.5"
            title="Class Schedule Home"
          >
            <img src="/logo.svg" alt="Class Schedule Logo" className="w-full h-full object-contain rounded-xl" />
          </a>

          <div className="w-8 h-px bg-zinc-200 dark:bg-zinc-800 my-1" />

          {/* [+ New Class] Primary Trigger Button */}
          <button
            onClick={() => handleOpenNewClassModal()}
            className="w-11 h-11 rounded-2xl bg-zinc-950 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer group"
            title="+ Add New Class"
          >
            <Plus className="w-5 h-5 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
          </button>

          {/* Tasks / Todo Panel */}
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="w-10 h-10 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition cursor-pointer relative"
            title="Tasks & Deadlines"
          >
            <CheckSquare className="w-4 h-4" />
            {tasks.filter(t => !t.completed).length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-zinc-900 dark:bg-white" />
            )}
          </button>

          {/* Gap Optimizer Engine */}
          <button
            onClick={handleOptimizeGaps}
            className="w-10 h-10 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition cursor-pointer"
            title="Run Gap Optimizer Engine"
          >
            <Sliders className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </button>

          {/* Export Hub */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="w-10 h-10 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition cursor-pointer"
            title="Export Timetable (PNG, PDF, .ICS)"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* 5-Day / 7-Day Weekend Toggle */}
          <button
            onClick={() => setIncludeWeekend(!includeWeekend)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold font-mono transition cursor-pointer ${
              includeWeekend
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
            title={includeWeekend ? 'Showing 7 Days (Mon-Sun)' : 'Showing 5 Days (Mon-Fri)'}
          >
            {includeWeekend ? '7D' : '5D'}
          </button>
        </div>

        {/* Bottom: Feedback & Dark/Light Mode */}
        <div className="flex flex-col items-center gap-3 w-full px-2">
          
          {/* Feedback & Rating Modal Trigger */}
          <button
            onClick={() => setIsFeedbackModalOpen(true)}
            className="w-10 h-10 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition cursor-pointer"
            title="Send Student Feedback & Rating"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Dark / Light Mode Switch */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition cursor-pointer"
            title="Toggle Visual Theme"
          >
            {isDarkTheme ? <Sun className="w-4 h-4 text-zinc-200" /> : <Moon className="w-4 h-4 text-zinc-700" />}
          </button>
        </div>

      </aside>

      {/* Main Studio Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Control Bar */}
        <header className="h-14 px-4 sm:px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-[#121215]/80 backdrop-blur-md flex items-center justify-between gap-4 select-none shrink-0">
          
          {/* Left: Title & Quick Stats */}
          <div className="flex items-center gap-3">
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-zinc-950 dark:text-white flex items-center gap-2">
              <span>{t.nav?.scheduleStudio || 'Class Schedule Studio'}</span>
            </h1>

            <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">&bull;</span>

            {/* Subtle Top Status Pill (Strictly Monochrome Slate - No Green Pills) */}
            <div className="hidden sm:inline-flex items-center gap-2 text-xs font-mono font-medium px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
              <span className="text-zinc-700 dark:text-zinc-300">
                {t.metrics.credits}: <strong className="font-bold text-zinc-900 dark:text-white">{metrics.totalCredits}</strong>
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">|</span>
              <span className="text-zinc-700 dark:text-zinc-300">
                {t.metrics.idleGaps}: <strong className="font-bold text-zinc-900 dark:text-white">{metrics.gapHours} hrs</strong>
              </span>
              {metrics.conflicts > 0 ? (
                <>
                  <span className="text-zinc-300 dark:text-zinc-700">|</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">
                    {metrics.conflicts} {t.metrics.conflicts}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-zinc-300 dark:text-zinc-700">|</span>
                  <span className="text-zinc-600 dark:text-zinc-400 font-medium">
                    {t.metrics.conflictFree}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            
            {/* Quick Add Button */}
            <button
              onClick={() => handleOpenNewClassModal()}
              className="h-9 px-3 sm:px-3.5 rounded-xl bg-zinc-900 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{t.actions.newClass}</span>
            </button>

            {/* Print */}
            <button
              onClick={() => window.print()}
              className="h-9 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium hidden sm:flex items-center gap-1.5 transition cursor-pointer"
              title={t.actions.print}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.actions.print}</span>
            </button>

            {/* Export */}
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="h-9 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium hidden sm:flex items-center gap-1.5 transition cursor-pointer"
              title={t.actions.export}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.actions.export}</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="h-9 px-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                title="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-[11px] font-mono uppercase">{locale}</span>
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-1 w-44 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] shadow-lg p-1.5 z-50 flex flex-col gap-0.5 text-xs animate-in fade-in duration-100">
                  {Object.values(LOCALES).map((loc) => (
                    <button
                      key={loc.code}
                      onClick={() => changeLocale(loc.code)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                        locale === loc.code
                          ? 'bg-zinc-100 dark:bg-zinc-800 font-bold text-zinc-950 dark:text-white'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:text-zinc-950 dark:hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{loc.flag}</span>
                        <span>{loc.nativeName}</span>
                      </span>
                      {locale === loc.code && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reset */}
            <button
              onClick={handleResetSchedule}
              className="h-9 w-9 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
              title="Reset sample schedule"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

        </header>

        {/* Toast Alert Banner */}
        {banner && (
          <div className="mx-4 sm:mx-6 mt-3 p-3 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-between text-xs font-semibold shadow-md animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <span>{banner}</span>
            </div>
            <button onClick={() => setBanner(null)} className="text-xs opacity-75 hover:opacity-100 cursor-pointer">
              ✕
            </button>
          </div>
        )}

        {/* Mobile Day Tabs Bar (< 768px) */}
        <div className="flex md:hidden items-center gap-1 px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] overflow-x-auto">
          {activeDaysList.map(d => (
            <button
              key={d}
              onClick={() => setMobileDay(d)}
              className={`flex-1 min-w-[50px] py-1.5 text-xs font-bold rounded-lg transition ${
                mobileDay === d
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-2xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {t.days.short[d] || DAY_LABELS[d].short}
            </button>
          ))}
        </div>

        {/* Main Weekly Matrix Canvas */}
        <div className="flex-1 overflow-auto p-3 sm:p-6 timetable-print-target" ref={timetableRef}>
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] shadow-xs overflow-hidden">
            
            <div className="overflow-x-auto">
              <div className="min-w-[700px] md:min-w-0 w-full">
                
                {/* Day Header Row */}
                <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-850/80">
                  {/* Left Time Column Gutter */}
                  <div className="w-[64px] shrink-0 border-r border-zinc-200 dark:border-zinc-800 py-3 text-center">
                    <span className="text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase">
                      TIME
                    </span>
                  </div>

                  {/* Day Columns Headers */}
                  <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${activeDaysList.length}, minmax(0, 1fr))` }}>
                    {activeDaysList.map(day => (
                      <div
                        key={day}
                        className="py-3 text-center border-r border-zinc-200 dark:border-zinc-800 last:border-r-0"
                      >
                        <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
                          {t.days.full[day] || DAY_LABELS[day].full}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calendar Body: Hours Grid & Event Overlay */}
                <div className="relative flex" style={{ height: `${totalGridHeight}px` }}>
                  
                  {/* Left Time Column (64px width) */}
                  <div className="w-[64px] shrink-0 relative border-r border-zinc-200 dark:border-zinc-800 select-none bg-zinc-50/50 dark:bg-zinc-900/60">
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

                  {/* Day Columns Canvas */}
                  <div className="flex-1 relative h-full">
                    
                    {/* Background Hour Lines */}
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

                    {/* Columns Grid */}
                    <div className="grid h-full relative" style={{ gridTemplateColumns: `repeat(${activeDaysList.length}, minmax(0, 1fr))` }}>
                      {activeDaysList.map(day => {
                        const events = placedEventsByDay[day] || [];
                        const isDayDragTarget = dragOverDay === day;
                        return (
                          <div
                            key={day}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.dataTransfer.dropEffect = 'move';
                              if (dragOverDay !== day) setDragOverDay(day);
                            }}
                            onDragLeave={(e) => {
                              if (e.currentTarget === e.target) {
                                setDragOverDay(null);
                              }
                            }}
                            onDrop={(e) => handleDropOnDay(e, day)}
                            onClick={(e) => {
                              // Click empty space on column to add class
                              if (e.target === e.currentTarget) {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const clickY = e.clientY - rect.top;
                                const hoursFrom8 = clickY / HOUR_ROW_HEIGHT;
                                const totalMins = 8 * 60 + Math.floor(hoursFrom8 * 60);
                                const roundedMins = Math.floor(totalMins / 30) * 30;
                                const h = Math.floor(roundedMins / 60);
                                const m = roundedMins % 60;
                                const ampm = h >= 12 ? 'PM' : 'AM';
                                const displayH = h % 12 === 0 ? 12 : h % 12;
                                const displayM = m < 10 ? `0${m}` : m;
                                handleOpenNewClassModal(day, `${displayH}:${displayM} ${ampm}`);
                              }
                            }}
                            className={`relative h-full border-r border-zinc-200 dark:border-zinc-800 last:border-r-0 cursor-pointer transition-colors ${
                              isDayDragTarget ? 'bg-zinc-200/60 dark:bg-zinc-800/60 ring-2 ring-inset ring-zinc-500' : ''
                            }`}
                            title={`Click on ${DAY_LABELS[day].full} to add a class or drag an existing class here`}
                          >
                            {events.map(event => {
                              const pal = APPLE_TAG_PALETTES[event.colorIndex % APPLE_TAG_PALETTES.length];
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
                                  draggable={true}
                                  onDragStart={(e) => {
                                    e.stopPropagation();
                                    const dur = (event.endMins - event.startMins) || 60;
                                    setDraggedEvent({
                                      courseId: event.courseId,
                                      sectionId: event.rawSection.id,
                                      sourceDay: day,
                                      durationMins: dur,
                                      code: event.code
                                    });
                                    e.dataTransfer.setData('text/plain', event.courseId);
                                    e.dataTransfer.effectAllowed = 'move';
                                  }}
                                  onDragEnd={() => {
                                    setDraggedEvent(null);
                                    setDragOverDay(null);
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Open Edit / Duplicate Modal
                                    setSelectedEventForEdit({ course: event.rawCourse, section: event.rawSection });
                                    setFormCode(event.rawCourse.code);
                                    setFormTitle(event.rawCourse.title);
                                    setFormCredits(event.rawCourse.credits);
                                    setFormDays(event.rawSection.days);
                                    setFormStartTime(event.rawSection.startTime);
                                    setFormEndTime(event.rawSection.endTime);
                                    setFormRoom(event.rawSection.room || '');
                                    setFormColorIndex(event.rawCourse.colorIndex);
                                    setFormError(null);
                                    setIsClassModalOpen(true);
                                  }}
                                  style={{
                                    top: `${event.topPx}px`,
                                    height: `${event.heightPx}px`,
                                    left: leftPos,
                                    width: blockWidth
                                  }}
                                  className={`absolute rounded-xl border p-2 sm:p-2.5 transition-all shadow-2xs hover:shadow-md hover:scale-[1.01] hover:z-30 overflow-hidden flex flex-col justify-between group cursor-grab active:cursor-grabbing select-none ${pal.cardBg} ${pal.cardBorder} border-l-4 ${pal.leftBar} ${
                                    isClashed ? 'ring-2 ring-rose-500 border-rose-500' : ''
                                  }`}
                                  title={`${event.code} - ${event.title}\nDrag to reschedule or click to edit`}
                                >
                                  <div className="leading-tight">
                                    <div className="flex items-center justify-between gap-1 mb-0.5">
                                      <span className={`font-bold text-xs sm:text-sm tracking-tight truncate ${pal.textCode}`}>
                                        {event.code}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteCourse(event.courseId);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 hover:text-rose-600 transition p-0.5 rounded cursor-pointer"
                                        title="Delete class"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>

                                    {event.title && (
                                      <div className={`text-[11px] font-medium truncate ${pal.textTitle}`}>
                                        {event.title}
                                      </div>
                                    )}

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

      {/* 2. Clean Event Creation / Edit Modal (Google Forms / ERP Style) */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white">
                  {selectedEventForEdit ? t.form.modalEditTitle : t.form.modalAddTitle}
                </h2>
                <p className="text-xs text-zinc-500">
                  {selectedEventForEdit ? t.form.modalSubtitleEdit : t.form.modalSubtitleAdd}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedEventForEdit(null);
                  setIsClassModalOpen(false);
                }}
                className="w-8 h-8 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <span>⚠️</span>
                  <span>{formError}</span>
                </div>
              )}

              {/* Course Code & Title */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    {t.form.courseCode} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={e => setFormCode(e.target.value)}
                    placeholder={t.form.courseCodePlaceholder || "e.g. CS 301"}
                    required
                    className="w-full h-11 px-3.5 text-sm font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-850 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    {t.form.creditHours}
                  </label>
                  <select
                    value={formCredits}
                    onChange={e => setFormCredits(Number(e.target.value))}
                    className="w-full h-11 px-3 text-sm font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-850 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5].map(cr => (
                      <option key={cr} value={cr}>{cr} {cr === 1 ? 'Credit' : 'Credits'}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  {t.form.courseTitle}
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder={t.form.courseTitlePlaceholder || "e.g. Data Structures & Algorithms"}
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-850 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              {/* Class Days Multi-Selector Pills */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  {t.form.classDays} <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {WEEKDAY_DAYS.map(d => {
                    const isSelected = formDays.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleFormDay(d)}
                        className={`h-10 rounded-xl text-xs font-bold transition border cursor-pointer ${
                          isSelected
                            ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-white dark:text-zinc-950 dark:border-white shadow-2xs'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 hover:bg-zinc-100'
                        }`}
                      >
                        {t.days.short[d] || DAY_LABELS[d].short}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Start & End Times + Room */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    {t.form.startTime}
                  </label>
                  <input
                    type="text"
                    value={formStartTime}
                    onChange={e => setFormStartTime(e.target.value)}
                    placeholder="09:00 AM"
                    list="modal-times-start"
                    className="w-full h-10 px-3 text-xs font-mono font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-850 text-zinc-900 dark:text-white"
                  />
                  <datalist id="modal-times-start">
                    {COMMON_START_TIMES.map(t => <option key={t} value={t} />)}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    {t.form.endTime}
                  </label>
                  <input
                    type="text"
                    value={formEndTime}
                    onChange={e => setFormEndTime(e.target.value)}
                    placeholder="10:15 AM"
                    list="modal-times-end"
                    className="w-full h-10 px-3 text-xs font-mono font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-850 text-zinc-900 dark:text-white"
                  />
                  <datalist id="modal-times-end">
                    {COMMON_END_TIMES.map(t => <option key={t} value={t} />)}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    {t.form.classroom}
                  </label>
                  <input
                    type="text"
                    value={formRoom}
                    onChange={e => setFormRoom(e.target.value)}
                    placeholder="e.g. Hall 101"
                    className="w-full h-10 px-3 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-850 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Muted Apple Tag Color Picker */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Color Tag
                </label>
                <div className="flex items-center gap-2.5">
                  {APPLE_TAG_PALETTES.map((pal, idx) => (
                    <button
                      key={pal.id}
                      type="button"
                      onClick={() => setFormColorIndex(idx)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer ${pal.dot} ${
                        formColorIndex === idx
                          ? 'ring-2 ring-offset-2 ring-zinc-900 dark:ring-white scale-110'
                          : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                      title={pal.name}
                    >
                      {formColorIndex === idx && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duplicate to Another Day Option (If Editing) */}
              {selectedEventForEdit && (
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 block mb-1.5">
                    {t.form.duplicateToOtherDays}
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {WEEKDAY_DAYS.filter(d => !formDays.includes(d)).map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => handleDuplicateToDay(d)}
                        className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                      >
                        <Copy className="w-3 h-3 text-zinc-400" />
                        <span>Add {t.days.full[d] || DAY_LABELS[d].full}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-3">
                {selectedEventForEdit ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteCourse(selectedEventForEdit.course.id)}
                    className="h-11 px-4 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{t.form.deleteClass}</span>
                  </button>
                ) : <div />}

                <button
                  type="submit"
                  className="h-11 px-6 rounded-xl bg-zinc-950 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs font-bold shadow-md transition cursor-pointer ml-auto"
                >
                  {t.form.saveClass}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 3. Tasks & Todo Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-zinc-500" />
                  <span>{t.tasks.title}</span>
                </h3>
                <p className="text-xs text-zinc-500">{t.tasks.placeholder}</p>
              </div>
              <button onClick={() => setIsTaskModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="flex gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                placeholder={t.tasks.placeholder}
                className="flex-1 h-10 px-3 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-850 text-zinc-900 dark:text-white placeholder:text-zinc-400"
              />
              <button
                type="submit"
                className="h-10 px-3.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-xs font-bold"
              >
                {t.tasks.addBtn}
              </button>
            </form>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {tasks.length === 0 ? (
                <div className="py-6 text-center text-xs text-zinc-400">{t.tasks.empty}</div>
              ) : (
                tasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="p-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between gap-3 text-xs cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-850"
                  >
                    <div className="flex items-center gap-2.5">
                      {task.completed ? (
                        <CheckSquare className="w-4 h-4 text-zinc-900 dark:text-white" />
                      ) : (
                        <Square className="w-4 h-4 text-zinc-400" />
                      )}
                      <span className={task.completed ? 'line-through text-zinc-400' : 'font-medium text-zinc-800 dark:text-zinc-200'}>
                        {task.title}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Export Hub Modal (PNG / PDF / .ICS) */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">{t.actions.export}</h3>
                <p className="text-xs text-zinc-500">Apple Calendar (.ICS), PNG, PDF</p>
              </div>
              <button onClick={() => setIsExportModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleExportICS}
                className="w-full p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between transition cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-zinc-900 dark:text-white block">Apple & Google Calendar (.ICS)</span>
                    <span className="text-[11px] text-zinc-500">16 weekly recurring sync with 15m alerts</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </button>

              <button
                onClick={handleExportPNG}
                disabled={isExporting}
                className="w-full p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between transition cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                    <Download className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-zinc-900 dark:text-white block">High-Res PNG Wallpaper</span>
                    <span className="text-[11px] text-zinc-500">2x pixel density lock screen image</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </button>

              <button
                onClick={() => {
                  setIsExportModalOpen(false);
                  window.print();
                }}
                className="w-full p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between transition cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                    <Printer className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-zinc-900 dark:text-white block">Print / Save as PDF</span>
                    <span className="text-[11px] text-zinc-500">Clean A4/Letter dorm noticeboard layout</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Interactive Student Feedback & Rating System Modal */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">{t.feedback.title}</h3>
                <p className="text-xs text-zinc-500">{t.feedback.subtitle}</p>
              </div>
              <button onClick={() => setIsFeedbackModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              
              {/* 5-Star Rating Selector */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                  Rate Your Experience
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => {
                    const isFilled = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="p-1 text-zinc-300 dark:text-zinc-700 hover:scale-110 transition cursor-pointer"
                      >
                        <Star className={`w-6 h-6 ${isFilled ? 'text-amber-400 fill-amber-400' : ''}`} />
                      </button>
                    );
                  })}
                  <span className="text-xs font-mono font-bold ml-2 text-zinc-600 dark:text-zinc-400">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Category Pills */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                  {t.feedback.categoryLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Feature Request', 'Timetable Bug', 'Export Issue', 'Other'] as const).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFeedbackCategory(cat)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        feedbackCategory === cat
                          ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-white dark:text-zinc-950 dark:border-white shadow-2xs'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Textarea */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  {t.feedback.title}
                </label>
                <textarea
                  value={feedbackMessage}
                  onChange={e => setFeedbackMessage(e.target.value)}
                  placeholder={t.feedback.placeholder}
                  rows={3}
                  required
                  className="w-full p-3 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-850 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-zinc-950 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
              >
                {t.feedback.submitBtn}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

