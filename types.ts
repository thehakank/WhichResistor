export interface ResistorColor {
  id: string;
  name: string; // Turkish name
  colorHex: string;
  textColor: string; // 'white' or 'black' for contrast
  digit?: number;
  multiplier?: number;
  tolerance?: number;
}

export interface ResistorState {
  band1: ResistorColor;
  band2: ResistorColor;
  multiplier: ResistorColor;
  tolerance: ResistorColor;
}

export type CalculationMode = 'colors-to-value' | 'value-to-colors' | 'resistor-mixer';

export interface ResistorCombination {
  r1: number;
  r2: number;
  result: number;
  deviation: number; // percentage error
  type: 'series' | 'parallel';
}