import React from 'react';
import { PhotoItem } from '../types';

/** Full-bleed photographic header background shared by the inner pages. */
export const PageHeroImage: React.FC<{ photo: PhotoItem }> = ({ photo }) => (
  <div className="absolute inset-0 -top-28 -z-10 overflow-hidden" aria-hidden="true">
    <img
      src={photo.imageSrc}
      srcSet={photo.srcSet}
      sizes="100vw"
      alt=""
      style={{ objectPosition: photo.focus }}
      className="w-full h-full object-cover"
      loading="eager"
      fetchPriority="high"
      decoding="async"
    />
    {/* Bottom fade into the page and a left scrim for the left-aligned heading; the right side stays clear */}
    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent" />
    <div className="absolute inset-0
      bg-[linear-gradient(to_right,rgba(5,5,5,0.85)_0%,rgba(5,5,5,0.7)_100%)]
      md:bg-[linear-gradient(to_right,rgba(5,5,5,0.9)_0%,rgba(5,5,5,0.65)_45%,rgba(5,5,5,0.1)_80%,transparent_100%)]" />
  </div>
);
