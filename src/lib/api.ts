/// <reference types="vite/client" />

/**
 * Backend base URL, e.g. `/api` (same-origin, proxied) or `https://api.example.com/api`.
 * When unset the public site runs entirely on its built-in content and the admin area reports that no backend is configured.
 */
export const API_URL = ((import.meta.env.VITE_API_URL as string | undefined) || '').replace(/\/$/, '');
export const apiEnabled = API_URL !== '';

/** Uploaded images are served by the API, which may be on a different origin than the site. */
const API_ORIGIN = /^https?:\/\//.test(API_URL) ? new URL(API_URL).origin : '';

export const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 3"><rect width="4" height="3" fill="#ECE8DF"/></svg>');

/** Resolves a stored image URL for rendering. Legacy `/uploads/...` files no longer exist, so they show a placeholder. */
export const mediaUrl = (src?: string | null) => {
  if (!src) return PLACEHOLDER_IMAGE;
  if (src.startsWith('/api/uploads/')) return API_ORIGIN + src;
  if (src.startsWith('/uploads/')) return PLACEHOLDER_IMAGE;
  return src;
};

export class ApiError extends Error {
  constructor(public status: number, message: string, public details?: { field: string; message: string }[]) {
    super(message);
  }
}

let csrfToken = '';
export const setCsrfToken = (token: string) => {
  csrfToken = token;
};

/** Called when the server says the admin session has ended, so the admin UI can return to the sign-in screen. */
let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (fn: (() => void) | null) => {
  onUnauthorized = fn;
};

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
}

/** JSON request with the session cookie, plus the CSRF token on writes. Throws ApiError on failure. */
export async function api<T = any>(path: string, { method = 'GET', body, signal }: ApiOptions = {}): Promise<T> {
  if (!apiEnabled) throw new ApiError(0, 'No backend is configured (VITE_API_URL is not set).');
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      credentials: 'include',
      signal,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(method !== 'GET' && csrfToken && { 'X-CSRF-Token': csrfToken }),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if ((err as Error).name === 'AbortError') throw err;
    throw new ApiError(0, 'Could not reach the server. Check your connection and try again.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    if (res.status === 401 && !path.startsWith('/auth/')) onUnauthorized?.();
    throw new ApiError(res.status, data.error?.message || `Request failed (${res.status})`, data.error?.details);
  }
  return data as T;
}

export interface UploadResult {
  success: true;
  url: string;
  filename: string;
  size: number;
  folder: string;
}

/** Multipart upload with progress (fetch cannot report upload progress, XHR can). */
export function uploadImage(file: File, folder: string, onProgress?: (percent: number) => void): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}/upload`);
    xhr.withCredentials = true;
    xhr.setRequestHeader('X-CSRF-Token', csrfToken);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      let data: any = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        /* non-JSON error page */
      }
      if (xhr.status >= 200 && xhr.status < 300 && data.success) return resolve(data);
      if (xhr.status === 401) onUnauthorized?.();
      const fallback = xhr.status === 413 ? 'The image is too large to upload. Please export a smaller version.' : `Upload failed (${xhr.status})`;
      reject(new ApiError(xhr.status, data.error?.message || fallback));
    };
    xhr.onerror = () => reject(new ApiError(0, 'Could not reach the server. Check your connection and try again.'));
    const form = new FormData();
    form.append('folder', folder);
    form.append('file', file);
    xhr.send(form);
  });
}
