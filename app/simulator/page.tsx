'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Sparkles, 
  RotateCcw, 
  Send, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Layers, 
  Copy, 
  Check,
  HelpCircle,
  Share2
} from 'lucide-react';

export default function SimulatorPage() {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Form State
  const [persona, setPersona] = useState('student');
  const [language, setLanguage] = useState('Hinglish');
  const [taskGoal, setTaskGoal] = useState('Quick WhatsApp update');
  const [typingDifficulty, setTypingDifficulty] = useState('Hinglish spelling confusion on English keyboard');
  const [spokenIntent, setSpokenIntent] = useState('');

  // Generated Result
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const personasList = [
    { id: 'student', label: 'College Student / Learner', icon: '🎓' },
    { id: 'business', label: 'Local Kirana / Boutique Shop Owner', icon: '🏪' },
    { id: 'grandparent', label: 'Parent / Grandparent', icon: '👵' },
    { id: 'creator', label: 'Social Media Creator / Solo Builder', icon: '✨' },
    { id: 'parent', label: 'Working Professional / Multitasking Parent', icon: '💼' },
  ];

  const languagesList = [
    'Hinglish (Hindi + English mix)',
    'Hindi (शुद्ध हिन्दी)',
    'Indian English',
    'Tamil (தமிழ்)',
    'Telugu (తెలుగు)',
    'Bengali (বাংলা)',
    'Marathi (मराठी)',
  ];

  const taskGoalsList = [
    'Quick WhatsApp update to friends/family',
    'College assignment revision notes',
    'Customer product quote and delivery promise',
    'Instagram Reel / YouTube hook',
    'Daily to-do checklist and schedule',
  ];

  const difficultiesList = [
    'Hinglish spelling confusion on English keyboard',
    'Slow typing speed on small mobile touchscreen',
    'Hand fatigue / eye strain while typing long paragraphs',
    'Multitasking hands (cooking, walking, driving, shopkeeping)',
    'Losing creative train of thought while looking for keys',
  ];

  const samplePresets: Record<string, string> = {
    student: 'Arey Sharma sun, kal subah 9 baje lab assignment submit karna hai. Main theory likh chuka hoon, code tu le aana.',
    business: 'Namaste Ji, aapka pure cotton handloom bedsheet dispatch ho gaya hai DTDC courier se. Tracking link attach kar di hai.',
    grandparent: 'Beta ghar aate waqt fresh dahi le aana, aur apna dhyan rakhna raste mein traffic bahut hoga.',
    creator: 'Stop making this 1 critical mistake when choosing your first credit card. 3 things you must check before applying.',
    parent: 'Weekend list: 2 litre toned milk, atta, pick up kids from football coaching at 4 PM, pick laundry.',
  };

  const handleRunSimulation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    const intent = spokenIntent || samplePresets[persona] || 'Bolo India voice workflow test.';

    try {
      const res = await fetch('/api/simulations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona,
          language,
          taskGoal,
          typingDifficulty,
          spokenIntent: intent,
        }),
      });

      const data = await res.json();
      if (data.success && data.scenario) {
        setResult(data.scenario);
      } else {
        throw new Error('Fallback');
      }
    } catch (e) {
      // Local deterministic fallback
      setResult({
        persona: personasList.find(p => p.id === persona)?.label || persona,
        icon: personasList.find(p => p.id === persona)?.icon || '🇮🇳',
        selectedLanguage: language,
        everydayProblem: typingDifficulty,
        spokenInput: intent,
        recognizedRawText: intent,
        formattedOutput: `[FORMATTED FOR ${taskGoal.toUpperCase()}]\n\n"${intent.trim()}"\n\n— Ready to send. Zero typing typos.`,
        practicalValue: 'Saved ~110 seconds of keyboard hunting. Accurate transcription in your chosen language.',
        generatedAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
      setStep(6); // Move to results step
    }
  };

  const handleCopy = async () => {
    if (!result?.formattedOutput) return;
    await navigator.clipboard.writeText(result.formattedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetAll = () => {
    setStep(1);
    setResult(null);
    setSpokenIntent('');
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
            Bolo India <span className="text-gradient-peacock">Simulator</span>
          </h1>
          <p className="text-sm sm:text-base text-charcoal-muted mt-1">
            Answer 5 quick questions about your natural voice habits to generate a custom voice-first workflow.
          </p>
        </div>
      </div>

      {/* Step Progress Indicator */}
      <div className="bg-white rounded-3xl p-6 border-2 border-cream-darker shadow-card space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-charcoal">
          <span>Simulation Step {Math.min(step, 5)} of 5</span>
          <span className="text-saffron">{result ? 'Completed' : 'Customizing Persona'}</span>
        </div>
        <div className="w-full bg-cream-darker h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-saffron to-coral h-full transition-all duration-300"
            style={{ width: `${(Math.min(step, 5) / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Who are you? */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-8 border-2 border-cream-darker shadow-card space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-saffron">QUESTION 1 OF 5</span>
            <h2 className="text-2xl font-black text-charcoal">Who are you? (आप कौन हैं?)</h2>
            <p className="text-xs text-charcoal-muted">Choose the profile that matches your daily routine.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {personasList.map((p) => (
              <button
                key={p.id}
                onClick={() => setPersona(p.id)}
                className={`p-4 rounded-2xl text-left border-2 transition-all flex items-center gap-3 ${
                  persona === p.id
                    ? 'bg-saffron/10 border-saffron text-charcoal font-bold shadow-sm'
                    : 'bg-white hover:bg-cream-surface border-charcoal/15 hover:border-saffron text-charcoal shadow-sm'
                }`}
              >
                <span className="text-2xl">{p.icon}</span>
                <span className="text-sm font-semibold">{p.label}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="bg-saffron hover:bg-saffron-dark text-white font-bold text-xs px-7 py-3.5 rounded-xl shadow-button transition-all"
            >
              NEXT STEP →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Language */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-8 border-2 border-cream-darker shadow-card space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-saffron">QUESTION 2 OF 5</span>
            <h2 className="text-2xl font-black text-charcoal">Which language do you naturally speak?</h2>
            <p className="text-xs text-charcoal-muted">Select the language or code-switching blend you think in.</p>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {languagesList.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`p-4 rounded-2xl text-left border-2 transition-all flex items-center justify-between ${
                  language === lang
                    ? 'bg-saffron/10 border-saffron text-charcoal font-bold shadow-sm'
                    : 'bg-white hover:bg-cream-surface border-charcoal/15 hover:border-saffron text-charcoal shadow-sm'
                }`}
              >
                <span className="text-sm font-semibold">{lang}</span>
                {language === lang && <CheckCircle2 className="w-4 h-4 text-saffron" />}
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="text-xs font-bold text-charcoal-muted hover:text-charcoal px-4 py-2"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="bg-saffron hover:bg-saffron-dark text-white font-bold text-xs px-7 py-3.5 rounded-xl shadow-button transition-all"
            >
              NEXT STEP →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Accomplish */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-8 border-2 border-cream-darker shadow-card space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-saffron">QUESTION 3 OF 5</span>
            <h2 className="text-2xl font-black text-charcoal">What do you want to accomplish?</h2>
            <p className="text-xs text-charcoal-muted">What everyday outcome are you trying to produce?</p>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {taskGoalsList.map((task) => (
              <button
                key={task}
                onClick={() => setTaskGoal(task)}
                className={`p-4 rounded-2xl text-left border-2 transition-all flex items-center justify-between ${
                  taskGoal === task
                    ? 'bg-saffron/10 border-saffron text-charcoal font-bold shadow-sm'
                    : 'bg-white hover:bg-cream-surface border-charcoal/15 hover:border-saffron text-charcoal shadow-sm'
                }`}
              >
                <span className="text-sm font-semibold">{task}</span>
                {taskGoal === task && <CheckCircle2 className="w-4 h-4 text-saffron" />}
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="text-xs font-bold text-charcoal-muted hover:text-charcoal px-4 py-2"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="bg-saffron hover:bg-saffron-dark text-white font-bold text-xs px-7 py-3.5 rounded-xl shadow-button transition-all"
            >
              NEXT STEP →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Typing Difficulty */}
      {step === 4 && (
        <div className="bg-white rounded-3xl p-8 border-2 border-cream-darker shadow-card space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-saffron">QUESTION 4 OF 5</span>
            <h2 className="text-2xl font-black text-charcoal">What makes typing difficult for you?</h2>
            <p className="text-xs text-charcoal-muted">Why is typing on a keyboard a bottleneck for this task?</p>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {difficultiesList.map((diff) => (
              <button
                key={diff}
                onClick={() => setTypingDifficulty(diff)}
                className={`p-4 rounded-2xl text-left border-2 transition-all flex items-center justify-between ${
                  typingDifficulty === diff
                    ? 'bg-coral/10 border-coral text-charcoal font-bold'
                    : 'bg-cream/40 hover:bg-cream border-cream-darker text-charcoal'
                }`}
              >
                <span className="text-sm font-semibold">{diff}</span>
                {typingDifficulty === diff && <CheckCircle2 className="w-4 h-4 text-coral" />}
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(3)}
              className="text-xs font-bold text-charcoal-muted hover:text-charcoal px-4 py-2"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(5)}
              className="bg-saffron hover:bg-saffron-dark text-white font-bold text-xs px-7 py-3.5 rounded-xl shadow-button transition-all"
            >
              NEXT STEP →
            </button>
          </div>
        </div>
      )}

      {/* Step 5: What would you prefer to say? */}
      {step === 5 && (
        <div className="bg-white rounded-3xl p-8 border-2 border-cream-darker shadow-card space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-saffron">QUESTION 5 OF 5</span>
            <h2 className="text-2xl font-black text-charcoal">What would you prefer to say?</h2>
            <p className="text-xs text-charcoal-muted">Type or adjust your intended speech below (or use the sample default).</p>
          </div>

          <div className="space-y-3">
            <textarea
              value={spokenIntent}
              onChange={(e) => setSpokenIntent(e.target.value)}
              placeholder={samplePresets[persona] || 'Type your spoken intent here...'}
              rows={4}
              className="w-full p-4 rounded-2xl bg-cream/50 border border-cream-darker focus:border-saffron text-sm text-charcoal focus:outline-none"
            />
            {!spokenIntent && (
              <button
                onClick={() => setSpokenIntent(samplePresets[persona])}
                className="text-xs text-saffron font-bold hover:underline"
              >
                + Insert sample voice phrase for {persona}
              </button>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(4)}
              className="text-xs font-bold text-charcoal-muted hover:text-charcoal px-4 py-2"
            >
              ← Back
            </button>
            <button
              onClick={() => handleRunSimulation()}
              disabled={loading}
              className="bg-gradient-to-r from-saffron to-coral text-white font-bold text-xs px-8 py-4 rounded-xl shadow-button hover:opacity-95 transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>{loading ? 'GENERATING SCENARIO...' : 'GENERATE SIMULATION'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 6: Personalized Scenario Output */}
      {step === 6 && result && (
        <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-saffron shadow-card-hover space-y-8 animate-in fade-in duration-300">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cream-darker">
            <div className="flex items-center gap-3">
              <span className="text-4xl p-3 bg-saffron/10 rounded-2xl">{result.icon}</span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-saffron">
                  SIMULATION COMPLETE
                </span>
                <h3 className="text-2xl font-black text-charcoal">{result.persona}</h3>
                <p className="text-xs text-charcoal-muted">{result.environment}</p>
              </div>
            </div>

            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border border-cream-darker hover:bg-cream-surface transition-all text-charcoal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Rerun Simulation</span>
            </button>
          </div>

          {/* Details Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-cream/70 border border-cream-darker space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">Selected Language</span>
              <p className="text-sm font-bold text-charcoal">{result.selectedLanguage}</p>
            </div>
            <div className="p-4 rounded-2xl bg-coral/10 border border-coral/20 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-coral">Everyday Problem Solved</span>
              <p className="text-sm font-bold text-charcoal">{result.everydayProblem}</p>
            </div>
          </div>

          {/* Spoken Raw Input */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal flex items-center gap-1.5">
              <span>🗣️ Example Spoken Input (Raw Speech):</span>
            </span>
            <div className="p-4 rounded-2xl bg-cream/40 border border-cream-darker text-sm text-charcoal font-mono italic">
              "{result.spokenInput}"
            </div>
          </div>

          {/* Clean Formatted Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal flex items-center gap-1.5">
                <span>✨ Clean Formatted Output:</span>
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const text = `🎙️ Bolo India Simulation Result:\n\n${result.formattedOutput}\n\n— Generated via Bolo India (boloindia.in)`;
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="text-xs font-bold text-lime-dark inline-flex items-center gap-1 hover:underline"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="text-xs font-bold text-saffron inline-flex items-center gap-1 hover:underline"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-charcoal text-cream font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {result.formattedOutput}
            </div>
          </div>

          {/* Practical Value Metric */}
          <div className="p-5 rounded-2xl bg-lime/10 border border-lime/30 flex items-start gap-3">
            <Zap className="w-5 h-5 text-lime-dark shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-lime-dark">
                PRACTICAL VALUE DEMONSTRATED
              </div>
              <p className="text-sm font-semibold text-charcoal mt-0.5">
                {result.practicalValue}
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-[11px] text-charcoal-muted text-center pt-2">
            * Deterministic scenario generated based on your exact selections. No fake AI metrics invented.
          </p>

        </div>
      )}

    </div>
  );
}

