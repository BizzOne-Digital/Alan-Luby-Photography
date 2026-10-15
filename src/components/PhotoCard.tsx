import React, { useState } from 'react';
import { PhotoItem } from '../types';
import { Maximize2, Tag } from 'lucide-react';

interface PhotoCardProps {
  photo: PhotoItem;
  onSelect: (photo: PhotoItem) => void;
  aspectClass?: string;
  showCaption?: boolean;
  /** `sizes` hint for responsive loading; defaults to the 3-column portfolio grid */
  sizes?: string;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  onSelect,
  aspectClass = '',
  showCaption = true,
  sizes = '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw',
}) => {
  const [loaded, setLoaded] = useState(false);

  // Default crop follows the photo's own orientation so little of the frame is lost
  const computedAspect = aspectClass || (photo.aspectRatio === 'portrait' ? 'aspect-[4/5]' : 'aspect-[3/2]');

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
            <span className="text-[10px] text-white/30 font-mono tracking-widest uppercase">LOADING...</span>
          </div>
        )}
        
        <img
          src={photo.imageSrc}
          srcSet={photo.srcSet}
          sizes={sizes}
          alt={photo.altText}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          style={{ objectPosition: photo.focus }}
          className={`w-full h-full object-cover transition-all duration-700 will-change-transform group-hover:scale-[1.03] ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Viewfinder corner accents on hover */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="absolute top-3 left-3 h-3 w-3 border-t-2 border-l-2 border-[#E11D48]" />
          <span className="absolute top-3 right-3 h-3 w-3 border-t-2 border-r-2 border-[#E11D48]" />
          <span className="absolute bottom-3 left-3 h-3 w-3 border-b-2 border-l-2 border-[#E11D48]" />
          <span className="absolute bottom-3 right-3 h-3 w-3 border-b-2 border-r-2 border-[#E11D48]" />
        </div>

        {/* Editorial overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
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
            <p className="text-xs text-white/70 line-clamp-2 mt-0.5 font-light">
              {photo.description}
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
        </div>
      )}
    </article>
  );
};
