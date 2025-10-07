/**
 * TP6 - Camera Permission Hook
 * Manages camera permissions with clear UI states
 */

import { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import { Alert, Linking, Platform } from 'react-native';

export type PermissionStatus = 'undetermined' | 'granted' | 'denied';

export interface CameraPermissionState {
  status: PermissionStatus;
  isLoading: boolean;
  requestPermission: () => Promise<boolean>;
  openSettings: () => void;
}

export function useCameraPermission(): CameraPermissionState {
  const [status, setStatus] = useState<PermissionStatus>('undetermined');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    try {
      setIsLoading(true);
      const { status: permissionStatus } = await Camera.getCameraPermissionsAsync();
      setStatus(mapPermissionStatus(permissionStatus));
    } catch (error) {
      console.error('[useCameraPermission] Error checking permission:', error);
      setStatus('undetermined');
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { status: permissionStatus } = await Camera.requestCameraPermissionsAsync();
      const mappedStatus = mapPermissionStatus(permissionStatus);
      setStatus(mappedStatus);

      if (mappedStatus === 'denied') {
        showPermissionDeniedAlert();
        return false;
      }

      return mappedStatus === 'granted';
    } catch (error) {
      console.error('[useCameraPermission] Error requesting permission:', error);
      Alert.alert(
        'Permission Error',
        'Failed to request camera permission. Please try again.'
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const openSettings = () => {
    Linking.openSettings().catch(() => {
      Alert.alert(
        'Settings Error',
        'Unable to open settings. Please open settings manually.'
      );
    });
  };

  const showPermissionDeniedAlert = () => {
    Alert.alert(
      'Camera Permission Required',
      'This app needs camera access to take photos. Please enable camera permission in settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: openSettings },
      ]
    );
  };

  return {
    status,
    isLoading,
    requestPermission,
    openSettings,
  };
}

function mapPermissionStatus(status: string): PermissionStatus {
  if (status === 'granted') return 'granted';
  if (status === 'denied') return 'denied';
  return 'undetermined';
}
