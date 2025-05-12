import React, { createContext, useContext, useState, useRef } from 'react';
import { 
  DrawingPath, 
  DrawingContextType, 
  BrushShape, 
  DrawingTool,
  ColorPaletteItem 
} from '@/types/drawing';

// Default color palette
const defaultColorPalette: ColorPaletteItem[] = [
  { color: '#000000', name: 'Black' },
  { color: '#ffffff', name: 'White' },
  { color: '#ef4444', name: 'Red' },
  { color: '#f97316', name: 'Orange' },
  { color: '#eab308', name: 'Yellow' },
  { color: '#22c55e', name: 'Green' },
  { color: '#3b82f6', name: 'Blue' },
  { color: '#8b5cf6', name: 'Purple' },
  { color: '#ec4899', name: 'Pink' },
  { color: '#78716c', name: 'Gray' },
  { color: '#a16207', name: 'Brown' },
  { color: '#6366f1', name: 'Indigo' },
];

export const DrawingContext = createContext<DrawingContextType>({
  paths: [],
  selectedColor: '#000000',
  brushSize: 5,
  brushShape: 'round',
  currentTool: 'brush',
  colorPalette: defaultColorPalette,
  undoStack: [],
  redoStack: [],
  showGrid: false,
  startDrawing: () => {},
  continueDrawing: () => {},
  finishDrawing: () => {},
  setSelectedColor: () => {},
  setBrushSize: () => {},
  setBrushShape: () => {},
  setCurrentTool: () => {},
  addCustomColor: () => {},
  clearCanvas: () => {},
  undo: () => {},
  redo: () => {},
  setShowGrid: () => {},
  isDrawing: false,
});

export const DrawingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('#000000');
  const [brushSize, setBrushSize] = useState<number>(5);
  const [brushShape, setBrushShape] = useState<BrushShape>('round');
  const [currentTool, setCurrentTool] = useState<DrawingTool>('brush');
  const [colorPalette, setColorPalette] = useState<ColorPaletteItem[]>(defaultColorPalette);
  const [undoStack, setUndoStack] = useState<DrawingPath[][]>([]);
  const [redoStack, setRedoStack] = useState<DrawingPath[][]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  
  const currentPathRef = useRef<DrawingPath | null>(null);

  const startDrawing = (x: number, y: number) => {
    setIsDrawing(true);
    
    const newPath: DrawingPath = {
      points: [{ x, y }],
      color: currentTool === 'eraser' ? '#ffffff' : selectedColor,
      size: brushSize,
      shape: brushShape,
      tool: currentTool,
    };
    
    currentPathRef.current = newPath;
    setPaths(prevPaths => [...prevPaths, newPath]);
    setRedoStack([]);
  };

  const continueDrawing = (x: number, y: number) => {
    if (!isDrawing || !currentPathRef.current) return;
    
    const updatedPath = {
      ...currentPathRef.current,
      points: [...currentPathRef.current.points, { x, y }],
    };
    
    currentPathRef.current = updatedPath;
    
    setPaths(prevPaths => {
      const newPaths = [...prevPaths];
      newPaths[newPaths.length - 1] = updatedPath;
      return newPaths;
    });
  };

  const finishDrawing = () => {
    if (isDrawing) {
      setUndoStack(prevStack => [...prevStack, [...paths]]);
    }
    
    setIsDrawing(false);
    currentPathRef.current = null;
  };

  const addCustomColor = (color: string, name: string = '') => {
    const newColor: ColorPaletteItem = { 
      color, 
      name: name || color 
    };
    
    setColorPalette(prevPalette => [...prevPalette, newColor]);
  };

  const clearCanvas = () => {
    if (paths.length > 0) {
      setUndoStack(prevStack => [...prevStack, [...paths]]);
    }
    
    setPaths([]);
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    
    const lastState = undoStack[undoStack.length - 1];
    setRedoStack(prevStack => [...prevStack, [...paths]]);
    setPaths(lastState);
    setUndoStack(prevStack => prevStack.slice(0, -1));
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    
    const lastState = redoStack[redoStack.length - 1];
    setUndoStack(prevStack => [...prevStack, [...paths]]);
    setPaths(lastState);
    setRedoStack(prevStack => prevStack.slice(0, -1));
  };

  const contextValue: DrawingContextType = {
    paths,
    selectedColor,
    brushSize,
    brushShape,
    currentTool,
    colorPalette,
    undoStack,
    redoStack,
    isDrawing,
    showGrid,
    startDrawing,
    continueDrawing,
    finishDrawing,
    setSelectedColor,
    setBrushSize,
    setBrushShape,
    setCurrentTool,
    addCustomColor,
    clearCanvas,
    undo,
    redo,
    setShowGrid,
  };

  return (
    <DrawingContext.Provider value={contextValue}>
      {children}
    </DrawingContext.Provider>
  );
};

export const useDrawing = () => useContext(DrawingContext);