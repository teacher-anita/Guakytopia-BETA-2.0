import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, Clock3, Heart, RotateCcw, Search, Sparkles, Swords, User, Compass } from 'lucide-react';
import { Student } from '../types';
import { saveArenaLives, subscribeToArenaLives } from '../services/db';

interface ArenaMiniGamesProps {
  currentStudent: Student | null;
  onAwardXp: (studentId: string, amount: number) => void;
  canSyncCloud: boolean;
}

export interface ArenaWordItem {
  word: string;
  hint: string;
  unit: number;
  level: string;
  category: string;
}

// ---------------------------------------------------------------------------
// 1. COMPLETE SUPER GOAL 1 VOCABULARY BANK (Units 1 - 6)
// Available to all guests across all units, and targeted for Level 1 students
// ---------------------------------------------------------------------------
export const SUPER_GOAL_1_WORDS: ArenaWordItem[] = [
  // Unit 1: What's Your Name? / Classroom & Greetings
  { word: 'HELLO', hint: 'A common friendly greeting when you meet someone', unit: 1, level: 'level_1', category: 'Greetings' },
  { word: 'NAME', hint: 'What people call you in English', unit: 1, level: 'level_1', category: 'Basics' },
  { word: 'FRIEND', hint: 'Someone you like and know well', unit: 1, level: 'level_1', category: 'Relationships' },
  { word: 'TEACHER', hint: 'A person who instructs and guides a class', unit: 1, level: 'level_1', category: 'School' },
  { word: 'STUDENT', hint: 'A person who attends school or academy to learn', unit: 1, level: 'level_1', category: 'School' },
  { word: 'MORNING', hint: 'The early part of the day after sunrise', unit: 1, level: 'level_1', category: 'Greetings' },
  { word: 'EVENING', hint: 'The end of the day before nightfall', unit: 1, level: 'level_1', category: 'Greetings' },
  { word: 'CLASSROOM', hint: 'A room in a school where lessons take place', unit: 1, level: 'level_1', category: 'School' },
  { word: 'BACKPACK', hint: 'A bag carried on the back for school supplies', unit: 1, level: 'level_1', category: 'Supplies' },
  { word: 'NOTEBOOK', hint: 'A book with lined pages for writing notes', unit: 1, level: 'level_1', category: 'Supplies' },
  { word: 'PENCIL', hint: 'An instrument used for writing with graphite', unit: 1, level: 'level_1', category: 'Supplies' },
  { word: 'ERASER', hint: 'A small rubber item used to remove pencil marks', unit: 1, level: 'level_1', category: 'Supplies' },
  { word: 'SCISSORS', hint: 'A cutting tool with two crossed blades', unit: 1, level: 'level_1', category: 'Supplies' },
  { word: 'ALPHABET', hint: 'The 26 English letters from A to Z', unit: 1, level: 'level_1', category: 'Basics' },

  // Unit 2: Is It A Rabbit? / Pets, Animals & Colors
  { word: 'PARROT', hint: 'A colorful tropical bird with a curved beak (like Güaky!)', unit: 2, level: 'level_1', category: 'Animals' },
  { word: 'RABBIT', hint: 'A small furry animal with long ears that hops', unit: 2, level: 'level_1', category: 'Animals' },
  { word: 'TURTLE', hint: 'A slow reptile that carries a hard shell', unit: 2, level: 'level_1', category: 'Animals' },
  { word: 'PUPPY', hint: 'A playful baby dog', unit: 2, level: 'level_1', category: 'Animals' },
  { word: 'KITTEN', hint: 'A young baby cat', unit: 2, level: 'level_1', category: 'Animals' },
  { word: 'HAMSTER', hint: 'A small furry pet rodent with large cheek pouches', unit: 2, level: 'level_1', category: 'Animals' },
  { word: 'GOLDFISH', hint: 'A small bright orange fish kept in an aquarium bowl', unit: 2, level: 'level_1', category: 'Animals' },
  { word: 'LIZARD', hint: 'A small scaly reptile with four legs and a long tail', unit: 2, level: 'level_1', category: 'Animals' },
  { word: 'YELLOW', hint: 'The bright sunny color of ripe lemons and bananas', unit: 2, level: 'level_1', category: 'Colors' },
  { word: 'ORANGE', hint: 'The warm citrus color between red and yellow', unit: 2, level: 'level_1', category: 'Colors' },
  { word: 'PURPLE', hint: 'A vibrant color made by mixing red and blue', unit: 2, level: 'level_1', category: 'Colors' },
  { word: 'FRIENDLY', hint: 'Behaving in a kind, welcoming and pleasant manner', unit: 2, level: 'level_1', category: 'Adjectives' },
  { word: 'PLAYFUL', hint: 'Full of lively fun and energetic games', unit: 2, level: 'level_1', category: 'Adjectives' },

  // Unit 3: Where Do You Live? / City, Buildings & Transportation
  { word: 'APARTMENT', hint: 'A set of rooms forming a home inside a larger building', unit: 3, level: 'level_1', category: 'Housing' },
  { word: 'STREET', hint: 'A public paved road in a city with buildings on each side', unit: 3, level: 'level_1', category: 'City' },
  { word: 'AVENUE', hint: 'A broad urban boulevard often lined with trees', unit: 3, level: 'level_1', category: 'City' },
  { word: 'MUSEUM', hint: 'A building displaying historical, artistic or scientific works', unit: 3, level: 'level_1', category: 'Places' },
  { word: 'HOSPITAL', hint: 'A medical facility providing treatment for patients', unit: 3, level: 'level_1', category: 'Places' },
  { word: 'AIRPORT', hint: 'A runway complex where airplanes take off and land', unit: 3, level: 'level_1', category: 'Transport' },
  { word: 'SUBWAY', hint: 'An underground passenger rail network in a city', unit: 3, level: 'level_1', category: 'Transport' },
  { word: 'BICYCLE', hint: 'A two-wheeled vehicle driven by pedals and handlebars', unit: 3, level: 'level_1', category: 'Transport' },
  { word: 'RESTAURANT', hint: 'A public business where meals are prepared and served', unit: 3, level: 'level_1', category: 'Places' },
  { word: 'LIBRARY', hint: 'A quiet place where books are kept for reading and study', unit: 3, level: 'level_1', category: 'Places' },
  { word: 'NEIGHBOR', hint: 'Someone who lives next door or close to your home', unit: 3, level: 'level_1', category: 'Community' },

  // Unit 4: Favorite Things, Sports & Hobbies
  { word: 'GUITAR', hint: 'A musical instrument with six strings strummed with fingers', unit: 4, level: 'level_1', category: 'Hobbies' },
  { word: 'SOCCER', hint: 'The most popular sport played with a round ball and goals', unit: 4, level: 'level_1', category: 'Sports' },
  { word: 'TENNIS', hint: 'A sport where players use strung rackets to hit a green ball', unit: 4, level: 'level_1', category: 'Sports' },
  { word: 'BASKETBALL', hint: 'A game played by bouncing and tossing a ball into a hoop', unit: 4, level: 'level_1', category: 'Sports' },
  { word: 'CAMERA', hint: 'An optical device used to capture photographs and videos', unit: 4, level: 'level_1', category: 'Hobbies' },
  { word: 'SKATEBOARD', hint: 'A short wooden deck mounted on four wheels for riding', unit: 4, level: 'level_1', category: 'Hobbies' },
  { word: 'SWIMMING', hint: 'The sport of moving through water using your arms and legs', unit: 4, level: 'level_1', category: 'Sports' },
  { word: 'PAINTING', hint: 'The creative art of applying pigments to a canvas', unit: 4, level: 'level_1', category: 'Hobbies' },
  { word: 'SNEAKERS', hint: 'Comfortable rubber-soled athletic shoes for sports and walking', unit: 4, level: 'level_1', category: 'Clothes' },

  // Unit 5: Family & People
  { word: 'FATHER', hint: 'A male parent', unit: 5, level: 'level_1', category: 'Family' },
  { word: 'MOTHER', hint: 'A female parent', unit: 5, level: 'level_1', category: 'Family' },
  { word: 'BROTHER', hint: 'A boy or man who has the same parents as you', unit: 5, level: 'level_1', category: 'Family' },
  { word: 'SISTER', hint: 'A girl or woman who has the same parents as you', unit: 5, level: 'level_1', category: 'Family' },
  { word: 'COUSIN', hint: 'The son or daughter of your aunt and uncle', unit: 5, level: 'level_1', category: 'Family' },
  { word: 'DOCTOR', hint: 'A qualified professional who practices medical treatment', unit: 5, level: 'level_1', category: 'Professions' },
  { word: 'PILOT', hint: 'A licensed person trained to fly an aircraft', unit: 5, level: 'level_1', category: 'Professions' },
  { word: 'CHEERFUL', hint: 'Noticeably happy, upbeat and showing high spirits', unit: 5, level: 'level_1', category: 'Personality' },

  // Unit 6: Clothes & Weather
  { word: 'JACKET', hint: 'A short coat worn for extra warmth outdoors', unit: 6, level: 'level_1', category: 'Clothes' },
  { word: 'SHOES', hint: 'Sturdy coverings worn on your feet for protection', unit: 6, level: 'level_1', category: 'Clothes' },
  { word: 'PANTS', hint: 'Clothing that covers both legs separately from waist to ankle', unit: 6, level: 'level_1', category: 'Clothes' },
  { word: 'SCARF', hint: 'A strip of warm wool or fabric worn around the neck', unit: 6, level: 'level_1', category: 'Clothes' },
  { word: 'BOOTS', hint: 'Heavy, water-resistant footwear covering foot and lower leg', unit: 6, level: 'level_1', category: 'Clothes' },
  { word: 'UMBRELLA', hint: 'A foldable fabric dome used to shelter against rainfall', unit: 6, level: 'level_1', category: 'Weather' },
  { word: 'SUNNY', hint: 'Bright and full of warm sunlight with few clouds', unit: 6, level: 'level_1', category: 'Weather' },
  { word: 'RAINY', hint: 'Accompanied by falling rain and wet overcast weather', unit: 6, level: 'level_1', category: 'Weather' },
  { word: 'WINDY', hint: 'Characterized by strong currents of moving outdoor air', unit: 6, level: 'level_1', category: 'Weather' },
  { word: 'WINTER', hint: 'The coldest season of the year with snow and frost', unit: 6, level: 'level_1', category: 'Seasons' },
  { word: 'SUMMER', hint: 'The warmest season of the year with the longest daylight', unit: 6, level: 'level_1', category: 'Seasons' }
];

// ---------------------------------------------------------------------------
// 2. HIGHER LEVEL VOCABULARY (Super Goal 2, 3 and MegaGoal)
// ---------------------------------------------------------------------------
export const HIGHER_LEVEL_WORDS: ArenaWordItem[] = [
  // Super Goal 2 (Level 2)
  { word: 'VACATION', hint: 'A period of leisure travel and rest away from work', unit: 1, level: 'level_2', category: 'Travel' },
  { word: 'PASSPORT', hint: 'An official government document certifying national identity for travel', unit: 1, level: 'level_2', category: 'Travel' },
  { word: 'LUGGAGE', hint: 'Suitcases and bags packed for a trip', unit: 1, level: 'level_2', category: 'Travel' },
  { word: 'SOUVENIR', hint: 'A keepsake memento bought to remember a place visited', unit: 1, level: 'level_2', category: 'Travel' },
  { word: 'HOTEL', hint: 'An establishment providing paid lodging on a short-term basis', unit: 2, level: 'level_2', category: 'Travel' },
  { word: 'ADVENTURE', hint: 'An unusual, exciting or daring expedition', unit: 2, level: 'level_2', category: 'Experience' },

  // Super Goal 3 (Level 3)
  { word: 'ARCHITECT', hint: 'A professional who designs blueprints for buildings', unit: 1, level: 'level_3', category: 'Careers' },
  { word: 'JOURNALIST', hint: 'A writer who investigates and reports news stories', unit: 1, level: 'level_3', category: 'Careers' },
  { word: 'INNOVATION', hint: 'A brand-new method, idea or technological breakthrough', unit: 2, level: 'level_3', category: 'Science' },
  { word: 'DISCOVERY', hint: 'The act of finding something unknown before', unit: 2, level: 'level_3', category: 'Science' }
];

export const ALL_CURRICULUM_WORDS: ArenaWordItem[] = [
  ...SUPER_GOAL_1_WORDS,
  ...HIGHER_LEVEL_WORDS
];

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
  const isGuest = !currentStudent || currentStudent.id === 'guest';
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

  // -------------------------------------------------------------------------
  // VOCABULARY RESOLUTION RULES:
  // - Guest (Not logged in): Full Super Goal 1 vocabulary (All 6 units!)
  // - Logged-in Student: Strictly limited and focused to their active level/unit
  // -------------------------------------------------------------------------
  const { words, poolTitle, poolSubtitle } = useMemo(() => {
    if (isGuest) {
      return {
        words: SUPER_GOAL_1_WORDS,
        poolTitle: 'Super Goal 1 (Complete Book · Units 1–6)',
        poolSubtitle: 'Guest Mode: You have unlocked all 60+ curriculum vocabulary words from Super Goal 1!'
      };
    }

    const studentLevel = currentStudent.levelId || 'level_1';
    const studentUnit = currentStudent.currentUnit || 1;

    // Filter by student's active level & unit
    const unitWords = ALL_CURRICULUM_WORDS.filter(w => 
      w.level === studentLevel && w.unit === studentUnit
    );

    if (unitWords.length >= 4) {
      return {
        words: unitWords,
        poolTitle: `Level ${studentLevel.replace('level_', '')} · Unit ${studentUnit} Focused Pack`,
        poolSubtitle: `Active student profile: practice is tailored exclusively to your current lesson.`
      };
    }

    // Filter by student level
    const levelWords = ALL_CURRICULUM_WORDS.filter(w => w.level === studentLevel);
    if (levelWords.length >= 4) {
      return {
        words: levelWords,
        poolTitle: `Level ${studentLevel.replace('level_', '')} Complete Pack`,
        poolSubtitle: `Active student profile: practicing vocabulary from your current curriculum book.`
      };
    }

    // Fallback: Level 1 Unit 1
    const unit1Words = SUPER_GOAL_1_WORDS.filter(w => w.unit === 1);
    return {
      words: unit1Words,
      poolTitle: 'Super Goal 1 · Unit 1 Focused Pack',
      poolSubtitle: `Active student profile: practicing Unit 1 essentials.`
    };
  }, [isGuest, currentStudent]);

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

  const word = words[round % words.length] || words[0];
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
      unit: `unit_${word.unit}`,
      at: Date.now()
    }].slice(-MAX_LEARNING_SIGNALS));
  };

  const winRound = (xp = 10) => {
    if (finished) return;
    recordLearningSignal(true, word.word);
    setFinished(true);
    setMessage(`Brilliant! +${xp} XP. You spelled it correctly! 🎉`);
    if (currentStudent && currentStudent.id !== 'guest') onAwardXp(currentStudent.id, xp);
  };

  const failAttempt = (text: string) => {
    recordLearningSignal(false, word.word);
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
    const answer = selectedLetters.map(key => { 
      const [r, c] = key.split('-').map(Number); 
      return grid[r][c]; 
    }).join('');

    if (answer === word.word) {
      winRound(10);
    } else {
      failAttempt('Not quite! One life used. Select the letters in the correct order.');
    }
  };

  const checkScrabble = () => {
    if (scrabbleInput.trim().toUpperCase() === word.word) {
      winRound(12);
    } else {
      failAttempt('Not that word! One life used. Rearrange the letters and try again.');
    }
  };

  const guessLetter = (letter: string) => {
    if (finished || hangmanGuesses.includes(letter)) return;
    const guesses = [...hangmanGuesses, letter];
    setHangmanGuesses(guesses);
    if (!word.word.includes(letter)) {
      recordLearningSignal(false, word.word);
      consumeLife();
      setMessage('Miss! One life used.');
      return;
    }
    if (word.word.split('').every(char => guesses.includes(char))) {
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
    <button
      key={id}
      type="button"
      onClick={() => chooseGame(id)}
      className={`rounded-2xl border p-3.5 text-left transition-all ${
        activeGame === id
          ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200 shadow-xs'
          : 'border-slate-200 bg-white hover:border-indigo-300'
      }`}
    >
      <span className="text-2xl">{emoji}</span>
      <span className="mt-1 block text-sm font-black text-slate-900">{title}</span>
      <span className="block text-[11px] text-slate-500">{subtitle}</span>
    </button>
  );

  return (
    <section className="w-full min-w-0 space-y-6 rounded-3xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/40 to-amber-50/50 p-4 sm:p-7 shadow-sm">
      
      {/* Top Bar: Title & Vocabulary Mode Badge */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600">
            <Swords className="h-4 w-4" />
            <span>The Flock Arcade • English Only</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            Play, Learn & Build Vocabulary
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            {poolSubtitle}
          </p>

          {/* Mode Pill Badge */}
          <div className="pt-1 flex items-center gap-2">
            {isGuest ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold shadow-2xs">
                <Compass className="w-3.5 h-3.5 text-amber-600" />
                <span>🌐 {poolTitle}</span>
                <span className="bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full text-[10px]">60+ Words</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-950 border border-emerald-300 rounded-full text-xs font-bold shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>🎯 {currentStudent.name}: {poolTitle}</span>
              </span>
            )}
          </div>
        </div>

        {/* Lives Counter */}
        <div className="w-full rounded-2xl border border-rose-100 bg-white px-4 py-3.5 shadow-sm sm:w-auto">
          <div className="flex items-center justify-between sm:justify-start gap-2 text-sm font-black text-slate-900">
            <div className="flex items-center gap-1">
              {Array.from({ length: MAX_LIVES }, (_, i) => (
                <Heart
                  key={i}
                  className={`h-4 w-4 ${i < lifeState.lives ? 'fill-rose-500 text-rose-500' : 'text-slate-300'}`}
                />
              ))}
            </div>
            <span className="ml-1 text-rose-600">{lifeState.lives}/{MAX_LIVES}</span>
          </div>
          <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
            <Clock3 className="h-3 w-3 text-indigo-500" />
            <span>{lifeState.lives >= MAX_LIVES ? 'All 5 lives ready' : `Next life in ${timeLabel}`}</span>
          </p>
          <p className="mt-0.5 text-[10px] text-slate-400">One life recovers every 30 minutes.</p>
        </div>
      </div>

      {/* Game Selector Buttons */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {gameButton('wordsearch', 'Word Search', 'Find the letters in order', '🔎')}
        {gameButton('scrabble', 'Scrabble Mix', 'Unscramble the letters', '🔤')}
        {gameButton('hangman', 'Hangman', 'Guess the hidden letters', '🪢')}
      </div>

      {/* Main Game Card */}
      {isOutOfLives ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center space-y-2">
          <Heart className="mx-auto h-9 w-9 text-rose-500 animate-pulse" />
          <h4 className="font-black text-slate-900 text-base">Your lives are recharging!</h4>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Take a breather or review your vocabulary. One life recharges every 30 minutes, or you can practice in the Lab drills!
          </p>
          <p className="text-sm font-black text-indigo-700">Next life in: {timeLabel}</p>
        </div>
      ) : (
        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-7 shadow-xs">
          
          {/* Active Word Info Pill */}
          <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-slate-100 text-xs">
            <span className="font-bold text-slate-500">
              Category: <strong className="text-indigo-600">{word.category}</strong> (Unit {word.unit})
            </span>
            <span className="text-slate-400 font-mono">Round #{round + 1}</span>
          </div>

          {/* 1. WORD SEARCH */}
          {activeGame === 'wordsearch' && (
            <div className="space-y-5 pt-3">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-indigo-600" />
                <h4 className="font-black text-slate-900 text-base">Word Search</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Find the English word that means: <strong className="text-slate-900 font-bold">{word.hint}</strong> ({word.word.length} letters)
              </p>

              {/* Grid */}
              <div className="mx-auto grid w-full max-w-sm grid-cols-8 gap-1 sm:gap-1.5 p-2 bg-slate-50 rounded-2xl border border-slate-200">
                {grid.flatMap((row, r) => row.map((letter, c) => {
                  const key = `${r}-${c}`;
                  const selected = selectedLetters.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={finished}
                      aria-label={`Row ${r + 1}, column ${c + 1}, ${letter}`}
                      onClick={() => setSelectedLetters(prev => 
                        selected ? prev.filter(item => item !== key) : [...prev, key]
                      )}
                      className={`aspect-square min-w-0 rounded-xl border text-xs sm:text-sm font-black transition-all ${
                        selected
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs scale-105'
                          : 'border-slate-200 bg-white text-slate-800 hover:bg-indigo-100'
                      }`}
                    >
                      {letter}
                    </button>
                  );
                }))}
              </div>

              {/* Selected letters & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <span className="text-xs text-slate-600 font-mono">
                  Selected letters: <strong className="text-indigo-600 text-sm">{selectedLetters.map(key => { const [r, c] = key.split('-').map(Number); return grid[r][c]; }).join('') || '(none)'}</strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedLetters([])}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    <RotateCcw className="mr-1 inline h-3 w-3" /> Clear
                  </button>
                  <button
                    type="button"
                    onClick={checkWordSearch}
                    disabled={finished || selectedLetters.length === 0}
                    className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-black text-white hover:bg-indigo-700 disabled:opacity-40 shadow-xs"
                  >
                    Check Word
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. SCRABBLE MIX */}
          {activeGame === 'scrabble' && (
            <div className="space-y-5 pt-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <h4 className="font-black text-slate-900 text-base">Scrabble Mix</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Unscramble the letters to match: <strong className="text-slate-900 font-bold">{word.hint}</strong>
              </p>

              {/* Scrambled letter tiles */}
              <div className="flex flex-wrap justify-center gap-2 py-2">
                {scrambled.split('').map((letter, index) => (
                  <span
                    key={index}
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-amber-300 bg-gradient-to-b from-amber-50 to-amber-100 font-black text-slate-900 text-lg shadow-sm"
                  >
                    {letter}
                  </span>
                ))}
              </div>

              <form
                className="flex flex-col gap-2 sm:flex-row max-w-md mx-auto"
                onSubmit={e => { e.preventDefault(); checkScrabble(); }}
              >
                <input
                  aria-label="Your unscrambled word"
                  value={scrabbleInput}
                  onChange={e => setScrabbleInput(e.target.value)}
                  disabled={finished}
                  placeholder="Type word in English..."
                  className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm uppercase font-mono tracking-widest outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                <button
                  type="submit"
                  disabled={finished || !scrabbleInput.trim()}
                  className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-black text-white hover:bg-indigo-700 disabled:opacity-40 shadow-xs"
                >
                  Submit
                </button>
              </form>
            </div>
          )}

          {/* 3. HANGMAN */}
          {activeGame === 'hangman' && (
            <div className="space-y-5 pt-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-600" />
                <h4 className="font-black text-slate-900 text-base">Hangman Challenge</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Hint: <strong className="text-slate-900 font-bold">{word.hint}</strong>
              </p>

              {/* Secret blanks */}
              <div className="flex flex-wrap justify-center gap-2.5 py-4">
                {word.word.split('').map((letter, index) => (
                  <span
                    key={index}
                    className="flex h-12 w-9 items-center justify-center border-b-3 border-indigo-600 text-xl font-black text-slate-900 bg-slate-50 rounded-t-lg"
                  >
                    {hangmanGuesses.includes(letter) || finished ? letter : '_'}
                  </span>
                ))}
              </div>

              {/* Keyboard letters */}
              <div className="mx-auto grid w-full max-w-lg grid-cols-7 gap-1.5 sm:gap-2">
                {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => {
                  const used = hangmanGuesses.includes(letter);
                  const inWord = word.word.includes(letter);
                  return (
                    <button
                      key={letter}
                      type="button"
                      onClick={() => guessLetter(letter)}
                      disabled={finished || used}
                      className={`h-10 min-w-0 rounded-xl border text-xs sm:text-sm font-black transition-all ${
                        used
                          ? inWord
                            ? 'bg-emerald-500 text-white border-emerald-600'
                            : 'bg-slate-200 text-slate-400 border-slate-200 opacity-40 cursor-not-allowed'
                          : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-indigo-100 hover:border-indigo-300'
                      }`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
              <p className="text-center text-xs text-slate-500">
                Wrong guesses consume one life. Correct letters reveal the word for free.
              </p>
            </div>
          )}

          {/* Result message */}
          {message && (
            <div
              role="status"
              className={`mt-4 rounded-xl p-3.5 text-xs sm:text-sm font-bold text-center animate-fadeIn ${
                finished ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              {message}
            </div>
          )}

          {finished && (
            <button
              type="button"
              onClick={nextRound}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-4 py-3.5 text-sm font-black text-white shadow-md transition-transform hover:scale-101 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="h-5 w-5" />
              <span>Next Word Challenge &rarr;</span>
            </button>
          )}

        </div>
      )}

      {/* Cokitö Learning Signals & Analytics */}
      <section aria-label="Cokitö learning signals" className="rounded-2xl border border-violet-100 bg-white p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-600" />
          <h4 className="font-black text-slate-900 text-sm">Cokitö Learning Signals (Evidence-Based Practice)</h4>
        </div>
        <p className="text-xs text-slate-600">
          Your game answers provide learning signals to track vocabulary retention and difficult words.
        </p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <div className="rounded-xl bg-emerald-50 p-3 border border-emerald-100">
            <span className="block text-xs text-emerald-700 font-medium">Correct words</span>
            <strong className="text-xl font-black text-emerald-900">{correctSignals}</strong>
          </div>
          <div className="rounded-xl bg-amber-50 p-3 border border-amber-100">
            <span className="block text-xs text-amber-700 font-medium">Incorrect attempts</span>
            <strong className="text-xl font-black text-amber-900">{missedSignals}</strong>
          </div>
          <div className="col-span-2 rounded-xl bg-violet-50 p-3 border border-violet-100 sm:col-span-1">
            <span className="block text-xs text-violet-700 font-medium">Word to review</span>
            <strong className="text-sm font-black text-violet-900">{difficultWords[0]?.[0] || 'Keep exploring!'}</strong>
            {difficultWords[0] && <span className="block text-[10px] text-violet-600">{difficultWords[0][1]} missed attempt(s)</span>}
          </div>
        </div>
      </section>

    </section>
  );
};
