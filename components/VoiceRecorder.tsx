'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Square, 
  RotateCcw, 
  Copy, 
  Check, 
  AlertCircle, 
  Edit3, 
  Volume2, 
  VolumeX, 
  Share2 
} from 'lucide-react';
import { createSpeechRecognizer, isSpeechRecognitionSupported } from '@/lib/speech';
import { audioEngine } from '@/lib/audio';

interface VoiceRecorderProps {
  languageCode: string;
  placeholder?: string;
  onTextChange?: (text: string) => void;
  initialText?: string;
  suggestedPrompt?: string;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  languageCode,
  placeholder = 'Speak naturally or click to start talking...',
  onTextChange,
  initialText = '',
  suggestedPrompt,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [text, setText] = useState(initialText);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);
  const [isSpeakingTts, setIsSpeakingTts] = useState(false);

  const recognizerRef = useRef<any>(null);

  useEffect(() => {
    setSupported(isSpeechRecognitionSupported());
  }, []);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const updateText = (newVal: string) => {
    setText(newVal);
    if (onTextChange) {
      onTextChange(newVal);
    }
  };

  const startRecording = () => {
    setErrorMsg(null);
    if (!supported) {
      setErrorMsg('Web Speech API is not supported in this browser. Please use Chrome, Edge, or type manually.');
      return;
    }

    try {
      const recognizer = createSpeechRecognizer(
        languageCode,
        (recognizedText) => {
          updateText(recognizedText);
        },
        (error) => {
          setErrorMsg(error);
          setIsRecording(false);
        },
        () => {
          setIsRecording(false);
        }
      );

      if (recognizer) {
        recognizerRef.current = recognizer;
        recognizer.start();
        setIsRecording(true);
        audioEngine.playStartChime();
      }
    } catch (e: any) {
      setErrorMsg('Failed to initialize microphone: ' + e.message);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognizerRef.current) {
      try {
        recognizerRef.current.stop();
      } catch (e) {
        /* already stopped */
      }
      recognizerRef.current = null;
    }
    setIsRecording(false);
    audioEngine.playStopBeep();
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      /* clipboard write blocked */
    }
  };

  const handleShareWhatsApp = () => {
    if (!text) return;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n\n— Sent via Bolo India Voice (boloindia.in)')}`;
    window.open(url, '_blank');
  };

  const handleSpeakTts = () => {
    if (!text) return;
    if (isSpeakingTts) {
      audioEngine.stopSpeaking();
      setIsSpeakingTts(false);
    } else {
      setIsSpeakingTts(true);
      audioEngine.speakText(text, languageCode);
      // Auto reset indicator after estimated speech duration
      const wordCount = text.split(/\s+/).length;
      const durationMs = Math.max(2000, wordCount * 450);
      setTimeout(() => setIsSpeakingTts(false), durationMs);
    }
  };

  const handleClear = () => {
    stopRecording();
    audioEngine.stopSpeaking();
    setIsSpeakingTts(false);
    updateText('');
    setErrorMsg(null);
  };

  const applySuggested = () => {
    if (suggestedPrompt) {
      updateText(suggestedPrompt);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-cream-darker p-6 shadow-card space-y-4">
      
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-cream-darker">
        
        {/* Left: Status Indicator & Audio Wave */}
        <div className="flex items-center gap-3">
          <div
            className={`w-3.5 h-3.5 rounded-full ${
              isRecording ? 'bg-coral animate-ping' : 'bg-lime'
            }`}
          />
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal">
            {isRecording ? 'Listening (बोलिए...)' : 'Microphone Ready'}
          </span>

          {/* Visual audio wave bars */}
          {isRecording && (
            <div className="flex items-center gap-1 h-6 px-2">
              <span className="w-1 bg-coral rounded-full wave-bar" />
              <span className="w-1 bg-saffron rounded-full wave-bar" />
              <span className="w-1 bg-marigold rounded-full wave-bar" />
              <span className="w-1 bg-lime rounded-full wave-bar" />
              <span className="w-1 bg-peacock rounded-full wave-bar" />
              <span className="w-1 bg-gulabi rounded-full wave-bar" />
            </div>
          )}
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2">
          {suggestedPrompt && !text && (
            <button
              onClick={applySuggested}
              className="text-[11px] font-semibold text-saffron bg-saffron/10 hover:bg-saffron/20 px-3 py-1.5 rounded-lg transition-all"
            >
              Try Sample Voice
            </button>
          )}

          {text && (
            <>
              {/* Listen to Text TTS */}
              <button
                onClick={handleSpeakTts}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                  isSpeakingTts 
                    ? 'bg-saffron text-white border-saffron animate-pulse' 
                    : 'border-cream-darker hover:bg-cream-surface text-charcoal'
                }`}
                title="Listen to transcribed text"
              >
                {isSpeakingTts ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-saffron" />}
                <span>{isSpeakingTts ? 'Stop Voice' : 'Listen'}</span>
              </button>

              {/* Share to WhatsApp */}
              <button
                onClick={handleShareWhatsApp}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-lime/10 hover:bg-lime/20 text-lime-dark border border-lime/30 transition-all"
                title="Share via WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              {/* Copy */}
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-cream-darker hover:bg-cream-surface transition-all text-charcoal"
                title="Copy transcribed text"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-lime" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              {/* Clear */}
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-cream-darker hover:bg-cream-surface transition-all text-charcoal-muted hover:text-coral"
                title="Clear text"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Textarea Display */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => updateText(e.target.value)}
          placeholder={placeholder}
          rows={5}
          className="w-full p-4 rounded-2xl bg-cream/50 border border-cream-darker focus:border-saffron focus:bg-white focus:outline-none text-base text-charcoal placeholder:text-charcoal-muted/60 resize-y leading-relaxed font-sans transition-all"
        />
        
        <div className="absolute right-3 bottom-3 text-[11px] text-charcoal-muted bg-white/90 px-2 py-0.5 rounded border border-cream-darker flex items-center gap-2">
          <span>{text ? `${text.trim().split(/\s+/).filter(Boolean).length} words` : '0 words'}</span>
          <span>•</span>
          <span>{text.length} chars</span>
        </div>
      </div>

      {/* Error Alert if any */}
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-coral/10 border border-coral/30 flex items-start gap-2.5 text-xs text-coral">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{errorMsg}</p>
            <p className="text-[11px] text-charcoal-muted mt-0.5">
              You can still edit or type directly in the box above.
            </p>
          </div>
        </div>
      )}

      {/* Bottom Primary Mic Toggle Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="text-xs text-charcoal-muted flex items-center gap-1.5">
          <Edit3 className="w-3.5 h-3.5 text-saffron" />
          <span>Manual typing is always supported as an instant fallback.</span>
        </div>

        <button
          onClick={toggleRecording}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm tracking-wide transition-all transform active:scale-95 shadow-md ${
            isRecording
              ? 'bg-coral hover:bg-coral/90 text-white shadow-coral/30 animate-pulse'
              : 'bg-gradient-to-r from-saffron to-coral hover:opacity-95 text-white shadow-button'
          }`}
        >
          {isRecording ? (
            <>
              <Square className="w-4 h-4 fill-white" />
              <span>STOP RECORDING (रुकें)</span>
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 animate-bounce" />
              <span>TAP TO SPEAK (बोलना शुरू करें)</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
