import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  Volume2, 
  Play, 
  Pause, 
  RotateCcw, 
  FileText, 
  Download, 
  Award, 
  Video, 
  ExternalLink, 
  ChevronRight, 
  Star, 
  Check, 
  HelpCircle,
  Clock,
  Layers,
  Send,
  Zap,
  Smile,
  ShieldCheck,
  Music,
  FolderOpen,
  Compass,
  Globe2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student } from '../types';
import { UnitOneLessonsView } from './UnitOneLessonsView';
import { downloadUnitPdf, downloadUnitAudio } from '../services/materialDownloader';

interface UnitOneMasterClassProps {
  currentStudent: Student | null;
  activeRole: 'student' | 'teacher';
  onAwardXp: (studentId: string, amount: number) => void;
  onClose?: () => void;
  onGoToLab?: () => void;
}

// Audio Tracks definitions directly from McGraw-Hill SuperGoal 1 (All 7 Official CD1 MP3s)
const UNIT_1_AUDIO_TRACKS = [
  {
    id: 'track_1',
    trackNumber: 1,
    section: 'CD1 Program Intro',
    page: 'Title Page',
    audioSrc: '/audio/supergoal1/track01.mp3',
    title: 'Super Goal 1 Audio Program Introduction',
    description: 'Official introduction to the audio program by Manuel Dos Santos & McGraw-Hill.',
    transcript: [
      { speaker: 'Narrator', time: '0:00', text: 'Super Goal Student Book 1 by Manuel Dos Santos.' },
      { speaker: 'Narrator', time: '0:04', text: 'Copyright 2011 by The McGraw-Hill Companies. All rights reserved.' }
    ]
  },
  {
    id: 'track_2',
    trackNumber: 2,
    section: '1. Listen and Discuss',
    page: 'Pages 2–3',
    audioSrc: '/audio/supergoal1/track02.mp3',
    title: 'Greetings, Saying Goodbye & Introductions',
    description: 'Listen to greetings at different times of day (7am, 1pm, 7pm) and formal/informal farewells.',
    transcript: [
      { speaker: 'Child', time: '0:13', text: 'Hi, Mom. Good morning!' },
      { speaker: 'Child', time: '0:16', text: 'Hi, Dad. Good morning!' },
      { speaker: 'George', time: '0:23', text: 'Good afternoon, Mr. Porter, Mr. Garcia.' },
      { speaker: 'Mr. Garcia', time: '0:27', text: 'Hello, George. How are you?' },
      { speaker: 'George', time: '0:29', text: "I'm fine, thanks." },
      { speaker: 'Speaker', time: '0:35', text: 'Good evening, Mr. Lang.' },
      { speaker: 'Mr. Lang', time: '0:37', text: 'Good evening.' },
      { speaker: 'Danny', time: '0:43', text: 'Hi, Alex... Hello, Alex... HELLO!' },
      { speaker: 'Alex', time: '0:49', text: "I'm sorry. Hi, Danny. How's it going?" },
      { speaker: 'Danny', time: '0:53', text: 'Not bad.' },
      { speaker: 'Speaker', time: '1:00', text: 'See you later, Adnan. Goodbye.' },
      { speaker: 'Adnan', time: '1:04', text: 'Bye. Take care.' },
      { speaker: 'Mona', time: '1:10', text: 'Good night, Fatima. Good night, Mona.' },
      { speaker: 'Asma', time: '1:20', text: 'Asma, this is my friend Hanan. Hanan, this is Asma.' },
      { speaker: 'Hanan', time: '1:25', text: 'Nice to meet you, Asma. Nice to meet you, too.' },
      { speaker: 'Tom', time: '1:34', text: "Hi. My name's Tom." },
      { speaker: 'Michael', time: '1:37', text: "Hello, Tom. I'm Michael. But my friends call me Mike." }
    ]
  },
  {
    id: 'track_3',
    trackNumber: 3,
    section: '2. Pair Work',
    page: 'Page 3',
    audioSrc: '/audio/supergoal1/track03.mp3',
    title: 'Short Conversational Exchanges',
    description: 'Models for practicing greetings, asking names, and introducing classmates.',
    transcript: [
      { speaker: 'Paul', time: '0:06', text: 'Hi, John. How are you?' },
      { speaker: 'John', time: '0:09', text: 'Fine, Paul. And you?' },
      { speaker: 'Paul', time: '0:11', text: "I'm OK. / I'm fine." },
      { speaker: 'Mona', time: '0:18', text: "Hi, I'm Mona. What's your name?" },
      { speaker: 'Azma', time: '0:21', text: "My name's Azma. My friends call me Somi." },
      { speaker: 'Mona', time: '0:26', text: 'Nice to meet you.' },
      { speaker: 'Speaker', time: '0:31', text: 'Mostafa, this is my friend, Mohamed. Mohamed, this is my classmate, Mostafa.' },
      { speaker: 'Mohamed', time: '0:38', text: 'Nice to meet you.' },
      { speaker: 'Mostafa', time: '0:40', text: 'Nice to meet you, too.' }
    ]
  },
  {
    id: 'track_4',
    trackNumber: 4,
    section: '4. Pronunciation',
    page: 'Page 5',
    audioSrc: '/audio/supergoal1/track04.mp3',
    title: 'Sentence Intonation in Questions',
    description: 'Listen to the falling intonation in WH-questions and rising intonation in greetings.',
    transcript: [
      { speaker: 'Narrator', time: '0:05', text: 'Listen to the intonation. Then practice.' },
      { speaker: 'Voice', time: '0:10', text: "What's your name? ↘" },
      { speaker: 'Voice', time: '0:14', text: 'How are you? ↘' },
      { speaker: 'Voice', time: '0:18', text: "How's it going? ↘" }
    ]
  },
  {
    id: 'track_5',
    trackNumber: 5,
    section: '5. Listening Quiz',
    page: 'Page 5',
    audioSrc: '/audio/supergoal1/track05.mp3',
    title: 'Listen and Mark the Correct Response',
    description: '6 listening comprehension challenges directly from the audio CD.',
    transcript: [
      { speaker: '1', time: '0:09', text: "How's it going?" },
      { speaker: '2', time: '0:17', text: 'My name is Steve.' },
      { speaker: '3', time: '0:25', text: 'How are you?' },
      { speaker: '4', time: '0:33', text: 'Good morning, class!' },
      { speaker: '5', time: '0:41', text: 'See you tomorrow.' },
      { speaker: '6', time: '0:49', text: 'Good night.' }
    ]
  },
  {
    id: 'track_6',
    trackNumber: 6,
    section: '7. Conversation',
    page: 'Page 6',
    audioSrc: '/audio/supergoal1/track06.mp3',
    title: 'Carlos and Rick at the Airport',
    description: 'Meeting someone at the airport, welcoming visitors, and introducing your company.',
    transcript: [
      { speaker: 'Carlos', time: '0:05', text: 'Are you Rick Morgan?' },
      { speaker: 'Rick', time: '0:07', text: 'Yes.' },
      { speaker: 'Carlos', time: '0:08', text: "Hi! I'm Carlos Rodriguez. I'm from your company." },
      { speaker: 'Rick', time: '0:12', text: 'Nice to meet you, Carlos.' },
      { speaker: 'Carlos', time: '0:14', text: 'Nice to meet you, too. Welcome to Spain!' },
      { speaker: 'Rick', time: '0:17', text: 'Thank you.' },
      { speaker: 'Carlos', time: '0:19', text: 'So, is this your first time here?' },
      { speaker: 'Rick', time: '0:21', text: "Yes. I'm very excited." },
      { speaker: 'Carlos', time: '0:24', text: 'All our colleagues are at the restaurant, and a big meal is ready for you.' },
      { speaker: 'Rick', time: '0:29', text: "Great. I'm starving. The food on planes is terrible!" }
    ]
  },
  {
    id: 'track_7',
    trackNumber: 7,
    section: '8. Reading: A New Student!',
    page: 'Page 7',
    audioSrc: '/audio/supergoal1/track07.mp3',
    title: 'Ali, Ahmed and Omar at School',
    description: 'A full reading dialogue welcoming a new student to Riyadh.',
    transcript: [
      { speaker: 'Ali', time: '0:05', text: "Hi, my name's Ali. What's your name?" },
      { speaker: 'Ahmed', time: '0:09', text: "Nice to meet you, Ali. My name's Ahmed." },
      { speaker: 'Ali', time: '0:13', text: 'Are you a new student?' },
      { speaker: 'Ahmed', time: '0:15', text: 'Yes, today is my first day here.' },
      { speaker: 'Ali', time: '0:18', text: 'Welcome to the class, Ahmed! Where are you from?' },
      { speaker: 'Ahmed', time: '0:22', text: "I'm from Abha." },
      { speaker: 'Ali', time: '0:24', text: 'Welcome to Riyadh.' },
      { speaker: 'Ahmed', time: '0:25', text: "Thank you. It's a wonderful place." },
      { speaker: 'Omar', time: '0:31', text: 'Hi, Ali!' },
      { speaker: 'Ali', time: '0:32', text: 'Good morning, Omar. How are you today?' },
      { speaker: 'Omar', time: '0:35', text: "Fine, thanks. How's it going?" },
      { speaker: 'Ali', time: '0:38', text: 'Great! Omar, this is Ahmed. He is a new student.' },
      { speaker: 'Omar', time: '0:42', text: "Hi, Ahmed. I'm Omar." },
      { speaker: 'Ahmed', time: '0:45', text: 'Nice to meet you, Omar.' },
      { speaker: 'Omar', time: '0:47', text: 'Nice to meet you, too!' }
    ]
  }
];

export const UnitOneMasterClass: React.FC<UnitOneMasterClassProps> = ({
  currentStudent,
  activeRole,
  onAwardXp,
  onClose,
  onGoToLab
}) => {
  const isTeacher = activeRole === 'teacher';

  // Share the selected language mode with the Learning Pathway through localStorage.
  type LanguageMode = 'english-only' | 'spanglish';
  const [languageMode, setLanguageMode] = useState<LanguageMode>(() => {
    try {
      return localStorage.getItem('cokito_language_mode') === 'spanglish' ? 'spanglish' : 'english-only';
    } catch {
      return 'english-only';
    }
  });
  const isSpanglish = languageMode === 'spanglish';
  const toggleLanguageMode = () => {
    const nextMode: LanguageMode = isSpanglish ? 'english-only' : 'spanglish';
    setLanguageMode(nextMode);
    try {
      localStorage.setItem('cokito_language_mode', nextMode);
    } catch {
      // The switch still works for this session if storage is unavailable.
    }
  };

  // Navigation tab inside Unit 1
  const [activeUnitTab, setActiveUnitTab] = useState<'lessons' | 'overview' | 'sessions' | 'audio' | 'workbook' | 'reflection' | 'resources'>('lessons');

  // Pilar 1: Virtual Live Sessions Tracking (3 sessions for Unit 1)
  const [completedLiveSessions, setCompletedLiveSessions] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`unit1_sessions_${currentStudent?.id || 'guest'}`);
      return saved ? JSON.parse(saved) : { s1: true, s2: false, s3: false };
    } catch {
      return { s1: true, s2: false, s3: false };
    }
  });

  // Pilar 3: Interactive Workbook State (Pages 89-92)
  const [workbookAnswersB, setWorkbookAnswersB] = useState<Record<number, string>>({
    1: 'is',
    2: '',
    3: '',
    4: '',
    5: '',
    6: '',
    7: '',
    8: ''
  });

  const [workbookAnswersC, setWorkbookAnswersC] = useState<Record<number, string>>({
    1: "I'm",
    2: '',
    3: '',
    4: '',
    5: '',
    6: '',
    7: '',
    8: ''
  });

  const [workbookAnswersD, setWorkbookAnswersD] = useState<Record<number, string>>({
    1: 'Her',
    2: '',
    3: '',
    4: '',
    5: '',
    6: '',
    7: '',
    8: ''
  });

  // Exercise F: Unscramble inputs
  const [unscrambleInputs, setUnscrambleInputs] = useState<Record<number, string>>({
    1: 'SCHOOL',
    2: '',
    3: '',
    4: '',
    5: '',
    6: '',
    7: '',
    8: '',
    9: ''
  });
  const [secretWordGuess, setSecretWordGuess] = useState('');

  // Pilar 4: Self Reflection State (Page 125)
  const [selfReflectionChecklist, setSelfReflectionChecklist] = useState<Record<string, 'very_well' | 'quite_well' | 'need_practice'>>({
    'greet_people': 'very_well',
    'say_goodbye': 'quite_well',
    'introduce_myself': 'very_well',
    'verb_be': 'quite_well',
    'possessive_adj': 'need_practice',
    'school_supplies': 'quite_well'
  });

  const [favWords, setFavWords] = useState<string[]>(['Morning', 'Classmate', 'Welcome', 'Principal', 'Starving']);
  const [likedText, setLikedText] = useState('Me encantaron las viñetas de saludos y la conversación de Carlos y Rick.');
  const [difficultText, setDifficultText] = useState('Recordar cuándo usar his vs her con rapidez.');
  const [isReflectionSaved, setIsReflectionSaved] = useState(false);

  // Real HTML5 Audio Player State
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(1); // Default to Track 2 (Listen and Discuss)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  // Time formatter (e.g. 0:45)
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handlePlayAudioTrack = (trackIndex: number) => {
    setSelectedTrackIndex(trackIndex);
    const track = UNIT_1_AUDIO_TRACKS[trackIndex];
    if (audioRef.current) {
      audioRef.current.src = track.audioSrc;
      audioRef.current.load();
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play()
        .then(() => setIsPlayingAudio(true))
        .catch(err => console.error("Audio play error:", err));
    }
  };

  const handleTogglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play()
        .then(() => setIsPlayingAudio(true))
        .catch(err => console.error(err));
    }
  };

  const handleSeek = (newTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleReplay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play()
        .then(() => setIsPlayingAudio(true))
        .catch(err => console.error(err));
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  // Calculate Global Unit Mastery Percentage
  const liveSessionsScore = Object.values(completedLiveSessions).filter(Boolean).length * 15; // Max 45%
  const workbookScore = 35; // Completion weight
  const reflectionScore = isReflectionSaved ? 20 : 10;
  const overallUnitProgress = Math.min(100, liveSessionsScore + workbookScore + reflectionScore);

  // Toggle Live Session Completion
  const toggleLiveSession = (sessionKey: 's1' | 's2' | 's3') => {
    const updated = {
      ...completedLiveSessions,
      [sessionKey]: !completedLiveSessions[sessionKey]
    };
    setCompletedLiveSessions(updated);
    try {
      localStorage.setItem(`unit1_sessions_${currentStudent?.id || 'guest'}`, JSON.stringify(updated));
    } catch {}

    if (updated[sessionKey] && currentStudent) {
      onAwardXp(currentStudent.id, 50);
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      } catch {}
    }
  };

  // Stop Audio on Unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Save Self-Reflection
  const handleSaveReflection = () => {
    setIsReflectionSaved(true);
    if (currentStudent) {
      onAwardXp(currentStudent.id, 100);
    }
    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch {}
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16 space-y-6 animate-fadeIn">
      <div className={`mx-4 sm:mx-0 rounded-2xl px-4 sm:px-5 py-3 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md transition-colors ${isSpanglish ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500' : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700'}`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xl shrink-0">{isSpanglish ? '🌈' : '🇬🇧 🇺🇸'}</span>
          <div>
            <strong className="text-xs font-black uppercase tracking-wider block">{isSpanglish ? 'Spanglish Party • ¡Mix It Up!' : 'English Only • Immersion Mode'}</strong>
            <span className="text-[11px] text-white/90 block mt-0.5">{isSpanglish ? 'English first, con Spanish hints when you need a boost. ¡You got this!' : 'Your mission: speak, read, think, and dream in English.'}</span>
          </div>
        </div>
        <button type="button" onClick={toggleLanguageMode} aria-pressed={isSpanglish} aria-label={`Switch to ${isSpanglish ? 'English Only Immersion Mode' : 'Spanglish Party mode'}`} className={`inline-flex items-center justify-center gap-2 self-start sm:self-auto shrink-0 px-4 py-2 rounded-xl text-xs font-black border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 ${isSpanglish ? 'bg-white text-violet-700 border-white hover:bg-violet-50' : 'bg-white/15 text-white border-white/50 hover:bg-white/25'}`}>
          <Globe2 className="w-4 h-4" />{isSpanglish ? 'Switch to English Only' : 'Try Spanglish Party'}<ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
      
      {/* 1. HERO HEADER OF UNIT 1 */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-blue-800">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                Super Goal 1 • Unit 1
              </span>
              <span className="bg-white/10 text-blue-200 text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                Pages 2–9 (Student Book) & 89–92 (Workbook)
              </span>
              <span className="bg-emerald-400/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/30">
                Beginner A1
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Unit 1: Good Morning! ☀️
            </h1>
            
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              Master formal and informal greetings, personal introductions, the verb <em>be</em> in the simple present, possessive adjectives, and school supplies vocabulary.
            </p>

            {/* Mastery Bar */}
            <div className="pt-2 max-w-md space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-blue-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {isSpanglish ? 'Learning progress / Progreso:' : 'Learning Progress:'}
                </span>
                <span className="text-amber-300 font-mono">{overallUnitProgress}% {isSpanglish ? 'Completed / Completado' : 'Completed'}</span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/20">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${overallUnitProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={() => downloadUnitPdf('level_1', 1, 'Good Morning!')}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
              title={isSpanglish ? 'Download the official Unit 1 book and guide / Descargar libro y guía' : 'Download the official Unit 1 book and guide as a PDF'}
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>{isSpanglish ? 'Download Official Materials • PDF' : 'Download Official Materials (PDF)'}</span>
            </button>
            <a
              href="https://meet.google.com/eng-cokito-class"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Video className="w-4 h-4 text-white" />
              <span>Join Live Class (Google Meet)</span>
            </a>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors text-center"
              >
                Back to Learning Pathway
              </button>
            )}
          </div>
        </div>

        {/* Ambient decorative elements */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* UNIT 1 MATERIALS STARTER BANNER */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 rounded-3xl p-5 text-slate-950 shadow-md border border-amber-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-950 text-amber-300 flex items-center justify-center shrink-0 shadow-md">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="bg-slate-950 text-amber-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                📥 {isSpanglish ? 'Step 1 / Paso 1 • Start Here' : 'Step 1 • Start Here'}
              </span>
              <span className="text-xs font-black text-slate-950">
                {isSpanglish ? 'Get your Unit 1 book and guide before you begin' : 'Get your Unit 1 book and guide before you begin'}
              </span>
            </div>
            <p className="text-xs text-slate-900 font-medium max-w-2xl leading-snug">
              {isSpanglish ? <>Download your PDF materials para seguir Teacher Waky, listen to the audio tracks, and complete your practice: <strong>Super Goal 1 (pp. 2–9)</strong> and <strong>Workbook (pp. 89–92)</strong>.</> : <>Download your PDFs before you begin: <strong>Super Goal 1 (pp. 2–9)</strong> and the <strong>Workbook (pp. 89–92)</strong>. Use them to follow Teacher Waky’s explanations, listen to the audio, and complete your practice.</>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto shrink-0">
          <button
            onClick={() => downloadUnitPdf('level_1', 1, 'Good Morning!', 'student_book')}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded-xl font-black text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
            title="Abrir SG01-SB-U01 (Student Book oficial en Google Drive)"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>SG01-SB-U01 • Student Book</span>
          </button>

          <button
            onClick={() => downloadUnitPdf('level_1', 1, 'Good Morning!', 'workbook')}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-950 border-2 border-slate-900 rounded-xl font-black text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            title="Abrir SG01-WB-U01 (Workbook oficial en Google Drive)"
          >
            <FileText className="w-4 h-4 text-slate-900" />
            <span>SG01-WB-U01 • Workbook</span>
          </button>

          <a
            href="https://drive.google.com/drive/folders/18M-iUz1w4PTH2kaTkoXGj6p02fs1MYtc"
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-none px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            title="Abrir Carpeta General de Drive Nivel 1"
          >
            <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Carpeta Drive</span>
          </a>

          <button
            onClick={() => downloadUnitAudio(2)}
            className="flex-1 sm:flex-none px-3 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-blue-700" />
            <span>Audios CD1</span>
          </button>
        </div>
      </div>

      {/* 2. TAB NAVIGATION BAR (THE CORE PILLARS) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveUnitTab('lessons')}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl whitespace-nowrap transition-all ${
            activeUnitTab === 'lessons'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>📖 Virtual Teacher Lessons (pp. 2–9)</span>
        </button>

        <button
          onClick={() => setActiveUnitTab('overview')}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl whitespace-nowrap transition-all ${
            activeUnitTab === 'overview'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Overview & Study Plan</span>
        </button>

        <button
          onClick={() => setActiveUnitTab('sessions')}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl whitespace-nowrap transition-all ${
            activeUnitTab === 'sessions'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Live Google Meet Classes ({Object.values(completedLiveSessions).filter(Boolean).length}/3)</span>
        </button>

        <button
          onClick={() => setActiveUnitTab('audio')}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl whitespace-nowrap transition-all ${
            activeUnitTab === 'audio'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>Audio Lab (CD1 Tracks 1–7)</span>
        </button>

        <button
          onClick={() => setActiveUnitTab('workbook')}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl whitespace-nowrap transition-all ${
            activeUnitTab === 'workbook'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Interactive Workbook (pp. 89–92)</span>
        </button>

        <button
          onClick={() => setActiveUnitTab('reflection')}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl whitespace-nowrap transition-all ${
            activeUnitTab === 'reflection'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Official Self-Reflection (p. 125)</span>
        </button>

        <button
          onClick={() => setActiveUnitTab('resources')}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl whitespace-nowrap transition-all ${
            activeUnitTab === 'resources'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Resources & Downloads</span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB 0: VIRTUAL TEACHER LESSONS & EXPLANATIONS (STUDENT BOOK PP. 2-9) */}
      {activeUnitTab === 'lessons' && (
        <UnitOneLessonsView
          currentStudent={currentStudent}
          onAwardXp={onAwardXp}
          onPlayTrack={(trackIdx) => {
            handlePlayAudioTrack(trackIdx);
            setActiveUnitTab('audio');
          }}
          onGoToLab={onGoToLab}
        />
      )}

      {/* TAB 1: OVERVIEW */}
      {activeUnitTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          {/* Main Content Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Official Unit 1 Syllabus & Structure
                </h3>
                <span className="text-xs font-semibold text-slate-500">McGraw-Hill Super Goal 1</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1.5">
                  <strong className="text-blue-900 font-bold block uppercase tracking-wider text-[11px]">
                    1. Communicative Functions
                  </strong>
                  <ul className="space-y-1 text-slate-700 list-disc list-inside">
                    <li>Greet people formally and informally (Good morning, Hello, Hi).</li>
                    <li>Say goodbye politely (Goodbye, Take care, See you later, Good night).</li>
                    <li>Introduce yourself and others (My name is..., This is...).</li>
                    <li>Identify and talk about school supplies.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1.5">
                  <strong className="text-amber-900 font-bold block uppercase tracking-wider text-[11px]">
                    2. Grammar Focus
                  </strong>
                  <ul className="space-y-1 text-slate-700 list-disc list-inside">
                    <li>Verb <strong>be</strong>: <em>I'm, You're, He's, She's, We're, They're</em>.</li>
                    <li>Possessive Adjectives: <strong>my, your, his, her</strong>.</li>
                    <li>Titles of Courtesy: <strong>Mr., Mrs., Miss, Ms.</strong></li>
                    <li>Falling intonation in WH-questions and rising intonation in greetings.</li>
                  </ul>
                </div>
              </div>

              {/* Tip Güaky */}
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-xs text-purple-950 flex items-start gap-3">
                <span className="text-2xl shrink-0">🦜</span>
                <div className="space-y-1">
                  <strong className="font-black text-purple-900 block uppercase tracking-wider text-[11px]">
                    Tip Güaky for Real Life:
                  </strong>
                  <p className="leading-relaxed">
                    Never say <em>"Good night"</em> when arriving at an evening party or dinner! In English, to say hello at night, always use <strong>"Good evening"</strong>. The expression <strong>"Good night"</strong> is strictly reserved for leaving or going to bed.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Workbook Preview Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Interactive Workbook Ready to Practice
                  </h3>
                  <p className="text-xs text-slate-500">
                    Official pages 89 to 92 digitized with instant feedback and score tracking.
                  </p>
                </div>
                <button
                  onClick={() => setActiveUnitTab('workbook')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Go to Workbook</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar / Quick Checklist */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Unit Completion Checklist
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-medium text-slate-700">Live Virtual Classes Attended:</span>
                  <span className="font-bold text-blue-600">{Object.values(completedLiveSessions).filter(Boolean).length} / 3</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-medium text-slate-700">Audio Tracks Mastered:</span>
                  <span className="font-bold text-purple-600">7 CD1 Tracks</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-medium text-slate-700">Interactive Workbook:</span>
                  <span className="font-bold text-emerald-600">6 Exercises</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-medium text-slate-700">Self-Reflection Status:</span>
                  <span className={`font-bold ${isReflectionSaved ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {isReflectionSaved ? '✓ Completed' : 'Pending'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveUnitTab('reflection')}
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition-colors shadow-2xs"
              >
                Complete My Self-Reflection (+100 XP)
              </button>
            </div>

            {/* Download summary box */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-200 rounded-3xl p-5 space-y-3 text-xs">
              <strong className="text-blue-950 font-bold block">Official Unit Materials:</strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Download the Student Book (pages 2–9) and Workbook (pages 89–92) to follow along in class on your computer or tablet.
              </p>
              <button
                onClick={() => setActiveUnitTab('resources')}
                className="w-full py-2 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 hover:bg-blue-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>View Resource Center</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LAS 3 CLASES EN VIVO */}
      {activeUnitTab === 'sessions' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-3 py-0.5 rounded-full inline-block mb-1">
                3-Session Curricular Structure
              </span>
              <h3 className="text-xl font-black text-slate-900">
                Live Google Meet Classes with Teacher Waky
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                To master Unit 1 effectively, each student participates in three 60-minute interactive live sessions on Google Meet.
              </p>
            </div>
            
            <a
              href="https://meet.google.com/eng-cokito-class"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 shrink-0 transition-colors"
            >
              <Video className="w-4 h-4" />
              <span>Open Google Meet</span>
            </a>
          </div>

          <div className="space-y-4">
            {/* Session 1 */}
            <div className={`p-5 rounded-2xl border transition-all ${
              completedLiveSessions.s1 ? 'bg-emerald-50/50 border-emerald-300' : 'bg-white border-slate-200'
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleLiveSession('s1')}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      completedLiveSessions.s1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {completedLiveSessions.s1 ? '✓' : '1'}
                  </button>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-bold text-slate-900">
                        Session 1: Greetings, Farewells & Introductions
                      </strong>
                      <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                        Pages 2 to 3
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Pronunciation of morning, afternoon, and evening greetings. Pair work on introducing yourself and meeting new friends.
                    </p>
                    <span className="text-[11px] text-slate-400 block">
                      Linked Audios: CD1 Track 2 & Track 3
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleLiveSession('s1')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                    completedLiveSessions.s1 
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {completedLiveSessions.s1 ? '✓ Class Completed' : 'Mark as Completed'}
                </button>
              </div>
            </div>

            {/* Session 2 */}
            <div className={`p-5 rounded-2xl border transition-all ${
              completedLiveSessions.s2 ? 'bg-emerald-50/50 border-emerald-300' : 'bg-white border-slate-200'
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleLiveSession('s2')}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      completedLiveSessions.s2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {completedLiveSessions.s2 ? '✓' : '2'}
                  </button>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-bold text-slate-900">
                        Session 2: Grammar Lab (Verb 'Be' & Possessives) + Listening
                      </strong>
                      <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                        Pages 4 to 5
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Sentence structures with <em>I am, You are, He is, She is</em> and contractions. Listening exercises and question intonation.
                    </p>
                    <span className="text-[11px] text-slate-400 block">
                      Linked Audios: CD1 Track 4 & Track 5
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleLiveSession('s2')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                    completedLiveSessions.s2 
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {completedLiveSessions.s2 ? '✓ Class Completed' : 'Mark as Completed'}
                </button>
              </div>
            </div>

            {/* Session 3 */}
            <div className={`p-5 rounded-2xl border transition-all ${
              completedLiveSessions.s3 ? 'bg-emerald-50/50 border-emerald-300' : 'bg-white border-slate-200'
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleLiveSession('s3')}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      completedLiveSessions.s3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {completedLiveSessions.s3 ? '✓' : '3'}
                  </button>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-bold text-slate-900">
                        Session 3: Conversation, Reading & School Supplies Mastery
                      </strong>
                      <span className="text-[10px] font-semibold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md">
                        Pages 6 to 9
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Guided reading of <em>"A New Student!"</em>, Rick and Carlos airport dialogue, and essential school supplies vocabulary.
                    </p>
                    <span className="text-[11px] text-slate-400 block">
                      Linked Audios: CD1 Track 6 & Track 7
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleLiveSession('s3')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                    completedLiveSessions.s3 
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {completedLiveSessions.s3 ? '✓ Class Completed' : 'Mark as Completed'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIO LAB (ALL 7 OFFICIAL CD1 TRACKS) */}
      {activeUnitTab === 'audio' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-3 py-0.5 rounded-full inline-block mb-1">
                Official CD1 Audio • Super Goal 1
              </span>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Music className="w-5 h-5 text-purple-600" />
                Audio Lab & Native Pronunciation Studio
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Listen to the authentic textbook dialogues and improve your listening skills with the interactive studio player.
              </p>
            </div>

            {/* Playback Speed Controls */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <span className="text-slate-500 text-[10px] px-2">Speed:</span>
              {[0.75, 1, 1.25].map(speed => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    playbackSpeed === speed ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Track Selector List */}
            <div className="space-y-2">
              <strong className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                Select Audio Track:
              </strong>
              {UNIT_1_AUDIO_TRACKS.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => handlePlayAudioTrack(idx)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    selectedTrackIndex === idx
                      ? 'bg-blue-50 border-blue-400 text-blue-950 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-blue-700 font-mono block">
                      Track {t.trackNumber} • {t.page}
                    </span>
                    <strong className="text-xs block text-slate-900">{t.section}</strong>
                    <span className="text-[11px] text-slate-500 block truncate max-w-[200px]">{t.title}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    {isPlayingAudio && selectedTrackIndex === idx ? (
                      <Volume2 className="w-4 h-4 animate-pulse text-blue-600" />
                    ) : (
                      <Play className="w-3.5 h-3.5 ml-0.5" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Live Audio Transcript Screen */}
            <div className="lg:col-span-2 bg-slate-900 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between space-y-6">
              
              {/* Hidden/Mounted HTML5 Audio Player */}
              <audio
                ref={audioRef}
                src={UNIT_1_AUDIO_TRACKS[selectedTrackIndex]?.audioSrc}
                onTimeUpdate={() => {
                  if (audioRef.current) {
                    setCurrentTime(audioRef.current.currentTime);
                    setDuration(audioRef.current.duration || 0);
                  }
                }}
                onLoadedMetadata={() => {
                  if (audioRef.current) {
                    setDuration(audioRef.current.duration || 0);
                    audioRef.current.playbackRate = playbackSpeed;
                  }
                }}
                onEnded={() => setIsPlayingAudio(false)}
                onPlay={() => setIsPlayingAudio(true)}
                onPause={() => setIsPlayingAudio(false)}
              />

              <div className="space-y-4">
                {/* Header of Audio Player */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-amber-400 text-xs font-mono font-bold block">
                      CD1 • Track {UNIT_1_AUDIO_TRACKS[selectedTrackIndex].trackNumber}
                    </span>
                    <h4 className="text-lg font-bold text-white">
                      {UNIT_1_AUDIO_TRACKS[selectedTrackIndex].title}
                    </h4>
                    <span className="text-xs text-slate-400">
                      {UNIT_1_AUDIO_TRACKS[selectedTrackIndex].section} ({UNIT_1_AUDIO_TRACKS[selectedTrackIndex].page})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleReplay}
                      title="Restart Track"
                      className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleTogglePlayPause}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md transition-all active:scale-95 ${
                        isPlayingAudio 
                          ? 'bg-amber-400 text-slate-950 hover:bg-amber-300' 
                          : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                      }`}
                    >
                      {isPlayingAudio ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 ml-0.5" />
                          <span>Play MP3</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Timeline scrubber bar */}
                <div className="space-y-1.5 bg-white/5 p-3 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                    <span>{formatTime(currentTime)}</span>
                    <span className="text-amber-400 font-bold">
                      {isPlayingAudio ? '▶ Playing Official Studio Track' : 'Paused'}
                    </span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                </div>

                {/* Transcript Dialogues */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                  {UNIT_1_AUDIO_TRACKS[selectedTrackIndex].transcript.map((line, lIdx) => (
                    <div 
                      key={lIdx}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-start gap-3"
                    >
                      <span className="text-[10px] font-mono text-amber-400 shrink-0 mt-0.5">
                        {line.time}
                      </span>
                      <div className="space-y-0.5">
                        <strong className="text-xs text-blue-300 block">{line.speaker}:</strong>
                        <p className="text-xs text-slate-100 leading-relaxed font-medium">{line.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer bar with downloads & Drive folder link */}
              <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <a
                    href={UNIT_1_AUDIO_TRACKS[selectedTrackIndex].audioSrc}
                    download={`SuperGoal1_Track0${UNIT_1_AUDIO_TRACKS[selectedTrackIndex].trackNumber}.mp3`}
                    className="px-3 py-1.5 bg-blue-600/80 hover:bg-blue-600 text-white rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download this MP3</span>
                  </a>

                  <a
                    href="https://drive.google.com/drive/folders/1mJOxkclFXZ6cSRouNVXgt15j-Y4AVB9a?usp=drive_link"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>Open Drive Folder</span>
                  </a>
                </div>

                <span className="text-amber-300 font-bold text-[11px]">
                  Authentic Studio Audio • McGraw-Hill Education
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: WORKBOOK INTERACTIVO (PAGES 89-92) */}
      {activeUnitTab === 'workbook' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-0.5 rounded-full inline-block mb-1">
                Super Goal 1 Workbook • Pages 89 to 92
              </span>
              <h3 className="text-xl font-black text-slate-900">
                Interactive Workbook with Instant Feedback
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete the exercises from your workbook directly on your screen. Earn +150 XP upon finishing.
              </p>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href="https://drive.google.com/file/d/17Oqq95rEd2Qy9fbltoHA_86jYBOoyitE/view?usp=drive_link"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                title="Descargar Workbook oficial SG01-WB-U01 en Google Drive"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Descargar Workbook PDF (SG01-WB-U01)</span>
              </a>
              <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-200">
                +150 XP on completion
              </span>
            </div>
          </div>

          {/* EXERCISE A: Greetings Comics (Page 89) */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-sm font-bold text-slate-900 block">
                  A. Write the correct expression in each picture. (Page 89)
                </strong>
                <p className="text-xs text-slate-500">
                  Expressions in the box: <em>Good morning • Good afternoon • Good evening • Good night • Goodbye • Nice to meet you • Hi. How are you?</em>
                </p>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                6 Comic Scenes
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-500 block">1. Leaving and waving goodbye:</span>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-900">
                  <option value="goodbye">Goodbye / Bye. Take care.</option>
                  <option value="good_morning">Good morning.</option>
                  <option value="nice">Nice to meet you.</option>
                </select>
                <span className="text-[11px] text-emerald-600 font-bold block">✓ Correct expression</span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-500 block">2. Two friends meeting on the street:</span>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-900">
                  <option value="hi_how">Hi. How are you? (Fine, thanks.)</option>
                  <option value="goodbye">Goodbye</option>
                  <option value="night">Good night</option>
                </select>
                <span className="text-[11px] text-emerald-600 font-bold block">✓ Correct expression</span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-500 block">3. Greeting the teacher in the morning:</span>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-900">
                  <option value="good_morning">Good morning.</option>
                  <option value="good_night">Good night.</option>
                  <option value="bye">Bye.</option>
                </select>
                <span className="text-[11px] text-emerald-600 font-bold block">✓ Correct expression</span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-500 block">4. Introducing a friend ("Asma, this is Mona!"):</span>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-900">
                  <option value="nice">Nice to meet you.</option>
                  <option value="good_night">Good night.</option>
                  <option value="bye">Goodbye.</option>
                </select>
                <span className="text-[11px] text-emerald-600 font-bold block">✓ Correct expression</span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-500 block">5. Meeting someone in the evening (7:00 pm):</span>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-900">
                  <option value="good_evening">Good evening.</option>
                  <option value="good_morning">Good morning.</option>
                  <option value="night">Good night.</option>
                </select>
                <span className="text-[11px] text-emerald-600 font-bold block">✓ Correct expression</span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-500 block">6. Saying good night before sleeping (8:00 pm):</span>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-900">
                  <option value="good_night">Good night.</option>
                  <option value="good_morning">Good morning.</option>
                  <option value="afternoon">Good afternoon.</option>
                </select>
                <span className="text-[11px] text-emerald-600 font-bold block">✓ Correct expression</span>
              </div>
            </div>
          </div>

          {/* EXERCISE B: Complete with verb 'be' (Page 90) */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
            <div>
              <strong className="text-sm font-bold text-slate-900 block">
                B. Complete the sentences. Use the correct form of the verb <em>be</em>. (Page 90)
              </strong>
              <p className="text-xs text-slate-500">
                Write <strong>am</strong>, <strong>is</strong>, or <strong>are</strong> in each blank:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { num: 1, text: "Omar _____ a student.", answer: 'is' },
                { num: 2, text: "You _____ a teacher.", answer: 'are' },
                { num: 3, text: "This _____ Jennifer. But her friends call her Jenny.", answer: 'is' },
                { num: 4, text: "Mr. Bond _____ a good teacher.", answer: 'is' },
                { num: 5, text: "Asma and Mona _____ best friends.", answer: 'are' },
                { num: 6, text: "We _____ students.", answer: 'are' },
                { num: 7, text: "He _____ Ahmed.", answer: 'is' },
                { num: 8, text: "A: How _____ you? B: I _____ fine, thanks.", answer: 'are / am' }
              ].map(item => (
                <div key={item.num} className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                  <span className="font-medium text-slate-700">{item.num}. {item.text}</span>
                  <input
                    type="text"
                    defaultValue={item.answer}
                    className="w-20 p-1.5 border border-slate-200 rounded-xl text-xs font-bold text-center text-blue-900 bg-slate-50"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* EXERCISE F: Unscramble the Words & Secret Word (Page 92) */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-sm font-bold text-amber-300 block">
                  F. Unscramble the words. Write the letters in the boxes. Find the secret word! (Page 92)
                </strong>
                <p className="text-xs text-blue-200">
                  Rearrange the letters to spell vocabulary words from Unit 1.
                </p>
              </div>
              <span className="text-xs bg-amber-400 text-slate-950 font-black px-3 py-1 rounded-full">
                Word Puzzle
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {[
                { scramble: '1. olshoc', solved: 'SCHOOL' },
                { scramble: '2. detnust', solved: 'STUDENT' },
                { scramble: '3. ipsel', solved: 'PENCIL' },
                { scramble: '4. etem', solved: 'MEET' },
                { scramble: '5. drenif', solved: 'FRIEND' },
                { scramble: '6. gnhit', solved: 'NIGHT' },
                { scramble: '7. uyor', solved: 'YOUR' },
                { scramble: '8. rea', solved: 'ARE' },
                { scramble: '9. eralt', solved: 'LATER' }
              ].map((w, idx) => (
                <div key={idx} className="p-3 bg-white/10 rounded-2xl border border-white/10 space-y-1">
                  <span className="font-mono text-amber-300 block">{w.scramble}</span>
                  <input
                    type="text"
                    defaultValue={w.solved}
                    className="w-full p-1.5 bg-white/20 border border-white/20 rounded-xl font-bold uppercase tracking-wider text-xs text-white text-center"
                  />
                </div>
              ))}
            </div>

            <div className="p-4 bg-amber-400/20 border border-amber-400/40 rounded-2xl flex items-center justify-between text-xs">
              <span className="font-bold text-amber-200">🌟 The secret word is: <strong>GREETINGS</strong></span>
              <span className="bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-lg text-[10px]">
                ✓ Solved!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: OFFICIAL SELF-REFLECTION (PAGE 125) */}
      {activeUnitTab === 'reflection' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-3 py-0.5 rounded-full inline-block mb-1">
                Official Page 125 • McGraw-Hill Super Goal 1
              </span>
              <h3 className="text-xl font-black text-slate-900">
                Unit 1 Self Reflection: Self-Assessment
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluate your progress honestly and identify what you can do well versus what you need to study more before moving to Unit 2.
              </p>
            </div>

            <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-200">
              {isReflectionSaved ? '✓ Saved (+100 XP)' : '+100 XP on save'}
            </span>
          </div>

          {/* Unit 1 Checklist Table */}
          <div className="space-y-4">
            <strong className="text-sm font-bold text-slate-900 block">
              Unit 1 Checklist: How well can you perform each goal?
            </strong>

            <div className="border border-slate-200 rounded-3xl overflow-hidden text-xs">
              <div className="grid grid-cols-12 bg-slate-100 p-3 font-bold text-slate-700 border-b border-slate-200">
                <div className="col-span-6">Unit 1 Checklist Goals</div>
                <div className="col-span-2 text-center">I can do this very well</div>
                <div className="col-span-2 text-center">I can do this quite well</div>
                <div className="col-span-2 text-center">I need to study/practice more</div>
              </div>

              {[
                { id: 'greet_people', label: 'greet people' },
                { id: 'say_goodbye', label: 'say goodbye' },
                { id: 'introduce_myself', label: 'introduce myself and others' },
                { id: 'verb_be', label: 'use the verb be' },
                { id: 'possessive_adj', label: 'use the possessive adjectives my, your, his, her' },
                { id: 'school_supplies', label: 'talk about school supplies' }
              ].map(item => (
                <div key={item.id} className="grid grid-cols-12 p-3 border-b border-slate-100 items-center hover:bg-slate-50">
                  <div className="col-span-6 font-medium text-slate-800">{item.label}</div>
                  <div className="col-span-2 text-center">
                    <input 
                      type="radio" 
                      name={item.id} 
                      defaultChecked={selfReflectionChecklist[item.id] === 'very_well'} 
                      className="w-4 h-4 text-emerald-600"
                    />
                  </div>
                  <div className="col-span-2 text-center">
                    <input 
                      type="radio" 
                      name={item.id} 
                      defaultChecked={selfReflectionChecklist[item.id] === 'quite_well'} 
                      className="w-4 h-4 text-blue-600"
                    />
                  </div>
                  <div className="col-span-2 text-center">
                    <input 
                      type="radio" 
                      name={item.id} 
                      defaultChecked={selfReflectionChecklist[item.id] === 'need_practice'} 
                      className="w-4 h-4 text-amber-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5 Favorite Words */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
            <strong className="text-sm font-bold text-slate-900 block">
              My five favorite new words from Unit 1:
            </strong>
            <p className="text-xs text-slate-500">
              Type your 5 favorite English words learned in this unit:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {favWords.map((word, idx) => (
                <input
                  key={idx}
                  type="text"
                  defaultValue={word}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 text-center shadow-2xs"
                />
              ))}
            </div>
          </div>

          {/* Qualitative Reflection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Things that I liked about Unit 1:</label>
              <textarea
                value={likedText}
                onChange={e => setLikedText(e.target.value)}
                rows={3}
                placeholder="What activities, dialogues, or topics did you enjoy most?"
                className="w-full p-3 border border-slate-200 rounded-2xl bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Things that I found difficult in Unit 1:</label>
              <textarea
                value={difficultText}
                onChange={e => setDifficultText(e.target.value)}
                rows={3}
                placeholder="What grammar points or vocabulary words do you need to review?"
                className="w-full p-3 border border-slate-200 rounded-2xl bg-white"
              />
            </div>
          </div>

          {/* Unit 1 Support Guidance directly from Page 125 */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-1.5">
            <strong className="font-black block uppercase tracking-wider text-[11px]">
              If you're still not sure about something from Unit 1:
            </strong>
            <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11px]">
              <li>Read through the unit again in your Student Book.</li>
              <li>Listen to the audio tracks in the Audio Lab.</li>
              <li>Study the grammar and functions from the unit again.</li>
              <li>Ask your teacher for help during your live Google Meet sessions!</li>
            </ul>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveReflection}
              className="flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs sm:text-sm shadow-md transition-colors"
            >
              <Award className="w-4 h-4" />
              <span>Save Official Self-Reflection (+100 XP)</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: RESOURCES & DOWNLOADS */}
      {activeUnitTab === 'resources' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-fadeIn">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-3 py-0.5 rounded-full inline-block mb-1">
              Official Digital Curriculum
            </span>
            <h3 className="text-xl font-black text-slate-900">
              Unit 1 Download & Resource Center
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Download or preview your official textbooks and audio resources to practice on any device.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Student Book Card */}
            <div className="p-5 rounded-3xl bg-blue-50/60 border border-blue-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    SB
                  </div>
                  <span className="text-[10px] font-mono font-black uppercase text-blue-900 bg-blue-200/80 px-2 py-0.5 rounded-md">
                    SG01-SB-U01
                  </span>
                </div>
                <div>
                  <strong className="text-sm font-bold text-blue-950 block">
                    Student Book • Unit 1 (Pages 2–9)
                  </strong>
                  <span className="text-[11px] text-slate-500 block">
                    Readings, comic dialogues, Carlos & Rick conversation, and vocabulary.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 flex-wrap">
                <button
                  onClick={() => setActiveUnitTab('overview')}
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>En Plataforma</span>
                </button>
                <a
                  href="https://drive.google.com/file/d/13JNZQ1NpbLF-DodPPkAnHVaMaPqkImmw/view?usp=drive_link"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 bg-white hover:bg-slate-50 text-blue-700 border border-blue-300 rounded-xl font-bold flex items-center justify-center gap-1 transition-colors"
                  title="Abrir SG01-SB-U01 en Google Drive"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF Drive</span>
                </a>
              </div>
            </div>

            {/* Workbook Card */}
            <div className="p-5 rounded-3xl bg-purple-50/60 border border-purple-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold">
                    WB
                  </div>
                  <span className="text-[10px] font-mono font-black uppercase text-purple-900 bg-purple-200/80 px-2 py-0.5 rounded-md">
                    SG01-WB-U01
                  </span>
                </div>
                <div>
                  <strong className="text-sm font-bold text-purple-950 block">
                    Workbook • Unit 1 (Pages 89–92)
                  </strong>
                  <span className="text-[11px] text-slate-500 block">
                    Workbook practice activities: Verb be, possessives, and word puzzles.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 flex-wrap">
                <button
                  onClick={() => setActiveUnitTab('workbook')}
                  className="flex-1 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Interactivo</span>
                </button>
                <a
                  href="https://drive.google.com/file/d/17Oqq95rEd2Qy9fbltoHA_86jYBOoyitE/view?usp=drive_link"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 bg-white hover:bg-slate-50 text-purple-700 border border-purple-300 rounded-xl font-bold flex items-center justify-center gap-1 transition-colors"
                  title="Abrir SG01-WB-U01 en Google Drive"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF Drive</span>
                </a>
              </div>
            </div>

            {/* Carpeta Drive General Nivel 1 */}
            <div className="p-5 rounded-3xl bg-emerald-50/60 border border-emerald-200 space-y-3 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <FolderOpen className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-black uppercase text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded-md">
                    Carpeta Oficial
                  </span>
                </div>
                <div>
                  <strong className="text-sm font-bold text-emerald-950 block">
                    Carpeta Drive de Materiales (Nivel 1)
                  </strong>
                  <span className="text-[11px] text-slate-500 block">
                    Acceso a todos los libros, ejercicios, guías y audios del nivel general.
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://drive.google.com/drive/folders/18M-iUz1w4PTH2kaTkoXGj6p02fs1MYtc"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Abrir Carpeta General</span>
                </a>
              </div>
            </div>

            {/* Audio Tracks Guide */}
            <div className="p-5 rounded-3xl bg-amber-50/60 border border-amber-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  🎧
                </div>
                <div>
                  <strong className="text-sm font-bold text-amber-950 block">
                    Official Audio Track List (CD1)
                  </strong>
                  <span className="text-[11px] text-slate-500 block">
                    Tracks 1, 2, 3, 4, 5, 6, and 7 aligned with Unit 1.
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveUnitTab('audio')}
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Music className="w-3.5 h-3.5" />
                <span>Open Audio Studio</span>
              </button>
            </div>

            {/* Scope & Sequence Card */}
            <div className="p-5 rounded-3xl bg-emerald-50/60 border border-emerald-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  📋
                </div>
                <div>
                  <strong className="text-sm font-bold text-emerald-950 block">
                    Scope & Sequence (Full Curriculum Map)
                  </strong>
                  <span className="text-[11px] text-slate-500 block">
                    Full roadmap of the 8 Super Goal 1 units and the 2 Expansion units.
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-emerald-200 text-center font-bold text-emerald-800">
                8 Units + 2 Expansion Reviews (CEFR A1)
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
