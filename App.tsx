import React, { useState, useEffect } from 'react';
import { DEFAULT_RESISTOR, DIGIT_COLORS, MULTIPLIER_COLORS, TOLERANCE_COLORS } from './constants';
import { ResistorState, CalculationMode } from './types';
import ResistorGraphic from './components/ResistorGraphic';
import ColorPicker from './components/ColorPicker';
import ResistorMixer from './components/ResistorMixer';
import { calculateOhms, formatResistance, getClosestStandardResistor } from './utils/resistorLogic';

// Icons using SVG directly
const CalculatorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

const MixerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"/><path d="m5 12 7-7 7 7"/><path d="m12 5 7 7-7 7"/></svg>
);

const UNITS = [
    { label: 'mΩ', value: 0.001 },
    { label: 'Ω', value: 1 },
    { label: 'kΩ', value: 1000 },
    { label: 'MΩ', value: 1000000 },
    { label: 'GΩ', value: 1000000000 },
];

const App: React.FC = () => {
  const [mode, setMode] = useState<CalculationMode>('colors-to-value');
  const [resistor, setResistor] = useState<ResistorState>(DEFAULT_RESISTOR);
  
  // Separate input value (string) from unit multiplier
  const [userInput, setUserInput] = useState<string>('1');
  const [unitMultiplier, setUnitMultiplier] = useState<number>(1000); // Default to kΩ (1000)
  
  const [calculatedValue, setCalculatedValue] = useState<number>(0);

  // Effect: Recalculate value when colors change (Forward Mode)
  useEffect(() => {
    if (mode === 'colors-to-value') {
      const val = calculateOhms(resistor.band1, resistor.band2, resistor.multiplier);
      setCalculatedValue(val);
    }
  }, [resistor, mode]);

  // Helper to update resistor based on Value + Unit
  const updateResistorFromValue = (valStr: string, multiplier: number) => {
      const numVal = parseFloat(valStr);
      if (!isNaN(numVal) && numVal > 0) {
          const totalOhms = numVal * multiplier;
          const result = getClosestStandardResistor(totalOhms);
          setResistor(prev => ({
              ...prev,
              band1: result.band1 || prev.band1,
              band2: result.band2 || prev.band2,
              multiplier: result.multiplier || prev.multiplier,
          }));
          setCalculatedValue(totalOhms);
      }
  };

  // Handler: User types a number
  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserInput(val);
    updateResistorFromValue(val, unitMultiplier);
  };

  // Handler: User changes the unit (Ω, kΩ, etc.)
  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newMultiplier = parseFloat(e.target.value);
      setUnitMultiplier(newMultiplier);
      updateResistorFromValue(userInput, newMultiplier);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center py-10 px-4">
      
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight mb-2">
          WhichResistor
        </h1>
        <p className="text-slate-400">4 Bantlı Direnç Hesaplayıcı</p>
      </header>

      {/* Main Card */}
      <main className="w-full max-w-4xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl p-6 md:p-8">
        
        {/* Mode Toggle */}
        <div className="flex bg-slate-900 p-1 rounded-xl mb-8 w-full overflow-x-auto sm:w-fit mx-auto border border-slate-700 no-scrollbar">
          <button
            onClick={() => setMode('colors-to-value')}
            className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              mode === 'colors-to-value' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CalculatorIcon />
            Renk Seçimi
          </button>
          <button
            onClick={() => setMode('value-to-colors')}
            className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              mode === 'value-to-colors' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <SearchIcon />
            Değer Bulucu
          </button>
          <button
            onClick={() => setMode('resistor-mixer')}
            className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              mode === 'resistor-mixer' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MixerIcon />
            Karıştırıcı
          </button>
        </div>

        {/* Resistor Visualization (Only show in first 2 modes) */}
        {mode !== 'resistor-mixer' && (
            <ResistorGraphic data={resistor} />
        )}

        {/* Result Display (Only show in first 2 modes) */}
        {mode !== 'resistor-mixer' && (
            <div className="text-center mb-10">
                <span className="text-sm text-slate-400 uppercase tracking-widest font-semibold block mb-2">
                Direnç Değeri
                </span>
                <div className="text-5xl md:text-6xl font-black text-white tabular-nums tracking-tight drop-shadow-lg">
                    {formatResistance(calculatedValue)}
                    <span className="text-2xl md:text-3xl text-slate-500 ml-2 font-light">
                    ±{resistor.tolerance.tolerance}%
                    </span>
                </div>
                {mode === 'value-to-colors' && (
                <p className="text-sm text-yellow-500 mt-2 font-medium">
                    * Gösterilen renkler girilen değere en yakın standart karşılıktır.
                </p>
                )}
            </div>
        )}

        {/* Dynamic Layout based on Mode */}
        
        {mode === 'colors-to-value' && (
            /* Mode 1: Renk Seçimi Layout */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Left Column: Band 1 & 2 */}
                <div className="space-y-6">
                    <ColorPicker 
                        label="1. Bant (1. Basamak)" 
                        colors={DIGIT_COLORS} 
                        selected={resistor.band1} 
                        onChange={(c) => setResistor(prev => ({ ...prev, band1: c }))} 
                    />
                    <ColorPicker 
                        label="2. Bant (2. Basamak)" 
                        colors={DIGIT_COLORS} 
                        selected={resistor.band2} 
                        onChange={(c) => setResistor(prev => ({ ...prev, band2: c }))} 
                    />
                </div>
                
                {/* Right Column: Tolerance & Band 3 (Multiplier) */}
                <div className="space-y-6">
                     <ColorPicker 
                        label="Tolerans (4. Bant)" 
                        colors={TOLERANCE_COLORS} 
                        selected={resistor.tolerance} 
                        onChange={(c) => setResistor(prev => ({ ...prev, tolerance: c }))} 
                    />
                    <ColorPicker 
                        label="3. Bant (Çarpan)" 
                        colors={MULTIPLIER_COLORS} 
                        selected={resistor.multiplier} 
                        onChange={(c) => setResistor(prev => ({ ...prev, multiplier: c }))} 
                    />
                </div>
            </div>
        )}

        {mode === 'value-to-colors' && (
            /* Mode 2: Değer Bulucu Layout */
            <div className="flex flex-col gap-8">
                
                {/* Top: Input Section (Centered) */}
                <div className="bg-slate-800 p-6 rounded-xl border border-purple-500/30 shadow-inner w-full max-w-lg mx-auto">
                    <label className="block text-sm font-medium text-slate-300 mb-2 text-center">
                       İstenilen Direnç Değeri
                    </label>
                    <div className="flex rounded-lg shadow-sm">
                        <input 
                            type="number" 
                            value={userInput}
                            onChange={handleUserInputChange}
                            placeholder="Örn: 220"
                            className="w-full bg-slate-900 border border-slate-600 border-r-0 rounded-l-lg px-4 py-3 text-white text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder-slate-600 min-w-0"
                        />
                        <div className="relative">
                            <select
                                value={unitMultiplier}
                                onChange={handleUnitChange}
                                className="h-full bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-r-lg border-l border-slate-600 px-3 pr-8 py-3 outline-none focus:ring-2 focus:ring-purple-500 transition-colors appearance-none cursor-pointer"
                                style={{ textAlignLast: 'center' }}
                            >
                                {UNITS.map(u => (
                                    <option key={u.label} value={u.value}>{u.label}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-300">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom: 2x2 Grid for Results */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 opacity-90 pointer-events-none grayscale-[0.3]">
                    {/* Row 1 Left */}
                    <ColorPicker 
                        label="1. Bant" 
                        colors={DIGIT_COLORS} 
                        selected={resistor.band1} 
                        onChange={(c) => setResistor(prev => ({ ...prev, band1: c }))} 
                    />
                    {/* Row 1 Right */}
                    <ColorPicker 
                        label="Tolerans" 
                        colors={TOLERANCE_COLORS} 
                        selected={resistor.tolerance} 
                        onChange={(c) => setResistor(prev => ({ ...prev, tolerance: c }))} 
                    />
                    {/* Row 2 Left */}
                    <ColorPicker 
                        label="2. Bant" 
                        colors={DIGIT_COLORS} 
                        selected={resistor.band2} 
                        onChange={(c) => setResistor(prev => ({ ...prev, band2: c }))} 
                    />
                    {/* Row 2 Right */}
                    <ColorPicker 
                        label="3. Bant (Çarpan)" 
                        colors={MULTIPLIER_COLORS} 
                        selected={resistor.multiplier} 
                        onChange={(c) => setResistor(prev => ({ ...prev, multiplier: c }))} 
                    />
                </div>
            </div>
        )}

        {mode === 'resistor-mixer' && (
            <ResistorMixer />
        )}

      </main>

      <footer className="mt-12 text-slate-500 text-sm">
         WhichResistor © {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;