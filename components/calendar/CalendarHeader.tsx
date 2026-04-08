'use client';

/**
 * CalendarHeader
 * Month/Year display with navigation arrows and mini month preview
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { useCalendarStore } from './hooks/useCalendarStore';
import { MONTH_NAMES } from './constants/monthImages';

interface MiniMonthPreviewProps {
  date: Date;
  position: 'left' | 'right';
}

function MiniMonthPreview({ date, position }: MiniMonthPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5, x: position === 'left' ? 10 : -10 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: 5 }}
      className={`
        absolute top-full mt-2 z-50 px-3 py-2 rounded-lg
        bg-popover text-popover-foreground shadow-lg border border-border
        text-sm font-medium whitespace-nowrap
        ${position === 'left' ? 'left-0' : 'right-0'}
      `}
    >
      {format(date, 'MMMM yyyy')}
    </motion.div>
  );
}

interface CalendarHeaderProps {
  onNavigate: (direction: 'prev' | 'next') => void;
}

export function CalendarHeader({ onNavigate }: CalendarHeaderProps) {
  const { currentDate, extractedColor, clearSelection, selectionState } =
    useCalendarStore();
  const [hoveredArrow, setHoveredArrow] = useState<'prev' | 'next' | null>(null);

  const prevMonth = subMonths(currentDate, 1);
  const nextMonth = addMonths(currentDate, 1);

  return (
    <div className="px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex items-center justify-between">
        {/* Previous month button */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('prev')}
            onMouseEnter={() => setHoveredArrow('prev')}
            onMouseLeave={() => setHoveredArrow(null)}
            className="p-2 rounded-full transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
            style={{ color: extractedColor }}
            aria-label={`Go to ${MONTH_NAMES[prevMonth.getMonth()]} ${prevMonth.getFullYear()}`}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          <AnimatePresence>
            {hoveredArrow === 'prev' && (
              <MiniMonthPreview date={prevMonth} position="left" />
            )}
          </AnimatePresence>
        </div>

        {/* Month and Year */}
        <div className="text-center">
          <motion.h2
            key={currentDate.toString()}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
          >
            {format(currentDate, 'MMMM')}
          </motion.h2>
          <motion.p
            key={currentDate.getFullYear()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm sm:text-base text-muted-foreground font-medium"
          >
            {format(currentDate, 'yyyy')}
          </motion.p>
        </div>

        {/* Next month button */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('next')}
            onMouseEnter={() => setHoveredArrow('next')}
            onMouseLeave={() => setHoveredArrow(null)}
            className="p-2 rounded-full transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
            style={{ color: extractedColor }}
            aria-label={`Go to ${MONTH_NAMES[nextMonth.getMonth()]} ${nextMonth.getFullYear()}`}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>

          <AnimatePresence>
            {hoveredArrow === 'next' && (
              <MiniMonthPreview date={nextMonth} position="right" />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Clear selection button */}
      <AnimatePresence>
        {selectionState !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex justify-center mt-2"
          >
            <button
              onClick={clearSelection}
              className="text-xs px-3 py-1 rounded-full transition-colors"
              style={{
                backgroundColor: `${extractedColor}20`,
                color: extractedColor,
              }}
            >
              Clear Selection
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
