import React, { useRef, useState } from 'react';
import { 
  Flame, 
  Zap, 
  Trophy, 
  Award, 
  CheckCircle2, 
  Star, 
  Calendar, 
  Sparkles, 
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, AudienceTheme } from '../types';
import { ArenaMiniGames } from './ArenaMiniGames';

interface GamificationHubProps {
  currentStudent: Student | null;
  students: Student[];
  onAwardXp: (studentId: string, amount: number) => void;
  activeRole: 'student' | 'teacher';
  audienceTheme: AudienceTheme;
  canSyncArenaLives: boolean;
}

interface DailyQuest {
  id: string;
  title: string;
  xpReward: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  completed: boolean;
}

export const GamificationHub: React.FC<GamificationHubProps> = ({
  currentStudent,
  students,
  onAwardXp,
  activeRole,
  audienceTheme,
  canSyncArenaLives
}) => {
  const isKids = audienceTheme === 'kids';

  // 3 Daily Quests (Micro-desafíos diarios)
  const [quests, setQuests] = useState<DailyQuest[]>([
    {
      id: 'q1',
      title: 'Misión Fonética: Saludos Cotidianos',
      xpReward: 15,
      question: '¿Qué respuesta es más natural para: "How is it going?"',
      options: ['I am going to school', 'Pretty good, thanks! How about you?', 'Yes, it goes', 'At 4:00 PM'],
      correctIndex: 1,
      explanation: '"Pretty good, thanks!" es la respuesta nativa y cotidiana para saludar amigablemente.',
      completed: false
    },
    {
      id: 'q2',
      title: 'Misión Gramatical: Tercera Persona',
      xpReward: 20,
      question: 'Elige la forma correcta: "My sister _____ (teach) science at the local academy."',
      options: ['teaches', 'teach', 'teachies', 'is teach'],
      correctIndex: 0,
      explanation: 'Para verbos que terminan en "ch" con He/She, se añade -es: teaches.',
      completed: false
    },
    {
      id: 'q3',
      title: 'Misión Conversacional: Real Talk',
      xpReward: 25,
      question: '¿Qué significa la expresión "By the way" en una conversación?',
      options: ['Por el camino', 'Por cierto / A propósito', 'De ninguna manera', 'Con mucho gusto'],
      correctIndex: 1,
      explanation: '"By the way" se utiliza para introducir un tema nuevo o información adicional.',
      completed: false
    }
  ]);

  const [activeQuestId, setActiveQuestId] = useState<string | null>(null);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [answeredState, setAnsweredState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  // Prevent duplicate XP awards from rapid repeated submissions in the same mounted session.
  const awardedQuestIdsRef = useRef<Set<string>>(new Set());

  const activeQuest = quests.find(q => q.id === activeQuestId);

  const handleVerifyQuest = () => {
    if (!activeQuest || selectedOpt === null || answeredState !== 'idle') return;

    if (selectedOpt === activeQuest.correctIndex) {
      if (activeQuest.completed || awardedQuestIdsRef.current.has(activeQuest.id)) return;
      // Mark synchronously before state updates so rapid double-clicks cannot award twice.
      awardedQuestIdsRef.current.add(activeQuest.id);
      setAnsweredState('correct');
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {}

      if (currentStudent) {
        onAwardXp(currentStudent.id, activeQuest.xpReward);
      }

      setQuests(prev => prev.map(q => q.id === activeQuest.id ? { ...q, completed: true } : q));
    } else {
      setAnsweredState('wrong');
    }
  };

  const handleCloseQuest = () => {
    setActiveQuestId(null);
    setSelectedOpt(null);
    setAnsweredState('idle');
  };

  // Sort students for leaderboard
  const leaderboard = [...students].sort((a, b) => b.xp - a.xp);

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className={`rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden ${
        isKids
          ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500'
          : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 border border-slate-800'
      }`}>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/15 px-3 py-1 rounded-full backdrop-blur-md">
                The Flock Community • Hábito Diario
              </span>
              <span className="text-xs text-[#FFD166] font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B4A]" />
                The Flock Arena
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {isKids ? '¡Tus Misiones y Puntos Güaky! 🚀' : 'The Flock Arena • Retos Diarios & Comunidad'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Completa tus 3 micro-misiones diarias para alimentar tu Racha de Fuego 🔥, sumar puntos XP y avanzar junto a toda la comunidad de Güakytopia.
            </p>
          </div>

          {/* Current Student Streak Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-4 min-w-[220px]">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-400/30 flex items-center justify-center shrink-0">
              <Flame className="w-7 h-7 fill-orange-400" />
            </div>
            <div>
              <span className="text-[11px] text-blue-200 block uppercase font-bold tracking-wider">Tu Racha Activa</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-white">{currentStudent?.streak || 0}</span>
                <span className="text-xs text-amber-300 font-bold">Días Consecutivos</span>
              </div>
              <span className="text-[10px] text-blue-200 block">Total: {currentStudent?.xp || 0} XP Güakytopia</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Daily Quests + Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Daily Quests */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-400" />
              <span>Misiones de Hoy</span>
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              {quests.filter(q => q.completed).length} de {quests.length} completadas
            </span>
          </div>

          <div className="space-y-3">
            {quests.map(quest => (
              <div
                key={quest.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  quest.completed
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : 'bg-white border-slate-200 hover:border-blue-400 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                    quest.completed
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-50 text-amber-600 border border-amber-200'
                  }`}>
                    {quest.completed ? <CheckCircle2 className="w-5 h-5" /> : `+${quest.xpReward}`}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{quest.title}</h4>
                    <p className="text-[11px] text-slate-500">{quest.question}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveQuestId(quest.id);
                    setSelectedOpt(null);
                    setAnsweredState('idle');
                  }}
                  disabled={quest.completed}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    quest.completed
                      ? 'bg-emerald-100 text-emerald-800 cursor-default'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                  }`}
                >
                  {quest.completed ? '¡Completada!' : 'Resolver Misión'}
                </button>
              </div>
            ))}
          </div>

          {/* Pedagogical Note */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-1">
            <strong className="block font-bold">💡 Hábito Neurodivergente Cokitö:</strong>
            <p className="text-blue-800 leading-relaxed text-[11px]">
              La constancia vence a la intensidad. Dedicar 5 minutos cada día a resolver un micro-reto mantiene tu memoria fonética y semántica activa sin generar fatiga mental.
            </p>
          </div>
        </div>

        {/* Right Column: Weekly Leaderboard */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Liga Cokitö</span>
            </h3>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
              División Oro
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-3 bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 flex justify-between uppercase">
              <span>Posición / Alumno</span>
              <span>Puntos XP</span>
            </div>

            <div className="divide-y divide-slate-100">
              {leaderboard.map((st, idx) => {
                const isCurrent = currentStudent?.id === st.id;
                let rankBadge = `${idx + 1}`;
                let rankStyle = 'text-slate-500';

                if (idx === 0) {
                  rankBadge = '🥇';
                  rankStyle = 'text-amber-500 font-bold';
                } else if (idx === 1) {
                  rankBadge = '🥈';
                  rankStyle = 'text-slate-400 font-bold';
                } else if (idx === 2) {
                  rankBadge = '🥉';
                  rankStyle = 'text-amber-700 font-bold';
                }

                return (
                  <div
                    key={st.id}
                    className={`p-3.5 flex items-center justify-between text-xs transition-colors ${
                      isCurrent ? 'bg-amber-50/70 font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-6 text-center text-sm ${rankStyle}`}>{rankBadge}</span>
                      <div>
                        <span className="block font-semibold text-slate-800">
                          {st.name} {st.lastName || ''}
                          {isCurrent && <span className="text-amber-700 text-[10px] ml-1">(Tú)</span>}
                        </span>
                        <span className="text-[10px] text-slate-400">Racha: {st.streak} días 🔥</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 font-black text-slate-900">
                      <Zap className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                      <span>{st.xp} XP</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Arena Arcade: shared lives, word search, Scrabble Mix and Hangman */}
      <ArenaMiniGames currentStudent={currentStudent} onAwardXp={onAwardXp} canSyncCloud={canSyncArenaLives} />

      {/* Quest Modal */}
      {activeQuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="p-5 bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                  +{activeQuest.xpReward} XP Recompensa
                </span>
                <h3 className="font-black text-base text-white mt-1">
                  {activeQuest.title}
                </h3>
              </div>
              <button
                onClick={handleCloseQuest}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <p className="text-sm font-bold text-slate-900 leading-snug">
                  {activeQuest.question}
                </p>
              </div>

              <div className="space-y-2">
                {activeQuest.options.map((opt, idx) => {
                  const isSelected = selectedOpt === idx;
                  let style = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800';

                  if (answeredState !== 'idle') {
                    if (idx === activeQuest.correctIndex) {
                      style = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-200';
                    } else if (isSelected) {
                      style = 'border-rose-500 bg-rose-50 text-rose-950 font-bold ring-2 ring-rose-200';
                    } else {
                      style = 'opacity-40 border-slate-200 bg-slate-50 text-slate-400';
                    }
                  } else if (isSelected) {
                    style = 'border-blue-600 bg-blue-50 text-blue-950 font-bold ring-2 ring-blue-200';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={answeredState !== 'idle'}
                      onClick={() => setSelectedOpt(idx)}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all ${style}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {answeredState !== 'idle' && (
                <div className={`p-4 rounded-2xl border text-xs space-y-1 ${
                  answeredState === 'correct'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}>
                  <strong className="block">
                    {answeredState === 'correct' ? '¡Respuesta Correcta! 🎉' : '¡Casi! Sigue practicando:'}
                  </strong>
                  <p>{activeQuest.explanation}</p>
                </div>
              )}

              <div className="flex justify-end pt-2">
                {answeredState === 'idle' ? (
                  <button
                    type="button"
                    onClick={handleVerifyQuest}
                    disabled={selectedOpt === null}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors disabled:opacity-50"
                  >
                    Comprobar
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCloseQuest}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
                  >
                    Continuar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
