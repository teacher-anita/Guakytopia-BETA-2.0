/**
 * Unified Natural Speech Service for Güakytopia
 * Powers ultra-natural AI voice across:
 * - Güaky The Macaw Chatbot & Voice Studio
 * - Language Lab (Güakytalkie)
 * - Where's Güaky? Arcade Game
 * 
 * Pipeline:
 * Tier 1: Gemini 3.8 Flash Lite TTS (24kHz studio-quality natural human audio)
 * Tier 2: Enhanced Browser Speech Engine (Prioritizing Neural/Natural voices over robotic synthesizers)
 */

export type VoicePersona = 'Puck' | 'Zephyr' | 'Kore' | 'Fenrir' | 'Charon';

export interface SpeechOptions {
  voiceName?: VoicePersona;
  speed?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err?: any) => void;
}

// Global in-memory cache to ensure instant playback without refetching
const audioCache = new Map<string, string>();
let currentAudioElement: HTMLAudioElement | null = null;
let isCurrentlySpeaking = false;

/**
 * Filter and select the most natural, human-sounding voice available in the browser.
 * Filters out low-fi robotic synthesizers (eSpeak, mechanical voices).
 */
export function getBestBrowserVoice(isEnglish: boolean = true): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const targetLang = isEnglish ? 'en' : 'es';
  const matching = voices.filter(v => v.lang.toLowerCase().startsWith(targetLang));
  if (matching.length === 0) return voices[0] || null;

  // High-priority keywords indicating modern neural / natural AI voices
  const naturalKeywords = [
    'natural',
    'online',
    'neural',
    'google',
    'jenny',
    'guy',
    'aria',
    'samantha',
    'daniel',
    'karen',
    'ava',
    'enhanced',
    'premium'
  ];

  // Exclude mechanical robotic synthesizers
  const withoutRobotic = matching.filter(
    v => !v.name.toLowerCase().includes('espeak') && 
         !v.name.toLowerCase().includes('klatt') &&
         !v.name.toLowerCase().includes('croak') &&
         !v.name.toLowerCase().includes('whisper')
  );

  const pool = withoutRobotic.length > 0 ? withoutRobotic : matching;

  for (const kw of naturalKeywords) {
    const found = pool.find(v => v.name.toLowerCase().includes(kw));
    if (found) return found;
  }

  return pool[0] || null;
}

/**
 * Stop any current speech playback across the entire app
 */
export function stopAllSpeech(): void {
  isCurrentlySpeaking = false;

  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.currentTime = 0;
    } catch {}
    currentAudioElement = null;
  }

  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

/**
 * Check if audio is currently playing
 */
export function isSpeechActive(): boolean {
  return isCurrentlySpeaking;
}

/**
 * Play text aloud using the most natural voice available.
 * 1. Tries Gemini 3.8 Flash Lite TTS via /api/tts (Crystal clear human 24kHz audio)
 * 2. Falls back to Neural Browser Speech Synthesis if network is unavailable
 */
export async function playNaturalSpeech(
  text: string,
  options: SpeechOptions = {}
): Promise<void> {
  const {
    voiceName = 'Puck',
    onStart,
    onEnd,
    onError
  } = options;

  if (!text || typeof text !== 'string') {
    onEnd?.();
    return;
  }

  // Stop any previously playing speech first
  stopAllSpeech();
  isCurrentlySpeaking = true;

  // Clean markdown, brackets, and emojis
  const clean = text
    .replace(/[*_#`~>\[\]()]/g, ' ')
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean) {
    isCurrentlySpeaking = false;
    onEnd?.();
    return;
  }

  // TIER 1: Check in-memory cache or fetch from Gemini Studio TTS API
  const cacheKey = `${voiceName}:${clean}`;
  let audioBase64 = audioCache.get(cacheKey);

  if (!audioBase64) {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: clean,
          voiceName
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (typeof data?.audioBase64 === 'string') {
          audioBase64 = data.audioBase64;
          audioCache.set(cacheKey, data.audioBase64);
        }
      }
    } catch (err) {
      console.warn('[SpeechService] Gemini TTS network issue, falling back to browser voice:', err);
    }
  }

  // If Gemini audio was retrieved successfully, play it!
  if (audioBase64) {
    try {
      const audio = new Audio(`data:audio/wav;base64,${audioBase64}`);
      currentAudioElement = audio;

      audio.onplay = () => {
        onStart?.();
      };

      audio.onended = () => {
        isCurrentlySpeaking = false;
        currentAudioElement = null;
        onEnd?.();
      };

      audio.onerror = (e) => {
        console.warn('[SpeechService] Audio element playback error:', e);
        isCurrentlySpeaking = false;
        currentAudioElement = null;
        // Attempt fallback to browser voice
        speakWithBrowserEngine(clean, options);
      };

      await audio.play();
      return;
    } catch (playErr) {
      console.warn('[SpeechService] audio.play() failed, attempting browser fallback:', playErr);
    }
  }

  // TIER 2: Fallback to high-definition Neural Browser Speech Synthesis
  speakWithBrowserEngine(clean, options);
}

/**
 * High-definition browser speech engine fallback with natural pacing
 */
function speakWithBrowserEngine(cleanText: string, options: SpeechOptions): void {
  const { onStart, onEnd, onError, speed = 0.95, pitch = 1.03 } = options;

  if (typeof window === 'undefined' || !window.speechSynthesis) {
    isCurrentlySpeaking = false;
    onError?.(new Error('SpeechSynthesis not supported'));
    onEnd?.();
    return;
  }

  try {
    const isEnglish = /[a-zA-Z\s]{10,}/.test(cleanText) && !/[áéíóúñ¿¡]/i.test(cleanText);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = isEnglish ? 'en-US' : 'es-US';
    utterance.rate = speed;
    utterance.pitch = pitch;

    const voice = getBestBrowserVoice(isEnglish);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      isCurrentlySpeaking = false;
      onEnd?.();
    };

    utterance.onerror = (e) => {
      isCurrentlySpeaking = false;
      onError?.(e);
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    isCurrentlySpeaking = false;
    onError?.(err);
    onEnd?.();
  }
}
