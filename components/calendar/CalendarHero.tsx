'use client';

/**
 * CalendarHero
 * Hero image with diagonal wave and month/year overlay (like reference image)
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { format } from 'date-fns';
import { getMonthImage } from './constants/monthImages';
import { useImageTheme } from './hooks/useImageTheme';
import { useCalendarStore } from './hooks/useCalendarStore';

interface CalendarHeroProps {
  month: number;
}

export function CalendarHero({ month }: CalendarHeroProps) {
  const monthImage = getMonthImage(month);
  const [isLoaded, setIsLoaded] = useState(false);
  const { extractedColor, currentDate } = useCalendarStore();

  useImageTheme(monthImage.url);

  return (
    <div className="relative w-full aspect-[5/3] sm:aspect-[2/1] lg:aspect-[5/2] overflow-hidden">
      {/* Background placeholder */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundColor: extractedColor,
          opacity: isLoaded ? 0.3 : 1,
        }}
      />

      {/* Hero image */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: isLoaded ? 1 : 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <Image
          src={monthImage.url}
          alt={monthImage.alt}
          fill
          className="object-cover"
          crossOrigin="anonymous"
          onLoad={() => setIsLoaded(true)}
          priority
          sizes="(max-width: 768px) 100vw, 896px"
        />
      </motion.div>

      {/* Diagonal wave overlay with month/year - matching reference */}
      <svg
        className="absolute bottom-0 right-0 w-full h-24 sm:h-28 lg:h-32"
        viewBox="0 0 400 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: extractedColor, stopOpacity: 0.95 }} />
            <stop offset="100%" style={{ stopColor: extractedColor, stopOpacity: 0.85 }} />
          </linearGradient>
        </defs>
        {/* Diagonal wave shape like reference */}
        <path
          d="M0,60 Q50,40 100,50 T200,45 T300,50 L400,40 L400,100 L0,100 Z"
          fill="url(#waveGradient)"
        />
      </svg>

      {/* Month and Year text on wave */}
      <div className="absolute bottom-3 sm:bottom-4 right-4 sm:right-6 text-right z-10">
        <motion.div
          key={currentDate.getFullYear()}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white/90 text-sm sm:text-base font-medium tracking-wider"
        >
          {format(currentDate, 'yyyy')}
        </motion.div>
        <motion.div
          key={currentDate.toString()}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-white text-xl sm:text-2xl lg:text-3xl font-bold tracking-wide uppercase"
        >
          {format(currentDate, 'MMMM')}
        </motion.div>
      </div>

      {/* Photo credit */}
      <div className="absolute top-2 right-3 text-[10px] text-white/60 drop-shadow-md">
        Photo by {monthImage.photographer}
      </div>
    </div>
  );
}
