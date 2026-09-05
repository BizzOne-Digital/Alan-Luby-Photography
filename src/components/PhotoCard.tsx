import React, { useState } from 'react';
import { PhotoItem } from '../types';
import { Maximize2, Tag } from 'lucide-react';

interface PhotoCardProps {
  photo: PhotoItem;
  onSelect: (photo: PhotoItem) => void;
  aspectClass?: string;
  showCaption?: boolean;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  onSelect,
  aspectClass = '',
  showCaption = true,
}) => {
  const [loaded, setLoaded] = useState(false);

  // Determine aspect ratio class if not provided
  let computedAspect = aspectClass;
  if (!computedAspect) {
    switch (photo.aspectRatio) {
      case 'portrait':
        computedAspect = 'aspect-[3/4] sm:aspect-[4/5]';
        break;
      case 'tall':
        computedAspect = 'aspect-[2/3]';
        break;
      case 'landscape':
        computedAspect = 'aspect-[16/10] sm:aspect-[3/2]';
        break;
      case 'wide':
        computedAspect = 'aspect-[16/9] sm:aspect-[21/9]';
        break;
      case 'square':
        computedAspect = 'aspect-square';
        break;
      default:
        computedAspect = 'aspect-[4/3]';
    }
  }

  return (
    <article
      id={`photo-card-${photo.id}`}
      onClick={() => onSelect(photo)}
      className="group relative cursor-pointer overflow-hidden bg-[#0A0A0A] border border-white/10 transition-all duration-300 hover:border-[#E11D48] select-none"
    >
      {/* Image Container with loading placeholder */}
      <div className={`relative w-full ${computedAspect} overflow-hidden bg-[#111111]`}>
        {!loaded && (
          <div className="absolute inset-0 bg-[#111] animate-pulse flex items-center justify-center">
            <span className="text-[10px] text-white/30 font-mono tracking-widest uppercase">LOADING FRAME...</span>
          </div>
        )}
        
        <img
          src={photo.imageSrc}
          alt={photo.altText}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 will-change-transform group-hover:scale-105 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          referrerPolicy="no-referrer"
        />

        {/* Viewfinder corner accents on hover */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="absolute top-3 left-3 h-3 w-3 border-t-2 border-l-2 border-[#E11D48]" />
          <span className="absolute top-3 right-3 h-3 w-3 border-t-2 border-r-2 border-[#E11D48]" />
          <span className="absolute bottom-3 left-3 h-3 w-3 border-b-2 border-l-2 border-[#E11D48]" />
          <span className="absolute bottom-3 right-3 h-3 w-3 border-b-2 border-r-2 border-[#E11D48]" />
        </div>

        {/* Editorial overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
          <div className="flex justify-between items-start">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest bg-[#E11D48] text-white">
              <Tag className="w-2.5 h-2.5" />
              {photo.categoryLabel}
            </span>
            <div className="h-8 w-8 bg-black/80 border border-white/20 text-white flex items-center justify-center shadow-lg">
              <Maximize2 className="w-3.5 h-3.5 text-white/80 group-hover:text-[#E11D48]" />
            </div>
          </div>

          <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E11D48] block mb-1">
              {photo.categoryLabel}
            </span>
            <h4 className="font-display text-lg font-semibold uppercase text-white leading-tight tracking-[0.02em]">
              {photo.title}
            </h4>
            <p className="text-xs text-white/60 line-clamp-1 mt-0.5 font-light">
              {photo.assignmentType}
            </p>
          </div>
        </div>
      </div>

      {/* Sub-caption bar */}
      {showCaption && (
        <div className="p-3.5 bg-[#0A0A0A] border-t border-white/10 flex items-center justify-between">
          <div className="truncate pr-2">
            <p className="text-xs font-bold uppercase tracking-wide text-white truncate group-hover:text-[#E11D48] transition-colors">
              {photo.title}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-white/40 truncate">
              {photo.categoryLabel}
            </p>
          </div>
          <span className="shrink-0 text-[9px] font-mono text-white/40 uppercase tracking-widest">
            {photo.location ? photo.location.split(' ')[0] : 'ARCHIVE'}
          </span>
        </div>
      )}
    </article>
  );
};
