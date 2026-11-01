'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Timer, 
  ArrowLeft, 
  Keyboard, 
  Mic, 
  CheckCircle2, 
  RotateCcw, 
  Play, 
  Square, 
  Clock, 
  TrendingUp,
  AlertCircle,
  Share2
} from 'lucide-react';
import { createSpeechRecognizer, isSpeechRecognitionSupported } from '@/lib/speech';

interface AttemptData {
  timeMs: number;
  wordCount: number;
  text: string;
}

export default function ComparePage() {
  const [taskIndex, setTaskIndex] = useState(0);
  const [phase, setPhase] = useState<'choose' | 'typing' | 'voice' | 'result'>('choose');

  // Tasks
  const tasks = [
    {
      title: 'Task 1: Urgent Delay Message',
      prompt: 'Tell your manager or client that your train is delayed by 25 minutes, but you are reviewing the slides on your laptop and will arrive soon.',
      sampleWords: 24,
    },
    {
      title: 'Task 2: College Event Idea',
      prompt: 'Suggest a college tech fest theme around sustainable robotics, where students build battery-free solar rover prototypes.',
      sampleWords: 18,
    },
    {
      title: 'Task 3: Local Product Description',
      prompt: 'Describe a box of organic Alphonso mangoes from Ratnagiri: naturally ripened, export grade, free delivery across the city.',
      sampleWords: 20,
    },
  ];

  // Typing Attempt
  const [typingText, setTypingText] = useState('');
  const [isTypingRunning, setIsTypingRunning] = useState(false);
  const [typingElapsed, setTypingElapsed] = useState(0);
  const typingStartRef = useRef<number>(0);
  const typingTimerRef = useRef<any>(null);
  const [typingResult, setTypingResult] = useState<AttemptData | null>(null);

  // Voice Attempt
  const [voiceText, setVoiceText] = useState('');
  const [isVoiceRunning, setIsVoiceRunning] = useState(false);
  const [voiceElapsed, setVoiceElapsed] = useState(0);
  const voiceStartRef = useRef<number>(0);
  const voiceTimerRef = useRef<any>(null);
  const recognizerRef = useRef<any>(null);
  const [voiceResult, setVoiceResult] = useState<AttemptData | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const currentTask = tasks[taskIndex];

  // Typing timer
  const handleTypingStart = () => {
    setIsTypingRunning(true);
    typingStartRef.current = Date.now();
    setTypingElapsed(0);
    typingTimerRef.current = setInterval(() => {
      setTypingElapsed(Date.now() - typingStartRef.current);
    }, 100);
  };

  const handleTypingFinish = () => {
    clearInterval(typingTimerRef.current);
    setIsTypingRunning(false);
    const finalElapsed = Date.now() - typingStartRef.current;
    const words = typingText.trim().split(/\s+/).filter(Boolean).length;
    setTypingResult({
      timeMs: finalElapsed,
      wordCount: words,
      text: typingText,
    });
    setPhase('voice');
  };

  // Voice timer & Speech recognition
  const handleVoiceStart = () => {
    setSpeechError(null);
    setIsVoiceRunning(true);
    voiceStartRef.current = Date.now();
    setVoiceElapsed(0);

    voiceTimerRef.current = setInterval(() => {
      setVoiceElapsed(Date.now() - voiceStartRef.current);
    }, 100);

    if (isSpeechRecognitionSupported()) {
      const recognizer = createSpeechRecognizer(
        'hi-IN',
        (recognized) => {
          setVoiceText(recognized);
        },
        (err) => {
          setSpeechError(err);
        },
        () => {
          // Ended
        }
      );
      if (recognizer) {
        recognizerRef.current = recognizer;
        recognizer.start();
      }
    } else {
      setSpeechError('Speech recognition is not supported in this browser. You can type or simulate speaking.');
    }
  };

  const handleVoiceFinish = () => {
    clearInterval(voiceTimerRef.current);
    if (recognizerRef.current) {
      try { recognizerRef.current.stop(); } catch (e) {}
    }
    setIsVoiceRunning(false);
    const finalElapsed = Date.now() - voiceStartRef.current;
    const words = voiceText.trim().split(/\s+/).filter(Boolean).length;
    setVoiceResult({
      timeMs: finalElapsed,
      wordCount: words,
      text: voiceText,
    });
    setPhase('result');
  };

  const resetAll = () => {
    setPhase('choose');
    setTypingText('');
    setVoiceText('');
    setTypingResult(null);
    setVoiceResult(null);
    setTypingElapsed(0);
    setVoiceElapsed(0);
    setSpeechError(null);
  };

  const formatSeconds = (ms: number) => (ms / 1000).toFixed(1) + 's';

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
            Voice vs Typing <span className="text-gradient-saffron">Simulator</span>
          </h1>
          <p className="text-sm sm:text-base text-charcoal-muted mt-1">
            Complete the exact same task twice. Measure real elapsed time on your own device.
          </p>
        </div>
      </div>

      {/* Task Picker */}
      <div className="bg-white rounded-3xl p-6 border-2 border-cream-darker shadow-card space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-charcoal">
          Select A Comparison Task:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {tasks.map((t, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (phase === 'choose') setTaskIndex(idx);
              }}
              disabled={phase !== 'choose'}
              className={`p-4 rounded-2xl text-left border-2 transition-all ${
                taskIndex === idx
                  ? 'bg-saffron/10 border-saffron font-bold text-charcoal shadow-sm'
                  : 'bg-white border-charcoal/15 text-charcoal hover:border-saffron shadow-sm'
              }`}
            >
              <div className="text-xs font-bold text-saffron">0{idx + 1}</div>
              <div className="text-sm font-bold text-charcoal">{t.title}</div>
            </button>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-cream/70 border border-cream-darker text-xs text-charcoal font-medium">
          <strong>Mission Prompt:</strong> "{currentTask.prompt}"
        </div>
      </div>

      {/* PHASE 1: CHOOSE OR START TYPING */}
      {phase === 'choose' && (
        <div className="bg-white rounded-3xl p-8 border-2 border-cream-darker shadow-card text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-coral/10 text-coral mx-auto flex items-center justify-center font-bold">
            <Keyboard className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h2 className="text-2xl font-black text-charcoal">Attempt A: Typing Test</h2>
            <p className="text-xs text-charcoal-muted">
              You will type the response manually using your keyboard. Click start when you are ready to begin the stopwatch.
            </p>
          </div>
          <button
            onClick={() => {
              setPhase('typing');
              handleTypingStart();
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-saffron to-coral text-white font-bold text-sm px-8 py-4 rounded-2xl shadow-button hover:opacity-95 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>START TYPING ATTEMPT</span>
          </button>
        </div>
      )}

      {/* PHASE 2: TYPING ATTEMPT RUNNING */}
      {phase === 'typing' && (
        <div className="bg-white rounded-3xl p-8 border-2 border-coral shadow-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-cream-darker">
            <div className="flex items-center gap-2 font-bold text-coral text-sm">
              <Keyboard className="w-5 h-5" />
              <span>ATTEMPT A: TYPING</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xl font-black text-charcoal">
              <Clock className="w-5 h-5 text-coral animate-spin" />
              <span>{formatSeconds(typingElapsed)}</span>
            </div>
          </div>

          <textarea
            value={typingText}
            onChange={(e) => setTypingText(e.target.value)}
            placeholder="Type your response to the prompt as quickly and naturally as you can..."
            rows={5}
            autoFocus
            className="w-full p-4 rounded-2xl bg-cream/40 border border-cream-darker focus:border-coral text-sm text-charcoal focus:outline-none"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-charcoal-muted font-mono">
              Words: {typingText.trim().split(/\s+/).filter(Boolean).length}
            </span>
            <button
              onClick={handleTypingFinish}
              disabled={typingText.trim().length === 0}
              className="bg-coral text-white font-bold text-xs px-7 py-3.5 rounded-xl shadow-md hover:bg-coral/90 transition-all disabled:opacity-50"
            >
              FINISH TYPING ATTEMPT →
            </button>
          </div>
        </div>
      )}

      {/* PHASE 3: VOICE ATTEMPT */}
      {phase === 'voice' && (
        <div className="bg-white rounded-3xl p-8 border-2 border-lime shadow-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-cream-darker">
            <div className="flex items-center gap-2 font-bold text-lime-dark text-sm">
              <Mic className="w-5 h-5" />
              <span>ATTEMPT B: VOICE TEST</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xl font-black text-charcoal">
              <Clock className="w-5 h-5 text-lime animate-spin" />
              <span>{formatSeconds(voiceElapsed)}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cream/60 text-xs text-charcoal">
            <strong>Prompt:</strong> "{currentTask.prompt}"
          </div>

          <div className="space-y-3">
            <textarea
              value={voiceText}
              onChange={(e) => setVoiceText(e.target.value)}
              placeholder="Click Start Speaking and state your answer out loud, or use the sample speech..."
              rows={4}
              className="w-full p-4 rounded-2xl bg-cream/40 border border-cream-darker focus:border-lime text-sm text-charcoal focus:outline-none"
            />
            {speechError && (
              <div className="p-3 bg-coral/10 text-coral text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{speechError}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-charcoal-muted font-mono">
              Words: {voiceText.trim().split(/\s+/).filter(Boolean).length}
            </span>

            <div className="flex items-center gap-3">
              {!isVoiceRunning ? (
                <button
                  onClick={handleVoiceStart}
                  className="bg-lime hover:bg-lime-dark text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-button-lime transition-all flex items-center gap-2"
                >
                  <Mic className="w-4 h-4" />
                  <span>START SPEAKING NOW</span>
                </button>
              ) : (
                <button
                  onClick={handleVoiceFinish}
                  className="bg-coral text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center gap-2 animate-pulse"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>STOP & SEE RESULTS</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PHASE 4: COMPARISON RESULTS */}
      {phase === 'result' && typingResult && voiceResult && (
        <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-saffron shadow-card-hover space-y-8 animate-in fade-in duration-300">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cream-darker">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-saffron">
                EXPERIMENT VERDICT
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-charcoal">
                Your Personal Benchmark Results
              </h2>
            </div>
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <button
                onClick={() => {
                  const speedDiff = (typingResult.timeMs / Math.max(voiceResult.timeMs, 1000)).toFixed(1);
                  const text = `⏱️ Voice vs Typing Benchmark Results:\n• Typing: ${formatSeconds(typingResult.timeMs)} (${typingResult.wordCount} words)\n• Voice: ${formatSeconds(voiceResult.timeMs)} (${voiceResult.wordCount} words)\n⚡ Speaking was ${speedDiff}x faster on Bolo India!\nTry it yourself: ${window.location.origin}/compare`;
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-lime text-white hover:bg-lime-dark shadow-sm transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Results</span>
              </button>
              <button
                onClick={resetAll}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border border-cream-darker hover:bg-cream-surface transition-all text-charcoal"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Another Task</span>
              </button>
            </div>
          </div>

          {/* Time & Speed Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Attempt A: Typing */}
            <div className="p-6 rounded-3xl bg-coral/10 border-2 border-coral/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-coral">ATTEMPT A: TYPING</span>
                <Keyboard className="w-5 h-5 text-coral" />
              </div>
              <div>
                <div className="text-4xl font-black text-charcoal font-mono">
                  {formatSeconds(typingResult.timeMs)}
                </div>
                <div className="text-xs text-charcoal-muted mt-1">
                  {typingResult.wordCount} words • ~{Math.round((typingResult.wordCount / (typingResult.timeMs / 60000)) || 0)} WPM
                </div>
              </div>
              <div className="pt-2 border-t border-coral/20">
                <span className="text-[11px] font-bold text-charcoal">Typed Text:</span>
                <p className="text-xs text-charcoal-muted mt-1 italic">
                  "{typingResult.text || '(No text typed)'}"
                </p>
              </div>
            </div>

            {/* Attempt B: Voice */}
            <div className="p-6 rounded-3xl bg-lime/10 border-2 border-lime/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-lime-dark">ATTEMPT B: VOICE</span>
                <Mic className="w-5 h-5 text-lime-dark" />
              </div>
              <div>
                <div className="text-4xl font-black text-charcoal font-mono">
                  {formatSeconds(voiceResult.timeMs)}
                </div>
                <div className="text-xs text-charcoal-muted mt-1">
                  {voiceResult.wordCount} words • ~{Math.round((voiceResult.wordCount / (voiceResult.timeMs / 60000)) || 0)} WPM
                </div>
              </div>
              <div className="pt-2 border-t border-lime/20">
                <span className="text-[11px] font-bold text-charcoal">Spoken Text:</span>
                <p className="text-xs text-charcoal-muted mt-1 italic">
                  "{voiceResult.text || '(No speech captured)'}"
                </p>
              </div>
            </div>

          </div>

          {/* Honest Analysis Callout */}
          <div className="p-6 rounded-2xl bg-cream border border-cream-darker space-y-2 text-xs text-charcoal leading-relaxed">
            <div className="font-bold text-charcoal text-sm flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-saffron" />
              <span>Balanced Comparison Analysis:</span>
            </div>
            <p className="text-charcoal-muted">
              {voiceResult.timeMs < typingResult.timeMs
                ? `Speaking was ${(typingResult.timeMs / Math.max(voiceResult.timeMs, 1000)).toFixed(1)}x faster than manual keyboard typing for this response.`
                : 'Both methods took comparable time.'}{' '}
              Voice allows uninterrupted thought flow and is ideal for drafting messages, recording notes, and creative hooks. Typing remains superior for code, precise numbers, and silent environments.
            </p>
          </div>

        </div>
      )}

    </div>
  );
}

