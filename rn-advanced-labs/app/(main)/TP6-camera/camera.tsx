/**
 * TP6 - Camera Screen
 * Handles camera preview, capture, and saving photos
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Camera, CameraType, CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useCameraPermission } from '@/lib/hooks/useCameraPermission';
import { savePhoto } from '@/lib/camera/storage';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function CameraScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);

  const { status, isLoading, requestPermission, openSettings } = useCameraPermission();
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    // Request permission when screen loads if not granted
    if (status === 'undetermined') {
      requestPermission();
    }
  }, [status]);

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);

      // Take photo
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });

      if (!photo?.uri) {
        throw new Error('No photo URI returned');
      }

      // Save to storage
      const savedPhoto = await savePhoto(photo.uri);

      console.log('[Camera] Photo saved successfully:', savedPhoto.id);

      // Navigate back to gallery immediately
      // The gallery will auto-refresh thanks to useFocusEffect
      router.back();
    } catch (error) {
      console.error('[Camera] Error capturing photo:', error);
      Alert.alert(
        'Capture Error',
        'Failed to capture and save photo. Please try again.'
      );
      setIsCapturing(false);
    }
  };

  const toggleCameraType = () => {
    setCameraType(current => (current === 'back' ? 'front' : 'back'));
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Checking camera permission...</Text>
      </View>
    );
  }

  // Permission denied
  if (status === 'denied') {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <IconSymbol name="camera.fill" size={80} color="#999" />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            This app needs camera access to take photos. Please enable camera permission in settings.
          </Text>
          <TouchableOpacity style={styles.settingsButton} onPress={openSettings}>
            <Text style={styles.settingsButtonText}>Open Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Permission granted - show camera
  if (status === 'granted') {
    return (
      <View style={styles.container}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={cameraType}
        />

        {/* Header with close button - overlay */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
            disabled={isCapturing}
          >
            <IconSymbol name="xmark" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Controls at bottom - overlay */}
        <View style={styles.controls}>
          {/* Flip camera button */}
          <TouchableOpacity
            style={styles.flipButton}
            onPress={toggleCameraType}
            disabled={isCapturing}
          >
            <IconSymbol name="arrow.triangle.2.circlepath.camera" size={32} color="#fff" />
          </TouchableOpacity>

          {/* Capture button */}
          <TouchableOpacity
            style={[styles.captureButton, isCapturing && styles.captureButtonDisabled]}
            onPress={handleCapture}
            disabled={isCapturing}
          >
            {isCapturing ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <View style={styles.captureButtonInner} />
            )}
          </TouchableOpacity>

          {/* Placeholder for symmetry */}
          <View style={styles.flipButton} />
        </View>
      </View>
    );
  }

  // Requesting permission
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>Requesting camera permission...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#fff',
  },
  permissionContainer: {
    padding: 32,
    alignItems: 'center',
    maxWidth: 400,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  settingsButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  settingsButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
  },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  flipButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
  },
});
