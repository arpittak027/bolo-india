'use client';

import React, { useState } from 'react';
import { INDIAN_LANGUAGES, PLAYGROUND_MODES } from '@/lib/constants';
import { IndianLanguageCode, PlaygroundMode } from '@/lib/types';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { LanguageSelector } from '@/components/LanguageSelector';
import { 
  Sparkles, 
  MessageSquare, 
  FileText, 
  Video, 
  Briefcase, 
  Copy, 
  Check, 
  Share2, 
  ArrowLeft,
  Wand2,
  Info
} from 'lucide-react';
import Link from 'next/link';

export default function PlaygroundPage() {
  const [selectedLang, setSelectedLang] = useState<IndianLanguageCode>('hi-IN');
  const [activeMode, setActiveMode] = useState<PlaygroundMode>('message');
  const [transcribedText, setTranscribedText] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Sync with global top navbar language toggle
  React.useEffect(() => {
    const handleGlobalLang = (e: any) => {
      if (e.detail?.code) setSelectedLang(e.detail.code);
    };
    window.addEventListener('bolo:language-change', handleGlobalLang);
    return () => window.removeEventListener('bolo:language-change', handleGlobalLang);
  }, []);

  const currentModeObj = PLAYGROUND_MODES.find((m) => m.id === activeMode) || PLAYGROUND_MODES[0];
  const currentLangObj = INDIAN_LANGUAGES.find((l) => l.code === selectedLang) || INDIAN_LANGUAGES[0];

  const handleTextChange = async (text: string) => {
    setTranscribedText(text);
    setIsSaved(false);

    // Save experiment to backend API if text is substantial
    if (text.length > 15) {
      try {
        await fetch('/api/experiments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskType: activeMode,
            inputMethod: 'voice',
            durationMs: 4500,
            wordCount: text.trim().split(/\s+/).length,
            transcribedText: text,
          }),
        });
        setIsSaved(true);
      } catch (e) {
        /* quiet fail */
      }
    }
  };

  // Helper formatting presets
  const applyFormatter = (type: 'formal' | 'casual' | 'hashtags' | 'bulletize') => {
    if (!transcribedText) return;
    let updated = transcribedText;
    if (type === 'formal') {
      updated = `Respected Sir/Ma'am,\n\n${transcribedText}\n\nWarm regards,\nSent via Bolo India Voice`;
    } else if (type === 'casual') {
      updated = `Namaste! 🙏 ${transcribedText}\nBolo kab milna hai!`;
    } else if (type === 'hashtags') {
      updated = `${transcribedText}\n\n#BoloIndia #VoiceFirst #MadeInIndia #CreatorEconomy`;
    } else if (type === 'bulletize') {
      const items = transcribedText.split(/[.,\n]/).map(s => s.trim()).filter(Boolean);
      updated = `KEY POINTS:\n` + items.map(it => `• ${it}`).join('\n');
    }
    setTranscribedText(updated);
  };

  const modeIcons = {
    message: MessageSquare,
    notes: FileText,
    creator: Video,
    business: Briefcase,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-saffron hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Bolo India Home</span>
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-5xl font-black text-charcoal tracking-tight">
              Voice <span className="text-gradient-saffron">Playground</span>
            </h1>
            <p className="text-sm sm:text-base text-charcoal-muted mt-1">
              Select a task mode, speak naturally in your mother tongue or Hinglish, edit, and export.
            </p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-saffron/10 border border-saffron/20 text-saffron text-xs font-bold self-start md:self-auto flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Browser Web Speech Engine</span>
          </div>
        </div>
      </div>

      {/* Language Switcher */}
      <div className="bg-white rounded-3xl p-6 border-2 border-cream-darker shadow-card">
        <LanguageSelector
          selectedLanguage={selectedLang}
          onSelect={setSelectedLang}
        />
      </div>

      {/* Task Mode Tabs */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-charcoal">
          Choose Your Task Workflow:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLAYGROUND_MODES.map((mode) => {
            const Icon = modeIcons[mode.id as keyof typeof modeIcons];
            const isSelected = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id as PlaygroundMode)}
                className={`p-5 rounded-3xl text-left border-2 transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white shadow-card-hover border-saffron scale-102 ring-2 ring-saffron/20'
                    : 'bg-white hover:bg-white border-charcoal/15 hover:border-saffron text-charcoal shadow-sm'
                }`}
              >
                <div className="space-y-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold"
                    style={{ backgroundColor: `${mode.color}15`, color: mode.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-base text-charcoal">{mode.title}</div>
                    <div className="text-[11px] font-semibold text-saffron">{mode.hindiTitle}</div>
                  </div>
                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    {mode.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Mode Context Banner */}
      <div className="p-4 rounded-2xl bg-cream-surface border border-cream-darker flex items-center justify-between text-xs text-charcoal">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-saffron shrink-0" />
          <span>
            Active Mode: <strong>{currentModeObj.title}</strong> in <strong>{currentLangObj.name}</strong> ({currentLangObj.nativeName}).
          </span>
        </div>
        {isSaved && (
          <span className="text-lime-dark font-bold">✓ Logged to Session</span>
        )}
      </div>

      {/* Voice Recorder Component */}
      <VoiceRecorder
        languageCode={currentLangObj.speechCode}
        initialText={transcribedText}
        onTextChange={handleTextChange}
        suggestedPrompt={currentModeObj.promptSuggestion}
        placeholder={`Tap to speak in ${currentLangObj.name} for ${currentModeObj.title}. Or type manually anytime...`}
      />

      {/* One-Click Format Helpers */}
      {transcribedText && (
        <div className="bg-white rounded-3xl p-6 border-2 border-cream-darker shadow-card space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal">
            <Wand2 className="w-4 h-4 text-violet" />
            <span>Smart Formatting Presets:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => applyFormatter('formal')}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-violet/10 text-violet hover:bg-violet/20 transition-all border border-violet/20"
            >
              Make Formal & Professional
            </button>
            <button
              onClick={() => applyFormatter('casual')}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-saffron/10 text-saffron hover:bg-saffron/20 transition-all border border-saffron/20"
            >
              Add Warm Indian Greeting (Namaste 🙏)
            </button>
            <button
              onClick={() => applyFormatter('bulletize')}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-lime/10 text-lime-dark hover:bg-lime/20 transition-all border border-lime/20"
            >
              Convert to Bullet Points
            </button>
            <button
              onClick={() => applyFormatter('hashtags')}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-gulabi/10 text-gulabi hover:bg-gulabi/20 transition-all border border-gulabi/20"
            >
              Add Creator Tags
            </button>
          </div>
        </div>
      )}

      {/* Browser Prototype Notice */}
      <div className="p-4 rounded-2xl bg-cream-surface border border-cream-darker text-center text-xs text-charcoal-muted leading-relaxed">
        <strong>Browser Prototype Note:</strong> Voice recognition runs via your browser's native Web Speech API. This is an independent open demonstration and not a direct Wispr Flow integration.
      </div>

    </div>
  );
}

