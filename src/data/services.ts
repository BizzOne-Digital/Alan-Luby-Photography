import { PhotoCategory, ServiceItem } from '../types';
import { photoById } from './photography';

export const servicesData: ServiceItem[] = [
  {
    id: 'events',
    title: 'Events & celebrations',
    shortTitle: 'Events',
    inquiryValue: 'Events & celebrations',
    summary:
      'Coverage of the program and the people in the room: speeches, awards, dancing, and the candid laughter and embraces in between.',
    whoFor:
      'Families marking milestones, couples, community groups, and organizations hosting banquets, galas, conventions and programs.',
    photographs: [
      'Weddings, birthdays, sweet sixteens and anniversaries',
      'Galas, banquets, conventions and award programs',
      'Speakers, honorees and requested group photos',
      'Organizational coverage of workplaces and training sessions',
    ],
    image: photoById('jws-26102'),
    supporting: [photoById('dsc-88579'), photoById('jws-05897')],
    testimonialId: 'testimonial-2',
  },
  {
    id: 'portraits',
    title: 'Portraits',
    shortTitle: 'Portraits',
    inquiryValue: 'Portraits',
    summary:
      'Relaxed sessions that let personality come through, at home, outdoors or at your place of business.',
    whoFor:
      'Individuals, couples, families with children of any age, and professionals who need a headshot or a portrait at work.',
    photographs: [
      'Individual and couple portraits',
      'Family and children’s portraits',
      'Business headshots',
      'Environmental portraits at a practice, storefront or property',
    ],
    image: photoById('dsc-7539'),
    supporting: [photoById('dsc-1563'), photoById('dsc-02093')],
  },
  {
    id: 'sports',
    title: 'Sports',
    shortTitle: 'Sports',
    inquiryValue: 'Sports',
    summary:
      'Action photographed at the peak of the play, along with the reactions and celebrations around it.',
    whoFor: 'Teams, leagues, tournaments, youth programs and organizers of sporting events.',
    photographs: [
      'Game and tournament action',
      'Youth sports',
      'Team and individual athlete photos',
      'Sideline, bench and celebration moments',
    ],
    image: photoById('dsc-9457'),
    supporting: [photoById('dsc-68467'), photoById('dsc-5064')],
    testimonialId: 'testimonial-14',
  },
  {
    id: 'performance',
    title: 'Live performance',
    shortTitle: 'Live Performance',
    inquiryValue: 'Live performance',
    summary:
      'Concerts, dance and stage productions photographed with an eye for timing, so the peak of a leap or a lyric is in the frame.',
    whoFor: 'Performers, dance companies, cultural organizations, venues and event producers.',
    photographs: [
      'Concerts and live music',
      'Dance and cultural performances',
      'Stage productions and showcases',
      'Performer and audience moments',
    ],
    image: photoById('dsc-81284'),
    supporting: [photoById('jws-47274'), photoById('dsc-6696')],
  },
];

export const serviceById = (id: PhotoCategory) => servicesData.find((s) => s.id === id)!;

export const OTHER_INQUIRY = 'Something else';

/** Contact-form choices. Service links pass `inquiryValue`, so these stay in sync. */
export const inquiryOptions = [...servicesData.map((s) => s.inquiryValue), OTHER_INQUIRY];

/** Map current and retired `?service=` values onto a current form option. */
export const parseInquiry = (value: string | null): string => {
  if (!value) return '';
  if (inquiryOptions.includes(value)) return value;
  const legacy: Record<string, string> = {
    'Event Photography': 'Events & celebrations',
    'Portrait Photography': 'Portraits',
    'Sports Photography': 'Sports',
    'Entertainment & Performance': 'Live performance',
    'Commercial & Business': 'Portraits',
    'Other / Multiple Needs': OTHER_INQUIRY,
  };
  return legacy[value] ?? '';
};

export const inquiryHref = (inquiryValue?: string) =>
  inquiryValue ? `/contact?service=${encodeURIComponent(inquiryValue)}` : '/contact';
