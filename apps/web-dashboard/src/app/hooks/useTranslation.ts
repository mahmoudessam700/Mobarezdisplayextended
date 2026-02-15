import { useApp } from '../context/AppContext';
import { translations, TranslationKey } from '../translations';

export function useTranslation() {
  const { language } = useApp();

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return { t };
}
