export type PhotoCategory = 'all' | 'events' | 'portraits' | 'sports' | 'entertainment' | 'commercial';

export interface PhotoItem {
  id: string;
  title: string;
  category: Exclude<PhotoCategory, 'all'>;
  categoryLabel: string;
  aspectRatio: 'landscape' | 'portrait';
  /** Web derivative (1600px) used for display */
  imageSrc: string;
  /** 800w + 1600w derivatives */
  srcSet: string;
  /** Untouched original in /public/JPEG */
  originalSrc: string;
  /** CSS object-position used when the card crops the frame */
  focus: string;
  altText: string;
  description: string;
  featuredOnHome?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  categoryKey: PhotoCategory;
  /** Must match a contact-form option value */
  inquiryValue: string;
  tagline: string;
  description: string;
  deliverables: string[];
  idealFor: string[];
  image: PhotoItem;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  clientRole: string;
  /** Organization or event name, when known */
  organization?: string;
  /** City/state, when that is all the source gives */
  location?: string;
  /** Editorial summary written by us, not part of the quote */
  highlight?: string;
  featured?: boolean;
}

export interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  photographyType: string;
  eventDate: string;
  location: string;
  estimatedBudget: string;
  message: string;
}
