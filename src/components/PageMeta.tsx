import { useEffect } from 'react';

const SITE = 'Alan Luby Photography';

/** Sets the document title and meta description for the current route. */
export const PageMeta = ({ title, description }: { title?: string; description: string }) => {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE}` : `${SITE} | Event & Portrait Photographer, South Florida`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [title, description]);
  return null;
};
