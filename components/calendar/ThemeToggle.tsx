'use client';

/**
 * ThemeToggle
 * 3-way theme switch with smooth transitions
 */

import { useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Scroll } from 'lucide-react';
import { useCalendarStore } from './hooks/useCalendarStore';
import type { Theme } from './types/calendar.types';

const themes: { id: Theme; icon: typeof Sun; label: string }[] = [
  { id: 'light', icon: Sun, label: 'Light theme' },
  { id: 'dark', icon: Moon, label: 'Dark theme' },
  { id: 'sepia', icon: Scroll, label: 'Sepia theme' },
];

export function ThemeToggle() {
  const { theme, setTheme, extractedColor } = useCalendarStore();

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;

    // Remove all theme classes
    root.classList.remove('dark', 'sepia');

    // Add current theme class
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'sepia') {
      root.classList.add('sepia');
    }
  }, [theme]);

  const cycleTheme = useCallback(() => {
    const currentIndex = themes.findIndex((t) => t.id === theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex].id);
  }, [theme, setTheme]);

  const currentTheme = themes.find((t) => t.id === theme) || themes[0];
  const Icon = currentTheme.icon;

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={cycleTheme}
      className="
        p-3 rounded-full
        bg-card shadow-lg border border-border
        transition-colors duration-300
        hover:bg-accent
        focus:outline-none focus:ring-2 focus:ring-ring
      "
      aria-label={`Current: ${currentTheme.label}. Click to change theme.`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Icon
          className="w-5 h-5"
          style={{ color: extractedColor }}
        />
      </motion.div>
    </motion.button>
  );
}
