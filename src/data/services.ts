import { ServiceItem } from '../types';
import { photographyCollection } from './photography';

const img = (id: string) => photographyCollection.find((p) => p.id === id)!;

export const servicesData: ServiceItem[] = [
  {
    id: 'service-events',
    title: 'Event Photography',
    categoryKey: 'events',
    inquiryValue: 'Event Photography',
    tagline: 'Galas, banquets, conventions, celebrations and milestone occasions.',
    description: 'Alan covers the full arc of an event — the program, the speakers and the room — while staying alert for the candid laughter, embraces and reactions your guests will remember. He works quietly, arrives prepared, and keeps pace with your schedule.',
    deliverables: [
      'Coverage of programs, speakers and award moments',
      'Candid guest interactions and atmosphere',
      'Group and VIP photos as requested',
      'An edited, color-corrected digital gallery',
    ],
    idealFor: ['Galas & Banquets', 'Conventions', 'Weddings', 'Birthdays & Milestones', 'Community Programs'],
    image: img('jws-24957'),
  },
  {
    id: 'service-portraits',
    title: 'Portrait Photography',
    categoryKey: 'portraits',
    inquiryValue: 'Portrait Photography',
    tagline: 'Individual, family, couple and business portraits, in studio or on location.',
    description: 'Alan puts people at ease so their real personality shows. Sessions can take place in a studio setting, at your home or business, or outdoors, with guidance on posing that feels natural rather than stiff.',
    deliverables: [
      'Studio or on-location sessions',
      'Individual, couple and family portraits',
      'Headshots and business portraits',
      'Edited, high-resolution digital images',
    ],
    idealFor: ['Families', 'Couples', 'Graduates & Seniors', 'Professionals', 'Children'],
    image: img('dsc-7539'),
  },
  {
    id: 'service-sports',
    title: 'Sports Photography',
    categoryKey: 'sports',
    inquiryValue: 'Sports Photography',
    tagline: 'Game action, sideline energy and team celebrations.',
    description: 'Years of shooting fast-moving football, basketball and other sports mean Alan anticipates the play. He photographs teams, leagues, tournaments and youth programs that want the action and the emotion around it.',
    deliverables: [
      'Game and tournament action coverage',
      'Team and individual athlete photos',
      'Sideline, bench and celebration moments',
      'Edited digital gallery for programs and social media',
    ],
    idealFor: ['Teams & Leagues', 'Tournaments', 'Youth Sports', 'Athletic Programs', 'Sports Events'],
    image: img('dsc-16185'),
  },
  {
    id: 'service-entertainment',
    title: 'Entertainment & Performance',
    categoryKey: 'entertainment',
    inquiryValue: 'Entertainment & Performance',
    tagline: 'Concerts, dance, stage productions and fashion shows.',
    description: 'Stage light and movement leave little room for error. Alan times his frames to the peak of a leap, a lyric or a turn, capturing performers and audiences without disrupting the show.',
    deliverables: [
      'Live performance coverage',
      'Performer and cast photos',
      'Audience and venue atmosphere',
      'Edited digital gallery for promotion',
    ],
    idealFor: ['Concerts', 'Dance Companies', 'Theatre & Stage', 'Fashion Shows', 'Festivals'],
    image: img('dsc-81284'),
  },
  {
    id: 'service-commercial',
    title: 'Commercial & Business',
    categoryKey: 'commercial',
    inquiryValue: 'Commercial & Business',
    tagline: 'Business portraits, storefronts and workplace imagery.',
    description: 'Real images of your people and your place for websites, brochures and marketing. Alan has photographed customers for catalogs and supplied images for organizational brochures, and brings the same care to small businesses and organizations today.',
    deliverables: [
      'Owner, staff and team portraits',
      'Storefront and on-property images',
      'Workplace and in-action photography',
      'Edited images ready for web and print',
    ],
    idealFor: ['Small Businesses', 'Professional Practices', 'Nonprofits', 'Brochures & Catalogs', 'Websites'],
    image: img('dsc-02093'),
  },
];

/** Contact-form choices. Service inquiry links pass `inquiryValue`, so these must stay in sync. */
export const inquiryOptions = [...servicesData.map((s) => s.inquiryValue), 'Other / Multiple Needs'];
