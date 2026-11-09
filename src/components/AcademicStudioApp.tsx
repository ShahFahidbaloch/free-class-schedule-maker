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
  Globe,
  Menu,
  HelpCircle,
  Bookmark,
  Layers,
  Mail,
  Code,
  Edit3,
  CheckCircle2,
  Undo2
} from 'lucide-react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { MAJOR_PRESETS } from '../data/schedulePresets';
import { 
  TRANSLATIONS, 
  LOCALES, 
  type SupportedLocale, 
  getTranslations 
} from '../i18n/uiTranslations';

export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export const VALID_DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function normalizeDayOfWeek(d: string | null | undefined): DayOfWeek | null {
  if (!d) return null;
  const clean = d.trim().toLowerCase();
  const map: Record<string, DayOfWeek> = {
    mon: 'Mon', monday: 'Mon', m: 'Mon',
    tue: 'Tue', tuesday: 'Tue', t: 'Tue',
    wed: 'Wed', wednesday: 'Wed', w: 'Wed',
    thu: 'Thu', thursday: 'Thu', th: 'Thu',
    fri: 'Fri', friday: 'Fri', f: 'Fri',
    sat: 'Sat', saturday: 'Sat', sa: 'Sat',
    sun: 'Sun', sunday: 'Sun', su: 'Sun'
  };
  if (map[clean]) return map[clean];
  if (VALID_DAYS.includes(d as DayOfWeek)) return d as DayOfWeek;
  return null;
}

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

export interface SchedulePlan {
  id: 'plan-a' | 'plan-b' | 'plan-c';
  name: string;
  courses: Course[];
  tasks: TaskItem[];
}

export function encodeScheduleToShareString(courses: Course[]): string {
  try {
    const compact = courses.map(c => ({
      c: c.code,
      t: c.title,
      cr: c.credits,
      cl: c.colorIndex,
      s: (c.sections || []).map(s => ({
        d: s.days,
        st: s.startTime,
        et: s.endTime,
        r: s.room
      }))
    }));
    const json = JSON.stringify(compact);
    return encodeURIComponent(btoa(unescape(encodeURIComponent(json))));
  } catch (e) {
    return '';
  }
}

export function decodeScheduleFromShareString(raw: string): Course[] | null {
  try {
    const json = decodeURIComponent(escape(atob(decodeURIComponent(raw))));
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed.map((item: any, idx: number) => {
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
        id: `course-${Date.now()}-${idx}`,
        code,
        title,
        credits,
        colorIndex,
        selectedSectionId: sections[0]?.id || `sec-${idx}-0`,
        sections: sections.length > 0 ? sections : [{
          id: `sec-${idx}-0`,
          name: 'Sec 01',
          days: ['Mon', 'Wed', 'Fri'],
          startTime: '09:00 AM',
          endTime: '10:15 AM',
          room: 'Hall 101'
        }]
      };
    });
  } catch (e) {
    return null;
  }
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
  '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM', '07:35 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', 
  '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', 
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', 
  '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM',
  '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM'
];

const COMMON_END_TIMES = [
  '06:45 AM', '07:15 AM', '07:45 AM', '08:15 AM', '08:50 AM', '09:15 AM', '09:30 AM', '10:15 AM', '10:30 AM', 
  '11:15 AM', '11:30 AM', '12:15 PM', '12:30 PM', '01:15 PM', 
  '01:45 PM', '02:00 PM', '02:15 PM', '02:45 PM', '03:15 PM', 
  '03:30 PM', '04:15 PM', '04:45 PM', '05:15 PM', '06:00 PM', '06:45 PM', '07:00 PM',
  '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM'
];

const DEFAULT_GRID_START_HOUR = 6;  // 6:00 AM (covers 06:30 clinical shifts and 07:35 duty)
const DEFAULT_GRID_END_HOUR = 22;   // 10:00 PM (covers evening classes and night shifts)
const HOUR_ROW_HEIGHT = 74;         // 74px per hour -> very clean & legible

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

// ArrowUp moves +30m (later in time), ArrowDown moves -30m (earlier in time)
export function stepTime(
  currentTime: string,
  direction: 'up' | 'down',
  timeList: string[]
): string {
  if (!timeList || timeList.length === 0) return currentTime;
  const idx = timeList.indexOf(currentTime);
  if (idx !== -1) {
    if (direction === 'up') {
      return timeList[Math.min(timeList.length - 1, idx + 1)]; // +30m (Later)
    } else {
      return timeList[Math.max(0, idx - 1)]; // -30m (Earlier)
    }
  }
  const currentMins = parseFlexibleTime(currentTime);
  if (direction === 'up') {
    const next = timeList.find(t => parseFlexibleTime(t) > currentMins);
    return next || timeList[timeList.length - 1];
  } else {
    const prev = [...timeList].reverse().find(t => parseFlexibleTime(t) < currentMins);
    return prev || timeList[0];
  }
}

// Pure mathematical step: ArrowUp +30m (or custom step), ArrowDown -30m
export function stepTimeMinutes(currentTime: string, direction: 'up' | 'down', stepMins: number = 30): string {
  const currentMins = parseFlexibleTime(currentTime);
  let newMins = direction === 'up' ? currentMins + stepMins : currentMins - stepMins;
  if (newMins < 0) newMins += 24 * 60;
  if (newMins >= 24 * 60) newMins -= 24 * 60;
  return minutesToTime12(newMins);
}

// Robust typed time parser: formats "1030" or "10:30" or "9" into valid "HH:MM AM/PM"
export function parseTypedTime(raw: string, prevTime: string): string {
  const clean = (raw || '').trim();
  if (!clean) return prevTime || '09:00 AM';

  let ampm: 'AM' | 'PM' = prevTime.toUpperCase().includes('PM') ? 'PM' : 'AM';
  if (/p/i.test(clean) && !/a/i.test(clean)) {
    ampm = 'PM';
  } else if (/a/i.test(clean) && !/p/i.test(clean)) {
    ampm = 'AM';
  }

  const digits = clean.replace(/\D/g, '');
  if (!digits) return prevTime || '09:00 AM';

  let h = 0;
  let m = 0;

  if (digits.length <= 2) {
    h = parseInt(digits, 10);
    m = 0;
  } else if (digits.length === 3) {
    h = parseInt(digits.slice(0, 1), 10);
    m = parseInt(digits.slice(1, 3), 10);
  } else {
    h = parseInt(digits.slice(0, 2), 10);
    m = parseInt(digits.slice(2, 4), 10);
  }

  if (h > 12 && h <= 23) {
    h = h - 12;
    ampm = 'PM';
  } else if (h === 0 || h > 23) {
    h = 12;
  }
  if (m > 59) m = 59;

  const displayH = h < 10 ? `0${h}` : `${h}`;
  const displayM = m < 10 ? `0${m}` : `${m}`;
  return `${displayH}:${displayM} ${ampm}`;
}

// Pure idle gaps calculation
export function calculateScheduleIdleGaps(coursesList: Course[], activeDays: DayOfWeek[]): number {
  let totalGapMins = 0;
  activeDays.forEach(day => {
    const dayMeetings: { s: number; e: number }[] = [];
    coursesList.forEach(c => {
      const sec = c.sections.find(s => s.id === c.selectedSectionId);
      if (!sec) return;
      if (sec.days.some(d => normalizeDayOfWeek(d) === day)) {
        dayMeetings.push({
          s: parseFlexibleTime(sec.startTime),
          e: parseFlexibleTime(sec.endTime)
        });
      }
    });

    dayMeetings.sort((a, b) => a.s - b.s);
    for (let i = 0; i < dayMeetings.length - 1; i++) {
      const gap = dayMeetings[i + 1].s - dayMeetings[i].e;
      if (gap > 0 && gap < 480) {
        totalGapMins += gap;
      }
    }
  });
  return totalGapMins;
}


// 12-hour <-> 24-hour time format utilities for native <input type="time"> (S1)
export function time24To12(t24: string): string {
  if (!t24) return '09:00 AM';
  const clean = t24.trim();
  if (clean.includes('AM') || clean.includes('PM')) return clean;
  const [hStr, mStr] = clean.split(':');
  const h = parseInt(hStr, 10) || 0;
  const m = parseInt(mStr, 10) || 0;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  const hh = displayH < 10 ? `0${displayH}` : `${displayH}`;
  const mm = m < 10 ? `0${m}` : `${m}`;
  return `${hh}:${mm} ${ampm}`;
}

export function time12To24(t12: string): string {
  if (!t12) return '09:00';
  const clean = t12.trim();
  if (!clean.includes('AM') && !clean.includes('PM') && clean.includes(':')) {
    const parts = clean.split(':');
    const h = parseInt(parts[0], 10) || 0;
    const m = parseInt(parts[1], 10) || 0;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }
  const mins = parseFlexibleTime(clean);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export const DEFAULT_SAMPLE_COURSES: Course[] = [
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

const MOBILE_NAV_LABELS: Record<SupportedLocale, { tasks: string; optimize: string; export: string }> = {
  en: { tasks: 'Tasks', optimize: 'Optimize', export: 'Export' },
  es: { tasks: 'Tareas', optimize: 'Optimizar', export: 'Exportar' },
  pt: { tasks: 'Tarefas', optimize: 'Otimizar', export: 'Exportar' },
  de: { tasks: 'Aufgaben', optimize: 'Optimieren', export: 'Export' },
  fr: { tasks: 'Tâches', optimize: 'Optimiser', export: 'Exporter' },
  it: { tasks: 'Compiti', optimize: 'Ottimizza', export: 'Esporta' },
  ja: { tasks: 'タスク', optimize: '最適化', export: '出力' },
  ko: { tasks: '과제', optimize: '최적화', export: '내보내기' },
  fil: { tasks: 'Gawain', optimize: 'Ayusin', export: 'I-export' },
  tl: { tasks: 'Gawain', optimize: 'Ayusin', export: 'I-export' },
};

// Recoverable React Error Boundary (S1)
interface ErrorBoundaryProps {
  children: React.ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}
export class StudioErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('StudioErrorBoundary caught error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBFD] dark:bg-[#09090b] p-6 text-center">
          <div className="max-w-md w-full bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            <h2 className="text-lg font-bold text-zinc-950 dark:text-white">
              Something went wrong
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Something went wrong — your schedule is saved. Reload the studio to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="h-10 px-6 rounded-xl bg-zinc-950 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Reload Studio
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function AcademicStudioApp() {
  return (
    <StudioErrorBoundary>
      <AcademicStudioAppInner />
    </StudioErrorBoundary>
  );
}

function AcademicStudioAppInner() {
  // Initialize with DEFAULT_SAMPLE_COURSES so the first paint & SSR pre-render already contain
  // the full sample schedule with zero empty-grid pop-in and zero Cumulative Layout Shift
  const [courses, setCourses] = useState<Course[]>(DEFAULT_SAMPLE_COURSES);
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: 't1', title: 'Review CS301 Syllabus and office hours', completed: true },
    { id: 't2', title: 'Submit MATH 21 Homework 1', completed: false }
  ]);
  // Multi-Plan (Plan A, Plan B, Plan C) State
  const [plans, setPlans] = useState<SchedulePlan[]>([
    { id: 'plan-a', name: 'Plan A', courses: DEFAULT_SAMPLE_COURSES, tasks: [
      { id: 't1', title: 'Review CS301 Syllabus and office hours', completed: true },
      { id: 't2', title: 'Submit MATH 21 Homework 1', completed: false }
    ]},
    { id: 'plan-b', name: 'Plan B', courses: [], tasks: [] },
    { id: 'plan-c', name: 'Plan C', courses: [], tasks: [] }
  ]);
  const [activePlanId, setActivePlanId] = useState<'plan-a' | 'plan-b' | 'plan-c'>('plan-a');
  const [isRenamePlanModalOpen, setIsRenamePlanModalOpen] = useState(false);
  const [newPlanName, setNewPlanName] = useState('Plan A');
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isPlanMenuOpen, setIsPlanMenuOpen] = useState(false);
  const planMenuRef = useRef<HTMLDivElement>(null);

  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [includeWeekend, setIncludeWeekend] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [mobileDay, setMobileDay] = useState<DayOfWeek>('Mon');

  // Dynamic Grid Range (covers 06:30 AM clinicals and 07:35 AM bus duty)
  const [gridStartHour, setGridStartHour] = useState(DEFAULT_GRID_START_HOUR); // 6 AM
  const [gridEndHour, setGridEndHour] = useState(DEFAULT_GRID_END_HOUR);       // 10 PM
  const [showSampleHint, setShowSampleHint] = useState(false);

  // In-app Confirm Dialog State (Replaces native window.confirm)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'reset' | 'start-empty' | 'preset-replace';
    title: string;
    description: string;
    confirmLabel: string;
    onConfirm: () => void;
    secondaryLabel?: string;
    onSecondary?: () => void;
  } | null>(null);

  // Gap Optimizer Proposal State (Honest Optimization)
  const [optimizerProposal, setOptimizerProposal] = useState<{
    isOpen: boolean;
    currentGapHours: string;
    proposedGapHours: string;
    savedHours: string;
    proposedCourses: Course[];
  } | null>(null);

  // Undo History Stack (Restores state before destructive actions: reset, preset, delete, drag)
  const historyStackRef = useRef<{ courses: Course[]; tasks: TaskItem[] }[]>([]);
  const [canUndo, setCanUndo] = useState(false);

  const pushUndoSnapshot = (snapCourses: Course[], snapTasks: TaskItem[]) => {
    const snap = {
      courses: JSON.parse(JSON.stringify(snapCourses)),
      tasks: JSON.parse(JSON.stringify(snapTasks))
    };
    historyStackRef.current.push(snap);
    if (historyStackRef.current.length > 20) {
      historyStackRef.current.shift();
    }
    setCanUndo(true);
    try {
      localStorage.setItem('class_schedule_undo_snapshot_v1', JSON.stringify(snap));
    } catch (e) {}
  };

  const handleUndo = () => {
    if (historyStackRef.current.length === 0) return;
    const lastSnap = historyStackRef.current.pop();
    if (historyStackRef.current.length === 0) {
      setCanUndo(false);
      try {
        localStorage.removeItem('class_schedule_undo_snapshot_v1');
      } catch (e) {}
    } else {
      try {
        localStorage.setItem('class_schedule_undo_snapshot_v1', JSON.stringify(historyStackRef.current[historyStackRef.current.length - 1]));
      } catch (e) {}
    }
    if (!lastSnap) return;

    setCourses(lastSnap.courses);
    setTasks(lastSnap.tasks);
    setPlans(prev => {
      const updated = prev.map(p =>
        p.id === activePlanId ? { ...p, courses: lastSnap.courses, tasks: lastSnap.tasks } : p
      );
      try {
        localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setBanner('Restored previous schedule (Undo).');
    setTimeout(() => setBanner(null), 3000);
  };

  // Keyboard shortcut: Ctrl+Z / Cmd+Z for Undo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        const active = document.activeElement;
        const isInput = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || (active as HTMLElement).isContentEditable);
        if (!isInput) {
          e.preventDefault();
          handleUndo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePlanId]);

  // Multi-Language State & i18n
  const [locale, setLocale] = useState<SupportedLocale>('en');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isStudioMenuOpen, setIsStudioMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Close language dropdown on outside click
  useEffect(() => {
    if (!isLangMenuOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isLangMenuOpen]);

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

  // 1. Onboarding Quick Guide on Studio Open (Shows on first visit)
  useEffect(() => {
    try {
      const hintDismissed = localStorage.getItem('sample_schedule_hint_dismissed');
      if (!hintDismissed) {
        setShowSampleHint(true);
      }
    } catch (e) {}
  }, []);

  // 1. Onboarding Quick Guide on Studio Open (Shows on first visit)
  useEffect(() => {
    try {
      const seen = localStorage.getItem('studio_onboarding_guide_seen');
      if (!seen) {
        const timer = setTimeout(() => setIsOnboardingOpen(true), 600);
        return () => clearTimeout(timer);
      }
    } catch (e) {}
  }, []);

  // 2. Automatic Feedback Prompt after 15 Minutes of Usage (Shown ONLY ONCE)
  useEffect(() => {
    try {
      const alreadyPrompted = localStorage.getItem('studio_feedback_auto_prompted');
      if (!alreadyPrompted) {
        const timer = setTimeout(() => {
          setIsFeedbackModalOpen(true);
          try {
            localStorage.setItem('studio_feedback_auto_prompted', 'true');
          } catch (e) {}
        }, 15 * 60 * 1000); // Exactly 15 minutes
        return () => clearTimeout(timer);
      }
    } catch (e) {}
  }, []);

  const handleDismissOnboarding = () => {
    setIsOnboardingOpen(false);
    try {
      localStorage.setItem('studio_onboarding_guide_seen', 'true');
    } catch (e) {}
  };

  const t = useMemo(() => getTranslations(locale), [locale]);
  const navLabels = MOBILE_NAV_LABELS[locale] || MOBILE_NAV_LABELS.en;

  // Modals state
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [selectedEventForEdit, setSelectedEventForEdit] = useState<{
    course: Course;
    section: Section;
  } | null>(null);

  // New Class Form State (Google Forms / ERP Style)
  const [formCode, setFormCode] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formCredits, setFormCredits] = useState(3);
  const [formDays, setFormDays] = useState<DayOfWeek[]>(['Mon', 'Wed', 'Fri']);
  const [formStartTime, setFormStartTime] = useState('09:00');
  const [formEndTime, setFormEndTime] = useState('10:15');
  const [formRoom, setFormRoom] = useState('Hall 101');
  const [formColorIndex, setFormColorIndex] = useState(0);

  // Feedback Modal State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackCategory, setFeedbackCategory] = useState<'Feature Request' | 'Timetable Bug' | 'Export Issue' | 'Other'>('Feature Request');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

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
  const isLoadedRef = useRef(false);

  const STORAGE_KEY_V3 = 'class_schedule_plans_v3';
  const STORAGE_KEY_ACTIVE_PLAN = 'class_schedule_active_plan_v3';
  const STORAGE_KEY = 'class_schedule_optimizer_state_v2';
  const LEGACY_STORAGE_KEY_COURSES = 'academic_planner_courses_v1';
  const LEGACY_STORAGE_KEY_TASKS = 'academic_planner_tasks_v1';

  // Close Plan dropdown on outside click
  useEffect(() => {
    if (!isPlanMenuOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (planMenuRef.current && !planMenuRef.current.contains(e.target as Node)) {
        setIsPlanMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isPlanMenuOpen]);

  // Load from LocalStorage or Hash
  useEffect(() => {
    let loadedPlans: SchedulePlan[] = [
      { id: 'plan-a', name: 'Plan A', courses: DEFAULT_SAMPLE_COURSES, tasks: [
        { id: 't1', title: 'Review CS301 Syllabus and office hours', completed: true },
        { id: 't2', title: 'Submit MATH 21 Homework 1', completed: false }
      ]},
      { id: 'plan-b', name: 'Plan B', courses: [], tasks: [] },
      { id: 'plan-c', name: 'Plan C', courses: [], tasks: [] }
    ];
    let loadedActiveId: 'plan-a' | 'plan-b' | 'plan-c' = 'plan-a';

        // 0. Restore Undo history & 5D/7D view preference across reload BEFORE any early return (S3 & S6)
    try {
      const savedUndo = localStorage.getItem('class_schedule_undo_snapshot_v1');
      if (savedUndo) {
        const parsedUndo = JSON.parse(savedUndo);
        if (parsedUndo && Array.isArray(parsedUndo.courses)) {
          historyStackRef.current = [parsedUndo];
          setCanUndo(true);
        }
      }
    } catch (e) {}
    try {
      const savedWeekend = localStorage.getItem('class_schedule_include_weekend_v1');
      if (savedWeekend === 'true') {
        setIncludeWeekend(true);
      }
    } catch (e) {}
    try {
      // 1. Check if URL hash has a shared schedule (#plan= or #share=)
      const hash = window.location.hash || '';
      let rawShareCode: string | null = null;
      if (hash.includes('plan=')) {
        rawShareCode = hash.split('plan=')[1]?.split('&')[0];
      } else if (hash.includes('share=')) {
        rawShareCode = hash.split('share=')[1]?.split('&')[0];
      }

            if (rawShareCode) {
        const decoded = decodeScheduleFromShareString(rawShareCode);
        if (decoded && decoded.length > 0) {
          const nameMatch = hash.match(/name=([^&]+)/);
          const sharedName = nameMatch ? decodeURIComponent(nameMatch[1]) : 'Shared Plan';
          loadedPlans[0].courses = decoded;
          loadedPlans[0].name = sharedName;
          setCourses(decoded);
          setPlans(loadedPlans);
          setActivePlanId('plan-a');
          setBanner(`Shared schedule "${sharedName}" loaded — it's now saved on this device.`);
          setTimeout(() => setBanner(null), 5000);
          isLoadedRef.current = true;
          return;
        }
      }

      // 2. Check V3 Multi-Plan Storage
      const savedV3 = localStorage.getItem(STORAGE_KEY_V3);
      const savedActive = localStorage.getItem(STORAGE_KEY_ACTIVE_PLAN) as 'plan-a' | 'plan-b' | 'plan-c' | null;
      if (savedV3) {
        const parsedV3 = JSON.parse(savedV3);
        if (Array.isArray(parsedV3) && parsedV3.length > 0) {
          loadedPlans = parsedV3;
          if (savedActive && ['plan-a', 'plan-b', 'plan-c'].includes(savedActive)) {
            loadedActiveId = savedActive;
          }
          const activePlan = loadedPlans.find(p => p.id === loadedActiveId) || loadedPlans[0];
          setPlans(loadedPlans);
          setActivePlanId(activePlan.id);
          setCourses(activePlan.courses || []);
          setTasks(activePlan.tasks || []);
          isLoadedRef.current = true;
          return;
        }
      }

      // 3. Fallback to V2 Single Plan (Migrate to Plan A)
      const savedV2 = localStorage.getItem(STORAGE_KEY);
      if (savedV2) {
        const parsed = JSON.parse(savedV2);
        if (parsed.courses && Array.isArray(parsed.courses)) {
          loadedPlans[0].courses = parsed.courses;
        }
        if (parsed.tasks && Array.isArray(parsed.tasks)) {
          loadedPlans[0].tasks = parsed.tasks;
        }
      } else {
        const legacyCourses = localStorage.getItem(LEGACY_STORAGE_KEY_COURSES);
        if (legacyCourses) {
          const parsed = JSON.parse(legacyCourses);
          if (Array.isArray(parsed) && parsed.length > 0) {
            loadedPlans[0].courses = parsed;
          }
        }
        const legacyTasks = localStorage.getItem(LEGACY_STORAGE_KEY_TASKS);
        if (legacyTasks) {
          loadedPlans[0].tasks = JSON.parse(legacyTasks);
        }
      }

      setPlans(loadedPlans);
      setActivePlanId('plan-a');
      setCourses(loadedPlans[0].courses);
      setTasks(loadedPlans[0].tasks);
    } catch (e) {
      setCourses(DEFAULT_SAMPLE_COURSES);
    } finally {
      isLoadedRef.current = true;
    }



    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkTheme(isDark);
  }, []);

  // Save State (courses, tasks & multi-plans)
  useEffect(() => {
    if (!isLoadedRef.current) return;
    try {
      setPlans(prevPlans => {
        const updated = prevPlans.map(p => 
          p.id === activePlanId ? { ...p, courses, tasks } : p
        );
        try {
          localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(updated));
          localStorage.setItem(STORAGE_KEY_ACTIVE_PLAN, activePlanId);
        } catch (e) {}
        return updated;
      });

      // Backward-compatible V2 & legacy storage
      const stateToSave = {
        courses,
        tasks,
        version: 2,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      localStorage.setItem(LEGACY_STORAGE_KEY_COURSES, JSON.stringify(courses));
      localStorage.setItem(LEGACY_STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save schedule to localStorage:', e);
    }
  }, [courses, tasks, activePlanId]);

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
    const norm = normalizeDayOfWeek(d) || d;
    setFormDays(prev => {
      const normalizedPrev = prev.map(p => normalizeDayOfWeek(p) || p);
      if (normalizedPrev.includes(norm)) {
        return normalizedPrev.filter(day => day !== norm);
      } else {
        return [...normalizedPrev, norm];
      }
    });
  };

  // Open Modal with clean reset
  const handleOpenNewClassModal = (day?: DayOfWeek, defaultStart?: string) => {
    setFormCode('');
    setFormTitle('');
    setFormRoom('');
    setFormCredits(3);
    setFormColorIndex(courses.length % APPLE_TAG_PALETTES.length);
    if (day) {
      const norm = normalizeDayOfWeek(day);
      setFormDays(norm ? [norm] : ['Mon']);
    } else {
      setFormDays(['Mon']);
    }

    if (defaultStart) {
      setFormStartTime(time12To24(defaultStart));
      const startM = parseFlexibleTime(defaultStart);
      const endM = startM + 75;
      const h = Math.floor(endM / 60);
      const m = endM % 60;
      setFormEndTime(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    } else {
      setFormStartTime('09:00');
      setFormEndTime('10:15');
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
    const hoursFromStart = dropY / HOUR_ROW_HEIGHT;
    const totalDropMins = gridStartHour * 60 + Math.floor(hoursFromStart * 60);
    const snapStartMins = Math.floor(totalDropMins / 15) * 15;
    const validStartMins = Math.max(gridStartHour * 60, Math.min(gridEndHour * 60 - 30, snapStartMins));
    const duration = draggedEvent.durationMins || 60;
    const validEndMins = Math.min(gridEndHour * 60, validStartMins + duration);

    pushUndoSnapshot(courses, tasks);
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
    const validDays = formDays
      .map(d => normalizeDayOfWeek(d))
      .filter((d): d is DayOfWeek => d !== null);

    if (validDays.length === 0) {
      setFormError('Please select at least one day for this class.');
      return;
    }
    const startM = parseFlexibleTime(time24To12(formStartTime));
    const endM = parseFlexibleTime(time24To12(formEndTime));
    if (endM <= startM) {
      setFormError('End time must be later than start time.');
      return;
    }

    // Auto-enable 7-day weekend view if Saturday or Sunday is selected
    if (validDays.some(d => d === 'Sat' || d === 'Sun') && !includeWeekend) {
      setIncludeWeekend(true);
    }

    pushUndoSnapshot(courses, tasks);

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
                days: [...validDays],
                startTime: time24To12(formStartTime),
                endTime: time24To12(formEndTime),
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
            days: [...validDays],
            startTime: time24To12(formStartTime),
            endTime: time24To12(formEndTime),
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
    pushUndoSnapshot(courses, tasks);
    setCourses(prev => prev.filter(c => c.id !== id));
    setSelectedEventForEdit(null);
    setIsClassModalOpen(false);
  };

  // Duplicate Course to Another Day
  const handleDuplicateToDay = (targetDay: DayOfWeek) => {
    if (!selectedEventForEdit) return;
    const { course, section } = selectedEventForEdit;
    
    // Add targetDay to the course's section days
    const normTarget = normalizeDayOfWeek(targetDay) || targetDay;
    if (!section.days.some(d => normalizeDayOfWeek(d) === normTarget)) {
      setCourses(prev => prev.map(c => {
        if (c.id === course.id) {
          return {
            ...c,
            sections: c.sections.map(s => {
              if (s.id === section.id) {
                return { ...s, days: [...s.days, normTarget] };
              }
              return s;
            })
          };
        }
        return c;
      }));
      setBanner(`Duplicated ${course.code} to ${DAY_LABELS[normTarget].full}`);
    }
    setSelectedEventForEdit(null);
    setIsClassModalOpen(false);
    setTimeout(() => setBanner(null), 3000);
  };

  // Multi-Plan Handlers (Plan A / B / C)
  const handleSwitchPlan = (targetPlanId: 'plan-a' | 'plan-b' | 'plan-c') => {
    if (targetPlanId === activePlanId) return;

    // 1. Commit current work to active plan
    const updatedPlans = plans.map(p => 
      p.id === activePlanId ? { ...p, courses, tasks } : p
    );
    setPlans(updatedPlans);
    try {
      localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(updatedPlans));
      localStorage.setItem(STORAGE_KEY_ACTIVE_PLAN, targetPlanId);
    } catch (e) {}

    // 2. Switch to target plan
    const target = updatedPlans.find(p => p.id === targetPlanId);
    setActivePlanId(targetPlanId);
    setIsPlanMenuOpen(false);
    if (target) {
      setCourses(target.courses || []);
      setTasks(target.tasks || []);
      setBanner(`Switched to ${target.name}${target.courses.length === 0 ? ' (empty schedule draft)' : ''}`);
      setTimeout(() => setBanner(null), 2500);
    }
  };

  const handleDuplicateCurrentPlan = (targetPlanId: 'plan-a' | 'plan-b' | 'plan-c') => {
    const targetPlan = plans.find(p => p.id === targetPlanId);
    const targetName = targetPlan?.name || (targetPlanId === 'plan-b' ? 'Plan B' : 'Plan C');
    const sourcePlan = plans.find(p => p.id === activePlanId);
    const sourceName = sourcePlan?.name || 'Plan A';
    
    const clonedCourses: Course[] = JSON.parse(JSON.stringify(courses));
    const clonedTasks: TaskItem[] = JSON.parse(JSON.stringify(tasks));
    
    const updated = plans.map(p => 
      p.id === targetPlanId ? { ...p, courses: clonedCourses, tasks: clonedTasks } : p
    );
    setPlans(updated);
    try {
      localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(updated));
    } catch (e) {}
    setIsPlanMenuOpen(false);
    setBanner(`Copied ${sourceName} into ${targetName}.`);
    setTimeout(() => setBanner(null), 3500);
  };

  const handleRenamePlan = (name: string) => {
    const clean = name.trim();
    if (!clean) return;
    const updated = plans.map(p => 
      p.id === activePlanId ? { ...p, name: clean } : p
    );
    setPlans(updated);
    try {
      localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(updated));
    } catch (e) {}
    setIsRenamePlanModalOpen(false);
    setBanner(`Plan renamed to "${clean}".`);
    setTimeout(() => setBanner(null), 2500);
  };

  const executeLoadPreset = (presetKey: string, targetPlanId: 'plan-a' | 'plan-b' | 'plan-c') => {
    const preset = MAJOR_PRESETS[presetKey];
    if (!preset) return;

    const clonedCourses: Course[] = JSON.parse(JSON.stringify(preset.courses));
    const clonedTasks: TaskItem[] = JSON.parse(JSON.stringify(preset.tasks || []));

    if (targetPlanId === activePlanId) {
      setCourses(clonedCourses);
      setTasks(clonedTasks);
    }

    const updated = plans.map(p => 
      p.id === targetPlanId ? { ...p, courses: clonedCourses, tasks: clonedTasks } : p
    );
    setPlans(updated);
    if (targetPlanId !== activePlanId) {
      setActivePlanId(targetPlanId);
      setCourses(clonedCourses);
      setTasks(clonedTasks);
    }
    try {
      localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(updated));
      localStorage.setItem(STORAGE_KEY_ACTIVE_PLAN, targetPlanId);
    } catch (e) {}

    const target = updated.find(p => p.id === targetPlanId);
    const targetName = target?.name || 'Current Plan';
    setIsPresetModalOpen(false);
    setBanner(`Loaded ${preset.name} (${preset.credits} cr) into ${targetName}!`);
    setTimeout(() => setBanner(null), 3500);
    try {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    } catch (e) {}
  };

  const handleRequestLoadPreset = (presetKey: string, requestedPlanId?: 'plan-a' | 'plan-b' | 'plan-c') => {
    const preset = MAJOR_PRESETS[presetKey];
    if (!preset) return;

    const targetId = requestedPlanId || activePlanId;
    const targetPlan = plans.find(p => p.id === targetId);
    const targetName = targetPlan?.name || 'Current Plan';

    if (targetPlan && targetPlan.courses && targetPlan.courses.length > 0) {
      setIsPresetModalOpen(false);
      setConfirmDialog({
        isOpen: true,
        type: 'preset-replace',
        title: `Load ${preset.name} Preset`,
        description: `Loading this preset will replace the ${targetPlan.courses.length} classes in ${targetName}.`,
        confirmLabel: `Replace ${targetName}`,
        onConfirm: () => {
          pushUndoSnapshot(courses, tasks);
          executeLoadPreset(presetKey, targetId);
          setConfirmDialog(null);
        },
        secondaryLabel: 'Load into New Plan',
        onSecondary: () => {
          const emptyPlan = plans.find(p => p.id !== targetId && (!p.courses || p.courses.length === 0));
          const nextTarget = emptyPlan ? emptyPlan.id : (targetId === 'plan-a' ? 'plan-b' : 'plan-c');
          executeLoadPreset(presetKey, nextTarget);
          setConfirmDialog(null);
        }
      });
    } else {
      pushUndoSnapshot(courses, tasks);
      executeLoadPreset(presetKey, targetId);
    }
  };

  const handleShareSchedule = () => {
    const currentPlan = plans.find(p => p.id === activePlanId);
    const planName = currentPlan?.name || 'Plan A';
    const shareCode = encodeScheduleToShareString(courses);
    const fullUrl = `${window.location.origin}/app#plan=${shareCode}&name=${encodeURIComponent(planName)}`;
    setShareUrl(fullUrl);
    setIsShareModalOpen(true);
    try {
      navigator.clipboard.writeText(fullUrl);
      setBanner(`Share link for "${planName}" copied to clipboard! Anyone opening it can view and save this schedule.`);
      setTimeout(() => setBanner(null), 4000);
      confetti({ particleCount: 40, spread: 45, origin: { y: 0.7 } });
    } catch (e) {}
  };

  // Reset Schedule to Sample Course Demonstration (P2: with confirmation modal)
  const handleTriggerReset = () => {
    setIsPlanMenuOpen(false);
    setConfirmDialog({
      isOpen: true,
      type: 'reset',
      title: 'Reset to Sample Schedule?',
      description: 'Replace this plan with the sample schedule? Your current classes in this plan will be removed.',
      confirmLabel: 'Reset Sample Schedule',
      onConfirm: () => {
        pushUndoSnapshot(courses, tasks);
        setCourses(DEFAULT_SAMPLE_COURSES);
        setPlans(prev => {
          const updated = prev.map(p =>
            p.id === activePlanId ? { ...p, courses: DEFAULT_SAMPLE_COURSES } : p
          );
          try {
            localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(updated));
          } catch (e) {}
          return updated;
        });
        setConfirmDialog(null);
        setBanner('Sample schedule restored.');
        setTimeout(() => setBanner(null), 3000);
      }
    });
  };

  // Start Empty Schedule (P2: clears current plan to 0 classes)
  const handleTriggerStartEmpty = () => {
    setIsPlanMenuOpen(false);
    setConfirmDialog({
      isOpen: true,
      type: 'start-empty',
      title: 'Start Empty Schedule?',
      description: 'Clear all classes from this plan? You will start with an empty timetable grid.',
      confirmLabel: 'Clear All & Start Empty',
      onConfirm: () => {
        pushUndoSnapshot(courses, tasks);
        setCourses([]);
        setPlans(prev => {
          const updated = prev.map(p =>
            p.id === activePlanId ? { ...p, courses: [] } : p
          );
          try {
            localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(updated));
          } catch (e) {}
          return updated;
        });
        setConfirmDialog(null);
        setBanner('Started empty schedule.');
        setTimeout(() => setBanner(null), 3000);
      }
    });
  };

  // Feedback Submission
  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;

    setIsSubmittingFeedback(true);

    const submission = {
      id: `fb_${Date.now()}`,
      rating,
      category: feedbackCategory,
      message: feedbackMessage.trim(),
      email: feedbackEmail.trim() || 'Not provided',
      timestamp: new Date().toISOString()
    };

    // 1. Send direct email to site owner via FormSubmit AJAX
    try {
      await fetch('https://formsubmit.co/ajax/Shahfahidbaloch@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `New ${rating}-Star Student Feedback [${feedbackCategory}]`,
          _template: 'table',
          Rating: `${rating} / 5 Stars`,
          Category: feedbackCategory,
          Message: feedbackMessage.trim(),
          StudentEmail: feedbackEmail.trim() || 'None given',
          SubmittedAt: new Date().toLocaleString()
        })
      });
    } catch (err) {
      console.warn('Feedback email dispatch:', err);
    }

    // 2. Persist locally as backup
    try {
      const existing = JSON.parse(localStorage.getItem('student_feedback_logs') || '[]');
      existing.push(submission);
      localStorage.setItem('student_feedback_logs', JSON.stringify(existing));
    } catch (e) {}

    setIsSubmittingFeedback(false);
    setIsFeedbackModalOpen(false);
    setFeedbackMessage('');
    setFeedbackEmail('');
    try {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    } catch (e) {}
    setBanner('Thank you! Your feedback has been sent directly to our team.');
    setTimeout(() => setBanner(null), 3500);
  };

  // Task Toggle
  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Delete Task
  const deleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(prev => prev.filter(t => t.id !== id));
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

    const calendarStartMins = gridStartHour * 60;
    const calendarEndMins = gridEndHour * 60;

    courses.forEach(course => {
      const activeSec = course.sections.find(s => s.id === course.selectedSectionId);
      if (!activeSec) return;

      activeSec.days.forEach(rawDay => {
        const day = normalizeDayOfWeek(rawDay);
        if (!day || !dayMap[day]) return;

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

  // Compute Live Metrics (Pure function: R5 - identical plans always yield identical gap totals)
  const metrics = useMemo(() => {
    const totalCredits = courses.reduce((sum, c) => sum + (c.credits || 0), 0);
    const totalGapMinutes = calculateScheduleIdleGaps(courses, activeDaysList);
    let conflictPairs = 0;

    activeDaysList.forEach(day => {
      const daySlots = placedEventsByDay[day] || [];
      for (let i = 0; i < daySlots.length; i++) {
        for (let j = i + 1; j < daySlots.length; j++) {
          const a = daySlots[i];
          const b = daySlots[j];
          if (Math.max(a.startMins, b.startMins) < Math.min(a.endMins, b.endMins)) {
            conflictPairs++;
          }
        }
      }
    });

    return {
      totalCredits,
      totalGapMinutes,
      gapHours: (totalGapMinutes / 60).toFixed(1),
      conflicts: conflictPairs
    };
  }, [courses, placedEventsByDay, activeDaysList]);

  // Honest Gap Optimizer Engine (R5: uses total idle wait consistently in proposal, toast, and header)
  const handleOptimizeGaps = () => {
    if (courses.length === 0) {
      setBanner('No classes in timetable to optimize.');
      setTimeout(() => setBanner(null), 3000);
      return;
    }

    const currentTotalGaps = calculateScheduleIdleGaps(courses, activeDaysList);
    if (currentTotalGaps < 30) {
      setBanner('Your schedule is already compact — no change reduces your idle gaps.');
      setTimeout(() => setBanner(null), 3500);
      return;
    }

    const candidateCourses: Course[] = JSON.parse(JSON.stringify(courses));
    let hasImprovements = false;

    for (const day of activeDaysList) {
      const daySlots = (placedEventsByDay[day] || []).slice().sort((a, b) => a.startMins - b.startMins);
      if (daySlots.length <= 1) continue;

      for (let i = 0; i < daySlots.length - 1; i++) {
        const first = daySlots[i];
        const second = daySlots[i + 1];
        const gap = second.startMins - first.endMins;

        if (gap >= 30) {
          const secondDuration = second.endMins - second.startMins;
          const proposedStart = first.endMins + 15;
          const proposedEnd = proposedStart + secondDuration;

          const targetCourse = candidateCourses.find(c => c.id === second.courseId);
          if (!targetCourse) continue;
          const targetSec = targetCourse.sections.find(s => s.id === second.rawSection.id);
          if (!targetSec) continue;

          let clash = false;
          for (const meetDay of targetSec.days) {
            const dayEvents = (placedEventsByDay[meetDay] || []).filter(e => e.courseId !== second.courseId);
            if (dayEvents.some(e => Math.max(e.startMins, proposedStart) < Math.min(e.endMins, proposedEnd))) {
              clash = true;
              break;
            }
          }

          if (!clash && proposedStart < second.startMins) {
            targetSec.startTime = minutesToTime12(proposedStart);
            targetSec.endTime = minutesToTime12(proposedEnd);
            hasImprovements = true;
          }
        }
      }
    }

    if (hasImprovements) {
      const newTotalGaps = calculateScheduleIdleGaps(candidateCourses, activeDaysList);
      if (newTotalGaps < currentTotalGaps) {
        const currentHours = (currentTotalGaps / 60).toFixed(1);
        const proposedHours = (newTotalGaps / 60).toFixed(1);
        const savedHours = Math.max(0, parseFloat(currentHours) - parseFloat(proposedHours)).toFixed(1);
        setOptimizerProposal({
          isOpen: true,
          currentGapHours: currentHours,
          proposedGapHours: proposedHours,
          savedHours,
          proposedCourses: candidateCourses
        });
        return;
      }
    }

    setBanner('Your schedule is already compact — no change reduces your idle gaps.');
    setTimeout(() => setBanner(null), 3500);
  };

  const handleApplyOptimizerProposal = () => {
    if (!optimizerProposal) return;
    pushUndoSnapshot(courses, tasks);
    setCourses(optimizerProposal.proposedCourses);
    setPlans(prev => {
      const updated = prev.map(p =>
        p.id === activePlanId ? { ...p, courses: optimizerProposal.proposedCourses } : p
      );
      try {
        localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setOptimizerProposal(null);
    setBanner(`Schedule optimized! Total idle gaps cut from ${optimizerProposal.currentGapHours}h to ${optimizerProposal.proposedGapHours}h (saved ${optimizerProposal.savedHours}h).`);
    setTimeout(() => setBanner(null), 3500);
    try {
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    } catch (e) {}
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

      sec.days.forEach(rawDay => {
        const day = normalizeDayOfWeek(rawDay);
        if (!day || !dayMap[day]) return;

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
    setBanner('.ICS calendar file downloaded — import into Google Calendar or Apple Calendar.');
    setTimeout(() => setBanner(null), 3500);
  };

  // Export PNG Image
    const handlePrint = () => {
    setBanner('PDF / Print dialog opened.');
    setTimeout(() => setBanner(null), 3500);
    window.print();
  };

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
      setBanner('PNG exported — downloaded successfully.');
      setTimeout(() => setBanner(null), 3500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
      setIsExportModalOpen(false);
    }
  };

  // Hours List (Derived dynamically from gridStartHour and gridEndHour)
  const hoursList = useMemo(() => {
    const list: { hour: number; label: string }[] = [];
    for (let h = gridStartHour; h <= gridEndHour; h++) {
      const ampm = h >= 12 ? 'PM' : 'AM';
      const displayH = h % 12 === 0 ? 12 : h % 12;
      list.push({ hour: h, label: `${displayH} ${ampm}` });
    }
    return list;
  }, [gridStartHour, gridEndHour]);

  const totalGridHeight = (gridEndHour - gridStartHour) * HOUR_ROW_HEIGHT;

  // Render Day Column (Shared between Desktop multi-column and Mobile single-day view)
  const renderDayColumn = (day: DayOfWeek, isMobileSingle = false) => {
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
        className={`relative h-full ${isMobileSingle ? 'w-full' : 'border-r border-zinc-200 dark:border-zinc-800 last:border-r-0'} transition-colors ${
          isDayDragTarget ? 'bg-zinc-200/60 dark:bg-zinc-800/60 ring-2 ring-inset ring-zinc-500' : ''
        }`}
      >
        {events.map(event => {
          const pal = APPLE_TAG_PALETTES[event.colorIndex % APPLE_TAG_PALETTES.length];
          const isClashed = event.hasClash;
          const totalCols = event.totalLanes || 1;
          const colWidthPercent = 100 / totalCols;

          const leftPos = totalCols === 1
            ? '4px'
            : `calc(${event.lane * colWidthPercent}% + 2px)`;
          const blockWidth = totalCols === 1
            ? 'calc(100% - 8px)'
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
                setSelectedEventForEdit({ course: event.rawCourse, section: event.rawSection });
                setFormCode(event.rawCourse.code);
                setFormTitle(event.rawCourse.title);
                setFormCredits(event.rawCourse.credits);
                setFormDays(event.rawSection.days);
                setFormStartTime(time12To24(event.rawSection.startTime));
                setFormEndTime(time12To24(event.rawSection.endTime));
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
              title={`${event.code} - ${event.title}\nClick to edit or drag to reschedule • Dragging a class moves all of its weekly meetings`}
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
                    className="opacity-60 md:opacity-0 md:group-hover:opacity-100 hover:text-rose-600 transition p-1 rounded cursor-pointer"
                    title="Delete class"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {event.title && (
                  <div className={`text-[11px] font-medium ${event.heightPx <= 74 ? "truncate" : "line-clamp-2 break-words"} leading-tight ${pal.textTitle}`}>
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

              <div className={`text-[10px] font-mono font-semibold pt-0.5 pb-0.5 truncate shrink-0 flex items-center gap-1 border-t border-black/5 dark:border-white/10 ${pal.textMeta}`}>
                <Clock className="w-2.5 h-2.5 shrink-0 opacity-75" />
                <span className="truncate">{formatClassTimeRange(event.startTime, event.endTime, !isMobileSingle && totalCols > 1)}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-[#FBFBFD] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950 overflow-x-hidden relative">
      
      {/* Full-screen click-away overlay for Language Dropdown to prevent clicks from bleeding into calendar cells */}
      {isLangMenuOpen && (
        <div
          className="fixed inset-0 z-35 bg-transparent cursor-default select-none"
          onClick={(e) => {
            e.stopPropagation();
            setIsLangMenuOpen(false);
          }}
        />
      )}
      
      {/* 1. Left Micro-Sidebar (Desktop Only: clean vertical navigation with micro-labels) */}
      <aside className="hidden md:flex w-16 sm:w-18 shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] flex-col items-center justify-between py-4 select-none z-30 transition-colors">
        
        {/* Top: Home Link & Core Studio Tools */}
        <div className="flex flex-col items-center gap-2 w-full px-1.5">
          
          {/* Logo / Back to Home */}
          <a
            href="/"
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:scale-105 transition-transform shadow-xs cursor-pointer overflow-hidden p-0.5"
            title="Free Class Schedule Maker Home"
          >
            <img src="/logo.svg" alt="Class Schedule Logo" className="w-full h-full object-contain rounded-lg" />
          </a>

          <div className="w-8 h-px bg-zinc-200 dark:bg-zinc-800 my-0.5" />

          {/* [+ Add Class] Primary Action */}
          <button
            onClick={() => handleOpenNewClassModal()}
            className="w-full py-2 px-1 rounded-xl bg-zinc-950 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 flex flex-col items-center justify-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer group"
            title="+ Add New Class"
          >
            <Plus className="w-4 h-4 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
            <span className="text-[10px] font-bold tracking-tight leading-none">Add</span>
          </button>

          {/* Tasks & Assignments */}
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="w-full py-2 px-1 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-850 flex flex-col items-center justify-center gap-1 transition cursor-pointer relative"
            title="Tasks & Deadlines"
          >
            <CheckSquare className="w-4 h-4" />
            {tasks.filter(t => !t.completed).length > 0 && (
              <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-zinc-900 dark:bg-white" />
            )}
            <span className="text-[10px] font-semibold tracking-tight leading-none">Tasks</span>
          </button>

          {/* Gap Optimizer Engine */}
          <button
            onClick={handleOptimizeGaps}
            className="w-full py-2 px-1 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-850 flex flex-col items-center justify-center gap-1 transition cursor-pointer"
            title="Run Gap Optimizer Engine"
          >
            <Sliders className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            <span className="text-[10px] font-semibold tracking-tight leading-none">Optimize</span>
          </button>

          {/* Export Hub */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="w-full py-2 px-1 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-850 flex flex-col items-center justify-center gap-1 transition cursor-pointer"
            title="Export Timetable (PNG, PDF, .ICS)"
          >
            <Download className="w-4 h-4" />
            <span className="text-[10px] font-semibold tracking-tight leading-none">Export</span>
          </button>

          {/* 5-Day / 7-Day Weekend Toggle */}
          <button
            onClick={() => { const next = !includeWeekend; setIncludeWeekend(next); try { localStorage.setItem('class_schedule_include_weekend_v1', String(next)); } catch (e) {} }}
            className={`w-full py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
              includeWeekend
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-2xs font-bold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-850'
            }`}
            title={includeWeekend ? 'Showing 7 Days (Mon-Sun)' : 'Showing 5 Days (Mon-Fri)'}
          >
            <span className="text-xs font-bold font-mono leading-none">{includeWeekend ? '7D' : '5D'}</span>
            <span className="text-[10px] font-semibold tracking-tight leading-none">Days</span>
          </button>

          <div className="w-8 h-px bg-zinc-200 dark:bg-zinc-800 my-0.5" />

          {/* Quick Instructions & Feature Guide */}
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="w-full py-2 px-1 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-850 flex flex-col items-center justify-center gap-1 transition cursor-pointer"
            title="How to Use & Feature Instructions"
          >
            <BookOpen className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            <span className="text-[10px] font-semibold tracking-tight leading-none">Guide</span>
          </button>

          {/* Student Feedback Modal Trigger */}
          <button
            onClick={() => setIsFeedbackModalOpen(true)}
            className="w-full py-2 px-1 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-850 flex flex-col items-center justify-center gap-1 transition cursor-pointer relative"
            title="Send Student Feedback & Rating"
          >
            <MessageSquare className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            <span className="text-[10px] font-semibold tracking-tight leading-none">Feedback</span>
          </button>
        </div>

        {/* Bottom: Visual Theme Toggle */}
        <div className="flex flex-col items-center w-full px-1.5">
          <button
            onClick={toggleTheme}
            className="w-full py-2 px-1 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-850 flex flex-col items-center justify-center gap-1 transition cursor-pointer"
            title="Toggle Visual Theme (Light/Dark)"
          >
            {isDarkTheme ? <Sun className="w-4 h-4 text-zinc-200" /> : <Moon className="w-4 h-4 text-zinc-700" />}
            <span className="text-[10px] font-semibold tracking-tight leading-none">Theme</span>
          </button>
        </div>

      </aside>

      {/* Main Studio Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Control Bar (M1: Responsive 2-Row Layout at ≤1100px, 1-Row at ≥1100px - Zero Overlaps) */}
        <header className="relative z-40 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#121215]/95 backdrop-blur-md select-none shrink-0" ref={planMenuRef}>
          
          {/* 1. MOBILE (< 768px): Clean 2-Row Stacked Control Bar */}
          <div className="md:hidden flex flex-col">
            {/* Mobile Row 1: Brand & Primary Actions */}
            <div className="h-12 px-3 flex items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/60">
              <div className="flex items-center gap-2 min-w-0">
                <a 
                  href="/"
                  className="flex items-center p-0.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition shrink-0"
                  title="Return to Home"
                >
                  <img src="/logo.svg" alt="Class Schedule Logo" className="w-6 h-6 rounded-lg object-contain" />
                </a>
                <h1 className="text-sm font-bold tracking-tight text-zinc-950 dark:text-white truncate">
                  {t.nav?.scheduleStudio || 'Class Schedule'}
                </h1>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleOpenNewClassModal(mobileDay)}
                  className="h-8 px-2.5 rounded-xl bg-zinc-950 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold flex items-center gap-1 shadow-2xs transition active:scale-[0.98] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Class</span>
                </button>

                <button
                  onClick={handleShareSchedule}
                  className="h-8 px-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                  title="Share Timetable Link"
                >
                  <Share2 className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                  <span>Share</span>
                </button>

                <button
                  onClick={() => setIsStudioMenuOpen(true)}
                  className="h-8 w-8 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition cursor-pointer shrink-0"
                  aria-label="Open Studio Menu"
                >
                  <Menu className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Row 2: Plan A / B / C Pills + Quick Stats Snippet */}
            <div className="h-10 px-3 flex items-center justify-between gap-2 bg-zinc-50/50 dark:bg-zinc-900/40">
              <div className="flex items-center bg-zinc-100 dark:bg-zinc-850 p-0.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 relative shrink-0">
                {plans.map(p => {
                  const isActive = p.id === activePlanId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSwitchPlan(p.id)}
                      className={`px-2 py-0.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-2xs font-bold'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                      }`}
                      title={`Switch to ${p.name}`}
                    >
                      {p.name}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setIsPlanMenuOpen(!isPlanMenuOpen)}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60 transition cursor-pointer ml-0.5"
                  title="Plan Options"
                >
                  <Sliders className="w-3 h-3" />
                </button>

                {isPlanMenuOpen && (
                  <div className="absolute left-0 mt-2 top-full w-48 rounded-xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 shadow-xl py-1 z-50 text-xs">
                    
                    <button
                      onClick={() => {
                        const cur = plans.find(p => p.id === activePlanId);
                        setNewPlanName(cur?.name || 'Plan A');
                        setIsPlanMenuOpen(false);
                        setIsRenamePlanModalOpen(true);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Rename Current Plan</span>
                    </button>

                    <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Duplicate Schedule To
                    </div>
                    {plans.filter(p => p.id !== activePlanId).map(p => (
                      <button
                        key={p.id}
                        onClick={() => handleDuplicateCurrentPlan(p.id)}
                        className="w-full px-3 py-1.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-zinc-300 whitespace-nowrap"
                      >
                        <Copy className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Copy into {p.name}</span>
                      </button>
                    ))}

                    <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

                    <button
                      onClick={() => {
                        setIsPlanMenuOpen(false);
                        setIsPresetModalOpen(true);
                      }}
                      className="w-full px-3 py-1.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Load Degree Preset...</span>
                    </button>

                    <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

                    <button
                      onClick={handleTriggerStartEmpty}
                      className="w-full px-3 py-1.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Start Empty Schedule</span>
                    </button>

                    <button
                      onClick={handleTriggerReset}
                      className="w-full px-3 py-1.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Reset Sample Schedule</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-600 dark:text-zinc-400 shrink-0">
                <span><strong className="font-semibold text-zinc-950 dark:text-white">{metrics.totalCredits}</strong> cr</span>
                <span>&bull;</span>
                <span><strong className="font-semibold text-zinc-950 dark:text-white">{metrics.gapHours}h</strong> gaps</span>
              </div>
            </div>
          </div>

          {/* 2. TABLET & SMALL LAPTOP (768px to 1100px): Clean 2-Row Layout */}
          <div className="hidden md:flex xl:hidden flex-col">
            {/* Tablet Row 1: Title + Status Badges on Left; Utilities on Right */}
            <div className="h-12 px-4 sm:px-6 flex items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800/80">
              <div className="flex items-center gap-3">
                <h1 className="text-sm font-bold tracking-tight text-zinc-950 dark:text-white flex items-center gap-2 whitespace-nowrap">
                  <span>{t.nav?.scheduleStudio || 'Class Schedule Studio'}</span>
                </h1>
                
                {/* Status Badges */}
                <div className="flex items-center gap-2 text-xs font-medium px-2.5 py-0.5 rounded-full border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/60 whitespace-nowrap">
                  <span className="text-zinc-700 dark:text-zinc-300">
                    <strong className="font-semibold text-zinc-950 dark:text-white">{metrics.totalCredits}</strong> credits
                  </span>
                  <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <span className="text-zinc-700 dark:text-zinc-300">
                    <strong className="font-semibold text-zinc-950 dark:text-white">{metrics.gapHours}h</strong> gaps
                  </span>
                  <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  {metrics.conflicts > 0 ? (
                    <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{metrics.conflicts} conflict{metrics.conflicts > 1 ? 's' : ''}</span>
                    </span>
                  ) : (
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                      <span>Conflict-free</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Tablet Row 1 Right: Utilities (Language, Undo, Reset, Guide) */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="relative" ref={langMenuRef}>
                  <button
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    className="h-8 px-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                    title="Select Language"
                  >
                    <Globe className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-[10px] font-mono uppercase">{locale}</span>
                  </button>
                  {isLangMenuOpen && (
                    <div className="absolute right-0 mt-1.5 w-48 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] shadow-2xl p-1.5 z-50 flex flex-col gap-0.5 text-xs animate-in fade-in zoom-in-95 duration-100">
                      {Object.values(LOCALES).map((loc) => (
                        <button
                          key={loc.code}
                          onClick={() => {
                            changeLocale(loc.code);
                            setIsLangMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                            locale === loc.code
                              ? 'bg-zinc-100 dark:bg-zinc-800 font-bold text-zinc-950 dark:text-white'
                              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:text-zinc-950 dark:hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <span className="text-sm">{loc.flag}</span>
                            <span className="font-medium">{loc.nativeName}</span>
                          </span>
                          {locale === loc.code && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleUndo}
                  disabled={!canUndo}
                  className={`h-8 w-8 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center transition shrink-0 ${
                    canUndo
                      ? 'text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer'
                      : 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed opacity-40'
                  }`}
                  title="Undo last action (Ctrl+Z)"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleTriggerReset}
                  className="h-8 w-8 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition cursor-pointer shrink-0"
                  title="Reset sample schedule"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setIsOnboardingOpen(true)}
                  className="h-8 w-8 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition cursor-pointer shrink-0"
                  title="How to Use & Feature Instructions"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Tablet Row 2: Plan Switcher on Left; Action Buttons on Right */}
            <div className="h-11 px-4 sm:px-6 flex items-center justify-between gap-3 bg-zinc-50/50 dark:bg-zinc-900/30">
              <div className="flex items-center bg-zinc-100 dark:bg-zinc-850 p-0.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 relative shrink-0">
                {plans.map(p => {
                  const isActive = p.id === activePlanId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSwitchPlan(p.id)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-2xs font-bold'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                      }`}
                      title={`Switch to ${p.name}`}
                    >
                      {p.name}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setIsPlanMenuOpen(!isPlanMenuOpen)}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60 transition cursor-pointer ml-0.5"
                  title="Plan Options"
                >
                  <Sliders className="w-3 h-3" />
                </button>

                {isPlanMenuOpen && (
                  <div className="absolute left-0 mt-2 top-full w-48 rounded-xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 shadow-xl py-1 z-50 text-xs">
                    
                    <button
                      onClick={() => {
                        const cur = plans.find(p => p.id === activePlanId);
                        setNewPlanName(cur?.name || 'Plan A');
                        setIsPlanMenuOpen(false);
                        setIsRenamePlanModalOpen(true);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Rename Current Plan</span>
                    </button>

                    <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Duplicate Schedule To
                    </div>
                    {plans.filter(p => p.id !== activePlanId).map(p => (
                      <button
                        key={p.id}
                        onClick={() => handleDuplicateCurrentPlan(p.id)}
                        className="w-full px-3 py-1.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-zinc-300 whitespace-nowrap"
                      >
                        <Copy className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Copy into {p.name}</span>
                      </button>
                    ))}

                    <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

                    <button
                      onClick={() => {
                        setIsPlanMenuOpen(false);
                        setIsPresetModalOpen(true);
                      }}
                      className="w-full px-3 py-1.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Load Degree Preset...</span>
                    </button>

                    <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

                    <button
                      onClick={handleTriggerStartEmpty}
                      className="w-full px-3 py-1.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Start Empty Schedule</span>
                    </button>

                    <button
                      onClick={handleTriggerReset}
                      className="w-full px-3 py-1.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Reset Sample Schedule</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Tablet Row 2 Right: Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleOpenNewClassModal(mobileDay)}
                  className="h-8 px-3 rounded-xl bg-zinc-950 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition active:scale-[0.98] cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Class</span>
                </button>
                <button
                  onClick={handleShareSchedule}
                  className="h-8 px-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium flex items-center gap-1 transition cursor-pointer whitespace-nowrap"
                  title="Share Timetable Link"
                >
                  <Share2 className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                  <span>Share</span>
                </button>
                <button
                  onClick={() => setIsPresetModalOpen(true)}
                  className="h-8 px-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium flex items-center gap-1 transition cursor-pointer whitespace-nowrap"
                  title="Load Degree Presets"
                >
                  <Bookmark className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                  <span>Presets</span>
                </button>
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="h-8 px-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium flex items-center gap-1 transition cursor-pointer whitespace-nowrap"
                  title="Export Timetable"
                >
                  <Download className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                  <span>Export</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="h-8 w-8 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition cursor-pointer shrink-0"
                  title="Print / Save PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 3. LARGE DESKTOP (≥ 1100px / xl): Sleek Unified 1-Row Control Bar */}
          <div className="hidden xl:flex h-14 px-6 items-center justify-between gap-4 select-none">
            {/* Desktop Left: Title & Plan Switcher & Status Badges */}
            <div className="flex items-center gap-3.5 min-w-0">
              <h1 className="text-base font-bold tracking-tight text-zinc-950 dark:text-white flex items-center gap-2 whitespace-nowrap shrink-0">
                <span>{t.nav?.scheduleStudio || 'Class Schedule Studio'}</span>
              </h1>

              {/* Plan Switcher */}
              <div className="flex items-center bg-zinc-100 dark:bg-zinc-850 p-0.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 relative shrink-0">
                {plans.map(p => {
                  const isActive = p.id === activePlanId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSwitchPlan(p.id)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-2xs font-bold'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                      }`}
                      title={`Switch to ${p.name}`}
                    >
                      {p.name}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setIsPlanMenuOpen(!isPlanMenuOpen)}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60 transition cursor-pointer ml-0.5"
                  title="Plan Options"
                >
                  <Sliders className="w-3 h-3" />
                </button>

                {isPlanMenuOpen && (
                  <div className="absolute left-0 mt-2 top-full w-48 rounded-xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 shadow-xl py-1 z-50 text-xs">
                    
                    <button
                      onClick={() => {
                        const cur = plans.find(p => p.id === activePlanId);
                        setNewPlanName(cur?.name || 'Plan A');
                        setIsPlanMenuOpen(false);
                        setIsRenamePlanModalOpen(true);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Rename Current Plan</span>
                    </button>

                    <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Duplicate Schedule To
                    </div>
                    {plans.filter(p => p.id !== activePlanId).map(p => (
                      <button
                        key={p.id}
                        onClick={() => handleDuplicateCurrentPlan(p.id)}
                        className="w-full px-3 py-1.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-zinc-300 whitespace-nowrap"
                      >
                        <Copy className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Copy into {p.name}</span>
                      </button>
                    ))}

                    <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

                    <button
                      onClick={() => {
                        setIsPlanMenuOpen(false);
                        setIsPresetModalOpen(true);
                      }}
                      className="w-full px-3 py-1.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Load Degree Preset...</span>
                    </button>

                    <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

                    <button
                      onClick={handleTriggerStartEmpty}
                      className="w-full px-3 py-1.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Start Empty Schedule</span>
                    </button>

                    <button
                      onClick={handleTriggerReset}
                      className="w-full px-3 py-1.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Reset Sample Schedule</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Status Badges */}
              <div className="flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/60 whitespace-nowrap shrink-0">
                <span className="text-zinc-700 dark:text-zinc-300">
                  <strong className="font-semibold text-zinc-950 dark:text-white">{metrics.totalCredits}</strong> credits
                </span>
                <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <span className="text-zinc-700 dark:text-zinc-300">
                  <strong className="font-semibold text-zinc-950 dark:text-white">{metrics.gapHours}h</strong> gaps
                </span>
                <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                {metrics.conflicts > 0 ? (
                  <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{metrics.conflicts} conflict{metrics.conflicts > 1 ? 's' : ''}</span>
                  </span>
                ) : (
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                    <span>Conflict-free</span>
                  </span>
                )}
              </div>
            </div>

            {/* Desktop Right: All Primary & Secondary Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleOpenNewClassModal(mobileDay)}
                className="h-9 px-3.5 rounded-xl bg-zinc-950 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{t.actions.newClass || 'Add Class'}</span>
              </button>

              <button
                onClick={handleShareSchedule}
                className="h-9 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap"
                title="Share Timetable Link"
              >
                <Share2 className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                <span>Share</span>
              </button>

              <button
                onClick={() => setIsPresetModalOpen(true)}
                className="h-9 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap"
                title="Load Degree Presets"
              >
                <Bookmark className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                <span>Presets</span>
              </button>

              <button
                onClick={() => setIsExportModalOpen(true)}
                className="h-9 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap"
                title="Export Timetable"
              >
                <Download className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                <span>Export</span>
              </button>

              <button
                onClick={handlePrint}
                className="h-9 w-9 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition cursor-pointer shrink-0"
                title="Print / Save PDF"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="h-9 w-9 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition cursor-pointer shrink-0"
                title="How to Use & Feature Instructions"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsFeedbackModalOpen(true)}
                className="h-9 px-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap shrink-0"
                title="Send Student Feedback & Rating"
              >
                <MessageSquare className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                <span>Feedback</span>
              </button>

              <div className="relative" ref={langMenuRef}>
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="h-9 px-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap"
                  title="Select Language"
                >
                  <Globe className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-[11px] font-mono uppercase">{locale}</span>
                </button>
                {isLangMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-48 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] shadow-2xl p-1.5 z-50 flex flex-col gap-0.5 text-xs animate-in fade-in zoom-in-95 duration-100">
                    {Object.values(LOCALES).map((loc) => (
                      <button
                        key={loc.code}
                        onClick={() => {
                          changeLocale(loc.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                          locale === loc.code
                            ? 'bg-zinc-100 dark:bg-zinc-800 font-bold text-zinc-950 dark:text-white'
                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:text-zinc-950 dark:hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="text-sm">{loc.flag}</span>
                          <span className="font-medium">{loc.nativeName}</span>
                        </span>
                        {locale === loc.code && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleUndo}
                disabled={!canUndo}
                className={`h-9 w-9 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center transition shrink-0 ${
                  canUndo
                    ? 'text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer'
                    : 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed opacity-40'
                }`}
                title="Undo last action (Ctrl+Z)"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleTriggerReset}
                className="h-9 w-9 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition cursor-pointer shrink-0"
                title="Reset sample schedule"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </header>

        {/* Sample Schedule Dismissible Hint Banner (P11 & M5: compact single line on phone) */}
        {showSampleHint && courses === DEFAULT_SAMPLE_COURSES && (
          <div className="mx-3 sm:mx-6 mt-2 px-3 py-1.5 sm:py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 flex items-center justify-between gap-2.5 animate-in fade-in shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="hidden sm:flex items-center gap-1.5 truncate">
                <span className="font-bold text-zinc-900 dark:text-white">Sample Timetable:</span>
                <span>This is a sample schedule — add your own classes, or Start empty (Plan Options).</span>
              </div>
              <div className="sm:hidden text-[11px] text-zinc-700 dark:text-zinc-300 truncate">
                <span>Sample schedule — tap ✕ to dismiss, or Start empty via Plan Options</span>
              </div>
            </div>
            <button
              onClick={() => {
                setShowSampleHint(false);
                try {
                  localStorage.setItem('sample_schedule_hint_dismissed', 'true');
                } catch (e) {}
              }}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer shrink-0"
              title="Dismiss hint"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Toast Alert Banner */}
        {banner && (
          <div className="mx-3 sm:mx-6 mt-3 p-3 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-between text-xs font-semibold shadow-md animate-in fade-in duration-150 shrink-0">
            <div className="flex items-center gap-2">
              <span>{banner}</span>
            </div>
            <button onClick={() => setBanner(null)} className="text-xs opacity-75 hover:opacity-100 cursor-pointer">
              ✕
            </button>
          </div>
        )}

        {/* Mobile Day Tabs Bar (< 768px: Segmented Control) */}
        <div className="flex md:hidden items-center gap-1.5 px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#121215]/95 backdrop-blur-sm select-none shrink-0 overflow-x-auto">
          {activeDaysList.map(d => {
            const dayEvents = placedEventsByDay[d] || [];
            const hasClasses = dayEvents.length > 0;
            const isSelected = mobileDay === d;
            return (
              <button
                key={d}
                onClick={() => setMobileDay(d)}
                className={`flex-1 min-w-[48px] py-2 px-1 text-xs font-bold rounded-xl transition-all flex flex-col items-center justify-center relative cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                    : 'bg-zinc-100/60 dark:bg-zinc-850/60 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <span>{t.days.short[d] || DAY_LABELS[d].short}</span>
                {hasClasses && (
                  <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                    isSelected ? 'bg-white dark:bg-zinc-950' : 'bg-zinc-500 dark:bg-zinc-400'
                  }`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Desktop Weekly Matrix Canvas (hidden on mobile, multi-day grid) */}
        <div className="hidden md:flex flex-1 overflow-auto p-4 sm:p-6 pb-6 timetable-print-target" ref={timetableRef}>
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] shadow-xs overflow-hidden w-full">
            
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
                  {activeDaysList.map(day => renderDayColumn(day, false))}
                </div>

              </div>

            </div>

            {/* Export Branding & Watermark Footer */}
            <div className="py-2.5 px-4 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-zinc-800 dark:text-zinc-200">FreeClassSchedule.com</span>
                <span>&bull;</span>
                <span>100% Free Timetable Studio</span>
              </div>
              <div className="hidden sm:block">
                <span>Made with FreeClassSchedule.com</span>
              </div>
            </div>

          </div>
        </div>

        {/* Mobile Single-Day Canvas (< 768px: Zero Horizontal Scroll, 100% Column Width) */}
        <div className="flex md:hidden flex-1 flex-col overflow-y-auto px-3 py-2 timetable-print-target" style={{ paddingBottom: "calc(5.5rem + env(safe-area-inset-bottom, 24px))" }}>
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] shadow-xs overflow-hidden w-full flex flex-col">
            
            {/* Header: Day Name & Quick Event Count */}
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-zinc-900 dark:text-white">
                  {t.days.full[mobileDay] || DAY_LABELS[mobileDay].full}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {(placedEventsByDay[mobileDay] || []).length} {t.metrics.classesEnrolled || 'Classes'}
                </span>
              </div>
              <button
                onClick={() => handleOpenNewClassModal(mobileDay)}
                className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.actions.newClass}</span>
              </button>
            </div>

            {/* Mobile Calendar Body */}
            <div className="relative flex w-full" style={{ height: `${totalGridHeight}px` }}>
              
              {/* Minimal Left Time Axis (44px) */}
              <div className="w-[50px] shrink-0 relative border-r border-zinc-200 dark:border-zinc-800 select-none bg-zinc-50/50 dark:bg-zinc-900/60">
                {hoursList.slice(0, -1).map(item => (
                  <div
                    key={item.hour}
                    style={{ height: `${HOUR_ROW_HEIGHT}px` }}
                    className="border-b border-zinc-200 dark:border-zinc-800 flex items-start justify-end pr-2 pt-1.5 text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-400"
                  >
                    <span>{item.hour % 12 === 0 ? 12 : item.hour % 12}</span>
                    <span className="text-[8px] font-semibold text-zinc-400 dark:text-zinc-500 ml-0.5">{item.hour >= 12 ? 'PM' : 'AM'}</span>
                  </div>
                ))}
              </div>

              {/* Single Day Canvas occupying 100% of remaining width */}
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

                {/* Render ONLY the active mobileDay */}
                {renderDayColumn(mobileDay, true)}

              </div>

            </div>

            {/* Bottom Clearance Spacer for Nav Bar */} 
            <div className="h-16 shrink-0" />
          </div>
        </div>

      </div>

      {/* Mobile Bottom Navigation Bar (iOS / Android Style: Fixed at Bottom) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-white/95 dark:bg-[#121215]/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 z-40 px-2 grid grid-cols-5 items-center justify-items-center select-none">
        
        {/* 1. Day / Today Indicator */}
        <button
          onClick={() => {
            const today = new Date().getDay();
            const dayMap: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const todayCode = dayMap[today];
            if (activeDaysList.includes(todayCode)) {
              setMobileDay(todayCode);
            } else {
              setMobileDay('Mon');
            }
          }}
          className="w-full flex flex-col items-center justify-center gap-0.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition cursor-pointer h-12 overflow-hidden px-1"
        >
          <Calendar className="w-4 h-4 shrink-0" />
          <span className="text-[10px] font-bold tracking-tight truncate max-w-full text-center">
            {t.days?.short?.[mobileDay] || mobileDay}
          </span>
        </button>

        {/* 2. Tasks / Checklist */}
        <button
          onClick={() => setIsTaskModalOpen(true)}
          className="w-full flex flex-col items-center justify-center gap-0.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition cursor-pointer h-12 overflow-hidden px-1 relative"
        >
          <div className="relative shrink-0">
            <CheckSquare className="w-4 h-4" />
            {tasks.filter(t => !t.completed).length > 0 && (
              <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-[9px] font-bold rounded-full flex items-center justify-center">
                {tasks.filter(t => !t.completed).length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight truncate max-w-full text-center">
            {navLabels.tasks}
          </span>
        </button>

        {/* 3. Center Elevated Add Class Button */}
        <div className="w-full flex items-center justify-center">
          <button
            onClick={() => handleOpenNewClassModal(mobileDay)}
            className="w-12 h-12 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center shadow-lg -mt-5 active:scale-95 transition cursor-pointer shrink-0"
            title={t.actions.newClass}
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* 4. Optimizer */}
        <button
          onClick={handleOptimizeGaps}
          className="w-full flex flex-col items-center justify-center gap-0.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition cursor-pointer h-12 overflow-hidden px-1"
          title={t.actions.autoOptimize}
        >
          <Sliders className="w-4 h-4 shrink-0" />
          <span className="text-[10px] font-medium tracking-tight truncate max-w-full text-center">
            {navLabels.optimize}
          </span>
        </button>

        {/* 5. Export */}
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="w-full flex flex-col items-center justify-center gap-0.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition cursor-pointer h-12 overflow-hidden px-1"
        >
          <Download className="w-4 h-4 shrink-0" />
          <span className="text-[10px] font-medium tracking-tight truncate max-w-full text-center">
            {navLabels.export}
          </span>
        </button>

      </nav>

      {/* Studio Mobile Menu Drawer (< 768px: Slide-Over) */}
      {isStudioMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 md:hidden">
          <div className="w-4/5 max-w-sm h-full bg-white dark:bg-[#121215] border-l border-zinc-200 dark:border-zinc-800 p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200 overflow-y-auto">
            
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <img src="/logo.svg" alt="Class Schedule Logo" className="w-8 h-8 rounded-xl object-contain" />
                  <div>
                    <h2 className="text-sm font-bold text-zinc-950 dark:text-white">Studio Settings</h2>
                    <p className="text-[11px] text-zinc-500">Preferences & Academic Tools</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsStudioMenuOpen(false)}
                  className="w-8 h-8 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Metrics Summary Card */}
              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">Timetable Stats</span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-white dark:bg-zinc-850 border border-zinc-200/60 dark:border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">{t.metrics.credits}</span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">{metrics.totalCredits}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-zinc-850 border border-zinc-200/60 dark:border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">Idle Gaps</span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">{metrics.gapHours}h</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-zinc-850 border border-zinc-200/60 dark:border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">Conflicts</span>
                    <span className={`text-sm font-bold ${metrics.conflicts > 0 ? 'text-rose-600' : 'text-zinc-900 dark:text-white'}`}>
                      {metrics.conflicts}
                    </span>
                  </div>
                </div>
              </div>

              {/* Day Range Toggle: 5 Days vs 7 Days */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                  Calendar Span
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIncludeWeekend(false)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      !includeWeekend
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-2xs'
                        : 'bg-zinc-50 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    5 Days (Mon-Fri)
                  </button>
                  <button
                    onClick={() => setIncludeWeekend(true)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      includeWeekend
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-2xs'
                        : 'bg-zinc-50 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    7 Days (Full Week)
                  </button>
                </div>
              </div>

              {/* Theme Selector */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                  Visual Appearance
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { if (isDarkTheme) toggleTheme(); }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition ${
                      !isDarkTheme
                        ? 'bg-zinc-950 text-white border-zinc-950 shadow-2xs'
                        : 'bg-zinc-50 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Light Mode</span>
                  </button>
                  <button
                    onClick={() => { if (!isDarkTheme) toggleTheme(); }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition ${
                      isDarkTheme
                        ? 'bg-white text-zinc-950 border-white shadow-2xs'
                        : 'bg-zinc-50 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Dark Mode</span>
                  </button>
                </div>
              </div>

              {/* Language Selector */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Language / Idioma</span>
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {Object.values(LOCALES).map(loc => (
                    <button
                      key={loc.code}
                      onClick={() => {
                        changeLocale(loc.code);
                        setIsStudioMenuOpen(false);
                      }}
                      className={`p-2 rounded-xl text-xs font-medium border flex items-center gap-2 transition text-left ${
                        locale === loc.code
                          ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-white dark:text-zinc-950 dark:border-white font-bold'
                          : 'bg-zinc-50 dark:bg-zinc-850 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
                      }`}
                    >
                      <span>{loc.flag}</span>
                      <span className="truncate">{loc.nativeName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions List */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => {
                    setIsStudioMenuOpen(false);
                    setIsFeedbackModalOpen(true);
                  }}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2.5 transition"
                >
                  <MessageSquare className="w-4 h-4 text-zinc-400" />
                  <span>{t.feedback.title}</span>
                </button>

                <button
                  onClick={() => {
                    setIsStudioMenuOpen(false);
                    handleResetSchedule();
                  }}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-xs font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-2.5 transition"
                >
                  <RotateCcw className="w-4 h-4 text-zinc-400" />
                  <span>Reset Sample Schedule</span>
                </button>
              </div>

            </div>

            {/* Drawer Footer Link to Home */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <a
                href="/"
                className="w-full py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Landing Page</span>
              </a>
            </div>

          </div>
        </div>
      )}

      {/* 2. Clean Event Creation / Edit Modal (Mobile Bottom-Sheet / Desktop Centered) */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] sm:max-h-[85vh] overflow-y-auto p-5 sm:p-7 space-y-4 animate-in slide-in-from-bottom sm:zoom-in-95 duration-150">
            {/* Mobile Sheet Drag Handle */}
            <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto -mt-1 mb-2 sm:hidden shrink-0" />
            
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
                  setFormCode('');
                  setFormTitle('');
                  setFormRoom('');
                  setFormError(null);
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
                    {t.form.credits}
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

              {/* Class Days Multi-Selector Pills (P7: Mon-Sun 7 days selectable) */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center justify-between">
                  <span>{t.form.classDays} <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] text-zinc-500 font-normal">Mon–Sun selectable</span>
                </label>
                <div className="grid grid-cols-7 gap-1.5">
                  {FULL_WEEK_DAYS.map(d => {
                    const isSelected = formDays.some(fd => normalizeDayOfWeek(fd) === d);
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

              {/* Start & End Times + Room (S1: Native <input type="time" step="900"> per platform standard) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-start">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    {t.form.startTime}
                  </label>
                  <input
                    type="time"
                    step="900"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    required
                    className="w-full h-10 px-3 text-xs font-mono font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-850 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition scheme-light dark:scheme-dark"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    {t.form.endTime}
                  </label>
                  <input
                    type="time"
                    step="900"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    required
                    className="w-full h-10 px-3 text-xs font-mono font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-850 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition scheme-light dark:scheme-dark"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    {t.form.room || 'Room / Location'}
                  </label>
                  <input
                    type="text"
                    value={formRoom}
                    onChange={e => setFormRoom(e.target.value)}
                    placeholder={t.form.roomPlaceholder || 'e.g. Hall 101'}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-850 text-zinc-900 dark:text-white placeholder:text-zinc-400"
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
                    {t.form.duplicateToOtherDays || 'Duplicate to other days'}
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {FULL_WEEK_DAYS.filter(d => !formDays.some(fd => normalizeDayOfWeek(fd) === d)).map(d => (
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

              {/* Action Buttons (Sticky at bottom on mobile) */}
              <div className="sticky bottom-0 bg-white dark:bg-[#121215] pt-3 pb-1 border-t border-zinc-100 dark:border-zinc-800 -mx-5 sm:-mx-6 px-5 sm:px-6 z-10 flex items-center justify-between gap-3">
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

      {/* 3. Tasks & Todo Modal (Mobile Bottom-Sheet / Desktop Centered) */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4 animate-in slide-in-from-bottom sm:zoom-in-95 duration-150">
            {/* Mobile Sheet Drag Handle */}
            <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto -mt-1 mb-2 sm:hidden shrink-0" />
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
                    className="p-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between gap-3 text-xs cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-850 group transition"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {task.completed ? (
                        <CheckSquare className="w-4 h-4 text-zinc-900 dark:text-white shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-zinc-400 shrink-0" />
                      )}
                      <span className={`truncate ${task.completed ? 'line-through text-zinc-400' : 'font-medium text-zinc-800 dark:text-zinc-200'}`}>
                        {task.title}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => deleteTask(task.id, e)}
                      className="p-1 rounded-md text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition shrink-0 cursor-pointer"
                      title="Delete task"
                      aria-label="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Export Hub Modal (PNG / PDF / .ICS - Mobile Bottom-Sheet / Desktop Centered) */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4 animate-in slide-in-from-bottom sm:zoom-in-95 duration-150">
            {/* Mobile Sheet Drag Handle */}
            <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto -mt-1 mb-2 sm:hidden shrink-0" />
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">{t.actions.exportHub}</h3>
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
                  handlePrint();
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

              <div className="border-t border-zinc-200 dark:border-zinc-800 my-2 pt-2" />

              <button
                onClick={() => {
                  setIsExportModalOpen(false);
                  handleShareSchedule();
                }}
                className="w-full p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between transition cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                    <Share2 className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-zinc-900 dark:text-white block">Shareable Web Link &amp; Embed</span>
                    <span className="text-[11px] text-zinc-500">Generate URL or responsive iframe embed</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share & Embed Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4 animate-in slide-in-from-bottom sm:zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                  <span>Share Schedule &amp; Embed Widget</span>
                </h3>
                <p className="text-xs text-zinc-500">100% Client-Side. No registration, no server database required.</p>
              </div>
              <button onClick={() => setIsShareModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Share Link Section */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
                Direct Shareable Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/app#plan=${encodeScheduleToShareString(courses)}`}
                  className="flex-1 h-10 px-3 text-xs font-mono rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-850 text-zinc-700 dark:text-zinc-300 select-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    const url = shareUrl || `${window.location.origin}/app#plan=${encodeScheduleToShareString(courses)}`;
                    navigator.clipboard.writeText(url);
                    setBanner('Share link copied to clipboard!');
                    setTimeout(() => setBanner(null), 3000);
                  }}
                  className="h-10 px-4 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-bold hover:bg-black dark:hover:bg-zinc-100 transition cursor-pointer shrink-0"
                >
                  Copy Link
                </button>
              </div>
              <p className="text-[11px] text-zinc-500">
                Opening this link on a classmate's phone or computer loads your exact schedule with one click and saves it locally.
              </p>
            </div>

            {/* Embed Widget Section */}
            <div className="space-y-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block flex items-center justify-between">
                <span>Website / Blog Embed Code (iFrame)</span>
                <span className="text-[10px] font-mono text-zinc-400">Responsive &bull; Noindex</span>
              </label>
              <textarea
                readOnly
                rows={3}
                value={`<iframe src="https://freeclassschedule.com/embed#plan=${encodeScheduleToShareString(courses)}" width="100%" height="620" frameborder="0" style="border:1px solid #e4e4e7; border-radius:16px;"></iframe>\n<p style="font-size:12px;color:#71717a;text-align:center;margin-top:8px;">Powered by <a href="https://freeclassschedule.com" target="_blank" rel="noopener">FreeClassSchedule.com</a></p>`}
                className="w-full p-2.5 text-[11px] font-mono rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-850 text-zinc-700 dark:text-zinc-300 select-all resize-none"
              />
              <button
                type="button"
                onClick={() => {
                  const code = `<iframe src="https://freeclassschedule.com/embed#plan=${encodeScheduleToShareString(courses)}" width="100%" height="620" frameborder="0" style="border:1px solid #e4e4e7; border-radius:16px;"></iframe>\n<p style="font-size:12px;color:#71717a;text-align:center;margin-top:8px;">Powered by <a href="https://freeclassschedule.com" target="_blank" rel="noopener">FreeClassSchedule.com</a></p>`;
                  navigator.clipboard.writeText(code);
                  setBanner('Embed snippet copied! Paste into any HTML, Notion, or blog page.');
                  setTimeout(() => setBanner(null), 3000);
                }}
                className="h-9 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Code className="w-3.5 h-3.5" />
                <span>Copy Embed Code</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Major Presets Modal */}
      {isPresetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4 animate-in slide-in-from-bottom sm:zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                  <span>College Major Timetable Presets</span>
                </h3>
                <p className="text-xs text-zinc-500">Pre-built, conflict-free academic blueprints for top university degree paths.</p>
              </div>
              <button onClick={() => setIsPresetModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {Object.entries(MAJOR_PRESETS).map(([key, preset]) => (
                <div
                  key={key}
                  className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-zinc-950 dark:text-white">{preset.name}</h4>
                        <span className="px-2 py-0.5 rounded-md bg-zinc-200/70 dark:bg-zinc-800 text-[11px] font-mono font-bold text-zinc-700 dark:text-zinc-300">
                          {preset.credits} Credits
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">{preset.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {preset.courses.map(c => (
                      <span key={c.id} className="px-2 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
                        {c.code}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
                    <button
                      type="button"
                      onClick={() => handleRequestLoadPreset(key, activePlanId)}
                      className="h-8 px-3 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-xs font-semibold hover:bg-black dark:hover:bg-zinc-100 transition cursor-pointer"
                    >
                      Load into {plans.find(p => p.id === activePlanId)?.name || 'Current'}
                    </button>
                    {plans.filter(p => p.id !== activePlanId).map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleRequestLoadPreset(key, p.id)}
                        className="h-8 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white text-xs font-medium transition cursor-pointer"
                      >
                        Load into {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rename Plan Modal */}
      {isRenamePlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-sm p-5 sm:p-6 space-y-4 animate-in slide-in-from-bottom sm:zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-950 dark:text-white">Rename Schedule Plan</h3>
              <button onClick={() => setIsRenamePlanModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              handleRenamePlan(newPlanName);
            }} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Plan Name
                </label>
                <input
                  type="text"
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  placeholder="e.g. Plan A: Morning Classes"
                  className="w-full h-10 px-3 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-850 text-zinc-900 dark:text-white placeholder:text-zinc-400"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsRenamePlanModalOpen(false)}
                  className="h-9 px-3 text-xs font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-bold hover:bg-black dark:hover:bg-zinc-100 transition cursor-pointer"
                >
                  Save Name
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Interactive Student Feedback & Rating System Modal (Mobile Bottom-Sheet / Desktop Centered) */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 sm:p-7 space-y-5 animate-in slide-in-from-bottom sm:zoom-in-95 duration-150">
            {/* Mobile Sheet Drag Handle */}
            <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto -mt-1 mb-2 sm:hidden shrink-0" />
            
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

              {/* Student Email (Optional) */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Your Email (Optional, if you'd like a response)
                </label>
                <input
                  type="email"
                  value={feedbackEmail}
                  onChange={e => setFeedbackEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full h-10 px-3 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-850 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingFeedback}
                className="w-full h-11 bg-zinc-950 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs font-bold rounded-xl shadow-md transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmittingFeedback ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending directly to team...</span>
                  </>
                ) : (
                  <span>{t.feedback.submitBtn}</span>
                )}
              </button>

              <div className="text-center pt-1">
                <a
                  href="mailto:hello@freeclassschedule.com?subject=Student%20Schedule%20Feedback"
                  className="text-[11px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white underline inline-flex items-center gap-1.5 transition"
                >
                  <Mail className="w-3 h-3" />
                  <span>Or email engineering team directly: hello@freeclassschedule.com</span>
                </a>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Universal Confirmation Modal (P2 / P3: Replaces blocking native window.confirm) */}
      {confirmDialog && confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span>{confirmDialog.title}</span>
              </h3>
              <button
                onClick={() => setConfirmDialog(null)}
                className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {confirmDialog.description}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="h-9 px-3 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition cursor-pointer order-last sm:order-first"
              >
                Cancel
              </button>
              {confirmDialog.secondaryLabel && confirmDialog.onSecondary && (
                <button
                  type="button"
                  onClick={confirmDialog.onSecondary}
                  className="h-9 px-3.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-semibold transition cursor-pointer"
                >
                  {confirmDialog.secondaryLabel}
                </button>
              )}
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className="h-9 px-4 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-bold hover:bg-black dark:hover:bg-zinc-100 transition shadow-xs cursor-pointer"
              >
                {confirmDialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gap Optimizer Proposal Modal (P5: Honest Interactive Proposal) */}
      {optimizerProposal && optimizerProposal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-500" />
                <span>Gap Optimizer Proposal</span>
              </h3>
              <button
                onClick={() => setOptimizerProposal(null)}
                className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-850/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
              <p className="text-xs text-zinc-700 dark:text-zinc-300">
                This compaction reduces your idle on-campus wait time between classes:
              </p>
              <div className="flex items-center justify-between text-xs font-mono py-1">
                <span className="text-zinc-500">Total idle wait before:</span>
                <span className="font-bold text-rose-500">{optimizerProposal.currentGapHours} hrs</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono py-1 border-t border-zinc-200/60 dark:border-zinc-700/60">
                <span className="text-zinc-500">Total idle wait after:</span>
                <span className="font-bold text-emerald-500">{optimizerProposal.proposedGapHours} hrs</span>
              </div>
              <div className="text-[11px] text-zinc-500 pt-1">
                Saves <strong className="text-zinc-900 dark:text-white">{optimizerProposal.savedHours} hours</strong> of idle wait with zero class conflicts.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOptimizerProposal(null)}
                className="h-9 px-3.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition cursor-pointer"
              >
                Keep Mine
              </button>
              <button
                type="button"
                onClick={handleApplyOptimizerProposal}
                className="h-9 px-4 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-bold hover:bg-black dark:hover:bg-zinc-100 transition shadow-xs cursor-pointer"
              >
                Apply Optimization
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Interactive Studio Welcome & Instructions Guide Modal */}
      {isOnboardingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto p-5 sm:p-7 space-y-5 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo.svg" 
                  alt="Free Class Schedule Maker" 
                  className="w-11 h-11 rounded-2xl shadow-sm object-contain shrink-0 border border-zinc-200/50 dark:border-zinc-700/50" 
                />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white">
                    Welcome to Schedule Studio
                  </h3>
                  <p className="text-xs text-zinc-500">Quick 60-second guide to building your ideal timetable</p>
                </div>
              </div>
              <button 
                onClick={handleDismissOnboarding} 
                className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                aria-label="Close guide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Feature Walkthrough Grid */}
            <div className="space-y-3">
              <div className="p-3 sm:p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Plus className="w-4 h-4 text-zinc-900 dark:text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">1. Add Your Classes Instantly</h4>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
                    Click <strong>+ Class</strong> to input your course code (e.g. CS 101), lecture times, classroom hall, and select a color tag.
                  </p>
                </div>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">2. Automatic Conflict Lanes</h4>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
                    Overlapping courses automatically split into side-by-side lanes so you immediately spot schedule clashes without clutter.
                  </p>
                </div>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Sliders className="w-4 h-4 text-zinc-900 dark:text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">3. Eliminate Campus Dead-Time</h4>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
                    The <strong>Gap Optimizer</strong> measures idle hours between classes. Note: dragging a class moves all of its weekly meetings across the timetable.
                  </p>
                </div>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckSquare className="w-4 h-4 text-zinc-900 dark:text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">4. Homework & Task Deadlines</h4>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
                    Manage semester assignments right alongside your schedule. Mark completed or delete finished tasks with 1 click.
                  </p>
                </div>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Download className="w-4 h-4 text-zinc-900 dark:text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">5. Universal .ICS Calendar Export & PDF</h4>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
                    Export your timetable as a <strong>.ICS file</strong> to import into Google Calendar / Apple Calendar / Outlook, or generate a clean printable PDF.
                  </p>
                </div>
              </div>
            </div>

            {/* Feedback Callout */}
            <div className="p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                <MessageSquare className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span className="text-[11px]">Found a bug or need a feature? Click <strong>Feedback</strong> anytime to reach our team!</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  handleDismissOnboarding();
                  setIsFeedbackModalOpen(true);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] shrink-0 transition cursor-pointer"
              >
                Feedback
              </button>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleDismissOnboarding}
                className="w-full h-11 rounded-xl bg-zinc-950 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs font-bold transition shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Start Building My Schedule</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
