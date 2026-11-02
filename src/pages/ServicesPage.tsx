import React from 'react';
import { Link } from 'react-router-dom';
import { inquiryHref } from '../data/services';
import { attributionOf } from '../data/testimonials';
import { Photo } from '../components/Photo';
import { InquiryBand } from '../components/InquiryBand';
import { PageMeta } from '../components/PageMeta';
import { ImageReveal, Reveal, TextReveal } from '../components/Motion';
import { useSite } from '../site/SiteProvider';

export const ServicesPage: React.FC = () => {
  const site = useSite();
  const { content: c, seoTitle, seoDescription } = site.page('services');
  const PROCESS = [1, 2, 3, 4].map((n) => ({ title: c[`step${n}Title`], text: c[`step${n}Text`] })).filter((s) => s.title);

  return (
  <>
    <PageMeta title={seoTitle || undefined} description={seoDescription} />

    <section className="wrap pb-12 pt-12 sm:pt-16">
      <TextReveal as="h1" text={c.heading} className="text-4xl sm:text-5xl" />
      <p className="mt-4 max-w-2xl text-lg text-muted">{c.intro}</p>
      <nav aria-label="Services on this page" className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
        {site.services.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="text-link">{s.title}</a>
        ))}
      </nav>
    </section>

    {site.services.map((s, i) => {
      const quote = s.testimonialId ? site.testimonial(s.testimonialId) : null;
      const flip = i % 2 === 1;
      return (
        <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="border-t border-line py-16 lg:py-24">
          <div className="wrap grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className={`space-y-3 ${flip ? 'lg:order-2' : ''}`}>
              <ImageReveal>
                <Photo photo={s.image} sizes="(min-width: 1024px) 45vw, 100vw" />
              </ImageReveal>
              <div className="grid grid-cols-2 gap-3">
                {s.supporting.map((p, j) => (
                  <ImageReveal key={p.id} delay={0.15 + j * 0.12} className="aspect-[3/2]">
                    <Photo photo={p} cover sizes="(min-width: 1024px) 22vw, 50vw" />
                  </ImageReveal>
                ))}
              </div>
            </div>

            <div className={`space-y-6 lg:pt-4 ${flip ? 'lg:order-1' : ''}`}>
              <TextReveal id={`${s.id}-title`} text={s.title} className="text-3xl sm:text-4xl" />
              <Reveal><p className="text-lg">{s.summary}</p></Reveal>
              {s.whoFor && (
              <div>
                <h3 className="mb-1 text-base">Who it’s for</h3>
                <p className="text-muted">{s.whoFor}</p>
              </div>
              )}
              {s.photographs.length > 0 && (
              <div>
                <h3 className="mb-2 text-base">What Alan photographs</h3>
                <ul className="space-y-1.5 text-muted">
                  {s.photographs.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              )}
              {quote && (
                <figure className="border-l-2 border-accent/40 pl-5">
                  <blockquote className="font-display text-lg leading-snug">“{quote.excerpt || quote.quote}”</blockquote>
                  <figcaption className="mt-2 text-sm text-muted">{attributionOf(quote)}</figcaption>
                </figure>
              )}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
                <Link to={inquiryHref(s.inquiryValue)} className="btn-primary">Inquire about {s.shortTitle.toLowerCase()}</Link>
                <Link to={`/work?category=${s.id}`} className="text-link">See {s.shortTitle.toLowerCase()} work</Link>
              </div>
            </div>
          </div>
        </section>
      );
    })}

    {PROCESS.length > 0 && (
    <section aria-labelledby="process" className="border-t border-line bg-sand/50 py-16 lg:py-24">
      <div className="wrap">
        <TextReveal id="process" text={c.processHeading} className="text-3xl sm:text-4xl" />
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((step, i) => (
            <li key={step.title}>
              <Reveal delay={i * 0.12} className="space-y-2">
              <span className="font-display text-2xl text-accent">{i + 1}</span>
              <h3 className="text-lg">{step.title}</h3>
              <p className="text-[0.95rem] text-muted">{step.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
    )}

    <InquiryBand />
  </>
  );
};
