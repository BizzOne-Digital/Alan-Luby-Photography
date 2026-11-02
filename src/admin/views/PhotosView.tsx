import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ImagePlus, Pencil, Trash2 } from 'lucide-react';
import { api } from '../../lib/api';
import { ImageField } from '../ImageField';
import { AdminPhoto, photoThumb, refreshPhotoLibrary } from '../PhotoPicker';
import {
  Badge, Checkbox, EmptyState, ErrorState, NumberField, PageHeader, Pager, Pagination, SelectField, Spinner, TextArea, TextField,
  btn, card, fieldErrors, inputClass, qs, useApi, useConfirm, useDebounced, useToast,
} from '../ui';

interface ServiceOption {
  slug: string;
  title: string;
  categoryLabel: string;
}

const useCategories = () => {
  const { data } = useApi<{ data: ServiceOption[] }>('/services?limit=100&sort=order');
  return data?.data ?? [];
};

export const PhotosView: React.FC = () => {
  const categories = useCategories();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [placement, setPlacement] = useState('');
  const [page, setPage] = useState(1);
  const search = useDebounced(q);
  useEffect(() => setPage(1), [search, category, placement]);
  const path = `/photos${qs({ q: search, category, placement: placement.startsWith('p:') ? placement.slice(2) : undefined, showInWork: placement === 'hidden' ? 'false' : undefined, page, limit: 48, sort: placement === 'p:featured' ? 'featured' : placement === 'p:marquee' ? 'marquee' : 'order' })}`;
  const { data, error, loading, reload } = useApi<{ data: AdminPhoto[]; pagination: Pagination }>(path);
  const confirm = useConfirm();
  const toast = useToast();
  const label = (slug: string) => categories.find((c) => c.slug === slug)?.categoryLabel ?? slug;

  const remove = async (p: AdminPhoto) => {
    if (!(await confirm({ title: `Delete “${p.title}”?`, text: 'The photo is removed from the website. Uploaded image files are deleted too. This cannot be undone.', confirmLabel: 'Delete photo', danger: true }))) return;
    try {
      await api(`/photos/${p._id}`, { method: 'DELETE' });
      refreshPhotoLibrary();
      toast.success('Photo deleted.');
      reload();
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <>
      <PageHeader
        title="Photos"
        text="Your portfolio. The order here is the order on the Work page; homepage placements are set on each photo."
        actions={<Link to="/admin/photos/new" className={btn.primary}><ImagePlus className="h-4 w-4" aria-hidden /> Add photo</Link>}
      />
      <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title or description" aria-label="Search photos" className={`${inputClass} mt-0`} />
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category" className={`${inputClass} mt-0`}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.categoryLabel}</option>)}
        </select>
        <select value={placement} onChange={(e) => setPlacement(e.target.value)} aria-label="Filter by placement" className={`${inputClass} mt-0`}>
          <option value="">Any placement</option>
          <option value="p:featured">Homepage selected work</option>
          <option value="p:marquee">Homepage photo strip</option>
          <option value="hidden">Not in the Work gallery</option>
        </select>
      </div>

      {error ? <ErrorState error={error} onRetry={reload} /> : loading && !data ? <Spinner /> : data?.data.length === 0 ? (
        <EmptyState title="No photos found" text={q || category || placement ? 'Try a different search or filter.' : 'Add your first photo to start the portfolio.'} action={<Link to="/admin/photos/new" className={btn.primary}>Add photo</Link>} />
      ) : (
        <>
          <ul className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 ${loading ? 'opacity-60' : ''}`}>
            {data?.data.map((p) => (
              <li key={p._id} className={`${card} flex flex-col overflow-hidden`}>
                <Link to={`/admin/photos/${p._id}`} className="block aspect-[4/3] bg-sand">
                  <img src={photoThumb(p)} alt="" loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: p.focus }} />
                </Link>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <p className="font-semibold leading-snug">{p.title}</p>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge>{label(p.category)}</Badge>
                    {!p.showInWork && <Badge tone="warn">Not in Work gallery</Badge>}
                    {p.featured > 0 && <Badge tone="accent">Selected work #{p.featured}</Badge>}
                    {p.marquee > 0 && <Badge tone="accent">Photo strip #{p.marquee}</Badge>}
                  </div>
                  <div className="mt-auto flex gap-2 pt-2">
                    <Link to={`/admin/photos/${p._id}`} className={btn.secondary}><Pencil className="h-4 w-4" aria-hidden /> Edit</Link>
                    <button type="button" className={btn.ghost} onClick={() => remove(p)}><Trash2 className="h-4 w-4" aria-hidden /> Delete</button>
                  </div>
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

type PhotoForm = Omit<AdminPhoto, '_id' | 'slug'>;
const EMPTY: PhotoForm = { title: '', alt: '', category: '', width: 0, height: 0, src: '', srcSet: '', focus: '50% 50%', order: 0, showInWork: true, featured: 0, marquee: 0 };

export const PhotoEditView: React.FC = () => {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const toast = useToast();
  const categories = useCategories();
  const { data, error, loading } = useApi<{ data: AdminPhoto }>(isNew ? null : `/photos/${id}`);
  const [form, setForm] = useState<PhotoForm>(EMPTY);
  const [saved, setSaved] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (data) {
      const { _id, slug, ...rest } = data.data;
      setForm({ ...EMPTY, ...rest });
      setSaved(rest.src);
    }
  }, [data]);
  useEffect(() => {
    if (isNew && !form.category && categories[0]) setForm((f) => ({ ...f, category: categories[0].slug }));
  }, [isNew, categories, form.category]);

  const set = <K extends keyof PhotoForm>(key: K) => (value: PhotoForm[K]) => setForm((f) => ({ ...f, [key]: value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.src) return setErrors({ src: 'Please upload an image.' });
    setBusy(true);
    setErrors({});
    try {
      const res = await api<{ data: AdminPhoto }>(isNew ? '/photos' : `/photos/${id}`, { method: isNew ? 'POST' : 'PATCH', body: form });
      setSaved(res.data.src);
      refreshPhotoLibrary();
      toast.success(isNew ? 'Photo added.' : 'Photo saved.');
      navigate('/admin/photos');
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
      <Link to="/admin/photos" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"><ArrowLeft className="h-4 w-4" aria-hidden /> All photos</Link>
      <PageHeader title={isNew ? 'Add a photo' : 'Edit photo'} actions={<button type="submit" className={btn.primary} disabled={busy}>{busy ? 'Saving…' : 'Save photo'}</button>} />
      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <div className={`${card} space-y-5 p-5`}>
          <ImageField
            label="Image *"
            folder="gallery"
            value={form.src}
            committed={saved}
            allowRemove={false}
            error={errors.src}
            hint="Upload a web-sized JPEG or WebP (about 2000px on the long side works well)."
            onChange={(url, size) => setForm((f) => ({ ...f, src: url, srcSet: '', ...(size && { width: size.width, height: size.height }) }))}
          />
          <TextField label="Focus point" name="focus" value={form.focus} onChange={set('focus')} error={errors.focus} hint='Where to keep the subject when a layout crops the photo, as "horizontal% vertical%". "50% 30%" keeps the upper middle.' />
          {form.width > 0 && <p className="text-sm text-muted">Original size: {form.width} × {form.height}px</p>}
        </div>
        <div className={`${card} space-y-5 p-5`}>
          <TextField label="Title *" name="title" value={form.title} onChange={set('title')} error={errors.title} maxLength={150} hint="Shown under the photo." />
          <TextArea label="Description for screen readers (alt text) *" name="alt" value={form.alt} onChange={set('alt')} error={errors.alt} rows={3} maxLength={300} hint="Describe what is visible, e.g. “A bride and groom cutting the cake”." />
          <SelectField label="Category *" name="category" value={form.category} onChange={set('category')} error={errors.category} options={categories.map((c) => ({ value: c.slug, label: c.categoryLabel }))} />
          <Checkbox label="Show in the Work gallery" checked={form.showInWork} onChange={set('showInWork')} hint="Turn off for photos used only on a page (for example the About page)." />
          <div className="grid gap-4 sm:grid-cols-3">
            <NumberField label="Gallery order" name="order" value={form.order} onChange={set('order')} error={errors.order} hint="Lower numbers come first." />
            <NumberField label="Homepage selected work" name="featured" value={form.featured} onChange={set('featured')} min={0} error={errors.featured} hint="Position, 0 = not shown." />
            <NumberField label="Homepage photo strip" name="marquee" value={form.marquee} onChange={set('marquee')} min={0} error={errors.marquee} hint="Position, 0 = not shown." />
          </div>
        </div>
      </div>
    </form>
  );
};
