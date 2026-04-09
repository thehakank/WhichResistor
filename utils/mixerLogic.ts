import { STANDARD_RESISTORS } from '../constants';
import { ResistorCombination } from '../types';
import { formatResistance } from './resistorLogic';

export const calculateCombinations = (target: number): { series: ResistorCombination[], parallel: ResistorCombination[] } => {
  if (target <= 0) return { series: [], parallel: [] };

  const seriesMatches: ResistorCombination[] = [];
  const parallelMatches: ResistorCombination[] = [];

  // Filter relevant standard resistors to optimize loop
  // For series, we only need R < Target (mostly)
  // For parallel, we need R > Target
  
  // 1. Calculate Series: R1 + R2 = Target
  for (let i = 0; i < STANDARD_RESISTORS.length; i++) {
    const r1 = STANDARD_RESISTORS[i];
    if (r1 >= target) break; // Optimization: R1 cannot exceed target in series (assuming positive resistance)

    for (let j = i; j < STANDARD_RESISTORS.length; j++) {
      const r2 = STANDARD_RESISTORS[j];
      const sum = r1 + r2;
      
      const deviation = Math.abs((sum - target) / target) * 100;
      
      if (deviation < 5) { // Only keep if within 5% error
        seriesMatches.push({
          r1,
          r2,
          result: sum,
          deviation,
          type: 'series'
        });
      }
      
      if (sum > target * 1.1) break; // Optimization
    }
  }

  // 2. Calculate Parallel: (R1 * R2) / (R1 + R2) = Target
  // Start loop from index where R > Target
  const startIndex = STANDARD_RESISTORS.findIndex(r => r > target);
  
  if (startIndex !== -1) {
    for (let i = startIndex; i < STANDARD_RESISTORS.length; i++) {
        const r1 = STANDARD_RESISTORS[i];
        
        for (let j = i; j < STANDARD_RESISTORS.length; j++) {
            const r2 = STANDARD_RESISTORS[j];
            const eq = (r1 * r2) / (r1 + r2);
            
            const deviation = Math.abs((eq - target) / target) * 100;
            
            if (deviation < 5) {
                parallelMatches.push({
                    r1,
                    r2,
                    result: eq,
                    deviation,
                    type: 'parallel'
                });
            }
        }
    }
  }

  // Sort by lowest deviation
  seriesMatches.sort((a, b) => a.deviation - b.deviation);
  parallelMatches.sort((a, b) => a.deviation - b.deviation);

  // Return top 4 unique-ish suggestions
  return {
    series: seriesMatches.slice(0, 4),
    parallel: parallelMatches.slice(0, 4)
  };
};

export const formatCombination = (c: ResistorCombination) => {
    return `${formatResistance(c.r1)} + ${formatResistance(c.r2)}`;
};