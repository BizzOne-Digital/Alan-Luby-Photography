import React from 'react';
import { PhotoItem } from '../types';

interface PhotoProps {
  photo: PhotoItem;
  sizes: string;
  /** Above-the-fold image: load eagerly with high priority */
  priority?: boolean;
  /** Crop to the container (uses the photo's focus point); otherwise the full frame is shown */
  cover?: boolean;
  className?: string;
}

export const Photo: React.FC<PhotoProps> = ({ photo, sizes, priority, cover, className = '' }) => (
  <img
    src={photo.src}
    srcSet={photo.srcSet}
    sizes={sizes}
    width={photo.width}
    height={photo.height}
    alt={photo.alt}
    loading={priority ? 'eager' : 'lazy'}
    fetchPriority={priority ? 'high' : undefined}
    decoding="async"
    style={cover ? { objectPosition: photo.focus } : undefined}
    className={`block bg-sand ${cover ? 'h-full w-full object-cover' : 'h-auto w-full'} ${className}`}
  />
);
