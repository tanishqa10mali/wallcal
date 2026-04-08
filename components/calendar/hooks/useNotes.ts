'use client';

/**
 * useNotes
 * Hook for managing sticky notes functionality
 */

import { useCallback, useMemo } from 'react';
import { useCalendarStore } from './useCalendarStore';
import type { Note, NoteColor, DateRange } from '../types/calendar.types';

/**
 * Hook for notes management
 */
export function useNotes() {
  const {
    notes,
    selectedRange,
    addNote,
    updateNote,
    deleteNote,
    toggleNotePin,
    isNotesOpen,
    toggleNotesPanel,
  } = useCalendarStore();

  /**
   * Create a new note with the current selection
   */
  const createNote = useCallback(
    (content: string, color: NoteColor = 'yellow') => {
      const dateRange: DateRange | null =
        selectedRange.start && selectedRange.end
          ? { start: selectedRange.start, end: selectedRange.end }
          : selectedRange.start
          ? { start: selectedRange.start, end: null }
          : null;

      addNote({
        content,
        color,
        dateRange,
        isPinned: false,
      });
    },
    [addNote, selectedRange]
  );

  /**
   * Update note content
   */
  const editNoteContent = useCallback(
    (id: string, content: string) => {
      updateNote(id, { content });
    },
    [updateNote]
  );

  /**
   * Update note color
   */
  const changeNoteColor = useCallback(
    (id: string, color: NoteColor) => {
      updateNote(id, { color });
    },
    [updateNote]
  );

  /**
   * Attach selected date range to a note
   */
  const attachDateRange = useCallback(
    (id: string) => {
      if (selectedRange.start) {
        updateNote(id, {
          dateRange: {
            start: selectedRange.start,
            end: selectedRange.end,
          },
        });
      }
    },
    [updateNote, selectedRange]
  );

  /**
   * Remove date range from a note
   */
  const detachDateRange = useCallback(
    (id: string) => {
      updateNote(id, { dateRange: null });
    },
    [updateNote]
  );

  /**
   * Get sorted notes (pinned first, then by creation date)
   */
  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => {
      // Pinned notes first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // Then by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [notes]);

  return {
    notes: sortedNotes,
    isNotesOpen,
    toggleNotesPanel,
    createNote,
    editNoteContent,
    changeNoteColor,
    deleteNote,
    toggleNotePin,
    attachDateRange,
    detachDateRange,
  };
}

/**
 * Get notes for a specific date
 */
export function useNotesForDate(date: Date) {
  const { notes } = useCalendarStore();

  return useMemo(() => {
    return notes.filter((note) => {
      if (!note.dateRange?.start) return false;
      const start = new Date(note.dateRange.start);
      const end = note.dateRange.end ? new Date(note.dateRange.end) : start;

      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      return checkDate >= start && checkDate <= end;
    });
  }, [notes, date]);
}
