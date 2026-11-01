'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Mic, 
  Menu, 
  X, 
  Globe, 
  Volume2, 
  ChevronDown, 
  Check, 
  Sparkles,
  Gamepad2,
  Languages
} from 'lucide-react';
import { INDIAN_LANGUAGES } from '@/lib/constants';
import { IndianLanguageCode } from '@/lib/types';

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<IndianLanguageCode>('hi-IN');
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Quick switch popular languages for the top utility bar
  const quickLanguages: { code: IndianLanguageCode; label: string; native: string }[] = [
    { code: 'hi-IN', label: 'Hindi', native: 'हिन्दी' },
    { code: 'en-IN', label: 'English', native: 'English' },
    { code: 'hinglish', label: 'Hinglish', native: 'हिंग्लिश' },
    { code: 'ta-IN', label: 'Tamil', native: 'தமிழ்' },
    { code: 'bn-IN', label: 'Bengali', native: 'বাংলা' },
    { code: 'mr-IN', label: 'Marathi', native: 'मराठी' },
    { code: 'te-IN', label: 'Telugu', native: 'తెలుగు' },
  ];

  const navLinks = [
    { href: '/playground', label: 'Playground', badge: 'Voice' },
    { href: '/audiences', label: 'Audiences', badge: null },
    { href: '/simulator', label: 'Simulator', badge: 'Wizard' },
    { href: '/compare', label: 'Voice vs Typing', badge: 'Live' },
    { href: '/sprint', label: 'Bolo Sprint', badge: 'Game' },
    { href: '/seven-days', label: '7 Days', badge: null },
  ];

  // Helper to change language & dispatch custom event for page sync
  const handleSelectLanguage = (code: IndianLanguageCode) => {
    setSelectedLang(code);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bolo:language-change', { detail: { code } }));
      localStorage.setItem('bolo_preferred_lang', code);
    }
  };

  // Load persisted language preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bolo_preferred_lang') as IndianLanguageCode;
      if (saved && INDIAN_LANGUAGES.some(l => l.code === saved)) {
        setSelectedLang(saved);
      }
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = INDIAN_LANGUAGES.find((l) => l.code === selectedLang) || INDIAN_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 transition-all shadow-md">
      
      {/* 1. TOP UTILITY STRIP & QUICK LANGUAGE TOGGLE BAR */}
      <div className="bg-charcoal text-white py-1.5 px-3 sm:px-6 text-xs border-b border-charcoal-light flex items-center justify-between overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-saffron"></span>
          </span>
          <span className="font-extrabold tracking-wider uppercase text-[10px] text-white/90 flex items-center gap-1.5">
            <span>🇮🇳</span>
            <span className="hidden sm:inline">BHARAT VOICE PLATFORM:</span>
            <span className="text-saffron-light">BOLO INDIA</span>
          </span>
        </div>

        {/* Quick Language Toggle Strip */}
        <div className="flex items-center gap-1.5 shrink-0 ml-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-white/60 hidden md:inline">
            Quick Toggle:
          </span>
          {quickLanguages.map((ql) => {
            const isSelected = selectedLang === ql.code;
            return (
              <button
                key={ql.code}
                onClick={() => handleSelectLanguage(ql.code)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-saffron to-coral text-white shadow-sm ring-1 ring-white/50 scale-105'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
                title={`Switch to ${ql.label}`}
              >
                <span>{ql.label}</span>
                <span className="hidden sm:inline text-white/60 ml-1">({ql.native})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. MAIN HEADER NAVIGATION BAR */}
      <div className="bg-cream/95 backdrop-blur-md border-b-2 border-charcoal/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-saffron to-coral flex items-center justify-center text-white shadow-button group-hover:scale-105 transition-transform">
                <Mic className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-black text-xl sm:text-2xl tracking-tight text-charcoal font-sans">
                    BOLO <span className="text-saffron">INDIA</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-saffron/15 text-saffron border border-saffron/30">
                    बोलो
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-charcoal-muted tracking-wide font-medium hidden sm:block">
                  Voice-First Platform for Bharat
                </p>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1.5">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 border-2 ${
                      active
                        ? 'bg-saffron text-white border-saffron shadow-sm'
                        : 'text-charcoal border-transparent hover:border-charcoal/15 hover:bg-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && !active && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-saffron/10 text-saffron font-extrabold border border-saffron/20">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Header Controls (Top Toggles) */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* TOP LANGUAGE TOGGLE DROPDOWN */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-2xl bg-white border-2 border-saffron/40 hover:border-saffron text-charcoal text-xs font-black shadow-sm transition-all active:scale-95 group ring-1 ring-saffron/10"
                  title="Toggle Spoken Language"
                  aria-label="Toggle Spoken Language"
                >
                  <Globe className="w-4 h-4 text-saffron shrink-0 group-hover:rotate-45 transition-transform" />
                  <span className="font-black text-charcoal">{currentLang.name}</span>
                  <span className="text-[10px] bg-saffron/15 text-saffron px-1.5 py-0.5 rounded font-black hidden md:inline">
                    {currentLang.nativeName}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-charcoal-muted transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Language Dropdown Menu */}
                {langDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl border-2 border-charcoal/15 shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-84 overflow-y-auto">
                    <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-charcoal-muted border-b border-cream-darker mb-1.5 flex items-center justify-between">
                      <span>Select Language (भाषा)</span>
                      <span className="text-saffron font-bold">11 Languages</span>
                    </div>
                    <div className="space-y-1">
                      {INDIAN_LANGUAGES.map((lang) => {
                        const isSelected = selectedLang === lang.code;
                        return (
                          <button
                            key={lang.code}
                            onClick={() => {
                              handleSelectLanguage(lang.code);
                              setLangDropdownOpen(false);
                            }}
                            className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between text-left transition-all ${
                              isSelected
                                ? 'bg-gradient-to-r from-saffron to-coral text-white shadow-button'
                                : 'text-charcoal hover:bg-cream-surface'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span>{lang.name}</span>
                              <span className={`text-[11px] ${isSelected ? 'text-white/80' : 'text-charcoal-muted'}`}>
                                ({lang.nativeName})
                              </span>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* SPEAK CTA BUTTON */}
              <Link
                href="/playground"
                className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-saffron via-coral to-gulabi text-white font-black text-xs px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl shadow-button hover:opacity-95 transition-all transform active:scale-95"
              >
                <Volume2 className="w-4 h-4 animate-bounce" />
                <span>SPEAK</span>
              </Link>

              {/* MOBILE MENU TOGGLE BUTTON (TOP TOGGLE) */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl bg-white border-2 border-charcoal/20 hover:border-saffron text-charcoal font-black text-xs shadow-sm transition-all focus:outline-none active:scale-95"
                aria-label="Toggle Navigation Menu"
              >
                {mobileOpen ? (
                  <>
                    <X className="w-5 h-5 text-coral stroke-[2.5]" />
                    <span className="font-black text-coral">CLOSE</span>
                  </>
                ) : (
                  <>
                    <Menu className="w-5 h-5 text-saffron stroke-[2.5]" />
                    <span className="font-black text-charcoal">MENU</span>
                  </>
                )}
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* 3. MOBILE DRAWER */}
      {mobileOpen && (
        <div className="lg:hidden bg-cream-surface border-b-2 border-charcoal/15 px-4 pt-4 pb-8 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
          
          {/* Mobile Language Selector Box */}
          <div className="bg-white rounded-2xl p-3 border-2 border-charcoal/10 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-black text-charcoal">
              <span className="flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-saffron" />
                <span>SELECT SPOKEN LANGUAGE:</span>
              </span>
              <span className="text-[10px] text-saffron font-bold uppercase">{currentLang.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {INDIAN_LANGUAGES.map((lang) => {
                const isSelected = selectedLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      handleSelectLanguage(lang.code);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold text-left transition-all border ${
                      isSelected
                        ? 'bg-saffron text-white border-saffron shadow-sm'
                        : 'bg-cream/40 text-charcoal border-charcoal/10 hover:border-saffron'
                    }`}
                  >
                    <div>{lang.name}</div>
                    <div className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-charcoal-muted'}`}>
                      {lang.nativeName}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <div className="space-y-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-2xl text-sm font-bold border-2 transition-all ${
                  pathname === link.href
                    ? 'bg-saffron text-white border-saffron shadow-sm'
                    : 'bg-white text-charcoal border-charcoal/10 hover:border-saffron'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-saffron/15 font-black text-saffron border border-saffron/30">
                      {link.badge}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Voice Play CTA inside Mobile Drawer */}
          <Link
            href="/playground"
            onClick={() => setMobileOpen(false)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-saffron to-coral text-white font-black text-sm py-4 rounded-2xl shadow-button mt-2"
          >
            <Mic className="w-5 h-5 animate-pulse" />
            <span>START SPEAKING IN PLAYGROUND</span>
          </Link>
        </div>
      )}
    </header>
  );
};
