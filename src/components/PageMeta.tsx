import { useEffect } from 'react';
import { useSite } from '../site/SiteProvider';

/** Sets the document title and meta description for the current route. */
export const PageMeta = ({ title, description }: { title?: string; description?: string }) => {
  const { siteName, seoTitle, seoDescription } = useSite().settings;
  const text = description || seoDescription;
  useEffect(() => {
    document.title = title ? `${title} | ${siteName}` : `${siteName} | ${seoTitle}`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', text);
  }, [title, text, siteName, seoTitle]);
  return null;
};
