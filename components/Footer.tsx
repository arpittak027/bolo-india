'use client';

import React from 'react';
import Link from 'next/link';
import { Mic, Heart, Shield, RefreshCw, ExternalLink } from 'lucide-react';

export const Footer = () => {
  const handleResetData = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      alert('Local session data reset successfully.');
      window.location.reload();
    }
  };

  return (
    <footer className="bg-charcoal text-cream pt-16 pb-12 border-t-4 border-saffron">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-charcoal-light">
          
          {/* Brand Col */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-saffron flex items-center justify-center text-white font-bold">
                <Mic className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                BOLO <span className="text-saffron">INDIA</span>
              </span>
            </div>
            <p className="text-sm text-cream/70 leading-relaxed">
              "India has a lot to say. Let's make speaking easier."
            </p>
            <p className="text-xs text-cream/50">
              An independent voice-first product concept built for everyday communication across Bharat.
            </p>
          </div>

          {/* Experiences Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-marigold uppercase">
              Interactive Modules
            </h4>
            <ul className="space-y-2 text-xs text-cream/80">
              <li><Link href="/playground" className="hover:text-saffron transition-colors">Voice Playground (4 Modes)</Link></li>
              <li><Link href="/audiences" className="hover:text-saffron transition-colors">4 Audience Journeys</Link></li>
              <li><Link href="/simulator" className="hover:text-saffron transition-colors">Bolo India Simulator</Link></li>
              <li><Link href="/compare" className="hover:text-saffron transition-colors">Voice vs Typing Test</Link></li>
              <li><Link href="/sprint" className="hover:text-saffron transition-colors">Bolo Sprint Mini-Game</Link></li>
              <li><Link href="/seven-days" className="hover:text-saffron transition-colors">7 Days, 7 Voices</Link></li>
            </ul>
          </div>

          {/* Languages Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-lime uppercase">
              Languages & Dialects
            </h4>
            <p className="text-xs text-cream/70">
              Hindi • Hinglish • Indian English • Tamil • Telugu • Bengali • Marathi • Gujarati • Kannada • Punjabi • Malayalam
            </p>
            <div className="pt-2">
              <span className="inline-block text-[11px] bg-charcoal-light text-lime-light px-3 py-1.5 rounded-lg border border-lime/20 font-medium">
                Browser Web Speech API Compatible
              </span>
            </div>
          </div>

          {/* Privacy & Wispr Link */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-peacock uppercase">
              Wispr Flow Connection
            </h4>
            <p className="text-xs text-cream/70 leading-relaxed">
              Bolo India is an independent voice exploration demonstrating the power of speaking over typing in everyday workflows.
            </p>
            <a
              href="https://wisprflow.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-saffron-light hover:underline font-semibold"
            >
              <span>Visit Official Wispr Flow</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <div className="pt-2">
              <button
                onClick={handleResetData}
                className="inline-flex items-center gap-1.5 text-[11px] text-cream/60 hover:text-white border border-charcoal-light hover:border-cream/40 px-3 py-1.5 rounded-lg transition-all"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Local Session Data</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-cream/50 gap-4">
          <div className="flex items-center gap-2">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-coral fill-coral" />
            <span>for Bharat • Privacy-First & Anonymous</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-cream transition-colors">Privacy Principles</Link>
            <span>•</span>
            <span>No continuous audio recording</span>
            <span>•</span>
            <span>Client-side recognition</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

