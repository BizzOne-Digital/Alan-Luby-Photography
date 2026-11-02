import React from 'react';
import { Link } from 'react-router-dom';
import { Photo } from '../components/Photo';
import { InquiryBand } from '../components/InquiryBand';
import { PageMeta } from '../components/PageMeta';
import { ImageReveal, Reveal, TextReveal } from '../components/Motion';
import { mediaUrl } from '../lib/api';
import { useSite } from '../site/SiteProvider';

export const AboutPage: React.FC = () => {
  const site = useSite();
  const { content: c, seoTitle, seoDescription } = site.page('about');
  const careerPhoto = site.photo(c.careerPhoto);
  const examples = site.photoList(c.examplesPhotos);
  const approach = [1, 2, 3, 4].map((n) => [c[`approach${n}Title`], c[`approach${n}Text`]]).filter(([term]) => term);

  return (
  <>
    <PageMeta title={seoTitle || undefined} description={seoDescription} />

    <section className="wrap grid gap-10 pb-16 pt-12 sm:pt-16 lg:grid-cols-[1fr_1.4fr] lg:gap-20 lg:pb-24">
      <div>
        <p className="eyebrow">{c.eyebrow}</p>
        <TextReveal as="h1" text={c.heading} className="mt-3 text-4xl sm:text-5xl" />
        {c.portrait && (
        <ImageReveal delay={0.2} className="mt-8 aspect-[4/5] max-w-md">
          <img
            src={mediaUrl(c.portrait)}
            alt="Portrait of photographer Alan Luby"
            width={3000}
            height={1995}
            fetchPriority="high"
            className="h-full w-full object-cover object-[55%_center]"
          />
        </ImageReveal>
        )}
      </div>

      <Reveal delay={0.3} className="max-w-2xl space-y-5 text-lg lg:pt-10">
        {c.bio1 && <p>{c.bio1}</p>}
        {c.bio2 && <p className="text-muted">{c.bio2}</p>}
        {c.bio3 && <p className="text-muted">{c.bio3}</p>}
      </Reveal>
    </section>

    <section aria-labelledby="career" className="border-t border-line py-16 lg:py-24">
      <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center lg:gap-20">
        <div className="space-y-4">
          <p className="eyebrow">{c.careerEyebrow}</p>
          <TextReveal id="career" text={c.careerHeading} className="text-3xl sm:text-4xl" />
          <Reveal>
            <p className="text-muted">{c.careerText}</p>
          </Reveal>
        </div>
        <figure>
          <ImageReveal>
            <Photo photo={careerPhoto} sizes="(min-width: 1024px) 55vw, 100vw" />
          </ImageReveal>
          {careerPhoto.title && <figcaption className="mt-2 text-sm text-muted">{careerPhoto.title}. Photograph by Alan Luby.</figcaption>}
        </figure>
      </div>
    </section>

    <section aria-labelledby="approach" className="border-t border-line py-16 lg:py-24">
      <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <TextReveal id="approach" text={c.approachHeading} className="text-3xl sm:text-4xl" />
        <dl className="grid max-w-2xl gap-8 sm:grid-cols-2">
          {approach.map(([term, text]) => (
            <div key={term}>
              <dt className="font-semibold">{term}</dt>
              <dd className="mt-1.5 text-muted">{text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>

    {examples.length > 0 && (
    <section aria-labelledby="examples" className="border-t border-line py-16 lg:py-24">
      <div className="wrap">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <TextReveal id="examples" text={c.examplesHeading} className="text-3xl sm:text-4xl" />
          <Link to="/work" className="text-link">View the portfolio</Link>
        </div>
        <ul className="grid gap-4 sm:grid-cols-3">
          {examples.map((p, i) => (
            <li key={p.id}>
              <figure>
                <ImageReveal delay={i * 0.12} className="aspect-[3/2]">
                  <Photo photo={p} cover sizes="(min-width: 640px) 33vw, 100vw" />
                </ImageReveal>
                <figcaption className="mt-2 text-sm text-muted">{p.title}. Photograph by Alan Luby.</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
    )}

    <InquiryBand title={c.closingTitle} />
  </>
  );
};
