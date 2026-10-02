import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { fr, en } from './languages';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
  lng: 'fr',
  fallbackLng: 'fr',
  // Un seul espace de noms : un « : » dans un libellé passé tel quel (« Motif : … ») ne doit pas
  // être lu comme un préfixe d'espace de noms (le texte serait tronqué)
  nsSeparator: false,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
