import React, { useState, useEffect } from 'react';
import { calculateCombinations, formatCombination } from '../utils/mixerLogic';
import { formatResistance } from '../utils/resistorLogic';
import { ResistorCombination } from '../types';

interface Props {
  initialValue?: string;
}

const UNITS = [
    { label: 'Ω', value: 1 },
    { label: 'kΩ', value: 1000 },
    { label: 'MΩ', value: 1000000 },
];

const ResistorMixer: React.FC<Props> = () => {
  const [userInput, setUserInput] = useState<string>('100');
  const [unitMultiplier, setUnitMultiplier] = useState<number>(1);
  const [results, setResults] = useState<{ series: ResistorCombination[], parallel: ResistorCombination[] }>({ series: [], parallel: [] });

  useEffect(() => {
    const val = parseFloat(userInput);
    if (!isNaN(val) && val > 0) {
        const target = val * unitMultiplier;
        setResults(calculateCombinations(target));
    } else {
        setResults({ series: [], parallel: [] });
    }
  }, [userInput, unitMultiplier]);

  const ResultCard = ({ title, type, data }: { title: string, type: 'series' | 'parallel', data: ResistorCombination[] }) => (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 flex flex-col h-full shadow-lg">
      <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
         <h3 className="font-bold text-lg text-slate-200">{title}</h3>
         {/* Visual Icon */}
         <div className="flex gap-1 items-center">
            {type === 'series' ? (
                // Series Icon: --[ ]--[ ]--
                <svg width="60" height="20" viewBox="0 0 60 20" className="text-blue-400 stroke-current" fill="none" strokeWidth="2">
                    <line x1="0" y1="10" x2="10" y2="10" />
                    <rect x="10" y="5" width="15" height="10" rx="2" />
                    <line x1="25" y1="10" x2="35" y2="10" />
                    <rect x="35" y="5" width="15" height="10" rx="2" />
                    <line x1="50" y1="10" x2="60" y2="10" />
                </svg>
            ) : (
                // Parallel Icon: Stacked
                <svg width="40" height="30" viewBox="0 0 40 30" className="text-purple-400 stroke-current" fill="none" strokeWidth="2">
                    <line x1="0" y1="15" x2="10" y2="15" />
                    <line x1="10" y1="5" x2="10" y2="25" />
                    
                    {/* Top R */}
                    <line x1="10" y1="5" x2="15" y2="5" />
                    <rect x="15" y="0" width="10" height="10" rx="2" />
                    <line x1="25" y1="5" x2="30" y2="5" />

                    {/* Bot R */}
                    <line x1="10" y1="25" x2="15" y2="25" />
                    <rect x="15" y="20" width="10" height="10" rx="2" />
                    <line x1="25" y1="25" x2="30" y2="25" />

                    <line x1="30" y1="5" x2="30" y2="25" />
                    <line x1="30" y1="15" x2="40" y2="15" />
                </svg>
            )}
         </div>
      </div>

      <div className="flex-1 space-y-3">
        {data.length === 0 ? (
            <p className="text-slate-500 text-sm italic">Bu değere yakın standart kombinasyon bulunamadı.</p>
        ) : (
            data.map((item, idx) => (
                <div key={idx} className="bg-slate-900/50 p-3 rounded-lg flex justify-between items-center group hover:bg-slate-900 transition-colors">
                    <div className="flex flex-col">
                        <div className="text-white font-mono font-medium text-lg">
                            {formatResistance(item.r1)} <span className="text-slate-500 text-sm mx-1">{type === 'series' ? '+' : '||'}</span> {formatResistance(item.r2)}
                        </div>
                        <div className="text-xs text-slate-400">
                           Sonuç: {formatResistance(item.result)}
                        </div>
                    </div>
                    <div className={`text-xs font-bold px-2 py-1 rounded ${item.deviation === 0 ? 'bg-green-500/20 text-green-400' : item.deviation < 1 ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {item.deviation === 0 ? 'TAM' : `%${item.deviation.toFixed(1)}`}
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-8 animate-in fade-in zoom-in duration-300">
        {/* Input Section */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-inner w-full max-w-lg mx-auto">
            <label className="block text-sm font-medium text-slate-300 mb-2 text-center uppercase tracking-wider">
                Hedeflenen Direnç
            </label>
            <div className="flex rounded-lg shadow-sm h-14">
                <input 
                    type="number" 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Örn: 300"
                    className="w-full bg-slate-900 border border-slate-600 border-r-0 rounded-l-lg px-4 py-3 text-white text-2xl font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-700 min-w-0 text-center"
                />
                <div className="relative w-24">
                    <select
                        value={unitMultiplier}
                        onChange={(e) => setUnitMultiplier(parseFloat(e.target.value))}
                        className="h-full w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-r-lg border-l border-slate-600 px-2 outline-none focus:ring-2 focus:ring-blue-500 transition-colors appearance-none cursor-pointer text-center text-lg"
                        style={{ textAlignLast: 'center' }}
                    >
                        {UNITS.map(u => (
                            <option key={u.label} value={u.value}>{u.label}</option>
                        ))}
                    </select>
                </div>
            </div>
            <p className="text-center text-xs text-slate-500 mt-3">
                İstediğiniz değeri girin, seri ve paralel alternatifleri görün.
            </p>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResultCard title="Seri Bağlantı" type="series" data={results.series} />
            <ResultCard title="Paralel Bağlantı" type="parallel" data={results.parallel} />
        </div>
    </div>
  );
};

export default ResistorMixer;