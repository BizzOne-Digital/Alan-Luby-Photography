export type PhotoCategory = 'all' | 'events' | 'portraits' | 'journalism' | 'editorial' | 'commercial';

export interface PhotoItem {
  id: string;
  title: string;
  category: Exclude<PhotoCategory, 'all'>;
  categoryLabel: string;
  aspectRatio: 'landscape' | 'portrait' | 'square' | 'wide' | 'tall';
  imageSrc: string;
  altText: string;
  story: string;
  location?: string;
  assignmentType: string;
  featuredOnHome?: boolean;
  editorialNote?: string;
  isPlaceholder?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  categoryKey: PhotoCategory;
  tagline: string;
  description: string;
  deliverables: string[];
  idealFor: string[];
  imageSrc: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  clientRole: string;
  projectType: string;
  isPlaceholder?: boolean;
  highlight?: string;
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
