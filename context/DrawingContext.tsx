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

// Create context with default values
export const DrawingContext = createContext<DrawingContextType>({
  paths: [],
  selectedColor: '#000000',
  brushSize: 5,
  brushShape: 'round',
  currentTool: 'brush',
  colorPalette: defaultColorPalette,
  undoStack: [],
  redoStack: [],
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
  
  const currentPathRef = useRef<DrawingPath | null>(null);

  const startDrawing = (x: number, y: number) => {
    setIsDrawing(true);
    
    // Create a new path
    const newPath: DrawingPath = {
      points: [{ x, y }],
      color: currentTool === 'eraser' ? '#ffffff' : selectedColor,
      size: brushSize,
      shape: brushShape,
      tool: currentTool,
    };
    
    currentPathRef.current = newPath;
    
    // Add the new path to paths
    setPaths(prevPaths => [...prevPaths, newPath]);
    
    // Clear redo stack when a new drawing action starts
    setRedoStack([]);
  };

  const continueDrawing = (x: number, y: number) => {
    if (!isDrawing || !currentPathRef.current) return;
    
    // Update the current path with new point
    const updatedPath = {
      ...currentPathRef.current,
      points: [...currentPathRef.current.points, { x, y }],
    };
    
    currentPathRef.current = updatedPath;
    
    // Update the paths array with the updated path
    setPaths(prevPaths => {
      const newPaths = [...prevPaths];
      newPaths[newPaths.length - 1] = updatedPath;
      return newPaths;
    });
  };

  const finishDrawing = () => {
    // Save the current state to undo stack
    if (isDrawing) {
      setUndoStack(prevStack => [...prevStack, [...paths]]);
    }
    
    setIsDrawing(false);
    currentPathRef.current = null;
  };

  const addCustomColor = (color: string, name: string = '') => {
    // Add a new color to the palette
    const newColor: ColorPaletteItem = { 
      color, 
      name: name || color 
    };
    
    setColorPalette(prevPalette => [...prevPalette, newColor]);
  };

  const clearCanvas = () => {
    // Save current state to undo stack before clearing
    if (paths.length > 0) {
      setUndoStack(prevStack => [...prevStack, [...paths]]);
    }
    
    setPaths([]);
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    
    // Get the last state from undo stack
    const lastState = undoStack[undoStack.length - 1];
    
    // Save current state to redo stack
    setRedoStack(prevStack => [...prevStack, [...paths]]);
    
    // Set paths to the last state
    setPaths(lastState);
    
    // Remove the last state from undo stack
    setUndoStack(prevStack => prevStack.slice(0, -1));
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    
    // Get the last state from redo stack
    const lastState = redoStack[redoStack.length - 1];
    
    // Save current state to undo stack
    setUndoStack(prevStack => [...prevStack, [...paths]]);
    
    // Set paths to the last state
    setPaths(lastState);
    
    // Remove the last state from redo stack
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
  };

  return (
    <DrawingContext.Provider value={contextValue}>
      {children}
    </DrawingContext.Provider>
  );
};

export const useDrawing = () => useContext(DrawingContext);