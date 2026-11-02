/**
 * The API runs on Vercel Functions, which reject request bodies over 4.5 MB. Images are scaled down in the browser
 * before upload so they always fit (with room for the multipart envelope). 2560px on the long side is plenty for
 * the site's largest display size and keeps pages fast.
 */
export const MAX_REQUEST_BYTES = 4 * 1024 * 1024;
const MAX_EDGE = 2560;

export interface PreparedImage {
  file: File;
  width: number;
  height: number;
  resized: boolean;
}

const load = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('This file could not be read as an image.'));
    };
    img.src = url;
  });

const encode = (canvas: HTMLCanvasElement, type: string, quality: number) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));

export async function prepareImage(file: File): Promise<PreparedImage> {
  const img = await load(file);
  const { naturalWidth: w, naturalHeight: h } = img;
  const scale = Math.min(1, MAX_EDGE / Math.max(w, h));
  if (scale === 1 && file.size <= MAX_REQUEST_BYTES) return { file, width: w, height: h, resized: false };
  // Redrawing a GIF keeps only its first frame, so animated files are never converted.
  if (file.type === 'image/gif') throw new Error('This GIF is larger than 4MB. Please export a smaller version.');

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Photos stay JPEG; PNG/WebP become WebP, which keeps transparency (JPEG if the browser cannot encode WebP).
  let type = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/webp';
  for (const quality of [0.9, 0.82, 0.72, 0.6]) {
    let blob = await encode(canvas, type, quality);
    if (blob && blob.type !== type) {
      type = 'image/jpeg';
      blob = await encode(canvas, type, quality);
    }
    if (blob && blob.size <= MAX_REQUEST_BYTES) {
      const name = `${file.name.replace(/\.[^.]+$/, '') || 'image'}.${type === 'image/webp' ? 'webp' : 'jpg'}`;
      return { file: new File([blob], name, { type }), width: canvas.width, height: canvas.height, resized: true };
    }
  }
  throw new Error('This image could not be made small enough to upload. Please export a smaller version.');
}
