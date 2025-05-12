import { View, Text, StyleSheet, SafeAreaView, Platform, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { Moon, Sun, Brush, CircleHelp as HelpCircle, Info, Star, PaintBucket } from 'lucide-react-native';
import { useState } from 'react';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // These would be connected to real state management in a full implementation
  const [autoSave, setAutoSave] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  
  return (
    <SafeAreaView style={[
      styles.container, 
      { backgroundColor: isDark ? '#111827' : '#f9fafb' }
    ]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={styles.header}>
        <Text style={[
          styles.headerTitle, 
          { color: isDark ? '#f9fafb' : '#111827' }
        ]}>
          Settings
        </Text>
      </View>
      
      <ScrollView>
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: isDark ? '#e5e7eb' : '#1f2937' }
          ]}>
            Appearance
          </Text>
          
          <View style={[
            styles.settingCard, 
            { backgroundColor: isDark ? '#1f2937' : '#ffffff' }
          ]}>
            <View style={styles.settingRow}>
              <View style={styles.settingIconContainer}>
                {isDark ? 
                  <Moon size={20} color="#9ca3af" /> : 
                  <Sun size={20} color="#f59e0b" />
                }
              </View>
              <Text style={[
                styles.settingText,
                { color: isDark ? '#e5e7eb' : '#1f2937' }
              ]}>
                Dark Mode
              </Text>
              <Text style={[
                styles.settingValue,
                { color: isDark ? '#9ca3af' : '#6b7280' }
              ]}>
                System
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: isDark ? '#e5e7eb' : '#1f2937' }
          ]}>
            Canvas
          </Text>
          
          <View style={[
            styles.settingCard, 
            { backgroundColor: isDark ? '#1f2937' : '#ffffff' }
          ]}>
            <View style={styles.settingRow}>
              <View style={styles.settingIconContainer}>
                <Brush size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
              </View>
              <Text style={[
                styles.settingText,
                { color: isDark ? '#e5e7eb' : '#1f2937' }
              ]}>
                Auto-save drawings
              </Text>
              <Switch
                value={autoSave}
                onValueChange={setAutoSave}
                trackColor={{ false: '#d1d5db', true: '#6366f1' }}
                thumbColor={autoSave ? '#ffffff' : '#f9fafb'}
              />
            </View>
            
            <View style={styles.settingRow}>
              <View style={styles.settingIconContainer}>
                <PaintBucket size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
              </View>
              <Text style={[
                styles.settingText,
                { color: isDark ? '#e5e7eb' : '#1f2937' }
              ]}>
                Show grid
              </Text>
              <Switch
                value={showGrid}
                onValueChange={setShowGrid}
                trackColor={{ false: '#d1d5db', true: '#6366f1' }}
                thumbColor={showGrid ? '#ffffff' : '#f9fafb'}
              />
            </View>
            
            <View style={styles.settingRow}>
              <View style={styles.settingIconContainer}>
                <Star size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
              </View>
              <Text style={[
                styles.settingText,
                { color: isDark ? '#e5e7eb' : '#1f2937' }
              ]}>
                Haptic feedback
              </Text>
              <Switch
                value={hapticFeedback}
                onValueChange={setHapticFeedback}
                trackColor={{ false: '#d1d5db', true: '#6366f1' }}
                thumbColor={hapticFeedback ? '#ffffff' : '#f9fafb'}
              />
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: isDark ? '#e5e7eb' : '#1f2937' }
          ]}>
            About
          </Text>
          
          <View style={[
            styles.settingCard, 
            { backgroundColor: isDark ? '#1f2937' : '#ffffff' }
          ]}>
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingIconContainer}>
                <Info size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
              </View>
              <Text style={[
                styles.settingText,
                { color: isDark ? '#e5e7eb' : '#1f2937' }
              ]}>
                Version
              </Text>
              <Text style={[
                styles.settingValue,
                { color: isDark ? '#9ca3af' : '#6b7280' }
              ]}>
                1.0.0
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingIconContainer}>
                <HelpCircle size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
              </View>
              <Text style={[
                styles.settingText,
                { color: isDark ? '#e5e7eb' : '#1f2937' }
              ]}>
                Help & Feedback
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    padding: 16,
    marginBottom: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 8,
  },
  settingCard: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  settingIconContainer: {
    marginRight: 12,
  },
  settingText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  settingValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
});