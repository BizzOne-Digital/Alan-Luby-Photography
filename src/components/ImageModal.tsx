import React, { useEffect } from 'react';
import { PhotoItem } from '../types';
import { X, ChevronLeft, ChevronRight, MapPin, Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ImageModalProps {
  photo: PhotoItem | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  photo,
  onClose,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!photo) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext && hasNext) onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, onClose, onPrev, onNext, hasPrev, hasNext]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (photo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [photo]);

  if (!photo) return null;

  return (
    <div
      id="photo-lightbox-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]/98 backdrop-blur-md p-4 sm:p-6 md:p-8 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top action controls */}
      <div 
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center h-10 w-10 bg-[#111111] border border-white/20 text-white hover:border-[#E11D48] hover:bg-[#E11D48] transition-colors"
          aria-label="Close image lightbox"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation buttons */}
      {hasPrev && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onPrev) onPrev();
          }}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center h-12 w-12 bg-[#111111] border border-white/20 text-white hover:border-[#E11D48] hover:bg-[#E11D48] transition-colors"
          aria-label="Previous photograph"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {hasNext && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onNext) onNext();
          }}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center h-12 w-12 bg-[#111111] border border-white/20 text-white hover:border-[#E11D48] hover:bg-[#E11D48] transition-colors"
          aria-label="Next photograph"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Modal Content Container */}
      <div
        className="relative max-w-6xl w-full max-h-[90vh] grid grid-cols-1 lg:grid-cols-12 bg-[#0A0A0A] border border-white/15 overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Image Area (8 cols on lg) */}
        <div className="lg:col-span-8 bg-black flex items-center justify-center p-2 sm:p-4 min-h-[300px] max-h-[65vh] lg:max-h-[85vh] relative overflow-hidden">
          <img
            src={photo.imageSrc}
            alt={photo.altText}
            className="max-h-full max-w-full object-contain select-none"
            referrerPolicy="no-referrer"
          />
          {photo.isPlaceholder && (
            <div className="absolute bottom-3 left-3 bg-[#111] border border-white/10 px-2 py-1 text-[9px] font-mono text-white/50 uppercase tracking-widest">
              ARCHIVE // #{photo.id.replace('photo-', '')}
            </div>
          )}
        </div>

        {/* Narrative & Details Area (4 cols on lg) */}
        <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-[#0A0A0A] border-t lg:border-t-0 lg:border-l border-white/10">
          <div className="space-y-6">
            
            {/* Category tag */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.25em] bg-[#E11D48] text-white">
                <Tag className="w-3 h-3" />
                {photo.categoryLabel}
              </span>
            </div>

            {/* Title & Assignment */}
            <div>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold uppercase text-white tracking-[0.02em]">
                {photo.title}
              </h3>
              <p className="text-xs uppercase tracking-widest text-[#E11D48] font-bold mt-1">
                {photo.assignmentType}
              </p>
            </div>

            {/* Story / Narrative */}
            <div className="space-y-2 border-t border-white/10 pt-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                Visual Narrative
              </span>
              <p className="text-sm text-white/70 font-light leading-relaxed">
                {photo.story}
              </p>
            </div>

            {/* Metadata & Location */}
            {photo.location && (
              <div className="flex items-center gap-2 text-xs text-white/50 pt-1 font-mono">
                <MapPin className="w-3.5 h-3.5 text-[#E11D48]" />
                <span>Assignment Setting: <strong className="text-white font-sans">{photo.location}</strong></span>
              </div>
            )}

            {photo.editorialNote && (
              <div className="p-3 bg-[#111111] border border-white/10 text-xs text-white/70 italic font-serif-editorial">
                "{photo.editorialNote}"
              </div>
            )}
          </div>

          {/* Bottom Action */}
          <div className="pt-8 mt-6 border-t border-white/10 space-y-3">
            <Link
              to={`/contact?subject=${encodeURIComponent(`Inquiry regarding ${photo.categoryLabel} - ${photo.title}`)}`}
              onClick={onClose}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#E11D48] hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-widest py-3.5 px-4 rounded-none transition-all"
            >
              <span>INQUIRE ABOUT THIS STYLE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            
            <p className="text-[10px] text-center text-white/40 uppercase tracking-widest font-bold">
              Available for assignments, events, and editorial commissions.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
