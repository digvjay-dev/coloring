export type Point = {
  x: number;
  y: number;
};

export type BrushShape = 'round' | 'square' | 'star';

export type DrawingTool = 'brush' | 'eraser';

export type DrawingPath = {
  points: Point[];
  color: string;
  size: number;
  shape: BrushShape;
  tool: DrawingTool;
};

export type ColorPaletteItem = {
  color: string;
  name: string;
};

export interface DrawingContextType {
  paths: DrawingPath[];
  selectedColor: string;
  brushSize: number;
  brushShape: BrushShape;
  currentTool: DrawingTool;
  colorPalette: ColorPaletteItem[];
  undoStack: DrawingPath[][];
  redoStack: DrawingPath[][];
  isDrawing: boolean;
  startDrawing: (x: number, y: number) => void;
  continueDrawing: (x: number, y: number) => void;
  finishDrawing: () => void;
  setSelectedColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  setBrushShape: (shape: BrushShape) => void;
  setCurrentTool: (tool: DrawingTool) => void;
  addCustomColor: (color: string, name?: string) => void;
  clearCanvas: () => void;
  undo: () => void;
  redo: () => void;
}