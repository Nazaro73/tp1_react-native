/**
 * TP6 - Camera & Gallery Types
 */

export interface Photo {
  id: string;
  uri: string;
  createdAt: number;
  size?: number;
}

export interface PhotoMetadata {
  id: string;
  createdAt: number;
  size: number;
}
