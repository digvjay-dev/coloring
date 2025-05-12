import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  useColorScheme,
  PanResponder,
  Animated,
} from 'react-native';
import { useDrawing } from '@/context/DrawingContext';
import { Palette, Eraser, Pencil } from 'lucide-react-native';
import Slider from '@react-native-community/slider';

const ColorPalette = () => {
  const {
    colorPalette,
    selectedColor,
    setSelectedColor,
    brushSize,
    setBrushSize,
    currentTool,
    setCurrentTool,
  } = useDrawing();
  
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // For palette position
  const pan = useState(new Animated.ValueXY())[0];
  
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event(
      [null, { dx: pan.x, dy: pan.y }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: () => {
      // Keep the palette in its new position
    },
  });

  const handleToolSelect = (tool: 'brush' | 'eraser') => {
    setCurrentTool(tool);
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        { backgroundColor: isDark ? '#1f2937' : '#ffffff' },
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
          ],
        },
      ]}
    >
      <View style={styles.header}>
        <Palette size={18} color={isDark ? '#d1d5db' : '#4b5563'} />
        <Text style={[
          styles.title,
          { color: isDark ? '#e5e7eb' : '#1f2937' }
        ]}>
          Tools & Colors
        </Text>
      </View>

      {/* Tools Section */}
      <View style={styles.toolsSection}>
        <TouchableOpacity
          style={[
            styles.toolButton,
            currentTool === 'brush' && styles.activeToolButton,
          ]}
          onPress={() => handleToolSelect('brush')}
        >
          <Pencil size={20} color={currentTool === 'brush' ? '#6366f1' : (isDark ? '#9ca3af' : '#6b7280')} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toolButton,
            currentTool === 'eraser' && styles.activeToolButton,
          ]}
          onPress={() => handleToolSelect('eraser')}
        >
          <Eraser size={20} color={currentTool === 'eraser' ? '#6366f1' : (isDark ? '#9ca3af' : '#6b7280')} />
        </TouchableOpacity>
      </View>

      {/* Brush Size Slider */}
      <View style={styles.sliderContainer}>
        <Text style={[
          styles.sliderLabel,
          { color: isDark ? '#d1d5db' : '#4b5563' }
        ]}>
          Size: {brushSize}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={50}
          value={brushSize}
          onValueChange={setBrushSize}
          minimumTrackTintColor="#6366f1"
          maximumTrackTintColor={isDark ? '#4b5563' : '#d1d5db'}
          thumbTintColor="#6366f1"
        />
      </View>

      {/* Colors Grid */}
      <View style={styles.colorsGrid}>
        {colorPalette.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.colorButton,
              { backgroundColor: item.color },
              selectedColor === item.color && styles.selectedColor,
              currentTool === 'eraser' && styles.disabledColor,
            ]}
            onPress={() => setSelectedColor(item.color)}
          >
            {item.color === '#ffffff' && (
              <View style={styles.whiteColorBorder} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    top: 80,
    borderRadius: 12,
    padding: 16,
    width: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 8,
  },
  toolsSection: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'center',
    gap: 16,
  },
  toolButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  activeToolButton: {
    backgroundColor: '#e0e7ff',
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  sliderContainer: {
    marginBottom: 16,
  },
  sliderLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  colorButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#6366f1',
    transform: [{ scale: 1.1 }],
  },
  disabledColor: {
    opacity: 0.5,
    borderColor: 'transparent',
    transform: [{ scale: 1 }],
  },
  whiteColorBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
});

export default ColorPalette;