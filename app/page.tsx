'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Mic, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Gamepad2, 
  Timer, 
  Calendar, 
  Users, 
  CheckCircle2, 
  ExternalLink,
  Star,
  Send,
  Zap,
  Globe2
} from 'lucide-react';
import { INDIAN_LANGUAGES } from '@/lib/constants';
import { IndianLanguageCode } from '@/lib/types';
import { VoiceRecorder } from '@/components/VoiceRecorder';

export default function HomePage() {
  const [selectedLang, setSelectedLang] = useState<IndianLanguageCode>('hi-IN');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Sync with global top navbar language toggle
  React.useEffect(() => {
    const handleGlobalLang = (e: any) => {
      if (e.detail?.code) setSelectedLang(e.detail.code);
    };
    window.addEventListener('bolo:language-change', handleGlobalLang);
    return () => window.removeEventListener('bolo:language-change', handleGlobalLang);
  }, []);

  const handleSelectLang = (code: IndianLanguageCode) => {
    setSelectedLang(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bolo_preferred_lang', code);
      window.dispatchEvent(new CustomEvent('bolo:language-change', { detail: { code } }));
    }
  };

  const currentLangObj = INDIAN_LANGUAGES.find((l) => l.code === selectedLang) || INDIAN_LANGUAGES[0];

  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: feedbackRating, feedbackText }),
      });
      setFeedbackSent(true);
    } catch (e) {
      setFeedbackSent(true);
    }
  };

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-saffron/10 border border-saffron/20 text-saffron text-xs font-bold uppercase tracking-widest shadow-sm">
            <Sparkles className="w-4 h-4 text-saffron animate-spin" />
            <span>VOICE-FIRST COMPUTING FOR BHARAT</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-charcoal tracking-tight font-sans leading-[1.08]">
            India has a <span className="text-gradient-saffron">lot to say.</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-lg sm:text-2xl text-charcoal-light font-medium max-w-2xl mx-auto leading-relaxed">
            Think naturally. Speak freely. Turn your words into something useful.
          </p>

          {/* High-Contrast Hero Language Quick Toggle */}
          <div className="pt-2 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-3xl border-2 border-charcoal/15 shadow-sm inline-block max-w-full">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs font-black text-charcoal uppercase mr-1 flex items-center gap-1.5 px-2">
                  <Globe2 className="w-4 h-4 text-saffron" />
                  <span>Language Toggle:</span>
                </span>
                {INDIAN_LANGUAGES.map((lang) => {
                  const isSelected = selectedLang === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelectLang(lang.code)}
                      className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all border-2 flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-gradient-to-r from-saffron to-coral text-white border-saffron shadow-button scale-105'
                          : 'bg-cream/60 hover:bg-white text-charcoal border-charcoal/15 hover:border-saffron'
                      }`}
                    >
                      <span>{lang.name}</span>
                      <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-charcoal-muted'}`}>
                        ({lang.nativeName})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Hero CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/playground"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-saffron via-coral to-gulabi text-white font-extrabold text-sm sm:text-base px-8 py-4 rounded-2xl shadow-button hover:opacity-95 transition-all transform active:scale-95"
            >
              <Mic className="w-5 h-5 animate-bounce" />
              <span>START SPEAKING NOW</span>
            </Link>

            <Link
              href="/sprint"
              className="inline-flex items-center gap-2.5 bg-white hover:bg-cream-surface text-charcoal font-bold text-sm sm:text-base px-7 py-4 rounded-2xl border-2 border-cream-darker shadow-card transition-all"
            >
              <Gamepad2 className="w-5 h-5 text-lime" />
              <span>PLAY BOLO SPRINT GAME</span>
            </Link>
          </div>
        </div>

        {/* Live Interactive Hero Voice Box */}
        <div className="mt-14 max-w-3xl mx-auto">
          <div className="text-center mb-3">
            <span className="text-xs font-bold tracking-wider text-charcoal-muted uppercase">
              ⚡ Live Voice Sandbox • Speak or Type Instantly in {currentLangObj.name}
            </span>
          </div>
          <VoiceRecorder
            languageCode={currentLangObj.speechCode}
            placeholder={`Say something in ${currentLangObj.name} or type here: e.g. "${currentLangObj.sampleGreeting}"`}
            suggestedPrompt={currentLangObj.sampleGreeting}
          />
        </div>
      </section>


      {/* 2. EXPLORE EXPERIENCES MODULES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl sm:text-5xl font-black text-charcoal tracking-tight font-sans">
            Built for how <span className="text-gradient-peacock">India naturally speaks.</span>
          </h2>
          <p className="text-base sm:text-lg text-charcoal-muted max-w-2xl mx-auto">
            Discover all 6 core interactive modules designed around the communication habits, languages, and everyday needs across Bharat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Voice Playground */}
          <Link
            href="/playground"
            className="group bg-white rounded-3xl p-8 border-2 border-cream-darker hover:border-saffron shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-saffron/10 text-saffron flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mic className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-extrabold uppercase tracking-widest text-saffron">01 • THE CORE TOOL</div>
                <h3 className="text-2xl font-extrabold text-charcoal group-hover:text-saffron transition-colors">
                  Voice Playground
                </h3>
              </div>
              <p className="text-sm text-charcoal-muted leading-relaxed">
                4 purposeful workflows: Message Mode, Notes Mode, Creator Mode, and Business Mode. Talk, edit, copy, and export seamlessly.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-2 font-bold text-xs text-saffron tracking-wider">
              <span>ENTER PLAYGROUND</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>

          {/* Card 2: 4 Audience Journeys */}
          <Link
            href="/audiences"
            className="group bg-white rounded-3xl p-8 border-2 border-cream-darker hover:border-marigold shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-marigold/15 text-marigold flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-extrabold uppercase tracking-widest text-marigold">02 • TAILORED PERSONAS</div>
                <h3 className="text-2xl font-extrabold text-charcoal group-hover:text-marigold transition-colors">
                  India Audiences
                </h3>
              </div>
              <p className="text-sm text-charcoal-muted leading-relaxed">
                Specific voice journeys for Students, Grandparents, Content Creators, and Local Retailers with live browser speech capability checks.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-2 font-bold text-xs text-marigold tracking-wider">
              <span>EXPLORE JOURNEYS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Bolo India Simulator */}
          <Link
            href="/simulator"
            className="group bg-white rounded-3xl p-8 border-2 border-cream-darker hover:border-peacock shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-peacock/10 text-peacock flex items-center justify-center group-hover:scale-110 transition-transform">
                <Layers className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-extrabold uppercase tracking-widest text-peacock">03 • PERSONALIZED WIZARD</div>
                <h3 className="text-2xl font-extrabold text-charcoal group-hover:text-peacock transition-colors">
                  Bolo India Simulator
                </h3>
              </div>
              <p className="text-sm text-charcoal-muted leading-relaxed">
                Answer 5 simple questions about your language and everyday hurdles. Generate a personalized spoken workflow with practical time savings.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-2 font-bold text-xs text-peacock tracking-wider">
              <span>LAUNCH SIMULATOR</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Voice vs Typing Stopwatch */}
          <Link
            href="/compare"
            className="group bg-white rounded-3xl p-8 border-2 border-cream-darker hover:border-coral shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-coral/10 text-coral flex items-center justify-center group-hover:scale-110 transition-transform">
                <Timer className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-extrabold uppercase tracking-widest text-coral">04 • LIVE EXPERIMENT</div>
                <h3 className="text-2xl font-extrabold text-charcoal group-hover:text-coral transition-colors">
                  Voice vs Typing
                </h3>
              </div>
              <p className="text-sm text-charcoal-muted leading-relaxed">
                Complete the exact same task twice: first by typing, second by voice. Measure actual elapsed milliseconds, word counts, and WPM difference.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-2 font-bold text-xs text-coral tracking-wider">
              <span>RUN BENCHMARK</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>

          {/* Card 5: Bolo Sprint Game */}
          <Link
            href="/sprint"
            className="group bg-white rounded-3xl p-8 border-2 border-cream-darker hover:border-lime shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-lime/10 text-lime flex items-center justify-center group-hover:scale-110 transition-transform">
                <Gamepad2 className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-extrabold uppercase tracking-widest text-lime">05 • PLAYABLE MINI-GAME</div>
                <h3 className="text-2xl font-extrabold text-charcoal group-hover:text-lime transition-colors">
                  Bolo Sprint
                </h3>
              </div>
              <p className="text-sm text-charcoal-muted leading-relaxed">
                "Think it. Say it. Done." Complete 3 timed voice challenges: Message Mission, Idea Catcher, and Shop Talk. Earn points and review evaluation!
              </p>
            </div>
            <div className="pt-6 flex items-center gap-2 font-bold text-xs text-lime tracking-wider">
              <span>START PLAYING</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>

          {/* Card 6: Seven Days, Seven Voices */}
          <Link
            href="/seven-days"
            className="group bg-white rounded-3xl p-8 border-2 border-cream-darker hover:border-violet shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-violet/10 text-violet flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-extrabold uppercase tracking-widest text-violet">06 • CULTURAL ANTHOLOGY</div>
                <h3 className="text-2xl font-extrabold text-charcoal group-hover:text-violet transition-colors">
                  7 Days, 7 Voices
                </h3>
              </div>
              <p className="text-sm text-charcoal-muted leading-relaxed">
                Explore seven realistic Indian life scenarios: from college lectures in Pune to handloom saree sales in Kanchipuram and metro transit updates.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-2 font-bold text-xs text-violet tracking-wider">
              <span>READ & LISTEN</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>

        </div>
      </section>


      {/* 3. WISPR FLOW CONNECTION & VOICE-FIRST PHILOSOPHY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-charcoal text-cream rounded-3xl p-8 sm:p-14 border-4 border-marigold/30 shadow-2xl relative overflow-hidden">
          
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-marigold/20 text-marigold text-xs font-bold tracking-widest uppercase">
              <Zap className="w-3.5 h-3.5" />
              THE FUTURE OF COMPUTING IN BHARAT
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Why Voice is India's Natural Operating System
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-cream/80 leading-relaxed">
              <p>
                India has over <strong>800 million smartphone users</strong>, but typing in Indian languages remains painful. QWERTY keyboards were designed for 19th-century English typewriters, not for the phonetic nuances of Devanagari, Tamil, Telugu, or fluid Hinglish code-switching.
              </p>
              <p>
                Voice eliminates the cognitive barrier between thinking and capturing. When people speak, their ideas flow at <strong>140+ words per minute</strong> compared to 30 WPM on a mobile touchscreen.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-charcoal-light">
              <div className="p-4 rounded-2xl bg-charcoal-light/60 border border-cream/10">
                <div className="text-xl font-black text-saffron">3x Faster</div>
                <div className="text-xs text-cream/70 mt-1">Speaking vs mobile touchscreen typing</div>
              </div>
              <div className="p-4 rounded-2xl bg-charcoal-light/60 border border-cream/10">
                <div className="text-xl font-black text-lime">Zero Spelling Stress</div>
                <div className="text-xs text-cream/70 mt-1">Speak in Hinglish or regional dialects naturally</div>
              </div>
              <div className="p-4 rounded-2xl bg-charcoal-light/60 border border-cream/10">
                <div className="text-xl font-black text-peacock">Hands-Free Flow</div>
                <div className="text-xs text-cream/70 mt-1">On the metro, in the shop, or on the move</div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-cream/60">
              <span>* Bolo India is an independent research prototype.</span>
              <a
                href="https://wisprflow.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-saffron-light hover:underline font-bold inline-flex items-center gap-1"
              >
                <span>Learn about Wispr Flow</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* 4. USER FEEDBACK / RATINGS */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border-2 border-cream-darker p-8 shadow-card text-center space-y-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-charcoal">
              Aapki Raay (Your Feedback)
            </h3>
            <p className="text-xs text-charcoal-muted">
              How was your voice experience on Bolo India?
            </p>
          </div>

          {feedbackSent ? (
            <div className="p-6 rounded-2xl bg-lime/10 border border-lime/30 text-lime-dark font-bold text-sm">
              ✨ Dhanyawad! Your feedback has been recorded anonymously.
            </div>
          ) : (
            <form onSubmit={handleSendFeedback} className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setFeedbackRating(star)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= feedbackRating
                          ? 'text-marigold fill-marigold'
                          : 'text-cream-darker'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share any thoughts, language requests, or ideas..."
                rows={3}
                className="w-full p-4 rounded-2xl bg-cream/50 border border-cream-darker focus:border-saffron focus:bg-white text-sm text-charcoal focus:outline-none"
              />

              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-saffron text-white font-bold text-xs px-6 py-3 rounded-xl shadow-button hover:opacity-95 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>SUBMIT FEEDBACK</span>
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}

