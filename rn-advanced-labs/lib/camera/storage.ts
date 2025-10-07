/**
 * TP6 - Photo Storage Service
 * Handles all local file system operations for photos
 * Uses the modern expo-file-system API (v54+)
 */

import { File, Directory, Paths } from 'expo-file-system';
import type { Photo, PhotoMetadata } from './types';

const PHOTOS_DIR_NAME = 'photos';

/**
 * Get the photos directory instance
 */
function getPhotosDirectory(): Directory {
  return new Directory(Paths.document, PHOTOS_DIR_NAME);
}

/**
 * Ensure the photos directory exists
 */
export async function ensureDir(): Promise<void> {
  try {
    const photosDir = getPhotosDirectory();

    if (!photosDir.exists) {
      await photosDir.create();
      console.log('[Storage] Photos directory created');
    }
  } catch (error) {
    console.error('[Storage] Error ensuring directory:', error);
    throw new Error('Failed to create photos directory');
  }
}

/**
 * Save a photo to local storage
 * @param sourceUri - Temporary URI from camera capture
 * @returns Photo object with id, uri, metadata
 */
export async function savePhoto(sourceUri: string): Promise<Photo> {
  try {
    await ensureDir();

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const filename = `photo_${timestamp}.jpg`;

    // Create source file from URI
    const sourceFile = new File(sourceUri);

    // Create destination file in photos directory
    const destinationFile = new File(Paths.document, `${PHOTOS_DIR_NAME}/${filename}`);

    // Copy from temp location to permanent storage
    await sourceFile.copy(destinationFile);

    const photo: Photo = {
      id: `photo_${timestamp}`,
      uri: destinationFile.uri,
      createdAt: timestamp,
      size: destinationFile.size || 0,
    };

    console.log('[Storage] Photo saved:', photo.id);
    return photo;
  } catch (error) {
    console.error('[Storage] Error saving photo:', error);
    throw new Error('Failed to save photo');
  }
}

/**
 * List all photos from storage
 * @returns Array of Photo objects sorted by creation date (newest first)
 */
export async function listPhotos(): Promise<Photo[]> {
  try {
    await ensureDir();

    const photosDir = getPhotosDirectory();
    const items = await photosDir.list();

    // Filter and process only image files
    const photos: Photo[] = items
      .filter((item): item is File => {
        if (item instanceof File) {
          const filename = item.name;
          return filename.endsWith('.jpg') || filename.endsWith('.jpeg') || filename.endsWith('.png');
        }
        return false;
      })
      .map((file) => {
        const filename = file.name;

        // Extract timestamp from filename (photo_<timestamp>.jpg)
        const timestampMatch = filename.match(/photo_(\d+)/);
        const createdAt = timestampMatch ? parseInt(timestampMatch[1], 10) : 0;

        return {
          id: filename.replace(/\.(jpg|jpeg|png)$/, ''),
          uri: file.uri,
          createdAt,
          size: file.size || 0,
        };
      });

    // Sort by creation date (newest first)
    return photos.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('[Storage] Error listing photos:', error);
    throw new Error('Failed to list photos');
  }
}

/**
 * Get a single photo by ID
 * @param id - Photo ID (filename without extension)
 * @returns Photo object or null if not found
 */
export async function getPhoto(id: string): Promise<Photo | null> {
  try {
    const filename = `${id}.jpg`;
    const file = new File(Paths.document, `${PHOTOS_DIR_NAME}/${filename}`);

    if (!file.exists) {
      return null;
    }

    // Extract timestamp from ID
    const timestampMatch = id.match(/photo_(\d+)/);
    const createdAt = timestampMatch ? parseInt(timestampMatch[1], 10) : 0;

    return {
      id,
      uri: file.uri,
      createdAt,
      size: file.size || 0,
    };
  } catch (error) {
    console.error('[Storage] Error getting photo:', error);
    return null;
  }
}

/**
 * Delete a photo by ID
 * @param id - Photo ID (filename without extension)
 * @returns true if deleted successfully
 */
export async function deletePhoto(id: string): Promise<boolean> {
  try {
    const filename = `${id}.jpg`;
    const file = new File(Paths.document, `${PHOTOS_DIR_NAME}/${filename}`);

    if (file.exists) {
      await file.delete();
      console.log('[Storage] Photo deleted:', id);
      return true;
    }

    return false;
  } catch (error) {
    console.error('[Storage] Error deleting photo:', error);
    throw new Error('Failed to delete photo');
  }
}

/**
 * Get the photos directory path (for debugging)
 */
export function getPhotosDirectoryPath(): string {
  return getPhotosDirectory().uri;
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round(bytes / Math.pow(k, i) * 100) / 100} ${sizes[i]}`;
}

/**
 * Format date in human-readable format
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString();
}
