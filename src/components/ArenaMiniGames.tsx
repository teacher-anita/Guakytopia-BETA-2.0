import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, Clock3, Heart, RotateCcw, Search, Sparkles, Swords } from 'lucide-react';
import { Student } from '../types';
import { saveArenaLives, subscribeToArenaLives } from '../services/db';

interface ArenaMiniGamesProps {
  currentStudent: Student | null;
  onAwardXp: (studentId: string, amount: number) => void;
  canSyncCloud: boolean;
}

type GameId = 'wordsearch' | 'scrabble' | 'hangman';
type LifeState = { lives: number; updatedAt: number };
type LearningSignal = { game: GameId; word: string; correct: boolean; unit: string; at: number };
const MAX_LEARNING_SIGNALS = 200;

function loadLearningSignals(key: string): LearningSignal[] {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is LearningSignal =>
      item && typeof item.word === 'string' && typeof item.game === 'string' &&
      typeof item.correct === 'boolean' && typeof item.at === 'number'
    ).slice(-MAX_LEARNING_SIGNALS);
  } catch { return []; }
}

const MAX_LIVES = 5;
const REFILL_MS = 30 * 60 * 1000;
const UNIT_1_WORDS = [
  { word: 'HELLO', hint: 'A common greeting when you meet someone' },
  { word: 'NAME', hint: 'What people call you' },
  { word: 'FINE', hint: 'A word used in the reply: “I’m ___, thanks.”' },
  { word: 'FRIEND', hint: 'A person you like and know well' },
  { word: 'TEACHER', hint: 'A person who teaches a class' },
  { word: 'MORNING', hint: 'The early part of the day' },
];
const UNIT_1_HANGMAN_WORDS = [
  { word: 'HELLO', hint: 'A greeting when you meet someone' },
  { word: 'GOOD', hint: 'The first word in “___ morning”' },
  { word: 'NIGHT', hint: 'The last word in “Good ___”' },
  { word: 'FRIEND', hint: 'Someone you like and trust' },
];

function loadLifeState(key: string): LifeState {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved) as LifeState;
      if (Number.isFinite(parsed.lives) && Number.isFinite(parsed.updatedAt)) {
        return { lives: Math.max(0, Math.min(MAX_LIVES, parsed.lives)), updatedAt: parsed.updatedAt };
      }
    }
  } catch {}
  return { lives: MAX_LIVES, updatedAt: Date.now() };
}

function applyRecharge(state: LifeState, now: number): LifeState {
  if (state.lives >= MAX_LIVES) return state;
  const elapsed = Math.max(0, now - state.updatedAt);
  const recovered = Math.floor(elapsed / REFILL_MS);
  if (recovered <= 0) return state;
  const lives = Math.min(MAX_LIVES, state.lives + recovered);
  return { lives, updatedAt: lives === MAX_LIVES ? now : state.updatedAt + recovered * REFILL_MS };
}

function makeGrid(word: string, seed: number): string[][] {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return Array.from({ length: 6 }, (_, row) =>
    Array.from({ length: 8 }, (_, col) => {
      if (col < word.length && row === seed % 6) return word[col];
      const n = (row * 13 + col * 7 + seed * 11 + row * col) % alphabet.length;
      return alphabet[n];
    })
  );
}

export const ArenaMiniGames: React.FC<ArenaMiniGamesProps> = ({ currentStudent, onAwardXp, canSyncCloud }) => {
  const storageKey = `guakytopia_arena_lives_${currentStudent?.id || 'guest'}`;
  const [lifeState, setLifeState] = useState<LifeState>(() => loadLifeState(storageKey));
  const [cloudReadyFor, setCloudReadyFor] = useState<string | null>(null);
  const [clockNow, setClockNow] = useState(() => Date.now());
  const signalsKey = `guakytopia_cokito_learning_signals_${currentStudent?.id || 'guest'}`;
  const [learningSignals, setLearningSignals] = useState<LearningSignal[]>(() => loadLearningSignals(signalsKey));
  const [activeGame, setActiveGame] = useState<GameId>('wordsearch');
  const [message, setMessage] = useState('');
  const [round, setRound] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [scrabbleInput, setScrabbleInput] = useState('');
  const [hangmanGuesses, setHangmanGuesses] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  // Only Unit 1 vocabulary is currently validated against the available curriculum data.
  // Never silently serve beginner words to a learner working in a later unit/level.
  const hasCurriculumBank = (currentStudent?.levelId ?? 'level_1') === 'level_1' && (currentStudent?.currentUnit ?? 1) === 1;
  const words = UNIT_1_WORDS;
  const hangmanWords = UNIT_1_HANGMAN_WORDS;

  useEffect(() => {
    setLifeState(loadLifeState(storageKey));
    setLearningSignals(loadLearningSignals(signalsKey));
    setMessage('');
    setSelectedLetters([]);
    setScrabbleInput('');
    setHangmanGuesses([]);
    setFinished(false);
    setRound(0);
  }, [storageKey, signalsKey]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const now = Date.now();
      setClockNow(now);
      setLifeState(previous => applyRecharge(previous, now));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const studentId = currentStudent?.id;
    if (!canSyncCloud || !studentId || studentId === 'guest') {
      setCloudReadyFor(null);
      return;
    }

    setCloudReadyFor(null);
    return subscribeToArenaLives(studentId, remoteState => {
      if (remoteState) {
        const refreshed = applyRecharge(remoteState, Date.now());
        setLifeState(previous => (
          previous.lives === refreshed.lives && previous.updatedAt === refreshed.updatedAt
            ? previous
            : refreshed
        ));
      }
      setCloudReadyFor(studentId);
    });
  }, [canSyncCloud, currentStudent?.id]);

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(lifeState)); } catch {}
  }, [storageKey, lifeState]);

  useEffect(() => {
    try { localStorage.setItem(signalsKey, JSON.stringify(learningSignals.slice(-MAX_LEARNING_SIGNALS))); } catch {}
  }, [signalsKey, learningSignals]);

  useEffect(() => {
    const studentId = currentStudent?.id;
    if (!canSyncCloud || !studentId || studentId === 'guest' || cloudReadyFor !== studentId) return;
    void saveArenaLives(studentId, lifeState);
  }, [canSyncCloud, currentStudent?.id, cloudReadyFor, lifeState]);

  const word = words[round % words.length];
  const hangman = hangmanWords[round % hangmanWords.length];
  const grid = useMemo(() => makeGrid(word.word, round), [word.word, round]);
  const scrambled = useMemo(() => {
    const letters = word.word.split('');
    return letters.reverse().join('');
  }, [word.word]);
  const refillIn = lifeState.lives >= MAX_LIVES
    ? 0
    : Math.max(0, REFILL_MS - (clockNow - lifeState.updatedAt));
  const timeLabel = `${Math.floor(refillIn / 60000)}:${String(Math.floor((refillIn % 60000) / 1000)).padStart(2, '0')}`;

  const consumeLife = () => {
    setLifeState(previous => {
      const fresh = applyRecharge(previous, Date.now());
      if (fresh.lives <= 0) return fresh;
      return { lives: fresh.lives - 1, updatedAt: fresh.lives === MAX_LIVES ? Date.now() : fresh.updatedAt };
    });
  };

  const recordLearningSignal = (correct: boolean, targetWord = word.word) => {
    setLearningSignals(previous => [...previous, {
      game: activeGame,
      word: targetWord,
      correct,
      unit: 'level_1_unit_1',
      at: Date.now()
    }].slice(-MAX_LEARNING_SIGNALS));
  };

  const winRound = (xp = 10) => {
    if (finished) return;
    recordLearningSignal(true, activeGame === 'hangman' ? hangman.word : word.word);
    setFinished(true);
    setMessage(`Brilliant! +${xp} XP. You did it! 🎉`);
    if (currentStudent && currentStudent.id !== 'guest') onAwardXp(currentStudent.id, xp);
  };

  const failAttempt = (text: string) => {
    recordLearningSignal(false, activeGame === 'hangman' ? hangman.word : word.word);
    consumeLife();
    setMessage(text);
  };

  const nextRound = () => {
    setRound(value => value + 1);
    setSelectedLetters([]);
    setScrabbleInput('');
    setHangmanGuesses([]);
    setFinished(false);
    setMessage('');
  };

  const chooseGame = (game: GameId) => {
    setActiveGame(game);
    setMessage('');
    setSelectedLetters([]);
    setScrabbleInput('');
    setHangmanGuesses([]);
    setFinished(false);
  };

  const checkWordSearch = () => {
    const answer = selectedLetters.join('');
    if (answer === word.word) winRound();
    else failAttempt('Not quite! One life used. Look carefully and try another word.');
  };

  const checkScrabble = () => {
    if (scrabbleInput.trim().toUpperCase() === word.word) winRound(12);
    else failAttempt('Not that word! One life used. Rearrange the letters and try again.');
  };

  const guessLetter = (letter: string) => {
    if (finished || hangmanGuesses.includes(letter)) return;
    const guesses = [...hangmanGuesses, letter];
    setHangmanGuesses(guesses);
    if (!hangman.word.includes(letter)) {
      recordLearningSignal(false, hangman.word);
      consumeLife();
      setMessage('Miss! One life used.');
      return;
    }
    if (hangman.word.split('').every(char => guesses.includes(char))) {
      winRound(15);
    }
  };

  const isOutOfLives = lifeState.lives <= 0;
  const correctSignals = learningSignals.filter(signal => signal.correct).length;
  const missedSignals = learningSignals.filter(signal => !signal.correct).length;
  const difficultWords = Object.entries(learningSignals.reduce<Record<string, number>>((counts, signal) => {
    if (!signal.correct) counts[signal.word] = (counts[signal.word] || 0) + 1;
    return counts;
  }, {})).sort((a, b) => b[1] - a[1]);
  const gameButton = (id: GameId, title: string, subtitle: string, emoji: string) => (
    <button key={id} type="button" onClick={() => chooseGame(id)} className={`rounded-2xl border p-3 text-left transition-all ${activeGame === id ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100' : 'border-slate-200 bg-white hover:border-indigo-300'}`}>
      <span className="text-xl">{emoji}</span>
      <span className="mt-1 block text-sm font-black text-slate-900">{title}</span>
      <span className="block text-[11px] text-slate-500">{subtitle}</span>
    </button>
  );

  return (
    <section className="w-full min-w-0 space-y-5 rounded-3xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/40 to-amber-50/50 p-3 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600"><Swords className="h-4 w-4" /> The Flock Arcade</div>
          <h3 className="mt-1 text-xl font-black text-slate-900">Play in English. Come back for more!</h3>
          <p className="mt-1 text-sm text-slate-600">Level 1 · Unit 1: greetings, introductions and classroom English.</p>
        </div>
        <div className="w-full rounded-2xl border border-rose-100 bg-white px-3 py-3 shadow-sm sm:w-auto sm:px-4">
          <div className="flex items-center gap-1.5 text-sm font-black text-slate-900">
            {Array.from({ length: MAX_LIVES }, (_, i) => <Heart key={i} className={`h-4 w-4 ${i < lifeState.lives ? 'fill-rose-500 text-rose-500' : 'text-slate-300'}`} />)}
            <span className="ml-1">{lifeState.lives}/{MAX_LIVES}</span>
          </div>
          <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500"><Clock3 className="h-3 w-3" />{lifeState.lives >= MAX_LIVES ? 'All lives ready' : `Next life in ${timeLabel}`}</p>
          <p className="mt-1 text-[10px] text-slate-400">One life recharges every 30 minutes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {gameButton('wordsearch', 'Word Search', 'Find the hidden word', '🔎')}
        {gameButton('scrabble', 'Scrabble Mix', 'Unscramble the letters', '🔤')}
        {gameButton('hangman', 'Hangman', 'Guess the secret word', '🪢')}
      </div>

      {!hasCurriculumBank ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center" role="status">
          <BookOpen className="mx-auto h-8 w-8 text-amber-600" />
          <h4 className="mt-2 font-black text-slate-900">Your next vocabulary pack is being prepared</h4>
          <p className="mt-1 text-sm text-slate-700">These games only use vocabulary verified for Level 1 · Unit 1. We’ll unlock the matching word bank when the curriculum for your current level and unit is ready.</p>
        </div>
      ) : isOutOfLives ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center">
          <Heart className="mx-auto h-8 w-8 text-rose-500" />
          <h4 className="mt-2 font-black text-slate-900">Your lives are recharging!</h4>
          <p className="mt-1 text-sm text-slate-600">Come back soon. One life returns every 30 minutes, and you can keep playing when it comes back.</p>
          <p className="mt-2 text-sm font-bold text-indigo-700">Next life in {timeLabel}</p>
        </div>
      ) : (
        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 sm:p-6">
          {activeGame === 'wordsearch' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2"><Search className="h-5 w-5 text-indigo-600" /><h4 className="font-black text-slate-900">Word Search</h4></div>
              <p className="text-sm text-slate-600">Find the word that means: <strong>{word.hint}</strong></p>
              <div className="mx-auto grid w-full max-w-sm grid-cols-8 gap-1 sm:gap-1.5">
                {grid.flatMap((row, r) => row.map((letter, c) => {
                  const key = `${r}-${c}`;
                  const selected = selectedLetters.includes(key);
                  return <button key={key} type="button" disabled={finished} aria-label={`Row ${r + 1}, column ${c + 1}, ${letter}`} onClick={() => setSelectedLetters(previous => selected ? previous.filter(item => item !== key) : [...previous, key])} className={`aspect-square min-w-0 rounded-lg border text-xs font-black sm:text-sm ${selected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-indigo-100'}`}>{letter}</button>;
                }))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-slate-500">Letters selected: {selectedLetters.map(key => { const [r, c] = key.split('-').map(Number); return grid[r][c]; }).join('')}</span>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setSelectedLetters([])} className="rounded-xl border px-3 py-2 text-xs font-bold text-slate-600"><RotateCcw className="mr-1 inline h-3 w-3" />Clear</button>
                  <button type="button" onClick={() => { const answer = selectedLetters.map(key => { const [r, c] = key.split('-').map(Number); return grid[r][c]; }).join(''); if (answer === word.word) winRound(); else failAttempt('Not quite! One life used. Select the letters in the right order.'); }} disabled={finished || selectedLetters.length === 0} className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-black text-white disabled:opacity-40">Check word</button>
                </div>
              </div>
            </div>
          )}

          {activeGame === 'scrabble' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-amber-500" /><h4 className="font-black text-slate-900">Scrabble Mix</h4></div>
              <p className="text-sm text-slate-600">Unscramble the letters to match: <strong>{word.hint}</strong></p>
              <div className="flex flex-wrap justify-center gap-2">
                {scrambled.split('').map((letter, index) => <span key={index} className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 font-black text-slate-900 shadow-sm">{letter}</span>)}
              </div>
              <form className="flex flex-col gap-2 sm:flex-row" onSubmit={event => { event.preventDefault(); checkScrabble(); }}>
                <input aria-label="Your word" value={scrabbleInput} onChange={event => setScrabbleInput(event.target.value)} disabled={finished} placeholder="Type the word in English..." className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm uppercase outline-none focus:border-indigo-500" />
                <button type="submit" disabled={finished || !scrabbleInput.trim()} className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-black text-white disabled:opacity-40">Check</button>
              </form>
            </div>
          )}

          {activeGame === 'hangman' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-emerald-600" /><h4 className="font-black text-slate-900">Hangman</h4></div>
              <p className="text-sm text-slate-600">Hint: <strong>{hangman.hint}</strong></p>
              <div className="flex flex-wrap justify-center gap-2 py-2">
                {hangman.word.split('').map((letter, index) => <span key={index} className="flex h-10 w-8 items-center justify-center border-b-2 border-indigo-400 text-lg font-black">{hangmanGuesses.includes(letter) || finished ? letter : '_'}</span>)}
              </div>
              <div className="mx-auto grid w-full max-w-md grid-cols-7 gap-1.5 sm:flex sm:flex-wrap sm:justify-center sm:gap-2">
                {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => <button key={letter} type="button" onClick={() => guessLetter(letter)} disabled={finished || hangmanGuesses.includes(letter)} className="min-h-10 min-w-0 rounded-lg border border-slate-200 px-1 text-sm sm:h-10 sm:w-10 sm:px-0 bg-slate-50 text-xs font-black text-slate-700 hover:bg-indigo-100 disabled:opacity-30">{letter}</button>)}
              </div>
              <p className="text-center text-xs text-slate-500">Wrong guesses use one life. Correct letters are free.</p>
            </div>
          )}

          {message && <div role="status" className={`mt-4 rounded-xl p-3 text-sm font-semibold ${finished ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>{message}</div>}
          {finished && <button type="button" onClick={nextRound} className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black text-white"><CheckCircle2 className="mr-1 inline h-4 w-4" />Play next challenge</button>}
        </div>
      )}
      <section aria-label="Cokitö learning signals" className="rounded-2xl border border-violet-100 bg-white p-4 sm:p-5">
        <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-violet-600" /><h4 className="font-black text-slate-900">Cokitö’s learning signals</h4></div>
        <p className="mt-1 text-xs text-slate-600">A first step toward evidence-based feedback: recent Arena answers are recorded by game and curriculum unit.</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          <div className="rounded-xl bg-emerald-50 p-3"><span className="block text-xs text-emerald-700">Correct answers</span><strong className="text-xl text-emerald-900">{correctSignals}</strong></div>
          <div className="rounded-xl bg-amber-50 p-3"><span className="block text-xs text-amber-700">Incorrect attempts</span><strong className="text-xl text-amber-900">{missedSignals}</strong></div>
          <div className="col-span-2 rounded-xl bg-violet-50 p-3 sm:col-span-1"><span className="block text-xs text-violet-700">Words to review</span><strong className="text-sm text-violet-900">{difficultWords[0]?.[0] || 'Keep exploring!'}</strong>{difficultWords[0] && <span className="block text-[11px] text-violet-700">{difficultWords[0][1]} missed attempt(s)</span>}</div>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">Privacy note: these learning signals are currently stored only in this browser, separately for each local profile. They are not yet sent to a central Cokitö analytics service or shared across devices.</p>
      </section>
      <p className="text-[11px] leading-relaxed text-slate-500">The games follow the current curriculum vocabulary pack (Level 1 · Unit 1 for now). Guests can play too. XP rewards are added only to an authenticated student account. Google-authenticated students sync lives and recharge time across devices; Guest and other local-only sessions keep lives on this browser.</p>
    </section>
  );
};
