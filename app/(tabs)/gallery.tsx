import { View, Text, StyleSheet, SafeAreaView, Platform, FlatList, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { Trash2, Download } from 'lucide-react-native';
import { useState } from 'react';

// Mock data for gallery items
const MOCK_DRAWINGS = [
  { id: '1', thumbnail: 'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg', title: 'Mountain Landscape' },
  { id: '2', thumbnail: 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg', title: 'Abstract Art' },
  { id: '3', thumbnail: 'https://images.pexels.com/photos/1209843/pexels-photo-1209843.jpeg', title: 'Ocean Sunset' },
];

export default function GalleryScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [drawings, setDrawings] = useState(MOCK_DRAWINGS);
  
  const deleteDrawing = (id: string) => {
    setDrawings(drawings.filter(drawing => drawing.id !== id));
  };
  
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
          My Artwork
        </Text>
      </View>
      
      <FlatList
        data={drawings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.gridContainer}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={[
            styles.artworkCard,
            { backgroundColor: isDark ? '#1f2937' : '#ffffff' }
          ]}>
            <Image 
              source={{ uri: item.thumbnail }} 
              style={styles.thumbnail}
            />
            <View style={styles.cardFooter}>
              <Text style={[
                styles.artworkTitle,
                { color: isDark ? '#e5e7eb' : '#1f2937' }
              ]}>
                {item.title}
              </Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.actionButton} 
                  onPress={() => console.log('Download', item.id)}>
                  <Download size={18} color={isDark ? '#9ca3af' : '#6b7280'} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton} 
                  onPress={() => deleteDrawing(item.id)}>
                  <Trash2 size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[
              styles.emptyStateText,
              { color: isDark ? '#9ca3af' : '#6b7280' }
            ]}>
              No artwork saved yet. Start drawing to see your creations here.
            </Text>
          </View>
        }
      />
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
  gridContainer: {
    padding: 8,
  },
  artworkCard: {
    flex: 1,
    margin: 8,
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
  thumbnail: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  cardFooter: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  artworkTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 6,
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    height: 300,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});