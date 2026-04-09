import { COLORS, DIGIT_COLORS, MULTIPLIER_COLORS } from '../constants';
import { ResistorColor, ResistorState } from '../types';

export const formatResistance = (ohms: number): string => {
  if (ohms >= 1000000000) return `${(ohms / 1000000000).toLocaleString('tr-TR', { maximumFractionDigits: 2 })}GΩ`;
  if (ohms >= 1000000) return `${(ohms / 1000000).toLocaleString('tr-TR', { maximumFractionDigits: 2 })}MΩ`;
  if (ohms >= 1000) return `${(ohms / 1000).toLocaleString('tr-TR', { maximumFractionDigits: 2 })}kΩ`;
  if (ohms < 1 && ohms > 0) return `${(ohms * 1000).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}mΩ`;
  return `${ohms.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}Ω`;
};

export const calculateOhms = (band1: ResistorColor, band2: ResistorColor, multiplier: ResistorColor): number => {
  const baseVal = (band1.digit || 0) * 10 + (band2.digit || 0);
  // Floating point precision fix
  return Number((baseVal * (multiplier.multiplier || 1)).toPrecision(12));
};

export const solveColorsFromOhms = (ohms: number): Partial<ResistorState> | null => {
  if (isNaN(ohms) || ohms <= 0) return null;

  // Bruteforce-ish match to find best Multiplier
  let bestMatch: { b1: ResistorColor, b2: ResistorColor, mult: ResistorColor, diff: number } | null = null;
  
  for (const m of MULTIPLIER_COLORS) {
     const mVal = m.multiplier!;
     const rawDigits = Math.round(ohms / mVal);
     
     if (rawDigits >= 0 && rawDigits <= 99) {
        const d1 = Math.floor(rawDigits / 10);
        const d2 = rawDigits % 10;
        
        const c1 = DIGIT_COLORS.find(c => c.digit === d1);
        const c2 = DIGIT_COLORS.find(c => c.digit === d2);
        
        if (c1 && c2) {
             const calculated = (d1 * 10 + d2) * mVal;
             const diff = Math.abs(calculated - ohms);
             
             if (!bestMatch || diff < bestMatch.diff) {
                 bestMatch = { b1: c1, b2: c2, mult: m, diff };
             }
        }
     }
  }

  if (bestMatch) {
      return {
          band1: bestMatch.b1,
          band2: bestMatch.b2,
          multiplier: bestMatch.mult
      };
  }
  
  return null; 
};

export const getClosestStandardResistor = (ohms: number): Partial<ResistorState> => {
    // A robust approximation for user entered values
    const str = ohms.toExponential(1); // "4.7e+2" -> 4.7 * 10^2
    const [base, exponent] = str.split('e');
    
    const [d1Str, d2Str] = base.split('.');
    const d1 = parseInt(d1Str);
    const d2 = parseInt(d2Str || '0');
    
    const exp = parseInt(exponent);
    
    // Value = (d1 * 10 + d2) * 10^(exp - 1)
    const multiplierPower = exp - 1;
    let multiplierVal = Math.pow(10, multiplierPower);
    
    // Handle floating point weirdness for small multipliers
    if (multiplierPower <= -1) {
        // Find closest power of 10 supported by standard multipliers
        // Standard multipliers go down to 0.01 (Silver)
        if (multiplierVal < 0.01) multiplierVal = 0.01;
        else if (multiplierVal < 0.1) multiplierVal = 0.01; // Snap logic
        else multiplierVal = parseFloat(multiplierVal.toPrecision(1));
    }
    
    const band1 = DIGIT_COLORS.find(c => c.digit === d1) || COLORS[0]; 
    const band2 = DIGIT_COLORS.find(c => c.digit === d2) || COLORS[0];
    
    // Find closest multiplier color
    const multiplier = MULTIPLIER_COLORS.reduce((prev, curr) => {
        return (Math.abs(curr.multiplier! - multiplierVal) < Math.abs(prev.multiplier! - multiplierVal) ? curr : prev);
    });

    return { band1, band2, multiplier };
};