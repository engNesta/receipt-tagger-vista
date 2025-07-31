import { useState, useEffect } from 'react';

interface TranslationCache {
  [key: string]: {
    [targetLang: string]: string;
  };
}

const CACHE_KEY = 'google_translations';
const GOOGLE_TRANSLATE_API_KEY = 'AIzaSyBT3JkI8GDMku2PdNgVjOQ_GVsgAokzNZ4';
const GOOGLE_TRANSLATE_API_BASE = 'https://translation.googleapis.com/language/translate/v2';

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
      const url = `${GOOGLE_TRANSLATE_API_BASE}?key=${GOOGLE_TRANSLATE_API_KEY}`;
      
      console.log('Making Google Translate request:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: targetLang,
          format: 'text'
        })
      });

      if (!response.ok) {
        throw new Error(`Google Translate API error: ${response.status}`);
      }

      const data = await response.json();
      const translation = data.data.translations[0].translatedText;

      console.log('Translation successful:', translation);

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