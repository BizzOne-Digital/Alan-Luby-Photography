import React from 'react';
import { ContactCTASection } from '../components/ContactCTASection';
import { 
  Camera, 
  Check, 
  Sliders, 
  HeartHandshake, 
  FileText 
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div id="about-page" className="min-h-screen bg-[#050505] text-[#F5F5F4] pt-28 pb-20">
      
      {/* Page Header */}
      <div className="relative isolate">
        {/* Hero background */}
        <div className="absolute inset-0 -top-28 -z-10 overflow-hidden" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1469488865564-c2de10f69f96?q=80&w=1920&auto=format&fit=crop"
            srcSet="https://images.unsplash.com/photo-1469488865564-c2de10f69f96?q=75&w=768&auto=format&fit=crop 768w,
                    https://images.unsplash.com/photo-1469488865564-c2de10f69f96?q=75&w=1280&auto=format&fit=crop 1280w,
                    https://images.unsplash.com/photo-1469488865564-c2de10f69f96?q=80&w=1920&auto=format&fit=crop 1920w,
                    https://images.unsplash.com/photo-1469488865564-c2de10f69f96?q=80&w=2560&auto=format&fit=crop 2560w"
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
            <span>Behind The Lens</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white leading-none">
            About Alan Luby
          </h1>
          <p className="text-base sm:text-xl text-white/60 font-light leading-relaxed">
            A versatile photographer with a foundation in journalism, events, and portrait photography who approaches every assignment with a storyteller's eye.
          </p>
        </div>
      </section>
      </div>

      {/* Main Bio & Portrait Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Portrait & Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-[3/4] bg-[#111] border border-white/10 overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop"
                alt="Alan Luby Photographer Portrait"
                className="w-full h-full object-cover grayscale contrast-125"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 h-3 w-3 border-t-2 border-l-2 border-[#E11D48]" />
              <div className="absolute bottom-3 right-3 h-3 w-3 border-b-2 border-r-2 border-[#E11D48]" />
              
              <div className="absolute bottom-4 left-4 right-4 bg-[#0A0A0A]/95 border border-white/10 p-4 backdrop-blur-md">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#E11D48] block mb-1 font-bold">
                  PRINCIPAL PHOTOGRAPHER
                </span>
                <p className="font-display text-base font-black text-white uppercase tracking-tight">
                  Alan Luby
                </p>
                <p className="text-xs text-white/50 font-mono">
                  Journalism • Events • Portraits • Editorial
                </p>
              </div>
            </div>

            {/* Quick Contact Box */}
            <div className="p-6 bg-[#0A0A0A] border border-white/10 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#E11D48] block">
                Direct Inquiries
              </span>
              <p className="text-xs text-white/60 font-light">
                Available for local, regional, and travel assignments.
              </p>
              <div className="pt-2 flex flex-col space-y-1.5 text-xs text-white/80 font-mono">
                <span>Email: <strong className="text-white font-sans font-bold">aluby1441@aol.com</strong></span>
                <span>Phone: <strong className="text-white font-sans font-bold">(561) 340-9310</strong></span>
              </div>
            </div>
          </div>

          {/* Right Column: Bio Narrative & Story (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            <div className="space-y-4">
              <h2 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tighter text-white">
                The Story Behind the Frame
              </h2>
              <p className="text-base text-white/70 font-light leading-relaxed">
                Alan Luby began his photography journey immersed in the fast-paced, high-observation world of 
                <strong className="text-white font-semibold"> journalism, live events, and candid portraiture</strong>. In these demanding settings, there are no second takes—you learn to anticipate human emotion, read evolving ambient light, and capture decisive moments with composure and technical precision.
              </p>
              <p className="text-base text-white/70 font-light leading-relaxed">
                Over the course of his career, Alan has diversified his visual practice to encompass comprehensive event coverage, executive and environmental portraits, documentary photo essays, and commercial brand assignments.
              </p>
            </div>

            {/* A DIFFERENT KIND OF PHOTOGRAPHER */}
            <div className="p-8 bg-[#0A0A0A] border border-white/10 border-l-4 border-l-[#E11D48] space-y-4 shadow-xl">
              <h3 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                A Different Kind of Photographer
              </h3>
              <p className="text-sm sm:text-base text-white/60 font-light leading-relaxed">
                Alan is not restricted to a single rigid photography category. Rather than forcing clients into predetermined templates, he adapts his visual approach to the atmosphere of each setting, the personalities involved, and the specific narrative required.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-white/80 font-medium">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#E11D48] shrink-0" />
                  <span>Unobtrusive event observation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#E11D48] shrink-0" />
                  <span>Candid, unforced portrait guidance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#E11D48] shrink-0" />
                  <span>Documentary truth & narrative pacing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#E11D48] shrink-0" />
                  <span>Polished, true-to-life post-production</span>
                </div>
              </div>
            </div>

            {/* Photography Philosophy */}
            <div className="space-y-4 pt-2">
              <h3 className="font-display text-xl font-black uppercase tracking-tight text-white">
                Photography Philosophy
              </h3>
              <div className="space-y-4 text-sm text-white/70 font-light leading-relaxed">
                <p>
                  <strong className="text-white font-bold block mb-0.5 uppercase tracking-wide text-xs">01 // Respect for the Subject:</strong> Whether photographing a high-profile keynote speaker, an artisan at work, or an individual portrait client, Alan creates an atmosphere of ease and mutual respect where authenticity thrives naturally.
                </p>
                <p>
                  <strong className="text-white font-bold block mb-0.5 uppercase tracking-wide text-xs">02 // Visual Storytelling:</strong> Every photograph should communicate context, atmosphere, and emotion. A collection of images should tell a coherent story from beginning to end.
                </p>
                <p>
                  <strong className="text-white font-bold block mb-0.5 uppercase tracking-wide text-xs">03 // Dependability & Adaptability:</strong> Photography assignments can be unpredictable. Alan brings the calm experience needed to pivot when schedules shift or lighting changes unexpectedly.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4-Step Professional Approach */}
      <section className="py-20 bg-[#0A0A0A] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-14 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E11D48] block">
              The Workflow
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tighter text-white">
              Professional Approach
            </h2>
            <p className="text-sm sm:text-base text-white/60 font-light">
              A transparent, dependable process from initial creative consultation to final deliverable delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 bg-[#050505] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#E11D48]">PHASE 01</span>
                <HeartHandshake className="w-5 h-5 text-white/40" />
              </div>
              <h3 className="font-display text-lg font-black uppercase text-white tracking-tight">
                Pre-Shoot Discovery
              </h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Understanding your schedule, shot list priorities, brand tone, and visual goals before arriving on location.
              </p>
            </div>

            <div className="p-6 bg-[#050505] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#E11D48]">PHASE 02</span>
                <Camera className="w-5 h-5 text-white/40" />
              </div>
              <h3 className="font-display text-lg font-black uppercase text-white tracking-tight">
                Live Execution
              </h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Professional, punctual, and attentive coverage. Capturing both keynote moments and nuanced candid interactions.
              </p>
            </div>

            <div className="p-6 bg-[#050505] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#E11D48]">PHASE 03</span>
                <Sliders className="w-5 h-5 text-white/40" />
              </div>
              <h3 className="font-display text-lg font-black uppercase text-white tracking-tight">
                Editorial Curation
              </h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Meticulous image selection, color grading, and contrast refinement preserving natural tonality and sharpness.
              </p>
            </div>

            <div className="p-6 bg-[#050505] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#E11D48]">PHASE 04</span>
                <FileText className="w-5 h-5 text-white/40" />
              </div>
              <h3 className="font-display text-lg font-black uppercase text-white tracking-tight">
                Archival Delivery
              </h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                High-resolution files delivered via secure digital download, ready for immediate publication, marketing, or print.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Conversion Banner */}
      <div className="mt-20">
        <ContactCTASection
          headline="READY TO WORK WITH ALAN?"
          subhead="Let's discuss how Alan Luby can bring your visual vision to life."
        />
      </div>

    </div>
  );
};
