import React, { useEffect } from 'react';
import { PhotoItem } from '../types';
import { X, ChevronLeft, ChevronRight, Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { servicesData } from '../data/services';

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

  const service = servicesData.find((s) => s.categoryKey === photo.category);

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
        className="relative max-w-6xl w-full max-h-[90vh] grid grid-cols-1 lg:grid-cols-12 bg-[#0A0A0A] border border-white/15 overflow-y-auto lg:overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Image Area (8 cols on lg) */}
        <div className="lg:col-span-8 bg-black flex items-center justify-center p-2 sm:p-4 min-h-[300px] max-h-[65vh] lg:max-h-[85vh] relative overflow-hidden">
          <img
            key={photo.id}
            src={photo.imageSrc}
            srcSet={photo.srcSet}
            sizes="(min-width: 1024px) 66vw, 100vw"
            alt={photo.altText}
            className="max-h-[60vh] lg:max-h-[80vh] max-w-full object-contain select-none"
          />
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

            <div>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold uppercase text-white tracking-[0.02em]">
                {photo.title}
              </h3>
              <p className="text-sm text-white/70 font-light leading-relaxed mt-3">
                {photo.description}
              </p>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="pt-8 mt-6 border-t border-white/10 space-y-3">
            <Link
              to={`/contact?${new URLSearchParams({
                ...(service ? { service: service.inquiryValue } : {}),
                subject: `${photo.categoryLabel} photography (like "${photo.title}")`,
              })}`}
              onClick={onClose}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#E11D48] hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-widest py-3.5 px-4 rounded-none transition-all"
            >
              <span>INQUIRE ABOUT {photo.categoryLabel.toUpperCase()}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            
            <p className="text-[10px] text-center text-white/40 uppercase tracking-widest font-bold">
              Photograph by Alan Luby
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
