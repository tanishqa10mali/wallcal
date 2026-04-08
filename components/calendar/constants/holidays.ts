/**
 * Indian Public Holidays 2025-2026
 * Comprehensive list of national, religious, and major regional holidays
 */

import type { Holiday } from '../types/calendar.types';

export const INDIAN_HOLIDAYS: Holiday[] = [
  // 2025 Holidays
  { date: new Date(2025, 0, 14), name: 'Makar Sankranti', type: 'religious' },
  { date: new Date(2025, 0, 26), name: 'Republic Day', type: 'national' },
  { date: new Date(2025, 2, 14), name: 'Holi', type: 'religious' },
  { date: new Date(2025, 3, 6), name: 'Ugadi', type: 'regional' },
  { date: new Date(2025, 3, 10), name: 'Ram Navami', type: 'religious' },
  { date: new Date(2025, 3, 14), name: 'Ambedkar Jayanti', type: 'national' },
  { date: new Date(2025, 3, 18), name: 'Good Friday', type: 'religious' },
  { date: new Date(2025, 4, 1), name: 'May Day', type: 'national' },
  { date: new Date(2025, 4, 12), name: 'Buddha Purnima', type: 'religious' },
  { date: new Date(2025, 5, 7), name: 'Eid ul-Fitr', type: 'religious' },
  { date: new Date(2025, 7, 15), name: 'Independence Day', type: 'national' },
  { date: new Date(2025, 7, 16), name: 'Janmashtami', type: 'religious' },
  { date: new Date(2025, 8, 5), name: 'Ganesh Chaturthi', type: 'religious' },
  { date: new Date(2025, 9, 2), name: 'Gandhi Jayanti', type: 'national' },
  { date: new Date(2025, 9, 20), name: 'Dussehra', type: 'religious' },
  { date: new Date(2025, 9, 21), name: 'Eid ul-Adha', type: 'religious' },
  { date: new Date(2025, 10, 1), name: 'Diwali', type: 'religious' },
  { date: new Date(2025, 10, 5), name: 'Bhai Dooj', type: 'religious' },
  { date: new Date(2025, 10, 15), name: 'Guru Nanak Jayanti', type: 'religious' },
  { date: new Date(2025, 11, 25), name: 'Christmas', type: 'religious' },

  // 2026 Holidays
  { date: new Date(2026, 0, 14), name: 'Makar Sankranti', type: 'religious' },
  { date: new Date(2026, 0, 26), name: 'Republic Day', type: 'national' },
  { date: new Date(2026, 2, 3), name: 'Holi', type: 'religious' },
  { date: new Date(2026, 2, 25), name: 'Ugadi', type: 'regional' },
  { date: new Date(2026, 2, 30), name: 'Ram Navami', type: 'religious' },
  { date: new Date(2026, 3, 3), name: 'Good Friday', type: 'religious' },
  { date: new Date(2026, 3, 14), name: 'Ambedkar Jayanti', type: 'national' },
  { date: new Date(2026, 4, 1), name: 'May Day', type: 'national' },
  { date: new Date(2026, 4, 31), name: 'Buddha Purnima', type: 'religious' },
  { date: new Date(2026, 5, 26), name: 'Eid ul-Fitr', type: 'religious' },
  { date: new Date(2026, 7, 5), name: 'Janmashtami', type: 'religious' },
  { date: new Date(2026, 7, 15), name: 'Independence Day', type: 'national' },
  { date: new Date(2026, 7, 25), name: 'Ganesh Chaturthi', type: 'religious' },
  { date: new Date(2026, 8, 2), name: 'Eid ul-Adha', type: 'religious' },
  { date: new Date(2026, 9, 2), name: 'Gandhi Jayanti', type: 'national' },
  { date: new Date(2026, 9, 9), name: 'Dussehra', type: 'religious' },
  { date: new Date(2026, 9, 20), name: 'Diwali', type: 'religious' },
  { date: new Date(2026, 10, 4), name: 'Guru Nanak Jayanti', type: 'religious' },
  { date: new Date(2026, 11, 25), name: 'Christmas', type: 'religious' },
];

/**
 * Get holidays for a specific month and year
 */
export function getHolidaysForMonth(year: number, month: number): Holiday[] {
  return INDIAN_HOLIDAYS.filter(
    (holiday) =>
      holiday.date.getFullYear() === year && holiday.date.getMonth() === month
  );
}

/**
 * Check if a specific date is a holiday
 */
export function isHoliday(date: Date): Holiday | undefined {
  return INDIAN_HOLIDAYS.find(
    (holiday) =>
      holiday.date.getFullYear() === date.getFullYear() &&
      holiday.date.getMonth() === date.getMonth() &&
      holiday.date.getDate() === date.getDate()
  );
}
