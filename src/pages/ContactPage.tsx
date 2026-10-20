/// <reference types="vite/client" />
import React, { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { inquiryOptions, parseInquiry } from '../data/services';
import { EMAIL, PHONE, PHONE_HREF } from '../components/Footer';
import { PageMeta } from '../components/PageMeta';
import { TextReveal } from '../components/Motion';

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
const buildMailto = (v: Values) => {
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
 * Optional direct submission. Set VITE_FORM_ENDPOINT (e.g. a Formspree form URL, or https://api.web3forms.com/submit
 * together with VITE_FORM_ACCESS_KEY) at build time. The inquiry is POSTed as JSON and only reported as sent when the
 * service confirms it. Without an endpoint the form falls back to composing an email.
 */
const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;
const FORM_ACCESS_KEY = import.meta.env.VITE_FORM_ACCESS_KEY as string | undefined;

const submitInquiry = async (v: Values, subject: string) => {
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

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const subject = searchParams.get('subject');
  const [values, setValues] = useState<Values>({
    name: '',
    email: '',
    service: parseInquiry(searchParams.get('service')),
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
    const mail = buildMailto(values);
    setCopied(false);
    if (FORM_ENDPOINT) {
      if (trap) return; // honeypot filled in: almost certainly a bot
      setSendState('sending');
      try {
        await submitInquiry(values, mail.subject);
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
      <PageMeta
        title="Inquire"
        description="Contact Alan Luby about event, portrait, sports or live performance photography in South Florida. Email aluby1441@aol.com or call (561) 340-9310."
      />

      <section className="wrap grid gap-12 pb-20 pt-12 sm:pt-16 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
        <div>
          <TextReveal as="h1" text="Let’s talk about your photographs." className="text-4xl sm:text-5xl" />
          <p className="mt-4 max-w-xl text-lg text-muted">
            Tell Alan about your event, portrait session, game or performance. A few details are enough to start the
            conversation.
          </p>

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
                {FORM_ENDPOINT
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
                  {inquiryOptions.map((o) => <option key={o} value={o}>{o}</option>)}
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
              {FORM_ENDPOINT && (
                <div aria-hidden className="absolute -left-[9999px]">
                  <label>Leave this empty<input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} /></label>
                </div>
              )}
              <button type="submit" className="btn-primary" disabled={sendState === 'sending'}>
                {FORM_ENDPOINT ? (sendState === 'sending' ? 'Sending…' : 'Send inquiry') : 'Prepare email to Alan'}
              </button>
            </form>
          )}
        </div>

        <aside className="space-y-10 lg:pt-28">
          <div className="space-y-3">
            <h2 className="font-sans text-lg font-semibold">Prefer to reach Alan directly?</h2>
            <p>
              <a href={`mailto:${EMAIL}`} className="text-link text-lg">{EMAIL}</a>
            </p>
            <p>
              <a href={PHONE_HREF} className="text-link text-lg">{PHONE}</a>
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="font-sans text-lg font-semibold">Where Alan works</h2>
            <p className="text-muted">Based in Boynton Beach, Florida, photographing events, portraits, sports and performances across South Florida.</p>
          </div>
          <div className="space-y-2">
            <h2 className="font-sans text-lg font-semibold">Helpful to include</h2>
            <ul className="space-y-1 text-muted">
              <li>The type of occasion or session</li>
              <li>The date, if it’s set</li>
              <li>The venue or area</li>
              <li>Anything you especially want captured</li>
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
};
