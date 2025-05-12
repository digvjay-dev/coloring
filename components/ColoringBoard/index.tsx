import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SVGCanvas from './SVGCanvas';
import ColorPalette from './ColorPalette';
import ToolPanel from './ToolPanel';
import DrawingHeader from './DrawingHeader';
import { useDrawing } from '@/context/DrawingContext';

const ColoringBoard = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { currentTool } = useDrawing();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[
        styles.container,
        { backgroundColor: isDark ? '#1f2937' : '#ffffff' }
      ]}>
        <DrawingHeader />
        <View style={styles.canvasContainer}>
          <SVGCanvas />
        </View>
        <View style={styles.toolsContainer}>
          <ToolPanel />
          <ColorPalette />
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  canvasContainer: {
    flex: 1,
    borderRadius: 8,
    margin: 8,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toolsContainer: {
    padding: 8,
  },
});

export default ColoringBoard;