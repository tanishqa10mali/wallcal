'use client';

/**
 * CalendarGrid
 * 7-column date grid with weekday headers
 * Compact mode for fitting in viewport
 */

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalendarStore } from './hooks/useCalendarStore';
import { useCalendarDays, useDateSelection } from './hooks/useDateRange';
import { CalendarDay } from './CalendarDay';
import { WEEKDAYS } from './types/calendar.types';

interface CalendarGridProps {
  direction: number;
  compact?: boolean;
}

export function CalendarGrid({ direction, compact = false }: CalendarGridProps) {
  const { currentDate, extractedColor } = useCalendarStore();
  const days = useCalendarDays(currentDate);
  const { handleDateClick, handleDateHover } = useDateSelection();

  const gridKey = useMemo(
    () => `${currentDate.getMonth()}-${currentDate.getFullYear()}`,
    [currentDate]
  );

  const variants = {
    enter: (dir: number) => ({
      rotateY: dir > 0 ? 90 : -90,
      opacity: 0,
      transformOrigin: dir > 0 ? 'left center' : 'right center',
    }),
    center: {
      rotateY: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      rotateY: dir > 0 ? -90 : 90,
      opacity: 0,
      transformOrigin: dir > 0 ? 'right center' : 'left center',
    }),
  };

  // Weekend indicator colors
  const isWeekend = (day: string) => day === 'Sat' || day === 'Sun';

  return (
    <div 
      className={compact ? 'px-2 py-2' : 'px-2 sm:px-4 pb-4'} 
      style={{ perspective: '1200px' }}
    >
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className={`
              text-center text-[10px] sm:text-xs font-semibold py-1
              ${isWeekend(day) ? 'text-red-500' : ''}
            `}
            style={{ color: isWeekend(day) ? '#ef4444' : extractedColor }}
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.slice(0, 1)}</span>
          </div>
        ))}
      </div>

      {/* Day grid */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={gridKey}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            duration: 0.4,
          }}
          className="grid grid-cols-7 gap-0.5"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {days.map((date, index) => (
            <CalendarDay
              key={date.toISOString()}
              date={date}
              index={index}
              onSelect={handleDateClick}
              onHover={handleDateHover}
              compact={compact}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
