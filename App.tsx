import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from './components/Card';
import { Printer } from './components/Printer';
import { CardData, DragState, Position } from './types';

// Sound effect placeholders (could be added later)
// const SOUNDS = { print: new Audio('/print.mp3'), slide: new Audio('/slide.mp3') };

const App: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    cardId: null,
    offset: { x: 0, y: 0 },
  });
  
  // Track highest z-index to bring cards to front
  const [maxZIndex, setMaxZIndex] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load cards from local storage on mount
  useEffect(() => {
    const savedCards = localStorage.getItem('retroCards');
    if (savedCards) {
      try {
        setCards(JSON.parse(savedCards));
      } catch (e) {
        console.error("Failed to load cards", e);
      }
    }
  }, []);

  // Save cards to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('retroCards', JSON.stringify(cards));
  }, [cards]);

  const handlePrint = (text: string, variant: 'standard' | 'aged' | 'blueprint' | 'pink') => {
    const container = containerRef.current;
    if (!container) return;

    // Center spawn point slightly offset
    const spawnX = window.innerWidth / 2 - 160; 
    const spawnY = window.innerHeight - 350; 
    
    const now = new Date();
    const timestamp = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    const newCard: CardData = {
      id: crypto.randomUUID(),
      text,
      position: { x: spawnX, y: spawnY },
      rotation: (Math.random() * 6) - 3, // Slight random rotation (-3 to 3 deg)
      zIndex: maxZIndex + 1,
      variant,
      timestamp,
      time,
    };

    setMaxZIndex(prev => prev + 1);
    setCards(prev => [...prev, newCard]);
  };

  const handleDeleteCard = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
  };

  // -- Drag & Drop Logic --

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    const card = cards.find(c => c.id === id);
    if (!card) return;

    // Bring to front
    const newZ = maxZIndex + 1;
    setMaxZIndex(newZ);
    setCards(prev => prev.map(c => c.id === id ? { ...c, zIndex: newZ } : c));

    setDragState({
      isDragging: true,
      cardId: id,
      offset: {
        x: e.clientX - card.position.x,
        y: e.clientY - card.position.y,
      },
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging || !dragState.cardId) return;

    const newX = e.clientX - dragState.offset.x;
    const newY = e.clientY - dragState.offset.y;

    setCards(prev => prev.map(c => 
      c.id === dragState.cardId 
        ? { ...c, position: { x: newX, y: newY } } 
        : c
    ));
  }, [dragState]);

  const handleMouseUp = useCallback(() => {
    setDragState({ isDragging: false, cardId: null, offset: { x: 0, y: 0 } });
  }, []);

  // Global mouse listeners for drag
  useEffect(() => {
    if (dragState.isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#3b3632]"
      style={{
        backgroundImage: `
          radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%),
          repeating-linear-gradient(45deg, #36312d 0, #36312d 1px, #3b3632 0, #3b3632 50%)
        `,
        backgroundSize: '100% 100%, 20px 20px'
      }}
    >
      {/* Table Visuals (Wood Grain Effect via CSS) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`
           }} 
      />

      {/* Header / Logo */}
      <div className="absolute top-8 left-8 text-[#d4c5b0] opacity-80 select-none pointer-events-none z-0">
        <h1 className="font-['Playfair_Display'] text-4xl font-bold italic tracking-wide">RetroPress</h1>
        <p className="font-['Courier_Prime'] text-sm mt-1 tracking-widest uppercase">Est. 2024</p>
      </div>

      {/* Cards Layer */}
      <div className="absolute inset-0 z-0">
        {cards.map(card => (
          <Card 
            key={card.id} 
            data={card} 
            onMouseDown={handleMouseDown} 
            onDelete={handleDeleteCard}
          />
        ))}
        {cards.length === 0 && (
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 text-[#d4c5b0] opacity-30 font-['Courier_Prime'] text-center pointer-events-none">
            <p className="text-xl">The table is empty.</p>
            <p className="text-sm mt-2">Type a message below to print a card.</p>
          </div>
        )}
      </div>

      {/* Printer Input UI */}
      <Printer onPrint={handlePrint} />
    </div>
  );
};

export default App;