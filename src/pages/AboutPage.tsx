import React from 'react';
import { ContactCTASection } from '../components/ContactCTASection';
import { PageHeroImage } from '../components/PageHeroImage';
import { heroImages, careerImage, photographyCollection } from '../data/photography';

const bioPhoto = photographyCollection.find((p) => p.id === 'dsc-46779')!;
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
        <PageHeroImage photo={heroImages.about} />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="border-b border-white/10 pb-10 space-y-4 max-w-4xl">
          <div className="inline-block bg-[#E11D48] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
            <span>The Photographer</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-semibold uppercase tracking-[0.02em] text-white leading-none">
            About Alan Luby
          </h1>
          <p className="text-base sm:text-xl text-white/75 font-light leading-relaxed">
            Event and portrait photographer based in Boynton Beach, Florida, also covering sports, entertainment and business photography.
          </p>
        </div>
      </section>
      </div>

      {/* Main Bio & Portrait Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Portrait & Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Portfolio image. No confirmed portrait of Alan was supplied, so none is shown. */}
            <figure className="space-y-2">
              <div className="relative aspect-[4/3] bg-[#111] border border-white/10 overflow-hidden shadow-2xl">
                <img
                  src={bioPhoto.imageSrc}
                  srcSet={bioPhoto.srcSet}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  alt={bioPhoto.altText}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: bioPhoto.focus }}
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                Portrait session · Photograph by Alan Luby
              </figcaption>
            </figure>

            {/* Quick Contact Box */}
            <div className="p-6 bg-[#0A0A0A] border border-white/10 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#E11D48] block">
                Direct Inquiries
              </span>
              <p className="text-xs text-white/60 font-light">
                Booking events, portrait sessions, games and performances.
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
              <h2 className="font-display text-2xl sm:text-4xl font-semibold uppercase tracking-[0.02em] text-white">
                What Alan Offers Today
              </h2>
              <p className="text-base text-white/70 font-light leading-relaxed">
                I'm a freelance photographer who currently resides in
                <strong className="text-white font-semibold"> Boynton Beach</strong> and a member of the Black Chamber of
                Commerce of Palm Beach County a former member of ASMP The American Society of Media Photographers, I have
                been hired to cover events by the Miami Herald, Palm Beach Post, South Florida Times, South Florida
                Sun-Sentinel, the Associated Press and numerous other publications. I have
                <strong className="text-white font-semibold"> over 30 years of photography experience</strong> and was the
                team photographer for the Florida Bobcats of the Arena Football League and the Florida Beachdogs of the
                Continental Basketball Association.
              </p>
              <p className="text-base text-white/70 font-light leading-relaxed">
                I'm also a portrait and wedding photographer that has done event photography with on-site printing for
                Motorola, American Society of Kidney Patients, Palm Beach State College, Big Brothers, Big Sisters of Palm
                Beach County, BB King's and numerous other profit and not-for-profit organizations.
              </p>

              <h3 className="font-display text-xl font-semibold uppercase tracking-[0.02em] text-white pt-4">
                Career Background
              </h3>
              <p className="text-base text-white/70 font-light leading-relaxed">
                As a freelance photographer I have had the opportunity to cover the Miami Dolphins, Miami Heat, Miami
                Marlins, University of Miami, President Barack Obama, the victory party for Florida Gov. Rick Scott and
                numerous other news, sports and feature assignments for various publications.
              </p>
              <figure className="pt-2 space-y-2">
                <div className="relative aspect-[3/2] bg-[#111] border border-white/10 overflow-hidden">
                  <img
                    src={careerImage.imageSrc}
                    srcSet={careerImage.srcSet}
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    alt={careerImage.altText}
                    loading="lazy"
                    decoding="async"
                    style={{ objectPosition: careerImage.focus }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  {careerImage.title} · {careerImage.description}
                </figcaption>
              </figure>
            </div>

            {/* A DIFFERENT KIND OF PHOTOGRAPHER */}
            <div className="p-8 bg-[#0A0A0A] border border-white/10 border-l-4 border-l-[#E11D48] space-y-4 shadow-xl">
              <h3 className="font-display text-xl sm:text-2xl font-semibold uppercase tracking-[0.02em] text-white">
                How Alan Works
              </h3>
              <p className="text-sm sm:text-base text-white/60 font-light leading-relaxed">
                Every event and every person is different. Alan adapts to the room, the light and the personalities
                involved, so the photographs feel natural rather than staged.
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
                  <span>Timing for action and performance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#E11D48] shrink-0" />
                  <span>Polished, true-to-life post-production</span>
                </div>
              </div>
            </div>

            {/* Photography Philosophy */}
            <div className="space-y-4 pt-2">
              <h3 className="font-display text-xl font-semibold uppercase tracking-[0.02em] text-white">
                Photography Philosophy
              </h3>
              <div className="space-y-4 text-sm text-white/70 font-light leading-relaxed">
                <p>
                  <strong className="text-white font-bold block mb-0.5 uppercase tracking-wide text-xs">01 // Respect for the Subject:</strong> Whether photographing a keynote speaker, a family or an individual portrait client, Alan creates an atmosphere of ease and mutual respect where authenticity thrives naturally.
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
            <h2 className="font-display text-3xl sm:text-5xl font-semibold uppercase tracking-[0.02em] text-white">
              Professional Approach
            </h2>
            <p className="text-sm sm:text-base text-white/60 font-light">
              A clear, dependable process from the first conversation to your final gallery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 bg-[#050505] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#E11D48]">PHASE 01</span>
                <HeartHandshake className="w-5 h-5 text-white/40" />
              </div>
              <h3 className="font-display text-lg font-semibold uppercase text-white tracking-[0.02em]">
                Pre-Shoot Discovery
              </h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Understanding your schedule, must-have shots and the people involved before the day arrives.
              </p>
            </div>

            <div className="p-6 bg-[#050505] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#E11D48]">PHASE 02</span>
                <Camera className="w-5 h-5 text-white/40" />
              </div>
              <h3 className="font-display text-lg font-semibold uppercase text-white tracking-[0.02em]">
                Live Execution
              </h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Punctual, attentive coverage of both the planned moments and the candid ones.
              </p>
            </div>

            <div className="p-6 bg-[#050505] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#E11D48]">PHASE 03</span>
                <Sliders className="w-5 h-5 text-white/40" />
              </div>
              <h3 className="font-display text-lg font-semibold uppercase text-white tracking-[0.02em]">
                Selection & Editing
              </h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Careful selection and color correction that keeps skin tones and colors natural.
              </p>
            </div>

            <div className="p-6 bg-[#050505] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#E11D48]">PHASE 04</span>
                <FileText className="w-5 h-5 text-white/40" />
              </div>
              <h3 className="font-display text-lg font-semibold uppercase text-white tracking-[0.02em]">
                Gallery Delivery
              </h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                High-resolution digital files, ready to share, print or use on your website.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Conversion Banner */}
      <div className="mt-20">
        <ContactCTASection
          headline="READY TO WORK WITH ALAN?"
          subhead="Tell Alan about your event, portrait session or project."
        />
      </div>

    </div>
  );
};
