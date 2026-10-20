import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { PhotoItem } from '../types';
import { categoryLabels } from '../data/photography';
import { inquiryHref, serviceById } from '../data/services';

interface LightboxProps {
  photos: PhotoItem[];
  index: number | null;
  onChange: (index: number | null) => void;
}

const iconBtn =
  'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20';

/** Native modal <dialog>: focus containment, Escape and inert background come from the platform. */
export const Lightbox: React.FC<LightboxProps> = ({ photos, index, onChange }) => {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const open = index !== null;
  const photo = open ? photos[index] : null;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      opener.current = document.activeElement as HTMLElement;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const step = (delta: number) => index !== null && onChange((index + delta + photos.length) % photos.length);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  };

  return (
    <dialog
      ref={ref}
      aria-label={photo ? photo.title : 'Photograph'}
      onClose={() => {
        onChange(null);
        opener.current?.focus();
      }}
      onKeyDown={onKeyDown}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-[#141513] p-0 text-white backdrop:bg-black/80"
    >
      {photo && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <p className="text-sm text-white/75" aria-live="polite">
              {index! + 1} of {photos.length}
            </p>
            <button type="button" className={iconBtn} onClick={() => ref.current?.close()} aria-label="Close">
              <X className="h-6 w-6" aria-hidden />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 items-center gap-2 px-2 sm:gap-4 sm:px-6">
            <button type="button" className={`${iconBtn} hidden sm:inline-flex`} onClick={() => step(-1)} aria-label="Previous photograph">
              <ChevronLeft className="h-7 w-7" aria-hidden />
            </button>
            <img
              key={photo.id}
              src={photo.src}
              srcSet={photo.srcSet}
              sizes="100vw"
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              className="mx-auto max-h-full min-w-0 max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button type="button" className={`${iconBtn} hidden sm:inline-flex`} onClick={() => step(1)} aria-label="Next photograph">
              <ChevronRight className="h-7 w-7" aria-hidden />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-2 sm:hidden">
              <button type="button" className={iconBtn} onClick={() => step(-1)} aria-label="Previous photograph">
                <ChevronLeft className="h-6 w-6" aria-hidden />
              </button>
              <button type="button" className={iconBtn} onClick={() => step(1)} aria-label="Next photograph">
                <ChevronRight className="h-6 w-6" aria-hidden />
              </button>
            </div>
            <p className="text-[0.95rem]">
              {photo.title}
              <span className="text-white/60"> · {categoryLabels[photo.category]}</span>
            </p>
            <Link
              to={inquiryHref(serviceById(photo.category).inquiryValue)}
              className="text-[0.95rem] font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
            >
              Inquire about {serviceById(photo.category).title.toLowerCase()}
            </Link>
          </div>
        </div>
      )}
    </dialog>
  );
};
