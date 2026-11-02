/** A service slug (events, weddings...). Services are managed in the admin, so the set is open. */
export type PhotoCategory = string;

export interface PhotoItem {
  id: string;
  title: string;
  category: PhotoCategory;
  /** Intrinsic size of the original, used for aspect ratio and reserved space */
  width: number;
  height: number;
  /** Largest web derivative */
  src: string;
  /** Width-described derivatives (actual pixel widths) */
  srcSet: string;
  /** Untouched original in /public/JPEG */
  originalSrc?: string;
  /** CSS object-position, used only where a layout crops the frame */
  focus: string;
  alt: string;
}

export interface ServiceItem {
  id: PhotoCategory;
  title: string;
  shortTitle: string;
  /** Label of this category on the Work page filters */
  categoryLabel: string;
  /** Must match a contact-form option */
  inquiryValue: string;
  summary: string;
  whoFor: string;
  photographs: string[];
  image: PhotoItem;
  supporting: PhotoItem[];
  testimonialId?: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  /** Verbatim shortening of `quote` for compact placements */
  excerpt?: string;
  clientRole: string;
  organization?: string;
  location?: string;
}
