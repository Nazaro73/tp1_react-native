/**
 * TP6 - Photo Storage Hook
 * Stateful wrapper around storage service
 */

import { useState, useCallback } from 'react';
import * as photoStorage from '../camera/storage';
import type { Photo } from '../camera/types';

export interface PhotoStorageState {
  photos: Photo[];
  isLoading: boolean;
  error: string | null;
  refreshPhotos: () => Promise<void>;
  savePhoto: (sourceUri: string) => Promise<Photo | null>;
  deletePhoto: (id: string) => Promise<boolean>;
}

export function usePhotoStorage(): PhotoStorageState {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshPhotos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedPhotos = await photoStorage.listPhotos();
      setPhotos(loadedPhotos);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load photos';
      setError(message);
      console.error('[usePhotoStorage] Error refreshing photos:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const savePhoto = useCallback(async (sourceUri: string): Promise<Photo | null> => {
    try {
      setError(null);
      const photo = await photoStorage.savePhoto(sourceUri);
      // Add to the beginning of the list
      setPhotos(prev => [photo, ...prev]);
      return photo;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save photo';
      setError(message);
      console.error('[usePhotoStorage] Error saving photo:', err);
      return null;
    }
  }, []);

  const deletePhoto = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const success = await photoStorage.deletePhoto(id);
      if (success) {
        setPhotos(prev => prev.filter(photo => photo.id !== id));
      }
      return success;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete photo';
      setError(message);
      console.error('[usePhotoStorage] Error deleting photo:', err);
      return false;
    }
  }, []);

  return {
    photos,
    isLoading,
    error,
    refreshPhotos,
    savePhoto,
    deletePhoto,
  };
}
