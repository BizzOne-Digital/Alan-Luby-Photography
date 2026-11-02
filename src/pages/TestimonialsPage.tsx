import React from 'react';
import { attributionOf } from '../data/testimonials';
import { InquiryBand } from '../components/InquiryBand';
import { PageMeta } from '../components/PageMeta';
import { Reveal, TextReveal } from '../components/Motion';
import { useSite } from '../site/SiteProvider';

export const TestimonialsPage: React.FC = () => {
  const site = useSite();
  const { content: c, seoTitle, seoDescription } = site.page('testimonials');
  return (
  <>
    <PageMeta title={seoTitle || undefined} description={seoDescription} />

    <section className="wrap pb-20 pt-12 sm:pt-16">
      <TextReveal as="h1" text={c.heading} className="text-4xl sm:text-5xl" />
      <p className="mt-4 max-w-xl text-lg text-muted">{c.intro}</p>

      <ul className="mt-14 columns-1 gap-12 md:columns-2">
        {site.pageTestimonials.map((t, i) => (
          <li key={t.id} className="mb-12 break-inside-avoid">
            <Reveal delay={(i % 2) * 0.12}>
            <figure className="space-y-4 border-l-2 border-accent/40 pl-6">
              <blockquote className="text-lg leading-relaxed">“{t.quote}”</blockquote>
              <figcaption className="text-sm text-muted">{attributionOf(t)}</figcaption>
            </figure>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>

    <InquiryBand />
  </>
  );
};
