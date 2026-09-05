import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Phone, ArrowUpRight } from 'lucide-react';

interface ContactCTASectionProps {
  headline?: string;
  subhead?: string;
}

export const ContactCTASection: React.FC<ContactCTASectionProps> = ({
  headline = "ONE PHOTOGRAPHER. MANY STORIES.",
  subhead = "From corporate galas and live events to executive portraits and editorial documentary assignments, let's create something enduring.",
}) => {
  return (
    <section id="contact-cta-section" className="relative py-20 lg:py-28 bg-[#050505] border-t border-white/10 overflow-hidden">
      {/* Background Graphic Accents */}
      <div className="absolute inset-0 subtle-noise opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-[#0A0A0A] border border-white/10 p-8 sm:p-12 lg:p-16 rounded-none shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content (8 cols on lg) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-block bg-[#E11D48] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                <span>Accepting Commissions</span>
              </div>

              <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-[0.02em] uppercase leading-[0.92]">
                {headline}
              </h2>

              <p className="text-base sm:text-lg text-white/60 font-light max-w-2xl leading-relaxed">
                {subhead}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs font-mono text-white/70">
                <a
                  href="mailto:aluby1441@aol.com"
                  className="flex items-center gap-2 text-white/80 hover:text-[#E11D48] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#E11D48]" />
                  <span>aluby1441@aol.com</span>
                </a>
                <span className="hidden sm:inline text-white/20">•</span>
                <a
                  href="tel:5613409310"
                  className="flex items-center gap-2 text-white/80 hover:text-[#E11D48] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#E11D48]" />
                  <span>(561) 340-9310</span>
                </a>
              </div>
            </div>

            {/* Right CTAs (4 cols on lg) */}
            <div className="lg:col-span-4 flex flex-col space-y-3.5 w-full">
              <Link
                to="/contact"
                id="cta-start-project"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#E11D48] hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-widest py-4 px-6 rounded-none transition-all duration-200 text-center"
              >
                <span>WORK WITH ALAN</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                to="/work"
                id="cta-view-portfolio-alt"
                className="w-full inline-flex items-center justify-center gap-2 border border-white/20 hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-widest py-4 px-6 rounded-none transition-all text-center"
              >
                <span>VIEW PORTFOLIO</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              <p className="text-[10px] text-white/40 uppercase tracking-widest text-center pt-1 font-bold">
                Direct client response within 24 business hours.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
