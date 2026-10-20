import React from 'react';
import { PhotoItem } from '../types';

/** Two rows of photographs drifting in opposite directions. Decorative; the same photos are on the Work page. */
export const PhotoMarquee: React.FC<{ rows: [PhotoItem[], PhotoItem[]] }> = ({ rows }) => (
  <div className="marquee-track space-y-3 overflow-hidden sm:space-y-4" aria-hidden>
    {rows.map((row, r) => (
      <div key={r} className={`marquee flex w-max ${r ? 'marquee-reverse' : ''}`} style={{ '--marquee-duration': `${row.length * 7}s` } as React.CSSProperties}>
        {[...row, ...row].map((p, i) => (
          <img
            key={`${p.id}-${i}`}
            src={`/images/work/${p.id}-640.webp`}
            alt=""
            width={p.width}
            height={p.height}
            loading="lazy"
            decoding="async"
            className="mr-3 h-40 w-auto shrink-0 bg-sand sm:mr-4 object-cover transition-[filter] duration-500 sm:h-56 lg:h-64"
          />
        ))}
      </div>
    ))}
  </div>
);
