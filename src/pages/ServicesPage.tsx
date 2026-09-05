import React from 'react';
import { Link } from 'react-router-dom';
import { servicesData } from '../data/services';
import { ContactCTASection } from '../components/ContactCTASection';
import { 
  Check, 
  ArrowRight, 
  ArrowUpRight 
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  return (
    <div id="services-page" className="min-h-screen bg-[#050505] text-[#F5F5F4] pt-28 pb-20">
      
      {/* Page Header */}
      <div className="relative isolate">
        {/* Hero background */}
        <div className="absolute inset-0 -top-28 -z-10 overflow-hidden" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1920&auto=format&fit=crop"
            srcSet="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=75&w=768&auto=format&fit=crop 768w,
                    https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=75&w=1280&auto=format&fit=crop 1280w,
                    https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1920&auto=format&fit=crop 1920w,
                    https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2560&auto=format&fit=crop 2560w"
            sizes="100vw"
            alt=""
            className="w-full h-full object-cover object-top filter brightness-[0.75] grayscale contrast-[1.1]"
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
            <span>Core Capabilities</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-semibold uppercase tracking-[0.02em] text-white leading-none">
            Services & Disciplines
          </h1>
          <p className="text-base sm:text-xl text-white/60 font-light leading-relaxed">
            Diversified, professional photography services built around the moment, the subject, and the client's unique visual goals.
          </p>
        </div>
      </section>
      </div>

      {/* Services List Breakdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 mb-24">
        {servicesData.map((service, idx) => (
          <div
            key={service.id}
            id={service.id}
            className="p-8 sm:p-12 bg-[#0A0A0A] border border-white/10 hover:border-[#E11D48] transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
          >
            {/* Image Col (5 cols on lg) */}
            <div className={`lg:col-span-5 ${idx % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
              <div className="relative aspect-[4/3] bg-[#111] border border-white/10 overflow-hidden shadow-xl">
                <img
                  src={service.imageSrc}
                  alt={service.title}
                  className="w-full h-full object-cover grayscale contrast-115 hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#050505] border border-white/15 px-3 py-1 text-[9px] font-mono text-[#E11D48] font-bold uppercase tracking-widest">
                  SERVICE // 0{idx + 1}
                </div>
              </div>
            </div>

            {/* Content Col (7 cols on lg) */}
            <div className={`lg:col-span-7 space-y-6 ${idx % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E11D48] block">
                  {service.tagline}
                </span>
                <h2 className="font-display text-2xl sm:text-4xl font-semibold uppercase tracking-[0.02em] text-white">
                  {service.title}
                </h2>
              </div>

              <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed">
                {service.description}
              </p>

              {/* What is Included / Deliverables */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">
                  Service Deliverables
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-white/80 font-medium">
                  {service.deliverables.map((item, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#E11D48] mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ideal For Badges */}
              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">
                  Ideal For
                </span>
                <div className="flex flex-wrap gap-2">
                  {service.idealFor.map((target, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider bg-[#111] border border-white/10 text-white/70"
                    >
                      {target}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  to={`/contact?service=${encodeURIComponent(service.title)}`}
                  id={`service-cta-${service.id}`}
                  className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-widest px-6 py-3.5 transition-all"
                >
                  <span>COMMISSION ALAN</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to={`/work?category=${service.categoryKey}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                >
                  <span>View Related Work</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#E11D48]" />
                </Link>
              </div>

            </div>
          </div>
        ))}
      </section>

      {/* "NEED SOMETHING DIFFERENT? LET'S DISCUSS YOUR PROJECT" SECTION */}
      <section className="py-20 bg-[#0A0A0A] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-14 bg-[#050505] border border-white/10 text-center max-w-4xl mx-auto space-y-6">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E11D48] block">
              CUSTOM BRIEFING // SPECIAL COMMISSIONS
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-semibold uppercase tracking-[0.02em] text-white">
              Need something different? <br />
              <span className="text-[#E11D48]">Let's discuss your project.</span>
            </h2>
            <p className="text-sm sm:text-base text-white/70 font-light max-w-2xl mx-auto leading-relaxed">
              Every assignment has distinct parameters. Whether you require multi-day event coverage, travel assignments, private documentary commissions, or custom commercial shoots, Alan will tailor a solution for your exact requirements.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                id="services-custom-cta"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#E11D48] hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-widest px-8 py-4 transition-all"
              >
                <span>START A PROJECT</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:5613409310"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-widest px-7 py-4 transition-all"
              >
                <span>CALL: (561) 340-9310</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Conversion Banner */}
      <div className="mt-20">
        <ContactCTASection
          headline="READY TO SCHEDULE YOUR PHOTOGRAPHY SESSION?"
          subhead="Send your project specifications, date, and visual objectives to get started."
        />
      </div>

    </div>
  );
};
