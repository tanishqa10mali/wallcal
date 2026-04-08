'use client';

/**
 * useDateRange
 * Hook for managing date range selection logic and visual states
 */

import { useMemo, useCallback } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isWithinInterval,
  isSameMonth,
  isToday as isTodayFn,
} from 'date-fns';
import { useCalendarStore } from './useCalendarStore';
import { isHoliday } from '../constants/holidays';
import type { DayState, NoteColor } from '../types/calendar.types';

/**
 * Generate all days to display in the calendar grid (including overflow days)
 */
export function useCalendarDays(currentDate: Date) {
  return useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    // Week starts on Monday (weekStartsOn: 1)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);
}

/**
 * Get the visual state for a specific day cell
 */
export function useDayState(date: Date): DayState {
  const {
    currentDate,
    selectedRange,
    selectionState,
    hoveredDate,
    notes,
  } = useCalendarStore();

  return useMemo(() => {
    const { start, end } = selectedRange;
    const holiday = isHoliday(date);

    // Check if date is in the selected range
    let isInRange = false;
    let isRangeStart = false;
    let isRangeEnd = false;
    let isSelected = false;

    if (start && !end) {
      // Only start selected
      isRangeStart = isSameDay(date, start);
      isSelected = isRangeStart;

      // Show preview range on hover
      if (hoveredDate && selectionState === 'selecting-end') {
        const previewStart = start <= hoveredDate ? start : hoveredDate;
        const previewEnd = start <= hoveredDate ? hoveredDate : start;

        if (
          !isSameDay(date, previewStart) &&
          !isSameDay(date, previewEnd) &&
          isWithinInterval(date, { start: previewStart, end: previewEnd })
        ) {
          isInRange = true;
        }
        isRangeEnd = isSameDay(date, hoveredDate);
      }
    } else if (start && end) {
      // Full range selected
      isRangeStart = isSameDay(date, start);
      isRangeEnd = isSameDay(date, end);
      isSelected = isRangeStart || isRangeEnd;
      isInRange =
        !isRangeStart &&
        !isRangeEnd &&
        isWithinInterval(date, { start, end });
    }

    // Check for notes on this date
    const notesOnDate = notes.filter((note) => {
      if (!note.dateRange?.start) return false;
      if (!note.dateRange.end) {
        return isSameDay(date, note.dateRange.start);
      }
      return isWithinInterval(date, {
        start: note.dateRange.start,
        end: note.dateRange.end,
      });
    });

    const noteColors: NoteColor[] = [...new Set(notesOnDate.map((n) => n.color))];

    return {
      isToday: isTodayFn(date),
      isCurrentMonth: isSameMonth(date, currentDate),
      isSelected,
      isRangeStart,
      isRangeEnd,
      isInRange,
      isHovered: hoveredDate ? isSameDay(date, hoveredDate) : false,
      isHoliday: !!holiday,
      holidayName: holiday?.name,
      hasNotes: notesOnDate.length > 0,
      noteColors,
    };
  }, [currentDate, selectedRange, selectionState, hoveredDate, notes, date]);
}

/**
 * Hook for date selection handlers
 */
export function useDateSelection() {
  const { selectDate, setHoveredDate, clearSelection } = useCalendarStore();

  const handleDateClick = useCallback(
    (date: Date) => {
      selectDate(date);
    },
    [selectDate]
  );

  const handleDateHover = useCallback(
    (date: Date | null) => {
      setHoveredDate(date);
    },
    [setHoveredDate]
  );

  const handleClearSelection = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  return {
    handleDateClick,
    handleDateHover,
    handleClearSelection,
  };
}
