import { careerPhoto, coupleStory, marqueeIds, photographyCollection, selectedWork } from '../data/photography';
import { servicesData } from '../data/services';
import { curatedTestimonials, homeTestimonials, testimonialsData } from '../data/testimonials';
import { PhotoItem } from '../types';
import { HOME_SECTIONS, PAGES, PageKey, SETTINGS_DEFAULTS, SiteSettings, pageDefaults } from './content';

/** Content as the API returns it from GET /api/site. */
export interface RawPhoto {
  slug: string;
  title: string;
  alt: string;
  category: string;
  width: number;
  height: number;
  src: string;
  srcSet?: string;
  focus?: string;
  order: number;
  showInWork: boolean;
  featured: number;
  marquee: number;
}

export interface RawService {
  slug: string;
  title: string;
  shortTitle: string;
  categoryLabel: string;
  inquiryValue: string;
  summary: string;
  whoFor: string;
  photographs: string[];
  image: string;
  supporting: string[];
  testimonial: string | null;
  order: number;
}

export interface RawTestimonial {
  _id: string;
  quote: string;
  excerpt: string;
  clientRole: string;
  organization: string;
  location: string;
  showOnPage: boolean;
  order: number;
  featuredOnHome: number;
}

export interface RawPage {
  key: PageKey;
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
  content?: Record<string, string>;
  sections?: { key: string; visible: boolean }[];
}

export interface RawSite {
  settings: Partial<SiteSettings>;
  pages: Partial<Record<PageKey, RawPage>>;
  services: RawService[];
  photos: RawPhoto[];
  testimonials: RawTestimonial[];
}

const rank = (ids: string[], id: string) => ids.indexOf(id) + 1;

/**
 * The content built into the site, in API shape. Shown when no backend is configured or it cannot be reached,
 * and used by the backend seed script as the starting content.
 */
export function builtInSite(): RawSite {
  const featured = selectedWork.map((p) => p.id);
  const marquee = marqueeIds.flat();
  const rawPhoto = (p: PhotoItem, order: number, showInWork: boolean): RawPhoto => ({
    slug: p.id,
    title: p.title,
    alt: p.alt,
    category: p.category,
    width: p.width,
    height: p.height,
    src: p.src,
    srcSet: p.srcSet,
    focus: p.focus,
    order,
    showInWork,
    featured: showInWork ? rank(featured, p.id) : 0,
    marquee: showInWork ? rank(marquee, p.id) : 0,
  });
  const page = curatedTestimonials.map((t) => t.id);
  const home = homeTestimonials.map((t) => t.id);

  return {
    settings: SETTINGS_DEFAULTS,
    pages: Object.fromEntries(
      PAGES.map((p) => [
        p.key,
        {
          key: p.key,
          published: true,
          seoTitle: p.seoTitle,
          seoDescription: p.seoDescription,
          content: pageDefaults(p.key),
          ...(p.key === 'home' && { sections: HOME_SECTIONS.map((s) => ({ key: s.key, visible: true })) }),
        },
      ]),
    ),
    photos: [
      ...photographyCollection.map((p, i) => rawPhoto(p, i, true)),
      rawPhoto(careerPhoto, 1000, false),
      rawPhoto(coupleStory.engagement, 1001, false),
    ],
    services: servicesData.map((s, i) => ({
      slug: s.id,
      title: s.title,
      shortTitle: s.shortTitle,
      categoryLabel: s.categoryLabel,
      inquiryValue: s.inquiryValue,
      summary: s.summary,
      whoFor: s.whoFor,
      photographs: s.photographs,
      image: s.image.id,
      supporting: s.supporting.map((p) => p.id),
      testimonial: s.testimonialId ?? null,
      order: i,
    })),
    testimonials: testimonialsData.map((t, i) => ({
      _id: t.id,
      quote: t.quote,
      excerpt: t.excerpt ?? '',
      clientRole: t.clientRole,
      organization: t.organization ?? '',
      location: t.location ?? '',
      showOnPage: page.includes(t.id),
      order: page.includes(t.id) ? page.indexOf(t.id) : 100 + i,
      featuredOnHome: rank(home, t.id),
    })),
  };
}
