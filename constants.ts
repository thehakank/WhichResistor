import { ResistorColor } from './types';

export const COLORS: ResistorColor[] = [
  { id: 'black', name: 'Siyah', colorHex: '#000000', textColor: 'text-white', digit: 0, multiplier: 1 },
  { id: 'brown', name: 'Kahverengi', colorHex: '#8B4513', textColor: 'text-white', digit: 1, multiplier: 10, tolerance: 1 },
  { id: 'red', name: 'Kırmızı', colorHex: '#DC2626', textColor: 'text-white', digit: 2, multiplier: 100, tolerance: 2 },
  { id: 'orange', name: 'Turuncu', colorHex: '#EA580C', textColor: 'text-white', digit: 3, multiplier: 1000 },
  { id: 'yellow', name: 'Sarı', colorHex: '#FACC15', textColor: 'text-black', digit: 4, multiplier: 10000 },
  { id: 'green', name: 'Yeşil', colorHex: '#16A34A', textColor: 'text-white', digit: 5, multiplier: 100000, tolerance: 0.5 },
  { id: 'blue', name: 'Mavi', colorHex: '#2563EB', textColor: 'text-white', digit: 6, multiplier: 1000000, tolerance: 0.25 },
  { id: 'violet', name: 'Mor', colorHex: '#7C3AED', textColor: 'text-white', digit: 7, multiplier: 10000000, tolerance: 0.1 },
  { id: 'gray', name: 'Gri', colorHex: '#6B7280', textColor: 'text-white', digit: 8, multiplier: 100000000, tolerance: 0.05 },
  { id: 'white', name: 'Beyaz', colorHex: '#F9FAFB', textColor: 'text-black', digit: 9, multiplier: 1000000000 },
  { id: 'gold', name: 'Altın', colorHex: '#FCD34D', textColor: 'text-black', multiplier: 0.1, tolerance: 5 },
  { id: 'silver', name: 'Gümüş', colorHex: '#D1D5DB', textColor: 'text-black', multiplier: 0.01, tolerance: 10 },
];

export const DIGIT_COLORS = COLORS.filter(c => c.digit !== undefined);
export const MULTIPLIER_COLORS = COLORS.filter(c => c.multiplier !== undefined);
export const TOLERANCE_COLORS = COLORS.filter(c => c.tolerance !== undefined);

// Default initial state
export const DEFAULT_RESISTOR = {
  band1: COLORS.find(c => c.id === 'brown')!,
  band2: COLORS.find(c => c.id === 'black')!,
  multiplier: COLORS.find(c => c.id === 'red')!, // 1k ohm
  tolerance: COLORS.find(c => c.id === 'gold')!, // 5%
};

// Generate E12 Series (Standard values people actually have)
// Base values: 1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2
const E12_BASE = [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];
// Multipliers from 1 Ohm to 10 Mega Ohm
const POWERS = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000];

export const STANDARD_RESISTORS: number[] = [];
POWERS.forEach(p => {
    E12_BASE.forEach(b => {
        STANDARD_RESISTORS.push(b * p);
    });
});