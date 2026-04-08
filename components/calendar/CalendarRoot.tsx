'use client';

/**
 * CalendarRoot
 * Main wall calendar - matches physical wall calendar layout
 * Hero on top, Notes left + Grid right below, all in viewport
 */

import { useRef, useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { format } from 'date-fns';
import { CalendarSpiral } from './CalendarSpiral';
import { CalendarHero } from './CalendarHero';
import { CalendarGrid } from './CalendarGrid';
import { CalendarNotes } from './CalendarNotes';
import { ThemeToggle } from './ThemeToggle';
import { ExportButton } from './ExportButton';
import { useCalendarStore } from './hooks/useCalendarStore';
import { THEME_VALUES } from './types/calendar.types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function CalendarRoot() {
  const calendarRef = useRef<HTMLDivElement>(null);
  const { currentDate, nextMonth, prevMonth, clearSelection, theme, extractedColor, selectionState } =
    useCalendarStore();
  const [direction, setDirection] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  // Navigation handler with direction tracking
  const handleNavigate = useCallback(
    (dir: 'prev' | 'next') => {
      setDirection(dir === 'next' ? 1 : -1);
      if (dir === 'next') {
        nextMonth();
      } else {
        prevMonth();
      }
    },
    [nextMonth, prevMonth]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handleNavigate('prev');
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNavigate('next');
          break;
        case 'Escape':
          e.preventDefault();
          clearSelection();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNavigate, clearSelection]);

  // Touch swipe support
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        handleNavigate('next');
      } else {
        handleNavigate('prev');
      }
    }
  }, [handleNavigate]);

  const themeStyles = THEME_VALUES[theme];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-2 sm:p-4 lg:p-6 transition-colors duration-500"
      style={{ backgroundColor: themeStyles.background }}
    >
      {/* Theme toggle - fixed position */}
      <div className="fixed top-3 right-3 z-50">
        <ThemeToggle />
      </div>

      {/* Calendar card - sized to fit viewport */}
      <motion.div
        ref={calendarRef}
        className="w-full max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
      >
        {/* Spiral binding */}
        <CalendarSpiral />

        {/* Calendar paper card */}
        <div
          className="relative rounded-b-xl overflow-hidden"
          style={{
            backgroundColor: themeStyles.paper,
            boxShadow: `
              0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -2px rgba(0, 0, 0, 0.1),
              0 25px 50px -12px rgba(0, 0, 0, 0.25)
            `,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Paper texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Hero image with month/year overlay */}
          <CalendarHero month={currentDate.getMonth()} />

          {/* Bottom section: Notes (left) + Grid (right) */}
          <div className="flex flex-col lg:flex-row">
            {/* Left: Notes section */}
            <div className="lg:w-[30%] p-3 lg:p-4 border-b lg:border-b-0 lg:border-r border-border/30">
              <CalendarNotes variant="inline" />
            </div>

            {/* Right: Calendar grid with header */}
            <div className="lg:w-[70%] flex flex-col">
              {/* Compact header with nav */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-border/30">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigate('prev')}
                  className="p-1.5 rounded-full transition-colors hover:bg-accent"
                  style={{ color: extractedColor }}
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>

                <div className="text-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {format(currentDate, 'yyyy')}
                  </span>
                  {selectionState !== 'idle' && (
                    <button
                      onClick={clearSelection}
                      className="ml-2 text-xs px-2 py-0.5 rounded-full transition-colors"
                      style={{
                        backgroundColor: `${extractedColor}20`,
                        color: extractedColor,
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigate('next')}
                  className="p-1.5 rounded-full transition-colors hover:bg-accent"
                  style={{ color: extractedColor }}
                  aria-label="Next month"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Grid */}
              <CalendarGrid direction={direction} compact />

              {/* Export button */}
              <div className="px-3 pb-2 flex justify-end">
                <ExportButton targetRef={calendarRef} />
              </div>
            </div>
          </div>

          {/* Page curl effect */}
          <div
            className="absolute bottom-0 right-0 w-6 h-6 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.05) 50%)`,
            }}
          />
        </div>

        {/* Keyboard hints */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-2 text-center text-[10px] hidden sm:block"
          style={{ color: themeStyles.muted }}
        >
          <span className="px-1.5 py-0.5 rounded bg-muted/50 mr-1">←</span>
          <span className="px-1.5 py-0.5 rounded bg-muted/50 mr-2">→</span>
          Navigate
          <span className="mx-2">|</span>
          <span className="px-1.5 py-0.5 rounded bg-muted/50 mr-1">Esc</span>
          Clear
        </motion.div>
      </motion.div>

      {/* Mobile notes panel (hidden on desktop) */}
      <div className="lg:hidden">
        <CalendarNotes variant="mobile" />
      </div>
    </div>
  );
}
