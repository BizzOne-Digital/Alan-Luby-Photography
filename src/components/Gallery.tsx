import React, { useState } from 'react';
import { PhotoItem } from '../types';
import { categoryLabels } from '../data/photography';
import { Photo } from './Photo';
import { Lightbox } from './Lightbox';
import { motion } from 'motion/react';

interface GalleryProps {
  photos: PhotoItem[];
  showCategory?: boolean;
  /** Stretch the last row to full width (for short, fixed sets) */
  fill?: boolean;
}

/** Uncropped photographs in justified rows; each opens the lightbox. */
export const Gallery: React.FC<GalleryProps> = ({ photos, showCategory, fill }) => {
  const [active, setActive] = useState<number | null>(null);

  return (
    <>
      <ul className={`justified ${fill ? 'fill' : ''}`}>
        {photos.map((photo, i) => (
          <motion.li
            key={photo.id}
            className="item"
            style={{ '--ratio': photo.width / photo.height } as React.CSSProperties}
            initial={{ opacity: 0, y: 48, clipPath: 'inset(18% 0% 0% 0%)' }}
            whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' }}
            viewport={{ once: true, margin: '0px 0px -8% 0px' }}
            transition={{ duration: 0.9, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={() => setActive(i)}
              className="group block w-full text-left"
              aria-label={`View larger: ${photo.title}`}
            >
              <span className="block overflow-hidden">
                <Photo
                  photo={photo}
                  sizes="(min-width: 1024px) 45vw, (min-width: 640px) 50vw, 100vw"
                  className="transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                />
              </span>
              <span className="mt-2 block text-sm text-muted">
                {photo.title}
                {showCategory && <span className="text-muted/80"> · {categoryLabels[photo.category]}</span>}
              </span>
            </button>
          </motion.li>
        ))}
      </ul>
      <Lightbox photos={photos} index={active} onChange={setActive} />
    </>
  );
};
