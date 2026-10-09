import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Shield, 
  Video, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Lock, 
  Plus, 
  Sparkles, 
  Sun, 
  Sunset, 
  Moon, 
  Coffee, 
  ChevronDown, 
  ChevronUp, 
  GraduationCap, 
  BookOpen, 
  Zap, 
  Users 
} from 'lucide-react';
import { ScheduleSlot, Student, AudienceTheme } from '../types';
import { ENGLISH_LEVELS } from '../data/curriculumData';
import { generateEmailTemplate, sendGmailEmail } from '../services/gmailNotifier';

interface CalendarViewProps {
  slots: ScheduleSlot[];
  students: Student[];
  currentStudent: Student | null;
  activeRole: 'student' | 'teacher';
  audienceTheme: AudienceTheme;
  onFreeSlot?: (slotId: string) => void;
  onOpenRegister: () => void;
}

export type StudyRhythm = 'mon_wed' | 'tue_thu' | 'intensive_6h' | 'saturday' | 'all';

export const CalendarView: React.FC<CalendarViewProps> = ({
  slots,
  students,
  currentStudent,
  activeRole,
  audienceTheme,
  onFreeSlot,
  onOpenRegister
}) => {
  // Main Study Rhythm Filter (reduces cognitive noise by 70%!)
  const [studyRhythm, setStudyRhythm] = useState<StudyRhythm>('mon_wed');
  const [intensiveVariant, setIntensiveVariant] = useState<'mon_wed_fri' | 'tue_thu_fri'>('mon_wed_fri');
  
  // Format Filter: Individual vs Grupal vs Todos
  const [classFormatFilter, setClassFormatFilter] = useState<'all' | 'individual' | 'group'>('all');
  
  // Audience Filter: Adultos vs Niños/Escolar vs Todos (autodetect according to theme)
  const [targetAudienceFilter, setTargetAudienceFilter] = useState<'all' | 'adults' | 'kids'>(
    audienceTheme === 'kids' ? 'kids' : 'all'
  );
  
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [showFrequencyGuide, setShowFrequencyGuide] = useState<boolean>(true);

  const isKids = audienceTheme === 'kids';

  // Determine active days based on selected rhythm
  const getActiveDays = (): string[] => {
    switch (studyRhythm) {
      case 'mon_wed':
        return ['Lunes', 'Miércoles'];
      case 'tue_thu':
        return ['Martes', 'Jueves'];
      case 'intensive_6h':
        return intensiveVariant === 'mon_wed_fri' 
          ? ['Lunes', 'Miércoles', 'Viernes'] 
          : ['Martes', 'Jueves', 'Viernes'];
      case 'saturday':
        return ['Sábado'];
      case 'all':
      default:
        return ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    }
  };

  const activeDays = getActiveDays();

  // Filter slots according to class format (individual/grupal) and target audience (adults/kids)
  const filterDaySlots = (rawDaySlots: ScheduleSlot[]) => {
    return rawDaySlots.filter(slot => {
      const startH = parseInt(slot.startTime.split(':')[0], 10);
      const isMorningEarly = startH >= 6 && startH < 8; // 06:00 - 08:00
      const isNightGroup = startH >= 20 && startH < 22; // 20:00 - 22:00
      const isSchoolAfternoon = startH >= 15 && startH < 17; // 15:00 - 17:00

      // 1. Format Filter: Individual vs Group
      if (classFormatFilter === 'individual') {
        if (isMorningEarly || isNightGroup || slot.slotType === 'group') {
          return false;
        }
      } else if (classFormatFilter === 'group') {
        if (slot.slotType !== 'group' && !isMorningEarly && !isNightGroup && slot.day !== 'Sábado') {
          return false;
        }
      }

      // 2. Audience Filter: Adults vs Kids
      if (targetAudienceFilter === 'adults') {
        if (isSchoolAfternoon) {
          return false;
        }
      } else if (targetAudienceFilter === 'kids') {
        if (slot.day !== 'Sábado' && (startH < 15 || startH >= 18)) {
          return false;
        }
      }

      return true;
    });
  };

  // Helper to categorize slots into official pedagogical bands
  const getSlotBand = (slot: ScheduleSlot) => {
    if (slot.day === 'Sábado') {
      return {
        key: 'saturday',
        name: 'Sabatino Exclusivo (Bloques Continuos)',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
        icon: <Sun className="w-3.5 h-3.5 text-amber-600" />
      };
    }

    const startH = parseInt(slot.startTime.split(':')[0], 10);

    // 1. Madrugadores (06:00 - 08:00 am)
    if (startH >= 6 && startH < 8) {
      return {
        key: 'early_group',
        name: 'Madrugadores • Exclusivo Grupos (6 a 8 am)',
        badgeColor: 'bg-amber-100 text-amber-950 border-amber-300',
        icon: <Coffee className="w-3.5 h-3.5 text-amber-600" />
      };
    }

    // 2. Tarde Escolar (15:00 - 17:00 / 3 a 5 pm)
    if (startH >= 15 && startH < 17) {
      return {
        key: 'school_afternoon',
        name: 'Tarde • Prioridad Alumno Escolar (3 a 5 pm)',
        badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-200',
        icon: <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
      };
    }

    // 3. Tarde Convenio CSB (17:00 - 19:00 / 5 a 7 pm)
    if (startH >= 17 && startH < 19) {
      return {
        key: 'teachers_csb',
        name: 'Turno Convenio • Prioridad Teachers CSB (5 a 7 pm)',
        badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
        icon: <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
      };
    }

    // 4. Noche Adultos (19:00 - 22:00)
    if (startH >= 19) {
      return {
        key: 'night_adults',
        name: 'Noche • Exclusivo Grupos Adultos / Individuales',
        badgeColor: 'bg-blue-100 text-blue-900 border-blue-200',
        icon: <Moon className="w-3.5 h-3.5 text-blue-600" />
      };
    }

    // 5. Mañana / Mediodía regular (08:00 - 15:00)
    return {
      key: 'regular_day',
      name: 'Horarios Diurnos • Clases Individuales',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
      icon: <Clock className="w-3.5 h-3.5 text-slate-500" />
    };
  };

  const handleSendQuickReminder = async (slot: ScheduleSlot) => {
    if (!slot.studentId) return;
    const student = students.find(s => s.id === slot.studentId);
    if (!student) return;

    const level = ENGLISH_LEVELS.find(l => l.id === slot.levelId) || ENGLISH_LEVELS[0];
    const template = generateEmailTemplate('reminder_24h', {
      studentName: student.name,
      levelName: level.levelName,
      book: level.book,
      planName: student.plan,
      slotTime: `${slot.day} ${slot.startTime} - ${slot.endTime}`,
      meetLink: slot.meetLink
    });

    setActionMessage(`Enviando recordatorio a ${student.name}...`);
    const res = await sendGmailEmail({
      to: student.email,
      subject: template.subject,
      bodyText: template.bodyText
    });

    if (res.success) {
      setActionMessage(`✅ Recordatorio enviado exitosamente a ${student.email}`);
    } else {
      setActionMessage(`ℹ️ Correo preparado: para envío en vivo, conecta Google Workspace en la barra superior.`);
    }

    setTimeout(() => setActionMessage(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6 animate-fadeIn">
      
      {/* 1. Header Card with Title & Staff Badge */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs shrink-0 ${
            isKids ? 'bg-sky-100 text-sky-700' : 'bg-[#2EC4B6]/10 text-[#2EC4B6] border border-[#2EC4B6]/20'
          }`}>
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-[#243447] tracking-tight">
                Agenda Semanal • Horarios de Vuelo
              </h2>
              {activeRole === 'teacher' ? (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  👑 Vista Staff Teacher / Rectoría
                </span>
              ) : (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Horarios Confidenciales
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Filtra según la frecuencia de tu plan para ver solo los días que te corresponden sin sobrecarga visual.
            </p>
          </div>
        </div>

        {/* Action Button to Register */}
        <button
          onClick={onOpenRegister}
          className="w-full md:w-auto px-4 py-2.5 bg-[#2EC4B6] hover:bg-[#259C90] text-slate-950 rounded-2xl font-black text-xs shadow-xs transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Solicitar Inscripción en un Turno</span>
        </button>
      </div>

      {/* 2. Notification Toast */}
      {actionMessage && (
        <div className="p-3 bg-slate-900 text-white rounded-2xl text-xs flex items-center justify-between shadow-md">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* 3. SMART STUDY RHYTHM SELECTOR (The core optimization requested by Ana!) */}
      <div className="bg-gradient-to-r from-slate-900 via-[#243447] to-slate-900 rounded-3xl p-5 sm:p-6 text-white border border-slate-800 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#FFD166] bg-[#FFD166]/15 px-2.5 py-0.5 rounded-full border border-[#FFD166]/30">
              ⚡ Filtro Inteligente de Ritmo de Estudio
            </span>
            <h3 className="text-base sm:text-lg font-black text-white mt-1">
              ¿Qué días y frecuencia prefieres ver?
            </h3>
            <p className="text-xs text-slate-300">
              Selecciona tu modalidad para limpiar la agenda y concentrarte en tus opciones reales.
            </p>
          </div>

          <button
            onClick={() => setShowFrequencyGuide(!showFrequencyGuide)}
            className="text-xs font-bold text-[#FFD166] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>{showFrequencyGuide ? 'Ocultar guía de horas' : 'Ver guía de horas'}</span>
            {showFrequencyGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Pill Buttons for Rhythms */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-1">
          
          {/* Option 1: Lunes & Miércoles */}
          <button
            onClick={() => setStudyRhythm('mon_wed')}
            className={`p-3 rounded-2xl text-xs font-bold transition-all text-left flex flex-col justify-between border ${
              studyRhythm === 'mon_wed'
                ? 'bg-[#2EC4B6] text-slate-950 border-[#2EC4B6] shadow-md scale-102 font-black'
                : 'bg-white/10 hover:bg-white/15 text-white border-white/10'
            }`}
          >
            <span className="text-sm">🗓️ Lun & Mié</span>
            <span className={`text-[10px] mt-1 ${studyRhythm === 'mon_wed' ? 'text-slate-900 font-bold' : 'text-slate-300'}`}>
              Pareja Fija (2h o 3h/sem)
            </span>
          </button>

          {/* Option 2: Martes & Jueves */}
          <button
            onClick={() => setStudyRhythm('tue_thu')}
            className={`p-3 rounded-2xl text-xs font-bold transition-all text-left flex flex-col justify-between border ${
              studyRhythm === 'tue_thu'
                ? 'bg-[#2EC4B6] text-slate-950 border-[#2EC4B6] shadow-md scale-102 font-black'
                : 'bg-white/10 hover:bg-white/15 text-white border-white/10'
            }`}
          >
            <span className="text-sm">🗓️ Mar & Jue</span>
            <span className={`text-[10px] mt-1 ${studyRhythm === 'tue_thu' ? 'text-slate-900 font-bold' : 'text-slate-300'}`}>
              Pareja Fija (2h o 3h/sem)
            </span>
          </button>

          {/* Option 3: Intensivo 6h (+ Viernes) */}
          <button
            onClick={() => setStudyRhythm('intensive_6h')}
            className={`p-3 rounded-2xl text-xs font-bold transition-all text-left flex flex-col justify-between border ${
              studyRhythm === 'intensive_6h'
                ? 'bg-[#FF6B4A] text-white border-[#FF6B4A] shadow-md scale-102 font-black'
                : 'bg-white/10 hover:bg-white/15 text-white border-white/10'
            }`}
          >
            <span className="text-sm">⚡ Intensivo 6h</span>
            <span className={`text-[10px] mt-1 ${studyRhythm === 'intensive_6h' ? 'text-white/90 font-bold' : 'text-slate-300'}`}>
              3 Días (+ Viernes)
            </span>
          </button>

          {/* Option 4: Sabatino Exclusivo */}
          <button
            onClick={() => setStudyRhythm('saturday')}
            className={`p-3 rounded-2xl text-xs font-bold transition-all text-left flex flex-col justify-between border ${
              studyRhythm === 'saturday'
                ? 'bg-[#FFD166] text-slate-950 border-[#FFD166] shadow-md scale-102 font-black'
                : 'bg-white/10 hover:bg-white/15 text-white border-white/10'
            }`}
          >
            <span className="text-sm">☀️ Sabatino</span>
            <span className={`text-[10px] mt-1 ${studyRhythm === 'saturday' ? 'text-slate-900 font-bold' : 'text-slate-300'}`}>
              Bloques 2h o 4h
            </span>
          </button>

          {/* Option 5: Vista Completa Directora */}
          <button
            onClick={() => setStudyRhythm('all')}
            className={`p-3 rounded-2xl text-xs font-bold transition-all text-left flex flex-col justify-between border col-span-2 sm:col-span-1 ${
              studyRhythm === 'all'
                ? 'bg-white text-slate-950 border-white shadow-md scale-102 font-black'
                : 'bg-white/10 hover:bg-white/15 text-white border-white/10'
            }`}
          >
            <span className="text-sm">👁️ Toda la Semana</span>
            <span className={`text-[10px] mt-1 ${studyRhythm === 'all' ? 'text-slate-900 font-bold' : 'text-slate-300'}`}>
              Vista Supervisión Staff
            </span>
          </button>

        </div>

        {/* Filters requested by Ana: Formato (Individual vs Grupal) y Audiencia (Adultos vs Escolar) */}
        <div className="pt-3 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          
          {/* Filter 1: Individual vs Grupal */}
          <div className="bg-white/5 p-2.5 rounded-2xl border border-white/10 flex items-center justify-between gap-2 flex-wrap">
            <span className="text-slate-300 font-bold shrink-0">Formato:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setClassFormatFilter('all')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                  classFormatFilter === 'all'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'bg-white/10 text-slate-300 hover:text-white'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setClassFormatFilter('individual')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                  classFormatFilter === 'individual'
                    ? 'bg-[#2EC4B6] text-slate-950 font-black shadow-xs'
                    : 'bg-white/10 text-slate-300 hover:text-white'
                }`}
                title="Solo horarios disponibles para clases privadas 1 a 1"
              >
                👤 Individual
              </button>
              <button
                onClick={() => setClassFormatFilter('group')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                  classFormatFilter === 'group'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                    : 'bg-white/10 text-slate-300 hover:text-white'
                }`}
                title="Madrugadores 6-8am, nocturnos 8-10pm y sabatinos"
              >
                👥 Grupal
              </button>
            </div>
          </div>

          {/* Filter 2: Adultos vs Niños/Escolar */}
          <div className="bg-white/5 p-2.5 rounded-2xl border border-white/10 flex items-center justify-between gap-2 flex-wrap">
            <span className="text-slate-300 font-bold shrink-0">Audiencia:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setTargetAudienceFilter('all')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                  targetAudienceFilter === 'all'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'bg-white/10 text-slate-300 hover:text-white'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setTargetAudienceFilter('adults')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                  targetAudienceFilter === 'adults'
                    ? 'bg-blue-400 text-slate-950 font-black shadow-xs'
                    : 'bg-white/10 text-slate-300 hover:text-white'
                }`}
                title="Oculta los horarios escolares infantiles de 3 a 5 pm"
              >
                🧑‍💼 Adulto
              </button>
              <button
                onClick={() => setTargetAudienceFilter('kids')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                  targetAudienceFilter === 'kids'
                    ? 'bg-pink-400 text-slate-950 font-black shadow-xs'
                    : 'bg-white/10 text-slate-300 hover:text-white'
                }`}
                title="Solo muestra tardes escolares a partir de las 3pm y sábados"
              >
                🎒 Escolar / Niño
              </button>
            </div>
          </div>

        </div>

        {/* Sub-selector for Intensive 6h (Choose which pair combines with Friday) */}
        {studyRhythm === 'intensive_6h' && (
          <div className="pt-2 border-t border-white/10 flex items-center gap-3 text-xs">
            <span className="text-slate-300 font-medium">Combinación del Intensivo:</span>
            <button
              onClick={() => setIntensiveVariant('mon_wed_fri')}
              className={`px-3 py-1 rounded-xl font-bold transition-all ${
                intensiveVariant === 'mon_wed_fri'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'bg-white/10 text-slate-300 hover:text-white'
              }`}
            >
              Lunes + Miércoles + Viernes
            </button>
            <button
              onClick={() => setIntensiveVariant('tue_thu_fri')}
              className={`px-3 py-1 rounded-xl font-bold transition-all ${
                intensiveVariant === 'tue_thu_fri'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'bg-white/10 text-slate-300 hover:text-white'
              }`}
            >
              Martes + Jueves + Viernes
            </button>
          </div>
        )}

        {/* 4. Pedagogical Distribution Guide (Collapse) */}
        {showFrequencyGuide && (
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs space-y-2 mt-2">
            <p className="font-bold text-[#FFD166] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD166]" />
              <span>Reglas Pedagógicas de Distribución Horaria:</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-slate-200">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <strong className="text-white block">2 Horas / semana</strong>
                <span>1 hora por día en tu pareja fija (Lun-Mié o Mar-Jue).</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <strong className="text-white block">3 Horas / semana</strong>
                <span>1.5 horas por día en tu pareja fija (Lun-Mié o Mar-Jue).</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <strong className="text-white block">4 Horas / semana</strong>
                <span>2 horas por día en tu pareja fija (Lun-Mié o Mar-Jue).</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <strong className="text-white block">Sabatino Exclusivo</strong>
                <span>Bloque continuo de 2h o 4h los sábados (sin clases de 1h).</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 5. Franjas Horarias Legend (Requested by Ana) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs bg-white border border-slate-200 p-3.5 rounded-2xl shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0"></span>
          <div>
            <strong className="block text-slate-900 font-bold">06:00 - 08:00 (Mañana)</strong>
            <span className="text-[11px] text-slate-500">Exclusivo Grupos (6-7 y 7-8 am)</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-indigo-600 shrink-0"></span>
          <div>
            <strong className="block text-slate-900 font-bold">15:00 - 17:00 (3 a 5 pm)</strong>
            <span className="text-[11px] text-slate-500">Prioridad Alumno Escolar</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-purple-600 shrink-0"></span>
          <div>
            <strong className="block text-slate-900 font-bold">17:00 - 19:00 (5 a 7 pm)</strong>
            <span className="text-[11px] text-slate-500">Prioridad Teachers CSB</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-600 shrink-0"></span>
          <div>
            <strong className="block text-slate-900 font-bold">20:00 - 22:00 (Noche)</strong>
            <span className="text-[11px] text-slate-500">Exclusivo Grupos Adultos</span>
          </div>
        </div>
      </div>

      {/* 6. Availability Color Status Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span>Disponible para reservar</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
            <span>⭐ Tu Clase Confirmada</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-400 inline-block"></span>
            <span>🔒 Reservado por otro alumno (Confidencial)</span>
          </div>
        </div>

        <span className="text-[11px] text-slate-400 font-medium">
          Mostrando {activeDays.length} día(s) en pantalla
        </span>
      </div>

      {/* 7. Grid of Filtered Days */}
      <div className={`grid gap-5 ${
        activeDays.length === 1 
          ? 'grid-cols-1 max-w-2xl mx-auto' 
          : activeDays.length === 2 
            ? 'grid-cols-1 md:grid-cols-2' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      }`}>
        {activeDays.map(day => {
          const rawDaySlots = slots.filter(s => s.day === day);
          const daySlots = filterDaySlots(rawDaySlots);

          return (
            <div key={day} className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col transition-all hover:shadow-md">
              
              {/* Day Header Card */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100/80 px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-black text-slate-900 text-base tracking-tight">{day}</span>
                  <p className="text-[11px] text-slate-500">
                    {day === 'Sábado' ? 'Jornada Sabatina de Inmersión' : 'Sesiones Curriculares'}
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600">
                  {daySlots.filter(s => s.status === 'booked').length} / {daySlots.length} Ocupados
                </span>
              </div>

              {/* Slots Container grouped by pedagogical bands */}
              <div className="p-4 space-y-3 flex-1">
                {daySlots.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-8">Sin turnos configurados para este día</p>
                ) : (
                  daySlots.map(slot => {
                    const isBooked = slot.status === 'booked';
                    const isMyClass = isBooked && currentStudent && slot.studentId === currentStudent.id;
                    const isOtherBooked = isBooked && (!currentStudent || slot.studentId !== currentStudent.id);
                    const studentData = isBooked ? students.find(s => s.id === slot.studentId) : null;
                    const levelData = slot.levelId ? ENGLISH_LEVELS.find(l => l.id === slot.levelId) : null;
                    const bandInfo = getSlotBand(slot);

                    // CASE 1: Confidential (Student view of someone else's class)
                    if (isOtherBooked && activeRole === 'student') {
                      return (
                        <div
                          key={slot.id}
                          className="p-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 flex items-center justify-between transition-all"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-slate-200/80 flex items-center justify-center text-slate-400 shrink-0">
                              <Lock className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs text-slate-700 flex items-center gap-1.5">
                                <span>{slot.startTime} - {slot.endTime}</span>
                              </div>
                              <span className="text-[11px] text-slate-400 truncate block">
                                🔒 Reservado (Confidencial)
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-lg shrink-0">
                            Ocupado
                          </span>
                        </div>
                      );
                    }

                    // CASE 2: My Booked Class
                    if (isMyClass && activeRole === 'student') {
                      return (
                        <div
                          key={slot.id}
                          className="p-3.5 rounded-2xl border border-[#2EC4B6]/50 bg-gradient-to-r from-teal-50/70 to-emerald-50/60 shadow-xs space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#2EC4B6]" />
                              {slot.startTime} - {slot.endTime}
                            </span>
                            <span className="text-[10px] font-black bg-[#2EC4B6] text-slate-950 px-2.5 py-0.5 rounded-full shadow-2xs">
                              ⭐ Tu Clase
                            </span>
                          </div>

                          <div className="text-xs">
                            <p className="font-bold text-slate-900">
                              {levelData?.levelName || 'Nivel Asignado'} • {levelData?.book || 'Super Goal'}
                            </p>
                            <p className="text-[11px] text-slate-500">Teacher: Directora Waky & Staff</p>
                          </div>

                          {slot.meetLink && (
                            <a
                              href={slot.meetLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-white border border-blue-200 px-3 py-1 rounded-xl shadow-2xs transition-colors"
                            >
                              <Video className="w-3.5 h-3.5 text-blue-600" />
                              <span>Entrar a Google Meet</span>
                            </a>
                          )}
                        </div>
                      );
                    }

                    // CASE 3: Teacher / Rectoría Full View
                    if (isBooked && activeRole === 'teacher') {
                      return (
                        <div
                          key={slot.id}
                          className="p-3.5 rounded-2xl border border-blue-200 bg-blue-50/60 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-black text-xs text-slate-950 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-blue-600" />
                              {slot.startTime} - {slot.endTime}
                            </span>
                            <span className="text-[10px] font-bold bg-[#243447] text-white px-2 py-0.5 rounded-full">
                              Ocupado
                            </span>
                          </div>

                          <div className="text-xs">
                            <strong className="text-slate-900 block">{slot.studentName || studentData?.name}</strong>
                            <p className="text-[11px] text-slate-600 mt-0.5">
                              {levelData?.levelName} ({levelData?.book}) • Plan {studentData?.plan}
                            </p>
                          </div>

                          <div className="pt-1 flex items-center justify-between gap-2 border-t border-blue-200/60 flex-wrap">
                            {slot.meetLink && (
                              <a
                                href={slot.meetLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700"
                              >
                                <Video className="w-3 h-3" />
                                <span>Meet</span>
                              </a>
                            )}
                            <button
                              onClick={() => handleSendQuickReminder(slot)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-800 bg-white border border-slate-300 px-2 py-0.5 rounded-lg hover:bg-slate-100"
                            >
                              <Send className="w-3 h-3 text-blue-600" />
                              <span>Notificar</span>
                            </button>
                            {onFreeSlot && (
                              <button
                                onClick={() => {
                                  if (confirm(`¿Liberar este horario para ${slot.studentName}?`)) {
                                    onFreeSlot(slot.id);
                                  }
                                }}
                                className="text-[10px] text-rose-600 hover:underline font-bold"
                              >
                                Liberar
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    }

                    // CASE 4: Available Slot (with Pedagogical Band Header)
                    return (
                      <div
                        key={slot.id}
                        className="p-3 rounded-2xl border border-emerald-200/90 bg-emerald-50/40 hover:bg-emerald-50/80 transition-all flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 font-black text-xs text-emerald-950">
                            <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{slot.startTime} - {slot.endTime}</span>
                          </div>

                          {/* Pedagogical Band label */}
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.2 rounded-md border ${bandInfo.badgeColor} truncate max-w-[200px]`}>
                              {bandInfo.icon}
                              <span>{bandInfo.name}</span>
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={onOpenRegister}
                          className="shrink-0 text-[11px] font-black text-emerald-900 bg-white border border-emerald-300 hover:bg-emerald-100 px-3 py-1.5 rounded-xl shadow-2xs transition-colors"
                        >
                          Reservar
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
