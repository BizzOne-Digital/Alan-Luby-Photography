import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV = [
  { to: '/work', label: 'Work' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
];

export const Wordmark: React.FC = () => (
  <Link to="/" className="font-display text-[1.35rem] leading-none tracking-tight text-ink">
    Alan Luby <span className="text-muted">Photography</span>
  </Link>
);

const navClass = ({ isActive }: { isActive: boolean }) =>
  `py-2 text-[0.95rem] font-medium transition-colors hover:text-ink ${isActive ? 'text-ink underline decoration-accent decoration-2 underline-offset-8' : 'text-muted'}`;

export const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/95 backdrop-blur-sm">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        Skip to content
      </a>
      <div className="wrap flex h-[4.5rem] items-center justify-between gap-6">
        <Wordmark />

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClass}>
              {item.label}
            </NavLink>
          ))}
          <Link to="/contact" className="btn-primary min-h-11 px-5">
            Inquire
          </Link>
        </nav>

        <button
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-ink/5 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Main" className="border-t border-line bg-paper lg:hidden">
          <div className="wrap flex flex-col py-4">
            {[...NAV, { to: '/testimonials', label: 'Testimonials' }].map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `py-3 text-lg ${isActive ? 'font-semibold text-ink' : 'text-muted'}`}>
                {item.label}
              </NavLink>
            ))}
            <Link to="/contact" className="btn-primary mt-4 self-start">
              Inquire
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};
