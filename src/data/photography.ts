import { PhotoItem, PhotoCategory } from '../types';

/**
 * Curated portfolio of Alan Luby's photographs.
 *
 * Originals live untouched in /public/JPEG. Web derivatives live in /public/images/work as
 * `<slug>-<width>.webp` at 640, 1024 and 1600px wide (only widths smaller than the original exist).
 * Slug = original filename lowercased with non-alphanumerics turned into "-".
 *
 * Titles and alt text only describe what is visible. Names, venues and dates are left out.
 * Array order is the sequence shown under "All" on the Work page.
 */

const WIDTHS = [640, 1024, 1600];

const slugOf = (file: string) =>
  file.replace(/\.jpe?g$/i, '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

type PhotoInput = Pick<PhotoItem, 'title' | 'category' | 'width' | 'height' | 'focus' | 'alt'> & { file: string };

const photo = ({ file, ...rest }: PhotoInput): PhotoItem => {
  const slug = slugOf(file);
  const widths = WIDTHS.filter((w) => w < rest.width);
  const url = (w: number) => `/images/work/${slug}-${w}.webp`;
  return {
    id: slug,
    src: url(widths[widths.length - 1]),
    srcSet: widths.map((w) => `${url(w)} ${w}w`).join(', '),
    originalSrc: `/JPEG/${encodeURIComponent(file)}`,
    ...rest,
  };
};

export const photographyCollection: PhotoItem[] = [
  photo({
    file: 'JWS_24957.jpg', category: 'events', width: 2300, height: 1530, focus: '50% 30%',
    title: 'Shared laughter during a program',
    alt: 'A man speaking into a microphone and a woman beside him both laughing',
  }),
  photo({
    file: 'DSC_46779.jpg', category: 'portraits', width: 2300, height: 1518, focus: '70% 35%',
    title: 'Outdoor portrait by the marina',
    alt: 'A smiling young man in a white shirt and bow tie leaning on a ledge by a marina',
  }),
  photo({
    file: 'DSC_16185.jpg', category: 'sports', width: 2300, height: 1840, focus: '50% 30%',
    title: 'Contested catch',
    alt: 'Three football players leaping together for the ball, gloved hands reaching overhead',
  }),
  photo({
    file: 'DSC_11768.jpg', category: 'performance', width: 2300, height: 1530, focus: '62% 25%',
    title: 'Singer reaching out to the audience',
    alt: 'A singer in a black jumpsuit holding a microphone and reaching toward the audience, two backing vocalists beside her',
  }),
  photo({
    file: 'DSC_11003.jpg', category: 'portraits', width: 2300, height: 1652, focus: '45% 35%',
    title: 'Family portrait on the beach',
    alt: 'A woman in a yellow dress lifting a laughing child into the air at the shoreline',
  }),
  photo({
    file: 'JWS_33598.jpg', category: 'events', width: 2300, height: 1530, focus: '62% 30%',
    title: 'Sweet sixteen dance',
    alt: 'A girl in a lavender gown and tiara dancing with a man in a cowboy hat beside a lit-up number 16',
  }),
  photo({
    file: 'DSC_01779.jpg', category: 'portraits', width: 1840, height: 2300, focus: '55% 30%',
    title: 'Professional portrait at the practice',
    alt: 'A smiling woman in a white coat with arms crossed, standing beside her practice signage',
  }),
  photo({
    file: 'DSC_9457.jpg', category: 'sports', width: 1770, height: 2300, focus: '55% 40%',
    title: 'Clearing the tackle',
    alt: 'A football player hurdling over a diving defender near the sideline',
  }),
  photo({
    file: 'DSC_81284.jpg', category: 'performance', width: 2300, height: 1530, focus: '28% 30%',
    title: 'Dancer mid-routine',
    alt: 'A dancer in a burgundy and gold costume performing with an intense, joyful expression',
  }),
  photo({
    file: 'JWS_26102.jpg', category: 'events', width: 2300, height: 1530, focus: '30% 35%',
    title: 'Warm welcome at a reception',
    alt: 'Guests at a formal reception embracing and laughing in front of lavender drapes',
  }),
  photo({
    file: 'DSC_7539.jpg', category: 'portraits', width: 1840, height: 2300, focus: '50% 30%',
    title: 'Couple portrait',
    alt: 'An older couple in red paper crowns laughing cheek to cheek against a red backdrop',
  }),
  photo({
    file: 'DSC_68467.jpg', category: 'sports', width: 2300, height: 1518, focus: '45% 40%',
    title: 'Youth baseball',
    alt: 'A young baseball player in an orange jersey at the instant the ball meets the bat',
  }),
  photo({
    file: 'JWS_47274.jpg', category: 'performance', width: 2300, height: 1530, focus: '55% 30%',
    title: 'Cultural dance performance',
    alt: 'A dancer in a yellow head wrap swirling a wide gold and black skirt across a hall floor',
  }),
  photo({
    file: 'DSC_88579.jpg', category: 'events', width: 2300, height: 1530, focus: '60% 35%',
    title: 'Wedding entrance',
    alt: 'A bride holding a red and pink bouquet smiling at the groom as they walk in together',
  }),
  photo({
    file: 'DSC_1563.jpg', category: 'portraits', width: 2300, height: 1530, focus: '50% 35%',
    title: 'Studio-style headshot',
    alt: 'A bearded man in glasses and a dark blazer smiling against a black background',
  }),
  photo({
    file: 'DSC_5064.jpg', category: 'sports', width: 2300, height: 1530, focus: '40% 50%',
    title: 'Beach polo',
    alt: 'Polo players on horseback driving toward the ball as sand sprays on the beach',
  }),
  photo({
    file: 'DSC_6696.jpg', category: 'performance', width: 2300, height: 1530, focus: '35% 35%',
    title: 'Vocalist on stage',
    alt: 'A singer in a gray suit singing with full voice behind a music stand',
  }),
  photo({
    file: 'DSC_5442 .jpg', category: 'portraits', width: 1518, height: 2300, focus: '50% 40%',
    title: 'Child portrait',
    alt: 'A laughing baby girl in a pink tutu standing beside a tree on the grass',
  }),
  photo({
    file: 'DSC_5575.jpg', category: 'events', width: 2300, height: 1530, focus: '55% 40%',
    title: 'Guest reaction at a banquet',
    alt: 'An older woman in a wide-brimmed hat with a purple ribbon smiling broadly at a banquet table',
  }),
  photo({
    file: 'DSC_02093.jpg', category: 'portraits', width: 2300, height: 1530, focus: '50% 55%',
    title: 'Business owner at the storefront',
    alt: 'A man in a black shirt standing with arms crossed in front of a food storefront',
  }),
  photo({
    file: 'JWS_57653.jpg', category: 'events', width: 2300, height: 1530, focus: '50% 35%',
    title: 'On the dance floor',
    alt: 'Women in bright dresses dancing and laughing together at a party',
  }),
  photo({
    file: 'DSC_3522.jpg', category: 'portraits', width: 2300, height: 1530, focus: '50% 40%',
    title: 'Environmental business portrait',
    alt: 'A smiling man in a pinstripe suit standing on a terrace above a pool lined with palm trees',
  }),
  photo({
    file: 'JWS_05897.jpg', category: 'events', width: 2300, height: 1530, focus: '75% 40%',
    title: 'Workplace instruction',
    alt: 'An instructor in an apron pointing across a classroom of students',
  }),
];

export const photoById = (id: string) => {
  const found = photographyCollection.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown photo id: ${id}`);
  return found;
};

export const heroPhoto = photoById('jws-24957');

export const selectedWork = ['dsc-46779', 'dsc-11003', 'dsc-16185', 'dsc-11768', 'jws-33598', 'dsc-01779'].map(photoById);

export const categoryLabels: Record<PhotoCategory, string> = {
  events: 'Events',
  portraits: 'Portraits',
  sports: 'Sports',
  performance: 'Live Performance',
};

/** Older links used other category keys; map them onto the current ones. */
export const parseCategory = (value: string | null): PhotoCategory | null => {
  if (!value) return null;
  const legacy: Record<string, PhotoCategory> = { entertainment: 'performance', commercial: 'portraits' };
  const key = legacy[value] ?? value;
  return key in categoryLabels ? (key as PhotoCategory) : null;
};
