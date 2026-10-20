import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { categoryLabels, parseCategory, photographyCollection } from '../data/photography';
import { inquiryHref, serviceById } from '../data/services';
import { PhotoCategory } from '../types';
import { Gallery } from '../components/Gallery';
import { InquiryBand } from '../components/InquiryBand';
import { PageMeta } from '../components/PageMeta';
import { TextReveal } from '../components/Motion';

const FILTERS: (PhotoCategory | null)[] = [null, 'events', 'portraits', 'sports', 'performance'];

export const WorkPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const active = parseCategory(searchParams.get('category'));
  const photos = active ? photographyCollection.filter((p) => p.category === active) : photographyCollection;
  const service = active && serviceById(active);

  return (
    <>
      <PageMeta
        title={active ? `${categoryLabels[active]} photography` : 'Work'}
        description="Selected photographs by Alan Luby: events and celebrations, portraits, sports and live performance across South Florida."
      />

      <section className="wrap pb-20 pt-12 sm:pt-16">
        <TextReveal as="h1" text="Work" className="text-4xl sm:text-5xl" />
        <p className="mt-4 max-w-xl text-lg text-muted">
          A selection of recent photographs. Choose a category, or select any photograph to see it in full.
        </p>

        <div role="group" aria-label="Filter by category" className="mt-10 flex flex-wrap gap-2 border-b border-line pb-6">
          {FILTERS.map((key) => {
            const pressed = key === active;
            return (
              <button
                key={key ?? 'all'}
                type="button"
                aria-pressed={pressed}
                onClick={() => setSearchParams(key ? { category: key } : {}, { replace: true })}
                className={`min-h-11 rounded-full px-5 text-[0.95rem] font-medium transition-colors ${
                  pressed ? 'bg-ink text-paper' : 'text-muted hover:bg-ink/5 hover:text-ink'
                }`}
              >
                {key ? categoryLabels[key] : 'All'}
              </button>
            );
          })}
        </div>

        <div className="mt-10">
          {/* key resets the lightbox when the filter changes */}
          <Gallery key={active ?? 'all'} photos={photos} showCategory={!active} />
        </div>

        {service && (
          <p className="mt-14 max-w-2xl text-lg">
            {service.summary}{' '}
            <Link to={`/services#${service.id}`} className="text-link">How {service.title.toLowerCase()} coverage works</Link>
            {' or '}
            <Link to={inquiryHref(service.inquiryValue)} className="text-link">inquire about {service.title.toLowerCase()}</Link>.
          </p>
        )}
      </section>

      <InquiryBand />
    </>
  );
};
