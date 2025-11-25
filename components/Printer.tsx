import React, { useState } from 'react';
import { enhanceTextToVintage } from '../services/geminiService';

interface PrinterProps {
  onPrint: (text: string, variant: 'standard' | 'aged' | 'blueprint' | 'pink') => void;
}

export const Printer: React.FC<PrinterProps> = ({ onPrint }) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<'standard' | 'aged' | 'blueprint' | 'pink'>('standard');

  const handlePrint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onPrint(input, selectedVariant);
    setInput('');
  };

  const handleMagicPrint = async () => {
    // Allow magic print even if input is empty (random generation)
    setIsProcessing(true);
    try {
      const vintageText = await enhanceTextToVintage(input);
      if (vintageText) {
        onPrint(vintageText, selectedVariant);
        setInput('');
      }
    } catch (error) {
      console.error("Failed to generate", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto bg-[#2c2c2c] text-[#e0e0e0] p-6 pb-8 rounded-t-xl shadow-2xl max-w-2xl w-full mx-4 border-t-4 border-[#4a4a4a] relative">
        
        {/* Machine details */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1a1a1a] px-4 py-1 rounded border border-[#4a4a4a] shadow-md">
          <span className="font-['Courier_Prime'] text-xs tracking-[0.2em] text-amber-500/80 uppercase">MK-IV Typograph</span>
        </div>

        {/* Metallic Texture Overlay */}
        <div className="absolute inset-0 bg-noise opacity-10 rounded-t-xl pointer-events-none" />

        <div className="flex flex-col gap-4 relative z-10">
          
          {/* Input Area */}
          <div className="relative group">
             <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message or click 'Surprise Me' for a poetic quote..."
                maxLength={120}
                className="w-full bg-[#1a1a1a] border-2 border-[#3a3a3a] text-amber-50 font-['Courier_Prime','Noto_Serif_SC',serif] text-lg p-4 rounded focus:outline-none focus:border-amber-700/50 h-24 resize-none transition-colors placeholder:text-stone-600"
              />
              <div className="absolute bottom-3 right-3 text-xs text-stone-500 font-mono">
                {input.length}/120
              </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Paper Selection */}
            <div className="flex items-center gap-2 bg-[#1a1a1a] p-1.5 rounded border border-[#3a3a3a]">
              {(['standard', 'aged', 'pink', 'blueprint'] as const).map((variant) => (
                <button
                  key={variant}
                  onClick={() => setSelectedVariant(variant)}
                  className={`w-6 h-6 rounded-full border border-white/10 transition-transform hover:scale-110 ${
                    variant === 'standard' ? 'bg-[#fcfbf7]' :
                    variant === 'aged' ? 'bg-[#e8dcc5]' : 
                    variant === 'pink' ? 'bg-[#f5d0d6]' : 'bg-[#2a4b6d]'
                  } ${selectedVariant === variant ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-[#1a1a1a]' : ''}`}
                  title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Paper`}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleMagicPrint}
                disabled={isProcessing}
                className="px-4 py-2 bg-indigo-900 hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed rounded text-indigo-100 font-['Courier_Prime'] text-sm tracking-wider uppercase border-b-2 border-indigo-950 active:border-b-0 active:translate-y-[2px] transition-all flex items-center gap-2"
              >
                {isProcessing ? (
                  <span className="animate-pulse">Thinking...</span>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    {input.trim() ? 'Vintage Polish' : 'Surprise Me'}
                  </>
                )}
              </button>

              <button
                onClick={handlePrint}
                disabled={!input.trim()}
                className="px-6 py-2 bg-amber-700 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-amber-50 font-['Courier_Prime'] font-bold text-sm tracking-wider uppercase border-b-4 border-amber-900 active:border-b-0 active:translate-y-[4px] transition-all shadow-lg"
              >
                PRINT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};