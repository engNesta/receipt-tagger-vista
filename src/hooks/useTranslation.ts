import { useState, useEffect } from 'react';

interface TranslationCache {
  [key: string]: {
    [targetLang: string]: string;
  };
}

const CACHE_KEY = 'lingva_translations';
// Use a CORS proxy to bypass CSP restrictions
const LINGVA_API_BASE = 'https://api.allorigins.win/get?url=';
const LINGVA_ENDPOINT = 'https://lingva.ml/api/v1';

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
      const targetUrl = `${LINGVA_ENDPOINT}/${sourceLang}/${targetLang}/${encodedText}`;
      const proxyUrl = `${LINGVA_API_BASE}${encodeURIComponent(targetUrl)}`;
      
      console.log('Making translation request via proxy:', proxyUrl);
      
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const proxyData = await response.json();
      const data = JSON.parse(proxyData.contents);
      const translation = data.translation;

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