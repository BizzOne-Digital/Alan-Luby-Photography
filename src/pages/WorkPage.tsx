import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { parseCategory } from '../data/photography';
import { inquiryHref } from '../data/services';
import { Gallery } from '../components/Gallery';
import { InquiryBand } from '../components/InquiryBand';
import { PageMeta } from '../components/PageMeta';
import { TextReveal } from '../components/Motion';
import { useSite } from '../site/SiteProvider';

export const WorkPage: React.FC = () => {
  const site = useSite();
  const { content: c, seoTitle, seoDescription } = site.page('work');
  const { categoryLabels } = site;
  const [searchParams, setSearchParams] = useSearchParams();
  const param = parseCategory(searchParams.get('category')) ?? searchParams.get('category');
  const active = param && categoryLabels[param] ? param : null;
  const photos = active ? site.workPhotos.filter((p) => p.category === active) : site.workPhotos;
  const service = active ? site.service(active) : undefined;
  // Only categories that have photos get a filter button.
  const FILTERS: (string | null)[] = [null, ...site.services.map((s) => s.id).filter((id) => site.workPhotos.some((p) => p.category === id))];

  return (
    <>
      <PageMeta
        title={active ? `${categoryLabels[active]} photography` : seoTitle || undefined}
        description={seoDescription}
      />

      <section className="wrap pb-20 pt-12 sm:pt-16">
        <TextReveal as="h1" text={c.heading} className="text-4xl sm:text-5xl" />
        <p className="mt-4 max-w-xl text-lg text-muted">{c.intro}</p>

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
