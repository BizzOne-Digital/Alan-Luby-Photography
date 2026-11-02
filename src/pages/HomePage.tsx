import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { inquiryHref } from '../data/services';
import { PhotoMarquee } from '../components/PhotoMarquee';
import { attributionOf } from '../data/testimonials';
import { Photo } from '../components/Photo';
import { Gallery } from '../components/Gallery';
import { InquiryBand } from '../components/InquiryBand';
import { PageMeta } from '../components/PageMeta';
import { CountUp, ImageReveal, Magnetic, Reveal, TextReveal, Tilt, TextMarquee } from '../components/Motion';
import { introDelay } from '../components/Splash';
import { HomeSectionKey } from '../site/content';
import { useSite } from '../site/SiteProvider';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Editable button links: site paths use the router, full URLs open normally, anything else falls back to home. */
const CtaLink: React.FC<{ to: string; className: string; children: React.ReactNode }> = ({ to, className, children }) =>
  /^https?:\/\//.test(to) ? (
    <a href={to} className={className}>{children}</a>
  ) : (
    <Link to={to.startsWith('/') ? to : '/'} className={className}>{children}</Link>
  );

const Hero: React.FC<{ c: Record<string, string> }> = ({ c }) => {
  const { photo } = useSite();
  const [d] = useState(introDelay);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay: d + delay, ease: EASE },
  });

  return (
    <section ref={ref} className="wrap grid items-center gap-8 pb-16 pt-8 sm:pt-12 lg:grid-cols-[2fr_3fr] lg:gap-14 lg:pb-24 lg:pt-16">
      <motion.div style={{ y: copyY }} className="space-y-6 lg:order-1">
        <motion.p className="eyebrow" {...fadeUp(0)}>{c.heroEyebrow}</motion.p>
        <TextReveal as="h1" delay={d + 0.1} text={c.heroHeading} className="text-[2.5rem] sm:text-5xl xl:text-6xl" />
        <motion.p className="max-w-md text-lg text-muted" {...fadeUp(0.55)}>
          {c.heroText}
        </motion.p>
        <motion.div className="flex flex-wrap gap-3 pt-2" {...fadeUp(0.7)}>
          {c.heroPrimaryLabel && <Magnetic><CtaLink to={c.heroPrimaryLink} className="btn-primary">{c.heroPrimaryLabel}</CtaLink></Magnetic>}
          {c.heroSecondaryLabel && <Magnetic><CtaLink to={c.heroSecondaryLink} className="btn-secondary">{c.heroSecondaryLabel}</CtaLink></Magnetic>}
        </motion.div>
      </motion.div>
      <figure className="lg:order-2">
        <ImageReveal delay={d + 0.2}>
          <motion.div style={{ y: imageY }}>
            <Photo photo={photo(c.heroPhoto)} priority sizes="(min-width: 1280px) 760px, (min-width: 1024px) 58vw, 100vw" />
          </motion.div>
        </ImageReveal>
      </figure>
    </section>
  );
};

export const HomePage: React.FC = () => {
  const site = useSite();
  const { content: c, seoDescription, sections, seoTitle } = site.page('home');
  const storyQuote = site.testimonial(c.storyTestimonial);

  const blocks: Record<HomeSectionKey, React.ReactNode> = {
    selectedWork: (
    <section key="selectedWork" aria-labelledby="selected-work" className="wrap pb-20 lg:pb-28">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <TextReveal id="selected-work" text={c.selectedWorkHeading} className="text-3xl sm:text-4xl" />
        <Link to="/work" className="text-link inline-flex items-center gap-1.5">
          See the full portfolio <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
      <Gallery photos={site.selectedWork} showCategory fill />
    </section>
    ),

    services: (
    <section key="services" aria-labelledby="services" className="border-y border-line bg-sand/50 py-20 lg:py-28">
      <div className="wrap">
        <div className="mb-12 max-w-2xl space-y-3">
          <TextReveal id="services" text={c.servicesHeading} className="text-3xl sm:text-4xl" />
          <p className="text-muted">{c.servicesText}</p>
        </div>
        <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {site.services.map((s, i) => (
            <li key={s.id} className="flex flex-col">
              <Tilt>
              <Link to={`/services#${s.id}`} className="group block overflow-hidden" tabIndex={-1} aria-hidden>
                <ImageReveal delay={i * 0.12} className="aspect-[4/5]">
                  <Photo photo={s.image} cover sizes="(min-width: 1280px) 19vw, (min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw" className="transition-transform duration-500 group-hover:scale-[1.03]" />
                </ImageReveal>
              </Link>
              </Tilt>
              <h3 className="mt-5 text-xl">{s.title}</h3>
              <p className="mt-2 flex-1 text-[0.95rem] text-muted">{s.summary}</p>
              <div className="mt-4 flex flex-col gap-1.5 text-[0.95rem]">
                <Link to={`/services#${s.id}`} className="text-link">About {s.title.toLowerCase()} coverage</Link>
                <Link to={`/work?category=${s.id}`} className="text-muted underline decoration-line underline-offset-4 hover:text-ink">
                  See {s.shortTitle.toLowerCase()} work
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
    ),

    about: (
    <section key="about" aria-labelledby="meet-alan" className="wrap grid gap-8 py-20 lg:grid-cols-[1fr_2fr] lg:gap-16 lg:py-28">
      <div>
        {c.aboutStatNumber && (
          <p className="font-display text-[5.5rem] leading-none text-accent sm:text-[8rem]">
            {Number.isFinite(Number(c.aboutStatNumber)) ? <CountUp to={Number(c.aboutStatNumber)} suffix={c.aboutStatSuffix} /> : `${c.aboutStatNumber}${c.aboutStatSuffix}`}
          </p>
        )}
        <TextReveal id="meet-alan" text={c.aboutHeading} className="mt-4 text-3xl sm:text-4xl" />
      </div>
      <Reveal className="max-w-2xl space-y-5 text-lg">
        <p>{c.aboutText1}</p>
        <p className="text-muted">{c.aboutText2}</p>
        <Link to="/about" className="text-link inline-flex items-center gap-1.5 text-base">
          More about Alan <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </Reveal>
    </section>
    ),

    story: (
    <section key="story" aria-labelledby="story" className="border-t border-line py-20 lg:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-center lg:gap-20">
        <div className="space-y-6">
          <p className="eyebrow">{c.storyEyebrow}</p>
          <TextReveal id="story" text={c.storyHeading} className="text-3xl sm:text-4xl" />
          <Reveal className="space-y-4 text-muted">
            <p>{c.storyText}</p>
          </Reveal>
          {storyQuote && (
          <Reveal delay={0.15}>
            <figure className="border-l-2 border-accent/40 pl-5">
              <blockquote className="font-display text-lg leading-snug">“{storyQuote.quote}”</blockquote>
              <figcaption className="mt-2 text-sm text-muted">From another client · {attributionOf(storyQuote)}</figcaption>
            </figure>
          </Reveal>
          )}
          <Reveal delay={0.25} className="flex flex-col items-start gap-3">
            <Link to={inquiryHref('Weddings & engagements')} className="text-link inline-flex items-center gap-1.5">
              Inquire about wedding and engagement coverage <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to="/work?category=weddings" className="text-link inline-flex items-center gap-1.5">
              See more wedding and engagement photos <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 items-start gap-3 sm:gap-4">
          <figure className="mt-10 sm:mt-16">
            <ImageReveal>
              <Photo photo={site.photo(c.storyPhoto1)} sizes="(min-width: 1024px) 28vw, 50vw" />
            </ImageReveal>
            <figcaption className="mt-2 text-sm text-muted">{c.storyCaption1}</figcaption>
          </figure>
          <figure>
            <ImageReveal delay={0.15}>
              <Photo photo={site.photo(c.storyPhoto2)} sizes="(min-width: 1024px) 28vw, 50vw" />
            </ImageReveal>
            <figcaption className="mt-2 text-sm text-muted">{c.storyCaption2}</figcaption>
          </figure>
        </div>
      </div>
    </section>
    ),

    moments: site.marqueeRows[0].length > 0 && (
    <section key="moments" aria-labelledby="moments" className="border-t border-line py-20 lg:py-28">
      <div className="wrap mb-10 flex flex-wrap items-end justify-between gap-4">
        <TextReveal id="moments" text={c.momentsHeading} className="text-3xl sm:text-4xl" />
        <Link to="/work" className="text-link inline-flex items-center gap-1.5">
          Browse every category <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
      <Reveal>
        <PhotoMarquee rows={site.marqueeRows} />
      </Reveal>
    </section>
    ),

    clients: site.homeTestimonials.length > 0 && (
    <section key="clients" aria-labelledby="clients" className="border-t border-line py-20 lg:py-28">
      <div className="wrap">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <TextReveal id="clients" text={c.clientsHeading} className="text-3xl sm:text-4xl" />
          {site.page('testimonials').published && <Link to="/testimonials" className="text-link">Read more testimonials</Link>}
        </div>
        <ul className="grid gap-12 md:grid-cols-3 md:gap-10">
          {site.homeTestimonials.map((t, i) => (
            <li key={t.id}>
              <Reveal delay={i * 0.15}>
              <figure className="space-y-4 border-l-2 border-accent/40 pl-5">
                <blockquote className="font-display text-xl leading-snug">“{t.excerpt || t.quote}”</blockquote>
                <figcaption className="text-sm text-muted">{attributionOf(t)}</figcaption>
              </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
    ),
  };

  return (
  <>
    <PageMeta title={seoTitle || undefined} description={seoDescription} />

    <Hero c={c} />

    {c.marqueeText && (
    <TextMarquee
      text={c.marqueeText}
      className="border-y border-line py-5 font-display text-4xl text-ink/85 sm:text-6xl lg:text-7xl"
    />
    )}
    <div className="h-16 lg:h-24" />

    {sections.filter((s) => s.visible).map((s) => blocks[s.key])}

    <InquiryBand title={c.closingTitle} text={c.closingText} />
  </>
  );
};
