'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Gamepad2, 
  ArrowLeft, 
  Trophy, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  Volume2, 
  Keyboard, 
  Clock, 
  Send,
  Zap,
  Star,
  Share2
} from 'lucide-react';
import { BOLO_SPRINT_ROUNDS } from '@/lib/constants';
import { GameRound, GameScoreResult } from '@/lib/types';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { audioEngine } from '@/lib/audio';
import confetti from 'canvas-confetti';

export default function BoloSprintPage() {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [roundScores, setRoundScores] = useState<GameScoreResult[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [activeTab, setActiveTab] = useState<'voice' | 'typing'>('voice');
  const [roundStartTime, setRoundStartTime] = useState<number>(Date.now());
  const [highScore, setHighScore] = useState<number>(0);

  const currentRound = BOLO_SPRINT_ROUNDS[currentRoundIdx];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bolo_sprint_highscore');
      if (saved) setHighScore(parseInt(saved, 10));
    }
  }, []);

  useEffect(() => {
    setRoundStartTime(Date.now());
    setUserInput('');
  }, [currentRoundIdx]);

  // Transparent deterministic evaluation rule
  const evaluateAnswer = (round: GameRound, text: string): GameScoreResult => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const lower = text.toLowerCase();

    let score = 0;
    let feedbackParts: string[] = [];

    // 1. Minimum length requirement (40 pts)
    if (wordCount >= round.minWords) {
      score += 40;
      feedbackParts.push(`✓ Met minimum word requirement (+40)`);
    } else {
      const partial = Math.round((wordCount / round.minWords) * 40);
      score += partial;
      feedbackParts.push(`Partially met length requirement (+${partial})`);
    }

    // 2. Keyword relevance (40 pts)
    let matchedKeywords = 0;
    for (const kw of round.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        matchedKeywords++;
      }
    }
    const keywordScore = Math.min(40, matchedKeywords * 15);
    score += keywordScore;
    if (matchedKeywords > 0) {
      feedbackParts.push(`✓ Covered ${matchedKeywords} required context cues (+${keywordScore})`);
    } else {
      feedbackParts.push(`Missed key context cues (+0)`);
    }

    // 3. Detail & clarity bonus (20 pts)
    if (wordCount >= 12) {
      score += 20;
      feedbackParts.push(`✓ Rich detail and clear phrasing (+20)`);
    } else if (wordCount >= 8) {
      score += 10;
      feedbackParts.push(`✓ Good clarity (+10)`);
    }

    const elapsed = Date.now() - roundStartTime;

    return {
      roundId: round.id,
      score: Math.min(100, Math.max(10, score)),
      maxScore: 100,
      wordCount,
      durationMs: elapsed,
      inputMethod: activeTab,
      feedback: feedbackParts.join(' • '),
    };
  };

  const handleSubmitRound = async () => {
    if (!userInput.trim()) return;

    const result = evaluateAnswer(currentRound, userInput);
    const updated = [...roundScores, result];
    setRoundScores(updated);

    audioEngine.playSuccessFanfare();

    if (currentRoundIdx < BOLO_SPRINT_ROUNDS.length - 1) {
      setCurrentRoundIdx(currentRoundIdx + 1);
    } else {
      // Game Over
      setIsGameOver(true);
      const total = updated.reduce((acc, r) => acc + r.score, 0);

      if (total > highScore) {
        setHighScore(total);
        if (typeof window !== 'undefined') {
          localStorage.setItem('bolo_sprint_highscore', String(total));
        }
      }

      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 140,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FF5E14', '#10B981', '#FFB020', '#6366F1', '#E8175D'],
        });
      } catch (e) {}

      // Save to backend API
      try {
        await fetch('/api/game-results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            totalScore: total,
            roundsCompleted: 3,
            breakdown: updated,
          }),
        });
      } catch (e) {
        /* quiet fail */
      }
    }
  };

  const restartGame = () => {
    setCurrentRoundIdx(0);
    setUserInput('');
    setRoundScores([]);
    setIsGameOver(false);
    setRoundStartTime(Date.now());
  };

  const totalScore = roundScores.reduce((acc, r) => acc + r.score, 0);

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime/10 text-lime-dark text-xs font-bold uppercase tracking-wider mb-2">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>INTERACTIVE MINI-GAME</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-charcoal tracking-tight">
              Bolo <span className="text-gradient-saffron">Sprint</span>
            </h1>
            <p className="text-sm sm:text-base text-charcoal-muted mt-1">
              "Think it. Say it. Done." Complete 3 real-world communication challenges in 3 minutes.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border-2 border-cream-darker shadow-card text-center self-start sm:self-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">Current Score</span>
            <span className="text-2xl font-black text-saffron font-mono">{totalScore} / 300</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-3xl p-6 border-2 border-cream-darker shadow-card space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-charcoal">
          <span>{isGameOver ? 'Sprint Completed' : `Round ${currentRoundIdx + 1} of 3: ${currentRound.title}`}</span>
          <span className="text-saffron">
            {isGameOver ? '100%' : `${Math.round(((currentRoundIdx) / 3) * 100)}%`}
          </span>
        </div>
        <div className="w-full bg-cream-darker h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-saffron via-marigold to-lime h-full transition-all duration-500"
            style={{ width: `${isGameOver ? 100 : ((currentRoundIdx + 1) / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* GAMEPLAY ACTIVE ROUND */}
      {!isGameOver && (
        <div className="bg-white rounded-3xl p-8 border-2 border-cream-darker shadow-card space-y-6">
          
          {/* Round Header & Scenario */}
          <div className="space-y-3 pb-6 border-b border-cream-darker">
            <span className="text-xs font-bold uppercase tracking-widest text-saffron">
              MISSION SCENARIO:
            </span>
            <h2 className="text-2xl font-black text-charcoal leading-snug">
              "{currentRound.scenario}"
            </h2>
            <div className="p-4 rounded-2xl bg-cream/70 border border-cream-darker text-xs text-charcoal space-y-1">
              <span className="font-bold text-charcoal block">Specific Objective:</span>
              <p className="text-charcoal-muted">{currentRound.instruction}</p>
            </div>
          </div>

          {/* Voice vs Typing Tabs */}
          <div className="flex items-center gap-2 pb-2">
            <button
              onClick={() => setActiveTab('voice')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'voice'
                  ? 'bg-saffron text-white shadow-sm'
                  : 'bg-cream text-charcoal hover:bg-cream-darker'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>Voice Input (बोलकर)</span>
            </button>
            <button
              onClick={() => setActiveTab('typing')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'typing'
                  ? 'bg-saffron text-white shadow-sm'
                  : 'bg-cream text-charcoal hover:bg-cream-darker'
              }`}
            >
              <Keyboard className="w-4 h-4" />
              <span>Manual Typing</span>
            </button>
          </div>

          {/* Input Method */}
          {activeTab === 'voice' ? (
            <VoiceRecorder
              languageCode="hi-IN"
              initialText={userInput}
              onTextChange={setUserInput}
              suggestedPrompt={currentRound.sampleVoiceText}
              placeholder="Tap speak or state your answer out loud in Hindi, English, or Hinglish..."
            />
          ) : (
            <div className="space-y-2">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your response to the scenario here..."
                rows={5}
                className="w-full p-4 rounded-2xl bg-cream/40 border border-cream-darker focus:border-saffron text-sm text-charcoal focus:outline-none"
              />
              <button
                onClick={() => setUserInput(currentRound.sampleVoiceText)}
                className="text-xs text-saffron font-bold hover:underline"
              >
                + Insert sample answer
              </button>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4 border-t border-cream-darker">
            <span className="text-xs text-charcoal-muted font-mono">
              Words recorded: {userInput.trim().split(/\s+/).filter(Boolean).length}
            </span>

            <button
              onClick={handleSubmitRound}
              disabled={userInput.trim().length === 0}
              className="bg-gradient-to-r from-saffron to-coral text-white font-bold text-xs px-8 py-4 rounded-2xl shadow-button hover:opacity-95 transition-all disabled:opacity-40 flex items-center gap-2"
            >
              <span>SUBMIT ROUND {currentRoundIdx + 1}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

      {/* GAME OVER & FINAL SCOREBOARD */}
      {isGameOver && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-lime shadow-card-hover text-center space-y-8 animate-in fade-in duration-300">
          
          <div className="w-20 h-20 rounded-3xl bg-marigold/15 text-marigold mx-auto flex items-center justify-center">
            <Trophy className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-lime-dark">
              SPURT COMPLETED!
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-charcoal">
              Final Score: <span className="text-saffron font-mono">{totalScore}</span> / 300
            </h2>
            <p className="text-sm text-charcoal-muted max-w-md mx-auto">
              {totalScore >= 240
                ? '🏆 Shabaash! Outstanding verbal fluency and contextual clarity.'
                : totalScore >= 180
                ? '⭐ Great effort! You articulated your thoughts with solid speed.'
                : '👍 Good attempt! Voice helps you express more with less effort.'}
            </p>
          </div>

          {/* Round-by-Round Breakdown */}
          <div className="space-y-3 max-w-xl mx-auto text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal">
              Transparent Round Evaluation:
            </span>
            {roundScores.map((res, i) => (
              <div key={i} className="p-4 rounded-2xl bg-cream/70 border border-cream-darker space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-charcoal">
                  <span>Round {i + 1}: {BOLO_SPRINT_ROUNDS[i].title}</span>
                  <span className="text-saffron font-mono">{res.score} / 100 pts</span>
                </div>
                <p className="text-[11px] text-charcoal-muted">{res.feedback}</p>
              </div>
            ))}
          </div>

          {/* Replay CTA */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                const text = `🎯 I scored ${totalScore}/300 points on Bolo Sprint (Voice Mini-Game)! Can you beat my voice speed? Try it now: ${window.location.origin}/sprint`;
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="inline-flex items-center gap-2 bg-lime hover:bg-lime-dark text-white font-bold text-xs px-7 py-4 rounded-2xl shadow-button-lime transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>SHARE SCORE ON WHATSAPP</span>
            </button>

            <button
              onClick={restartGame}
              className="inline-flex items-center gap-2 bg-saffron hover:bg-saffron-dark text-white font-bold text-xs px-7 py-4 rounded-2xl shadow-button transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>PLAY AGAIN</span>
            </button>

            <Link
              href="/playground"
              className="inline-flex items-center gap-2 bg-white hover:bg-cream-surface text-charcoal font-bold text-xs px-7 py-4 rounded-2xl border-2 border-cream-darker shadow-card transition-all"
            >
              <Volume2 className="w-4 h-4 text-saffron" />
              <span>VOICE PLAYGROUND</span>
            </Link>
          </div>

        </div>
      )}

    </div>
  );
}

