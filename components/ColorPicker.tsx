import React from 'react';
import { ResistorColor } from '../types';

interface Props {
  label: string;
  colors: ResistorColor[];
  selected: ResistorColor;
  onChange: (color: ResistorColor) => void;
}

const ColorPicker: React.FC<Props> = ({ label, colors, selected, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700">
        {colors.map((c) => (
          <button
            key={c.id}
            onClick={() => onChange(c)}
            className={`
              w-full h-10 rounded shadow-md transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-800 focus:ring-blue-500
              ${selected.id === c.id ? 'ring-2 ring-white scale-110 z-10' : 'opacity-80 hover:opacity-100'}
            `}
            style={{ backgroundColor: c.colorHex }}
            title={c.name}
            aria-label={c.name}
          >
             {selected.id === c.id && (
                <span className={`text-xs font-bold ${c.textColor === 'text-black' ? 'text-black' : 'text-white'}`}>
                    ✓
                </span>
             )}
          </button>
        ))}
      </div>
      <div className="text-center text-sm font-medium mt-1">
          Seçilen: <span style={{ color: selected.colorHex === '#000000' ? '#9CA3AF' : selected.colorHex }}>{selected.name}</span>
      </div>
    </div>
  );
};

export default ColorPicker;