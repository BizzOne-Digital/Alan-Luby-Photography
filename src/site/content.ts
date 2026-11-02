/**
 * Editable page content: one definition per field, with the text the site shipped with as its default.
 * The admin page editor is built from these definitions, the public pages read the values, and the backend
 * seed script starts from the defaults. Page layouts themselves stay in the page components.
 */

export type PageKey = 'home' | 'about' | 'services' | 'work' | 'testimonials' | 'contact';

export type FieldType =
  | 'text'
  | 'textarea'
  /** Site path (/work) or https URL */
  | 'link'
  /** One photo from the library, stored as its slug */
  | 'photo'
  /** Several photos, stored as comma-separated slugs */
  | 'photos'
  /** One testimonial, stored as its id */
  | 'testimonial'
  /** Uploaded image (or existing site image path), stored as its URL */
  | 'image';

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  default: string;
  help?: string;
  group?: string;
}

export const HOME_SECTIONS = [
  { key: 'selectedWork', label: 'Selected work' },
  { key: 'services', label: 'Services' },
  { key: 'about', label: 'About Alan' },
  { key: 'story', label: 'A couple’s story' },
  { key: 'moments', label: 'More moments (photo strip)' },
  { key: 'clients', label: 'From clients' },
] as const;

export type HomeSectionKey = (typeof HOME_SECTIONS)[number]['key'];

export interface PageDef {
  key: PageKey;
  label: string;
  path: string;
  /** Can be taken offline from the admin (the homepage cannot) */
  canUnpublish: boolean;
  seoTitle: string;
  seoDescription: string;
  fields: FieldDef[];
}

const f = (group: string, name: string, label: string, type: FieldType, value: string, help?: string): FieldDef => ({
  group,
  name,
  label,
  type,
  default: value,
  help,
});

export const PAGES: PageDef[] = [
  {
    key: 'home',
    label: 'Homepage',
    path: '/',
    canUnpublish: false,
    seoTitle: '',
    seoDescription:
      'Alan Luby photographs events, weddings, engagements and portraits across South Florida, along with sports and live performances. Based in Boynton Beach, Florida.',
    fields: [
      f('Hero', 'heroEyebrow', 'Eyebrow', 'text', 'Boynton Beach · South Florida'),
      f('Hero', 'heroHeading', 'Heading', 'text', 'Event & portrait photography with personality.'),
      f('Hero', 'heroText', 'Description', 'textarea', 'Celebrations, weddings and portraits that feel like the people in them, plus sports and live performances, photographed by Alan Luby across South Florida.'),
      f('Hero', 'heroPhoto', 'Hero photo', 'photo', 'jws-24957'),
      f('Hero', 'heroPrimaryLabel', 'Main button text', 'text', 'View selected work'),
      f('Hero', 'heroPrimaryLink', 'Main button link', 'link', '/work'),
      f('Hero', 'heroSecondaryLabel', 'Second button text', 'text', 'Inquire'),
      f('Hero', 'heroSecondaryLink', 'Second button link', 'link', '/contact'),
      f('Hero', 'marqueeText', 'Scrolling text band', 'text', 'Events · Weddings & engagements · Portraits · Sports · Live performance ·'),
      f('Selected work', 'selectedWorkHeading', 'Heading', 'text', 'Selected work', 'Choose which photos appear here under Photos → “Homepage selected work”.'),
      f('Services', 'servicesHeading', 'Heading', 'text', 'What Alan photographs'),
      f('Services', 'servicesText', 'Introduction', 'textarea', 'Five kinds of work, one approach: be prepared, stay attentive, and let people be themselves.'),
      f('About Alan', 'aboutStatNumber', 'Big number', 'text', '30'),
      f('About Alan', 'aboutStatSuffix', 'Number suffix', 'text', '+'),
      f('About Alan', 'aboutHeading', 'Heading', 'text', 'Over 30 years of photographing people'),
      f('About Alan', 'aboutText1', 'First paragraph', 'textarea', 'Alan Luby has photographed banquets and conventions, weddings and birthdays, games and stage performances, and portrait sessions at home, outdoors and at work. That range shapes how he works.'),
      f('About Alan', 'aboutText2', 'Second paragraph', 'textarea', 'He arrives prepared, keeps to your schedule, and puts people at ease so expressions stay natural. At an event he watches for the laugh, the embrace and the reaction between the planned moments. At a game or a show, experience with fast action helps him anticipate the peak of a play, a leap or a lyric.'),
      f('A couple’s story', 'storyEyebrow', 'Eyebrow', 'text', 'A couple’s story'),
      f('A couple’s story', 'storyHeading', 'Heading', 'text', 'From “she said yes” to the walk down the aisle'),
      f('A couple’s story', 'storyText', 'Story', 'textarea', 'Alan photographed this couple’s save-the-date session and then their wedding day. The first was relaxed and playful, with plenty of room to laugh at the camera. The second meant reading the room: the ceremony schedule, the light, and the glance between them as they made their entrance.'),
      f('A couple’s story', 'storyTestimonial', 'Quote', 'testimonial', 'testimonial-4'),
      f('A couple’s story', 'storyPhoto1', 'First photo', 'photo', 'save-the-date'),
      f('A couple’s story', 'storyCaption1', 'First caption', 'text', 'The save-the-date session'),
      f('A couple’s story', 'storyPhoto2', 'Second photo', 'photo', 'dsc-88579'),
      f('A couple’s story', 'storyCaption2', 'Second caption', 'text', 'The wedding day'),
      f('More moments', 'momentsHeading', 'Heading', 'text', 'More moments', 'Choose which photos scroll here under Photos → “Homepage photo strip”.'),
      f('From clients', 'clientsHeading', 'Heading', 'text', 'From clients', 'Choose the quotes under Testimonials → “Homepage position”.'),
      f('Closing invitation', 'closingTitle', 'Heading', 'text', 'Planning an event, a wedding, a portrait session, a game or a performance?'),
      f('Closing invitation', 'closingText', 'Text', 'textarea', 'Tell Alan what you have in mind: the occasion, the date if you have one, and where it takes place.'),
    ],
  },
  {
    key: 'about',
    label: 'About',
    path: '/about',
    canUnpublish: true,
    seoTitle: 'About Alan Luby',
    seoDescription: 'Alan Luby is a Boynton Beach photographer with over 30 years of experience photographing events, weddings, portraits, sports and live performances.',
    fields: [
      f('Introduction', 'eyebrow', 'Eyebrow', 'text', 'About'),
      f('Introduction', 'heading', 'Heading', 'text', 'Alan Luby photographs people at their best moments.'),
      f('Introduction', 'portrait', 'Portrait of Alan', 'image', '/alan/AlanLuby.jpg'),
      f('Introduction', 'bio1', 'First paragraph', 'textarea', 'I\'m a freelance photographer who currently resides in Boynton Beach. I am a member of the Black Chamber of Commerce of Palm Beach County a former member of ASMP The American Society of Media Photographers. I have been hired to cover events by the Miami Herald, Palm Beach Post, South Florida Times, South Florida Sun-Sentinel, the Associated Press and numerous other publications. I have over 30 years of photography experience and was the team photographer for the Florida Bobcats of the Arena Football League and the Florida Beachdogs of the Continental Basketball Association.'),
      f('Introduction', 'bio2', 'Second paragraph', 'textarea', 'As a freelance photographer I have had the opportunity to cover the Miami Dolphins, Miami Heat, Miami Marlins, University of Miami, President Barack Obama, the victory party for Florida Gov. Rick Scott and numerous other news, sports and feature assignments for various publications.'),
      f('Introduction', 'bio3', 'Third paragraph', 'textarea', 'I’m also a portrait and wedding photographer that has done event photography with on-site printing for Motorola, American Society of Kidney Patients, Palm Beach State College, Big Brothers, Big Sisters of Palm Beach County, BB King\'s and numerous other profit and not-for-profit organizations.'),
      f('Career highlight', 'careerEyebrow', 'Eyebrow', 'text', 'Career highlight'),
      f('Career highlight', 'careerHeading', 'Heading', 'text', 'Ready for the moment that matters'),
      f('Career highlight', 'careerText', 'Text', 'textarea', 'Alan’s years covering news for South Florida publications included photographing President Barack Obama. That experience of working fast, in crowds and under pressure, is the same calm he brings to events today.'),
      f('Career highlight', 'careerPhoto', 'Photo', 'photo', 'djp-15474'),
      f('How Alan works', 'approachHeading', 'Heading', 'text', 'How Alan works'),
      f('How Alan works', 'approach1Title', 'Point 1 title', 'text', 'Prepared and on time'),
      f('How Alan works', 'approach1Text', 'Point 1 text', 'textarea', 'He plans around your schedule and arrives ready, so the day runs smoothly.'),
      f('How Alan works', 'approach2Title', 'Point 2 title', 'text', 'People at ease'),
      f('How Alan works', 'approach2Text', 'Point 2 text', 'textarea', 'Relaxed direction helps portrait subjects and guests stop worrying about the camera.'),
      f('How Alan works', 'approach3Title', 'Point 3 title', 'text', 'Watching for moments'),
      f('How Alan works', 'approach3Text', 'Point 3 text', 'textarea', 'The laugh, the embrace and the reaction often happen between the planned moments.'),
      f('How Alan works', 'approach4Title', 'Point 4 title', 'text', 'Natural results'),
      f('How Alan works', 'approach4Text', 'Point 4 text', 'textarea', 'Careful editing keeps skin tones and colors true to the day.'),
      f('Examples', 'examplesHeading', 'Heading', 'text', 'Examples of Alan’s work'),
      f('Examples', 'examplesPhotos', 'Photos', 'photos', 'dsc-5575,dsc-46779,dsc-68467'),
      f('Closing invitation', 'closingTitle', 'Heading', 'text', 'Have an occasion in mind?'),
    ],
  },
  {
    key: 'services',
    label: 'Services',
    path: '/services',
    canUnpublish: true,
    seoTitle: 'Services',
    seoDescription: 'Event and celebration photography, weddings and engagements, portraits and business headshots, sports and live performance photography by Alan Luby in South Florida.',
    fields: [
      f('Introduction', 'heading', 'Heading', 'text', 'Services', 'Each service’s own text and photos are edited under Services.'),
      f('Introduction', 'intro', 'Introduction', 'textarea', 'Alan photographs people at their occasions and weddings, in portraits, in competition and on stage. Here is what each kind of coverage includes and how to start a conversation about yours.'),
      f('How it works', 'processHeading', 'Heading', 'text', 'How it works'),
      f('How it works', 'step1Title', 'Step 1 title', 'text', 'Get in touch'),
      f('How it works', 'step1Text', 'Step 1 text', 'textarea', 'Send a short inquiry or call. Mention the occasion, the date and the location if you know them.'),
      f('How it works', 'step2Title', 'Step 2 title', 'text', 'Plan together'),
      f('How it works', 'step2Text', 'Step 2 text', 'textarea', 'Alan talks through the schedule, the people who matter most and the moments you want covered.'),
      f('How it works', 'step3Title', 'Step 3 title', 'text', 'The day itself'),
      f('How it works', 'step3Text', 'Step 3 text', 'textarea', 'Alan arrives prepared and works quietly around your program, session, game or show.'),
      f('How it works', 'step4Title', 'Step 4 title', 'text', 'Your photographs'),
      f('How it works', 'step4Text', 'Step 4 text', 'textarea', 'You receive edited, color-corrected digital images, ready to share and print.'),
    ],
  },
  {
    key: 'work',
    label: 'Work',
    path: '/work',
    canUnpublish: true,
    seoTitle: 'Work',
    seoDescription: 'Selected photographs by Alan Luby: events and celebrations, weddings and engagements, portraits, sports and live performance across South Florida.',
    fields: [
      f('Introduction', 'heading', 'Heading', 'text', 'Work', 'The photos and their order are managed under Photos.'),
      f('Introduction', 'intro', 'Introduction', 'textarea', 'A selection of recent photographs. Choose a category, or select any photograph to see it in full.'),
    ],
  },
  {
    key: 'testimonials',
    label: 'Testimonials',
    path: '/testimonials',
    canUnpublish: true,
    seoTitle: 'Testimonials',
    seoDescription: 'What event organizers, families and businesses have said about working with photographer Alan Luby.',
    fields: [
      f('Introduction', 'heading', 'Heading', 'text', 'Testimonials', 'Which quotes appear, and in what order, is managed under Testimonials.'),
      f('Introduction', 'intro', 'Introduction', 'textarea', 'Event organizers, families and businesses on working with Alan, in their own words.'),
    ],
  },
  {
    key: 'contact',
    label: 'Contact / Inquire',
    path: '/contact',
    canUnpublish: true,
    seoTitle: 'Inquire',
    seoDescription: 'Contact Alan Luby about event, wedding, engagement, portrait, sports or live performance photography in South Florida. Email aluby1441@aol.com or call (561) 340-9310.',
    fields: [
      f('Introduction', 'heading', 'Heading', 'text', 'Let’s talk about your photographs.'),
      f('Introduction', 'intro', 'Introduction', 'textarea', 'Tell Alan about your event, wedding, portrait session, game or performance. A few details are enough to start the conversation.'),
      f('Sidebar', 'directHeading', 'Direct contact heading', 'text', 'Prefer to reach Alan directly?', 'Email, phone numbers and social links come from Settings.'),
      f('Sidebar', 'whereHeading', 'Location heading', 'text', 'Where Alan works'),
      f('Sidebar', 'whereText', 'Location text', 'textarea', 'Based in Boynton Beach, Florida, photographing events, weddings, portraits, sports and performances across South Florida.'),
      f('Sidebar', 'helpfulHeading', 'Tips heading', 'text', 'Helpful to include'),
      f('Sidebar', 'helpfulItems', 'Tips (one per line)', 'textarea', 'The type of occasion or session\nThe date, if it’s set\nThe venue or area\nAnything you especially want captured'),
    ],
  },
];

export const pageDef = (key: PageKey) => PAGES.find((p) => p.key === key)!;

export const pageDefaults = (key: PageKey): Record<string, string> =>
  Object.fromEntries(pageDef(key).fields.map((fd) => [fd.name, fd.default]));

export type SocialIcon = 'instagram' | 'youtube' | 'linkedin' | 'facebook' | 'blog' | 'x' | 'tiktok' | 'website';

export interface SiteSettings {
  siteName: string;
  email: string;
  phone: string;
  phone2: string;
  socials: { label: string; url: string; icon: SocialIcon }[];
  footerText: string;
  inquiryTitle: string;
  inquiryText: string;
  seoTitle: string;
  seoDescription: string;
}

export const SETTINGS_DEFAULTS: SiteSettings = {
  siteName: 'Alan Luby Photography',
  email: 'aluby1441@aol.com',
  phone: '(561) 340-9310',
  phone2: '(561) 351-7373',
  socials: [
    { label: 'Instagram', url: 'https://www.instagram.com/alanluby', icon: 'instagram' },
    { label: 'YouTube', url: 'https://www.youtube.com/aluby1441', icon: 'youtube' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/alan-luby-05449322/', icon: 'linkedin' },
    { label: 'Facebook', url: 'https://www.facebook.com/profile.php?id=100063464860168', icon: 'facebook' },
    { label: 'Blog', url: 'https://alanlubyphoto.blogspot.com/', icon: 'blog' },
  ],
  footerText: 'Event, wedding, portrait, sports and live performance photography. Based in Boynton Beach, Florida, serving South Florida.',
  inquiryTitle: 'Tell Alan what you have planned.',
  inquiryText: 'Share the occasion, the date if you have one, and where it takes place. Alan will get back to you to talk it through.',
  seoTitle: 'Event & Portrait Photographer, South Florida',
  seoDescription:
    'Alan Luby photographs events, weddings, engagements and portraits across South Florida, along with sports and live performances. Based in Boynton Beach, Florida.',
};

/** tel: link for a displayed US phone number, e.g. "(561) 340-9310" → "tel:+15613409310". */
export const telHref = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  return `tel:${digits.length === 10 ? `+1${digits}` : `+${digits}`}`;
};
