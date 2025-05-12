import React from 'react';
import { G, Line } from 'react-native-svg';

interface GridBackgroundProps {
  width: number;
  height: number;
  gridSize?: number;
}

const GridBackground: React.FC<GridBackgroundProps> = ({ 
  width, 
  height, 
  gridSize = 20 
}) => {
  const horizontalLines = [];
  const verticalLines = [];

  // Create horizontal grid lines
  for (let i = 0; i <= height; i += gridSize) {
    horizontalLines.push(
      <Line
        key={`h-${i}`}
        x1="0"
        y1={i}
        x2={width}
        y2={i}
        stroke="#f3f4f6"
        strokeWidth="1"
      />
    );
  }

  // Create vertical grid lines
  for (let i = 0; i <= width; i += gridSize) {
    verticalLines.push(
      <Line
        key={`v-${i}`}
        x1={i}
        y1="0"
        x2={i}
        y2={height}
        stroke="#f3f4f6"
        strokeWidth="1"
      />
    );
  }

  return (
    <G>
      {horizontalLines}
      {verticalLines}
    </G>
  );
};

export default GridBackground;