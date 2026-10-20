import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { coupleStory, heroPhoto, photoById, selectedWork } from '../data/photography';
import { inquiryHref } from '../data/services';
import { PhotoMarquee } from '../components/PhotoMarquee';
import { servicesData } from '../data/services';
import { attributionOf, homeTestimonials, testimonialById } from '../data/testimonials';
import { Photo } from '../components/Photo';
import { Gallery } from '../components/Gallery';
import { InquiryBand } from '../components/InquiryBand';
import { PageMeta } from '../components/PageMeta';
import { CountUp, ImageReveal, Magnetic, Reveal, TextReveal, Tilt, TextMarquee } from '../components/Motion';

const storyQuote = testimonialById('testimonial-4');

const MARQUEE: [ReturnType<typeof photoById>[], ReturnType<typeof photoById>[]] = [
  ['dsc-61146', '01600016', 'dsc-25324', 'dsc-7122', 'dsc-0833b', 'dsc-2023', 'dsc-303571', 'dsc-68234', 'dsc-7332', 'dsc-4970'].map(photoById),
  ['dsc-95856', 'dsc-5526', 'dsc-40902', 'jws-37126', 'dsc-3973', 'dsc-55581', 'dsc-79685', 'dsc-39269', 'jws-02313', 'jws-85879-8x10'].map(photoById),
];
import { introDelay } from '../components/Splash';

const EASE = [0.22, 1, 0.36, 1] as const;

const Hero: React.FC = () => {
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
        <motion.p className="eyebrow" {...fadeUp(0)}>Boynton Beach · South Florida</motion.p>
        <TextReveal as="h1" delay={d + 0.1} text="Event & portrait photography with personality." className="text-[2.5rem] sm:text-5xl xl:text-6xl" />
        <motion.p className="max-w-md text-lg text-muted" {...fadeUp(0.55)}>
          Celebrations, gatherings and portraits that feel like the people in them, plus sports and live performances, photographed by Alan Luby across South Florida.
        </motion.p>
        <motion.div className="flex flex-wrap gap-3 pt-2" {...fadeUp(0.7)}>
          <Magnetic><Link to="/work" className="btn-primary">View selected work</Link></Magnetic>
          <Magnetic><Link to="/contact" className="btn-secondary">Inquire</Link></Magnetic>
        </motion.div>
      </motion.div>
      <figure className="lg:order-2">
        <ImageReveal delay={d + 0.2}>
          <motion.div style={{ y: imageY }}>
            <Photo photo={heroPhoto} priority sizes="(min-width: 1280px) 760px, (min-width: 1024px) 58vw, 100vw" />
          </motion.div>
        </ImageReveal>
      </figure>
    </section>
  );
};

export const HomePage: React.FC = () => (
  <>
    <PageMeta description="Alan Luby photographs events, celebrations and portraits across South Florida, along with sports and live performances. Based in Boynton Beach, Florida." />

    <Hero />

    <TextMarquee
      text="Events · Portraits · Sports · Live performance ·"
      className="border-y border-line py-5 font-display text-4xl text-ink/85 sm:text-6xl lg:text-7xl"
    />
    <div className="h-16 lg:h-24" />

    {/* Selected work */}
    <section aria-labelledby="selected-work" className="wrap pb-20 lg:pb-28">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <TextReveal id="selected-work" text="Selected work" className="text-3xl sm:text-4xl" />
        <Link to="/work" className="text-link inline-flex items-center gap-1.5">
          See the full portfolio <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
      <Gallery photos={selectedWork} showCategory fill />
    </section>

    {/* Services */}
    <section aria-labelledby="services" className="border-y border-line bg-sand/50 py-20 lg:py-28">
      <div className="wrap">
        <div className="mb-12 max-w-2xl space-y-3">
          <TextReveal id="services" text="What Alan photographs" className="text-3xl sm:text-4xl" />
          <p className="text-muted">Four kinds of work, one approach: be prepared, stay attentive, and let people be themselves.</p>
        </div>
        <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {servicesData.map((s, i) => (
            <li key={s.id} className="flex flex-col">
              <Tilt>
              <Link to={`/services#${s.id}`} className="group block overflow-hidden" tabIndex={-1} aria-hidden>
                <ImageReveal delay={i * 0.12} className="aspect-[4/5]">
                  <Photo photo={s.image} cover sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 100vw" className="transition-transform duration-500 group-hover:scale-[1.03]" />
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

    {/* About Alan */}
    <section aria-labelledby="meet-alan" className="wrap grid gap-8 py-20 lg:grid-cols-[1fr_2fr] lg:gap-16 lg:py-28">
      <div>
        <p className="font-display text-[5.5rem] leading-none text-accent sm:text-[8rem]"><CountUp to={30} suffix="+" /></p>
        <TextReveal id="meet-alan" text="Over 30 years of photographing people" className="mt-4 text-3xl sm:text-4xl" />
      </div>
      <Reveal className="max-w-2xl space-y-5 text-lg">
        <p>
          Alan Luby has photographed banquets and conventions, weddings and birthdays, games and stage performances,
          and portrait sessions at home, outdoors and at work. That range shapes how he works.
        </p>
        <p className="text-muted">
          He arrives prepared, keeps to your schedule, and puts people at ease so expressions stay natural. At an event
          he watches for the laugh, the embrace and the reaction between the planned moments. At a game or a show,
          experience with fast action helps him anticipate the peak of a play, a leap or a lyric.
        </p>
        <Link to="/about" className="text-link inline-flex items-center gap-1.5 text-base">
          More about Alan <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </Reveal>
    </section>

    {/* Client story: one couple, two sessions */}
    <section aria-labelledby="story" className="border-t border-line py-20 lg:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-center lg:gap-20">
        <div className="space-y-6">
          <p className="eyebrow">A couple’s story</p>
          <TextReveal id="story" text="From “she said yes” to the walk down the aisle" className="text-3xl sm:text-4xl" />
          <Reveal className="space-y-4 text-muted">
            <p>
              Alan photographed this couple’s save-the-date session and then their wedding day. The first was relaxed
              and playful, with plenty of room to laugh at the camera. The second meant reading the room: the ceremony
              schedule, the light, and the glance between them as they made their entrance.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <figure className="border-l-2 border-accent/40 pl-5">
              <blockquote className="font-display text-lg leading-snug">“{storyQuote.quote}”</blockquote>
              <figcaption className="mt-2 text-sm text-muted">From another client · {attributionOf(storyQuote)}</figcaption>
            </figure>
          </Reveal>
          <Reveal delay={0.25}>
            <Link to={inquiryHref('Events & celebrations')} className="text-link inline-flex items-center gap-1.5">
              Inquire about wedding and celebration coverage <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 items-start gap-3 sm:gap-4">
          <figure className="mt-10 sm:mt-16">
            <ImageReveal>
              <Photo photo={coupleStory.engagement} sizes="(min-width: 1024px) 28vw, 50vw" />
            </ImageReveal>
            <figcaption className="mt-2 text-sm text-muted">The save-the-date session</figcaption>
          </figure>
          <figure>
            <ImageReveal delay={0.15}>
              <Photo photo={coupleStory.wedding} sizes="(min-width: 1024px) 28vw, 50vw" />
            </ImageReveal>
            <figcaption className="mt-2 text-sm text-muted">The wedding day</figcaption>
          </figure>
        </div>
      </div>
    </section>

    {/* Moments marquee: more of the portfolio in motion */}
    <section aria-labelledby="moments" className="border-t border-line py-20 lg:py-28">
      <div className="wrap mb-10 flex flex-wrap items-end justify-between gap-4">
        <TextReveal id="moments" text="More moments" className="text-3xl sm:text-4xl" />
        <Link to="/work" className="text-link inline-flex items-center gap-1.5">
          Browse every category <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
      <Reveal>
        <PhotoMarquee rows={MARQUEE} />
      </Reveal>
    </section>

    {/* Client proof */}
    <section aria-labelledby="clients" className="border-t border-line py-20 lg:py-28">
      <div className="wrap">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <TextReveal id="clients" text="From clients" className="text-3xl sm:text-4xl" />
          <Link to="/testimonials" className="text-link">Read more testimonials</Link>
        </div>
        <ul className="grid gap-12 md:grid-cols-3 md:gap-10">
          {homeTestimonials.map((t, i) => (
            <li key={t.id}>
              <Reveal delay={i * 0.15}>
              <figure className="space-y-4 border-l-2 border-accent/40 pl-5">
                <blockquote className="font-display text-xl leading-snug">“{t.excerpt}”</blockquote>
                <figcaption className="text-sm text-muted">{attributionOf(t)}</figcaption>
              </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>

    <InquiryBand
      title="Planning an event, a portrait session, a game or a performance?"
      text="Tell Alan what you have in mind: the occasion, the date if you have one, and where it takes place."
    />
  </>
);
