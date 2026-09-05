import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { photographyCollection, photoCategories } from '../data/photography';
import { testimonialsData } from '../data/testimonials';
import { PhotoCard } from '../components/PhotoCard';
import { ImageModal } from '../components/ImageModal';
import { ContactCTASection } from '../components/ContactCTASection';
import { QuantumNebula } from '../components/ui/quantum-nebula';
import { PhotoItem } from '../types';
import { 
  ArrowRight, 
  ArrowUpRight, 
  Layers, 
  Compass, 
  Flame, 
  CheckCircle2, 
  Quote 
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  const featuredPhotos = photographyCollection.filter((p) => p.featuredOnHome);
  const homeCategoryCards = photoCategories.filter((c) => c.key !== 'all');

  const handleNextPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = photographyCollection.findIndex((p) => p.id === selectedPhoto.id);
    if (currentIndex < photographyCollection.length - 1) {
      setSelectedPhoto(photographyCollection[currentIndex + 1]);
    }
  };

  const handlePrevPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = photographyCollection.findIndex((p) => p.id === selectedPhoto.id);
    if (currentIndex > 0) {
      setSelectedPhoto(photographyCollection[currentIndex - 1]);
    }
  };

  return (
    <div id="home-page" className="min-h-screen bg-[#050505] text-[#F5F5F4]">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section id="hero-section" className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden border-b border-white/10">
        {/* Hero Background Image with Editorial Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2000&auto=format&fit=crop"
            alt="Cinematic background photography by Alan Luby"
            className="w-full h-full object-cover object-center filter brightness-[0.3] grayscale contrast-[1.15] scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          {/* Subtle noise and radial gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-black/80" />
          {/* Interactive particle nebula, above the wash so the glow survives it */}
          <QuantumNebula className="absolute inset-0 w-full h-full pointer-events-none
            opacity-30 [mask-image:radial-gradient(ellipse_at_top_right,black_0%,rgba(0,0,0,0.3)_45%,transparent_78%)]
            md:opacity-70 md:[mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.18)_28%,rgba(0,0,0,0.55)_55%,black_85%)]" />
          <div className="absolute inset-0 subtle-noise opacity-20" />
        </div>

        {/* Hero Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-4xl space-y-8">
            
            {/* Editorial Badge */}
            <div className="inline-block bg-[#E11D48] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
              <span>ALAN LUBY // EDITORIAL & EVENT PHOTOGRAPHY</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold uppercase tracking-[0.02em] text-white leading-none">
              Photography <br />
              <span className="text-white/80">
                That Tells
              </span> <br />
              <span className="text-[#E11D48]">
                The Story.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-xl text-white/70 font-light leading-relaxed max-w-2xl">
              From decisive moments and major events to portraits and editorial commissions,
              <strong className="text-white font-bold"> Alan Luby </strong>
              brings a versatile eye and seasoned professional experience to every frame.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/work"
                id="hero-cta-portfolio"
                className="inline-flex items-center justify-center gap-3 bg-[#E11D48] hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-widest px-8 py-4 transition-all duration-200"
              >
                <span>VIEW THE ARCHIVE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                to="/contact"
                id="hero-cta-contact"
                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-widest px-7 py-4 transition-all duration-200"
              >
                <span>COMMISSION ALAN</span>
                <ArrowUpRight className="w-4 h-4 text-[#E11D48]" />
              </Link>
            </div>

            {/* Quick Meta Footer */}
            <div className="pt-8 border-t border-white/10 flex flex-wrap items-center gap-y-2 gap-x-8 text-[11px] text-white/50 font-mono tracking-widest uppercase">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#E11D48]" />
                Journalism & Documentary
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#E11D48]" />
                Live Event Coverage
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#E11D48]" />
                Executive & Editorial Portraits
              </span>
            </div>

          </div>
        </div>

        {/* Viewfinder Crop Corner Lines */}
        <div className="absolute top-8 left-8 hidden lg:block h-6 w-6 border-t border-l border-white/30 pointer-events-none" />
        <div className="absolute top-8 right-8 hidden lg:block h-6 w-6 border-t border-r border-white/30 pointer-events-none" />
        <div className="absolute bottom-8 left-8 hidden lg:block h-6 w-6 border-b border-l border-white/30 pointer-events-none" />
        <div className="absolute bottom-8 right-8 hidden lg:block h-6 w-6 border-b border-r border-white/30 pointer-events-none" />
      </section>

      {/* 2. BRAND MANIFESTO & POSITIONING SECTION */}
      <section id="positioning-section" className="py-20 lg:py-28 bg-[#0A0A0A] border-b border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Statement */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E11D48] block">
                THE CORE PHILOSOPHY
              </span>
              
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold uppercase tracking-[0.02em] text-white leading-none">
                One photographer. <br />
                <span className="text-[#E11D48]">Many stories.</span> Built around the moment.
              </h2>

              <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed">
                Great photography is not confined to a single cookie-cutter category. 
                Whether documenting the high-stakes atmosphere of a corporate summit, 
                capturing raw authenticity in photojournalism, or creating a commanding editorial portrait, 
                Alan Luby adapts his eye to the subject, the atmosphere, and the client's vision.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-6 bg-[#050505] border border-white/10 space-y-1.5">
                  <span className="text-xs font-black uppercase tracking-widest text-[#E11D48] block">
                    Authentic Moments
                  </span>
                  <p className="text-xs text-white/60 font-light leading-relaxed">
                    Unforced, genuine candid emotion without disruptive interference.
                  </p>
                </div>
                <div className="p-6 bg-[#050505] border border-white/10 space-y-1.5">
                  <span className="text-xs font-black uppercase tracking-widest text-[#E11D48] block">
                    Editorial Craft
                  </span>
                  <p className="text-xs text-white/60 font-light leading-relaxed">
                    Deliberate composition, strong contrast, and refined post-production.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Quote / Highlight Block */}
            <div className="lg:col-span-5">
              <div className="relative p-8 sm:p-10 bg-[#050505] border border-white/10 border-l-4 border-l-[#E11D48] shadow-2xl space-y-6">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E11D48] block">
                  01 // VERSATILITY FIRST
                </span>
                <p className="font-serif-editorial text-xl sm:text-2xl text-white italic leading-relaxed">
                  "Photography is not about forcing a scene into a template. It is about understanding the light, anticipating the motion, and capturing the story as it unfolds."
                </p>
                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="font-display font-semibold text-sm uppercase tracking-wide text-white block">
                      Alan Luby
                    </span>
                    <span className="text-xs text-white/50 font-light">Principal Photographer</span>
                  </div>
                  <div className="text-[#E11D48] font-mono text-xs font-bold">AL/P</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FEATURED WORK (EDITORIAL ASYMMETRIC GRID) */}
      <section id="featured-work-section" className="py-20 lg:py-28 bg-[#050505] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-white/10 gap-6">
            <div className="space-y-2">
              <div className="inline-block bg-[#E11D48] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                <span>Selected Frames</span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-semibold uppercase tracking-[0.02em] text-white">
                Featured Archive
              </h2>
            </div>
            
            <Link
              to="/work"
              id="featured-section-view-all"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors"
            >
              <span>EXPLORE ALL ARCHIVES</span>
              <ArrowRight className="w-4 h-4 text-[#E11D48]" />
            </Link>
          </div>

          {/* Asymmetric Editorial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Top Large Hero Image (7 cols) */}
            {featuredPhotos[0] && (
              <div className="md:col-span-7">
                <PhotoCard
                  photo={featuredPhotos[0]}
                  onSelect={setSelectedPhoto}
                  aspectClass="aspect-[16/10] sm:aspect-[16/9]"
                />
              </div>
            )}

            {/* Top Right Portrait Image (5 cols) */}
            {featuredPhotos[1] && (
              <div className="md:col-span-5">
                <PhotoCard
                  photo={featuredPhotos[1]}
                  onSelect={setSelectedPhoto}
                  aspectClass="aspect-[4/5] md:aspect-[3/4]"
                />
              </div>
            )}

            {/* Middle Row: 3 Column Asymmetric */}
            {featuredPhotos[2] && (
              <div className="md:col-span-5">
                <PhotoCard
                  photo={featuredPhotos[2]}
                  onSelect={setSelectedPhoto}
                  aspectClass="aspect-[4/3]"
                />
              </div>
            )}

            {featuredPhotos[3] && (
              <div className="md:col-span-4">
                <PhotoCard
                  photo={featuredPhotos[3]}
                  onSelect={setSelectedPhoto}
                  aspectClass="aspect-[3/4]"
                />
              </div>
            )}

            {featuredPhotos[4] && (
              <div className="md:col-span-3">
                <PhotoCard
                  photo={featuredPhotos[4]}
                  onSelect={setSelectedPhoto}
                  aspectClass="aspect-[3/4] md:aspect-square"
                />
              </div>
            )}

          </div>

          {/* Bottom Grid Actions */}
          <div className="mt-12 text-center">
            <Link
              to="/work"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#0A0A0A] border border-white/10 hover:border-[#E11D48] text-white text-xs font-bold uppercase tracking-widest transition-all"
            >
              <span>VIEW FULL GALLERY ARCHIVE ({photographyCollection.length}+ FRAMES)</span>
              <ArrowRight className="w-4 h-4 text-[#E11D48]" />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. PHOTOGRAPHY DISCIPLINES / CATEGORIES PREVIEW */}
      <section id="categories-section" className="py-20 lg:py-28 bg-[#0A0A0A] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-14 space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E11D48] block">
              VERSATILE CAPABILITIES
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-semibold uppercase tracking-[0.02em] text-white">
              Photography Disciplines
            </h2>
            <p className="text-sm sm:text-base text-white/60 font-light leading-relaxed">
              Alan approaches every category with dedicated technical precision and a commitment to narrative depth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeCategoryCards.map((cat, idx) => (
              <Link
                key={cat.key}
                to={`/work?category=${cat.key}`}
                id={`category-card-${cat.key}`}
                className="group relative bg-[#050505] border border-white/10 p-8 hover:border-[#E11D48] transition-all duration-300 flex flex-col justify-between min-h-[220px]"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#E11D48] font-bold">
                      0{idx + 1}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-[#E11D48] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold uppercase tracking-[0.02em] text-white group-hover:text-[#E11D48] transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-white/60 font-light leading-relaxed">
                    {cat.countDescription}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-white/40 group-hover:text-white">
                  <span>Explore Discipline</span>
                  <span className="text-[#E11D48] font-bold">→</span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* 5. "WHY ALAN" SECTION - KEY DIFFERENTIATORS */}
      <section id="why-alan-section" className="py-20 lg:py-28 bg-[#050505] border-b border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E11D48] block">
              The Alan Luby Advantage
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-semibold uppercase tracking-[0.02em] text-white">
              Why Work With Alan
            </h2>
            <p className="text-base text-white/60 font-light">
              A dependable, adaptable, and seasoned professional focused on delivering photographs that serve your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Differentiator 1: VERSATILE */}
            <div className="p-7 bg-[#0A0A0A] border border-white/10 hover:border-[#E11D48] transition-colors space-y-4">
              <div className="h-10 w-10 bg-[#111] border border-white/10 text-[#E11D48] flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-semibold uppercase tracking-[0.02em] text-white">
                VERSATILE
              </h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Comfortable working across events, portraits, journalism, and specialized visual assignments without missing a beat.
              </p>
            </div>

            {/* Differentiator 2: STORY-DRIVEN */}
            <div className="p-7 bg-[#0A0A0A] border border-white/10 hover:border-[#E11D48] transition-colors space-y-4">
              <div className="h-10 w-10 bg-[#111] border border-white/10 text-[#E11D48] flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-semibold uppercase tracking-[0.02em] text-white">
                STORY-DRIVEN
              </h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Focused on genuine human interactions and narrative context rather than simply snapping technically standard photos.
              </p>
            </div>

            {/* Differentiator 3: ADAPTABLE */}
            <div className="p-7 bg-[#0A0A0A] border border-white/10 hover:border-[#E11D48] transition-colors space-y-4">
              <div className="h-10 w-10 bg-[#111] border border-white/10 text-[#E11D48] flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-semibold uppercase tracking-[0.02em] text-white">
                ADAPTABLE
              </h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Able to seamlessly respond to shifting event schedules, unpredictable natural lighting, and rapid on-the-fly assignments.
              </p>
            </div>

            {/* Differentiator 4: PROFESSIONAL */}
            <div className="p-7 bg-[#0A0A0A] border border-white/10 hover:border-[#E11D48] transition-colors space-y-4">
              <div className="h-10 w-10 bg-[#111] border border-white/10 text-[#E11D48] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-semibold uppercase tracking-[0.02em] text-white">
                PROFESSIONAL
              </h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                A dependable, respectful client experience from the first scoping conversation through final curated asset delivery.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 6. ABOUT ALAN TEASER */}
      <section id="about-teaser-section" className="py-20 lg:py-28 bg-[#0A0A0A] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Image on left */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[3/4] bg-[#050505] border border-white/10 overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop"
                  alt="Alan Luby Photography Profile"
                  className="w-full h-full object-cover grayscale contrast-115"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-[#050505]/90 border border-white/10 p-3">
                  <p className="font-display text-xs font-semibold uppercase tracking-wider text-white">
                    Alan Luby
                  </p>
                  <p className="text-[10px] font-mono text-[#E11D48] font-bold uppercase tracking-widest">
                    Journalism • Events • Portraits • Editorial
                  </p>
                </div>
              </div>
            </div>

            {/* Content on right */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E11D48] block">
                MEET THE PHOTOGRAPHER
              </span>

              <h2 className="font-display text-3xl sm:text-5xl font-semibold uppercase tracking-[0.02em] text-white leading-none">
                A Different Kind of <br />
                <span className="text-white/70">
                  Photographer.
                </span>
              </h2>

              <p className="text-base text-white/70 font-light leading-relaxed">
                Alan Luby brings a diverse foundation rooted in journalism, event coverage, and authentic portraiture. 
                Rather than treating photography as an isolated transaction or rigid template, Alan approaches every client and project with curiosity, composure, and visual craftsmanship.
              </p>

              <p className="text-sm text-white/50 font-light leading-relaxed">
                Whether you are organizing a national event, publishing an editorial spread, or requiring elevated executive portraits, Alan provides the versatile eye and calm professionalism necessary to capture the definitive moments.
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  to="/about"
                  id="about-teaser-learn-more"
                  className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-widest px-6 py-3.5 transition-all"
                >
                  <span>READ ALAN'S FULL STORY</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                >
                  <span>View Services</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#E11D48]" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. SELECTED TESTIMONIALS */}
      <section id="home-testimonials-section" className="py-20 lg:py-24 bg-[#050505] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-6 border-b border-white/10 gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#E11D48] block">
                Client Trust
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold uppercase tracking-[0.02em] text-white mt-1">
                Client Experiences
              </h2>
            </div>

            <Link
              to="/testimonials"
              className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>VIEW ALL TESTIMONIALS</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E11D48]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonialsData.slice(0, 2).map((item) => (
              <div
                key={item.id}
                className="p-8 bg-[#0A0A0A] border border-white/10 relative flex flex-col justify-between space-y-6"
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

                <div className="pt-6 border-t border-white/10">
                  <span className="font-display font-semibold text-xs uppercase tracking-wide text-white block">
                    {item.clientRole}
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-white/50">
                    Assignment: {item.projectType}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. CALL TO ACTION & CONTACT BANNER */}
      <ContactCTASection
        headline="PHOTOGRAPHY BUILT AROUND THE MOMENT."
        subhead="Let's discuss your upcoming event, portrait session, or editorial assignment."
      />

      {/* LIGHTBOX MODAL */}
      <ImageModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onNext={handleNextPhoto}
        onPrev={handlePrevPhoto}
        hasNext={selectedPhoto ? photographyCollection.findIndex((p) => p.id === selectedPhoto.id) < photographyCollection.length - 1 : false}
        hasPrev={selectedPhoto ? photographyCollection.findIndex((p) => p.id === selectedPhoto.id) > 0 : false}
      />

    </div>
  );
};
