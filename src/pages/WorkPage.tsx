import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { photographyCollection, photoCategories, heroImages } from '../data/photography';
import { PhotoCard } from '../components/PhotoCard';
import { ImageModal } from '../components/ImageModal';
import { ContactCTASection } from '../components/ContactCTASection';
import { PageHeroImage } from '../components/PageHeroImage';
import { PhotoItem, PhotoCategory } from '../types';
import { Layers } from 'lucide-react';

export const WorkPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // Unknown or retired categories (e.g. old ?category=journalism links) fall back to all work
  const categoryFromUrl = (): PhotoCategory => {
    const cat = searchParams.get('category');
    return photoCategories.find((c) => c.key === cat)?.key ?? 'all';
  };

  const [activeCategory, setActiveCategory] = useState<PhotoCategory>(categoryFromUrl);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  // Sync category with URL parameters
  useEffect(() => {
    setActiveCategory(categoryFromUrl());
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
        <PageHeroImage photo={heroImages.work} />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-10 gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-block bg-[#E11D48] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
              <span>Selected Work</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-semibold uppercase tracking-[0.02em] text-white leading-none">
              Portfolio
            </h1>
            <p className="text-base sm:text-xl text-white/70 font-light leading-relaxed">
              Events and portraits, alongside sports, entertainment and business photography.
            </p>
          </div>

          <div className="px-4 py-2 bg-[#0A0A0A]/80 border border-white/10 text-xs font-mono text-white/70 self-start md:self-auto">
            <span className="text-[#E11D48] font-bold">{filteredPhotos.length}</span> PHOTOGRAPHS
          </div>
        </div>

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
            <h3 className="font-display text-xl font-semibold uppercase text-white tracking-[0.02em]">
              No Photographs In This Category
            </h3>
            <p className="text-sm text-white/50 font-light">
              Select "ALL WORK" to see the full portfolio.
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
          // Masonry columns: each card keeps its own height, so mixed portrait/landscape frames leave no gaps
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 sm:gap-8">
            {filteredPhotos.map((photo) => (
              <div key={photo.id} className="break-inside-avoid mb-6 sm:mb-8">
                <PhotoCard photo={photo} onSelect={setSelectedPhoto} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bottom Conversion Section */}
      <div className="mt-24">
        <ContactCTASection
          headline="PLANNING AN EVENT OR PORTRAIT SESSION?"
          subhead="Alan is available for events, portrait sessions, sports, performances and business photography."
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
