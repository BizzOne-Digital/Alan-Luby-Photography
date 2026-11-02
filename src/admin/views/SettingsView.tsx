import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { api } from '../../lib/api';
import { SETTINGS_DEFAULTS, SiteSettings, SocialIcon } from '../../site/content';
import { ErrorState, PageHeader, SelectField, Spinner, TextArea, TextField, btn, card, fieldErrors, useApi, useToast } from '../ui';

const ICONS: { value: SocialIcon; label: string }[] = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'blog', label: 'Blog' },
  { value: 'website', label: 'Other website' },
];

export const SettingsView: React.FC = () => {
  const toast = useToast();
  const { data, error, loading, reload } = useApi<{ data: Partial<SiteSettings> }>('/settings');
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (data) setForm({ ...SETTINGS_DEFAULTS, ...data.data });
  }, [data]);

  if (error) return <ErrorState error={error} onRetry={reload} />;
  if (loading || !form) return <Spinner />;

  const set = <K extends keyof SiteSettings>(key: K) => (value: SiteSettings[K]) => setForm((f) => f && { ...f, [key]: value });
  const setSocial = (i: number, patch: Partial<SiteSettings['socials'][number]>) => set('socials')(form.socials.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const moveSocial = (i: number, d: number) => {
    const next = [...form.socials];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    set('socials')(next);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    try {
      const { data: saved } = await api<{ data: Partial<SiteSettings> }>('/settings', { method: 'PUT', body: form });
      setForm({ ...SETTINGS_DEFAULTS, ...saved });
      toast.success('Settings saved.');
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save} noValidate>
      <PageHeader title="Settings" text="Details used across the whole website: header, footer, contact page and search results." actions={<button type="submit" className={btn.primary} disabled={busy}>{busy ? 'Saving…' : 'Save settings'}</button>} />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <fieldset className={`${card} space-y-5 p-5`}>
            <legend className="float-left mb-1 w-full font-sans text-lg font-semibold">Contact details</legend>
            <TextField label="Email address" name="email" type="email" value={form.email} onChange={set('email')} error={errors.email} hint="Shown on every page; the contact form fallback also writes to it." />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Main phone" name="phone" value={form.phone} onChange={set('phone')} error={errors.phone} hint="e.g. (561) 340-9310" />
              <TextField label="Second phone" name="phone2" value={form.phone2} onChange={set('phone2')} error={errors.phone2} hint="Leave empty to hide." />
            </div>
          </fieldset>

          <fieldset className={`${card} space-y-4 p-5`}>
            <legend className="float-left mb-1 w-full font-sans text-lg font-semibold">Social links</legend>
            {form.socials.length === 0 && <p className="text-sm text-muted">No social links. Add one below.</p>}
            {form.socials.map((s, i) => (
              <div key={i} className="grid gap-3 rounded-lg border border-line p-3 sm:grid-cols-[9rem_1fr_auto]">
                <SelectField label="Network" name={`social-icon-${i}`} value={s.icon} onChange={(v) => setSocial(i, { icon: v as SocialIcon })} options={ICONS} />
                <div className="grid gap-3 sm:grid-cols-[8rem_1fr]">
                  <TextField label="Label" name={`social-label-${i}`} value={s.label} onChange={(v) => setSocial(i, { label: v })} error={errors[`socials.${i}.label`]} />
                  <TextField label="Address" name={`social-url-${i}`} value={s.url} onChange={(v) => setSocial(i, { url: v })} error={errors[`socials.${i}.url`]} placeholder="https://" />
                </div>
                <div className="flex items-end gap-1">
                  <button type="button" className="rounded p-2 hover:bg-sand disabled:opacity-30" disabled={i === 0} onClick={() => moveSocial(i, -1)} aria-label={`Move ${s.label} up`}><ArrowUp className="h-4 w-4" aria-hidden /></button>
                  <button type="button" className="rounded p-2 hover:bg-sand disabled:opacity-30" disabled={i === form.socials.length - 1} onClick={() => moveSocial(i, 1)} aria-label={`Move ${s.label} down`}><ArrowDown className="h-4 w-4" aria-hidden /></button>
                  <button type="button" className="rounded p-2 text-red-800 hover:bg-red-50" onClick={() => set('socials')(form.socials.filter((_, j) => j !== i))} aria-label={`Remove ${s.label}`}><Trash2 className="h-4 w-4" aria-hidden /></button>
                </div>
              </div>
            ))}
            <button type="button" className={btn.secondary} onClick={() => set('socials')([...form.socials, { label: '', url: '', icon: 'instagram' }])}>
              <Plus className="h-4 w-4" aria-hidden /> Add social link
            </button>
          </fieldset>
        </div>

        <div className="space-y-6">
          <fieldset className={`${card} space-y-5 p-5`}>
            <legend className="float-left mb-1 w-full font-sans text-lg font-semibold">Website</legend>
            <TextField label="Business name" name="siteName" value={form.siteName} onChange={set('siteName')} error={errors.siteName} hint="Used in browser tabs and the footer copyright line." />
            <TextArea label="Footer text" name="footerText" value={form.footerText} onChange={set('footerText')} error={errors.footerText} rows={3} />
          </fieldset>
          <fieldset className={`${card} space-y-5 p-5`}>
            <legend className="float-left mb-1 w-full font-sans text-lg font-semibold">Closing invitation</legend>
            <p className="text-sm text-muted">The green band at the end of most pages. The homepage and About page have their own wording under Pages.</p>
            <TextField label="Heading" name="inquiryTitle" value={form.inquiryTitle} onChange={set('inquiryTitle')} error={errors.inquiryTitle} />
            <TextArea label="Text" name="inquiryText" value={form.inquiryText} onChange={set('inquiryText')} error={errors.inquiryText} rows={3} />
          </fieldset>
          <fieldset className={`${card} space-y-5 p-5`}>
            <legend className="float-left mb-1 w-full font-sans text-lg font-semibold">Search engines</legend>
            <TextField label="Homepage title" name="seoTitle" value={form.seoTitle} onChange={set('seoTitle')} error={errors.seoTitle} hint="Shown after the business name on the homepage tab and in search results." />
            <TextArea label="Default description" name="seoDescription" value={form.seoDescription} onChange={set('seoDescription')} error={errors.seoDescription} rows={3} hint="Used for any page without its own description." />
          </fieldset>
        </div>
      </div>
    </form>
  );
};
