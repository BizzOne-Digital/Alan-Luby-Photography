/// <reference types="vite/client" />
import React, { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { parseInquiry } from '../data/services';
import { SOCIAL_ICONS } from '../components/Footer';
import { PageMeta } from '../components/PageMeta';
import { TextReveal } from '../components/Motion';
import { api, apiEnabled } from '../lib/api';
import { telHref } from '../site/content';
import { useSite } from '../site/SiteProvider';

type Field = 'name' | 'email' | 'service' | 'date' | 'location' | 'phone' | 'message';
type Values = Record<Field, string>;

const validate = (v: Values): Partial<Record<Field, string>> => {
  const errors: Partial<Record<Field, string>> = {};
  if (!v.name.trim()) errors.name = 'Please enter your name.';
  if (!v.email.trim()) errors.email = 'Please enter your email address so Alan can reply.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) errors.email = 'Please check the email address, for example name@example.com.';
  if (!v.message.trim()) errors.message = 'Please tell Alan a little about what you need.';
  return errors;
};

/**
 * No form backend is configured, so submitting composes an email in the visitor's own email app.
 * The UI says so plainly and never claims the inquiry was delivered.
 */
const buildMailto = (v: Values, EMAIL: string) => {
  const details = [
    `Name: ${v.name}`,
    `Email: ${v.email}`,
    v.phone && `Phone: ${v.phone}`,
    `Photography: ${v.service || 'Not specified'}`,
    v.date && `Date: ${v.date}`,
    v.location && `Location: ${v.location}`,
  ].filter(Boolean);
  const body = `${details.join('\n')}\n\n${v.message.trim()}`;
  const subject = `Photography inquiry: ${v.service || 'General'}${v.date ? ` (${v.date})` : ''}`;
  return { body, subject, href: `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
};

/**
 * Direct submission. With a backend configured (VITE_API_URL) the inquiry is stored there and appears in the admin.
 * Otherwise, optionally set VITE_FORM_ENDPOINT (e.g. a Formspree form URL, or https://api.web3forms.com/submit
 * together with VITE_FORM_ACCESS_KEY) at build time. The inquiry is POSTed as JSON and only reported as sent when the
 * service confirms it. Without an endpoint the form falls back to composing an email.
 */
const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;
const FORM_ACCESS_KEY = import.meta.env.VITE_FORM_ACCESS_KEY as string | undefined;

const submitInquiry = async (v: Values, subject: string, trap: string) => {
  if (apiEnabled) {
    await api('/contact', { method: 'POST', body: { ...v, website: trap } });
    return;
  }
  const res = await fetch(FORM_ENDPOINT!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ ...v, subject, ...(FORM_ACCESS_KEY ? { access_key: FORM_ACCESS_KEY } : {}) }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) throw new Error('Inquiry not accepted');
};

const inputClass =
  'mt-2 block w-full min-h-12 rounded-md border border-ink/20 bg-white px-4 py-3 text-base text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25 aria-[invalid=true]:border-red-700';

const CAN_SEND = apiEnabled || Boolean(FORM_ENDPOINT);

export const ContactPage: React.FC = () => {
  const site = useSite();
  const { email: EMAIL, phone: PHONE, phone2: PHONE_2, socials: SOCIALS } = site.settings;
  const PHONE_HREF = telHref(PHONE);
  const { content: c, seoTitle, seoDescription } = site.page('contact');
  const [searchParams] = useSearchParams();
  const subject = searchParams.get('subject');
  const [values, setValues] = useState<Values>({
    name: '',
    email: '',
    service: parseInquiry(searchParams.get('service'), site.inquiryOptions),
    date: '',
    location: '',
    phone: '',
    message: subject ? `I'd like to discuss: ${subject}\n\n` : '',
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [composed, setComposed] = useState<{ body: string; subject: string; href: string } | null>(null);
  const [sendState, setSendState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [trap, setTrap] = useState('');
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const noticeRef = useRef<HTMLDivElement>(null);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const name = e.target.name as Field;
    setValues((v) => ({ ...v, [name]: e.target.value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    const first = (Object.keys(found) as Field[])[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    const mail = buildMailto(values, EMAIL);
    setCopied(false);
    if (CAN_SEND) {
      if (trap && !apiEnabled) return; // honeypot filled in: almost certainly a bot (the backend checks it itself)
      setSendState('sending');
      try {
        await submitInquiry(values, mail.subject, trap);
        setSendState('sent');
      } catch {
        setSendState('failed');
        setComposed(mail);
      }
    } else {
      setComposed(mail);
      window.location.href = mail.href;
    }
    requestAnimationFrame(() => noticeRef.current?.focus());
  };

  const copy = async () => {
    if (!composed) return;
    try {
      await navigator.clipboard.writeText(composed.body);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const field = (name: Field, label: string, input: React.ReactNode, hint?: string) => (
    <div>
      <label htmlFor={name} className="text-[0.95rem] font-semibold">
        {label}
        {hint && <span className="font-normal text-muted"> {hint}</span>}
      </label>
      {input}
      {errors[name] && (
        <p id={`${name}-error`} className="mt-1.5 text-sm font-medium text-red-800">{errors[name]}</p>
      )}
    </div>
  );

  const a11y = (name: Field) => ({
    id: name,
    name,
    value: values[name],
    onChange: set,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
    className: inputClass,
  });

  return (
    <>
      <PageMeta title={seoTitle || undefined} description={seoDescription} />

      <section className="wrap grid gap-12 pb-20 pt-12 sm:pt-16 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
        <div>
          <TextReveal as="h1" text={c.heading} className="text-4xl sm:text-5xl" />
          <p className="mt-4 max-w-xl text-lg text-muted">{c.intro}</p>

          {sendState === 'sent' ? (
            <div ref={noticeRef} tabIndex={-1} className="mt-10 space-y-4 rounded-lg border border-accent/30 bg-white p-6 sm:p-8" role="status">
              <h2 className="text-2xl">Thank you, your inquiry was sent</h2>
              <p>
                Alan has received your message about <strong>{values.service || 'your photography'}</strong> and will reply to{' '}
                <strong>{values.email}</strong>. If it’s time-sensitive, you’re welcome to call{' '}
                <a href={PHONE_HREF} className="text-link">{PHONE}</a>.
              </p>
            </div>
          ) : composed ? (
            <div ref={noticeRef} tabIndex={-1} className="mt-10 space-y-4 rounded-lg border border-accent/30 bg-white p-6 sm:p-8" role="status">
              <h2 className="text-2xl">{sendState === 'failed' ? 'Your inquiry could not be sent' : 'Your email is ready to send'}</h2>
              {sendState === 'failed' && (
                <p>
                  Something went wrong on our side and your message was <strong>not</strong> delivered. Your details are
                  safe below: send them by email instead, or try again.
                </p>
              )}
              <p hidden={sendState === 'failed'}>
                Your email app should have opened with your inquiry written out. <strong>It has not been sent yet.</strong>{' '}
                Please review it and press Send in your email app.
              </p>
              <p className="text-muted">
                If nothing opened, copy the text below and email it to{' '}
                <a href={`mailto:${EMAIL}`} className="text-link">{EMAIL}</a>, or call{' '}
                <a href={PHONE_HREF} className="text-link">{PHONE}</a>.
              </p>
              <pre className="max-h-60 overflow-auto whitespace-pre-wrap rounded-md bg-paper p-4 font-sans text-sm">{composed.body}</pre>
              <div className="flex flex-wrap gap-3">
                <a href={composed.href} className="btn-primary">Open email again</a>
                <button type="button" onClick={copy} className="btn-secondary">{copied ? 'Copied' : 'Copy text'}</button>
                <button type="button" onClick={() => { setComposed(null); setSendState('idle'); }} className="btn-secondary">
                  {sendState === 'failed' ? 'Try again' : 'Edit inquiry'}
                </button>
              </div>
            </div>
          ) : (
            <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-10 space-y-6" aria-describedby="form-note">
              <p id="form-note" className="rounded-md bg-sand px-4 py-3 text-[0.95rem]">
                {CAN_SEND
                  ? 'Your inquiry goes straight to Alan. Fields marked * are required.'
                  : 'This form prepares an email in your own email app. Nothing is sent until you press Send there. Fields marked * are required.'}
              </p>
              <div className="grid gap-6 sm:grid-cols-2">
                {field('name', 'Name *', <input type="text" autoComplete="name" {...a11y('name')} />)}
                {field('email', 'Email *', <input type="email" autoComplete="email" inputMode="email" {...a11y('email')} />)}
              </div>
              {field(
                'service',
                'What would you like photographed?',
                <select {...a11y('service')}>
                  <option value="">Choose one (optional)</option>
                  {site.inquiryOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>,
              )}
              <div className="grid gap-6 sm:grid-cols-2">
                {field('date', 'Date', <input type="date" {...a11y('date')} />, '(optional)')}
                {field('location', 'Location', <input type="text" autoComplete="address-level2" placeholder="City or venue" {...a11y('location')} />, '(optional)')}
              </div>
              {field('phone', 'Phone', <input type="tel" autoComplete="tel" {...a11y('phone')} />, '(optional)')}
              {field(
                'message',
                'Tell Alan about it *',
                <textarea rows={6} placeholder="The occasion, roughly how long, who will be there, anything else that matters." {...a11y('message')} />,
              )}
              {CAN_SEND && (
                <div aria-hidden className="absolute -left-[9999px]">
                  <label>Leave this empty<input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} /></label>
                </div>
              )}
              <button type="submit" className="btn-primary" disabled={sendState === 'sending'}>
                {CAN_SEND ? (sendState === 'sending' ? 'Sending…' : 'Send inquiry') : 'Prepare email to Alan'}
              </button>
            </form>
          )}
        </div>

        <aside className="space-y-10 lg:pt-28">
          <div className="space-y-3">
            <h2 className="font-sans text-lg font-semibold">{c.directHeading}</h2>
            {EMAIL && (
            <p>
              <a href={`mailto:${EMAIL}`} className="text-link text-lg">{EMAIL}</a>
            </p>
            )}
            {PHONE && (
            <p>
              <a href={PHONE_HREF} className="text-link text-lg">{PHONE}</a>
            </p>
            )}
            {PHONE_2 && (
            <p>
              <a href={telHref(PHONE_2)} className="text-link text-lg">{PHONE_2}</a>
            </p>
            )}
            {SOCIALS.map(({ label, url, icon }) => {
              const Icon = SOCIAL_ICONS[icon] ?? Globe;
              return (
              <p key={url}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-link inline-flex items-center gap-2 text-lg">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {label}<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </p>
              );
            })}
          </div>
          {c.whereText && (
          <div className="space-y-2">
            <h2 className="font-sans text-lg font-semibold">{c.whereHeading}</h2>
            <p className="text-muted">{c.whereText}</p>
          </div>
          )}
          {c.helpfulItems.trim() && (
          <div className="space-y-2">
            <h2 className="font-sans text-lg font-semibold">{c.helpfulHeading}</h2>
            <ul className="space-y-1 text-muted">
              {c.helpfulItems.split('\n').map((item) => item.trim()).filter(Boolean).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          )}
        </aside>
      </section>
    </>
  );
};
