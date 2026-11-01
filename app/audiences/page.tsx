'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  HeartHandshake, 
  Sparkles, 
  Store, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { INDIAN_LANGUAGES } from '@/lib/constants';
import { IndianLanguageCode } from '@/lib/types';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { isSpeechRecognitionSupported } from '@/lib/speech';

export default function AudiencesPage() {
  const [selectedPersona, setSelectedPersona] = useState<'students' | 'grandparents' | 'creators' | 'businesses'>('students');
  const [selectedLang, setSelectedLang] = useState<IndianLanguageCode>('hinglish');
  const [browserSupport, setBrowserSupport] = useState<boolean>(true);

  useEffect(() => {
    setBrowserSupport(isSpeechRecognitionSupported());
    const handleGlobalLang = (e: any) => {
      if (e.detail?.code) setSelectedLang(e.detail.code);
    };
    window.addEventListener('bolo:language-change', handleGlobalLang);
    return () => window.removeEventListener('bolo:language-change', handleGlobalLang);
  }, []);

  const personas = [
    {
      id: 'students' as const,
      title: 'Students & Learners',
      hindiTitle: 'छात्र और युवा',
      icon: GraduationCap,
      color: '#FF5E14',
      tagline: 'Never lose a lecture formula, project idea, or quick revision thought.',
      problem: 'Typing academic notes on a 6-inch phone screen while a professor talks is slow and distracting.',
      voiceSolution: 'Speak naturally in Hinglish or regional language. Convert 10 minutes of spoken thoughts into crisp exam bullet points in 60 seconds.',
      samplePrompt: 'Newton ka third law basically states that for every action there is an equal and opposite reaction, example rocket propulsion.',
      features: ['Hinglish & English scientific jargon recognition', 'Instant bullet-point structure formatting', 'Hands-free lecture takeaways during commute'],
    },
    {
      id: 'grandparents' as const,
      title: 'Parents & Grandparents',
      hindiTitle: 'माता-पिता और बुजुर्ग',
      icon: HeartHandshake,
      color: '#FFB020',
      tagline: 'Sending warmth, blessings, and daily messages without squinting at tiny keyboards.',
      problem: 'English QWERTY keypads cause eye strain, thumb pain, and spelling anxiety for elders.',
      voiceSolution: 'Hold the button, speak pure Hindi, Tamil, or Bengali as you would in person. Your words appear clearly on screen ready to send to family.',
      samplePrompt: 'Meri pyari beti, subah ka naashta time par kar lena, weather thanda hai apna khayal rakhna.',
      features: ['Zero QWERTY keyboard confusion', 'Preserves emotional warmth of native spoken dialects', 'Large text preview and easy copy to WhatsApp'],
    },
    {
      id: 'creators' as const,
      title: 'Content Creators',
      hindiTitle: 'डिजिटल क्रिएटर्स',
      icon: Sparkles,
      color: '#E8175D',
      tagline: 'Catch viral YouTube hooks, reel scripts, and newsletter outlines on the fly.',
      problem: 'Great creative ideas strike in the shower, on a walk, or in traffic — and evaporate if not typed immediately.',
      voiceSolution: 'Speak your creative monologue at natural 150 WPM conversational pace. Edit the draft later into punchy social captions.',
      samplePrompt: 'Stop doing this 1 mistake while investing in mutual funds in your 20s. Here is what smart founders do instead.',
      features: ['Captures natural vocal energy & colloquial hooks', 'Hashtag generation and character count feedback', 'Uninhibited stream-of-consciousness ideation'],
    },
    {
      id: 'businesses' as const,
      title: 'Small Business Owners',
      hindiTitle: 'दुकानदार और व्यापारी',
      icon: Store,
      color: '#10B981',
      tagline: 'Respond to 50 customer inquiries on WhatsApp while managing the physical shop floor.',
      problem: 'Typing saree colors, sizes, payment details, and shipping updates one-by-one delays orders.',
      voiceSolution: 'Speak quick price quotes, product features, and delivery promises in seconds. Copy to customer chats without halting floor operations.',
      samplePrompt: 'Dear customer, pure brass diya set of 6 is 1200 rupees with free shipping. Tracking ID will be shared by 5 PM.',
      features: ['Fast product descriptions and inventory notes', 'Polite business greetings and rate quote formatting', 'Operates seamlessly amidst busy shop background noise'],
    },
  ];

  const currentPersona = personas.find((p) => p.id === selectedPersona)!;
  const currentLang = INDIAN_LANGUAGES.find((l) => l.code === selectedLang) || INDIAN_LANGUAGES[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-saffron hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Bolo India Home</span>
        </Link>
        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-charcoal tracking-tight">
            India <span className="text-gradient-peacock">Audience Journeys</span>
          </h1>
          <p className="text-sm sm:text-base text-charcoal-muted mt-1 max-w-2xl">
            How different people across Bharat use voice to conquer their everyday communication barriers.
          </p>
        </div>
      </div>

      {/* Persona Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {personas.map((p) => {
          const Icon = p.icon;
          const isSelected = selectedPersona === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPersona(p.id)}
              className={`p-6 rounded-3xl text-left border-2 transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-saffron shadow-card-hover scale-102 ring-2 ring-saffron/20'
                  : 'bg-white hover:bg-white border-charcoal/15 hover:border-saffron text-charcoal shadow-sm'
              }`}
            >
              <div className="space-y-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold"
                  style={{ backgroundColor: `${p.color}15`, color: p.color }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-charcoal">{p.title}</h3>
                  <div className="text-xs font-semibold text-saffron">{p.hindiTitle}</div>
                </div>
                <p className="text-xs text-charcoal-muted line-clamp-2">
                  {p.tagline}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Persona Deep Dive Card */}
      <div className="bg-white rounded-3xl p-8 border-2 border-cream-darker shadow-card space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-cream-darker">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-3xl flex items-center justify-center font-black"
              style={{ backgroundColor: `${currentPersona.color}20`, color: currentPersona.color }}
            >
              <currentPersona.icon className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-muted">
                ACTIVE AUDIENCE PROFILE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-charcoal">
                {currentPersona.title}
              </h2>
            </div>
          </div>

          {/* Language Preference */}
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-saffron" />
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value as IndianLanguageCode)}
              className="p-2.5 rounded-xl bg-cream border border-cream-darker text-xs font-bold text-charcoal focus:outline-none focus:border-saffron"
            >
              {INDIAN_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name} ({l.nativeName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Problem vs Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-coral/10 border border-coral/20 space-y-2">
            <div className="text-xs font-bold uppercase tracking-widest text-coral">
              THE EVERYDAY BARRIER
            </div>
            <p className="text-sm text-charcoal leading-relaxed font-medium">
              {currentPersona.problem}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-lime/10 border border-lime/20 space-y-2">
            <div className="text-xs font-bold uppercase tracking-widest text-lime-dark">
              THE VOICE-FIRST FREEDOM
            </div>
            <p className="text-sm text-charcoal leading-relaxed font-medium">
              {currentPersona.voiceSolution}
            </p>
          </div>
        </div>

        {/* Key Features List */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-charcoal">
            Why this audience loves speaking over typing:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {currentPersona.features.map((feat, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-cream/60 border border-cream-darker text-xs font-semibold text-charcoal flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-lime shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Voice Tester for Persona */}
        <div className="pt-4 border-t border-cream-darker space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal">
              Test Spoken Input for {currentPersona.title}:
            </span>
            <span className="text-[11px] text-charcoal-muted">
              Input language: <strong>{currentLang.name}</strong>
            </span>
          </div>

          <VoiceRecorder
            languageCode={currentLang.speechCode}
            placeholder={`Say a sample ${currentPersona.title} voice message in ${currentLang.name}...`}
            suggestedPrompt={currentPersona.samplePrompt}
          />
        </div>

      </div>

      {/* Honest Browser Compatibility Notice */}
      <div className="p-6 rounded-3xl bg-cream-surface border-2 border-cream-darker space-y-3 text-xs text-charcoal">
        <div className="flex items-center gap-2 font-bold text-charcoal">
          <ShieldCheck className="w-4 h-4 text-peacock" />
          <span>Honest Browser Speech Recognition Disclosure:</span>
        </div>
        <p className="text-charcoal-muted leading-relaxed">
          The Web Speech API engine is provided natively by your browser (e.g. Google Speech Services on Chrome/Android). While Hindi, Indian English, Tamil, Telugu, and Marathi work well on modern Chrome and Edge, some regional dialects may vary in precision. We never claim 100% universal accuracy where technology limits exist — manual typing is always available right beside speech input.
        </p>
      </div>

    </div>
  );
}

