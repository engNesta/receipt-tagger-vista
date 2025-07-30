import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';

interface TransProps {
  text: string;
  sourceLang?: 'en' | 'sv';
  className?: string;
}

export const Trans: React.FC<TransProps> = ({ 
  text, 
  sourceLang = 'en', 
  className = '' 
}) => {
  const { language } = useLanguage();
  const { translate } = useTranslation();
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const performTranslation = async () => {
      console.log(`Trans: translating "${text}" from ${sourceLang} to ${language}`);
      
      // If the current language is the same as source language, no translation needed
      if (language === sourceLang) {
        console.log(`Trans: no translation needed, setting to original text`);
        setTranslatedText(text);
        return;
      }

      setIsLoading(true);
      try {
        const result = await translate(text, sourceLang, language);
        console.log(`Trans: translation result: "${result}"`);
        setTranslatedText(result);
      } catch (error) {
        console.warn('Translation error:', error);
        setTranslatedText(text); // Fallback to original text
      } finally {
        setIsLoading(false);
      }
    };

    performTranslation();
  }, [text, language, sourceLang, translate]);

  if (isLoading) {
    return (
      <span className={`inline-flex items-center gap-1 ${className}`}>
        <span className="animate-pulse text-gray-500">●</span>
        {text}
      </span>
    );
  }

  return <span className={className}>{translatedText}</span>;
};