import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react';
import { api } from '../../lib/api';
import { PhotoPicker, photoThumb, usePhotoLibrary } from '../PhotoPicker';
import {
  Badge, Checkbox, EmptyState, ErrorState, NumberField, PageHeader, SelectField, Spinner, TextArea, TextField,
  btn, card, fieldErrors, useApi, useConfirm, useToast,
} from '../ui';
import { AdminTestimonial, testimonialLabel } from './TestimonialsView';

export interface AdminService {
  _id: string;
  slug: string;
  title: string;
  shortTitle: string;
  categoryLabel: string;
  inquiryValue: string;
  summary: string;
  whoFor: string;
  photographs: string[];
  image: string;
  supporting: string[];
  testimonial: string | null;
  order: number;
  visible: boolean;
}

export const ServicesView: React.FC = () => {
  const { data, error, loading, reload } = useApi<{ data: AdminService[] }>('/services?limit=100&sort=order');
  const { photos } = usePhotoLibrary();
  const confirm = useConfirm();
  const toast = useToast();

  const remove = async (s: AdminService) => {
    if (!(await confirm({ title: `Delete “${s.title}”?`, text: 'This removes the service and its Work page category. Services that still have photos cannot be deleted; move those photos first.', confirmLabel: 'Delete service', danger: true }))) return;
    try {
      await api(`/services/${s._id}`, { method: 'DELETE' });
      toast.success('Service deleted.');
      reload();
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <>
      <PageHeader
        title="Services"
        text="Each service has a section on the Services page, a card on the homepage, a Work page category and a contact form option."
        actions={<Link to="/admin/services/new" className={btn.primary}><Plus className="h-4 w-4" aria-hidden /> Add service</Link>}
      />
      {error ? <ErrorState error={error} onRetry={reload} /> : loading && !data ? <Spinner /> : data?.data.length === 0 ? (
        <EmptyState title="No services yet" action={<Link to="/admin/services/new" className={btn.primary}>Add service</Link>} />
      ) : (
        <ul className="space-y-3">
          {data?.data.map((s) => {
            const cover = photos?.find((p) => p.slug === s.image);
            return (
              <li key={s._id} className={`${card} flex flex-col gap-4 p-4 sm:flex-row sm:items-center`}>
                <div className="h-20 w-28 shrink-0 overflow-hidden rounded bg-sand">{cover && <img src={photoThumb(cover)} alt="" className="h-full w-full object-cover" />}</div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{s.title}</p>
                  <p className="line-clamp-2 text-sm text-muted">{s.summary}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <Badge>Order {s.order}</Badge>
                    {s.visible ? <Badge tone="accent">Visible</Badge> : <Badge tone="warn">Hidden</Badge>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/admin/services/${s._id}`} className={btn.secondary}><Pencil className="h-4 w-4" aria-hidden /> Edit</Link>
                  <button type="button" className={btn.ghost} onClick={() => remove(s)}><Trash2 className="h-4 w-4" aria-hidden /> Delete</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

type ServiceForm = Omit<AdminService, '_id'>;
const EMPTY: ServiceForm = { slug: '', title: '', shortTitle: '', categoryLabel: '', inquiryValue: '', summary: '', whoFor: '', photographs: [], image: '', supporting: [], testimonial: null, order: 0, visible: true };

export const ServiceEditView: React.FC = () => {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const toast = useToast();
  const { data, error, loading } = useApi<{ data: AdminService }>(isNew ? null : `/services/${id}`);
  const testimonials = useApi<{ data: AdminTestimonial[] }>('/testimonials?limit=100&sort=order');
  const [form, setForm] = useState<ServiceForm>(EMPTY);
  const [photographs, setPhotographs] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (data) {
      const { _id, ...rest } = data.data;
      setForm({ ...EMPTY, ...rest });
      setPhotographs(rest.photographs.join('\n'));
    }
  }, [data]);

  const set = <K extends keyof ServiceForm>(key: K) => (value: ServiceForm[K]) => setForm((f) => ({ ...f, [key]: value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    const { slug, ...fields } = form;
    const body = { ...(isNew && { slug }), ...fields, photographs: photographs.split('\n').map((l) => l.trim()).filter(Boolean) };
    try {
      await api(isNew ? '/services' : `/services/${id}`, { method: isNew ? 'POST' : 'PATCH', body });
      toast.success(isNew ? 'Service added.' : 'Service saved.');
      navigate('/admin/services');
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
      <Link to="/admin/services" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"><ArrowLeft className="h-4 w-4" aria-hidden /> All services</Link>
      <PageHeader title={isNew ? 'Add a service' : `Edit ${form.title || 'service'}`} actions={<button type="submit" className={btn.primary} disabled={busy}>{busy ? 'Saving…' : 'Save service'}</button>} />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className={`${card} space-y-5 p-5`}>
          <TextField label="Title *" name="title" value={form.title} onChange={set('title')} error={errors.title} hint="e.g. “Weddings & engagements”" />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Short title *" name="shortTitle" value={form.shortTitle} onChange={set('shortTitle')} error={errors.shortTitle} hint="Used in buttons: “Inquire about weddings”." />
            <TextField label="Work page filter label *" name="categoryLabel" value={form.categoryLabel} onChange={set('categoryLabel')} error={errors.categoryLabel} />
          </div>
          <TextField label="Contact form option *" name="inquiryValue" value={form.inquiryValue} onChange={set('inquiryValue')} error={errors.inquiryValue} hint="What visitors pick in “What would you like photographed?”." />
          {isNew ? (
            <TextField label="Web address key *" name="slug" value={form.slug} onChange={(v) => set('slug')(v.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} error={errors.slug} hint="Lowercase letters and dashes, e.g. “corporate”. Used in links (/services#corporate) and cannot be changed later." />
          ) : (
            <p className="text-sm text-muted">Web address key: <code className="rounded bg-sand px-1">{form.slug}</code></p>
          )}
          <TextArea label="Summary *" name="summary" value={form.summary} onChange={set('summary')} error={errors.summary} rows={3} />
          <TextArea label="Who it’s for" name="whoFor" value={form.whoFor} onChange={set('whoFor')} error={errors.whoFor} rows={3} />
          <TextArea label="What Alan photographs (one per line)" name="photographs" value={photographs} onChange={setPhotographs} error={errors.photographs} rows={5} />
        </div>
        <div className={`${card} space-y-5 p-5`}>
          <PhotoPicker label="Main photo *" value={form.image ? [form.image] : []} onChange={(v) => set('image')(v[0] ?? '')} error={errors.image} />
          <PhotoPicker label="Supporting photos" multiple max={6} value={form.supporting} onChange={set('supporting')} error={errors.supporting} hint="Shown smaller beside the main photo on the Services page. Two works best." />
          <SelectField
            label="Client quote"
            name="testimonial"
            value={form.testimonial ?? ''}
            onChange={(v) => set('testimonial')(v || null)}
            error={errors.testimonial}
            options={[{ value: '', label: 'No quote' }, ...(testimonials.data?.data ?? []).map((t) => ({ value: t._id, label: testimonialLabel(t) }))]}
          />
          <NumberField label="Display order" name="order" value={form.order} onChange={set('order')} hint="Lower numbers come first." />
          <Checkbox label="Visible on the website" checked={form.visible} onChange={set('visible')} hint="Hidden services, and their photos, disappear from every page." />
        </div>
      </div>
    </form>
  );
};
