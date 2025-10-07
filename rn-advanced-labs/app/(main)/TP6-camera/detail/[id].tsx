/**
 * TP6 - Photo Detail Screen
 * Displays full-screen photo with metadata and actions (delete, share)
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Share,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getPhoto, deletePhoto, formatFileSize, formatDate } from '@/lib/camera/storage';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { Photo } from '@/lib/camera/types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function PhotoDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [photo, setPhoto] = useState<Photo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadPhoto();
  }, [id]);

  const loadPhoto = async () => {
    try {
      setIsLoading(true);
      if (!id) {
        Alert.alert('Error', 'No photo ID provided');
        router.back();
        return;
      }

      const loadedPhoto = await getPhoto(id);
      if (!loadedPhoto) {
        Alert.alert('Error', 'Photo not found', [
          { text: 'OK', onPress: () => router.back() },
        ]);
        return;
      }

      setPhoto(loadedPhoto);
    } catch (error) {
      console.error('[PhotoDetail] Error loading photo:', error);
      Alert.alert('Error', 'Failed to load photo', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: confirmDelete,
        },
      ]
    );
  };

  const confirmDelete = async () => {
    if (!id) return;

    try {
      setIsDeleting(true);
      const success = await deletePhoto(id);

      if (success) {
        Alert.alert('Success', 'Photo deleted successfully', [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back to gallery
              router.back();
            },
          },
        ]);
      } else {
        Alert.alert('Error', 'Failed to delete photo');
      }
    } catch (error) {
      console.error('[PhotoDetail] Error deleting photo:', error);
      Alert.alert('Error', 'Failed to delete photo');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = async () => {
    if (!photo) return;

    try {
      const result = await Share.share({
        message: `Photo taken on ${formatDate(photo.createdAt)}`,
        url: photo.uri,
      });

      if (result.action === Share.sharedAction) {
        console.log('[PhotoDetail] Photo shared successfully');
      }
    } catch (error) {
      console.error('[PhotoDetail] Error sharing photo:', error);
      Alert.alert('Error', 'Failed to share photo');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading photo...</Text>
      </View>
    );
  }

  if (!photo) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Photo not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
          disabled={isDeleting}
        >
          <IconSymbol name="chevron.left" size={24} color="#007AFF" />
          <Text style={styles.headerButtonText}>Gallery</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: photo.uri }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Metadata */}
        <View style={styles.metadataContainer}>
          <Text style={styles.sectionTitle}>Photo Information</Text>

          <View style={styles.metadataRow}>
            <IconSymbol name="calendar" size={20} color="#666" />
            <View style={styles.metadataContent}>
              <Text style={styles.metadataLabel}>Date & Time</Text>
              <Text style={styles.metadataValue}>{formatDate(photo.createdAt)}</Text>
            </View>
          </View>

          <View style={styles.metadataRow}>
            <IconSymbol name="doc" size={20} color="#666" />
            <View style={styles.metadataContent}>
              <Text style={styles.metadataLabel}>File Size</Text>
              <Text style={styles.metadataValue}>
                {photo.size ? formatFileSize(photo.size) : 'Unknown'}
              </Text>
            </View>
          </View>

          <View style={styles.metadataRow}>
            <IconSymbol name="number" size={20} color="#666" />
            <View style={styles.metadataContent}>
              <Text style={styles.metadataLabel}>Photo ID</Text>
              <Text style={styles.metadataValue}>{photo.id}</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton]}
            onPress={handleShare}
            disabled={isDeleting}
          >
            <IconSymbol name="square.and.arrow.up" size={24} color="#007AFF" />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton, isDeleting && styles.buttonDisabled]}
            onPress={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <IconSymbol name="trash.fill" size={24} color="#fff" />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButtonText: {
    fontSize: 17,
    color: '#007AFF',
    marginLeft: 4,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  metadataContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  metadataContent: {
    flex: 1,
    marginLeft: 12,
  },
  metadataLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  metadataValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  shareButton: {
    backgroundColor: '#E3F2FD',
  },
  shareButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#EF5350',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
