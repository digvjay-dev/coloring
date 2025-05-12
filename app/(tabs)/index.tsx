import { View, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import ColoringBoard from '@/components/ColoringBoard';
import { DrawingProvider } from '@/context/DrawingContext';

export default function CanvasScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <SafeAreaView style={[
      styles.container, 
      { backgroundColor: isDark ? '#111827' : '#f9fafb' }
    ]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <DrawingProvider>
        <ColoringBoard />
      </DrawingProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});