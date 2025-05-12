import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  useColorScheme,
  Alert,
  Platform,
  Modal,
  Pressable,
} from 'react-native';
import {
  Undo2,
  Redo2,
  Save,
  Trash2,
} from 'lucide-react-native';
import { useDrawing } from '@/context/DrawingContext';
import * as Haptics from 'expo-haptics';

const DrawingHeader = () => {
  const {
    undo,
    redo,
    undoStack,
    redoStack,
    clearCanvas,
    paths,
  } = useDrawing();
  
  const [confirmClearVisible, setConfirmClearVisible] = useState(false);
  
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };
  
  const handleUndo = () => {
    if (undoStack.length > 0) {
      triggerHaptic();
      undo();
    }
  };
  
  const handleRedo = () => {
    if (redoStack.length > 0) {
      triggerHaptic();
      redo();
    }
  };
  
  const handleSave = () => {
    if (paths.length === 0) {
      Alert.alert('Nothing to Save', 'Draw something before saving!');
      return;
    }
    
    triggerHaptic();
    
    // In a real app, we would save the drawing here
    Alert.alert('Drawing Saved', 'Your artwork was saved successfully!');
  };
  
  const handleClear = () => {
    if (paths.length === 0) {
      return;
    }
    
    if (Platform.OS !== 'web') {
      // Show confirmation dialog on native platforms
      setConfirmClearVisible(true);
    } else {
      // Use default browser confirm on web
      if (window.confirm('Are you sure you want to clear the canvas?')) {
        triggerHaptic();
        clearCanvas();
      }
    }
  };
  
  const confirmClear = () => {
    triggerHaptic();
    clearCanvas();
    setConfirmClearVisible(false);
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDark ? '#1f2937' : '#ffffff' }
    ]}>
      <Text style={[
        styles.title,
        { color: isDark ? '#f9fafb' : '#111827' }
      ]}>
        Coloring Board
      </Text>
      
      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            undoStack.length === 0 && styles.disabledButton,
          ]}
          onPress={handleUndo}
          disabled={undoStack.length === 0}
        >
          <Undo2 
            size={20} 
            color={undoStack.length === 0 ? 
              (isDark ? '#4b5563' : '#d1d5db') : 
              (isDark ? '#e5e7eb' : '#374151')
            } 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.actionButton,
            redoStack.length === 0 && styles.disabledButton,
          ]}
          onPress={handleRedo}
          disabled={redoStack.length === 0}
        >
          <Redo2 
            size={20} 
            color={redoStack.length === 0 ? 
              (isDark ? '#4b5563' : '#d1d5db') : 
              (isDark ? '#e5e7eb' : '#374151')
            } 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleSave}
        >
          <Save 
            size={20} 
            color={isDark ? '#e5e7eb' : '#374151'} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.actionButton,
            paths.length === 0 && styles.disabledButton,
          ]}
          onPress={handleClear}
          disabled={paths.length === 0}
        >
          <Trash2 
            size={20} 
            color={paths.length === 0 ? 
              (isDark ? '#4b5563' : '#d1d5db') : 
              '#ef4444'
            } 
          />
        </TouchableOpacity>
      </View>
      
      {/* Confirmation Modal for Clear Canvas */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmClearVisible}
        onRequestClose={() => setConfirmClearVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[
            styles.modalContent,
            { backgroundColor: isDark ? '#1f2937' : '#ffffff' }
          ]}>
            <Text style={[
              styles.modalTitle,
              { color: isDark ? '#f9fafb' : '#111827' }
            ]}>
              Clear Canvas?
            </Text>
            
            <Text style={[
              styles.modalMessage,
              { color: isDark ? '#d1d5db' : '#4b5563' }
            ]}>
              This will erase all your current drawing. This action cannot be undone.
            </Text>
            
            <View style={styles.modalButtons}>
              <Pressable
                style={[
                  styles.modalButton,
                  { backgroundColor: isDark ? '#374151' : '#f3f4f6' }
                ]}
                onPress={() => setConfirmClearVisible(false)}
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
                  styles.clearButton,
                ]}
                onPress={confirmClear}
              >
                <Text style={styles.buttonText}>
                  Clear
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.5,
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
    marginBottom: 12,
  },
  modalMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  clearButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#ffffff',
  },
});

export default DrawingHeader;