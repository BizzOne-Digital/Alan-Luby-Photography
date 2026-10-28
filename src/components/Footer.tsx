import React from 'react';
import { Link } from 'react-router-dom';
import { Wordmark } from './Header';
import { servicesData } from '../data/services';

export const EMAIL = 'aluby1441@aol.com';
export const PHONE = '(561) 340-9310';
export const PHONE_HREF = 'tel:+15613409310';
export const SOCIALS = [
  ['Facebook', 'https://www.facebook.com/alan.luby'],
  ['Instagram', 'https://www.instagram.com/alan_luby/'],
];

export const Footer: React.FC = () => (
  <footer className="border-t border-line bg-sand/60">
    <div className="wrap grid gap-10 py-14 sm:grid-cols-2 xl:grid-cols-[minmax(360px,1.4fr)_1fr_1fr_1fr]">
      <div className="space-y-3 sm:col-span-2 xl:col-span-1">
        <Wordmark />
        <p className="max-w-xs text-[0.95rem] text-muted">
          Event, wedding, portrait, sports and live performance photography. Based in Boynton Beach, Florida, serving South Florida.
        </p>
      </div>

      <div>
        <h2 className="mb-3 font-sans text-sm font-semibold text-ink">Contact</h2>
        <ul className="space-y-2 text-[0.95rem]">
          <li><a href={`mailto:${EMAIL}`} className="text-muted hover:text-ink">{EMAIL}</a></li>
          <li><a href={PHONE_HREF} className="text-muted hover:text-ink">{PHONE}</a></li>
          {SOCIALS.map(([label, href]) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-ink">
                {label}<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="mb-3 font-sans text-sm font-semibold text-ink">Services</h2>
        <ul className="space-y-2 text-[0.95rem]">
          {servicesData.map((s) => (
            <li key={s.id}>
              <Link to={`/services#${s.id}`} className="text-muted hover:text-ink">{s.title}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="mb-3 font-sans text-sm font-semibold text-ink">Explore</h2>
        <ul className="space-y-2 text-[0.95rem]">
          {[['/work', 'Work'], ['/about', 'About'], ['/testimonials', 'Testimonials'], ['/contact', 'Inquire']].map(([to, label]) => (
            <li key={to}><Link to={to} className="text-muted hover:text-ink">{label}</Link></li>
          ))}
        </ul>
      </div>
    </div>
    <div className="wrap border-t border-line py-6 text-sm text-muted">
      © {new Date().getFullYear()} Alan Luby Photography. All photographs by Alan Luby.
    </div>
  </footer>
);
