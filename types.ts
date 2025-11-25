export interface Position {
  x: number;
  y: number;
}

export interface CardData {
  id: string;
  text: string;
  position: Position;
  rotation: number;
  zIndex: number;
  variant: 'standard' | 'aged' | 'blueprint' | 'pink';
  timestamp: string;
  time: string;
}

export interface DragState {
  isDragging: boolean;
  cardId: string | null;
  offset: Position;
}