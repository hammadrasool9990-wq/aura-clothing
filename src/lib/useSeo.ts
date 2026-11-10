import { useEffect } from 'react';
import { SITE } from '../data/site';

// Sets the page <title> and meta description for each page.
export function useSeo(title: string, description: string) {
  useEffect(() => {
    document.title = `${title} | ${SITE.name}`;
    const set = (selector: string, attr: string, key: string, value: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = value;
    };
    set('meta[name="description"]', 'name', 'description', description);
    set('meta[property="og:title"]', 'property', 'og:title', `${title} | ${SITE.name}`);
    set('meta[property="og:description"]', 'property', 'og:description', description);
  }, [title, description]);
}
