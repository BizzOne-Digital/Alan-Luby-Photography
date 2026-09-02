import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { photographyCollection, photoCategories } from '../data/photography';
import { PhotoCard } from '../components/PhotoCard';
import { ImageModal } from '../components/ImageModal';
import { ContactCTASection } from '../components/ContactCTASection';
import { PhotoItem, PhotoCategory } from '../types';
import { Layers, Info } from 'lucide-react';

export const WorkPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = (searchParams.get('category') as PhotoCategory) || 'all';
  
  const [activeCategory, setActiveCategory] = useState<PhotoCategory>(initialCategory);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  // Sync category with URL parameters
  useEffect(() => {
    const cat = searchParams.get('category') as PhotoCategory;
    if (cat && photoCategories.some((c) => c.key === cat)) {
      setActiveCategory(cat);
    } else {
      setActiveCategory('all');
    }
  }, [searchParams]);

  const handleCategoryChange = (cat: PhotoCategory) => {
    setActiveCategory(cat);
    if (cat === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  const filteredPhotos = activeCategory === 'all'
    ? photographyCollection
    : photographyCollection.filter((p) => p.category === activeCategory);

  const handleNextPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
    if (currentIndex < filteredPhotos.length - 1) {
      setSelectedPhoto(filteredPhotos[currentIndex + 1]);
    }
  };

  const handlePrevPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
    if (currentIndex > 0) {
      setSelectedPhoto(filteredPhotos[currentIndex - 1]);
    }
  };

  return (
    <div id="work-portfolio-page" className="min-h-screen bg-[#050505] text-[#F5F5F4] pt-28 pb-20">
      
      {/* Portfolio Header */}
      <div className="relative isolate">
        {/* Hero background */}
        <div className="absolute inset-0 -top-28 -z-10 overflow-hidden" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1920&auto=format&fit=crop"
            srcSet="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=75&w=768&auto=format&fit=crop 768w,
                    https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=75&w=1280&auto=format&fit=crop 1280w,
                    https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1920&auto=format&fit=crop 1920w,
                    https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2560&auto=format&fit=crop 2560w"
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-10 gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-block bg-[#E11D48] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
              <span>Selected Works</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white leading-none">
              Photography Archive
            </h1>
            <p className="text-base sm:text-xl text-white/60 font-light leading-relaxed">
              An expansive collection spanning live events, photojournalism, executive portraiture, and editorial storytelling.
            </p>
          </div>

          {/* Quick Counter & Guide toggle */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-[#0A0A0A] border border-white/10 text-xs font-mono text-white/70">
              <span className="text-[#E11D48] font-bold">{filteredPhotos.length}</span> FRAMES ARCHIVED
            </div>
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="p-2 bg-[#0A0A0A] border border-white/10 text-white/50 hover:text-white transition-colors"
              title="Information on replacing photography slots"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Client Image Organization Notice (Collapsible) */}
        {showGuide && (
          <div className="mt-6 p-5 bg-[#0A0A0A] border border-white/10 text-xs text-white/70 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-[#E11D48] font-bold uppercase tracking-wider">
              <span>Image Repository & Replacement Architecture</span>
              <button 
                type="button" 
                onClick={() => setShowGuide(false)}
                className="text-white/40 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="font-light">
              This portfolio is structured modularly in <code className="text-[#E11D48] bg-[#111] px-1 py-0.5 font-mono">src/data/photography.ts</code>. 
              To swap in Alan's latest assignment photos or client galleries, simply add or update image URLs, captions, and category tags in that file.
            </p>
          </div>
        )}

        {/* Category Filter Pills */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold mr-2 shrink-0 hidden sm:inline">
            Discipline:
          </span>
          {photoCategories.map((category) => {
            const isActive = activeCategory === category.key;
            return (
              <button
                key={category.key}
                id={`filter-btn-${category.key}`}
                type="button"
                onClick={() => handleCategoryChange(category.key)}
                className={`shrink-0 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-200 border ${
                  isActive
                    ? 'bg-[#E11D48] border-[#E11D48] text-white shadow-lg'
                    : 'bg-[#0A0A0A] border-white/10 text-white/60 hover:text-white hover:border-white/30'
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </section>
      </div>

      {/* Photography Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredPhotos.length === 0 ? (
          <div className="py-24 text-center space-y-4 border border-dashed border-white/10 bg-[#0A0A0A]">
            <Layers className="w-12 h-12 text-white/20 mx-auto" />
            <h3 className="font-display text-xl font-black uppercase text-white tracking-tight">
              No Photographs In This Category
            </h3>
            <p className="text-sm text-white/50 font-light">
              Try selecting "ALL WORK" to view the complete catalog.
            </p>
            <button
              type="button"
              onClick={() => handleCategoryChange('all')}
              className="mt-2 px-5 py-2.5 bg-[#E11D48] text-white text-xs font-bold uppercase tracking-widest"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPhotos.map((photo, idx) => {
              // Create subtle editorial variation in aspect ratios
              let customAspect = undefined;
              if (idx % 5 === 0) customAspect = 'aspect-[16/10]';
              else if (idx % 3 === 0) customAspect = 'aspect-[3/4]';
              else if (idx % 2 === 0) customAspect = 'aspect-[4/3]';

              return (
                <div key={photo.id} className="transition-all duration-300">
                  <PhotoCard
                    photo={photo}
                    onSelect={setSelectedPhoto}
                    aspectClass={customAspect}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Bottom Conversion Section */}
      <div className="mt-24">
        <ContactCTASection
          headline="HAVE A SPECIFIC ASSIGNMENT IN MIND?"
          subhead="Alan Luby is available for events, editorial commissions, portrait sessions, and custom projects."
        />
      </div>

      {/* Lightbox Modal */}
      <ImageModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onNext={handleNextPhoto}
        onPrev={handlePrevPhoto}
        hasNext={selectedPhoto ? filteredPhotos.findIndex((p) => p.id === selectedPhoto.id) < filteredPhotos.length - 1 : false}
        hasPrev={selectedPhoto ? filteredPhotos.findIndex((p) => p.id === selectedPhoto.id) > 0 : false}
      />

    </div>
  );
};
