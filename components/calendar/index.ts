/**
 * Wall Calendar Component Exports
 */

export { CalendarRoot } from './CalendarRoot';
export { CalendarSpiral } from './CalendarSpiral';
export { CalendarHero } from './CalendarHero';
export { CalendarGrid } from './CalendarGrid';
export { CalendarDay } from './CalendarDay';
export { CalendarNotes } from './CalendarNotes';
export { NoteCard } from './NoteCard';
export { ThemeToggle } from './ThemeToggle';
export { ExportButton } from './ExportButton';

// Hooks
export { useCalendarStore } from './hooks/useCalendarStore';
export { useCalendarDays, useDayState, useDateSelection } from './hooks/useDateRange';
export { useNotes, useNotesForDate } from './hooks/useNotes';
export { useImageTheme } from './hooks/useImageTheme';

// Types
export type * from './types/calendar.types';

// Constants
export { INDIAN_HOLIDAYS, getHolidaysForMonth, isHoliday } from './constants/holidays';
export { MONTH_IMAGES, getMonthImage, MONTH_NAMES } from './constants/monthImages';
