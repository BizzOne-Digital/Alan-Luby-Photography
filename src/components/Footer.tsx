import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Globe, Instagram, Linkedin, Music2, PenLine, Twitter, Youtube } from 'lucide-react';
import { Wordmark } from './Header';
import { telHref, SocialIcon } from '../site/content';
import { useSite } from '../site/SiteProvider';

export const SOCIAL_ICONS: Record<SocialIcon, React.FC<{ className?: string; 'aria-hidden'?: boolean | 'true' }>> = {
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  facebook: Facebook,
  blog: PenLine,
  x: Twitter,
  tiktok: Music2,
  website: Globe,
};

export const Footer: React.FC = () => {
  const { settings, services, page } = useSite();
  const { email, phone, phone2, socials } = settings;
  const explore = ([['/work', 'Work', 'work'], ['/about', 'About', 'about'], ['/testimonials', 'Testimonials', 'testimonials'], ['/contact', 'Inquire', 'contact']] as const).filter(
    ([, , key]) => page(key).published,
  );

  return (
  <footer className="border-t border-line bg-sand/60">
    <div className="wrap grid gap-10 py-14 sm:grid-cols-2 xl:grid-cols-[minmax(360px,1.4fr)_1fr_1fr_1fr]">
      <div className="space-y-3 sm:col-span-2 xl:col-span-1">
        <Wordmark />
        <p className="max-w-xs text-[0.95rem] text-muted">
          {settings.footerText}
        </p>
      </div>

      <div>
        <h2 className="mb-3 font-sans text-sm font-semibold text-ink">Contact</h2>
        <ul className="space-y-2 text-[0.95rem]">
          {email && <li><a href={`mailto:${email}`} className="text-muted hover:text-ink">{email}</a></li>}
          {phone && <li><a href={telHref(phone)} className="text-muted hover:text-ink">{phone}</a></li>}
          {phone2 && <li><a href={telHref(phone2)} className="text-muted hover:text-ink">{phone2}</a></li>}
          {socials.map(({ label, url, icon }) => {
            const Icon = SOCIAL_ICONS[icon] ?? Globe;
            return (
            <li key={url}>
              <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-muted hover:text-ink">
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            );
          })}
        </ul>
      </div>

      {page('services').published && (
      <div>
        <h2 className="mb-3 font-sans text-sm font-semibold text-ink">Services</h2>
        <ul className="space-y-2 text-[0.95rem]">
          {services.map((s) => (
            <li key={s.id}>
              <Link to={`/services#${s.id}`} className="text-muted hover:text-ink">{s.title}</Link>
            </li>
          ))}
        </ul>
      </div>
      )}

      <div>
        <h2 className="mb-3 font-sans text-sm font-semibold text-ink">Explore</h2>
        <ul className="space-y-2 text-[0.95rem]">
          {explore.map(([to, label]) => (
            <li key={to}><Link to={to} className="text-muted hover:text-ink">{label}</Link></li>
          ))}
        </ul>
      </div>
    </div>
    <div className="wrap border-t border-line py-6 text-sm text-muted">
      © {new Date().getFullYear()} {settings.siteName}. All photographs by Alan Luby.
    </div>
  </footer>
  );
};
