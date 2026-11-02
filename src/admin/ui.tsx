import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react';
import { ApiError, api } from '../lib/api';

// ---------- Toasts ----------

type Toast = { id: number; kind: 'success' | 'error'; text: string };
const ToastContext = createContext<(kind: Toast['kind'], text: string) => void>(() => {});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((kind: Toast['kind'], text: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, kind, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === 'error' ? 7000 : 4000);
  }, []);
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="fixed bottom-4 right-4 z-[200] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`flex items-start gap-3 rounded-lg border bg-white p-4 text-[0.95rem] shadow-lg ${t.kind === 'error' ? 'border-red-300' : 'border-accent/30'}`}>
            {t.kind === 'error' ? <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-700" aria-hidden /> : <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />}
            <p className="flex-1">{t.text}</p>
            <button type="button" onClick={() => setToasts((all) => all.filter((x) => x.id !== t.id))} aria-label="Dismiss" className="text-muted hover:text-ink">
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const push = useContext(ToastContext);
  return {
    success: (text: string) => push('success', text),
    error: (err: unknown) => push('error', err instanceof Error ? err.message : String(err)),
  };
};

// ---------- Confirmation dialog ----------

type ConfirmOptions = { title: string; text?: string; confirmLabel?: string; danger?: boolean };
const ConfirmContext = createContext<(o: ConfirmOptions) => Promise<boolean>>(async () => false);

/** Native <dialog>: focus trapping and Escape come from the browser. */
export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDialogElement>(null);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<(v: boolean) => void>(() => {});

  const confirm = useCallback((o: ConfirmOptions) => {
    setOptions(o);
    requestAnimationFrame(() => ref.current?.showModal());
    return new Promise<boolean>((resolve) => (resolver.current = resolve));
  }, []);

  const close = (value: boolean) => {
    resolver.current(value);
    ref.current?.close();
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <dialog ref={ref} onCancel={() => resolver.current(false)} className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-xl bg-white p-0 text-ink shadow-2xl backdrop:bg-ink/40">
        {options && (
          <div className="space-y-4 p-6">
            <h2 className="font-sans text-xl font-semibold">{options.title}</h2>
            {options.text && <p className="text-muted">{options.text}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" className={btn.secondary} onClick={() => close(false)} autoFocus>Cancel</button>
              <button type="button" className={options.danger ? btn.danger : btn.primary} onClick={() => close(true)}>
                {options.confirmLabel ?? 'Confirm'}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => useContext(ConfirmContext);

// ---------- Styles ----------

const base = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50';
export const btn = {
  primary: `${base} bg-accent text-paper hover:bg-accent-dark`,
  secondary: `${base} border border-ink/20 bg-white text-ink hover:border-ink hover:bg-ink/5`,
  danger: `${base} bg-red-800 text-white hover:bg-red-900`,
  ghost: `${base} text-muted hover:bg-ink/5 hover:text-ink`,
};
export const inputClass =
  'mt-1.5 block w-full min-h-11 rounded-md border border-ink/20 bg-white px-3 py-2 text-[0.95rem] text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25 aria-[invalid=true]:border-red-700';
export const card = 'rounded-xl border border-line bg-white';

// ---------- Form fields ----------

export type FieldErrors = Record<string, string>;

/** Turns an API validation error into per-field messages. */
export const fieldErrors = (err: unknown): FieldErrors =>
  err instanceof ApiError && err.details ? Object.fromEntries(err.details.map((d) => [d.field, d.message])) : {};

interface FieldProps {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  children: (props: { id: string; 'aria-invalid'?: true; 'aria-describedby'?: string }) => React.ReactNode;
}

export const Field: React.FC<FieldProps> = ({ label, name, hint, error, children }) => {
  const id = `f-${name}`;
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">{label}</label>
      {children({ id, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy })}
      {hint && <p id={`${id}-hint`} className="mt-1 text-xs text-muted">{hint}</p>}
      {error && <p id={`${id}-error`} className="mt-1 text-sm font-medium text-red-800">{error}</p>}
    </div>
  );
};

type Common = { label: string; name: string; hint?: string; error?: string };

export const TextField: React.FC<Common & { value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean; maxLength?: number }> = ({
  value, onChange, type = 'text', placeholder, required, maxLength, ...field
}) => (
  <Field {...field}>
    {(a) => <input {...a} type={type} value={value} placeholder={placeholder} required={required} maxLength={maxLength} onChange={(e) => onChange(e.target.value)} className={inputClass} />}
  </Field>
);

export const TextArea: React.FC<Common & { value: string; onChange: (v: string) => void; rows?: number; maxLength?: number }> = ({ value, onChange, rows = 4, maxLength, ...field }) => (
  <Field {...field}>
    {(a) => <textarea {...a} rows={rows} value={value} maxLength={maxLength} onChange={(e) => onChange(e.target.value)} className={inputClass} />}
  </Field>
);

export const NumberField: React.FC<Common & { value: number; onChange: (v: number) => void; min?: number }> = ({ value, onChange, min, ...field }) => (
  <Field {...field}>
    {(a) => <input {...a} type="number" step={1} min={min} value={Number.isFinite(value) ? value : ''} onChange={(e) => onChange(e.target.value === '' ? 0 : Math.trunc(Number(e.target.value)))} className={inputClass} />}
  </Field>
);

export const SelectField: React.FC<Common & { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }> = ({ value, onChange, options, ...field }) => (
  <Field {...field}>
    {(a) => (
      <select {...a} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    )}
  </Field>
);

export const Checkbox: React.FC<{ label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }> = ({ label, checked, onChange, hint }) => (
  <label className="flex items-start gap-3 text-[0.95rem]">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 h-4 w-4 accent-[var(--color-accent)]" />
    <span>
      <span className="font-semibold">{label}</span>
      {hint && <span className="block text-xs text-muted">{hint}</span>}
    </span>
  </label>
);

// ---------- Layout bits ----------

export const PageHeader: React.FC<{ title: string; text?: string; actions?: React.ReactNode }> = ({ title, text, actions }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 className="font-sans text-2xl font-semibold sm:text-3xl">{title}</h1>
      {text && <p className="mt-1 max-w-2xl text-muted">{text}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>
);

export const Spinner: React.FC<{ label?: string }> = ({ label = 'Loading…' }) => (
  <div className="flex items-center gap-2 py-10 text-muted" role="status">
    <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> {label}
  </div>
);

export const EmptyState: React.FC<{ title: string; text?: string; action?: React.ReactNode }> = ({ title, text, action }) => (
  <div className={`${card} px-6 py-12 text-center`}>
    <p className="font-semibold">{title}</p>
    {text && <p className="mx-auto mt-1 max-w-md text-muted">{text}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const ErrorState: React.FC<{ error: unknown; onRetry?: () => void }> = ({ error, onRetry }) => (
  <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-900" role="alert">
    <p className="font-semibold">Could not load this.</p>
    <p className="mt-1 text-sm">{error instanceof Error ? error.message : String(error)}</p>
    {onRetry && <button type="button" onClick={onRetry} className={`${btn.secondary} mt-3`}>Try again</button>}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; tone?: 'neutral' | 'accent' | 'warn' }> = ({ children, tone = 'neutral' }) => (
  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${tone === 'accent' ? 'bg-accent/10 text-accent' : tone === 'warn' ? 'bg-amber-100 text-amber-900' : 'bg-sand text-muted'}`}>
    {children}
  </span>
);

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export const Pager: React.FC<{ pagination?: Pagination; onPage: (page: number) => void }> = ({ pagination, onPage }) => {
  if (!pagination || pagination.pages <= 1) return null;
  const { page, pages, total } = pagination;
  return (
    <nav aria-label="Pagination" className="mt-6 flex items-center justify-between gap-4 text-sm text-muted">
      <span>Page {page} of {pages} · {total} total</span>
      <div className="flex gap-2">
        <button type="button" className={btn.secondary} disabled={page <= 1} onClick={() => onPage(page - 1)}><ChevronLeft className="h-4 w-4" aria-hidden /> Previous</button>
        <button type="button" className={btn.secondary} disabled={page >= pages} onClick={() => onPage(page + 1)}>Next <ChevronRight className="h-4 w-4" aria-hidden /></button>
      </div>
    </nav>
  );
};

// ---------- Data ----------

/** GET a path; reloads when the path changes. */
export function useApi<T>(path: string | null) {
  const [state, setState] = useState<{ data?: T; error?: unknown; loading: boolean }>({ loading: Boolean(path) });
  const [nonce, setNonce] = useState(0);
  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: undefined }));
    api<T>(path, { signal: controller.signal })
      .then((data) => setState({ data, loading: false }))
      .catch((error) => !controller.signal.aborted && setState((s) => ({ ...s, error, loading: false })));
    return () => controller.abort();
  }, [path, nonce]);
  return { ...state, reload: () => setNonce((n) => n + 1) };
}

/** Fetches every page of a list endpoint (for pickers over small collections such as photos). */
export async function fetchAll<T>(path: string): Promise<T[]> {
  const items: T[] = [];
  for (let page = 1; ; page++) {
    const res = await api<{ data: T[]; pagination: Pagination }>(`${path}${path.includes('?') ? '&' : '?'}limit=100&page=${page}`);
    items.push(...res.data);
    if (page >= res.pagination.pages) return items;
  }
}

/** Debounced value for search boxes. */
export function useDebounced<T>(value: T, ms = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '';

export const formatBytes = (n: number) =>
  n < 1024 ? `${n} B` : n < 1024 ** 2 ? `${(n / 1024).toFixed(0)} KB` : `${(n / 1024 ** 2).toFixed(1)} MB`;

/** Query string from an object, skipping empty values. */
export const qs = (params: Record<string, string | number | undefined>) => {
  const s = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== '').map(([k, v]) => [k, String(v)])).toString();
  return s ? `?${s}` : '';
};
