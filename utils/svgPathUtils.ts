import { Point } from '@/types/drawing';

/**
 * Generates an SVG path string from an array of points
 * Using Catmull-Rom spline for smooth curves
 */
export const getPathFromPoints = (points: Point[]): string => {
  if (points.length < 2) {
    return '';
  }
  
  // For just two points, draw a straight line
  if (points.length === 2) {
    return `M ${points[0].x},${points[0].y} L ${points[1].x},${points[1].y}`;
  }
  
  let path = `M ${points[0].x},${points[0].y}`;
  
  // Add line segments between points
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x},${points[i].y}`;
  }
  
  return path;
};

/**
 * More advanced path generation with curve smoothing
 * (For future implementation)
 */
export const getSmoothPath = (points: Point[], tension: number = 0.5): string => {
  if (points.length < 2) {
    return '';
  }
  
  // For just two points, draw a straight line
  if (points.length === 2) {
    return `M ${points[0].x},${points[0].y} L ${points[1].x},${points[1].y}`;
  }
  
  // Create control points for the curve
  const getControlPoints = (p0: Point, p1: Point, p2: Point, t: number) => {
    const d01 = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2));
    const d12 = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    
    const fa = t * d01 / (d01 + d12);
    const fb = t * d12 / (d01 + d12);
    
    const c1x = p1.x - fa * (p2.x - p0.x);
    const c1y = p1.y - fa * (p2.y - p0.y);
    const c2x = p1.x + fb * (p2.x - p0.x);
    const c2y = p1.y + fb * (p2.y - p0.y);
    
    return [{ x: c1x, y: c1y }, { x: c2x, y: c2y }];
  };
  
  let path = `M ${points[0].x},${points[0].y}`;
  
  // For the first segment, we only have the first control point
  const [c1, c2] = getControlPoints(
    points[0], 
    points[0], 
    points[1], 
    tension
  );
  
  path += ` C ${c2.x},${c2.y} ${points[1].x},${points[1].y} ${points[1].x},${points[1].y}`;
  
  // For middle segments
  for (let i = 1; i < points.length - 1; i++) {
    const [c1, c2] = getControlPoints(
      points[i - 1], 
      points[i], 
      points[i + 1], 
      tension
    );
    
    path += ` C ${c1.x},${c1.y} ${c2.x},${c2.y} ${points[i + 1].x},${points[i + 1].y}`;
  }
  
  return path;
};