import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  FileText, 
  Headphones, 
  Video, 
  Layers, 
  Plus, 
  Search, 
  CheckCircle2, 
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Lock,
  Sparkles,
  Download,
  Play,
  Pause,
  FolderOpen,
  ArrowRight,
  ShieldCheck,
  FolderArchive,
  Compass,
  GraduationCap
} from 'lucide-react';
import { ClassroomMaterial, Student } from '../types';
import { INITIAL_MATERIALS, ENGLISH_LEVELS } from '../data/curriculumData';
import { fetchClassroomCourses, ClassroomCourse } from '../services/googleClassroom';
import { downloadUnitAudio } from '../services/materialDownloader';

interface AcademicLibraryProps {
  currentStudent: Student | null;
  activeRole: 'student' | 'teacher';
  onGoToClassroom?: () => void;
  onGoToHub?: () => void;
}

// Built-in official audio tracks for quick listening & download
const OFFICIAL_AUDIO_TRACKS = [
  { id: 'trk_1', levelId: 'level_1', trackNum: 1, title: 'CD1 Track 01 • Program Introduction', duration: '0:25', file: '/audio/supergoal1/track01.mp3' },
  { id: 'trk_2', levelId: 'level_1', trackNum: 2, title: 'CD1 Track 02 • Unit 1: Good Morning! (Greetings & Names)', duration: '1:44', file: '/audio/supergoal1/track02.mp3' },
  { id: 'trk_3', levelId: 'level_1', trackNum: 3, title: 'CD1 Track 03 • Unit 1: Grammar & Verb BE in context', duration: '0:45', file: '/audio/supergoal1/track03.mp3' },
  { id: 'trk_4', levelId: 'level_1', trackNum: 4, title: 'CD1 Track 04 • Unit 1: The English Alphabet & Phonetics', duration: '0:22', file: '/audio/supergoal1/track04.mp3' },
  { id: 'trk_5', levelId: 'level_1', trackNum: 5, title: 'CD1 Track 05 • Unit 1: Listening & Classroom Commands', duration: '0:55', file: '/audio/supergoal1/track05.mp3' },
  { id: 'trk_6', levelId: 'level_1', trackNum: 6, title: 'CD1 Track 06 • Unit 1: Real-life Conversation Model', duration: '0:36', file: '/audio/supergoal1/track06.mp3' },
  { id: 'trk_7', levelId: 'level_1', trackNum: 7, title: 'CD1 Track 07 • Unit 1: Reading & Culture: School Clubs', duration: '1:19', file: '/audio/supergoal1/track07.mp3' }
];

// Official Drive links for books with standardized Cokito codes
// Code format: SG = Super Goal (01 = Book 1) | SB = Student Book | WB = WorkBook | U = Unit
const OFFICIAL_BOOK_LINKS: Record<string, { 
  studentBookUrl: string; 
  workbookUrl: string; 
  folderUrl: string;
  studentBookCode: string;
  workbookCode: string;
}> = {
  level_1: {
    // SG01-SB-U: Student Book 1
    studentBookUrl: 'https://drive.google.com/file/d/13JNZQ1NpbLF-DodPPkAnHVaMaPqkImmw/view?usp=drive_link',
    // SG01-WB-U: WorkBook 1
    workbookUrl: 'https://drive.google.com/file/d/17Oqq95rEd2Qy9fbltoHA_86jYBOoyitE/view?usp=drive_link',
    // Carpeta General de Materiales Nivel 1 (libros, workbooks, guías y audios)
    folderUrl: 'https://drive.google.com/drive/folders/18M-iUz1w4PTH2kaTkoXGj6p02fs1MYtc',
    studentBookCode: 'SG01-SB-U',
    workbookCode: 'SG01-WB-U'
  },
  level_2: {
    studentBookUrl: 'https://drive.google.com/drive/folders/18M-iUz1w4PTH2kaTkoXGj6p02fs1MYtc',
    workbookUrl: 'https://drive.google.com/drive/folders/18M-iUz1w4PTH2kaTkoXGj6p02fs1MYtc',
    folderUrl: 'https://drive.google.com/drive/folders/18M-iUz1w4PTH2kaTkoXGj6p02fs1MYtc',
    studentBookCode: 'SG02-SB-U',
    workbookCode: 'SG02-WB-U'
  },
  level_3: {
    studentBookUrl: 'https://drive.google.com/drive/folders/18M-iUz1w4PTH2kaTkoXGj6p02fs1MYtc',
    workbookUrl: 'https://drive.google.com/drive/folders/18M-iUz1w4PTH2kaTkoXGj6p02fs1MYtc',
    folderUrl: 'https://drive.google.com/drive/folders/18M-iUz1w4PTH2kaTkoXGj6p02fs1MYtc',
    studentBookCode: 'SG03-SB-U',
    workbookCode: 'SG03-WB-U'
  },
  level_4: {
    studentBookUrl: 'https://drive.google.com/drive/folders/18M-iUz1w4PTH2kaTkoXGj6p02fs1MYtc',
    workbookUrl: 'https://drive.google.com/drive/folders/18M-iUz1w4PTH2kaTkoXGj6p02fs1MYtc',
    folderUrl: 'https://drive.google.com/drive/folders/18M-iUz1w4PTH2kaTkoXGj6p02fs1MYtc',
    studentBookCode: 'SG04-SB-U',
    workbookCode: 'SG04-WB-U'
  }
};

export const AcademicLibrary: React.FC<AcademicLibraryProps> = ({
  currentStudent,
  activeRole,
  onGoToClassroom,
  onGoToHub
}) => {
  const isTeacher = activeRole === 'teacher';

  // Persistence of teacher-managed materials
  const [materials, setMaterials] = useState<ClassroomMaterial[]>(() => {
    try {
      const saved = localStorage.getItem('cokito_classroom_materials');
      if (!saved) return INITIAL_MATERIALS;
      const parsed: unknown = JSON.parse(saved);
      if (!Array.isArray(parsed)) return INITIAL_MATERIALS;
      const stored = parsed.filter((item): item is ClassroomMaterial =>
        !!item &&
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        typeof item.title === 'string' &&
        typeof item.levelId === 'string' &&
        typeof item.url === 'string'
      );
      const storedIds = new Set(stored.map(m => m.id));
      return [...stored, ...INITIAL_MATERIALS.filter(m => !storedIds.has(m.id))];
    } catch {
      return INITIAL_MATERIALS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cokito_classroom_materials', JSON.stringify(materials));
    } catch (e) {
      console.warn('Could not save library materials', e);
    }
  }, [materials]);

  // Google Classroom integration
  const [liveCourses, setLiveCourses] = useState<ClassroomCourse[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);

  useEffect(() => {
    const loadCourses = async () => {
      setIsLoadingCourses(true);
      const res = await fetchClassroomCourses();
      if (!res.error && res.courses) {
        setLiveCourses(res.courses);
      }
      setIsLoadingCourses(false);
    };
    loadCourses();
  }, []);

  // Filter state
  const [typeFilter, setTypeFilter] = useState<'all' | 'pdf' | 'audio' | 'slides' | 'quiz'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Audio player state
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleTogglePlayAudio = (track: typeof OFFICIAL_AUDIO_TRACKS[0]) => {
    if (playingTrackId === track.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingTrackId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const newAudio = new Audio(track.file);
      audioRef.current = newAudio;
      setPlayingTrackId(track.id);
      newAudio.play().catch(err => {
        console.warn('Audio playback error', err);
        setPlayingTrackId(null);
      });
      newAudio.onended = () => {
        setPlayingTrackId(null);
      };
    }
  };

  // Student level calculation
  const studentLevelId = currentStudent?.levelId || 'level_1';
  const studentLevelIdx = ENGLISH_LEVELS.findIndex(l => l.id === studentLevelId);
  const activeLevelIdx = studentLevelIdx >= 0 ? studentLevelIdx : 0;
  const activeLevelData = ENGLISH_LEVELS[activeLevelIdx] || ENGLISH_LEVELS[0];

  // Group levels: previous, current, upcoming
  const previousLevels = useMemo(() => {
    return ENGLISH_LEVELS.slice(0, activeLevelIdx);
  }, [activeLevelIdx]);

  const upcomingLevels = useMemo(() => {
    return ENGLISH_LEVELS.slice(activeLevelIdx + 1);
  }, [activeLevelIdx]);

  // Collapsible accordion states
  // Previous levels master collapse (collapsed by default so student isn't overwhelmed)
  const [isPreviousLevelsExpanded, setIsPreviousLevelsExpanded] = useState<boolean>(false);
  // Which individual previous level is open
  const [expandedPreviousLevelId, setExpandedPreviousLevelId] = useState<string | null>(
    previousLevels.length > 0 ? previousLevels[previousLevels.length - 1].id : null
  );

  // Upcoming levels collapse
  const [isUpcomingLevelsExpanded, setIsUpcomingLevelsExpanded] = useState<boolean>(false);

  // Teacher modal to add material
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLevelId, setNewLevelId] = useState('level_1');
  const [newUnit, setNewUnit] = useState(1);
  const [newType, setNewType] = useState<'pdf' | 'audio' | 'video' | 'quiz' | 'slides'>('pdf');
  const [newUrl, setNewUrl] = useState('');

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const targetLevel = ENGLISH_LEVELS.find(l => l.id === newLevelId) || ENGLISH_LEVELS[0];
    const created: ClassroomMaterial = {
      id: `mat_${Date.now()}`,
      levelId: newLevelId,
      levelTitle: `${targetLevel.levelName} - ${targetLevel.book}`,
      unit: Number(newUnit),
      title: newTitle,
      description: newDesc,
      type: newType,
      url: newUrl || 'https://classroom.google.com/',
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setMaterials(prev => [created, ...prev]);
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewUrl('');
  };

  // Helper to get materials for a level
  const getMaterialsForLevel = (lvlId: string) => {
    return materials.filter(m => {
      if (m.levelId !== lvlId) return false;
      if (typeFilter !== 'all' && m.type !== typeFilter) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        return m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q);
      }
      return true;
    });
  };

  // Helper to get audio tracks for a level
  const getAudioTracksForLevel = (lvlId: string) => {
    return OFFICIAL_AUDIO_TRACKS.filter(a => {
      if (a.levelId !== lvlId) return false;
      if (typeFilter !== 'all' && typeFilter !== 'audio') return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        return a.title.toLowerCase().includes(q);
      }
      return true;
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6 animate-fadeIn">

      {/* TOP HEADER & ACTION BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <GraduationCap className="w-4 h-4" />
                <span>Academic Library • Repositorio Oficial</span>
              </span>
              <span className="text-xs text-blue-200 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                McGraw-Hill Super Goal & Mega Goal
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Library • Libros, Audios & Guías por Nivel
            </h1>

            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Consulta y descarga en un solo lugar los <strong>Student Books</strong> oficiales, 
              hojas de trabajo del <strong>Workbook</strong>, pistas de audio fonéticas y recursos asignados por tus teachers.
            </p>

            {/* Current student level badge */}
            <div className="flex items-center gap-3 pt-1">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-300">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Nivel Actual: <strong>{activeLevelData.levelName} ({activeLevelData.book})</strong></span>
              </div>
              <span className="text-xs text-blue-200">
                CEFR: <strong>{activeLevelData.cefrEquiv}</strong>
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            {onGoToClassroom && (
              <button
                onClick={onGoToClassroom}
                className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-md transition-transform hover:scale-102 flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-slate-900" />
                <span>Ir al Classroom (Clase Activa)</span>
                <ArrowRight className="w-4 h-4 text-slate-900" />
              </button>
            )}

            <a
              href={OFFICIAL_BOOK_LINKS[activeLevelData.id]?.folderUrl || 'https://drive.google.com/drive/folders/18M-iUz1w4PTH2kaTkoXGj6p02fs1MYtc'}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
              title="Abrir Carpeta General de Drive con todos los materiales oficiales del nivel"
            >
              <FolderOpen className="w-4 h-4 text-blue-300" />
              <span>Carpeta Drive de Materiales</span>
              <ExternalLink className="w-3.5 h-3.5 text-blue-200" />
            </a>

            {isTeacher && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Subir Nuevo Material (Teacher)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROLS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Type pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-semibold">
          {[
            { id: 'all', label: 'Todos los Recursos' },
            { id: 'pdf', label: '📄 Libros & PDFs' },
            { id: 'audio', label: '🎧 Audios MP3' },
            { id: 'slides', label: '📑 Diapositivas' },
            { id: 'quiz', label: '🕹️ Quizzes' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setTypeFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                typeFilter === f.id
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por tema, unidad o libro..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* LIVE GOOGLE CLASSROOM DETECTED COURSES */}
      {liveCourses.length > 0 && (
        <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                Cursos Activos Vinculados en tu Google Classroom
              </h3>
            </div>
            <a
              href="https://classroom.google.com/"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              <span>Abrir Classroom</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {liveCourses.map(c => (
              <a
                key={c.id}
                href={c.alternateLink || 'https://classroom.google.com/'}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-white border border-blue-100 hover:border-blue-300 rounded-xl block text-xs shadow-2xs hover:shadow-xs transition-all"
              >
                <strong className="text-slate-900 block truncate">{c.name}</strong>
                <span className="text-slate-500 truncate block text-[11px] mt-0.5">{c.section || 'Clase regular'}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🌟 1. NIVEL ACTIVO DEL ALUMNO (CURRENT LEVEL - EXPANDIDO POR DEFECTO)      */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <span>Tu Nivel Activo:</span>
              <span className="text-indigo-600">{activeLevelData.levelName}</span>
              <span className="text-slate-400 font-normal text-sm">({activeLevelData.book})</span>
            </h2>
          </div>
          <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
            En Curso • 100% Desbloqueado
          </span>
        </div>

        {/* Level Overview Card with Direct Official Books & Audios */}
        <div className="bg-white rounded-3xl border-2 border-indigo-200 shadow-md p-6 space-y-6">
          
          {/* Official Book Download Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student Book */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/80 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md font-mono">
                    {OFFICIAL_BOOK_LINKS[activeLevelData.id]?.studentBookCode || 'SG01-SB-U'} • Student Book Oficial
                  </span>
                  <span className="text-xs font-bold text-amber-700">PDF Alta Resolución</span>
                </div>
                <h3 className="font-black text-slate-900 text-base">
                  {activeLevelData.book} — Student Book Completo
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Contiene todas las lecciones del Student Book, gramática, audios integrados, lecturas y vocabulario.
                </p>
                <div className="text-[11px] text-amber-800 font-medium bg-amber-100/60 p-2 rounded-lg border border-amber-200/60">
                  Código: <strong className="font-mono">{OFFICIAL_BOOK_LINKS[activeLevelData.id]?.studentBookCode || 'SG01-SB-U'}</strong> (SG: Super Goal • SB: Student Book • U: Unit)
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <a
                  href={OFFICIAL_BOOK_LINKS[activeLevelData.id]?.studentBookUrl || 'https://drive.google.com/file/d/13JNZQ1NpbLF-DodPPkAnHVaMaPqkImmw/view?usp=drive_link'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 px-4 bg-slate-950 hover:bg-slate-900 text-amber-300 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Abrir Student Book (PDF)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                </a>
              </div>
            </div>

            {/* Workbook */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200/80 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 bg-blue-200/80 px-2 py-0.5 rounded-md font-mono">
                    {OFFICIAL_BOOK_LINKS[activeLevelData.id]?.workbookCode || 'SG01-WB-U'} • Workbook Oficial
                  </span>
                  <span className="text-xs font-bold text-blue-700">Ejercicios & Tareas</span>
                </div>
                <h3 className="font-black text-slate-900 text-base">
                  {activeLevelData.book} — Workbook de Ejercicios
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cuaderno de trabajo para resolver tareas requeridas y práctica analítica de escritura y gramática.
                </p>
                <div className="text-[11px] text-blue-800 font-medium bg-blue-100/60 p-2 rounded-lg border border-blue-200/60">
                  Código: <strong className="font-mono">{OFFICIAL_BOOK_LINKS[activeLevelData.id]?.workbookCode || 'SG01-WB-U'}</strong> (SG: Super Goal • WB: WorkBook • U: Unit)
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <a
                  href={OFFICIAL_BOOK_LINKS[activeLevelData.id]?.workbookUrl || 'https://drive.google.com/file/d/17Oqq95rEd2Qy9fbltoHA_86jYBOoyitE/view?usp=drive_link'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 px-4 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                >
                  <FileText className="w-4 h-4 text-blue-200" />
                  <span>Abrir Workbook (PDF)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-blue-200" />
                </a>
              </div>
            </div>
          </div>

          {/* Audio Tracks for Current Level */}
          {getAudioTracksForLevel(activeLevelData.id).length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-indigo-600" />
                  <h4 className="font-bold text-slate-900 text-sm">
                    Pistas de Audio Oficiales CD1 (Listening & Fonética)
                  </h4>
                </div>
                <span className="text-xs text-slate-500">McGraw-Hill Native Audio</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {getAudioTracksForLevel(activeLevelData.id).map(track => {
                  const isPlaying = playingTrackId === track.id;
                  return (
                    <div
                      key={track.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isPlaying
                          ? 'border-indigo-400 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-400'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <button
                        onClick={() => handleTogglePlayAudio(track)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                          isPlaying
                            ? 'bg-indigo-600 text-white shadow-sm scale-105'
                            : 'bg-white text-indigo-600 border border-slate-200 hover:bg-indigo-50'
                        }`}
                        title={isPlaying ? 'Pausar audio' : 'Reproducir audio'}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>

                      <div className="min-w-0 flex-1">
                        <strong className="text-xs font-bold text-slate-900 block truncate">
                          {track.title}
                        </strong>
                        <span className="text-[11px] text-slate-500 block">
                          Duración: {track.duration}
                        </span>
                      </div>

                      <button
                        onClick={() => downloadUnitAudio(track.trackNum)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors shrink-0"
                        title="Descargar archivo MP3"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Specific Uploaded / Unit Materials for Current Level */}
          {getMaterialsForLevel(activeLevelData.id).length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Materiales de Trabajo y Guías de Unidad ({activeLevelData.book})</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {getMaterialsForLevel(activeLevelData.id).map(mat => (
                  <div
                    key={mat.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          Unidad {mat.unit}
                        </span>
                        <span className="text-slate-400">{mat.type.toUpperCase()}</span>
                      </div>
                      <h5 className="font-bold text-slate-900 text-xs line-clamp-2 mt-1">
                        {mat.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        {mat.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">{mat.updatedAt}</span>
                      <a
                        href={mat.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <span>Abrir</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 📂 2. NIVELES ANTERIORES (PLEGABLES / ACORDEÓN PARA REPASO SIN SOBRECARGA) */}
      {/* ========================================================================= */}
      <section className="space-y-3">
        {previousLevels.length > 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            {/* Header Accordion Button for Previous Levels */}
            <button
              onClick={() => setIsPreviousLevelsExpanded(prev => !prev)}
              className="w-full p-5 sm:p-6 text-left flex items-center justify-between bg-slate-50/80 hover:bg-slate-100/80 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <FolderArchive className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-slate-900 text-base">
                      Material de Niveles Anteriores (Repaso)
                    </h3>
                    <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
                      {previousLevels.length} {previousLevels.length === 1 ? 'nivel anterior' : 'niveles anteriores'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isPreviousLevelsExpanded
                      ? 'Haz clic para contraer y enfocar tu plataforma en tu nivel actual.'
                      : 'Todo tu material previo está ordenado aquí. Haz clic para desplegarlo si deseas repasar.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 shrink-0">
                <span>{isPreviousLevelsExpanded ? 'Contraer' : 'Desplegar'}</span>
                {isPreviousLevelsExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            {/* Expanded Content: Accordion per previous level */}
            {isPreviousLevelsExpanded && (
              <div className="p-5 sm:p-6 border-t border-slate-200 space-y-4 bg-slate-50/30">
                <div className="space-y-3">
                  {previousLevels.map(lvl => {
                    const isOpen = expandedPreviousLevelId === lvl.id;
                    const lvlMaterials = getMaterialsForLevel(lvl.id);
                    const lvlAudios = getAudioTracksForLevel(lvl.id);

                    return (
                      <div
                        key={lvl.id}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs"
                      >
                        {/* Sub-level header toggle */}
                        <button
                          onClick={() => setExpandedPreviousLevelId(isOpen ? null : lvl.id)}
                          className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                              {lvl.levelName}
                            </span>
                            <strong className="text-sm font-bold text-slate-900">
                              {lvl.book} — {lvl.moduleName}
                            </strong>
                            <span className="text-xs text-slate-400">({lvl.cefrEquiv})</span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>{isOpen ? 'Ocultar' : 'Ver libros y audios'}</span>
                            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </button>

                        {/* Sub-level content */}
                        {isOpen && (
                          <div className="p-4 sm:p-5 border-t border-slate-100 space-y-4 bg-slate-50/50">
                            {/* Book Links */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <a
                                href={OFFICIAL_BOOK_LINKS[lvl.id]?.studentBookUrl || 'https://drive.google.com/file/d/13JNZQ1NpbLF-DodPPkAnHVaMaPqkImmw/view?usp=drive_link'}
                                target="_blank"
                                rel="noreferrer"
                                className="p-3 bg-white border border-slate-200 hover:border-indigo-300 rounded-xl flex items-center justify-between gap-2 text-xs font-bold text-slate-800 transition-colors shadow-2xs"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <BookOpen className="w-4 h-4 text-amber-500 shrink-0" />
                                  <span className="truncate">
                                    <span className="font-mono text-amber-800 text-[10px] bg-amber-100 px-1.5 py-0.5 rounded mr-1">
                                      {OFFICIAL_BOOK_LINKS[lvl.id]?.studentBookCode || 'SB'}
                                    </span>
                                    {lvl.book} • Student Book
                                  </span>
                                </div>
                                <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              </a>

                              <a
                                href={OFFICIAL_BOOK_LINKS[lvl.id]?.workbookUrl || 'https://drive.google.com/file/d/17Oqq95rEd2Qy9fbltoHA_86jYBOoyitE/view?usp=drive_link'}
                                target="_blank"
                                rel="noreferrer"
                                className="p-3 bg-white border border-slate-200 hover:border-indigo-300 rounded-xl flex items-center justify-between gap-2 text-xs font-bold text-slate-800 transition-colors shadow-2xs"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                                  <span className="truncate">
                                    <span className="font-mono text-blue-800 text-[10px] bg-blue-100 px-1.5 py-0.5 rounded mr-1">
                                      {OFFICIAL_BOOK_LINKS[lvl.id]?.workbookCode || 'WB'}
                                    </span>
                                    {lvl.book} • Workbook
                                  </span>
                                </div>
                                <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              </a>
                            </div>

                            {/* Audio tracks for this previous level if any */}
                            {lvlAudios.length > 0 && (
                              <div className="space-y-2 pt-2 border-t border-slate-100">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                                  Pistas de Audio de Repaso:
                                </span>
                                <div className="grid sm:grid-cols-2 gap-2">
                                  {lvlAudios.map(track => {
                                    const isPlaying = playingTrackId === track.id;
                                    return (
                                      <div
                                        key={track.id}
                                        className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-2 text-xs"
                                      >
                                        <button
                                          onClick={() => handleTogglePlayAudio(track)}
                                          className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
                                        >
                                          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                        </button>
                                        <span className="truncate flex-1 font-medium text-slate-800 text-[11px]">{track.title}</span>
                                        <button
                                          onClick={() => downloadUnitAudio(track.trackNum)}
                                          className="p-1 text-slate-400 hover:text-slate-700"
                                          title="Descargar MP3"
                                        >
                                          <Download className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Uploaded Materials */}
                            {lvlMaterials.length > 0 && (
                              <div className="space-y-2 pt-2 border-t border-slate-100">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                                  Guías y Material Adicional ({lvl.book}):
                                </span>
                                <div className="grid sm:grid-cols-2 gap-2">
                                  {lvlMaterials.map(mat => (
                                    <a
                                      key={mat.id}
                                      href={mat.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-2.5 bg-white border border-slate-200 hover:border-indigo-300 rounded-xl flex items-center justify-between gap-2 text-xs transition-colors"
                                    >
                                      <div className="truncate">
                                        <strong className="block text-slate-900 truncate text-[11px]">U{mat.unit}: {mat.title}</strong>
                                        <span className="text-[10px] text-slate-400">{mat.type.toUpperCase()}</span>
                                      </div>
                                      <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-500 flex items-center gap-3">
            <span className="text-xl">🌱</span>
            <span>
              Estás en el nivel inicial (<strong>{activeLevelData.levelName}</strong>). 
              A medida que apruebes evaluaciones y avances con tus teachers, 
              tus materiales previos se guardarán en una sección plegable aquí para cuando quieras repasar.
            </span>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 🔒 3. PRÓXIMOS NIVELES (VISTA PREVIA PLEGABLE / PENSUM COMPLETO)          */}
      {/* ========================================================================= */}
      {upcomingLevels.length > 0 && (
        <section className="space-y-3">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <button
              onClick={() => setIsUpcomingLevelsExpanded(prev => !prev)}
              className="w-full p-5 sm:p-6 text-left flex items-center justify-between bg-slate-50/60 hover:bg-slate-100/60 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">
                      Próximos Niveles del Pensum ({upcomingLevels.length} niveles por desbloquear)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isUpcomingLevelsExpanded
                      ? 'Haz clic para contraer la vista de niveles futuros.'
                      : 'Explora los títulos y libros que desbloquearás al completar tu nivel actual.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 shrink-0">
                <span>{isUpcomingLevelsExpanded ? 'Contraer' : 'Ver futuros'}</span>
                {isUpcomingLevelsExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            {isUpcomingLevelsExpanded && (
              <div className="p-5 sm:p-6 border-t border-slate-200 bg-slate-50/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {upcomingLevels.map(lvl => (
                    <div
                      key={lvl.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white/70 space-y-2 opacity-80"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          {lvl.levelName}
                        </span>
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs">{lvl.book}</h4>
                      <p className="text-[11px] text-slate-500">{lvl.moduleName}</p>
                      <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                        <span>{lvl.units} Unidades</span>
                        <span>CEFR: {lvl.cefrEquiv}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 👩‍🏫 MODAL: SUBIR MATERIAL (SOLO TEACHERS)                                    */}
      {/* ========================================================================= */}
      {showAddModal && isTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-black text-slate-900">Añadir Recurso a Library (Teacher Portal)</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMaterial} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nivel Destino</label>
                <select
                  value={newLevelId}
                  onChange={e => setNewLevelId(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-white text-slate-800"
                >
                  {ENGLISH_LEVELS.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.levelName}: {l.book} ({l.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unidad</label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={newUnit}
                    onChange={e => setNewUnit(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipo de Archivo</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs bg-white text-slate-800"
                  >
                    <option value="pdf">PDF / Libro / Guía</option>
                    <option value="audio">Audio / MP3</option>
                    <option value="slides">Presentación / Diapositivas</option>
                    <option value="video">Video de Clase</option>
                    <option value="quiz">Quiz / Ejercicios</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Título del Material</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Ej. Unit 2: Regular vs Irregular Verbs Cheat Sheet"
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Descripción o Instrucciones</label>
                <textarea
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Instrucciones para los alumnos de tu grupo..."
                  rows={2}
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Enlace (Google Drive o Google Classroom)</label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  placeholder="https://drive.google.com/... o https://classroom.google.com/..."
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 text-xs font-semibold hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-sm"
                >
                  Guardar en Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
