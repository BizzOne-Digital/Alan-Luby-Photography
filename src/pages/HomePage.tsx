import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { photographyCollection, photoCategories, heroImages } from '../data/photography';
import { testimonialsData } from '../data/testimonials';
import { PhotoCard } from '../components/PhotoCard';
import { ImageModal } from '../components/ImageModal';
import { ContactCTASection } from '../components/ContactCTASection';
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

// Featured grid: one entry per featured photo, in photography.ts order.
// Portrait-oriented photos get the tall slot so faces and gestures are not cropped away.
const FEATURED_LAYOUT = [
  { span: 'md:col-span-7', aspect: 'aspect-[3/2]' },
  { span: 'md:col-span-5', aspect: 'aspect-[4/5] md:aspect-auto md:h-full' },
  { span: 'md:col-span-6', aspect: 'aspect-[3/2]' },
  { span: 'md:col-span-6', aspect: 'aspect-[3/2]' },
  { span: 'md:col-span-6', aspect: 'aspect-[3/2]' },
  { span: 'md:col-span-6', aspect: 'aspect-[3/2]' },
];

// Cover photo per category card (chosen to avoid repeating the hero and featured grid)
const CATEGORY_COVERS: Record<string, string> = {
  events: 'dsc-88579',
  portraits: 'dsc-01779',
  sports: 'dsc-9457',
  entertainment: 'dsc-11947',
  commercial: 'dsc-3522',
};

export const HomePage: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  const featuredPhotos = photographyCollection.filter((p) => p.featuredOnHome).slice(0, FEATURED_LAYOUT.length);
  const featuredTestimonials = testimonialsData.filter((t) => t.featured);
  const homeCategoryCards = photoCategories.filter((c) => c.key !== 'all');
  const hero = heroImages.home;
  const teaserPhoto = photographyCollection.find((p) => p.id === 'jws-26102')!;

  const selectedIndex = selectedPhoto ? featuredPhotos.findIndex((p) => p.id === selectedPhoto.id) : -1;
  const handleNextPhoto = () => {
    if (selectedIndex >= 0 && selectedIndex < featuredPhotos.length - 1) setSelectedPhoto(featuredPhotos[selectedIndex + 1]);
  };
  const handlePrevPhoto = () => {
    if (selectedIndex > 0) setSelectedPhoto(featuredPhotos[selectedIndex - 1]);
  };

  return (
    <div id="home-page" className="min-h-screen bg-[#050505] text-[#F5F5F4]">

      {/* 1. HERO SECTION */}
      <section id="hero-section" className="relative min-h-[92vh] flex items-end md:items-center justify-center pt-24 pb-16 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <img
            src={hero.imageSrc}
            srcSet={`${hero.srcSet}, ${hero.originalSrc} 2300w`}
            sizes="100vw"
            alt={hero.altText}
            // Mobile crops the sides away, so centre on the dancer's face; desktop shows the full width
            className="w-full h-full object-cover object-[42%_12%] md:object-[68%_8%]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          {/* Scrims keep the headline legible; on desktop the dancer on the right stays in full color */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent md:via-[#050505]/10" />
          <div className="absolute inset-0
            bg-[linear-gradient(to_right,rgba(5,5,5,0.75)_0%,rgba(5,5,5,0.45)_100%)]
            md:bg-[linear-gradient(to_right,rgba(5,5,5,0.92)_0%,rgba(5,5,5,0.7)_38%,rgba(5,5,5,0.1)_68%,transparent_100%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl space-y-8">

            <div className="inline-block bg-[#E11D48] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
              <span>ALAN LUBY // EVENT & PORTRAIT PHOTOGRAPHY</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold uppercase tracking-[0.02em] text-white leading-none">
              Real Moments. <br />
              <span className="text-white/85">
                Real People.
              </span> <br />
              <span className="text-[#E11D48]">
                Real Energy.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-white/85 font-light leading-relaxed max-w-xl">
              <strong className="text-white font-bold">Alan Luby </strong>
              photographs events, portraits, sports and performances across South Florida, with more than 30 years behind the camera.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/work"
                id="hero-cta-portfolio"
                className="inline-flex items-center justify-center gap-3 bg-[#E11D48] hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-widest px-8 py-4 transition-all duration-200"
              >
                <span>VIEW PORTFOLIO</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/contact"
                id="hero-cta-contact"
                className="inline-flex items-center justify-center gap-2 border border-white/30 bg-black/30 hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-widest px-7 py-4 transition-all duration-200"
              >
                <span>CHECK YOUR DATE</span>
                <ArrowUpRight className="w-4 h-4 text-[#E11D48]" />
              </Link>
            </div>

            <div className="pt-8 border-t border-white/15 flex flex-wrap items-center gap-y-2 gap-x-8 text-[11px] text-white/70 font-mono tracking-widest uppercase">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#E11D48]" />
                Events & Celebrations
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#E11D48]" />
                Portrait Sessions
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#E11D48]" />
                Sports & Entertainment
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

      {/* 2. POSITIONING SECTION */}
      <section id="positioning-section" className="py-20 lg:py-28 bg-[#0A0A0A] border-b border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-7 space-y-6">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E11D48] block">
                HOW ALAN WORKS
              </span>

              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold uppercase tracking-[0.02em] text-white leading-none">
                Present for the moment. <br />
                <span className="text-[#E11D48]">Ready</span> before it happens.
              </h2>

              <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed">
                The laugh during a toast, the leap at the peak of a dance, the catch in traffic: these moments
                last a fraction of a second. Years of covering fast-moving sports and live events taught Alan to
                anticipate them, and his portrait work taught him to put people at ease so they look like themselves.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-6 bg-[#050505] border border-white/10 space-y-1.5">
                  <span className="text-xs font-black uppercase tracking-widest text-[#E11D48] block">
                    Real Expression
                  </span>
                  <p className="text-xs text-white/60 font-light leading-relaxed">
                    Candid emotion and connection, captured without interrupting the occasion.
                  </p>
                </div>
                <div className="p-6 bg-[#050505] border border-white/10 space-y-1.5">
                  <span className="text-xs font-black uppercase tracking-widest text-[#E11D48] block">
                    Precise Timing
                  </span>
                  <p className="text-xs text-white/60 font-light leading-relaxed">
                    Anticipating action on the field, the stage and the dance floor.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative p-8 sm:p-10 bg-[#050505] border border-white/10 border-l-4 border-l-[#E11D48] shadow-2xl space-y-6">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E11D48] block">
                  WHAT TO EXPECT
                </span>
                <p className="font-serif-editorial text-xl sm:text-2xl text-white leading-relaxed">
                  A photographer who reads the room, respects the program, and keeps working until the last
                  meaningful moment has been captured.
                </p>
                <div className="pt-6 border-t border-white/10 text-xs text-white/50 font-light">
                  Events • Portraits • Sports • Entertainment • Commercial
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FEATURED WORK */}
      <section id="featured-work-section" className="py-20 lg:py-28 bg-[#050505] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-white/10 gap-6">
            <div className="space-y-2">
              <div className="inline-block bg-[#E11D48] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                <span>Selected Work</span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-semibold uppercase tracking-[0.02em] text-white">
                Featured Photographs
              </h2>
            </div>

            <Link
              to="/work"
              id="featured-section-view-all"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors"
            >
              <span>VIEW FULL PORTFOLIO</span>
              <ArrowRight className="w-4 h-4 text-[#E11D48]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {featuredPhotos.map((photo, i) => (
              <div key={photo.id} className={FEATURED_LAYOUT[i].span}>
                <PhotoCard
                  photo={photo}
                  onSelect={setSelectedPhoto}
                  aspectClass={FEATURED_LAYOUT[i].aspect}
                  sizes="(min-width: 768px) 58vw, 100vw"
                />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/work"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#0A0A0A] border border-white/10 hover:border-[#E11D48] text-white text-xs font-bold uppercase tracking-widest transition-all"
            >
              <span>VIEW ALL {photographyCollection.length} PHOTOGRAPHS</span>
              <ArrowRight className="w-4 h-4 text-[#E11D48]" />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. CATEGORIES PREVIEW */}
      <section id="categories-section" className="py-20 lg:py-28 bg-[#0A0A0A] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="max-w-2xl mb-14 space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E11D48] block">
              WHAT ALAN PHOTOGRAPHS
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-semibold uppercase tracking-[0.02em] text-white">
              Services
            </h2>
            <p className="text-sm sm:text-base text-white/60 font-light leading-relaxed">
              Events and portraits are at the heart of Alan's work, supported by sports, entertainment and business photography.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeCategoryCards.map((cat, idx) => (
              <Link
                key={cat.key}
                to={`/work?category=${cat.key}`}
                id={`category-card-${cat.key}`}
                className="group relative bg-[#050505] border border-white/10 hover:border-[#E11D48] transition-all duration-300 flex flex-col overflow-hidden"
              >
                {(() => {
                  const cover = photographyCollection.find((p) => p.id === CATEGORY_COVERS[cat.key]);
                  return cover && (
                    <div className="aspect-[3/2] overflow-hidden bg-[#111]">
                      <img
                        src={cover.imageSrc}
                        srcSet={cover.srcSet}
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        alt={cover.altText}
                        loading="lazy"
                        decoding="async"
                        style={{ objectPosition: cover.focus }}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                  );
                })()}
                <div className="p-8 flex flex-col justify-between flex-1 gap-6">
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
                  <span>View Work</span>
                  <span className="text-[#E11D48] font-bold">→</span>
                </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* 5. WHY ALAN */}
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
              A dependable, experienced professional focused on photographs you'll be proud to share.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="p-7 bg-[#0A0A0A] border border-white/10 hover:border-[#E11D48] transition-colors space-y-4">
              <div className="h-10 w-10 bg-[#111] border border-white/10 text-[#E11D48] flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-semibold uppercase tracking-[0.02em] text-white">
                VERSATILE
              </h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Comfortable moving between a banquet program, a family portrait session, a game and a stage show.
              </p>
            </div>

            <div className="p-7 bg-[#0A0A0A] border border-white/10 hover:border-[#E11D48] transition-colors space-y-4">
              <div className="h-10 w-10 bg-[#111] border border-white/10 text-[#E11D48] flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-semibold uppercase tracking-[0.02em] text-white">
                PEOPLE-FOCUSED
              </h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Focused on genuine expressions and connection, not just the shot list.
              </p>
            </div>

            <div className="p-7 bg-[#0A0A0A] border border-white/10 hover:border-[#E11D48] transition-colors space-y-4">
              <div className="h-10 w-10 bg-[#111] border border-white/10 text-[#E11D48] flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-semibold uppercase tracking-[0.02em] text-white">
                ADAPTABLE
              </h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Ready for shifting schedules, changing light and fast-moving action.
              </p>
            </div>

            <div className="p-7 bg-[#0A0A0A] border border-white/10 hover:border-[#E11D48] transition-colors space-y-4">
              <div className="h-10 w-10 bg-[#111] border border-white/10 text-[#E11D48] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-semibold uppercase tracking-[0.02em] text-white">
                PROFESSIONAL
              </h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                On time, prepared and respectful, from the first conversation to the final gallery.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 6. ABOUT ALAN TEASER (portfolio image; no confirmed portrait of Alan was supplied) */}
      <section id="about-teaser-section" className="py-20 lg:py-28 bg-[#0A0A0A] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/3] bg-[#050505] border border-white/10 overflow-hidden shadow-2xl">
                <img
                  src={teaserPhoto.imageSrc}
                  srcSet={teaserPhoto.srcSet}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  alt={teaserPhoto.altText}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: teaserPhoto.focus }}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-2 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                Photograph by Alan Luby
              </p>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E11D48] block">
                MEET THE PHOTOGRAPHER
              </span>

              <h2 className="font-display text-3xl sm:text-5xl font-semibold uppercase tracking-[0.02em] text-white leading-none">
                30+ Years <br />
                <span className="text-white/70">
                  Behind the Camera.
                </span>
              </h2>

              <p className="text-base text-white/70 font-light leading-relaxed">
                Based in Boynton Beach, Florida, Alan Luby photographs conventions, banquets, celebrations, portraits
                and performances for individuals, families and organizations.
              </p>

              <p className="text-sm text-white/50 font-light leading-relaxed">
                Earlier in his career he photographed sports and news for South Florida newspapers. That experience
                shows today in his timing and his calm under pressure.
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  to="/about"
                  id="about-teaser-learn-more"
                  className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-widest px-6 py-3.5 transition-all"
                >
                  <span>ABOUT ALAN</span>
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
                Client Feedback
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredTestimonials.map((item) => (
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
                  <blockquote className="font-serif-editorial text-lg text-white/90 italic leading-relaxed">
                    “{item.quote}”
                  </blockquote>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <span className="font-display font-semibold text-xs uppercase tracking-wide text-white block">
                    {item.clientRole}
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-white/50">
                    {[item.organization, item.location].filter(Boolean).join(' · ')}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. CALL TO ACTION */}
      <ContactCTASection
        headline="LET'S PHOTOGRAPH YOUR NEXT EVENT."
        subhead="Tell Alan about your event, portrait session, game or performance."
      />

      <ImageModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onNext={handleNextPhoto}
        onPrev={handlePrevPhoto}
        hasNext={selectedIndex >= 0 && selectedIndex < featuredPhotos.length - 1}
        hasPrev={selectedIndex > 0}
      />

    </div>
  );
};
