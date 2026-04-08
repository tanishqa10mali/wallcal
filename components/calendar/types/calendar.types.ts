/**
 * Calendar Types
 * Type definitions for the wall calendar component system
 */

/** Selection state machine states */
export type SelectionState = 'idle' | 'selecting-start' | 'selecting-end' | 'complete';

/** Date range selection */
export interface DateRange {
  start: Date | null;
  end: Date | null;
}

/** Note color options */
export type NoteColor = 'yellow' | 'blue' | 'green' | 'pink' | 'white';

/** Event type for birthdays and reminders */
export type EventType = 'birthday' | 'reminder';

/** Calendar event (birthday or reminder) */
export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: EventType;
  recurring: boolean; // yearly for birthdays
  createdAt: Date;
}

/** Sticky note data structure */
export interface Note {
  id: string;
  content: string;
  color: NoteColor;
  dateRange: DateRange | null;
  isPinned: boolean;
  createdAt: Date;
}

/** Theme options */
export type Theme = 'light' | 'dark' | 'sepia';

/** Holiday definition */
export interface Holiday {
  date: Date;
  name: string;
  type: 'national' | 'religious' | 'regional';
}

/** Month image configuration */
export interface MonthImage {
  url: string;
  alt: string;
  photographer: string;
}

/** Day cell visual state */
export interface DayState {
  isToday: boolean;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
  isHovered: boolean;
  isHoliday: boolean;
  holidayName?: string;
  hasNotes: boolean;
  noteColors: NoteColor[];
  hasBirthday: boolean;
  hasReminder: boolean;
  events: CalendarEvent[];
}

/** Calendar store state */
export interface CalendarState {
  currentDate: Date;
  selectedRange: DateRange;
  selectionState: SelectionState;
  hoveredDate: Date | null;
  notes: Note[];
  events: CalendarEvent[];
  theme: Theme;
  extractedColor: string;
  isNotesOpen: boolean;
}

/** Calendar store actions */
export interface CalendarActions {
  setCurrentDate: (date: Date) => void;
  nextMonth: () => void;
  prevMonth: () => void;
  selectDate: (date: Date) => void;
  setHoveredDate: (date: Date | null) => void;
  clearSelection: () => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  toggleNotePin: (id: string) => void;
  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  setTheme: (theme: Theme) => void;
  setExtractedColor: (color: string) => void;
  toggleNotesPanel: () => void;
}

/** Combined store type */
export type CalendarStore = CalendarState & CalendarActions;

/** Week day names */
export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

/** Note color hex values */
export const NOTE_COLORS: Record<NoteColor, string> = {
  yellow: '#fef08a',
  blue: '#bfdbfe',
  green: '#bbf7d0',
  pink: '#fbcfe8',
  white: '#ffffff',
} as const;

/** Theme CSS variable values */
export const THEME_VALUES: Record<Theme, {
  background: string;
  paper: string;
  text: string;
  muted: string;
}> = {
  light: {
    background: '#f5f5f4',
    paper: '#fafaf9',
    text: '#1c1917',
    muted: '#78716c',
  },
  dark: {
    background: '#1c1917',
    paper: '#292524',
    text: '#fafaf9',
    muted: '#a8a29e',
  },
  sepia: {
    background: '#f5f0e6',
    paper: '#faf8f3',
    text: '#44403c',
    muted: '#78716c',
  },
} as const;

/** Animation duration constants */
export const ANIMATION_DURATION = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  pageFlip: 0.6,
} as const;

/** Spiral coil count */
export const SPIRAL_COIL_COUNT = 14;
