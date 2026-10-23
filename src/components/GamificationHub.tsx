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
  Volume2,
  Gamepad2,
  Search,
  Users,
  GraduationCap,
  Gift,
  Clock3,
  UserPlus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, AudienceTheme } from '../types';
import { ArenaMiniGames } from './ArenaMiniGames';
import { WheresGuakyGame } from './WheresGuakyGame';
import { GamerAccountModal } from './GamerAccountModal';

interface GamificationHubProps {
  currentStudent: Student | null;
  students: Student[];
  onAwardXp: (studentId: string, amount: number) => void;
  activeRole: 'student' | 'teacher';
  audienceTheme: AudienceTheme;
  canSyncArenaLives: boolean;
  onOpenPricingModal?: () => void;
  onRegisterGamer?: (gamerData: { name: string; username: string; email: string; pin: string }) => void;
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
  canSyncArenaLives,
  onOpenPricingModal,
  onRegisterGamer
}) => {
  const isKids = audienceTheme === 'kids';
  const [arcadeSubTab, setArcadeSubTab] = useState<'wheres_guaky' | 'daily_quests' | 'arena_games'>('wheres_guaky');
  const [leaderboardFilter, setLeaderboardFilter] = useState<'general' | 'students'>('general');
  const [isGamerModalOpen, setIsGamerModalOpen] = useState(false);
  const [pendingGamerXp, setPendingGamerXp] = useState(50);

  // 3 Daily Quests (100% English daily micro-challenges)
  const [quests, setQuests] = useState<DailyQuest[]>([
    {
      id: 'q1',
      title: 'Phonetic Mission: Daily Greetings',
      xpReward: 15,
      question: 'Which response is the most natural to: "How is it going?"',
      options: ['I am going to school', 'Pretty good, thanks! How about you?', 'Yes, it goes', 'At 4:00 PM'],
      correctIndex: 1,
      explanation: '"Pretty good, thanks!" is the natural, native everyday response when someone greets you.',
      completed: false
    },
    {
      id: 'q2',
      title: 'Grammar Mission: Third-Person Singular',
      xpReward: 20,
      question: 'Choose the correct form: "My sister _____ (teach) science at the local academy."',
      options: ['teaches', 'teach', 'teachies', 'is teach'],
      correctIndex: 0,
      explanation: 'For verbs ending in "-ch" with He/She/It, add "-es": teaches.',
      completed: false
    },
    {
      id: 'q3',
      title: 'Conversational Idioms: Real Talk',
      xpReward: 25,
      question: 'What does the expression "By the way" mean in a conversation?',
      options: ['Along the road', 'Incidentally / As an aside', 'No way at all', 'With great pleasure'],
      correctIndex: 1,
      explanation: '"By the way" is used to introduce a new topic, extra information, or an aside naturally.',
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

  // 1. General Leaderboard: Everyone (Gamers + Students)
  const generalLeaderboard = [...students].sort((a, b) => b.xp - a.xp);

  // 2. Students Leaderboard: Only active students with enrolled campus status or Digital Pass
  const studentsLeaderboard = students
    .filter(s => s.accountType === 'student' || s.status === 'enrolled' || s.isDigitalPass)
    .sort((a, b) => b.xp - a.xp);

  const activeLeaderboard = leaderboardFilter === 'general' ? generalLeaderboard : studentsLeaderboard;

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
                The Flock Community • Daily Habit
              </span>
              <span className="text-xs text-[#FFD166] font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B4A]" />
                The Flock Arena
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {isKids ? 'Your Missions & Güaky XP! 🚀' : 'The Flock Arena • Daily Quests & Community'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Complete your 3 daily micro-missions to fuel your Fire Streak 🔥, earn XP points, and level up alongside the whole Güakytopia community.
            </p>
          </div>

          {/* Current Student Streak Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-4 min-w-[220px]">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-400/30 flex items-center justify-center shrink-0">
              <Flame className="w-7 h-7 fill-orange-400" />
            </div>
            <div>
              <span className="text-[11px] text-blue-200 block uppercase font-bold tracking-wider">Your Active Streak</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-white">{currentStudent?.streak || 0}</span>
                <span className="text-xs text-amber-300 font-bold">Consecutive Days</span>
              </div>
              <span className="text-[10px] text-blue-200 block">Total: {currentStudent?.xp || 0} Güakytopia XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* ARCADE SUB-NAV SELECTOR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setArcadeSubTab('wheres_guaky')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 border ${
            arcadeSubTab === 'wheres_guaky'
              ? isKids
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 border-amber-300 shadow-md font-black scale-102'
                : 'bg-teal-600 text-white border-teal-500 shadow-md font-black scale-102'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
          }`}
        >
          <Search className="w-4 h-4 text-amber-500" />
          <span>🔍 Where&apos;s Güaky?</span>
          <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">XP</span>
        </button>

        <button
          onClick={() => setArcadeSubTab('daily_quests')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 border ${
            arcadeSubTab === 'daily_quests'
              ? isKids
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-md font-black scale-102'
                : 'bg-indigo-600 text-white border-indigo-500 shadow-md font-black scale-102'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>⚡ Daily Quests & League</span>
        </button>

        <button
          onClick={() => setArcadeSubTab('arena_games')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 border ${
            arcadeSubTab === 'arena_games'
              ? isKids
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 border-emerald-300 shadow-md font-black scale-102'
                : 'bg-slate-900 text-white border-slate-700 shadow-md font-black scale-102'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
          }`}
        >
          <Gamepad2 className="w-4 h-4 text-emerald-400" />
          <span>🎮 Arcade Arena (Word Search, Scrabble, Hangman)</span>
        </button>
      </div>

      {/* SUB-VIEW 1: WHERE'S GÜAKY? */}
      {arcadeSubTab === 'wheres_guaky' && (
        <WheresGuakyGame
          currentStudent={currentStudent}
          audienceTheme={audienceTheme}
          onAwardXp={onAwardXp}
        />
      )}

      {/* SUB-VIEW 2: DAILY QUESTS + LEADERBOARD */}
      {arcadeSubTab === 'daily_quests' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Daily Quests */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-400" />
              <span>Today&apos;s Missions</span>
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              {quests.filter(q => q.completed).length} of {quests.length} completed
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
                  {quest.completed ? 'Completed!' : 'Solve Mission'}
                </button>
              </div>
            ))}
          </div>

          {/* Pedagogical Note */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-1">
            <strong className="block font-bold">💡 Teacher Cokitö Neurodivergent Habit:</strong>
            <p className="text-blue-800 leading-relaxed text-[11px]">
              Consistency beats intensity. Spending 5 focused minutes every day on a micro-challenge keeps your phonetic and semantic memory sharp without mental burnout.
            </p>
          </div>
        </div>

        {/* Right Column: Weekly Leaderboard */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Cokitö League</span>
            </h3>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
              Gold Division
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-3 bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 flex justify-between uppercase">
              <span>Rank / Student</span>
              <span>XP Points</span>
            </div>

            <div className="divide-y divide-slate-100">
              {activeLeaderboard.map((st, idx) => {
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
                          {isCurrent && <span className="text-amber-700 text-[10px] ml-1">(You)</span>}
                        </span>
                        <span className="text-[10px] text-slate-400">Streak: {st.streak} days 🔥</span>
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
      )}

      {/* SUB-VIEW 3: ARENA MINI GAMES */}
      {arcadeSubTab === 'arena_games' && (
        <ArenaMiniGames currentStudent={currentStudent} onAwardXp={onAwardXp} canSyncCloud={canSyncArenaLives} />
      )}

      {/* Quest Modal */}
      {activeQuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="p-5 bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                  +{activeQuest.xpReward} XP Reward
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
                    {answeredState === 'correct' ? 'Correct Answer! 🎉' : 'Almost! Keep practicing:'}
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
                    Check Answer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCloseQuest}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
                  >
                    Continue
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
