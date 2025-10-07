/**
 * TP6 - Gallery Screen
 * Displays grid of captured photos with navigation to camera and detail
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { usePhotoStorage } from '@/lib/hooks/usePhotoStorage';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { Photo } from '@/lib/camera/types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const COLUMNS = 3;
const SPACING = 4;
const ITEM_SIZE = (SCREEN_WIDTH - SPACING * (COLUMNS + 1)) / COLUMNS;

export default function GalleryScreen() {
  const router = useRouter();
  const { photos, isLoading, error, refreshPhotos } = usePhotoStorage();
  const [refreshing, setRefreshing] = useState(false);

  // Rafraîchir les photos à chaque fois que l'écran devient visible
  useFocusEffect(
    useCallback(() => {
      console.log('[Gallery] Screen focused - refreshing photos');
      refreshPhotos();
    }, [refreshPhotos])
  );

  const loadPhotos = async () => {
    await refreshPhotos();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshPhotos();
    setRefreshing(false);
  };

  const handlePhotoPress = (photo: Photo) => {
    router.push(`/TP6-camera/detail/${photo.id}`);
  };

  const handleCameraPress = () => {
    router.push('/TP6-camera/camera');
  };

  const renderPhotoItem = ({ item }: { item: Photo }) => (
    <TouchableOpacity
      style={styles.photoItem}
      onPress={() => handlePhotoPress(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.uri }}
        style={styles.photoImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.emptyText}>Loading photos...</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <IconSymbol name="photo.on.rectangle.angled" size={80} color="#ccc" />
        <Text style={styles.emptyTitle}>No Photos Yet</Text>
        <Text style={styles.emptyText}>
          Tap the camera button to capture your first photo
        </Text>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Gallery</Text>
      <Text style={styles.subtitle}>
        {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={photos}
        renderItem={renderPhotoItem}
        keyExtractor={(item) => item.id}
        numColumns={COLUMNS}
        contentContainerStyle={[
          styles.gridContainer,
          photos.length === 0 && styles.gridContainerEmpty,
        ]}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={renderEmptyState()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#007AFF"
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button - Camera */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleCameraPress}
        activeOpacity={0.8}
      >
        <IconSymbol name="camera.fill" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  errorBanner: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ef5350',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
  },
  gridContainer: {
    padding: SPACING,
  },
  gridContainerEmpty: {
    flex: 1,
  },
  row: {
    justifyContent: 'flex-start',
  },
  photoItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: SPACING / 2,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 24,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
