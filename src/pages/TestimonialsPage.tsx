import React from 'react';
import { attributionOf, curatedTestimonials } from '../data/testimonials';
import { InquiryBand } from '../components/InquiryBand';
import { PageMeta } from '../components/PageMeta';
import { Reveal, TextReveal } from '../components/Motion';

export const TestimonialsPage: React.FC = () => (
  <>
    <PageMeta
      title="Testimonials"
      description="What event organizers, families and businesses have said about working with photographer Alan Luby."
    />

    <section className="wrap pb-20 pt-12 sm:pt-16">
      <TextReveal as="h1" text="Testimonials" className="text-4xl sm:text-5xl" />
      <p className="mt-4 max-w-xl text-lg text-muted">
        Event organizers, families and businesses on working with Alan, in their own words.
      </p>

      <ul className="mt-14 columns-1 gap-12 md:columns-2">
        {curatedTestimonials.map((t, i) => (
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
