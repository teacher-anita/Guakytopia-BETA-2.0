import React, { useState } from 'react';
import { 
  BookOpen, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  Video, 
  Award, 
  Calendar, 
  Copy, 
  ExternalLink, 
  Play, 
  FileText, 
  Trophy, 
  ArrowRight,
  Shield,
  Layers,
  Zap,
  HelpCircle,
  Eye,
  KeyRound,
  Compass,
  Lightbulb,
  Globe2,
  Banknote,
  Download,
  FolderOpen
} from 'lucide-react';
import { Student, AudienceTheme } from '../types';
import { User } from 'firebase/auth';
import { PATHWAY_LEVELS, PathwayLevel, PathwayUnit, PathwaySession } from '../data/pathwayData';
import { UnitQuizModal } from './UnitQuizModal';
import { UnitOneMasterClass } from './UnitOneMasterClass';
import { downloadUnitPdf, downloadUnitAudio } from '../services/materialDownloader';
import { formatSlotLabel } from '../utils/scheduleFormatter';
import { trackStudentAction } from '../services/telemetryService';

interface LearningPathwayProps {
  currentStudent: Student | null;
  user?: User | null;
  activeRole: 'student' | 'teacher';
  audienceTheme: AudienceTheme;
  onOpenRegister: () => void;
  onOpenPlacementTest: () => void;
  onOpenCouponModal: () => void;
  onOpenPaymentModal?: () => void;
  onAwardXp: (studentId: string, amount: number) => void;
  onGoToClassroom?: () => void;
  onGoToLibrary?: () => void;
  onUpdateStudent?: (student: Student) => void;
}

export const LearningPathway: React.FC<LearningPathwayProps> = ({
  currentStudent,
  user,
  activeRole,
  audienceTheme,
  onOpenRegister,
  onOpenPlacementTest,
  onOpenCouponModal,
  onOpenPaymentModal,
  onAwardXp,
  onGoToClassroom,
  onGoToLibrary,
  onUpdateStudent
}) => {
  const isTeacher = activeRole === 'teacher';
  // A student is enrolled if their status is 'enrolled'
  const isEnrolled = isTeacher || (currentStudent && currentStudent.status === 'enrolled');

  // Level selection (defaults to current student's level or level_1)
  const [selectedLevelId, setSelectedLevelId] = useState<string>(
    currentStudent?.levelId || 'level_1'
  );

  // Level 1 language mode: English first, with an optional playful Spanglish bridge.
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
      // Keep the mode usable if browser storage is unavailable.
    }
  };

  // Selected Unit for Quiz
  const [quizUnit, setQuizUnit] = useState<PathwayUnit | null>(null);

  // Selected Master Unit View (Unit 1 Master Experience - null by default to show pathway overview)
  const [selectedMasterUnit, setSelectedMasterUnit] = useState<number | null>(null);

  // Completed sessions tracking in local state
  const [completedSessions, setCompletedSessions] = useState<Record<string, boolean>>({});

  // Classroom copy notification
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);

  // Track units whose quizzes have been passed (persisted in localStorage per student)
  const [passedUnitQuizzes, setPassedUnitQuizzes] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`cokito_passed_quizzes_${currentStudent?.id || 'default'}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Placement test notice dismissed state per student
  const [isQuizNoticeDismissed, setIsQuizNoticeDismissed] = useState<boolean>(() => {
    if (!currentStudent) return true;
    try {
      return localStorage.getItem(`cokito_quiz_dismissed_${currentStudent.id}`) === 'true';
    } catch {
      return false;
    }
  });

  const handleDismissQuizNotice = () => {
    setIsQuizNoticeDismissed(true);
    if (currentStudent) {
      try {
        localStorage.setItem(`cokito_quiz_dismissed_${currentStudent.id}`, 'true');
      } catch {}
    }
  };

  const activeLevel = PATHWAY_LEVELS.find(l => l.levelId === selectedLevelId) || PATHWAY_LEVELS[0];

  // Explorer mode for students to look at other levels without losing their official path
  const [isExplorerMode, setIsExplorerMode] = useState(false);

  // Item-by-item granular tracking (Confirmed by Teacher)
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    if (currentStudent?.completedUnitItems) {
      currentStudent.completedUnitItems.forEach(k => { map[k] = true; });
    }
    return map;
  });

  // Items marked by student during self-study or live class, awaiting Teacher confirmation
  const [pendingItems, setPendingItems] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    if (currentStudent?.pendingUnitItems) {
      currentStudent.pendingUnitItems.forEach(k => { map[k] = true; });
    }
    return map;
  });

  const toggleSessionCompletion = (sessionKey: string) => {
    setCompletedSessions(prev => {
      const nextVal = !prev[sessionKey];
      if (nextVal && currentStudent) {
        onAwardXp(currentStudent.id, 25);
      }
      return { ...prev, [sessionKey]: nextVal };
    });
  };

  const handleTeacherAssignUnit = (newUnitNum: number) => {
    if (!currentStudent || !onUpdateStudent) return;
    onUpdateStudent({
      ...currentStudent,
      currentUnit: newUnitNum
    });
    setCopiedNotice(`🎓 Unidad ${newUnitNum} asignada como oficial para ${currentStudent.name}`);
    setTimeout(() => setCopiedNotice(null), 3000);
  };

  const toggleItemCompletion = (
    unit: PathwayUnit,
    itemNumber: number,
    itemTitle: string,
    session: PathwaySession
  ) => {
    const itemKey = `u${unit.unitNumber}_it${itemNumber}`;

    if (!isTeacher) {
      // Student Flow: Mark as pending verification by Teacher Cokitö
      const nextPendingVal = !pendingItems[itemKey];
      const newPending = { ...pendingItems, [itemKey]: nextPendingVal };
      setPendingItems(newPending);

      const pendingKeysList = Object.keys(newPending).filter(k => newPending[k]);

      if (currentStudent && onUpdateStudent) {
        onUpdateStudent({
          ...currentStudent,
          pendingUnitItems: pendingKeysList
        });
      }

      setCopiedNotice(
        nextPendingVal
          ? `🟡 Ítem ${itemNumber} marcado por ti. Pendiente de confirmación por Teacher Cokitö para sumar XP.`
          : `Ítem ${itemNumber} desmarcado.`
      );
      setTimeout(() => setCopiedNotice(null), 3500);
      return;
    }

    // Teacher Flow: Direct official confirmation
    const nextVal = !completedItems[itemKey];
    const newItems = { ...completedItems, [itemKey]: nextVal };
    const newPending = { ...pendingItems, [itemKey]: false };
    setCompletedItems(newItems);
    setPendingItems(newPending);

    if (nextVal && currentStudent) {
      onAwardXp(currentStudent.id, 10);
    }

    const allSessionDone = session.items.every(it => 
      it.number === itemNumber ? nextVal : newItems[`u${unit.unitNumber}_it${it.number}`]
    );
    const sessionKey = `${unit.unitNumber}_${session.sessionCode}`;
    setCompletedSessions(prev => ({ ...prev, [sessionKey]: allSessionDone }));

    const completedKeysList = Object.keys(newItems).filter(k => newItems[k]);
    const pendingKeysList = Object.keys(newPending).filter(k => newPending[k]);

    const unitNums = completedKeysList
      .filter(k => k.startsWith(`u${unit.unitNumber}_it`))
      .map(k => parseInt(k.replace(`u${unit.unitNumber}_it`, ''), 10))
      .filter(n => !isNaN(n));
    const maxCompleted = unitNums.length > 0 ? Math.max(...unitNums) : 0;
    const allUnitItems = unit.sessions.flatMap(s => s.items);
    const lastItemObj = allUnitItems.find(it => it.number === maxCompleted);
    const nextItemObj = allUnitItems.find(it => it.number === maxCompleted + 1);

    const updatedHandover = {
      lastCompletedUnit: unit.unitNumber,
      lastCompletedItemNumber: maxCompleted,
      lastCompletedItemTitle: lastItemObj ? lastItemObj.title : (maxCompleted > 0 ? `Ítem ${maxCompleted}` : 'Por iniciar'),
      nextItemNumber: maxCompleted + 1,
      nextItemTitle: nextItemObj ? nextItemObj.title : (maxCompleted >= allUnitItems.length ? '¡Unidad Completada! 🎉' : `Ítem ${maxCompleted + 1}`),
      teacherNote: currentStudent?.unitHandover?.teacherNote || '',
      teacherName: 'Teacher Cokitö',
      updatedAt: new Date().toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    if (currentStudent && onUpdateStudent) {
      onUpdateStudent({
        ...currentStudent,
        currentUnit: unit.unitNumber,
        completedUnitItems: completedKeysList,
        pendingUnitItems: pendingKeysList,
        unitHandover: updatedHandover
      });
    }
  };

  const handleTeacherConfirmPending = (
    unit: PathwayUnit,
    itemNumber: number
  ) => {
    const itemKey = `u${unit.unitNumber}_it${itemNumber}`;
    const newItems = { ...completedItems, [itemKey]: true };
    const newPending = { ...pendingItems, [itemKey]: false };
    setCompletedItems(newItems);
    setPendingItems(newPending);

    if (currentStudent) {
      onAwardXp(currentStudent.id, 15);
    }

    const completedKeysList = Object.keys(newItems).filter(k => newItems[k]);
    const pendingKeysList = Object.keys(newPending).filter(k => newPending[k]);

    const unitNums = completedKeysList
      .filter(k => k.startsWith(`u${unit.unitNumber}_it`))
      .map(k => parseInt(k.replace(`u${unit.unitNumber}_it`, ''), 10))
      .filter(n => !isNaN(n));
    const maxCompleted = unitNums.length > 0 ? Math.max(...unitNums) : 0;
    const allUnitItems = unit.sessions.flatMap(s => s.items);
    const lastItemObj = allUnitItems.find(it => it.number === maxCompleted);
    const nextItemObj = allUnitItems.find(it => it.number === maxCompleted + 1);

    const updatedHandover = {
      lastCompletedUnit: unit.unitNumber,
      lastCompletedItemNumber: maxCompleted,
      lastCompletedItemTitle: lastItemObj ? lastItemObj.title : (maxCompleted > 0 ? `Ítem ${maxCompleted}` : 'Por iniciar'),
      nextItemNumber: maxCompleted + 1,
      nextItemTitle: nextItemObj ? nextItemObj.title : (maxCompleted >= allUnitItems.length ? '¡Unidad Completada! 🎉' : `Ítem ${maxCompleted + 1}`),
      teacherNote: currentStudent?.unitHandover?.teacherNote || '',
      teacherName: 'Teacher Cokitö',
      updatedAt: new Date().toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    if (currentStudent && onUpdateStudent) {
      onUpdateStudent({
        ...currentStudent,
        completedUnitItems: completedKeysList,
        pendingUnitItems: pendingKeysList,
        unitHandover: updatedHandover
      });
    }

    setCopiedNotice(`✅ Ítem ${itemNumber} validado y confirmado por Teacher Cokitö (+15 XP)`);
    setTimeout(() => setCopiedNotice(null), 3000);
  };

  const handleTeacherConfirmAllPendingInUnit = (unit: PathwayUnit) => {
    const nextPending = { ...pendingItems };
    const nextCompleted = { ...completedItems };
    let confirmedCount = 0;

    unit.sessions.flatMap(s => s.items).forEach(it => {
      const key = `u${unit.unitNumber}_it${it.number}`;
      if (nextPending[key]) {
        nextPending[key] = false;
        nextCompleted[key] = true;
        confirmedCount++;
      }
    });

    setPendingItems(nextPending);
    setCompletedItems(nextCompleted);

    if (currentStudent && confirmedCount > 0) {
      onAwardXp(currentStudent.id, confirmedCount * 15);
    }

    const completedKeysList = Object.keys(nextCompleted).filter(k => nextCompleted[k]);
    const pendingKeysList = Object.keys(nextPending).filter(k => nextPending[k]);

    if (currentStudent && onUpdateStudent) {
      onUpdateStudent({
        ...currentStudent,
        completedUnitItems: completedKeysList,
        pendingUnitItems: pendingKeysList
      });
    }

    setCopiedNotice(`✅ ${confirmedCount} ítems confirmados por Teacher Cokitö (+${confirmedCount * 15} XP)`);
    setTimeout(() => setCopiedNotice(null), 3500);
  };

  const handleCopyClassroomTemplate = (unit: PathwayUnit, session: PathwaySession) => {
    const template = `📌 TITLE: [M${activeLevel.module}-N${activeLevel.levelNumber}-U${unit.unitNumber}-${session.sessionCode}] Unit ${unit.unitNumber}: ${unit.title} — ${session.sessionName}

Hello, everyone! Welcome to your mission with La Teacher Cokitö! 👋✨

📖 1. CLASSROOM WORK (${activeLevel.book} - ${unit.sbPages}):
${session.items.map(it => `• Item ${it.number}: ${it.title} (${it.description})`).join('\n')}

${session.workbookPages ? `📝 2. HOMEWORK / WORKBOOK (Required assignment):
• Complete pages: ${session.workbookPages}.
• Upload your completed photos or PDF scan here on Google Classroom.` : '📝 2. REINFORCEMENT: Review and practice your class notes.'}

🕹️ 3. INTERACTIVE UNIT QUIZ:
• Log into the platform and take the Unit Quiz to earn +50 XP for your Cokitö streak!

🦜 GÜAKY CULTURE NOTE:
${unit.owlCulture.culturalStory}

💡 TIP COKITÖ: ${unit.tipCokito}`;

    navigator.clipboard.writeText(template);
    setCopiedNotice(`Template for [${unit.title} - ${session.sessionCode}] copied for Classroom!`);
    setTimeout(() => setCopiedNotice(null), 3500);
  };

  const handleQuizFinished = (score: number, total: number) => {
    if (!quizUnit) return;
    const isPassed = (score / total) >= 0.7; // 70% or more to pass
    if (isPassed) {
      const quizKey = `${selectedLevelId}_u${quizUnit.unitNumber}`;
      setPassedUnitQuizzes(prev => {
        const updated = { ...prev, [quizKey]: true };
        if (currentStudent) {
          localStorage.setItem(`cokito_passed_quizzes_${currentStudent.id}`, JSON.stringify(updated));
          onAwardXp(currentStudent.id, 50);
        }
        return updated;
      });

      // Synchronize student advancement to Firestore so the Directora sees their new unit!
      if (currentStudent && onUpdateStudent) {
        const nextUnit = Math.max(currentStudent.currentUnit || 1, quizUnit.unitNumber + 1);
        onUpdateStudent({
          ...currentStudent,
          currentUnit: nextUnit
        });
        void trackStudentAction(
          currentStudent,
          'hub',
          'Quiz Aprobado y Unidad Desbloqueada',
          `Aprobó Quiz de Unidad ${quizUnit.unitNumber} (${score}/${total} pts) • Avanzó a Unidad ${nextUnit}`
        );
      }

      setCopiedNotice(`🎉 ¡Aprobaste el Quiz de la Unidad ${quizUnit.unitNumber} (${score}/${total})! Siguiente unidad desbloqueada.`);
      setTimeout(() => setCopiedNotice(null), 5000);
    } else {
      if (currentStudent && currentStudent.id && currentStudent.id !== 'guest') {
        void trackStudentAction(
          currentStudent,
          'hub',
          'Intento de Quiz',
          `Completó Quiz de Unidad ${quizUnit.unitNumber} (${score}/${total} pts)`
        );
      }
      setCopiedNotice(`ℹ️ Obtuviste ${score}/${total} (requiere 70% para aprobar). ¡Repite el quiz para desbloquear la siguiente unidad!`);
      setTimeout(() => setCopiedNotice(null), 5000);
    }
  };

  // Check if a unit is unlocked based strictly on having passed the previous unit's quiz or official assigned unit!
  const isUnitUnlocked = (unitIndex: number) => {
    if (isTeacher) return true;
    if (unitIndex === 0) return true; // Unit 1 is always unlocked for enrolled students!
    
    // If student's official currentUnit in database is already at or past this unit, it is unlocked!
    if (currentStudent && (currentStudent.currentUnit || 1) > unitIndex) {
      return true;
    }

    // Previous unit must have passed its quiz
    const prevUnitNumber = unitIndex; // For unit index 1 (Unit 2), previous unit is Unit 1
    const prevQuizKey = `${selectedLevelId}_u${prevUnitNumber}`;
    return Boolean(passedUnitQuizzes[prevQuizKey]);
  };

  // IF NOT ENROLLED AND NOT TEACHER: LOCKED PREVIEW (GUEST SEES CURRICULAR OVERVIEW / GUEST MODE)
  if (!isEnrolled) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 animate-fadeIn">

        {/* Paywall Banner: Guest Mode / Modo Invitado */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFD166] bg-[#FFD166]/20 px-3 py-1 rounded-full border border-[#FFD166]/30 inline-block">
              🔒 Modo Guest • Vista Previa de Invitado
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Güakypedia • Pensum Oficial & Flights de Güakytopia
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Estás navegando en <strong>Modo Guest</strong>. Como invitado puedes explorar los títulos de los niveles y módulos. <strong>La descarga de libros y guías oficiales en PDF, las pistas de audio, los quizzes y las clases en vivo están estrictamente reservados para alumnos afiliados.</strong> Para desbloquear todo el material, valida tu afiliación de $5 o ingresa tu código de beca:
            </p>
          </div>

          <div className="p-4 sm:p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 max-w-lg mx-auto text-xs text-slate-200 text-left space-y-2.5">
            <p className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FFD166] shrink-0" />
              <span>¿Qué desbloqueas en Güakytopia con tu Afiliación?</span>
            </p>
            <ul className="space-y-1.5 list-disc list-inside text-slate-100">
              <li><strong>Descarga de Libros & Guías (PDF):</strong> Material oficial completo de cada unidad y Workbook.</li>
              <li><strong>Audios Nativos MP3:</strong> Tracks de pronunciación fonética y listening de McGraw-Hill.</li>
              <li><strong>Güakytalkie Live Speaking:</strong> Clases y conversación en vivo con tutores en grupos reducidos.</li>
              <li><strong>Güaky Interactive Quizzes:</strong> Evaluaciones interactivas con acumulación de XP y retos.</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 flex-wrap">
            <button
              onClick={onOpenCouponModal}
              className="w-full sm:w-auto px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-transform hover:scale-102 flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Validar con Código / Beca</span>
            </button>
            {onOpenPaymentModal && (
              <button
                onClick={onOpenPaymentModal}
                className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs sm:text-sm shadow-md transition-transform hover:scale-102 flex items-center justify-center gap-2"
              >
                <Banknote className="w-4 h-4" />
                <span>Validar con $5 (PayPal / Pago Móvil)</span>
              </button>
            )}
            <button
              onClick={onOpenRegister}
              className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-colors"
            >
              Crear Cuenta / Registrarme
            </button>
          </div>
        </div>

        {/* Preview of Modules Locked */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <span>Official Curriculum Preview (Locked)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PATHWAY_LEVELS.map(lvl => (
              <div
                key={lvl.levelId}
                className="bg-white rounded-2xl border border-slate-200 p-5 opacity-75 relative overflow-hidden space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    Module {lvl.module}: {lvl.moduleName}
                  </span>
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="font-black text-slate-800 text-base">{lvl.levelName}</h4>
                <p className="text-xs text-slate-500">{lvl.book}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>{lvl.units.length} Structured Units</span>
                  <span>CEFR Framework {lvl.cefrEquiv}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  }

  // ENROLLED / TEACHER: If Unit 1 Master Class is active, render the full immersive workspace!
  if (selectedMasterUnit === 1) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 space-y-4">
        <UnitOneMasterClass
          currentStudent={currentStudent}
          activeRole={activeRole}
          onAwardXp={onAwardXp}
          onClose={() => setSelectedMasterUnit(null)}
        />
      </div>
    );
  }

  // ENROLLED / TEACHER: FULL INTERACTIVE VIRTUAL CLASSROOM (100% ENGLISH IMMERSION)
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6 animate-fadeIn">
      
      {/* Toast Notice */}
      {copiedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{copiedNotice}</span>
        </div>
      )}

      {/* 1. INTERACTIVE LANGUAGE MODE SWITCH */}
      <div className={`rounded-2xl px-4 sm:px-5 py-3 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md transition-colors ${isSpanglish ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500' : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700'}`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xl shrink-0">{isSpanglish ? '🌈' : '🇬🇧 🇺🇸'}</span>
          <div>
            <strong className="text-xs font-black uppercase tracking-wider block">
              {isSpanglish ? 'Spanglish Party • ¡Mix It Up!' : 'English Only • Immersion Mode'}
            </strong>
            <span className="text-[11px] text-white/90 block mt-0.5">
              {isSpanglish
                ? 'English leads the way, with Spanish hints when you need a boost. ¡You got this!'
                : 'Welcome to the Cokitö Classroom! Speak, read, think, and dream in English.'}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleLanguageMode}
          aria-pressed={isSpanglish}
          aria-label={`Switch to ${isSpanglish ? 'English Only Immersion Mode' : 'Spanglish Party mode'}`}
          className={`inline-flex items-center justify-center gap-2 self-start sm:self-auto shrink-0 px-4 py-2 rounded-xl text-xs font-black border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 ${isSpanglish ? 'bg-white text-violet-700 border-white hover:bg-violet-50' : 'bg-white/15 text-white border-white/50 hover:bg-white/25'}`}
        >
          <Globe2 className="w-4 h-4" />
          {isSpanglish ? 'Switch to English Only' : 'Try Spanglish Party'}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* PLACEMENT QUIZ PENDING NOTIFICATION */}
      {!isTeacher && currentStudent && (!currentStudent.placementTestScore || currentStudent.placementTestScore === 0) && !isQuizNoticeDismissed && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-5 text-slate-950 shadow-xl border border-amber-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-xs flex items-center justify-center shrink-0 text-2xl shadow-xs">
              📝
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 text-amber-300 px-2.5 py-0.5 rounded-full">
                  Prueba Diagnóstica Pendiente
                </span>
                <span className="text-xs font-bold text-slate-900">Score actual: 0 / 50 pts</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-950 mt-1">
                ¿Deseas nivelar tu inglés con la prueba oficial de 50 preguntas?
              </h3>
              <p className="text-xs text-slate-900/90 max-w-2xl leading-relaxed">
                Aún no has realizado tu prueba de nivelación diagnóstica (Super Goal 1 a 4). Puedes realizarla ahora en unos minutos o saltarla y continuar con tus clases en tu nivel inicial.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 flex-wrap">
            <button
              type="button"
              onClick={handleDismissQuizNotice}
              className="px-4 py-2.5 bg-black/15 hover:bg-black/25 text-slate-950 rounded-xl font-bold text-xs transition-colors"
            >
              Saltar el quiz y hacerlo más tarde
            </button>
            <button
              type="button"
              onClick={onOpenPlacementTest}
              className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded-xl font-black text-xs shadow-md transition-all flex items-center gap-1.5 transform hover:scale-102"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Hacer el quiz ahora y nivelarme</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. CLASSROOM HERO BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-3 py-0.5 rounded-full border border-emerald-400/30">
                {isTeacher ? 'Teacher Mode • La Teacher Cokitö' : (isSpanglish ? 'Student Mode • ¡Let’s Learn!' : 'Official Enrolled Student')}
              </span>
              <span className="text-xs text-blue-200">
                {activeLevel.book}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {isTeacher ? 'Master Curriculum & Classroom Hub' : `Learning Pathway: ${currentStudent?.name || 'Student'}`}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              {isSpanglish ? 'Each unit has 3 sessions: A (Vocabulary & Grammar), B (Pronunciation & Real Talk), and C (Reading, Writing & Workbook). Complete your sessions and quizzes to earn XP. ¡Let’s go!' : 'Every unit follows our 3-session structure: Session A (Vocabulary & Grammar), Session B (Pronunciation & Real Talk), and Session C (Reading, Writing & Workbook). Complete sessions and quizzes to earn XP!'}
            </p>
          </div>

          {/* Quick Meet / Class info */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 space-y-3 min-w-[240px]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-200">{isSpanglish ? 'Next Live Class / Próxima clase:' : 'Next Live Class:'}</span>
              <span className="font-bold text-amber-300">Live on Meet</span>
            </div>
            <div className="text-xs font-semibold">
              <span className="block text-white">{isSpanglish ? 'Teacher / Profe: La Teacher Cokitö' : 'Teacher: La Teacher Cokitö'}</span>
              <span className="text-blue-200 text-[11px] block mt-0.5">
                {currentStudent?.assignedSlots && currentStudent.assignedSlots.length > 0
                  ? currentStudent.assignedSlots.map(s => formatSlotLabel(s)).join(' • ')
                  : 'Flexible scheduled time'}
              </span>
            </div>
            <a
              href="https://meet.google.com/eng-cokito-class"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-colors"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Join Google Meet</span>
            </a>
          </div>
        </div>

        {/* Level Switcher Pills */}
        <div role="group" aria-label="Seleccionar nivel curricular" className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs font-bold">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-slate-400 uppercase text-[10px] tracking-wider shrink-0">Nivel:</span>
            {PATHWAY_LEVELS.map(lvl => {
              const isStudentActive = lvl.levelId === (currentStudent?.levelId || 'level_1');
              const isSelected = selectedLevelId === lvl.levelId;
              return (
                <button
                  key={lvl.levelId}
                  onClick={() => setSelectedLevelId(lvl.levelId)}
                  aria-pressed={isSelected}
                  className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <span>{lvl.levelName}</span>
                  {isStudentActive && (
                    <span className="text-[9px] bg-slate-900 text-amber-300 px-1.5 py-0.2 rounded-md font-black">
                      Activo
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {onGoToLibrary && (
            <button
              onClick={onGoToLibrary}
              className="self-start sm:self-auto text-[11px] text-blue-200 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>Ver todos los libros en Library</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Book Format & Reference Notice */}
      <div className={`p-4 rounded-2xl border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        activeLevel.isIntegratedWorkbook
          ? 'bg-blue-50 border-blue-200 text-blue-950'
          : 'bg-purple-50 border-purple-200 text-purple-950'
      }`}>
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-blue-700 shrink-0" />
          <div>
            <strong className="block font-bold">
              {activeLevel.isIntegratedWorkbook ? 'SuperGoal Structure (Integrated Volume):' : 'MegaGoal Structure (Separate Volumes):'}
            </strong>
            <span className="text-[11px] opacity-80">
              {activeLevel.isIntegratedWorkbook
                ? 'Student Book and Workbook are combined in one volume (Workbook exercises start on page 89).'
                : 'Student Book and analytical Workbook are separate volumes for advanced critical writing practice.'}
            </span>
          </div>
        </div>
        <span className="text-[11px] font-bold bg-white px-3 py-1 rounded-xl shadow-2xs border border-slate-200">
          CEFR Standard: {activeLevel.cefrEquiv}
        </span>
      </div>

      {/* Units & Boss Fights Section with Quiz-based Lock Progression */}
      <div className="space-y-8">
        {activeLevel.units.map((unit, uIdx) => {
          const unlocked = isUnitUnlocked(uIdx);

          if (!unlocked) {
            const prevUnitNum = unit.unitNumber - 1;
            return (
              <div
                key={unit.unitNumber}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-0"
              >
                {/* Header locked */}
                <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                      <Lock className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-lg">
                          Unit {unit.unitNumber}
                        </span>
                        <h3 className="font-bold text-slate-800 text-base">{unit.title}</h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {unit.bookTitle} • {unit.sbPages}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-900 self-start sm:self-auto shadow-2xs">
                    <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{isSpanglish ? `Locked / Bloqueado • Pass Unit ${prevUnitNum} Quiz` : `Locked • Pass Unit ${prevUnitNum} Quiz to unlock`}</span>
                  </div>
                </div>

                <div className="p-6 bg-slate-50/50 space-y-2 text-xs text-slate-600">
                  <p>
                    🔒 <strong>{isSpanglish ? 'Learning checkpoint / Requisito:' : 'Unlock requirement:'}</strong> {isSpanglish ? <>To access Unit {unit.unitNumber}, primero completa Unit {prevUnitNum} and pass its official quiz with at least 70%.</> : <>Complete Unit {prevUnitNum} and pass its official quiz with at least 70% to unlock Unit {unit.unitNumber}.</>}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {isSpanglish ? <>Go back to Unit {prevUnitNum} y haz clic en <strong>"Unit Quiz (+50 XP)"</strong> to unlock your next mission.</> : <>Go back to Unit {prevUnitNum} and select the green <strong>"Unit Quiz (+50 XP)"</strong> button to take your interactive quiz.</>}
                  </p>
                </div>
              </div>
            );
          }

          return (
            <div
              key={unit.unitNumber}
              className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden transition-all hover:border-amber-400 space-y-0"
            >
              {/* 📥 DESCARGA OFICIAL REAL DIRECTO DE GOOGLE DRIVE */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 border-b-2 border-amber-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-slate-950 text-amber-300 flex items-center justify-center shrink-0 shadow-md">
                    <BookOpen className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-slate-950 text-amber-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                        📥 MATERIAL OFICIAL • UNIT {unit.unitNumber}
                      </span>
                      <strong className="text-xs sm:text-sm font-black text-slate-950">
                        {unit.bookTitle} — Unit {unit.unitNumber}: "{unit.title}"
                      </strong>
                    </div>
                    <p className="text-xs text-slate-900 font-medium max-w-2xl leading-snug">
                      {isSpanglish ? <>Download your <strong>Student Book</strong> ({unit.sbPages}) y las hojas de práctica del <strong>Workbook</strong> ({unit.wbPages}) en PDF.</> : <>Download your <strong>Student Book</strong> ({unit.sbPages}) and official <strong>Workbook</strong> practice pages ({unit.wbPages}) as PDFs.</>}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap w-full md:w-auto shrink-0">
                  {/* Real Student Book Google Drive Link (SG01-SB-U) */}
                  <a
                    href={unit.studentBookPdfUrl || 'https://drive.google.com/file/d/17Oqq95rEd2Qy9fbltoHA_86jYBOoyitE/view?usp=drive_link'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded-xl text-xs font-black shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                    title={`Abrir ${unit.studentBookCode || 'SG01-SB-U01'} (Student Book oficial) en Google Drive`}
                  >
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>{unit.studentBookCode || 'SG01-SB-U01'} • Student Book</span>
                  </a>

                  {/* Real Workbook Google Drive Link (SG01-WB-U) */}
                  <a
                    href={unit.workbookPdfUrl || 'https://drive.google.com/file/d/13JNZQ1NpbLF-DodPPkAnHVaMaPqkImmw/view?usp=drive_link'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-950 border-2 border-slate-900 rounded-xl text-xs font-black shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    title={`Abrir ${unit.workbookCode || 'SG01-WB-U01'} (Workbook oficial) en Google Drive`}
                  >
                    <FileText className="w-4 h-4 text-slate-900" />
                    <span>{unit.workbookCode || 'SG01-WB-U01'} • Workbook</span>
                  </a>

                  {/* Carpeta Drive General Nivel 1 (Docentes y Waky solamente) */}
                  {activeRole === 'teacher' && (
                    <a
                      href="https://drive.google.com/drive/folders/18M-iUz1w4PTH2kaTkoXGj6p02fs1MYtc"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 sm:flex-none px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      title="Abrir Carpeta Drive General con todos los materiales oficiales del Nivel 1 (Docente)"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span>Carpeta Drive (Docente)</span>
                    </a>
                  )}

                  {/* Audio MP3 */}
                  <button
                    onClick={() => downloadUnitAudio(unit.unitNumber === 1 ? 2 : 1)}
                    className="flex-1 sm:flex-none px-3.5 py-2.5 bg-white/90 hover:bg-white text-slate-700 border border-slate-300 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    title="Descargar tracks de audio oficial en MP3"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-700" />
                    <span>Audios MP3</span>
                  </button>
                </div>
              </div>

              {/* Unit Header */}
              <div className="p-5 sm:p-6 bg-slate-50/80 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black bg-blue-600 text-white px-2.5 py-0.5 rounded-lg">
                      Unit {unit.unitNumber}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{unit.bookTitle}</span>
                    <span className="text-xs text-slate-400">• {unit.sbPages}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    {unit.title}
                  </h3>
                  <p className="text-xs text-slate-600">
                    <strong>Grammar Focus:</strong> {unit.grammarFocus}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    <strong>Vocabulary:</strong> {unit.vocabularyTheme}
                  </p>
                </div>

                {/* Action Buttons for this Unit */}
                <div className="flex items-center gap-2 flex-wrap">
                  {onGoToClassroom && (
                    <button
                      onClick={onGoToClassroom}
                      className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black shadow-md transition-all active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-900" />
                      <span>{isSpanglish ? 'Open Classroom • ¡Entrar a clase!' : 'Open Interactive Classroom'}</span>
                    </button>
                  )}
                  {unit.unitNumber === 1 && activeLevel.levelId === 'level_1' && !onGoToClassroom && (
                    <button
                      onClick={() => setSelectedMasterUnit(1)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black shadow-md transition-all active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-900" />
                      <span>{isSpanglish ? 'Open Unit 1 Interactive Classroom • ¡Let’s go!' : 'Open Unit 1 Interactive Classroom'}</span>
                    </button>
                  )}
                  {onGoToLibrary && (
                    <button
                      onClick={onGoToLibrary}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-xl text-xs font-bold transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{isSpanglish ? 'Library • Libros & Audios' : 'Open in Library'}</span>
                    </button>
                  )}
                  <button
                    onClick={() => setQuizUnit(unit)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Unit Quiz (+50 XP)</span>
                  </button>
                </div>
              </div>

              {/* 3. GÜAKY TRIVIA & CULTURE CORNER */}
              <div className="p-5 sm:p-6 bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 text-white border-b border-indigo-900/60">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-teal-400/20 text-teal-300 border border-teal-400/30 flex items-center justify-center text-xl shadow-md">
                      🦜⚡
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                        Güaky Cultural Trivia
                      </span>
                      <h4 className="text-sm sm:text-base font-black text-white">
                        {unit.owlCulture.owlTitle}
                      </h4>
                    </div>
                  </div>

                  {unit.owlCulture.externalLink && (
                    <a
                      href={unit.owlCulture.externalLink.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-xl text-[11px] text-blue-200 font-semibold transition-colors"
                    >
                      <span>{unit.owlCulture.externalLink.label}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 space-y-1">
                    <span className="font-bold text-amber-300 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5" />
                      Did You Know?
                    </span>
                    <p className="text-blue-100/90 leading-relaxed text-[11px]">
                      {unit.owlCulture.didYouKnow}
                    </p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 space-y-1">
                    <span className="font-bold text-emerald-300 flex items-center gap-1">
                      <Globe2 className="w-3.5 h-3.5" />
                      Cultural Etiquette & Context
                    </span>
                    <p className="text-blue-100/90 leading-relaxed text-[11px]">
                      {unit.owlCulture.culturalStory}
                    </p>
                  </div>
                </div>

                {unit.owlCulture.inOnAtRule && (
                  <div className="mt-3 p-3 bg-amber-400/10 border border-amber-400/30 rounded-xl text-xs text-amber-200 flex items-center gap-2">
                    <span className="font-bold shrink-0">🎯 Master Rule:</span>
                    <span className="text-[11px]">{unit.owlCulture.inOnAtRule}</span>
                  </div>
                )}
              </div>

              {/* Bitácora de Relevo Docente & Progreso Granular de la Unidad */}
              {(() => {
                const totalUnitItems = unit.sessions.flatMap(s => s.items).length;
                const completedInUnit = unit.sessions.flatMap(s => s.items).filter(it => completedItems[`u${unit.unitNumber}_it${it.number}`]).length;
                const pct = Math.round((completedInUnit / (totalUnitItems || 1)) * 100);
                const hasHandover = currentStudent?.unitHandover && currentStudent.unitHandover.lastCompletedUnit === unit.unitNumber;

                return (
                  <div className="px-5 sm:px-6 pt-4 pb-1">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-amber-50/50 to-emerald-50/60 border border-indigo-200/80 space-y-2">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full font-black text-[10px] bg-indigo-600 text-white uppercase tracking-wider">
                            Bitácora & Relevo Docente
                          </span>
                          <span className="font-bold text-slate-800">
                            Avance Real: {completedInUnit} de {totalUnitItems} ítems cubiertos ({pct}%)
                          </span>
                        </div>
                        {isTeacher && (
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
                            🦉 Teacher Cokitö Mode: Haz clic en cualquier ítem para marcar avance
                          </span>
                        )}
                      </div>

                      {hasHandover && (
                        <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs border-t border-indigo-100 mt-1">
                          <div className="text-slate-700">
                            <span className="font-bold text-slate-900 block text-[11px]">Último punto alcanzado:</span>
                            <span className="text-emerald-700 font-semibold">{currentStudent?.unitHandover?.lastCompletedItemTitle}</span>
                          </div>
                          <div className="text-slate-700">
                            <span className="font-bold text-slate-900 block text-[11px]">Siguiente a ver en la próxima clase:</span>
                            <span className="text-indigo-700 font-semibold">{currentStudent?.unitHandover?.nextItemTitle}</span>
                          </div>
                          {currentStudent?.unitHandover?.teacherNote && (
                            <div className="col-span-full bg-white/80 p-2 rounded-xl border border-indigo-100 text-[11px] text-slate-700 mt-0.5">
                              <span className="font-bold text-slate-900">Nota para el próximo Teacher: </span>
                              <span>"{currentStudent.unitHandover.teacherNote}"</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* The 3 Sessions: A, B, C (Micro-chunking) */}
              <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {unit.sessions.map(session => {
                  const sessionKey = `${unit.unitNumber}_${session.sessionCode}`;
                  const isDone = completedSessions[sessionKey];

                  return (
                    <div
                      key={session.sessionCode}
                      className={`rounded-2xl border p-4 flex flex-col justify-between space-y-3 transition-all ${
                        isDone
                          ? 'border-emerald-300 bg-emerald-50/40 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md">
                            {session.itemsRange}
                          </span>
                          <button
                            onClick={() => toggleSessionCompletion(sessionKey)}
                            className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                              isDone
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 text-slate-500 hover:bg-emerald-100 hover:text-emerald-800'
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{isDone ? 'Completed (+25 XP)' : 'Mark Done'}</span>
                          </button>
                        </div>

                        <h4 className="font-bold text-slate-900 text-sm">{session.sessionName}</h4>

                        {/* Items List with Interactive Checkboxes */}
                        <ul className="space-y-1.5 pt-1 text-xs">
                          {session.items.map(it => {
                            const itemKey = `u${unit.unitNumber}_it${it.number}`;
                            const isItemChecked = Boolean(completedItems[itemKey]);

                            return (
                              <li 
                                key={it.number} 
                                onClick={() => toggleItemCompletion(unit, it.number, it.title, session)}
                                className={`p-2 rounded-xl transition-all cursor-pointer flex items-start gap-2 border ${
                                  isItemChecked
                                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium'
                                    : 'hover:bg-slate-50 border-transparent text-slate-600'
                                }`}
                                title={isItemChecked ? 'Hacer clic para desmarcar' : 'Hacer clic para marcar como visto en clase'}
                              >
                                <input
                                  type="checkbox"
                                  checked={isItemChecked}
                                  onChange={() => {}} // handled by li
                                  className="w-4 h-4 rounded text-emerald-600 mt-0.5 border-slate-300 focus:ring-emerald-500 cursor-pointer shrink-0"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <strong className={isItemChecked ? 'text-emerald-900 line-through decoration-emerald-500' : 'text-slate-800'}>
                                      {it.title}
                                    </strong>
                                    {isItemChecked && (
                                      <span className="text-[9px] font-black uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                                        ✓ Visto
                                      </span>
                                    )}
                                  </div>
                                  <span className="block text-[11px] text-slate-500">{it.description}</span>
                                  {it.audioTrack && (
                                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded-md mt-0.5">
                                      🎧 {it.audioTrack}
                                    </span>
                                  )}
                                </div>
                              </li>
                            );
                          })}
                        </ul>

                        {/* Workbook mention */}
                        {session.workbookPages && (
                          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-0.5">
                            <strong className="block text-slate-800 flex items-center gap-1">
                              <FileText className="w-3 h-3 text-blue-600" />
                              Workbook Homework:
                            </strong>
                            <span>{session.workbookPages}</span>
                          </div>
                        )}
                      </div>

                      {/* Teacher Action: Copy for Classroom */}
                      {isTeacher && (
                        <div className="pt-2 border-t border-slate-100">
                          <button
                            onClick={() => handleCopyClassroomTemplate(unit, session)}
                            className="w-full py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                            title="Copy ready-to-paste template for Google Classroom"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy for Classroom</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Tip Cokitö Footer */}
              <div className="px-6 py-3 bg-amber-50/60 border-t border-amber-100 flex items-center gap-2 text-xs text-amber-950 font-medium">
                <span className="font-bold text-amber-700">💡 Tip Cokitö:</span>
                <span>{unit.tipCokito}</span>
              </div>
            </div>
          );
        })}

        {/* Boss Fights (Expansion Units) */}
        {activeLevel.bossFights.map(boss => (
          <div
            key={boss.id}
            className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-slate-950 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-slate-900 text-amber-300 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  Boss Fight • Milestone Exam
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {boss.badgeName}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950">
                {boss.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-900/90 max-w-xl font-medium">
                {boss.description}
              </p>
            </div>

            <div className="flex items-center gap-3 self-stretch md:self-auto justify-end">
              {boss.googleFormUrl && (
                <a
                  href={boss.googleFormUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 bg-slate-950 hover:bg-slate-900 text-amber-300 font-black text-xs sm:text-sm rounded-2xl shadow-md transition-transform hover:scale-102 flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Take Boss Fight Challenge</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quiz Modal */}
      {quizUnit && (
        <UnitQuizModal
          unit={quizUnit}
          isOpen={!!quizUnit}
          onClose={() => setQuizUnit(null)}
          onQuizFinished={handleQuizFinished}
          currentStudent={currentStudent}
          user={user}
          activeRole={activeRole}
        />
      )}

    </div>
  );
};
