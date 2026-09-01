import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { Menu, X, Phone, Mail, ArrowUpRight } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/work', label: 'Work' },
    { to: '/testimonials', label: 'Testimonials' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#050505]/95 backdrop-blur-md border-b border-white/10 shadow-2xl py-4'
          : 'bg-gradient-to-b from-[#050505] via-[#050505]/80 to-transparent border-b border-white/5 py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav id="desktop-nav" aria-label="Main Navigation" className="hidden md:flex items-center gap-8 text-[11px] font-semibold tracking-widest uppercase">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                id={`nav-link-${link.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `relative py-1 transition-colors duration-150 ${
                    isActive
                      ? 'text-[#E11D48] font-bold'
                      : 'text-white/70 hover:text-[#E11D48]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#E11D48]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right CTA Action */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="tel:5613409310"
              className="text-[11px] text-white/50 hover:text-white transition-colors flex items-center gap-1.5 font-mono tracking-wider"
              title="Call Alan Luby"
            >
              <Phone className="w-3 h-3 text-[#E11D48]" />
              <span className="hidden xl:inline">(561) 340-9310</span>
            </a>
            <NavLink
              to="/contact"
              id="header-cta-hire"
              className="inline-flex items-center justify-center gap-2 bg-[#E11D48] hover:bg-white hover:text-black text-white text-[11px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-none transition-all duration-200"
            >
              <span>HIRE ALAN</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-3">
            <NavLink
              to="/contact"
              className="inline-flex items-center justify-center bg-[#E11D48] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-none"
            >
              HIRE
            </NavLink>
            <button
              type="button"
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 border border-white/10 rounded-none transition-colors"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden bg-[#050505]/98 backdrop-blur-xl border-b border-white/10 px-6 py-6 transition-all duration-300 animate-in fade-in slide-in-from-top-4"
        >
          <div className="flex flex-col space-y-3 pb-6 border-b border-white/10">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                id={`mobile-nav-link-${link.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `flex items-center justify-between py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                    isActive ? 'text-[#E11D48]' : 'text-white/70 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.label}</span>
                    {isActive && <span className="w-2 h-2 bg-[#E11D48]" />}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="pt-6 space-y-4">
            <div className="text-[10px] text-[#E11D48] uppercase tracking-[0.3em] font-bold">
              Direct Inquiries
            </div>
            <div className="flex flex-col space-y-2 font-mono text-xs">
              <a
                href="mailto:aluby1441@aol.com"
                className="flex items-center gap-2 text-white/70 hover:text-[#E11D48] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#E11D48]" />
                <span>aluby1441@aol.com</span>
              </a>
              <a
                href="tel:5613409310"
                className="flex items-center gap-2 text-white/70 hover:text-[#E11D48] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#E11D48]" />
                <span>(561) 340-9310</span>
              </a>
            </div>

            <NavLink
              to="/contact"
              id="mobile-drawer-cta-hire"
              className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-[#E11D48] hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded-none transition-all"
            >
              <span>WORK WITH ALAN</span>
              <ArrowUpRight className="w-4 h-4" />
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};
