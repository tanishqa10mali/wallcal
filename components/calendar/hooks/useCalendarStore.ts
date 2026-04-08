'use client';

/**
 * useCalendarStore
 * Zustand store for global calendar state management
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addMonths, subMonths } from 'date-fns';
import type {
  CalendarStore,
  Note,
  CalendarEvent,
  Theme,
  DateRange,
  SelectionState,
} from '../types/calendar.types';

/** Default primary color (extracted from hero image) */
const DEFAULT_PRIMARY_COLOR = '#3b82f6';

/** Initial state values */
const initialState = {
  currentDate: new Date(),
  selectedRange: { start: null, end: null } as DateRange,
  selectionState: 'idle' as SelectionState,
  hoveredDate: null,
  notes: [] as Note[],
  events: [] as CalendarEvent[],
  theme: 'light' as Theme,
  extractedColor: DEFAULT_PRIMARY_COLOR,
  isNotesOpen: false,
};

/**
 * Main calendar store with persistence
 */
export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentDate: (date: Date) => set({ currentDate: date }),

      nextMonth: () =>
        set((state) => ({
          currentDate: addMonths(state.currentDate, 1),
        })),

      prevMonth: () =>
        set((state) => ({
          currentDate: subMonths(state.currentDate, 1),
        })),

      selectDate: (date: Date) => {
        const { selectionState, selectedRange } = get();

        switch (selectionState) {
          case 'idle':
          case 'complete':
            // Start new selection
            set({
              selectedRange: { start: date, end: null },
              selectionState: 'selecting-end',
            });
            break;

          case 'selecting-end':
            // Complete selection
            if (selectedRange.start) {
              const start = selectedRange.start;
              const end = date;
              // Ensure start is before end
              if (start <= end) {
                set({
                  selectedRange: { start, end },
                  selectionState: 'complete',
                });
              } else {
                set({
                  selectedRange: { start: end, end: start },
                  selectionState: 'complete',
                });
              }
            }
            break;

          default:
            break;
        }
      },

      setHoveredDate: (date: Date | null) => set({ hoveredDate: date }),

      clearSelection: () =>
        set({
          selectedRange: { start: null, end: null },
          selectionState: 'idle',
          hoveredDate: null,
        }),

      addNote: (noteData) => {
        const newNote: Note = {
          ...noteData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        };
        set((state) => ({
          notes: [...state.notes, newNote],
        }));
      },

      updateNote: (id: string, updates: Partial<Note>) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, ...updates } : note
          ),
        })),

      deleteNote: (id: string) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        })),

      toggleNotePin: (id: string) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, isPinned: !note.isPinned } : note
          ),
        })),

      addEvent: (eventData) => {
        const newEvent: CalendarEvent = {
          ...eventData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        };
        set((state) => ({
          events: [...state.events, newEvent],
        }));
      },

      updateEvent: (id: string, updates: Partial<CalendarEvent>) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, ...updates } : event
          ),
        })),

      deleteEvent: (id: string) =>
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        })),

      setTheme: (theme: Theme) => set({ theme }),

      setExtractedColor: (color: string) => set({ extractedColor: color }),

      toggleNotesPanel: () =>
        set((state) => ({ isNotesOpen: !state.isNotesOpen })),
    }),
    {
      name: 'wall-calendar-storage',
      partialize: (state) => ({
        notes: state.notes,
        events: state.events,
        theme: state.theme,
      }),
    }
  )
);
