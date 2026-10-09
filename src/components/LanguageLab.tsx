import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Volume2, 
  Play, 
  Pause, 
  RotateCcw, 
  Award, 
  Zap, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  Lock, 
  Unlock, 
  BookOpen, 
  Filter, 
  Search, 
  ListOrdered, 
  Check, 
  Info,
  Flame,
  Star,
  Compass,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student } from '../types';
import { User } from 'firebase/auth';
import { 
  LAB_STATIONS, 
  UNIT_1_LAB_EXERCISES, 
  LabExercise 
} from '../data/labExercisesData';

interface LanguageLabProps {
  currentStudent: Student | null;
  activeRole: 'student' | 'teacher';
  user?: User | null;
  isTeacherAuthenticated?: boolean;
  onAwardXp: (studentId: string, amount: number) => void;
  onGoToClassroom?: () => void;
  onLogin?: () => void;
  onStartRegistration?: () => void;
}

export const LanguageLab: React.FC<LanguageLabProps> = ({
  currentStudent,
  activeRole,
  user,
  isTeacherAuthenticated,
  onAwardXp,
  onGoToClassroom,
  onLogin,
  onStartRegistration
}) => {
  const isUnlocked = isTeacherAuthenticated || !!user;

  // Persistence key for student answers
  const storageKey = `cokito_lab_u1_${currentStudent?.id || 'guest'}`;

  // Current active unit (Unit 1 is active, Unit 2+ locked for demonstration of progression)
  const [selectedUnit, setSelectedUnit] = useState<number>(1);

  // Filter by Station or All
  const [activeStationFilter, setActiveStationFilter] = useState<string>('all');

  // Currently focused exercise index (0-based)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);

  // Student answers mapping: { [exerciseId]: { selectedAnswer: string, isCorrect: boolean } }
  const [userAnswers, setUserAnswers] = useState<Record<number, { selectedAnswer: string; isCorrect: boolean }>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Selected option before submitting (for current exercise)
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Audio playing state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // View mode: 'card' (one-by-one marathon) vs 'grid' (all 100 overview)
  const [viewMode, setViewMode] = useState<'card' | 'grid'>('card');

  // Search filter
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Save progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(userAnswers));
    } catch (e) {
      console.warn('Could not persist lab answers', e);
    }
  }, [userAnswers, storageKey]);

  // Filtered exercises based on station and search query
  const filteredExercises = UNIT_1_LAB_EXERCISES.filter(ex => {
    const matchesStation = activeStationFilter === 'all' || ex.stationId === activeStationFilter;
    const matchesSearch = !searchQuery || 
      ex.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.instruction.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.id.toString() === searchQuery.trim();
    return matchesStation && matchesSearch;
  });

  const activeExercise = filteredExercises[currentExerciseIndex] || filteredExercises[0] || UNIT_1_LAB_EXERCISES[0];

  // Sync selectedOption when active exercise changes
  useEffect(() => {
    if (activeExercise && userAnswers[activeExercise.id]) {
      setSelectedOption(userAnswers[activeExercise.id].selectedAnswer);
      setShowExplanation(true);
    } else {
      setSelectedOption('');
      setShowExplanation(false);
      setShowHint(false);
    }
    // Stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
  }, [activeExercise?.id, userAnswers]);

  // Overall statistics
  const totalCompleted = Object.keys(userAnswers).length;
  const totalCorrect = Object.values(userAnswers).filter(a => a.isCorrect).length;
  const progressPercent = Math.round((totalCorrect / UNIT_1_LAB_EXERCISES.length) * 100);

  // Station-based stats
  const getStationProgress = (stationId: string) => {
    const stationEx = UNIT_1_LAB_EXERCISES.filter(e => e.stationId === stationId);
    const completed = stationEx.filter(e => userAnswers[e.id]?.isCorrect).length;
    return {
      completed,
      total: stationEx.length,
      percent: Math.round((completed / stationEx.length) * 100)
    };
  };

  // Submit Answer
  const handleCheckAnswer = (optionToSubmit?: string) => {
    const answer = (optionToSubmit || selectedOption).trim();
    if (!answer) return;

    const isCorrect = answer.toLowerCase() === activeExercise.correctAnswer.toLowerCase();

    const wasAlreadyCorrect = userAnswers[activeExercise.id]?.isCorrect;

    setUserAnswers(prev => ({
      ...prev,
      [activeExercise.id]: {
        selectedAnswer: answer,
        isCorrect
      }
    }));
    setShowExplanation(true);

    if (isCorrect) {
      if (!wasAlreadyCorrect) {
        if (currentStudent) {
          onAwardXp(currentStudent.id, 10);
        }
      }

      // Check if all 100 completed!
      if (totalCorrect + 1 === 100) {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 }
        });
      }
    }
  };

  // Play audio track or pronunciation text
  const handlePlayAudio = () => {
    if (isPlayingAudio && audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
      return;
    }

    if (activeExercise.audioTrackSrc) {
      if (!audioRef.current) {
        audioRef.current = new Audio(activeExercise.audioTrackSrc);
      } else {
        audioRef.current.src = activeExercise.audioTrackSrc;
      }

      // Parse timestamp if available, e.g. "0:13"
      if (activeExercise.audioTimestamp) {
        const parts = activeExercise.audioTimestamp.split(':');
        if (parts.length === 2) {
          const seconds = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
          audioRef.current.currentTime = seconds;
        }
      }

      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch(err => {
        console.warn('Audio play failed, falling back to speech synthesis', err);
        fallbackSpeech();
      });

      audioRef.current.onended = () => {
        setIsPlayingAudio(false);
      };
    } else {
      fallbackSpeech();
    }
  };

  const fallbackSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = activeExercise.ttsText || activeExercise.prompt;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentExerciseIndex < filteredExercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    }
  };

  // Reset drill
  const handleResetCurrent = () => {
    setUserAnswers(prev => {
      const next = { ...prev };
      delete next[activeExercise.id];
      return next;
    });
    setSelectedOption('');
    setShowExplanation(false);
    setShowHint(false);
  };

  // IF NOT AUTHENTICATED: SHOW LOCKED GATE WITH CANDADITO (BENEFICIO DE AFILIACIÓN)
  if (!isUnlocked) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 space-y-8 animate-fadeIn">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white border-2 border-amber-400/40 shadow-2xl text-center space-y-6 relative overflow-hidden">
          
          <div className="w-20 h-20 rounded-3xl bg-amber-400/20 border-2 border-amber-400/60 text-amber-300 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/10">
            <Lock className="w-10 h-10 text-amber-400" />
          </div>

          <div className="space-y-3 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFD166]/15 border border-[#FFD166]/40 text-[#FFD166] text-xs font-black uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5 text-[#FFD166]" />
              <span>Güakytalkie • Beneficio de Afiliación</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Güakytalkie • Laboratorio de Idiomas
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              La capa de comunicación de <strong>Güakytopia</strong> con 100 ejercicios de speaking, audios de pronunciación nativa y estaciones de entrenamiento oral para soltar la lengua con confianza.
            </p>
          </div>

          <div className="p-5 sm:p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 max-w-lg mx-auto text-left text-xs space-y-3 shadow-inner">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
              <span className="text-sm">¿Qué desbloqueas al iniciar sesión?</span>
            </div>
            <ul className="space-y-2.5 text-slate-200">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>100 Ejercicios de Alto Rendimiento:</strong> Greetings, verb BE, preguntas WH y gramática aplicada.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Audios Nativos Oficiales:</strong> Reproducción integrada de los tracks de McGraw-Hill con velocidad ajustable.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Guardado de Progreso y XP:</strong> Tus respuestas se registran y acumulan puntos para tu racha académica.</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            {onLogin && (
              <button
                onClick={onLogin}
                className="w-full sm:w-auto px-8 py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black text-sm shadow-xl transition-all hover:scale-102 flex items-center justify-center gap-2.5"
              >
                <Lock className="w-4 h-4 text-slate-950" />
                <span>Iniciar Sesión para Abrir el Candadito</span>
              </button>
            )}

            {onStartRegistration && (
              <button
                onClick={onStartRegistration}
                className="w-full sm:w-auto px-6 py-4 bg-white/15 hover:bg-white/25 text-white border border-white/20 rounded-2xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Afiliarme en Cokitö Academy</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-8 animate-fadeIn">
      
      {/* 1. HERO HEADER: THE LANGUAGE LAB (LABORATORIO) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 p-6 sm:p-8 text-white shadow-xl border border-indigo-900/60">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Cokitö Interactive Language Lab
              </span>
              <span className="bg-[#2EC4B6]/20 text-[#2EC4B6] border border-[#2EC4B6]/30 text-xs font-bold px-3 py-1 rounded-full">
                📻 Güakytalkie • 100 High-Yield Practice Drills
              </span>
              <span className="bg-blue-500/20 text-blue-200 border border-blue-500/30 text-xs font-bold px-3 py-1 rounded-full">
                Super Goal 1 • Unit 1
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Güakytalkie • Communication & Speaking Lab
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Step into the communication arena. Practice greetings, conversation, contractions, audio listening, and pronunciation with instant feedback.
            </p>

            {/* DUAL PATHWAY EXPLANATION NOTICE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>Private Students (Clases con Teacher Cokitö)</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Your primary advancement is through your 3 live Google Meet classes and physical book/workbook submissions. The Lab is <strong>optional enrichment</strong> so you don't feel overloaded!
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center gap-2 text-emerald-300 font-bold">
                  <Zap className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                  <span>Self-Paced Digital Students (Pase Digital)</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  The platform acts 100% as your virtual teacher! Completing these 100 drills certifies your unit mastery, unlocks achievements, and levels you up.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Mastery Trophy & Progress Radial */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 w-full lg:w-72 shrink-0 space-y-4 text-center">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>Unit 1 Lab Progress</span>
              <span className="font-mono text-emerald-300 font-bold">{totalCorrect}/100 Completed</span>
            </div>

            {/* Big Progress Bar */}
            <div className="w-full bg-slate-800/80 rounded-full h-4 p-0.5 border border-white/20 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-around text-xs pt-1">
              <div>
                <span className="block text-xl font-black text-amber-400">{progressPercent}%</span>
                <span className="text-[11px] text-slate-400 uppercase font-bold">Mastery</span>
              </div>
              <div className="h-8 w-px bg-white/15" />
              <div>
                <span className="block text-xl font-black text-emerald-400">+{totalCorrect * 10}</span>
                <span className="text-[11px] text-slate-400 uppercase font-bold">XP Earned</span>
              </div>
            </div>

            {totalCorrect === 100 ? (
              <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 animate-bounce">
                <Award className="w-4 h-4" />
                <span>🏆 Unit 1 Lab Master Champion!</span>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400">
                {100 - totalCorrect} exercises remaining to complete the lab!
              </p>
            )}
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. PROGRESSIVE UNIT ROADMAP (Progress-Based Unlock) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              <span>Unit Lab Progression (Desbloqueo por Progreso)</span>
            </h2>
            <p className="text-xs text-slate-500">
              As you advance, units unlock automatically. Past completed units remain accessible for practice anytime.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-800 font-bold rounded-lg border border-indigo-200">
              Level 1 • Module 1
            </span>
          </div>
        </div>

        {/* Units Horizontal Carousel */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          
          {/* Unit 1: ACTIVE & UNLOCKED */}
          <button
            onClick={() => setSelectedUnit(1)}
            className={`p-3 rounded-2xl border text-left transition-all relative ${
              selectedUnit === 1
                ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-300'
                : 'bg-indigo-50/70 hover:bg-indigo-100 text-indigo-950 border-indigo-200'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-black uppercase mb-1">
              <span>Unit 1</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${selectedUnit === 1 ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                Active
              </span>
            </div>
            <div className="font-bold text-xs truncate">Good Morning!</div>
            <div className={`text-[10px] mt-2 flex items-center gap-1 ${selectedUnit === 1 ? 'text-indigo-200' : 'text-slate-500'}`}>
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>{totalCorrect}/100 Drills</span>
            </div>
          </button>

          {/* Unit 2: Locked */}
          <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50/80 text-slate-400 text-left relative opacity-75">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase mb-1">
              <span>Unit 2</span>
              <Lock className="w-3 h-3 text-slate-400" />
            </div>
            <div className="font-semibold text-xs truncate">What Day Is Today?</div>
            <div className="text-[10px] mt-2 text-slate-400">100 Drills • Locked</div>
          </div>

          {/* Unit 3: Locked */}
          <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50/80 text-slate-400 text-left relative opacity-75">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase mb-1">
              <span>Unit 3</span>
              <Lock className="w-3 h-3 text-slate-400" />
            </div>
            <div className="font-semibold text-xs truncate">What's That?</div>
            <div className="text-[10px] mt-2 text-slate-400">100 Drills • Locked</div>
          </div>

          {/* Unit 4: Locked */}
          <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50/80 text-slate-400 text-left relative opacity-75">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase mb-1">
              <span>Unit 4</span>
              <Lock className="w-3 h-3 text-slate-400" />
            </div>
            <div className="font-semibold text-xs truncate">Around the World</div>
            <div className="text-[10px] mt-2 text-slate-400">100 Drills • Locked</div>
          </div>

          {/* Unit 5: Locked */}
          <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50/80 text-slate-400 text-left relative opacity-60">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase mb-1">
              <span>Unit 5</span>
              <Lock className="w-3 h-3 text-slate-400" />
            </div>
            <div className="font-semibold text-xs truncate">Families</div>
            <div className="text-[10px] mt-2 text-slate-400">100 Drills</div>
          </div>

          {/* Unit 6: Locked */}
          <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50/80 text-slate-400 text-left relative opacity-60">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase mb-1">
              <span>Unit 6</span>
              <Lock className="w-3 h-3 text-slate-400" />
            </div>
            <div className="font-semibold text-xs truncate">Is There a View?</div>
            <div className="text-[10px] mt-2 text-slate-400">100 Drills</div>
          </div>

          {/* Unit 7: Locked */}
          <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50/80 text-slate-400 text-left relative opacity-60">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase mb-1">
              <span>Unit 7</span>
              <Lock className="w-3 h-3 text-slate-400" />
            </div>
            <div className="font-semibold text-xs truncate">Where Do You Live?</div>
            <div className="text-[10px] mt-2 text-slate-400">100 Drills</div>
          </div>

          {/* Unit 8: Locked */}
          <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50/80 text-slate-400 text-left relative opacity-60">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase mb-1">
              <span>Unit 8</span>
              <Lock className="w-3 h-3 text-slate-400" />
            </div>
            <div className="font-semibold text-xs truncate">What Are You Doing?</div>
            <div className="text-[10px] mt-2 text-slate-400">100 Drills</div>
          </div>
        </div>
      </div>

      {/* 3. LAB STATIONS SELECTOR (STATIONS 1 TO 6) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-600" />
            <span>Select Practice Station (Filter by Topic):</span>
          </h3>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="bg-slate-100 p-0.5 rounded-xl flex items-center text-xs font-bold border border-slate-200">
              <button
                onClick={() => setViewMode('card')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  viewMode === 'card'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Focus Drill Card
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All 100 Grid
              </button>
            </div>
          </div>
        </div>

        {/* Station Pill Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
          {/* All button */}
          <button
            onClick={() => {
              setActiveStationFilter('all');
              setCurrentExerciseIndex(0);
            }}
            className={`p-3 rounded-2xl border text-left transition-all ${
              activeStationFilter === 'all'
                ? 'bg-indigo-600 text-white border-indigo-700 shadow-md font-bold'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <div className="text-base mb-1">🌟</div>
            <div className="text-xs font-bold truncate">All 100 Drills</div>
            <div className={`text-[10px] mt-1 ${activeStationFilter === 'all' ? 'text-indigo-200' : 'text-slate-400'}`}>
              Full Marathon
            </div>
          </button>

          {/* Stations 1 to 6 */}
          {LAB_STATIONS.map(st => {
            const progress = getStationProgress(st.id);
            const isSelected = activeStationFilter === st.id;
            return (
              <button
                key={st.id}
                onClick={() => {
                  setActiveStationFilter(st.id);
                  setCurrentExerciseIndex(0);
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-md'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-base">{st.icon}</span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {progress.completed}/{st.count}
                  </span>
                </div>
                <div className="text-xs font-bold truncate">{st.title}</div>
                <div className={`text-[10px] mt-1 truncate ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {st.range}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. WORKSPACE: CARD VIEW OR GRID VIEW */}
      {viewMode === 'card' ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          
          {/* Top Bar: Exercise Index & Station Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm">
                #{activeExercise.id}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">
                    Station {activeExercise.stationNumber}: {activeExercise.stationTitle}
                  </span>
                  {userAnswers[activeExercise.id]?.isCorrect && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> Solved (+10 XP)
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Exercise {currentExerciseIndex + 1} of {filteredExercises.length} in this view
                </p>
              </div>
            </div>

            {/* Audio Button for native sound / pronunciation */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayAudio}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  isPlayingAudio
                    ? 'bg-amber-500 text-white animate-pulse'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                }`}
                title="Listen to native American English audio for this exercise"
              >
                {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlayingAudio ? 'Playing Audio...' : 'Listen Audio'}</span>
                {activeExercise.audioTimestamp && (
                  <span className="text-[10px] opacity-80 font-mono">({activeExercise.audioTimestamp})</span>
                )}
              </button>

              <button
                onClick={() => setShowHint(prev => !prev)}
                className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                title="Need a hint?"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Hint</span>
              </button>
            </div>
          </div>

          {/* Hint Card */}
          {showHint && (
            <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5 animate-fadeIn">
              <span className="text-lg shrink-0">💡</span>
              <div className="space-y-0.5">
                <strong className="font-bold block">Teacher Cokitö's Hint:</strong>
                <p>{activeExercise.hint}</p>
              </div>
            </div>
          )}

          {/* Instruction & Prompt */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {activeExercise.instruction}
            </div>

            <div className="text-lg sm:text-xl font-bold text-slate-900 leading-snug p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
              {activeExercise.prompt}
            </div>
          </div>

          {/* Options (Multiple Choice, Fill-in-Blank, or Unscramble) */}
          {activeExercise.options && activeExercise.options.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {activeExercise.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                const answered = userAnswers[activeExercise.id];
                const isCorrectAnswer = option.toLowerCase() === activeExercise.correctAnswer.toLowerCase();

                let style = 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200';
                if (answered) {
                  if (isCorrectAnswer) {
                    style = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold ring-2 ring-emerald-200';
                  } else if (isSelected && !answered.isCorrect) {
                    style = 'bg-red-50 border-red-300 text-red-900 font-bold';
                  }
                } else if (isSelected) {
                  style = 'bg-indigo-50 border-indigo-400 text-indigo-900 font-bold ring-2 ring-indigo-200';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!userAnswers[activeExercise.id]) {
                        setSelectedOption(option);
                        handleCheckAnswer(option);
                      }
                    }}
                    disabled={!!userAnswers[activeExercise.id]}
                    className={`p-4 rounded-2xl border text-left text-sm transition-all flex items-center justify-between gap-3 ${style}`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 text-slate-600 font-mono text-xs flex items-center justify-center font-bold shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </span>
                    {answered && isCorrectAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Virtual Teacher Explanation (Appears after answering) */}
          {showExplanation && (
            <div className="p-5 rounded-2xl bg-indigo-50/90 border border-indigo-200 text-indigo-950 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-indigo-900">
                <span className="text-xl">👩‍🏫</span>
                <span>Virtual Teacher Cokitö Explains:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                {activeExercise.explanation}
              </p>
            </div>
          )}

          {/* Footer Controls: Prev, Next, Reset */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={handlePrev}
              disabled={currentExerciseIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-2">
              {userAnswers[activeExercise.id] && (
                <button
                  onClick={handleResetCurrent}
                  className="flex items-center gap-1 px-3 py-2 text-slate-500 hover:text-slate-800 rounded-xl text-xs font-semibold"
                  title="Try this exercise again"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>
              )}

              <button
                onClick={handleNext}
                disabled={currentExerciseIndex === filteredExercises.length - 1}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <span>Next Drill</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      ) : (
        /* GRID VIEW: ALL 100 EXERCISES OVERVIEW */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ListOrdered className="w-5 h-5 text-indigo-600" />
                <span>100-Drill Quick Jump Matrix</span>
              </h3>
              <p className="text-xs text-slate-500">
                Click any number to jump directly to that exercise. Green circles indicate solved exercises.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search drill or number..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* 100 Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-20 gap-2">
            {UNIT_1_LAB_EXERCISES.map((ex, idx) => {
              const isAnswered = userAnswers[ex.id]?.isCorrect;
              const isSelected = activeExercise.id === ex.id;
              return (
                <button
                  key={ex.id}
                  onClick={() => {
                    const foundIndex = filteredExercises.findIndex(e => e.id === ex.id);
                    if (foundIndex !== -1) {
                      setCurrentExerciseIndex(foundIndex);
                    } else {
                      setActiveStationFilter('all');
                      const globalIdx = UNIT_1_LAB_EXERCISES.findIndex(e => e.id === ex.id);
                      setCurrentExerciseIndex(globalIdx !== -1 ? globalIdx : 0);
                    }
                    setViewMode('card');
                  }}
                  className={`h-11 rounded-xl font-mono text-xs font-bold border transition-all flex flex-col items-center justify-center relative ${
                    isAnswered
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                      : isSelected
                      ? 'bg-indigo-600 text-white border-indigo-700 ring-2 ring-indigo-300'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                  title={`Exercise #${ex.id}: ${ex.instruction}`}
                >
                  <span>{ex.id}</span>
                  {isAnswered && (
                    <span className="text-[9px] leading-none">✓</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" /> Solved ({totalCorrect})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-200" /> Pending ({100 - totalCorrect})
              </span>
            </div>
            <button
              onClick={() => setViewMode('card')}
              className="text-indigo-600 font-bold hover:underline flex items-center gap-1"
            >
              <span>Back to Practice Card</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 5. CALL TO ACTION: BACK TO CLASSROOM HUB */}
      {onGoToClassroom && (
        <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-base flex items-center gap-2 justify-center sm:justify-start">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>Ready for the Virtual Classroom Lesson?</span>
            </h4>
            <p className="text-xs text-slate-300">
              Return to Classroom to mark your Google Meet live classes, review the student book pages, and submit your self-reflection.
            </p>
          </div>
          <button
            onClick={onGoToClassroom}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold shadow-md transition-all whitespace-nowrap"
          >
            Go to Classroom Hub
          </button>
        </div>
      )}

    </div>
  );
};
