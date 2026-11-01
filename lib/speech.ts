// Browser Web Speech API helper with fallback support

// Minimal typings for Web Speech API
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as unknown as IWindow;
  return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
}

export function createSpeechRecognizer(
  langCode: string,
  onResult: (text: string, isFinal: boolean) => void,
  onError: (errorMsg: string) => void,
  onEnd: () => void
) {
  if (!isSpeechRecognitionSupported()) {
    onError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari, or use manual typing.');
    return null;
  }

  const win = window as unknown as IWindow;
  const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
  const recognition = new SpeechRecognitionClass();

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = langCode;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let interim = '';
    let final = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final += event.results[i][0].transcript;
      } else {
        interim += event.results[i][0].transcript;
      }
    }

    const currentText = final || interim;
    onResult(currentText, !!final);
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    let message = 'An error occurred during speech recognition.';
    if (event.error === 'not-allowed' || event.error === 'permission-denied') {
      message = 'Microphone permission was denied. Please allow microphone access in your browser settings to speak.';
    } else if (event.error === 'no-speech') {
      message = 'No speech detected. Please speak closer to your microphone or type your response.';
    } else if (event.error === 'network') {
      message = 'Network error occurred while processing speech. Check your internet connection or use typing.';
    }
    onError(message);
  };

  recognition.onend = () => {
    onEnd();
  };

  return recognition;
}

