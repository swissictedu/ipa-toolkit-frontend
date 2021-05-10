import enUs from '../assets/i18n/en-us.json';
import deCh from '../assets/i18n/de-ch.json';

interface Language {
  id: string;
  data: any;
}

const languages: Language[] = [
  { id: 'en-us', data: enUs },
  { id: 'de-ch', data: deCh }
];

export default languages;

export const getMessages = (locale: string) => {
  for (const l of languages) {
    if (l.id === locale) {
      return l.data;
    }
  }
  throw Error('Language for locale "' + locale + '" not found');
};
