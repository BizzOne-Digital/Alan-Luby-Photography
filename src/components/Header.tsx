import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';

const NAV = [
  { to: '/work', label: 'Work' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
];

export const Wordmark: React.FC = () => (
  <Link to="/" aria-label="Alan Luby Photography, home" className="inline-flex max-w-full shrink-0 items-center rounded-sm leading-none">
    <img
      src="/brand/premium-v1/vector/primary.svg"
      alt=""
      width={2160}
      height={530}
      className="hidden h-auto w-[360px] max-w-full sm:block"
    />
    <img
      src="/brand/premium-v1/vector/monogram.svg"
      alt=""
      width={640}
      height={640}
      className="block h-16 w-16 sm:hidden"
    />
  </Link>
);

const navClass = ({ isActive }: { isActive: boolean }) =>
  `py-2 text-[0.95rem] font-medium transition-colors hover:text-ink ${isActive ? 'text-ink underline decoration-accent decoration-2 underline-offset-8' : 'text-muted'}`;

export const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  // Slide away while scrolling down, return on any scroll up.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    // Desktop only: on phones the header carries the Inquire button, so it stays put.
    setHidden(window.innerWidth >= 1024 && y > prev && y > 240);
  });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <motion.header
      className="sticky top-0 z-40 border-b border-line/70 bg-paper/95 backdrop-blur-sm"
      animate={{ y: hidden && !open ? '-100%' : '0%' }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onFocusCapture={() => setHidden(false)}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        Skip to content
      </a>
      <div className="flex h-20 w-full items-center px-5 sm:h-24 sm:px-8 lg:px-10 justify-between gap-6">
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

        <div className="flex items-center gap-1 lg:hidden">
        {pathname !== '/contact' && (
          <Link to="/contact" className="btn-primary min-h-10 px-4 text-sm">
            Inquire
          </Link>
        )}
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
    </motion.header>
  );
};
