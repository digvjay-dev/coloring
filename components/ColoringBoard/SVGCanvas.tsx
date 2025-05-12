import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useDrawing } from '@/context/DrawingContext';
import { getPathFromPoints } from '@/utils/svgPathUtils';
import GridBackground from './GridBackground';

const SVGCanvas = () => {
  const {
    paths,
    startDrawing,
    continueDrawing,
    finishDrawing,
    isDrawing,
    showGrid,
  } = useDrawing();

  // For canvas dimensions
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('window').width - 32,
    height: Math.min(Dimensions.get('window').height * 0.6, 500)
  });

  // Update dimensions on layout
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        width: window.width - 32,
        height: Math.min(window.height * 0.6, 500)
      });
    });

    return () => subscription?.remove();
  }, []);

  // Create pan gesture
  const pan = Gesture.Pan()
    .onStart((event) => {
      const x = event.x;
      const y = event.y;
      startDrawing(x, y);
    })
    .onUpdate((event) => {
      const x = event.x;
      const y = event.y;
      continueDrawing(x, y);
    })
    .onEnd(() => {
      finishDrawing();
    });

  return (
    <View style={styles.container}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GestureDetector gesture={pan}>
          <View style={[styles.canvasContainer, { width: dimensions.width, height: dimensions.height }]}>
            <Svg width={dimensions.width} height={dimensions.height} style={styles.canvas}>
              {showGrid && (
                <GridBackground width={dimensions.width} height={dimensions.height} />
              )}
              <G>
                {paths.map((path, index) => {
                  const pathString = getPathFromPoints(path.points);
                  
                  let strokeLinecap = 'round';
                  let strokeLinejoin = 'round';
                  
                  if (path.shape === 'square') {
                    strokeLinecap = 'butt';
                    strokeLinejoin = 'miter';
                  }
                  
                  return (
                    <Path
                      key={index}
                      d={pathString}
                      stroke={path.color}
                      strokeWidth={path.size}
                      strokeLinecap={strokeLinecap}
                      strokeLinejoin={strokeLinejoin}
                      fill="none"
                    />
                  );
                })}
              </G>
            </Svg>
          </View>
        </GestureDetector>
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvasContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  canvas: {
    backgroundColor: '#ffffff',
  },
});

export default SVGCanvas;