import React from 'react';
import { testimonialsData } from '../data/testimonials';
import { ContactCTASection } from '../components/ContactCTASection';
import { PageHeroImage } from '../components/PageHeroImage';
import { heroImages } from '../data/photography';
import { Quote, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';

export const TestimonialsPage: React.FC = () => {
  const lead = testimonialsData.find((t) => t.featured) ?? testimonialsData[0];
  const rest = testimonialsData.filter((t) => t.id !== lead.id);
  return (
    <div id="testimonials-page" className="min-h-screen bg-[#050505] text-[#F5F5F4] pt-28 pb-20">
      
      {/* Page Header */}
      <div className="relative isolate">
        <PageHeroImage photo={heroImages.testimonials} />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="border-b border-white/10 pb-10 space-y-4 max-w-4xl">
          <div className="inline-block bg-[#E11D48] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
            <span>In Their Own Words</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-semibold uppercase tracking-[0.02em] text-white leading-none">
            Client Experiences
          </h1>
          <p className="text-base sm:text-xl text-white/70 font-light leading-relaxed">
            Feedback shared by clients, event organizers and organizations Alan has photographed for.
          </p>
        </div>
      </section>
      </div>

      {/* Featured Main Testimonial Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative p-8 sm:p-14 bg-[#0A0A0A] border border-white/10 border-l-4 border-l-[#E11D48] shadow-2xl overflow-hidden">
          <div className="absolute top-4 right-4 sm:top-8 sm:right-8 opacity-5">
            <Quote className="w-32 h-32 text-white" />
          </div>

          <div className="relative z-10 max-w-4xl space-y-6">
            {lead.highlight && (
              <div className="inline-block bg-[#111] border border-white/15 px-3 py-1 text-[9px] font-mono text-[#E11D48] font-bold uppercase tracking-widest">
                {lead.highlight}
              </div>
            )}

            <blockquote className="font-serif-editorial text-xl sm:text-2xl md:text-3xl text-white italic leading-snug">
              “{lead.quote}”
            </blockquote>

            <div className="pt-4 border-t border-white/10">
              <span className="font-display font-semibold text-sm uppercase tracking-wide text-white block">
                {lead.clientRole}
              </span>
              <span className="text-xs text-white/50 font-light">
                {[lead.organization, lead.location].filter(Boolean).join(' · ')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rest.map((item) => (
            <div
              key={item.id}
              className="p-8 bg-[#0A0A0A] border border-white/10 flex flex-col justify-between hover:border-[#E11D48] transition-all space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#E11D48]">
                    {item.highlight}
                  </span>
                  <Quote className="w-4 h-4 text-white/20" />
                </div>
                
                <blockquote className="font-serif-editorial text-lg text-white/90 italic leading-relaxed">
                  “{item.quote}”
                </blockquote>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-display font-semibold text-xs uppercase tracking-wide text-white block">
                    {item.clientRole}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-white/50 font-mono">
                    {[item.organization, item.location].filter(Boolean).join(' · ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What Clients Value Most Section */}
      <section className="py-20 bg-[#0A0A0A] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E11D48] block">
              Consistent Values
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-semibold uppercase tracking-[0.02em] text-white">
              The Client Partnership
            </h2>
            <p className="text-sm sm:text-base text-white/60 font-light">
              The themes clients mention most: comfort, punctuality and photographs they are proud to share.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 bg-[#050505] border border-white/10 space-y-3 text-center">
              <HeartHandshake className="w-7 h-7 text-[#E11D48] mx-auto" />
              <h3 className="font-display text-lg font-semibold uppercase text-white tracking-[0.02em]">
                Discreet & Focused
              </h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Capturing spontaneous, authentic expressions without interrupting keynotes, conversations, or personal moments.
              </p>
            </div>

            <div className="p-8 bg-[#050505] border border-white/10 space-y-3 text-center">
              <CheckCircle2 className="w-7 h-7 text-[#E11D48] mx-auto" />
              <h3 className="font-display text-lg font-semibold uppercase text-white tracking-[0.02em]">
                On Time & Prepared
              </h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Clear communication before the shoot and a punctual, prepared arrival so your schedule stays on track.
              </p>
            </div>

            <div className="p-8 bg-[#050505] border border-white/10 space-y-3 text-center">
              <ShieldCheck className="w-7 h-7 text-[#E11D48] mx-auto" />
              <h3 className="font-display text-lg font-semibold uppercase text-white tracking-[0.02em]">
                Technical Consistency
              </h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Reliable sharpness, true-to-life skin tones, and professional color grading tailored for both print and digital.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Conversion Banner */}
      <div className="mt-20">
        <ContactCTASection
          headline="LET'S PHOTOGRAPH YOUR NEXT OCCASION."
          subhead="Tell Alan about your event, portrait session or project."
        />
      </div>

    </div>
  );
};
