/**
 * Month Hero Images
 * Curated Unsplash images for each month with thematic relevance
 */

import type { MonthImage } from '../types/calendar.types';

/** Month index to image mapping (0 = January) */
export const MONTH_IMAGES: Record<number, MonthImage> = {
  0: {
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=800&fit=crop',
    alt: 'Snow-capped mountains at sunrise',
    photographer: 'Benjamin Voros',
  },
  1: {
    url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200&h=800&fit=crop',
    alt: 'Pink cherry blossoms in bloom',
    photographer: 'Jamie Street',
  },
  2: {
    url: 'https://images.unsplash.com/photo-1462275646964-a0e3571f4f7f?w=1200&h=800&fit=crop',
    alt: 'Fresh spring meadow with wildflowers',
    photographer: 'Aaron Burden',
  },
  3: {
    url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1200&h=800&fit=crop',
    alt: 'Rainy window with water droplets',
    photographer: 'Jorge Zapata',
  },
  4: {
    url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&h=800&fit=crop',
    alt: 'Lush green rolling hills',
    photographer: 'Qingbao Meng',
  },
  5: {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop',
    alt: 'Tropical beach with crystal clear water',
    photographer: 'Sean O.',
  },
  6: {
    url: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=1200&h=800&fit=crop',
    alt: 'Colorful fireworks in night sky',
    photographer: 'Ray Hennessy',
  },
  7: {
    url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1200&h=800&fit=crop',
    alt: 'Golden sunset over ocean',
    photographer: 'Vidar Nordli-Mathisen',
  },
  8: {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop',
    alt: 'Misty autumn forest',
    photographer: 'Johannes Plenio',
  },
  9: {
    url: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1200&h=800&fit=crop',
    alt: 'Orange and red fall foliage',
    photographer: 'Aaron Burden',
  },
  10: {
    url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1200&h=800&fit=crop',
    alt: 'Cozy foggy morning landscape',
    photographer: 'Photoholgic',
  },
  11: {
    url: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1200&h=800&fit=crop',
    alt: 'Snow-covered pine trees',
    photographer: 'Fabrice Villard',
  },
};

/**
 * Get the image configuration for a specific month
 */
export function getMonthImage(month: number): MonthImage {
  return MONTH_IMAGES[month] || MONTH_IMAGES[0];
}

/** Month names for display */
export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;
