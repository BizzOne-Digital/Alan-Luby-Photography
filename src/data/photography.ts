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
  photo({
    file: 'DSC_61146.jpg', category: 'events', width: 2300, height: 1528, focus: '50% 25%',
    title: 'Hands up on the dance floor',
    alt: 'A man in a plaid jacket throwing both arms in the air while guests cheer around him',
  }),
  photo({
    file: '01600016.jpg', category: 'portraits', width: 1840, height: 2300, focus: '50% 25%',
    title: 'Outdoor portrait in natural light',
    alt: 'A woman with long hair laughing upward in a white dress against green foliage',
  }),
  photo({
    file: 'DSC_25324.jpg', category: 'sports', width: 2300, height: 1530, focus: '60% 35%',
    title: 'Boxing victory',
    alt: 'A boxer in red raising a gloved fist in the ring',
  }),
  photo({
    file: 'DSC_7122.jpg', category: 'performance', width: 2300, height: 1518, focus: '50% 25%',
    title: 'Leap over the orchestra',
    alt: 'A dancer in a split leap above an outdoor orchestra while the audience watches',
  }),
  photo({
    file: 'DSC_0833B.jpg', category: 'portraits', width: 2300, height: 1518, focus: '50% 35%',
    title: 'Family studio portrait',
    alt: 'A smiling family of five posed together against a gray backdrop',
  }),
  photo({
    file: 'DSC_2023.jpg', category: 'sports', width: 2300, height: 1530, focus: '50% 35%',
    title: 'Bench erupts',
    alt: 'A basketball player spreading her arms wide in celebration as teammates cheer behind her',
  }),
  photo({
    file: 'DSC_303571.jpg', category: 'events', width: 2300, height: 1764, focus: '45% 35%',
    title: 'Laughter at an evening event',
    alt: 'A woman in a red dress laughing with her head thrown back beside a smiling man in a gray suit',
  }),
  photo({
    file: 'DSC_68234.jpg', category: 'sports', width: 1518, height: 2300, focus: '50% 30%',
    title: 'Youth baseball joy',
    alt: 'A young baseball player in a helmet grinning as he runs',
  }),
  photo({
    file: 'DSC_7332.jpg', category: 'performance', width: 2300, height: 1530, focus: '50% 40%',
    title: 'Fashion show runway',
    alt: 'A model walking a runway lined with a seated audience at a fashion show',
  }),
  photo({
    file: 'DSC_4970.jpg', category: 'portraits', width: 1530, height: 2300, focus: '50% 35%',
    title: 'Couple portrait in the garden',
    alt: 'A smiling couple embracing among green trees',
  }),
  photo({
    file: 'DSC_95856.jpg', category: 'sports', width: 2300, height: 1530, focus: '40% 45%',
    title: 'Youth tennis',
    alt: 'A boy in a blue shirt running across a tennis court with his racket, grinning',
  }),
  photo({
    file: 'DSC_5526.jpg', category: 'events', width: 2300, height: 1518, focus: '55% 35%',
    title: 'Celebration couple',
    alt: 'A woman in a black dress and a man in a plaid jacket laughing together at a party',
  }),
  photo({
    file: 'DSC_40902.jpg', category: 'portraits', width: 2300, height: 1529, focus: '50% 40%',
    title: 'Family jump on the beach',
    alt: 'A family in yellow and denim jumping together on the beach',
  }),
  photo({
    file: 'JWS_37126.jpg', category: 'performance', width: 2300, height: 1530, focus: '40% 30%',
    title: 'Cheer stunt',
    alt: 'A cheerleader lifted high by a teammate, shouting with pom-poms in the air',
  }),
  photo({
    file: 'DSC_3973.jpg', category: 'portraits', width: 2300, height: 1530, focus: '35% 35%',
    title: 'Personality portrait',
    alt: 'A smiling man in a suit touching his brow against a light background',
  }),
  photo({
    file: 'DSC_55581.jpg', category: 'sports', width: 2111, height: 2300, focus: '50% 35%',
    title: 'Teammates celebrate',
    alt: 'Two young players hugging and cheering on the field',
  }),
  photo({
    file: 'DSC_79685.jpg', category: 'events', width: 2300, height: 1530, focus: '50% 35%',
    title: 'Party fun',
    alt: 'Two children laughing and playing in a colorful bounce house',
  }),
  photo({
    file: 'DSC_39269.jpg', category: 'portraits', width: 2300, height: 1530, focus: '50% 35%',
    title: 'Family portrait by the water',
    alt: 'A smiling family of four posed close together by the waterfront',
  }),
  photo({
    file: 'JWS_02313.jpg', category: 'events', width: 2300, height: 1530, focus: '50% 30%',
    title: 'Open-arms greeting',
    alt: 'A woman in a pink hat and a man in a blue blazer greeting each other with outstretched arms at a podium',
  }),
  photo({
    file: 'JWS_85879 8x10.jpg', category: 'portraits', width: 1840, height: 2300, focus: '50% 30%',
    title: 'Prom portrait',
    alt: 'A young couple dressed for prom posing outdoors, she in a purple gown with a corsage',
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

/** From Alan's earlier news work. Shown only on About as a career highlight, never in Work or services. */
export const careerPhoto: PhotoItem = photo({
  file: 'DJP_15474.jpg', category: 'events', width: 2300, height: 1530, focus: '60% 45%',
  title: 'President Barack Obama with supporters',
  alt: 'President Barack Obama waving to a cheering crowd gathered behind him, a presidential podium at right',
});
