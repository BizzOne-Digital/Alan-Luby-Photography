import React from 'react';
import { Link } from 'react-router-dom';
import { careerPhoto, photoById } from '../data/photography';
import { Photo } from '../components/Photo';
import { InquiryBand } from '../components/InquiryBand';
import { PageMeta } from '../components/PageMeta';
import { ImageReveal, Reveal, TextReveal } from '../components/Motion';

const examples = ['dsc-5575', 'dsc-46779', 'dsc-68467'].map(photoById);

export const AboutPage: React.FC = () => (
  <>
    <PageMeta
      title="About Alan Luby"
      description="Alan Luby is a Boynton Beach photographer with over 30 years of experience photographing events, portraits, sports and live performances."
    />

    <section className="wrap grid gap-10 pb-16 pt-12 sm:pt-16 lg:grid-cols-[1fr_1.4fr] lg:gap-20 lg:pb-24">
      <div>
        <p className="eyebrow">About</p>
        <TextReveal as="h1" text="Alan Luby photographs people at their best moments." className="mt-3 text-4xl sm:text-5xl" />
      </div>

      <Reveal delay={0.3} className="max-w-2xl space-y-5 text-lg lg:pt-10">
        <p>
          Alan is a freelance photographer based in Boynton Beach, Florida, with over 30 years of experience. Today his
          work centers on events, celebrations and portraits, alongside sports and live performance.
        </p>
        <p className="text-muted">
          He has photographed weddings, family milestones and portrait sessions, and covered events for organizations
          including Motorola, the American Society of Kidney Patients, Palm Beach State College, Big Brothers Big Sisters
          of Palm Beach County and BB King’s. His sports experience includes serving as team photographer for the Florida
          Bobcats of the Arena Football League and the Florida Beachdogs of the Continental Basketball Association.
        </p>
        <p className="text-muted">
          Earlier in his career he also photographed news and feature assignments for South Florida publications.
        </p>
        <p className="text-muted">
          Alan is a member of the Black Chamber of Commerce of Palm Beach County and a former member of ASMP, the American
          Society of Media Photographers.
        </p>
      </Reveal>
    </section>

    <section aria-labelledby="career" className="border-t border-line py-16 lg:py-24">
      <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center lg:gap-20">
        <div className="space-y-4">
          <p className="eyebrow">Career highlight</p>
          <TextReveal id="career" text="Ready for the moment that matters" className="text-3xl sm:text-4xl" />
          <Reveal>
            <p className="text-muted">
              Alan’s years covering news for South Florida publications included photographing President Barack Obama.
              That experience of working fast, in crowds and under pressure, is the same calm he brings to events today.
            </p>
          </Reveal>
        </div>
        <figure>
          <ImageReveal>
            <Photo photo={careerPhoto} sizes="(min-width: 1024px) 55vw, 100vw" />
          </ImageReveal>
          <figcaption className="mt-2 text-sm text-muted">{careerPhoto.title}. Photograph by Alan Luby.</figcaption>
        </figure>
      </div>
    </section>

    <section aria-labelledby="approach" className="border-t border-line py-16 lg:py-24">
      <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <TextReveal id="approach" text="How Alan works" className="text-3xl sm:text-4xl" />
        <dl className="grid max-w-2xl gap-8 sm:grid-cols-2">
          {[
            ['Prepared and on time', 'He plans around your schedule and arrives ready, so the day runs smoothly.'],
            ['People at ease', 'Relaxed direction helps portrait subjects and guests stop worrying about the camera.'],
            ['Watching for moments', 'The laugh, the embrace and the reaction often happen between the planned moments.'],
            ['Natural results', 'Careful editing keeps skin tones and colors true to the day.'],
          ].map(([term, text]) => (
            <div key={term}>
              <dt className="font-semibold">{term}</dt>
              <dd className="mt-1.5 text-muted">{text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>

    <section aria-labelledby="examples" className="border-t border-line py-16 lg:py-24">
      <div className="wrap">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <TextReveal id="examples" text="Examples of Alan’s work" className="text-3xl sm:text-4xl" />
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

    <InquiryBand title="Have an occasion in mind?" />
  </>
);
