import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react';
import { api } from '../../lib/api';
import {
  Badge, Checkbox, EmptyState, ErrorState, NumberField, PageHeader, Pager, Pagination, Spinner, TextArea, TextField,
  btn, card, fieldErrors, inputClass, qs, useApi, useConfirm, useDebounced, useToast,
} from '../ui';

export interface AdminTestimonial {
  _id: string;
  quote: string;
  excerpt: string;
  clientRole: string;
  organization: string;
  location: string;
  showOnPage: boolean;
  order: number;
  featuredOnHome: number;
}

export const testimonialLabel = (t: AdminTestimonial) => `${t.clientRole.split(',')[0]}: “${t.quote.slice(0, 60)}${t.quote.length > 60 ? '…' : ''}”`;

export const TestimonialsView: React.FC = () => {
  const [q, setQ] = useState('');
  const [shown, setShown] = useState('');
  const [page, setPage] = useState(1);
  const search = useDebounced(q);
  useEffect(() => setPage(1), [search, shown]);
  const { data, error, loading, reload } = useApi<{ data: AdminTestimonial[]; pagination: Pagination }>(`/testimonials${qs({ q: search, showOnPage: shown, page, limit: 25, sort: 'order' })}`);
  const confirm = useConfirm();
  const toast = useToast();

  const remove = async (t: AdminTestimonial) => {
    if (!(await confirm({ title: 'Delete this testimonial?', text: `From ${t.clientRole}. This cannot be undone.`, confirmLabel: 'Delete testimonial', danger: true }))) return;
    try {
      await api(`/testimonials/${t._id}`, { method: 'DELETE' });
      toast.success('Testimonial deleted.');
      reload();
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <>
      <PageHeader
        title="Testimonials"
        text="Client quotes, word for word. Choose which appear on the Testimonials page and on the homepage."
        actions={<Link to="/admin/testimonials/new" className={btn.primary}><Plus className="h-4 w-4" aria-hidden /> Add testimonial</Link>}
      />
      <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search quotes and names" aria-label="Search testimonials" className={`${inputClass} mt-0`} />
        <select value={shown} onChange={(e) => setShown(e.target.value)} aria-label="Filter" className={`${inputClass} mt-0`}>
          <option value="">All testimonials</option>
          <option value="true">On the Testimonials page</option>
          <option value="false">Not on the Testimonials page</option>
        </select>
      </div>
      {error ? <ErrorState error={error} onRetry={reload} /> : loading && !data ? <Spinner /> : data?.data.length === 0 ? (
        <EmptyState title="No testimonials found" action={<Link to="/admin/testimonials/new" className={btn.primary}>Add testimonial</Link>} />
      ) : (
        <>
          <ul className="space-y-3">
            {data?.data.map((t) => (
              <li key={t._id} className={`${card} flex flex-col gap-3 p-4 sm:flex-row sm:items-start`}>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-3">“{t.quote}”</p>
                  <p className="mt-1 text-sm text-muted">{[t.clientRole, t.organization, t.location].filter(Boolean).join(' · ')}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {t.showOnPage ? <Badge tone="accent">Testimonials page · order {t.order}</Badge> : <Badge>Not on the page</Badge>}
                    {t.featuredOnHome > 0 && <Badge tone="accent">Homepage #{t.featuredOnHome}</Badge>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/admin/testimonials/${t._id}`} className={btn.secondary}><Pencil className="h-4 w-4" aria-hidden /> Edit</Link>
                  <button type="button" className={btn.ghost} onClick={() => remove(t)}><Trash2 className="h-4 w-4" aria-hidden /> Delete</button>
                </div>
              </li>
            ))}
          </ul>
          <Pager pagination={data?.pagination} onPage={setPage} />
        </>
      )}
    </>
  );
};

type TestimonialForm = Omit<AdminTestimonial, '_id'>;
const EMPTY: TestimonialForm = { quote: '', excerpt: '', clientRole: '', organization: '', location: '', showOnPage: false, order: 0, featuredOnHome: 0 };

export const TestimonialEditView: React.FC = () => {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const toast = useToast();
  const { data, error, loading } = useApi<{ data: AdminTestimonial }>(isNew ? null : `/testimonials/${id}`);
  const [form, setForm] = useState<TestimonialForm>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (data) {
      const { _id, ...rest } = data.data;
      setForm({ ...EMPTY, ...rest });
    }
  }, [data]);

  const set = <K extends keyof TestimonialForm>(key: K) => (value: TestimonialForm[K]) => setForm((f) => ({ ...f, [key]: value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    try {
      await api(isNew ? '/testimonials' : `/testimonials/${id}`, { method: isNew ? 'POST' : 'PATCH', body: form });
      toast.success(isNew ? 'Testimonial added.' : 'Testimonial saved.');
      navigate('/admin/testimonials');
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(err);
    } finally {
      setBusy(false);
    }
  };

  if (!isNew && error) return <ErrorState error={error} />;
  if (!isNew && (loading || !data)) return <Spinner />;

  return (
    <form onSubmit={save} noValidate>
      <Link to="/admin/testimonials" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"><ArrowLeft className="h-4 w-4" aria-hidden /> All testimonials</Link>
      <PageHeader title={isNew ? 'Add a testimonial' : 'Edit testimonial'} actions={<button type="submit" className={btn.primary} disabled={busy}>{busy ? 'Saving…' : 'Save testimonial'}</button>} />
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className={`${card} space-y-5 p-5`}>
          <TextArea label="Quote *" name="quote" value={form.quote} onChange={set('quote')} error={errors.quote} rows={7} hint="Paste the client’s words exactly as written." />
          <TextArea label="Short excerpt" name="excerpt" value={form.excerpt} onChange={set('excerpt')} error={errors.excerpt} rows={3} hint="Optional, for the homepage and service sections. Must be copied from the quote; mark skipped words with “ … ” (space, ellipsis, space)." />
        </div>
        <div className={`${card} space-y-5 p-5`}>
          <TextField label="Name and role *" name="clientRole" value={form.clientRole} onChange={set('clientRole')} error={errors.clientRole} hint="e.g. “Lynne Salus, Meeting and Event Planner”" />
          <TextField label="Organization" name="organization" value={form.organization} onChange={set('organization')} error={errors.organization} />
          <TextField label="Location" name="location" value={form.location} onChange={set('location')} error={errors.location} />
          <Checkbox label="Show on the Testimonials page" checked={form.showOnPage} onChange={set('showOnPage')} />
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField label="Page order" name="order" value={form.order} onChange={set('order')} hint="Lower numbers come first." />
            <NumberField label="Homepage position" name="featuredOnHome" value={form.featuredOnHome} onChange={set('featuredOnHome')} min={0} hint="0 = not on the homepage. The homepage shows the excerpt." />
          </div>
        </div>
      </div>
    </form>
  );
};
