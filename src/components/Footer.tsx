import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Mail, Phone, ArrowUpRight, Camera, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="main-footer" className="bg-[#050505] border-t border-white/10 text-white/50 relative overflow-hidden">
      {/* Decorative top accent line with red anchor */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#E11D48] to-transparent opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-14 border-b border-white/10">
          
          {/* Brand Column (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            <Logo />
            <p className="text-sm text-white/60 font-light leading-relaxed max-w-sm">
              <strong className="text-[#F5F5F4] font-bold uppercase tracking-tight block text-base mb-1">
                Photography That Tells The Story.
              </strong>
              One photographer. Many stories. Built with an editorial eye, journalistic truth, and dedication to authentic moments.
            </p>
            
            <div className="pt-1 flex flex-wrap items-center gap-3 text-[10px] uppercase font-bold tracking-widest">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#111111] border border-white/10 text-white/70">
                <Camera className="w-3.5 h-3.5 text-[#E11D48]" />
                <span>Events • Portraits • Journalism</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#111111] border border-white/10 text-white/70">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E11D48]" />
                <span>Available for Travel</span>
              </span>
            </div>
          </div>

          {/* Quick Navigation (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#E11D48]">
              01 // Navigation
            </h4>
            <ul className="space-y-2.5 text-xs uppercase tracking-widest font-semibold">
              <li>
                <Link to="/" className="text-white/70 hover:text-[#E11D48] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/70 hover:text-[#E11D48] transition-colors">
                  About Alan
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-white/70 hover:text-[#E11D48] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/work" className="text-white/70 hover:text-[#E11D48] transition-colors">
                  Portfolio / Work
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-white/70 hover:text-[#E11D48] transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/70 hover:text-[#E11D48] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Photography Disciplines (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#E11D48]">
              02 // Disciplines
            </h4>
            <ul className="space-y-2.5 text-xs uppercase tracking-widest font-semibold text-white/60">
              <li>
                <Link to="/work?category=events" className="hover:text-white transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/work?category=portraits" className="hover:text-white transition-colors">
                  Portraits
                </Link>
              </li>
              <li>
                <Link to="/work?category=journalism" className="hover:text-white transition-colors">
                  Journalism
                </Link>
              </li>
              <li>
                <Link to="/work?category=editorial" className="hover:text-white transition-colors">
                  Editorial
                </Link>
              </li>
              <li>
                <Link to="/work?category=commercial" className="hover:text-white transition-colors">
                  Commercial
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Contact & Social Media (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#E11D48]">
              03 // Direct Inquiries
            </h4>
            
            <div className="space-y-2.5 font-mono text-xs">
              <a
                href="mailto:aluby1441@aol.com"
                className="group flex items-start gap-3 p-3 bg-[#0E0E0E] border border-white/10 hover:border-[#E11D48] transition-all text-white/80 hover:text-white"
              >
                <Mail className="w-4 h-4 text-[#E11D48] mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest text-white/40 font-sans font-bold">Direct Email</span>
                  <span className="font-semibold text-white">aluby1441@aol.com</span>
                </div>
              </a>

              <a
                href="tel:5613409310"
                className="group flex items-start gap-3 p-3 bg-[#0E0E0E] border border-white/10 hover:border-[#E11D48] transition-all text-white/80 hover:text-white"
              >
                <Phone className="w-4 h-4 text-[#E11D48] mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest text-white/40 font-sans font-bold">Studio Phone</span>
                  <span className="font-semibold text-white">(561) 340-9310</span>
                </div>
              </a>
            </div>

            {/* Social channels */}
            <div className="pt-2">
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://www.facebook.com/share/1Jq7nQ8Rci/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111] border border-white/10 text-[10px] uppercase tracking-widest font-bold text-white/70 hover:text-white hover:border-[#E11D48] transition-colors"
                >
                  <span>Facebook</span>
                  <ArrowUpRight className="w-3 h-3 text-[#E11D48]" />
                </a>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111] border border-white/10 text-[10px] uppercase tracking-widest font-bold text-white/70">
                  <span>Instagram: <strong className="text-white ml-0.5">Alan Luby</strong></span>
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] text-white/40 tracking-widest uppercase font-bold gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <span>Based in FL • Working Worldwide</span>
            <span className="text-[#E11D48]">Available for Commissions</span>
          </div>
          <div>
            © {currentYear} Alan Luby Photography. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
