'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Lightbulb, 
  ArrowRight,
  Volume2
} from 'lucide-react';
import { SEVEN_DAYS_VOICES } from '@/lib/constants';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { audioEngine } from '@/lib/audio';

export default function SevenDaysPage() {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [interactiveInput, setInteractiveInput] = useState<string>('');
  const [isNarrating, setIsNarrating] = useState<boolean>(false);

  const currentDay = SEVEN_DAYS_VOICES.find((d) => d.day === selectedDay) || SEVEN_DAYS_VOICES[0];

  const handleSelectDay = (day: number) => {
    audioEngine.stopSpeaking();
    setIsNarrating(false);
    setSelectedDay(day);
    setInteractiveInput('');
  };

  const handleToggleNarration = () => {
    if (isNarrating) {
      audioEngine.stopSpeaking();
      setIsNarrating(false);
    } else {
      setIsNarrating(true);
      const textToRead = `${currentDay.title}. ${currentDay.persona}. ${currentDay.scenario}. The challenge: ${currentDay.challenge}`;
      audioEngine.speakText(textToRead, 'hi-IN');
      setTimeout(() => setIsNarrating(false), 14000);
    }
  };

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
            Seven Days, <span className="text-gradient-saffron">Seven Voices</span>
          </h1>
          <p className="text-sm sm:text-base text-charcoal-muted mt-1 max-w-2xl">
            A cultural anthology of how voice-first computing transforms everyday life across different corners and generations of India.
          </p>
        </div>
      </div>

      {/* 7 Days Selector Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {SEVEN_DAYS_VOICES.map((entry) => {
          const isSelected = selectedDay === entry.day;
          return (
            <button
              key={entry.day}
              onClick={() => handleSelectDay(entry.day)}
              className={`p-4 rounded-3xl text-left border-2 transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-saffron shadow-card-hover scale-102 ring-2 ring-saffron/20'
                  : 'bg-white hover:bg-white border-charcoal/15 hover:border-saffron text-charcoal shadow-sm'
              }`}
            >
              <div>
                <span className="text-xs font-black tracking-wider text-saffron">DAY 0{entry.day}</span>
                <div className="text-sm font-black text-charcoal mt-1 line-clamp-1">{entry.title}</div>
              </div>
              <div
                className="w-2.5 h-2.5 rounded-full mt-3 self-end"
                style={{ backgroundColor: entry.accentColor }}
              />
            </button>
          );
        })}
      </div>

      {/* Active Day Detail Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-cream-darker shadow-card space-y-8">
        
        {/* Title & Persona Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-cream-darker">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-extrabold px-3 py-1 rounded-full text-white tracking-widest uppercase"
                style={{ backgroundColor: currentDay.accentColor }}
              >
                DAY {currentDay.day} OF 7
              </span>
              <span className="text-xs text-charcoal-muted font-bold tracking-wide">
                {currentDay.persona}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-charcoal pt-1">
              {currentDay.title}
            </h2>
            <p className="text-sm font-semibold text-charcoal-muted">
              {currentDay.tagline}
            </p>
          </div>

          <button
            onClick={handleToggleNarration}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-sm ${
              isNarrating
                ? 'bg-saffron text-white shadow-button animate-pulse'
                : 'bg-cream-surface border-2 border-cream-darker hover:border-saffron text-charcoal'
            }`}
          >
            <Volume2 className="w-4 h-4 text-saffron" />
            <span>{isNarrating ? 'STOP AUDIO NARRATION' : 'LISTEN TO STORY'}</span>
          </button>
        </div>

        {/* Realistic Scenario & Challenge */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-cream/70 border border-cream-darker space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-charcoal-muted">
              REAL-WORLD SCENARIO
            </span>
            <p className="text-sm text-charcoal leading-relaxed font-medium">
              {currentDay.scenario}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-saffron/10 border border-saffron/20 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-saffron">
              TODAY'S VOICE CHALLENGE
            </span>
            <p className="text-sm text-charcoal leading-relaxed font-bold">
              {currentDay.challenge}
            </p>
          </div>
        </div>

        {/* Interactive Try-It Voice Input */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-saffron" />
            <span>Try Today's Challenge (बोलकर या टाइप करके देखें):</span>
          </span>
          <VoiceRecorder
            languageCode="hi-IN"
            initialText={interactiveInput}
            onTextChange={setInteractiveInput}
            suggestedPrompt={currentDay.suggestedPrompt}
            placeholder={`Say or type your response for Day ${currentDay.day}: "${currentDay.challenge}"`}
          />
        </div>

        {/* Sample Output Display */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal">
            Sample Transcribed & Formatted Output:
          </span>
          <div className="p-5 rounded-2xl bg-charcoal text-cream font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {currentDay.sampleOutput}
          </div>
        </div>

        {/* Core Learning Takeaway */}
        <div className="p-6 rounded-2xl bg-lime/10 border border-lime/30 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-lime-dark shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-lime-dark">
              KEY PRODUCTIVITY TAKEAWAY
            </span>
            <p className="text-sm font-semibold text-charcoal">
              {currentDay.takeaway}
            </p>
          </div>
        </div>

        {/* Navigation to next day */}
        <div className="flex items-center justify-between pt-4 border-t border-cream-darker">
          <button
            onClick={() => handleSelectDay(selectedDay > 1 ? selectedDay - 1 : 7)}
            className="text-xs font-bold text-charcoal-muted hover:text-charcoal px-4 py-2"
          >
            ← Previous Day
          </button>
          <button
            onClick={() => handleSelectDay(selectedDay < 7 ? selectedDay + 1 : 1)}
            className="inline-flex items-center gap-1.5 bg-saffron text-white font-bold text-xs px-6 py-3 rounded-xl shadow-button hover:opacity-95 transition-all"
          >
            <span>Next Day</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}

