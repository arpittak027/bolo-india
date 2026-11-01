'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, EyeOff, MicOff, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function PrivacyPage() {
  const handleClearSession = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      alert('Local session data has been completely cleared.');
      window.location.href = '/';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
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
            Privacy & <span className="text-gradient-peacock">Data Principles</span>
          </h1>
          <p className="text-sm sm:text-base text-charcoal-muted mt-1">
            Built with a strict privacy-first foundation. Voice computing should never cost you your personal privacy.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-cream-darker shadow-card space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-cream/70 border border-cream-darker space-y-2">
            <div className="flex items-center gap-2 text-saffron font-bold text-sm">
              <MicOff className="w-5 h-5" />
              <span>NO RAW AUDIO RECORDINGS STORED</span>
            </div>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              We never save or upload raw voice files or audio streams. Speech is converted client-side via your browser's native Web Speech API and text is kept local to your interaction.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-cream/70 border border-cream-darker space-y-2">
            <div className="flex items-center gap-2 text-lime-dark font-bold text-sm">
              <EyeOff className="w-5 h-5" />
              <span>ANONYMOUS BY DESIGN</span>
            </div>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              No mandatory registration, email collection, phone number verification, or invasive user tracking. All experiments use anonymous UUID session tokens.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-cream/70 border border-cream-darker space-y-2">
            <div className="flex items-center gap-2 text-peacock font-bold text-sm">
              <Lock className="w-5 h-5" />
              <span>ROW LEVEL SECURITY (RLS)</span>
            </div>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Our PostgreSQL database enforces strict Row Level Security policies so anonymous sessions can never read other users' sensitive operational data.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-cream/70 border border-cream-darker space-y-2">
            <div className="flex items-center gap-2 text-coral font-bold text-sm">
              <Shield className="w-5 h-5" />
              <span>ON-DEMAND MICROPHONE ACCESS</span>
            </div>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Microphone access is requested only when you explicitly tap the speak button, and is immediately terminated when you tap stop or close the tab.
            </p>
          </div>
        </div>

        {/* Local Data Reset Box */}
        <div className="p-6 rounded-2xl bg-saffron/10 border border-saffron/30 space-y-4">
          <div>
            <h3 className="text-base font-bold text-charcoal">
              Reset Local Session Data
            </h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Instantly wipe all local storage caches, benchmark attempts, and simulator preferences from your browser.
            </p>
          </div>
          <button
            onClick={handleClearSession}
            className="inline-flex items-center gap-2 bg-coral text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md hover:bg-coral/90 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>PURGE ALL LOCAL DATA NOW</span>
          </button>
        </div>

      </div>

    </div>
  );
}

