'use client';

/**
 * ExportButton
 * Export current month view as high-res PNG using html2canvas
 */

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';
import { useCalendarStore } from './hooks/useCalendarStore';

interface ExportButtonProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
}

export function ExportButton({ targetRef }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { currentDate, extractedColor } = useCalendarStore();

  const handleExport = useCallback(async () => {
    if (!targetRef.current || isExporting) return;

    setIsExporting(true);

    try {
      const canvas = await html2canvas(targetRef.current, {
        scale: 2, // Retina quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `calendar-${format(currentDate, 'MMMM-yyyy').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  }, [targetRef, currentDate, isExporting]);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleExport}
      disabled={isExporting}
      className="
        flex items-center gap-2
        px-4 py-2 rounded-lg
        text-white font-medium text-sm
        transition-opacity
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
      "
      style={{ backgroundColor: extractedColor }}
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Export PNG
        </>
      )}
    </motion.button>
  );
}
