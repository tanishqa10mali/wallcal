'use client';

/**
 * CalendarDay
 * Individual day cell with all visual states
 */

import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useDayState } from './hooks/useDateRange';
import { useCalendarStore } from './hooks/useCalendarStore';
import { NOTE_COLORS } from './types/calendar.types';

interface CalendarDayProps {
  date: Date;
  onSelect: (date: Date) => void;
  onHover: (date: Date | null) => void;
  index: number;
  compact?: boolean;
}

export const CalendarDay = memo(function CalendarDay({
  date,
  onSelect,
  onHover,
  index,
  compact = false,
}: CalendarDayProps) {
  const dayState = useDayState(date);
  const { extractedColor } = useCalendarStore();

  const handleClick = useCallback(() => {
    onSelect(date);
  }, [date, onSelect]);

  const handleMouseEnter = useCallback(() => {
    onHover(date);
  }, [date, onHover]);

  const handleMouseLeave = useCallback(() => {
    onHover(null);
  }, [onHover]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(date);
      }
    },
    [date, onSelect]
  );

  // Build class names based on state
  const baseClasses = `
    relative flex flex-col items-center justify-center
    w-full rounded-md
    ${compact ? 'aspect-[1/0.85] text-xs sm:text-sm' : 'aspect-square text-sm sm:text-base'}
    font-medium
    transition-colors duration-150
    focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1
    cursor-pointer select-none
  `;

  // Determine background and text colors
  let bgStyle: React.CSSProperties = {};
  let textColor = dayState.isCurrentMonth
    ? 'text-foreground'
    : 'text-muted-foreground/50';

  if (dayState.isRangeStart || dayState.isRangeEnd) {
    bgStyle = {
      backgroundColor: extractedColor,
      borderRadius: dayState.isRangeStart && dayState.isRangeEnd
        ? '9999px'
        : dayState.isRangeStart
        ? '9999px 0 0 9999px'
        : '0 9999px 9999px 0',
    };
    textColor = 'text-white';
  } else if (dayState.isInRange) {
    bgStyle = {
      backgroundColor: `${extractedColor}25`,
    };
  } else if (dayState.isToday) {
    bgStyle = {
      border: `2px solid ${extractedColor}`,
    };
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.015,
        duration: 0.2,
        ease: 'easeOut',
      }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      className={`${baseClasses} ${textColor}`}
      style={bgStyle}
      aria-label={`${format(date, 'EEEE, MMMM d, yyyy')}${
        dayState.isHoliday ? `, ${dayState.holidayName}` : ''
      }${dayState.isToday ? ', Today' : ''}`}
      aria-pressed={dayState.isSelected}
      tabIndex={0}
    >
      {/* Day number */}
      <span className="relative z-10">{format(date, 'd')}</span>

      {/* Holiday indicator */}
      {dayState.isHoliday && (
        <div className="absolute top-0.5 right-0.5 group">
          <span className="text-[10px]" role="img" aria-label="Holiday">
            🏳️
          </span>
          {/* Tooltip */}
          <div
            className="
              absolute bottom-full right-0 mb-1 px-2 py-1
              bg-popover text-popover-foreground text-xs rounded shadow-lg
              opacity-0 group-hover:opacity-100 transition-opacity
              pointer-events-none whitespace-nowrap z-50
              border border-border
            "
          >
            {dayState.holidayName}
          </div>
        </div>
      )}

      {/* Note indicators */}
      {dayState.hasNotes && dayState.noteColors.length > 0 && (
        <div className="absolute bottom-0.5 flex gap-0.5">
          {dayState.noteColors.slice(0, 3).map((color, i) => (
            <div
              key={`${color}-${i}`}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: NOTE_COLORS[color] }}
            />
          ))}
        </div>
      )}

      {/* Hover preview for range selection */}
      {dayState.isHovered && !dayState.isSelected && (
        <motion.div
          layoutId="hover-indicator"
          className="absolute inset-1 rounded-lg border-2 border-dashed pointer-events-none"
          style={{ borderColor: extractedColor }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
        />
      )}
    </motion.button>
  );
});

CalendarDay.displayName = 'CalendarDay';
