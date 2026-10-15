import { PhotoItem, PhotoCategory } from '../types';

/**
 * Curated portfolio of Alan Luby's photographs.
 *
 * Originals live untouched in /public/JPEG. Web derivatives (800px and 1600px on the
 * long edge) live in /public/images/portfolio as `<slug>-800.jpg` / `<slug>-1600.jpg`,
 * where slug is the original filename lowercased with non-alphanumerics turned into "-".
 * `originalSrc` on each record is the source mapping back to the original file.
 *
 * Descriptions only state what is visible in the frame. Unknown names, venues and dates
 * are deliberately left out.
 */

const LABELS: Record<Exclude<PhotoCategory, 'all'>, string> = {
  events: 'Events',
  portraits: 'Portraits',
  sports: 'Sports',
  entertainment: 'Entertainment',
  commercial: 'Commercial',
};

const slugOf = (file: string) =>
  file.replace(/\.jpe?g$/i, '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

type PhotoInput = Pick<PhotoItem, 'title' | 'category' | 'aspectRatio' | 'focus' | 'altText' | 'description' | 'featuredOnHome'> & {
  file: string;
};

const photo = ({ file, ...rest }: PhotoInput): PhotoItem => {
  const slug = slugOf(file);
  const base = `/images/portfolio/${slug}`;
  return {
    id: slug,
    categoryLabel: LABELS[rest.category],
    imageSrc: `${base}-1600.jpg`,
    srcSet: `${base}-800.jpg 800w, ${base}-1600.jpg 1600w`,
    originalSrc: `/JPEG/${encodeURIComponent(file)}`,
    ...rest,
  };
};

export const photographyCollection: PhotoItem[] = [
  photo({
    file: 'JWS_24957.jpg', category: 'events', aspectRatio: 'landscape', focus: '50% 30%', featuredOnHome: true,
    title: 'Shared Laughter',
    altText: 'A man speaking into a microphone and a woman beside him both laughing',
    description: 'A speaker and a guest break into laughter mid-program.',
  }),
  photo({
    file: 'DSC_7539.jpg', category: 'portraits', aspectRatio: 'portrait', focus: '50% 30%', featuredOnHome: true,
    title: 'Crowned Together',
    altText: 'An older couple in red paper crowns laughing cheek to cheek against a red backdrop',
    description: 'A joyful couple portrait against a bold red backdrop.',
  }),
  photo({
    file: 'DSC_81284.jpg', category: 'entertainment', aspectRatio: 'landscape', focus: '28% 30%', featuredOnHome: true,
    title: 'Full Expression',
    altText: 'A dancer in a burgundy and gold costume performing with an intense, joyful expression',
    description: 'A dancer in burgundy and gold mid-routine, with the line of performers behind her.',
  }),
  photo({
    file: 'DSC_5575.jpg', category: 'events', aspectRatio: 'landscape', focus: '65% 40%', featuredOnHome: true,
    title: 'Front-Row Joy',
    altText: 'An older woman in a wide-brimmed hat with purple ribbon smiling broadly at a banquet table',
    description: 'A guest in a wide-brimmed hat lights up during a banquet program.',
  }),
  photo({
    file: 'DSC_16185.jpg', category: 'sports', aspectRatio: 'landscape', focus: '45% 25%', featuredOnHome: true,
    title: 'Contested Catch',
    altText: 'Three football players leaping together for the ball, gloved hands reaching overhead',
    description: 'Three players go up for the same ball at the peak of the play.',
  }),
  photo({
    file: 'DSC_46779.jpg', category: 'portraits', aspectRatio: 'landscape', focus: '72% 35%', featuredOnHome: true,
    title: 'At Ease',
    altText: 'A smiling young man in a white shirt and bow tie leaning on a ledge by a marina',
    description: 'A relaxed outdoor portrait by the water.',
  }),
  photo({
    file: 'JWS_47274.jpg', category: 'entertainment', aspectRatio: 'landscape', focus: '68% 8%',
    title: 'Golden Turn',
    altText: 'A dancer swirling a wide yellow and black skirt across a hall floor, other dancers behind her',
    description: 'A dancer sweeps a gold skirt across the floor during a cultural performance.',
  }),
  photo({
    file: 'DSC_303571.jpg', category: 'events', aspectRatio: 'landscape', focus: '50% 35%',
    title: 'The Moment Between',
    altText: 'A woman in a red dress laughing with her head thrown back beside a smiling man in a gray suit',
    description: 'A couple caught mid-laugh at an evening event.',
  }),
  photo({
    file: 'DSC_01779.jpg', category: 'portraits', aspectRatio: 'portrait', focus: '55% 30%',
    title: 'Professional Presence',
    altText: 'A smiling woman in a white coat, arms crossed, beside the signage of an eye center',
    description: 'An environmental business portrait made at the subject’s practice.',
  }),
  photo({
    file: 'DSC_9457.jpg', category: 'sports', aspectRatio: 'portrait', focus: '55% 40%',
    title: 'Clearing the Tackle',
    altText: 'A football player hurdling over a diving defender near the sideline',
    description: 'A receiver leaps a diving defender as another gives chase.',
  }),
  photo({
    file: 'DSC_11947.jpg', category: 'entertainment', aspectRatio: 'landscape', focus: '50% 35%',
    title: 'Lead Vocal',
    altText: 'A smiling singer in a black dress performing at a microphone with backing vocalists',
    description: 'A lead vocalist and backing singers on an outdoor stage.',
  }),
  photo({
    file: 'DSC_88579.jpg', category: 'events', aspectRatio: 'landscape', focus: '55% 35%',
    title: 'Walking In',
    altText: 'A bride holding a red and pink bouquet smiling at the groom as they enter',
    description: 'A bride and groom share a glance as they make their entrance.',
  }),
  photo({
    file: '01600016.jpg', category: 'portraits', aspectRatio: 'portrait', focus: '50% 25%',
    title: 'Open Air',
    altText: 'A woman with long hair laughing upward in a white dress against green foliage',
    description: 'An outdoor portrait full of natural light and laughter.',
  }),
  photo({
    file: 'DSC_02093.jpg', category: 'commercial', aspectRatio: 'landscape', focus: '50% 55%',
    title: 'Storefront',
    altText: 'A man in a black shirt standing confidently in front of a food storefront',
    description: 'A business portrait framed with the storefront it represents.',
  }),
  photo({
    file: 'DSC_61146.jpg', category: 'events', aspectRatio: 'landscape', focus: '50% 20%',
    title: 'Hands Up',
    altText: 'A man in a plaid jacket throwing both arms in the air while guests cheer at tables',
    description: 'A celebration reaches its high point on the dance floor.',
  }),
  photo({
    file: 'DSC_2023.jpg', category: 'sports', aspectRatio: 'landscape', focus: '50% 35%',
    title: 'Bench Erupts',
    altText: 'A basketball player with arms spread wide celebrating as teammates cheer behind her',
    description: 'A player and her bench celebrate on the court.',
  }),
  photo({
    file: 'DSC_11003.jpg', category: 'portraits', aspectRatio: 'landscape', focus: '60% 40%',
    title: 'Lifted',
    altText: 'A woman in a yellow dress lifting a laughing child into the air at the beach',
    description: 'A mother and daughter at play on the shoreline.',
  }),
  photo({
    file: 'DSC_7122.jpg', category: 'entertainment', aspectRatio: 'landscape', focus: '50% 30%',
    title: 'Over the Orchestra',
    altText: 'A dancer in a split leap above an outdoor orchestra while the audience watches',
    description: 'A dancer’s leap timed above a live orchestra performance.',
  }),
  photo({
    file: 'JWS_26102.jpg', category: 'events', aspectRatio: 'landscape', focus: '50% 35%',
    title: 'Warm Welcome',
    altText: 'Guests at a formal reception embracing and laughing in front of lavender drapes',
    description: 'Guests greet each other with hugs and laughter at a formal reception.',
  }),
  photo({
    file: 'DSC_1563.jpg', category: 'portraits', aspectRatio: 'landscape', focus: '50% 35%',
    title: 'Studio Headshot',
    altText: 'A bearded man in glasses and a dark blazer smiling against a black studio background',
    description: 'A clean studio headshot on a dark background.',
  }),
  photo({
    file: 'DSC_5064.jpg', category: 'sports', aspectRatio: 'landscape', focus: '40% 50%',
    title: 'Beach Polo',
    altText: 'Polo players on horseback driving toward the ball as sand sprays on the beach',
    description: 'Riders and horses battle for the ball on a sand field.',
  }),
  photo({
    file: 'DSC_3522.jpg', category: 'commercial', aspectRatio: 'landscape', focus: '50% 45%',
    title: 'On Property',
    altText: 'A smiling man in a pinstripe suit standing on a terrace above a pool lined with palm trees',
    description: 'A business portrait set against the property it represents.',
  }),
  photo({
    file: 'JWS_33598.jpg', category: 'events', aspectRatio: 'landscape', focus: '62% 30%',
    title: 'Sweet Sixteen',
    altText: 'A girl in a lavender gown and tiara dancing with a man in a cowboy hat beside a lit-up 16',
    description: 'A father-daughter dance at a sweet sixteen celebration.',
  }),
  photo({
    file: 'DSC_6696.jpg', category: 'entertainment', aspectRatio: 'landscape', focus: '35% 35%',
    title: 'Full Voice',
    altText: 'A singer in a gray suit performing with his mouth open in song behind a music stand',
    description: 'A vocalist mid-phrase on stage.',
  }),
  photo({
    file: 'DSC_40902.jpg', category: 'portraits', aspectRatio: 'landscape', focus: '50% 40%',
    title: 'Family Jump',
    altText: 'A family in yellow and denim jumping together on the beach',
    description: 'A playful family session on the beach.',
  }),
  photo({
    file: 'DSC_68467.jpg', category: 'sports', aspectRatio: 'landscape', focus: '45% 40%',
    title: 'Eye on the Ball',
    altText: 'A young baseball player in an orange jersey swinging as the ball meets the bat',
    description: 'A youth batter at the instant of contact.',
  }),
  photo({
    file: 'JWS_57653.jpg', category: 'events', aspectRatio: 'landscape', focus: '50% 35%',
    title: 'On the Dance Floor',
    altText: 'Women in bright dresses dancing and laughing together at a party',
    description: 'Guests let loose on the dance floor.',
  }),
  photo({
    file: 'DSC_3973.jpg', category: 'portraits', aspectRatio: 'landscape', focus: '35% 35%',
    title: 'Character',
    altText: 'A smiling man in a suit touching his brow against a light background',
    description: 'A personality-driven portrait with a light backdrop.',
  }),
  photo({
    file: 'JWS_37126.jpg', category: 'entertainment', aspectRatio: 'landscape', focus: '40% 30%',
    title: 'Sideline Lift',
    altText: 'A cheerleader lifted high by a teammate, shouting with pom-poms in the air',
    description: 'A cheer stunt at full height on the sideline.',
  }),
  photo({
    file: 'JWS_05897.jpg', category: 'commercial', aspectRatio: 'landscape', focus: '75% 40%',
    title: 'In the Classroom',
    altText: 'An instructor in an apron pointing across a beauty-school classroom full of students',
    description: 'An instructor leads a class — workplace imagery for a training program.',
  }),
  photo({
    file: 'JWS_02313.jpg', category: 'events', aspectRatio: 'landscape', focus: '50% 30%',
    title: 'Open Arms',
    altText: 'A woman in a pink hat and a man in a blue blazer greeting each other with outstretched arms at a podium',
    description: 'A warm greeting at the podium during a program.',
  }),
  photo({
    file: 'DSC_72273.jpg', category: 'sports', aspectRatio: 'landscape', focus: '45% 55%',
    title: 'Ball Loose',
    altText: 'A quarterback in red being pulled down by a defender as the football flies loose',
    description: 'A quarterback is brought down as the ball comes free.',
  }),
  photo({
    file: 'DSC_5442 .jpg', category: 'portraits', aspectRatio: 'portrait', focus: '50% 40%',
    title: 'First Steps',
    altText: 'A laughing baby girl in a pink tutu standing beside a tree on the grass',
    description: 'A child portrait outdoors, full of personality.',
  }),
  photo({
    file: 'DSC_7332.jpg', category: 'entertainment', aspectRatio: 'landscape', focus: '50% 40%',
    title: 'Runway',
    altText: 'A model walking a runway lined with seated audience members at a fashion show',
    description: 'A model on the runway at a fashion show.',
  }),
];

const byId = (id: string) => {
  const found = photographyCollection.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown photo id: ${id}`);
  return found;
};

/** Homepage hero and page heroes. All are photographs by Alan, none depict Alan. */
export const heroImages = {
  home: byId('jws-47274'),
  work: byId('dsc-16185'),
  services: byId('jws-24957'),
  testimonials: byId('dsc-5575'),
  about: byId('dsc-11947'),
};

/** Past news work, shown only on the About page as career background. */
export const careerImage: PhotoItem = photo({
  file: 'DJP_15474.jpg', category: 'events', aspectRatio: 'landscape', focus: '60% 45%',
  title: 'President Barack Obama',
  altText: 'President Barack Obama waving to a cheering crowd gathered behind him, a presidential podium at right',
  description: 'From Alan’s years covering news for South Florida publications.',
});

export const photoCategories: { key: PhotoCategory; label: string; countDescription: string }[] = [
  { key: 'all', label: 'ALL WORK', countDescription: 'Selected Work' },
  { key: 'events', label: 'EVENTS', countDescription: 'Galas, banquets, celebrations, weddings and programs' },
  { key: 'portraits', label: 'PORTRAITS', countDescription: 'Individual, family, business and studio portraits' },
  { key: 'sports', label: 'SPORTS', countDescription: 'Game action, celebrations and youth sports' },
  { key: 'entertainment', label: 'ENTERTAINMENT', countDescription: 'Live music, dance and performance' },
  { key: 'commercial', label: 'COMMERCIAL', countDescription: 'Business portraits and workplace imagery' },
];
