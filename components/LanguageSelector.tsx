'use client';

import React, { useEffect } from 'react';
import { INDIAN_LANGUAGES } from '@/lib/constants';
import { IndianLanguageCode } from '@/lib/types';
import { Globe, Check } from 'lucide-react';

interface LanguageSelectorProps {
  selectedLanguage: IndianLanguageCode;
  onSelect: (lang: IndianLanguageCode) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onSelect,
}) => {
  // Sync with global language change from top navbar toggle
  useEffect(() => {
    const handleGlobalLang = (e: any) => {
      if (e.detail?.code && e.detail.code !== selectedLanguage) {
        onSelect(e.detail.code);
      }
    };
    window.addEventListener('bolo:language-change', handleGlobalLang);
    return () => window.removeEventListener('bolo:language-change', handleGlobalLang);
  }, [selectedLanguage, onSelect]);

  const handleChoose = (code: IndianLanguageCode) => {
    onSelect(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bolo_preferred_lang', code);
      window.dispatchEvent(new CustomEvent('bolo:language-change', { detail: { code } }));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-charcoal">
          <div className="w-6 h-6 rounded-lg bg-saffron/15 text-saffron flex items-center justify-center">
            <Globe className="w-3.5 h-3.5" />
          </div>
          <span>Select Spoken Language (भाषा चुनें):</span>
        </div>
        <span className="text-[11px] font-black text-saffron px-2.5 py-0.5 rounded-full bg-saffron/10 border border-saffron/20">
          11 Indian Languages
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {INDIAN_LANGUAGES.map((lang) => {
          const isSelected = selectedLanguage === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleChoose(lang.code)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold tracking-wide transition-all transform active:scale-95 flex items-center gap-1.5 border-2 ${
                isSelected
                  ? 'bg-gradient-to-r from-saffron to-coral text-white border-saffron shadow-button scale-102 ring-2 ring-saffron/30'
                  : 'bg-white hover:bg-cream-surface text-charcoal border-charcoal/20 hover:border-saffron shadow-sm'
              }`}
            >
              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              <span>{lang.name}</span>
              <span
                className={`text-[11px] font-medium px-1.5 py-0.2 rounded ${
                  isSelected ? 'bg-black/20 text-white' : 'bg-cream-darker text-charcoal-muted'
                }`}
              >
                {lang.nativeName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
