import React from 'react';
import { Link } from 'react-router-dom';
import { EMAIL, PHONE, PHONE_HREF } from './Footer';
import { TextReveal } from './Motion';

interface InquiryBandProps {
  title?: string;
  text?: string;
}

/** The single closing invitation used at the end of a page. */
export const InquiryBand: React.FC<InquiryBandProps> = ({
  title = 'Tell Alan what you have planned.',
  text = 'Share the occasion, the date if you have one, and where it takes place. Alan will get back to you to talk it through.',
}) => (
  <section className="bg-accent text-paper">
    <div className="wrap grid gap-8 py-16 sm:py-20 lg:grid-cols-[1.3fr_1fr] lg:items-end">
      <div className="space-y-4">
        <TextReveal text={title} className="text-3xl sm:text-4xl" />
        <p className="max-w-xl text-paper/85">{text}</p>
      </div>
      <div className="flex flex-col gap-4 lg:items-end">
        <Link to="/contact" className="btn-primary self-start bg-paper text-accent hover:bg-white lg:self-end">
          Start an inquiry
        </Link>
        <p className="text-[0.95rem] text-paper/85">
          Or <a href={`mailto:${EMAIL}`} className="underline underline-offset-4 hover:text-white">{EMAIL}</a>
          {' · '}
          <a href={PHONE_HREF} className="underline underline-offset-4 hover:text-white">{PHONE}</a>
        </p>
      </div>
    </div>
  </section>
);
