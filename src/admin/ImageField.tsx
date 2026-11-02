import React, { useEffect, useRef, useState } from 'react';
import { ImagePlus, Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { api, mediaUrl, uploadImage } from '../lib/api';
import { prepareImage } from './resizeImage';
import { btn, useToast } from './ui';

export const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
export const MAX_BYTES = 8 * 1024 * 1024;

export type UploadFolder = 'gallery' | 'pages' | 'misc';

interface ImageFieldProps {
  label: string;
  /** Stored image URL ('' when none) */
  value: string;
  onChange: (url: string, size?: { width: number; height: number }) => void;
  folder: UploadFolder;
  /** The value currently saved on the server. Uploads made here that never get saved are cleaned up. */
  committed?: string;
  hint?: string;
  error?: string;
  allowRemove?: boolean;
}

const deleteUpload = (url: string) => api(url.replace(/^\/api/, ''), { method: 'DELETE' }).catch(() => {});

/**
 * Upload, preview, replace and remove an image. Only the returned URL is handed to the form; the file itself is
 * stored by the API. Uploads replaced or abandoned before saving are deleted again so they do not pile up.
 */
export const ImageField: React.FC<ImageFieldProps> = ({ label, value, onChange, folder, committed = '', hint, error, allowRemove = true }) => {
  const toast = useToast();
  const input = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const sessionUploads = useRef(new Set<string>());
  const committedRef = useRef(committed);
  committedRef.current = committed;

  useEffect(
    () => () => {
      for (const url of sessionUploads.current) if (url !== committedRef.current) deleteUpload(url);
    },
    [],
  );

  /** Drops an upload that only this form ever used. Saved images are cleaned up by the server on save. */
  const discard = (url: string) => {
    if (sessionUploads.current.has(url) && url !== committedRef.current) {
      sessionUploads.current.delete(url);
      deleteUpload(url);
    }
  };

  const onFile = async (file?: File) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) return toast.error('Please choose a PNG, JPEG, WebP or GIF image.');
    if (file.size > MAX_BYTES) return toast.error('That image is larger than 8MB. Please export a smaller version.');
    const local = URL.createObjectURL(file);
    setPreview(local);
    setProgress(0);
    try {
      const prepared = await prepareImage(file);
      const result = await uploadImage(prepared.file, folder, setProgress);
      sessionUploads.current.add(result.url);
      discard(value);
      onChange(result.url, { width: prepared.width, height: prepared.height });
      toast.success(
        prepared.resized
          ? `Image resized to ${prepared.width} × ${prepared.height}px for the web and uploaded. Remember to save your changes.`
          : 'Image uploaded. Remember to save your changes.',
      );
    } catch (err) {
      toast.error(err);
    } finally {
      setProgress(null);
      setPreview(null);
      URL.revokeObjectURL(local);
      if (input.current) input.current.value = '';
    }
  };

  const remove = () => {
    discard(value);
    onChange('');
  };

  const shown = preview ?? (value ? mediaUrl(value) : null);
  const busy = progress !== null;
  const id = `img-${label.replace(/\W+/g, '-').toLowerCase()}`;

  return (
    <div>
      <p className="text-sm font-semibold" id={`${id}-label`}>{label}</p>
      <div className={`mt-1.5 overflow-hidden rounded-lg border ${error ? 'border-red-700' : 'border-ink/20'} bg-sand/40`}>
        {shown ? (
          <div className="relative">
            <img src={shown} alt="" className={`max-h-72 w-full object-contain ${busy ? 'opacity-60' : ''}`} />
            {busy && (
              <div className="absolute inset-x-0 bottom-0 bg-white/90 p-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Uploading… {progress}%
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded bg-sand" role="progressbar" aria-valuenow={progress ?? 0} aria-valuemin={0} aria-valuemax={100} aria-labelledby={`${id}-label`}>
                  <div className="h-full bg-accent transition-[width]" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <button type="button" onClick={() => input.current?.click()} className="flex w-full flex-col items-center gap-2 px-4 py-10 text-muted hover:bg-sand/70 hover:text-ink">
            <ImagePlus className="h-8 w-8" aria-hidden />
            <span className="text-sm font-semibold">Choose an image</span>
            <span className="text-xs">PNG, JPEG, WebP or GIF, up to 8MB</span>
          </button>
        )}
      </div>
      <input
        ref={input}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        className="sr-only"
        aria-labelledby={`${id}-label`}
        tabIndex={-1}
        onChange={(e) => onFile(e.target.files?.[0])}
      />
      {shown && (
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" className={btn.secondary} disabled={busy} onClick={() => input.current?.click()}>
            <RefreshCw className="h-4 w-4" aria-hidden /> Replace image
          </button>
          {allowRemove && (
            <button type="button" className={btn.ghost} disabled={busy} onClick={remove}>
              <Trash2 className="h-4 w-4" aria-hidden /> Remove
            </button>
          )}
        </div>
      )}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && <p className="mt-1 text-sm font-medium text-red-800">{error}</p>}
    </div>
  );
};
