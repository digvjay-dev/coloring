import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  useColorScheme,
  Pressable,
  Platform,
} from 'react-native';
import { useDrawing } from '@/context/DrawingContext';
import {
  Pencil,
  Eraser,
  Square,
  Circle,
  Star,
  Minus,
  Plus,
} from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

// Create animated components
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ToolPanel = () => {
  const {
    brushSize,
    setBrushSize,
    brushShape,
    setBrushShape,
    currentTool,
    setCurrentTool,
  } = useDrawing();
  
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };
  
  // Shared values for animations
  const brushButtonScale = useSharedValue(currentTool === 'brush' ? 1.1 : 1);
  const eraserButtonScale = useSharedValue(currentTool === 'eraser' ? 1.1 : 1);
  
  // Handle tool changes
  const handleToolChange = (tool: 'brush' | 'eraser') => {
    triggerHaptic();
    setCurrentTool(tool);
    
    // Animate the buttons
    if (tool === 'brush') {
      brushButtonScale.value = withTiming(1.1, { duration: 200 });
      eraserButtonScale.value = withTiming(1, { duration: 200 });
    } else {
      brushButtonScale.value = withTiming(1, { duration: 200 });
      eraserButtonScale.value = withTiming(1.1, { duration: 200 });
    }
  };
  
  // Handle brush shape changes
  const handleShapeChange = (shape: 'round' | 'square' | 'star') => {
    triggerHaptic();
    setBrushShape(shape);
    
    // If eraser is selected, switch to brush
    if (currentTool === 'eraser') {
      handleToolChange('brush');
    }
  };
  
  // Handle brush size changes
  const handleSizeChange = (increment: boolean) => {
    triggerHaptic();
    const newSize = increment ? 
      Math.min(brushSize + 2, 20) : 
      Math.max(brushSize - 2, 2);
    
    setBrushSize(newSize);
  };
  
  // Animated styles
  const brushButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: brushButtonScale.value }],
      opacity: currentTool === 'brush' ? 1 : 0.7,
    };
  });
  
  const eraserButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: eraserButtonScale.value }],
      opacity: currentTool === 'eraser' ? 1 : 0.7,
    };
  });

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDark ? '#111827' : '#f3f4f6' }
    ]}>
      <View style={styles.toolsRow}>
        <View style={styles.mainTools}>
          <AnimatedPressable
            style={[
              styles.toolButton,
              { backgroundColor: isDark ? '#374151' : '#ffffff' },
              brushButtonStyle,
            ]}
            onPress={() => handleToolChange('brush')}
          >
            <Pencil 
              size={20} 
              color={currentTool === 'brush' ? '#6366f1' : (isDark ? '#9ca3af' : '#6b7280')} 
            />
          </AnimatedPressable>
          
          <AnimatedPressable
            style={[
              styles.toolButton,
              { backgroundColor: isDark ? '#374151' : '#ffffff' },
              eraserButtonStyle,
            ]}
            onPress={() => handleToolChange('eraser')}
          >
            <Eraser 
              size={20} 
              color={currentTool === 'eraser' ? '#6366f1' : (isDark ? '#9ca3af' : '#6b7280')} 
            />
          </AnimatedPressable>
        </View>
        
        <Text style={[
          styles.sectionLabel,
          { color: isDark ? '#d1d5db' : '#4b5563' }
        ]}>
          Tools
        </Text>
      </View>
      
      {/* Brush shapes section - only shown when brush tool is selected */}
      {currentTool === 'brush' && (
        <View style={styles.toolsRow}>
          <View style={styles.shapeTools}>
            <TouchableOpacity
              style={[
                styles.shapeButton,
                { backgroundColor: isDark ? '#374151' : '#ffffff' },
                brushShape === 'round' && styles.activeShapeButton,
              ]}
              onPress={() => handleShapeChange('round')}
            >
              <Circle 
                size={18} 
                color={brushShape === 'round' ? '#6366f1' : (isDark ? '#9ca3af' : '#6b7280')} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.shapeButton,
                { backgroundColor: isDark ? '#374151' : '#ffffff' },
                brushShape === 'square' && styles.activeShapeButton,
              ]}
              onPress={() => handleShapeChange('square')}
            >
              <Square 
                size={18} 
                color={brushShape === 'square' ? '#6366f1' : (isDark ? '#9ca3af' : '#6b7280')} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.shapeButton,
                { backgroundColor: isDark ? '#374151' : '#ffffff' },
                brushShape === 'star' && styles.activeShapeButton,
              ]}
              onPress={() => handleShapeChange('star')}
            >
              <Star 
                size={18} 
                color={brushShape === 'star' ? '#6366f1' : (isDark ? '#9ca3af' : '#6b7280')} 
              />
            </TouchableOpacity>
          </View>
          
          <Text style={[
            styles.sectionLabel,
            { color: isDark ? '#d1d5db' : '#4b5563' }
          ]}>
            Shape
          </Text>
        </View>
      )}
      
      {/* Brush size control */}
      <View style={styles.toolsRow}>
        <View style={styles.sizeControls}>
          <TouchableOpacity
            style={[
              styles.sizeButton,
              { backgroundColor: isDark ? '#374151' : '#ffffff' },
              brushSize <= 2 && { opacity: 0.5 },
            ]}
            onPress={() => handleSizeChange(false)}
            disabled={brushSize <= 2}
          >
            <Minus 
              size={16} 
              color={isDark ? '#d1d5db' : '#4b5563'} 
            />
          </TouchableOpacity>
          
          <View style={[
            styles.sizeIndicator, 
            { borderColor: isDark ? '#4b5563' : '#d1d5db' }
          ]}>
            <View style={[
              styles.sizeDot, 
              { 
                width: brushSize, 
                height: brushSize,
                backgroundColor: currentTool === 'eraser' ? '#d1d5db' : '#6366f1',
              }
            ]} />
          </View>
          
          <TouchableOpacity
            style={[
              styles.sizeButton,
              { backgroundColor: isDark ? '#374151' : '#ffffff' },
              brushSize >= 20 && { opacity: 0.5 },
            ]}
            onPress={() => handleSizeChange(true)}
            disabled={brushSize >= 20}
          >
            <Plus 
              size={16} 
              color={isDark ? '#d1d5db' : '#4b5563'} 
            />
          </TouchableOpacity>
        </View>
        
        <Text style={[
          styles.sectionLabel,
          { color: isDark ? '#d1d5db' : '#4b5563' }
        ]}>
          Size: {brushSize}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  toolsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  mainTools: {
    flexDirection: 'row',
  },
  toolButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  sectionLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  shapeTools: {
    flexDirection: 'row',
  },
  shapeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  activeShapeButton: {
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  sizeControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sizeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  sizeIndicator: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: 'transparent',
  },
  sizeDot: {
    borderRadius: 10,
  },
});

export default ToolPanel;