import React from 'react';
import { Link } from 'react-router-dom';
import { inquiryHref, servicesData } from '../data/services';
import { attributionOf, testimonialById } from '../data/testimonials';
import { Photo } from '../components/Photo';
import { InquiryBand } from '../components/InquiryBand';
import { PageMeta } from '../components/PageMeta';
import { ImageReveal, Reveal, TextReveal } from '../components/Motion';

const PROCESS = [
  { title: 'Get in touch', text: 'Send a short inquiry or call. Mention the occasion, the date and the location if you know them.' },
  { title: 'Plan together', text: 'Alan talks through the schedule, the people who matter most and the moments you want covered.' },
  { title: 'The day itself', text: 'Alan arrives prepared and works quietly around your program, session, game or show.' },
  { title: 'Your photographs', text: 'You receive edited, color-corrected digital images, ready to share and print.' },
];

export const ServicesPage: React.FC = () => (
  <>
    <PageMeta
      title="Services"
      description="Event and celebration photography, weddings and engagements, portraits and business headshots, sports and live performance photography by Alan Luby in South Florida."
    />

    <section className="wrap pb-12 pt-12 sm:pt-16">
      <TextReveal as="h1" text="Services" className="text-4xl sm:text-5xl" />
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Alan photographs people at their occasions and weddings, in portraits, in competition and on stage. Here is what each kind of
        coverage includes and how to start a conversation about yours.
      </p>
      <nav aria-label="Services on this page" className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
        {servicesData.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="text-link">{s.title}</a>
        ))}
      </nav>
    </section>

    {servicesData.map((s, i) => {
      const quote = s.testimonialId ? testimonialById(s.testimonialId) : null;
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
              <div>
                <h3 className="mb-1 text-base">Who it’s for</h3>
                <p className="text-muted">{s.whoFor}</p>
              </div>
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
              {quote && (
                <figure className="border-l-2 border-accent/40 pl-5">
                  <blockquote className="font-display text-lg leading-snug">“{quote.excerpt}”</blockquote>
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

    <section aria-labelledby="process" className="border-t border-line bg-sand/50 py-16 lg:py-24">
      <div className="wrap">
        <TextReveal id="process" text="How it works" className="text-3xl sm:text-4xl" />
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

    <InquiryBand />
  </>
);
