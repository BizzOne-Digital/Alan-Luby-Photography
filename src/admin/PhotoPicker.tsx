import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Check, Plus, X } from 'lucide-react';
import { mediaUrl } from '../lib/api';
import { btn, fetchAll, inputClass } from './ui';

export interface AdminPhoto {
  _id: string;
  slug: string;
  title: string;
  alt: string;
  category: string;
  width: number;
  height: number;
  src: string;
  srcSet: string;
  focus: string;
  order: number;
  showInWork: boolean;
  featured: number;
  marquee: number;
}

export const photoThumb = (p: Pick<AdminPhoto, 'src' | 'srcSet'>) => mediaUrl(p.srcSet?.split(' ')[0] || p.src);

let cache: Promise<AdminPhoto[]> | null = null;
/** The photo library, loaded once per admin visit (call refreshPhotoLibrary after edits). */
export const loadPhotoLibrary = () => (cache ??= fetchAll<AdminPhoto>('/photos?sort=order').catch((e) => ((cache = null), Promise.reject(e))));
export const refreshPhotoLibrary = () => {
  cache = null;
};

export function usePhotoLibrary() {
  const [photos, setPhotos] = useState<AdminPhoto[] | null>(null);
  const [error, setError] = useState<unknown>(null);
  useEffect(() => {
    loadPhotoLibrary().then(setPhotos, setError);
  }, []);
  return { photos, error };
}

interface PhotoPickerProps {
  label: string;
  /** Selected slugs */
  value: string[];
  onChange: (slugs: string[]) => void;
  multiple?: boolean;
  max?: number;
  hint?: string;
  error?: string;
}

/** Choose one or several photos from the library. The selection order is kept (and can be changed). */
export const PhotoPicker: React.FC<PhotoPickerProps> = ({ label, value, onChange, multiple, max = 12, hint, error }) => {
  const { photos, error: loadError } = usePhotoLibrary();
  const dialog = useRef<HTMLDialogElement>(null);
  const [q, setQ] = useState('');
  const bySlug = new Map<string, AdminPhoto>((photos ?? []).map((p) => [p.slug, p]));
  const filtered = (photos ?? []).filter((p) => !q || `${p.title} ${p.alt} ${p.category}`.toLowerCase().includes(q.toLowerCase()));

  const toggle = (slug: string) => {
    if (!multiple) {
      onChange([slug]);
      dialog.current?.close();
      return;
    }
    onChange(value.includes(slug) ? value.filter((s) => s !== slug) : value.length < max ? [...value, slug] : value);
  };
  const move = (i: number, d: number) => {
    const next = [...value];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };

  return (
    <div>
      <p className="text-sm font-semibold">{label}</p>
      <div className={`mt-1.5 flex flex-wrap gap-3 rounded-lg border ${error ? 'border-red-700' : 'border-ink/20'} bg-white p-3`}>
        {value.map((slug, i) => {
          const p = bySlug.get(slug);
          return (
            <figure key={slug} className="w-32">
              <div className="relative aspect-[4/3] overflow-hidden rounded bg-sand">
                {p ? <img src={photoThumb(p)} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center p-2 text-center text-xs text-red-800">{photos ? 'Missing photo' : '…'}</span>}
              </div>
              <figcaption className="mt-1 line-clamp-2 text-xs text-muted">{p?.title ?? slug}</figcaption>
              <div className="mt-1 flex gap-1">
                {multiple && i > 0 && <button type="button" className="rounded p-1 hover:bg-sand" onClick={() => move(i, -1)} aria-label={`Move ${p?.title ?? slug} earlier`}><ArrowUp className="h-3.5 w-3.5 -rotate-90" aria-hidden /></button>}
                {multiple && i < value.length - 1 && <button type="button" className="rounded p-1 hover:bg-sand" onClick={() => move(i, 1)} aria-label={`Move ${p?.title ?? slug} later`}><ArrowDown className="h-3.5 w-3.5 -rotate-90" aria-hidden /></button>}
                {multiple && <button type="button" className="rounded p-1 hover:bg-sand" onClick={() => onChange(value.filter((s) => s !== slug))} aria-label={`Remove ${p?.title ?? slug}`}><X className="h-3.5 w-3.5" aria-hidden /></button>}
              </div>
            </figure>
          );
        })}
        <button type="button" className={`${btn.secondary} self-center`} onClick={() => dialog.current?.showModal()}>
          <Plus className="h-4 w-4" aria-hidden /> {value.length && !multiple ? 'Change photo' : 'Choose photo'}{multiple ? 's' : ''}
        </button>
      </div>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && <p className="mt-1 text-sm font-medium text-red-800">{error}</p>}

      <dialog ref={dialog} className="m-auto h-[min(48rem,calc(100dvh-2rem))] w-[min(64rem,calc(100vw-2rem))] rounded-xl bg-paper p-0 text-ink shadow-2xl backdrop:bg-ink/40">
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 border-b border-line bg-white p-4">
            <h2 className="font-sans text-lg font-semibold">{label}</h2>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search photos" aria-label="Search photos" className={`${inputClass} mt-0 max-w-xs`} />
            <span className="ml-auto text-sm text-muted">{multiple && `${value.length} selected (max ${max})`}</span>
            <button type="button" className={btn.primary} onClick={() => dialog.current?.close()}>Done</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {loadError ? <p className="text-red-800">Could not load photos.</p> : !photos ? <p className="text-muted">Loading photos…</p> : (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                {filtered.map((p) => {
                  const selected = value.includes(p.slug);
                  return (
                    <li key={p.slug}>
                      <button type="button" onClick={() => toggle(p.slug)} aria-pressed={selected} className={`group block w-full rounded-lg p-1 text-left ${selected ? 'bg-accent text-paper' : 'hover:bg-sand'}`}>
                        <span className="relative block aspect-[4/3] overflow-hidden rounded bg-sand">
                          <img src={photoThumb(p)} alt="" loading="lazy" className="h-full w-full object-cover" />
                          {selected && <Check className="absolute right-1 top-1 h-5 w-5 rounded-full bg-accent p-0.5 text-paper" aria-hidden />}
                        </span>
                        <span className="mt-1 block truncate text-xs">{p.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
};
