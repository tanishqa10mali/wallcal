'use client';

/**
 * useImageTheme
 * Extract dominant color from hero image using Canvas API
 */

import { useEffect, useCallback, useRef } from 'react';
import { useCalendarStore } from './useCalendarStore';

/** Sample size for color extraction */
const SAMPLE_SIZE = 50;

/** Minimum brightness threshold to avoid dark colors */
const MIN_BRIGHTNESS = 60;

/** Maximum brightness threshold to avoid washed out colors */
const MAX_BRIGHTNESS = 220;

/**
 * Calculate perceived brightness of a color
 */
function getBrightness(r: number, g: number, b: number): number {
  return (r * 299 + g * 587 + b * 114) / 1000;
}

/**
 * Calculate color saturation
 */
function getSaturation(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max === 0 ? 0 : (max - min) / max;
}

/**
 * Convert RGB to hex color string
 */
function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('')}`;
}

/**
 * Hook to extract dominant color from an image URL
 */
export function useImageTheme(imageUrl: string) {
  const { setExtractedColor } = useCalendarStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const extractColor = useCallback(
    async (url: string) => {
      try {
        // Create image element
        const img = new Image();
        img.crossOrigin = 'anonymous';

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = url;
        });

        // Create canvas if not exists
        if (!canvasRef.current) {
          canvasRef.current = document.createElement('canvas');
        }
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        // Scale down for performance
        canvas.width = SAMPLE_SIZE;
        canvas.height = SAMPLE_SIZE;
        ctx.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);

        // Get image data
        const imageData = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
        const { data } = imageData;

        // Collect color samples
        const colorCounts: Map<string, { r: number; g: number; b: number; count: number }> =
          new Map();

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const brightness = getBrightness(r, g, b);
          const saturation = getSaturation(r, g, b);

          // Filter out colors that are too dark, too bright, or too gray
          if (
            brightness > MIN_BRIGHTNESS &&
            brightness < MAX_BRIGHTNESS &&
            saturation > 0.2
          ) {
            // Quantize colors to reduce variety
            const quantizedR = Math.round(r / 32) * 32;
            const quantizedG = Math.round(g / 32) * 32;
            const quantizedB = Math.round(b / 32) * 32;
            const key = `${quantizedR},${quantizedG},${quantizedB}`;

            const existing = colorCounts.get(key);
            if (existing) {
              existing.count++;
              existing.r = (existing.r + r) / 2;
              existing.g = (existing.g + g) / 2;
              existing.b = (existing.b + b) / 2;
            } else {
              colorCounts.set(key, { r, g, b, count: 1 });
            }
          }
        }

        // Find most common vibrant color
        let dominantColor = { r: 59, g: 130, b: 246 }; // Default blue
        let maxScore = 0;

        colorCounts.forEach((color) => {
          const saturation = getSaturation(color.r, color.g, color.b);
          // Score based on frequency and saturation
          const score = color.count * (1 + saturation);

          if (score > maxScore) {
            maxScore = score;
            dominantColor = { r: Math.round(color.r), g: Math.round(color.g), b: Math.round(color.b) };
          }
        });

        const hexColor = rgbToHex(dominantColor.r, dominantColor.g, dominantColor.b);
        setExtractedColor(hexColor);
      } catch (error) {
        console.error('Failed to extract color from image:', error);
        // Fallback to default blue
        setExtractedColor('#3b82f6');
      }
    },
    [setExtractedColor]
  );

  useEffect(() => {
    if (imageUrl) {
      extractColor(imageUrl);
    }
  }, [imageUrl, extractColor]);
}
