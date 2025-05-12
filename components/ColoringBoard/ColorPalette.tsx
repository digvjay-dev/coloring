import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  useColorScheme,
  Modal,
  Pressable,
} from 'react-native';
import { useDrawing } from '@/context/DrawingContext';
import { Palette, Plus } from 'lucide-react-native';
import { ColorPicker, fromHsv } from 'react-native-color-picker';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

const ColorPalette = () => {
  const {
    colorPalette,
    selectedColor,
    setSelectedColor,
    addCustomColor,
    currentTool,
  } = useDrawing();
  
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [customColor, setCustomColor] = useState('#ffffff');
  
  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };
  
  const handleColorSelect = (color: string) => {
    triggerHaptic();
    setSelectedColor(color);
  };
  
  const handleAddColor = () => {
    setColorPickerVisible(true);
  };
  
  const saveCustomColor = () => {
    triggerHaptic();
    addCustomColor(customColor);
    setSelectedColor(customColor);
    setColorPickerVisible(false);
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDark ? '#111827' : '#f3f4f6' }
    ]}>
      <View style={styles.header}>
        <Palette size={18} color={isDark ? '#d1d5db' : '#4b5563'} />
        <Text style={[
          styles.title,
          { color: isDark ? '#e5e7eb' : '#1f2937' }
        ]}>
          Colors
        </Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.colorScroll}
      >
        {/* Color palette */}
        {colorPalette.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.colorButton,
              { backgroundColor: item.color },
              selectedColor === item.color && styles.selectedColor,
              // If current tool is eraser, don't highlight any color
              currentTool === 'eraser' && styles.disabledColor,
            ]}
            onPress={() => handleColorSelect(item.color)}
            activeOpacity={0.7}
          >
            {item.color === '#ffffff' && (
              <View style={styles.whiteColorBorder} />
            )}
          </TouchableOpacity>
        ))}
        
        {/* Add custom color button */}
        <TouchableOpacity
          style={[
            styles.addColorButton,
            { backgroundColor: isDark ? '#4b5563' : '#ffffff' }
          ]}
          onPress={handleAddColor}
          activeOpacity={0.7}
        >
          <Plus size={18} color={isDark ? '#e5e7eb' : '#6b7280'} />
        </TouchableOpacity>
      </ScrollView>
      
      {/* Color picker modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={colorPickerVisible}
        onRequestClose={() => setColorPickerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[
            styles.modalContent,
            { backgroundColor: isDark ? '#1f2937' : '#ffffff' }
          ]}>
            <Text style={[
              styles.modalTitle,
              { color: isDark ? '#e5e7eb' : '#1f2937' }
            ]}>
              Select Custom Color
            </Text>
            
            <View style={styles.colorPickerContainer}>
              <ColorPicker
                onColorChange={(color) => setCustomColor(fromHsv(color))}
                style={{ flex: 1 }}
                hideSliders={false}
              />
            </View>
            
            <View style={styles.colorPreview}>
              <View 
                style={[
                  styles.selectedColorPreview, 
                  { backgroundColor: customColor }
                ]} 
              />
              <Text style={[
                styles.colorHexText,
                { color: isDark ? '#e5e7eb' : '#1f2937' }
              ]}>
                {customColor}
              </Text>
            </View>
            
            <View style={styles.modalButtons}>
              <Pressable
                style={[
                  styles.modalButton,
                  { backgroundColor: isDark ? '#374151' : '#f3f4f6' }
                ]}
                onPress={() => setColorPickerVisible(false)}
              >
                <Text style={[
                  styles.buttonText,
                  { color: isDark ? '#e5e7eb' : '#1f2937' }
                ]}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modalButton,
                  styles.saveButton,
                ]}
                onPress={saveCustomColor}
              >
                <Text style={styles.buttonText}>
                  Add Color
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 6,
  },
  colorScroll: {
    paddingRight: 12,
  },
  colorButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
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
  addColorButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 16,
  },
  colorPickerContainer: {
    height: 220,
    width: '100%',
  },
  colorPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  selectedColorPreview: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  colorHexText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  saveButton: {
    backgroundColor: '#6366f1',
  },
  buttonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#ffffff',
  },
});

export default ColorPalette;