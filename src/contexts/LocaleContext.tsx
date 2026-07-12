'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import es from '../i18n/es.json';
import en from '../i18n/en.json';

export type Locale = 'es' | 'en';

const translations: Record<Locale, Record<string, string>> = { es, en };

interface LocaleContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-locale') as Locale | null;
    if (saved && (saved === 'es' || saved === 'en')) {
      setLocaleState(saved);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('portfolio-locale', locale);
      document.documentElement.lang = locale;
    }
  }, [locale, mounted]);

  const setLocale = (l: Locale) => setLocaleState(l);

  const t = (key: string): string => {
    return translations[locale][key] || translations['es'][key] || key;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
