import React from 'react';
import { Link } from 'react-router-dom';
import { telHref } from '../site/content';
import { useSite } from '../site/SiteProvider';
import { Magnetic, TextReveal } from './Motion';

interface InquiryBandProps {
  title?: string;
  text?: string;
}

/** The single closing invitation used at the end of a page. Defaults come from the site settings. */
export const InquiryBand: React.FC<InquiryBandProps> = ({ title, text }) => {
  const { settings, page } = useSite();
  const { email, phone } = settings;
  const contact = page('contact').published;
  return (
  <section className="bg-accent text-paper">
    <div className="wrap grid gap-8 py-16 sm:py-20 lg:grid-cols-[1.3fr_1fr] lg:items-end">
      <div className="space-y-4">
        <TextReveal text={title || settings.inquiryTitle} className="text-3xl sm:text-4xl" />
        <p className="max-w-xl text-paper/85">{text || settings.inquiryText}</p>
      </div>
      <div className="flex flex-col gap-4 lg:items-end">
        {contact && (
        <Magnetic>
          <Link to="/contact" className="btn-primary self-start bg-paper text-accent hover:bg-white lg:self-end">
          Start an inquiry
        </Link>
        </Magnetic>
        )}
        <p className="text-[0.95rem] text-paper/85">
          {contact ? 'Or ' : ''}
          {email && <a href={`mailto:${email}`} className="underline underline-offset-4 hover:text-white">{email}</a>}
          {email && phone && ' · '}
          {phone && <a href={telHref(phone)} className="underline underline-offset-4 hover:text-white">{phone}</a>}
        </p>
      </div>
    </div>
  </section>
  );
};
