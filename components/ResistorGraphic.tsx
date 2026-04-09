import React from 'react';
import { ResistorState } from '../types';

interface Props {
  data: ResistorState;
}

const ResistorGraphic: React.FC<Props> = ({ data }) => {
  return (
    <div className="relative w-full h-48 flex items-center justify-center my-8 select-none">
      {/* Wire Left */}
      <div className="absolute left-0 w-1/4 h-2 bg-gray-400"></div>
      
      {/* Wire Right */}
      <div className="absolute right-0 w-1/4 h-2 bg-gray-400"></div>
      
      {/* Resistor Body */}
      <div className="relative w-1/2 h-24 bg-[#E2CFA9] rounded-lg shadow-xl flex flex-row items-center justify-between px-6 overflow-hidden border border-[#d4be93]">
         {/* Shading/Lighting effect */}
         <div className="absolute top-0 left-0 w-full h-1/2 bg-white opacity-10 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-full h-1/4 bg-black opacity-10 pointer-events-none"></div>

         {/* Band 1 */}
         <div 
            className="w-4 h-full shadow-sm" 
            style={{ backgroundColor: data.band1.colorHex }} 
            title={`1. Bant: ${data.band1.name}`}
         />
         
         {/* Band 2 */}
         <div 
            className="w-4 h-full shadow-sm" 
            style={{ backgroundColor: data.band2.colorHex }} 
            title={`2. Bant: ${data.band2.name}`}
         />
         
         {/* Multiplier */}
         <div 
            className="w-4 h-full shadow-sm" 
            style={{ backgroundColor: data.multiplier.colorHex }} 
            title={`Çarpan: ${data.multiplier.name}`}
         />
         
         {/* Tolerance (Spaced out more) */}
         <div 
            className="w-4 h-full shadow-sm ml-8" 
            style={{ backgroundColor: data.tolerance.colorHex }} 
            title={`Tolerans: ${data.tolerance.name}`}
         />
      </div>
    </div>
  );
};

export default ResistorGraphic;