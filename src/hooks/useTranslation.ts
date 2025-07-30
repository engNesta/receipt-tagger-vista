import { useState, useEffect } from 'react';

interface TranslationCache {
  [key: string]: {
    [targetLang: string]: string;
  };
}

const CACHE_KEY = 'lingva_translations';
const LINGVA_API_BASE = 'https://lingva.ml/api/v1';

export const useTranslation = () => {
  const [cache, setCache] = useState<TranslationCache>(() => {
    const stored = localStorage.getItem(CACHE_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  // Save cache to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  }, [cache]);

  const translate = async (
    text: string,
    sourceLang: string = 'en',
    targetLang: string = 'sv'
  ): Promise<string> => {
    // If target language is English, return original text
    if (targetLang === 'en') {
      return text;
    }

    // Check cache first
    const cacheKey = `${sourceLang}-${text}`;
    if (cache[cacheKey] && cache[cacheKey][targetLang]) {
      return cache[cacheKey][targetLang];
    }

    try {
      const encodedText = encodeURIComponent(text);
      const response = await fetch(
        `${LINGVA_API_BASE}/${sourceLang}/${targetLang}/${encodedText}`
      );

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      const translation = data.translation;

      // Update cache
      setCache(prev => ({
        ...prev,
        [cacheKey]: {
          ...prev[cacheKey],
          [targetLang]: translation
        }
      }));

      return translation;
    } catch (error) {
      console.warn('Translation failed, falling back to original text:', error);
      // Fallback to original text if translation fails
      return text;
    }
  };

  return { translate };
};