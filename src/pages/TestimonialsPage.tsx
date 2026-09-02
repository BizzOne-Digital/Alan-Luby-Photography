import React from 'react';
import { testimonialsData } from '../data/testimonials';
import { ContactCTASection } from '../components/ContactCTASection';
import { Quote, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';

export const TestimonialsPage: React.FC = () => {
  return (
    <div id="testimonials-page" className="min-h-screen bg-[#050505] text-[#F5F5F4] pt-28 pb-20">
      
      {/* Page Header */}
      <div className="relative isolate">
        {/* Hero background */}
        <div className="absolute inset-0 -top-28 -z-10 overflow-hidden" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1920&auto=format&fit=crop"
            srcSet="https://images.unsplash.com/photo-1511578314322-379afb476865?q=75&w=768&auto=format&fit=crop 768w,
                    https://images.unsplash.com/photo-1511578314322-379afb476865?q=75&w=1280&auto=format&fit=crop 1280w,
                    https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1920&auto=format&fit=crop 1920w,
                    https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2560&auto=format&fit=crop 2560w"
            sizes="100vw"
            alt=""
            className="w-full h-full object-cover object-center filter brightness-[0.75] grayscale contrast-[1.1]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            referrerPolicy="no-referrer"
          />
          {/* Dark wash keeps the existing hero text legible */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/45 to-[#050505]/15" />
          {/* Left scrim: keeps the image's bright area clear of the left-aligned text */}
          <div className="absolute inset-0
            bg-[linear-gradient(to_right,rgba(5,5,5,0.94)_0%,rgba(5,5,5,0.88)_70%,rgba(5,5,5,0.8)_100%)]
            md:bg-[linear-gradient(to_right,#050505_0%,rgba(5,5,5,0.92)_45%,rgba(5,5,5,0.45)_70%,transparent_100%)]" />
          <div className="absolute inset-0 subtle-noise opacity-20" />
        </div>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="border-b border-white/10 pb-10 space-y-4 max-w-4xl">
          <div className="inline-block bg-[#E11D48] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
            <span>Reputation & Reliability</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white leading-none">
            Client Experiences
          </h1>
          <p className="text-base sm:text-xl text-white/60 font-light leading-relaxed">
            What clients, event planners, and creative directors value most when collaborating with Alan Luby.
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
            <div className="inline-block bg-[#111] border border-white/15 px-3 py-1 text-[9px] font-mono text-[#E11D48] font-bold uppercase tracking-widest">
              CORE CLIENT EXPERIENCE
            </div>

            <p className="font-serif-editorial text-2xl sm:text-3xl md:text-4xl text-white italic leading-snug">
              “Alan captured the moments we needed without interrupting the moment itself. Professional, adaptable, and incredibly easy to work with.”
            </p>

            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between border-t border-white/10 gap-4">
              <div>
                <span className="font-display font-black text-sm uppercase tracking-wide text-white block">
                  Event Organizer & Executive Director
                </span>
                <span className="text-xs text-white/50 font-light">
                  Annual Leadership Conference & Live Gala
                </span>
              </div>
              <div className="text-[9px] font-mono uppercase tracking-widest text-white/40 font-bold">
                [Client Feedback Representative Sample]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonialsData.map((item, idx) => (
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
                
                <p className="font-serif-editorial text-lg text-white/90 italic leading-relaxed">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-display font-black text-xs uppercase tracking-wide text-white block">
                    {item.clientRole}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-white/50 font-mono">
                    {item.projectType}
                  </span>
                </div>
                {item.isPlaceholder && (
                  <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest bg-[#111] px-2 py-0.5 border border-white/10">
                    SLOT // 0{idx + 1}
                  </span>
                )}
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
            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tighter text-white">
              The Client Partnership
            </h2>
            <p className="text-sm sm:text-base text-white/60 font-light">
              Every client engagement is managed with rigorous standards of punctuality, discretion, and communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 bg-[#050505] border border-white/10 space-y-3 text-center">
              <HeartHandshake className="w-7 h-7 text-[#E11D48] mx-auto" />
              <h3 className="font-display text-lg font-black uppercase text-white tracking-tight">
                Discreet & Focused
              </h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Capturing spontaneous, authentic expressions without interrupting keynotes, conversations, or personal moments.
              </p>
            </div>

            <div className="p-8 bg-[#050505] border border-white/10 space-y-3 text-center">
              <CheckCircle2 className="w-7 h-7 text-[#E11D48] mx-auto" />
              <h3 className="font-display text-lg font-black uppercase text-white tracking-tight">
                Punctual Delivery
              </h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Prompt communication before, during, and after the shoot, with expedited turnarounds for time-sensitive PR and press.
              </p>
            </div>

            <div className="p-8 bg-[#050505] border border-white/10 space-y-3 text-center">
              <ShieldCheck className="w-7 h-7 text-[#E11D48] mx-auto" />
              <h3 className="font-display text-lg font-black uppercase text-white tracking-tight">
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
          headline="WORK WITH A PROVEN STORYTELLER."
          subhead="Join clients who rely on Alan Luby for decisive, professional photography."
        />
      </div>

    </div>
  );
};
