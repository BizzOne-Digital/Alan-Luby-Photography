import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PLACEHOLDER_IMAGE, api, apiEnabled, mediaUrl } from '../lib/api';
import { PhotoItem, ServiceItem, TestimonialItem } from '../types';
import { HOME_SECTIONS, HomeSectionKey, PageKey, SETTINGS_DEFAULTS, SiteSettings, pageDef, pageDefaults } from './content';
import { RawPhoto, RawSite, builtInSite } from './fallback';

export interface PageData {
  published: boolean;
  seoTitle: string;
  seoDescription: string;
  content: Record<string, string>;
  sections: { key: HomeSectionKey; visible: boolean }[];
}

export interface SiteData {
  settings: SiteSettings;
  page: (key: PageKey) => PageData;
  photo: (slug: string) => PhotoItem;
  /** Photos from a comma-separated slug list; unknown slugs are skipped */
  photoList: (slugs: string) => PhotoItem[];
  workPhotos: PhotoItem[];
  selectedWork: PhotoItem[];
  marqueeRows: [PhotoItem[], PhotoItem[]];
  services: ServiceItem[];
  service: (id: string) => ServiceItem | undefined;
  categoryLabels: Record<string, string>;
  inquiryOptions: string[];
  testimonial: (id: string) => TestimonialItem | undefined;
  pageTestimonials: TestimonialItem[];
  homeTestimonials: TestimonialItem[];
}

export const OTHER_INQUIRY = 'Something else';

const MISSING_PHOTO: PhotoItem = {
  id: '',
  title: '',
  category: '',
  width: 4,
  height: 3,
  src: PLACEHOLDER_IMAGE,
  srcSet: '',
  focus: '50% 50%',
  alt: '',
};

const toPhoto = (p: RawPhoto): PhotoItem => ({
  id: p.slug,
  title: p.title,
  category: p.category,
  width: p.width,
  height: p.height,
  alt: p.alt,
  focus: p.focus || '50% 50%',
  src: mediaUrl(p.src),
  srcSet: (p.srcSet || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [url, width] = part.split(/\s+/);
      return `${mediaUrl(url)} ${width}`;
    })
    .join(', '),
});

const byPosition = <T,>(items: T[], pos: (t: T) => number) => items.filter((t) => pos(t) > 0).sort((a, b) => pos(a) - pos(b));

export function normalize(raw: RawSite): SiteData {
  const photos = [...raw.photos].sort((a, b) => a.order - b.order);
  const photoMap = new Map(photos.map((p) => [p.slug, toPhoto(p)]));
  const photo = (slug: string) => photoMap.get(slug) ?? MISSING_PHOTO;
  const photoList = (slugs: string) =>
    slugs.split(',').map((s) => photoMap.get(s.trim())).filter((p): p is PhotoItem => Boolean(p));

  const testimonials: (TestimonialItem & { showOnPage: boolean; order: number; featuredOnHome: number })[] = raw.testimonials.map((t) => ({
    id: t._id,
    quote: t.quote,
    excerpt: t.excerpt || undefined,
    clientRole: t.clientRole,
    organization: t.organization || undefined,
    location: t.location || undefined,
    showOnPage: t.showOnPage,
    order: t.order,
    featuredOnHome: t.featuredOnHome,
  }));
  const testimonialMap = new Map(testimonials.map((t) => [t.id, t]));

  const services: ServiceItem[] = [...raw.services]
    .sort((a, b) => a.order - b.order)
    .map((s) => ({
      id: s.slug,
      title: s.title,
      shortTitle: s.shortTitle,
      categoryLabel: s.categoryLabel,
      inquiryValue: s.inquiryValue,
      summary: s.summary,
      whoFor: s.whoFor,
      photographs: s.photographs,
      image: photo(s.image),
      supporting: s.supporting.map((slug) => photoMap.get(slug)).filter((p): p is PhotoItem => Boolean(p)),
      testimonialId: s.testimonial && testimonialMap.has(s.testimonial) ? s.testimonial : undefined,
    }));
  const serviceIds = new Set(services.map((s) => s.id));

  const pages = new Map<PageKey, PageData>();
  const page = (key: PageKey): PageData => {
    if (!pages.has(key)) {
      const p = raw.pages[key];
      const def = pageDef(key);
      const stored = (p?.sections ?? []).filter((s) => HOME_SECTIONS.some((h) => h.key === s.key)) as PageData['sections'];
      pages.set(key, {
        published: key === 'home' || p?.published !== false,
        seoTitle: p?.seoTitle ?? def.seoTitle,
        seoDescription: p?.seoDescription || def.seoDescription,
        content: { ...pageDefaults(key), ...(p?.content ?? {}) },
        // Sections added to the site later than the stored order still appear, at the end.
        sections: [...stored, ...HOME_SECTIONS.filter((h) => !stored.some((s) => s.key === h.key)).map((h) => ({ key: h.key, visible: true }))],
      });
    }
    return pages.get(key)!;
  };

  // Only photos whose category is a visible service appear in the gallery.
  const inWork = photos.filter((p) => p.showInWork && serviceIds.has(p.category));
  const marquee = byPosition(inWork, (p) => p.marquee).map((p) => photoMap.get(p.slug)!);
  const half = Math.ceil(marquee.length / 2);

  return {
    settings: { ...SETTINGS_DEFAULTS, ...raw.settings },
    page,
    photo,
    photoList,
    workPhotos: inWork.map((p) => photoMap.get(p.slug)!),
    selectedWork: byPosition(inWork, (p) => p.featured).map((p) => photoMap.get(p.slug)!),
    marqueeRows: [marquee.slice(0, half), marquee.slice(half)],
    services,
    service: (id) => services.find((s) => s.id === id),
    categoryLabels: Object.fromEntries(services.map((s) => [s.id, s.categoryLabel])),
    inquiryOptions: [...services.map((s) => s.inquiryValue), OTHER_INQUIRY],
    testimonial: (id) => testimonialMap.get(id),
    pageTestimonials: testimonials.filter((t) => t.showOnPage).sort((a, b) => a.order - b.order),
    homeTestimonials: byPosition(testimonials, (t) => t.featuredOnHome),
  };
}

const CACHE_KEY = 'site-content-v1';
/** On a first visit with a slow backend, show the built-in content instead of waiting longer than this. */
const FIRST_LOAD_TIMEOUT_MS = 4000;

const readCache = (): RawSite | null => {
  try {
    const value = localStorage.getItem(CACHE_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const SiteContext = createContext<SiteData | null>(null);

/**
 * Loads the managed content once per visit. Repeat visits render the last copy immediately and refresh in the
 * background; if the backend is down or not configured, the site runs on its built-in content.
 */
export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [raw, setRaw] = useState<RawSite | null>(() => (apiEnabled ? readCache() : builtInSite()));

  useEffect(() => {
    if (!apiEnabled) return;
    const controller = new AbortController();
    const timer = setTimeout(() => setRaw((r) => r ?? builtInSite()), FIRST_LOAD_TIMEOUT_MS);
    api<{ data: RawSite }>('/site', { signal: controller.signal })
      .then(({ data }) => {
        setRaw(data);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch {
          /* storage full or blocked: the next visit simply fetches again */
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setRaw((r) => r ?? builtInSite());
      })
      .finally(() => clearTimeout(timer));
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, []);

  const data = useMemo(() => {
    if (!raw) return null;
    try {
      return normalize(raw);
    } catch {
      // A malformed response or stale cache must never take the site down.
      return normalize(builtInSite());
    }
  }, [raw]);

  if (!data) return <div className="min-h-screen bg-paper" aria-busy="true" />;
  return <SiteContext.Provider value={data}>{children}</SiteContext.Provider>;
};

export const useSite = () => {
  const site = useContext(SiteContext);
  if (!site) throw new Error('useSite must be used inside <SiteProvider>');
  return site;
};

export const usePage = (key: PageKey) => useSite().page(key);
