import React, { useCallback } from 'react';
import { CardData } from '../types';

interface CardProps {
  data: CardData;
  onMouseDown: (e: React.MouseEvent, id: string) => void;
  onDelete: (id: string) => void;
}

export const Card: React.FC<CardProps> = ({ data, onMouseDown, onDelete }) => {
  const { id, text, position, rotation, zIndex, variant, timestamp, time } = data;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    onMouseDown(e, id);
  }, [onMouseDown, id]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  }, [onDelete, id]);

  // Variant styling
  const getVariantStyles = () => {
    switch (variant) {
      case 'aged':
        return 'bg-[#e8dcc5] border-[#cbbca0] text-[#4a4036]';
      case 'blueprint':
        return 'bg-[#2a4b6d] border-[#4a6b8d] text-[#e0e0e0]';
      case 'pink':
        return 'bg-[#f5d0d6] border-[#dcb0b8] text-[#5e2c33]';
      case 'standard':
      default:
        return 'bg-[#fcfbf7] border-[#e6e2d8] text-[#2c2c2c]';
    }
  };

  return (
    <div
      className={`absolute cursor-grab active:cursor-grabbing select-none group transition-shadow duration-200 ${getVariantStyles()}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
        zIndex: zIndex,
        width: '320px',
        minHeight: '200px',
        padding: '24px',
        boxShadow: '2px 4px 12px rgba(0,0,0,0.15), 1px 1px 2px rgba(0,0,0,0.1)',
        borderWidth: '1px',
        borderRadius: '2px',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Paper Texture Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-noise mix-blend-multiply" />
      
      {/* Decorative "Punch holes" or corners */}
      <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-black opacity-10" />
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-black opacity-10" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between font-['Huiwen-mincho','Noto_Serif_SC',serif]">
        
        <div className="border-b border-current opacity-20 mb-4 pb-1 flex justify-between text-[10px] tracking-widest uppercase font-['Courier_Prime']">
          <span>No. {id.slice(-4)}</span>
          <div className="flex gap-3">
             <span>{timestamp}</span>
             <span>{time}</span>
          </div>
        </div>

        <p className="text-xl leading-relaxed ink-bleed break-words whitespace-pre-wrap">
          {text}
        </p>

        <div className="mt-6 flex justify-between items-end opacity-40">
           <div className="w-12 h-12 border border-current rounded-full flex items-center justify-center">
             <span className="text-[10px] transform -rotate-12">QC</span>
           </div>
           <span className="text-[10px] tracking-widest font-['Courier_Prime']">RETRO PRESS CO.</span>
        </div>

        {/* Delete Button (Visible on Hover) */}
        <button
          onClick={handleDelete}
          className="absolute -top-3 -right-3 w-6 h-6 bg-red-800 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-sm z-10"
          title="Discard Card"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};