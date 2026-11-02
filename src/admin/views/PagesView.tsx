import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowDown, ArrowLeft, ArrowUp, ExternalLink, Pencil } from 'lucide-react';
import { ApiError, api } from '../../lib/api';
import { FieldDef, HOME_SECTIONS, PAGES, PageKey, pageDef, pageDefaults } from '../../site/content';
import { ImageField } from '../ImageField';
import { PhotoPicker } from '../PhotoPicker';
import { Badge, Checkbox, ErrorState, PageHeader, SelectField, Spinner, TextArea, TextField, btn, card, fieldErrors, formatDate, useApi, useToast } from '../ui';
import { AdminTestimonial, testimonialLabel } from './TestimonialsView';

interface AdminPage {
  key: PageKey;
  published: boolean;
  seoTitle: string;
  seoDescription: string;
  content: Record<string, string>;
  sections?: { key: string; visible: boolean }[];
  updatedAt?: string;
}

export const PagesView: React.FC = () => {
  const { data, error, loading, reload } = useApi<{ data: AdminPage[] }>('/pages');
  const stored = new Map<PageKey, AdminPage>((data?.data ?? []).map((p) => [p.key, p]));
  return (
    <>
      <PageHeader title="Pages" text="Headings, text, images and search engine details for each page of the website." />
      {error ? <ErrorState error={error} onRetry={reload} /> : loading && !data ? <Spinner /> : (
        <ul className="space-y-3">
          {PAGES.map((p) => {
            const s = stored.get(p.key);
            return (
              <li key={p.key} className={`${card} flex flex-wrap items-center gap-4 p-4`}>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{p.label}</p>
                  <p className="text-sm text-muted">{p.path}{s?.updatedAt && ` · last edited ${formatDate(s.updatedAt)}`}</p>
                </div>
                {s && !s.published ? <Badge tone="warn">Unpublished</Badge> : <Badge tone="accent">Published</Badge>}
                <div className="flex gap-2">
                  <Link to={`/admin/pages/${p.key}`} className={btn.secondary}><Pencil className="h-4 w-4" aria-hidden /> Edit</Link>
                  <a href={p.path} target="_blank" rel="noopener noreferrer" className={btn.ghost}><ExternalLink className="h-4 w-4" aria-hidden /> View</a>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

const FieldInput: React.FC<{
  def: FieldDef;
  value: string;
  committed: string;
  onChange: (v: string) => void;
  error?: string;
  testimonials: AdminTestimonial[];
}> = ({ def, value, committed, onChange, error, testimonials }) => {
  const common = { label: def.label, name: def.name, hint: def.help, error };
  switch (def.type) {
    case 'textarea':
      return <TextArea {...common} value={value} onChange={onChange} rows={value.length > 200 ? 6 : 3} maxLength={5000} />;
    case 'link':
      return <TextField {...common} value={value} onChange={onChange} hint={def.help ?? 'A page on this site such as /work, or a full address starting with https://'} />;
    case 'photo':
      return <PhotoPicker {...common} value={value ? [value] : []} onChange={(v) => onChange(v[0] ?? '')} />;
    case 'photos':
      return <PhotoPicker {...common} multiple max={12} value={value ? value.split(',') : []} onChange={(v) => onChange(v.join(','))} />;
    case 'testimonial':
      return (
        <SelectField
          {...common}
          value={value}
          onChange={onChange}
          options={[{ value: '', label: 'No quote' }, ...testimonials.map((t) => ({ value: t._id, label: testimonialLabel(t) }))]}
        />
      );
    case 'image':
      return <ImageField label={def.label} folder="pages" value={value} committed={committed} onChange={(url) => onChange(url)} hint={def.help} error={error} />;
    default:
      return <TextField {...common} value={value} onChange={onChange} maxLength={5000} />;
  }
};

const validLink = (v: string) => v === '' || /^\/(?!\/)/.test(v) || /^https?:\/\/\S+$/.test(v);

export const PageEditView: React.FC = () => {
  const key = useParams().key as PageKey;
  const def = PAGES.find((p) => p.key === key);
  const toast = useToast();
  const { data, error, loading } = useApi<{ data: AdminPage }>(def ? `/pages/${key}` : null);
  const testimonials = useApi<{ data: AdminTestimonial[] }>('/testimonials?limit=100&sort=order');
  const [page, setPage] = useState<AdminPage | null>(null);
  const [committed, setCommitted] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!def) return;
    // A page that was never saved starts from the text the site shipped with.
    const missing = error instanceof ApiError && error.status === 404;
    if (!data && !missing) return;
    const stored = data?.data;
    const content = { ...pageDefaults(key), ...(stored?.content ?? {}) };
    setPage({
      key,
      published: stored?.published ?? true,
      seoTitle: stored?.seoTitle ?? def.seoTitle,
      seoDescription: stored?.seoDescription || def.seoDescription,
      content,
      sections: key === 'home' ? [...(stored?.sections ?? []), ...HOME_SECTIONS.filter((h) => !stored?.sections?.some((s) => s.key === h.key)).map((h) => ({ key: h.key, visible: true }))] : undefined,
    });
    setCommitted(stored?.content ?? {});
  }, [data, error, def, key]);

  if (!def) return <ErrorState error={new Error('Unknown page')} />;
  if (error && !(error instanceof ApiError && error.status === 404)) return <ErrorState error={error} />;
  if (loading || !page) return <Spinner />;

  const setContent = (name: string) => (v: string) => setPage((p) => p && { ...p, content: { ...p.content, [name]: v } });
  const moveSection = (i: number, d: number) =>
    setPage((p) => {
      if (!p?.sections) return p;
      const next = [...p.sections];
      [next[i], next[i + d]] = [next[i + d], next[i]];
      return { ...p, sections: next };
    });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const linkErrors = Object.fromEntries(def.fields.filter((f) => f.type === 'link' && !validLink(page.content[f.name] ?? '')).map((f) => [`content.${f.name}`, 'Use a site path like /work or a full https:// address']));
    if (Object.keys(linkErrors).length) {
      setErrors(linkErrors);
      return toast.error('Please fix the highlighted links.');
    }
    setBusy(true);
    setErrors({});
    try {
      const body = {
        seoTitle: page.seoTitle,
        seoDescription: page.seoDescription,
        content: Object.fromEntries(def.fields.map((f) => [f.name, page.content[f.name] ?? ''])),
        ...(def.canUnpublish && { published: page.published }),
        ...(page.sections && { sections: page.sections }),
      };
      const res = await api<{ data: AdminPage }>(`/pages/${key}`, { method: 'PUT', body });
      setCommitted(res.data.content);
      toast.success(`${def.label} saved. Visitors see the changes on their next page load.`);
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(err);
    } finally {
      setBusy(false);
    }
  };

  const groups = [...new Set(def.fields.map((f) => f.group ?? 'Content'))];

  return (
    <form onSubmit={save} noValidate>
      <Link to="/admin/pages" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"><ArrowLeft className="h-4 w-4" aria-hidden /> All pages</Link>
      <PageHeader
        title={`Edit ${pageDef(key).label}`}
        actions={
          <>
            <a href={def.path} target="_blank" rel="noopener noreferrer" className={btn.secondary}><ExternalLink className="h-4 w-4" aria-hidden /> View page</a>
            <button type="submit" className={btn.primary} disabled={busy}>{busy ? 'Saving…' : 'Save page'}</button>
          </>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          {groups.map((g) => (
            <fieldset key={g} className={`${card} space-y-5 p-5`}>
              <legend className="float-left mb-1 w-full font-sans text-lg font-semibold">{g}</legend>
              {def.fields.filter((f) => (f.group ?? 'Content') === g).map((f) => (
                <FieldInput
                  key={f.name}
                  def={f}
                  value={page.content[f.name] ?? ''}
                  committed={committed[f.name] ?? ''}
                  onChange={setContent(f.name)}
                  error={errors[`content.${f.name}`]}
                  testimonials={testimonials.data?.data ?? []}
                />
              ))}
            </fieldset>
          ))}
        </div>
        <div className="space-y-6">
          {def.canUnpublish && (
            <div className={`${card} space-y-2 p-5`}>
              <h2 className="font-sans text-lg font-semibold">Visibility</h2>
              <Checkbox
                label="Published"
                checked={page.published}
                onChange={(v) => setPage((p) => p && { ...p, published: v })}
                hint="When unpublished, the page shows “not found” and its menu links are hidden. Links to it elsewhere on the site will lead to that message."
              />
            </div>
          )}
          <div className={`${card} space-y-5 p-5`}>
            <h2 className="font-sans text-lg font-semibold">Search engines</h2>
            <TextField label="Page title" name="seoTitle" value={page.seoTitle} onChange={(v) => setPage((p) => p && { ...p, seoTitle: v })} error={errors.seoTitle} maxLength={120} hint={key === 'home' ? 'Leave empty to use the site title from Settings.' : 'Shown in the browser tab and search results, followed by the site name.'} />
            <TextArea label="Description" name="seoDescription" value={page.seoDescription} onChange={(v) => setPage((p) => p && { ...p, seoDescription: v })} error={errors.seoDescription} rows={4} maxLength={300} hint={`${page.seoDescription.length}/300. Aim for 120–160 characters.`} />
          </div>
          {page.sections && (
            <div className={`${card} p-5`}>
              <h2 className="font-sans text-lg font-semibold">Homepage sections</h2>
              <p className="mb-3 text-sm text-muted">Order and visibility of the sections below the hero.</p>
              <ol className="space-y-2">
                {page.sections.map((s, i) => (
                  <li key={s.key} className="flex items-center gap-2 rounded-lg border border-line px-3 py-2">
                    <Checkbox
                      label={HOME_SECTIONS.find((h) => h.key === s.key)?.label ?? s.key}
                      checked={s.visible}
                      onChange={(v) => setPage((p) => p && { ...p, sections: p.sections!.map((x) => (x.key === s.key ? { ...x, visible: v } : x)) })}
                    />
                    <span className="ml-auto flex">
                      <button type="button" className="rounded p-1.5 hover:bg-sand disabled:opacity-30" disabled={i === 0} onClick={() => moveSection(i, -1)} aria-label="Move up"><ArrowUp className="h-4 w-4" aria-hidden /></button>
                      <button type="button" className="rounded p-1.5 hover:bg-sand disabled:opacity-30" disabled={i === page.sections!.length - 1} onClick={() => moveSection(i, 1)} aria-label="Move down"><ArrowDown className="h-4 w-4" aria-hidden /></button>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};
