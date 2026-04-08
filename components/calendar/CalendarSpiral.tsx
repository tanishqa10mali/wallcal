'use client';

/**
 * CalendarSpiral
 * Realistic spiral binding at the top of the wall calendar
 */

import { motion } from 'framer-motion';
import { SPIRAL_COIL_COUNT } from './types/calendar.types';

const COIL_SIZE = 20;
const COIL_SPACING = 6;

export function CalendarSpiral() {
  return (
    <div className="relative flex justify-center items-end h-6 -mb-2 z-10">
      {/* Shadow bar behind coils */}
      <div 
        className="absolute bottom-0 left-[5%] right-[5%] h-3 rounded-full"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 100%)',
        }}
      />
      
      {/* Spiral coils */}
      <div className="flex gap-1" style={{ gap: COIL_SPACING }}>
        {Array.from({ length: SPIRAL_COIL_COUNT }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{
              delay: index * 0.03,
              duration: 0.4,
              ease: 'easeOut',
            }}
            className="relative"
            style={{
              width: COIL_SIZE,
              height: COIL_SIZE,
            }}
          >
            {/* Coil ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `
                  linear-gradient(135deg, 
                    #d1d5db 0%, 
                    #f3f4f6 25%, 
                    #9ca3af 50%, 
                    #d1d5db 75%, 
                    #e5e7eb 100%
                  )
                `,
                boxShadow: `
                  inset 0 1px 2px rgba(255,255,255,0.8),
                  inset 0 -1px 2px rgba(0,0,0,0.2),
                  0 2px 4px rgba(0,0,0,0.15)
                `,
              }}
            />
            
            {/* Inner hole */}
            <div
              className="absolute rounded-full"
              style={{
                top: 5,
                left: 5,
                right: 5,
                bottom: 5,
                background: 'linear-gradient(to bottom, #fafaf9 0%, #f5f5f4 100%)',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
              }}
            />
            
            {/* Highlight reflection */}
            <div
              className="absolute rounded-full opacity-60"
              style={{
                top: 3,
                left: 5,
                width: 6,
                height: 4,
                background: 'linear-gradient(to bottom, white 0%, transparent 100%)',
                borderRadius: '50%',
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
