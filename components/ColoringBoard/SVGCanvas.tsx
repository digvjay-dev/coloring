import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useDrawing } from '@/context/DrawingContext';
import { getPathFromPoints } from '@/utils/svgPathUtils';
import GridBackground from './GridBackground';

const AnimatedView = Animated.createAnimatedComponent(View);

const SVGCanvas = () => {
  const {
    paths,
    startDrawing,
    continueDrawing,
    finishDrawing,
    isDrawing,
  } = useDrawing();

  // For canvas dimensions
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('window').width - 32,
    height: Math.min(Dimensions.get('window').height * 0.6, 500)
  });

  // For indicator animation
  const indicatorScale = useSharedValue(1);
  const indicatorOpacity = useSharedValue(0);
  const lastPosition = useSharedValue({ x: 0, y: 0 });

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
      
      lastPosition.value = { x, y };
      startDrawing(x, y);
      
      indicatorScale.value = withSpring(1.2);
      indicatorOpacity.value = withSpring(0.6);
    })
    .onUpdate((event) => {
      const x = event.x;
      const y = event.y;
      
      lastPosition.value = { x, y };
      continueDrawing(x, y);
    })
    .onEnd(() => {
      finishDrawing();
      
      indicatorScale.value = withSpring(1);
      indicatorOpacity.value = withSpring(0);
    });

  // Animated style for touch indicator
  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ scale: indicatorScale.value }],
    opacity: indicatorOpacity.value,
    left: lastPosition.value.x - 25,
    top: lastPosition.value.y - 25,
  }));

  return (
    <View style={styles.container}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GestureDetector gesture={pan}>
          <View style={[styles.canvasContainer, { width: dimensions.width, height: dimensions.height }]}>
            <Svg width={dimensions.width} height={dimensions.height} style={styles.canvas}>
              <GridBackground width={dimensions.width} height={dimensions.height} />
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
            
            {Platform.OS !== 'web' && (
              <AnimatedView style={[styles.touchIndicator, indicatorStyle]} />
            )}
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
  touchIndicator: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(99, 102, 241, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(99, 102, 241, 0.8)',
    pointerEvents: 'none',
  },
});

export default SVGCanvas;