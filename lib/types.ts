export type IndianLanguageCode = 
  | 'hi-IN'   // Hindi
  | 'en-IN'   // Indian English
  | 'hinglish'// Hinglish
  | 'ta-IN'   // Tamil
  | 'te-IN'   // Telugu
  | 'bn-IN'   // Bengali
  | 'mr-IN'   // Marathi
  | 'gu-IN'   // Gujarati
  | 'kn-IN'   // Kannada
  | 'ml-IN'   // Malayalam
  | 'pa-IN';  // Punjabi

export interface LanguageInfo {
  code: IndianLanguageCode;
  speechCode: string; // Browser BCP 47 code
  name: string;
  nativeName: string;
  sampleGreeting: string;
}

export type AudiencePersona = 'students' | 'grandparents' | 'creators' | 'businesses';

export type PlaygroundMode = 'message' | 'notes' | 'creator' | 'business';

export interface ExperimentRecord {
  id: string;
  sessionId: string;
  taskType: PlaygroundMode | 'comparison';
  inputMethod: 'voice' | 'typing';
  durationMs: number;
  wordCount: number;
  transcribedText: string;
  createdAt: string;
}

export interface GameRound {
  id: number;
  title: string;
  scenario: string;
  instruction: string;
  keywords: string[];
  sampleVoiceText: string;
  minWords: number;
}

export interface GameScoreResult {
  roundId: number;
  score: number;
  maxScore: number;
  wordCount: number;
  durationMs: number;
  inputMethod: 'voice' | 'typing';
  feedback: string;
}

export interface SevenDaysEntry {
  day: number;
  title: string;
  persona: string;
  tagline: string;
  scenario: string;
  challenge: string;
  suggestedPrompt: string;
  sampleOutput: string;
  takeaway: string;
  accentColor: string;
}

