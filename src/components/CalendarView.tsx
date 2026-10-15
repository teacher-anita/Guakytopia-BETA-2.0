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
  ChevronRight,
  GraduationCap, 
  BookOpen, 
  Zap, 
  Users 
} from 'lucide-react';
import { ScheduleSlot, Student, AudienceTheme, BookedSession } from '../types';
import { ENGLISH_LEVELS } from '../data/curriculumData';
import { generateEmailTemplate, sendGmailEmail } from '../services/gmailNotifier';
import { StudentScheduleRequestModal } from './StudentScheduleRequestModal';
import { MonthScheduleView } from './MonthScheduleView';
import { PrepaidSessionBookingModal } from './PrepaidSessionBookingModal';

interface CalendarViewProps {
  slots: ScheduleSlot[];
  students: Student[];
  currentStudent: Student | null;
  user?: any;
  activeRole: 'student' | 'teacher';
  audienceTheme: AudienceTheme;
  onFreeSlot?: (slotId: string) => void;
  onOpenRegister: () => void;
  onUpdateStudent?: (student: Student) => void;
  onOpenPaymentModal?: () => void;
  onOpenPricingModal?: () => void;
}

export type StudyRhythm = 'mon_wed' | 'tue_thu' | 'intensive_6h' | 'saturday' | 'all';
export type CalendarViewTab = 'weekly' | 'current_month' | 'next_month';

export const CalendarView: React.FC<CalendarViewProps> = ({
  slots,
  students,
  currentStudent,
  user,
  activeRole,
  audienceTheme,
  onFreeSlot,
  onOpenRegister,
  onUpdateStudent,
  onOpenPaymentModal,
  onOpenPricingModal
}) => {
  // Main Calendar View Tab: Weekly vs Current Month (Octubre) vs Next Month (Noviembre)
  const [calendarTab, setCalendarTab] = useState<CalendarViewTab>('weekly');

  // Prepaid Hours Booking Modal state
  const [isPrepaidBookingModalOpen, setIsPrepaidBookingModalOpen] = useState<boolean>(false);
  const [preselectedPrepaidDate, setPreselectedPrepaidDate] = useState<string | null>(null);

  // Main Study Rhythm Filter (reduces cognitive noise by 70%!)
  const [studyRhythm, setStudyRhythm] = useState<StudyRhythm>('mon_wed');
  const [intensiveVariant, setIntensiveVariant] = useState<'mon_wed_fri' | 'tue_thu_fri'>('mon_wed_fri');
  
  // Format Filter: Individual vs Grupal vs Todos
  const [classFormatFilter, setClassFormatFilter] = useState<'all' | 'individual' | 'group'>('all');
  
  // Audience Filter: Adultos vs Niños/Escolar vs Todos (autodetect according to theme)
  const [targetAudienceFilter, setTargetAudienceFilter] = useState<'all' | 'adults' | 'kids'>(
    audienceTheme === 'kids' ? 'kids' : 'all'
  );

  // Director / Teacher Advanced Filters (Optimized Management)
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'booked_only' | 'available_only'>('all');
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>('all');
  const [selectedTeacherFilter, setSelectedTeacherFilter] = useState<string>('all');
  
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [showFrequencyGuide, setShowFrequencyGuide] = useState<boolean>(true);

  // Authenticated Student Schedule Booking Modal state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [selectedBookingSlot, setSelectedBookingSlot] = useState<ScheduleSlot | null>(null);

  // Derive effective student: active student model or authenticated user
  const effectiveStudent: Student | null = (currentStudent && currentStudent.id && currentStudent.id !== 'guest')
    ? currentStudent
    : user
      ? {
          id: `student_${user.uid}`,
          uid: user.uid,
          name: user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'Estudiante',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          email: user.email || '',
          age: 20,
          isKid: false,
          schoolOrProfession: 'Estudiante Campus Güakytopia',
          learningGoal: 'Aprender y dominar el inglés',
          avatar: user.photoURL || `https://api.dicebear.com/7.x/micah/svg?seed=${user.uid}`,
          status: 'enrolled',
          plan: 'basic',
          modality: 'online',
          groupSize: 'individual',
          preferredTimeSlot: '',
          levelId: 'level_1',
          currentUnit: 1,
          completedHours: 0,
          xp: 150,
          streak: 1,
          league: 'Bronce',
          rating: { fluency: 3, grammar: 3, vocabulary: 3, pronunciation: 3 },
          assignedSlots: [],
          registeredAt: new Date().toISOString().split('T')[0],
          notes: ''
        }
      : null;

  const handleInitiateBooking = (slot?: ScheduleSlot) => {
    if (effectiveStudent) {
      // Student is already logged in! DO NOT re-ask personal data. Open fast reservation modal!
      setSelectedBookingSlot(slot || null);
      setIsBookingModalOpen(true);
    } else {
      // Visitor/Guest: Open registration
      onOpenRegister();
    }
  };

  const isKids = audienceTheme === 'kids';

  // Determine active days based on selected rhythm or availability filter
  const getActiveDays = (): string[] => {
    // If Director wants to view only occupied slots or a specific student, show all relevant days
    if (availabilityFilter === 'booked_only' || selectedStudentFilter !== 'all') {
      return ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    }
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

  // Filter slots according to availability, student, teacher, class format, and target audience
  const filterDaySlots = (rawDaySlots: ScheduleSlot[]) => {
    return rawDaySlots.filter(slot => {
      const startH = parseInt(slot.startTime.split(':')[0], 10);
      const isMorningEarly = startH >= 6 && startH < 8; // 06:00 - 08:00
      const isNightGroup = startH >= 20 && startH < 22; // 20:00 - 22:00
      const isSchoolAfternoon = startH >= 15 && startH < 17; // 15:00 - 17:00

      // 1. Availability Filter (Todos vs Solo Ocupados vs Solo Libres)
      if (availabilityFilter === 'booked_only' && slot.status !== 'booked') {
        return false;
      }
      if (availabilityFilter === 'available_only' && slot.status === 'booked') {
        return false;
      }

      // 2. Student Filter (Highlight/isolate specific student)
      if (selectedStudentFilter !== 'all') {
        if (slot.status !== 'booked') return false;
        const matchesId = slot.studentId === selectedStudentFilter;
        const matchesName = slot.studentName?.toLowerCase().includes(selectedStudentFilter.toLowerCase());
        if (!matchesId && !matchesName) return false;
      }

      // 3. Teacher Filter
      if (selectedTeacherFilter !== 'all') {
        if (!slot.teacherName?.toLowerCase().includes(selectedTeacherFilter.toLowerCase())) {
          return false;
        }
      }

      // 4. Format Filter: Individual vs Group
      if (classFormatFilter === 'individual') {
        if (isMorningEarly || isNightGroup || slot.slotType === 'group') {
          return false;
        }
      } else if (classFormatFilter === 'group') {
        if (slot.slotType !== 'group' && !isMorningEarly && !isNightGroup && slot.day !== 'Sábado') {
          return false;
        }
      }

      // 5. Audience Filter: Adults vs Kids
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

        {/* Action Button to Register / Book */}
        <button
          onClick={() => handleInitiateBooking()}
          className="w-full md:w-auto px-4 py-2.5 bg-[#2EC4B6] hover:bg-[#259C90] text-slate-950 rounded-2xl font-black text-xs shadow-xs transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>{effectiveStudent ? 'Solicitar / Agendar Mi Turno' : 'Solicitar Inscripción en un Turno'}</span>
        </button>
      </div>

      {/* 2. Notification Toast */}
      {actionMessage && (
        <div className="p-3 bg-slate-900 text-white rounded-2xl text-xs flex items-center justify-between shadow-md">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* 2.1 DIRECTOR / HEAD TEACHER OPTIMIZATION BAR */}
      {activeRole === 'teacher' && (
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-5 text-white border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full font-bold">
                  👑 Control Maestro de Rectoría
                </span>
                <span className="text-xs font-bold text-amber-300">Directora Waky (Head Teacher)</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.2 rounded-full font-bold">
                  Docente Activa Exclusiva
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                Optimización de Horarios & Alumnas
              </h3>
              <p className="text-xs text-slate-300">
                Selecciona si deseas ver solo los horarios ocupados de tus alumnas, solo los turnos libres para inscripción, o la vista completa.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
                <strong className="text-rose-400 font-black">{slots.filter(s => s.status === 'booked').length}</strong> bloques ocupados
              </span>
              <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
                <strong className="text-emerald-400 font-black">{slots.filter(s => s.status === 'available').length}</strong> bloques libres
              </span>
            </div>
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Filter 1: Ocupados vs Libres vs Ambos */}
            <div className="bg-white/10 p-3 rounded-2xl border border-white/15 space-y-2">
              <span className="text-slate-300 font-bold block">Vista de Disponibilidad:</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setAvailabilityFilter('all')}
                  className={`py-2 px-1 rounded-xl text-center font-bold transition-all text-[11px] ${
                    availabilityFilter === 'all'
                      ? 'bg-white text-slate-950 font-black shadow-md'
                      : 'bg-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  👁️ Ambos
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAvailabilityFilter('booked_only');
                    setStudyRhythm('all');
                  }}
                  className={`py-2 px-1 rounded-xl text-center font-bold transition-all text-[11px] ${
                    availabilityFilter === 'booked_only'
                      ? 'bg-rose-500 text-white font-black shadow-md'
                      : 'bg-white/10 text-slate-300 hover:text-white'
                  }`}
                  title="Muestra únicamente los bloques que tienen alumnas asignadas"
                >
                  🔴 Solo Ocupados
                </button>
                <button
                  type="button"
                  onClick={() => setAvailabilityFilter('available_only')}
                  className={`py-2 px-1 rounded-xl text-center font-bold transition-all text-[11px] ${
                    availabilityFilter === 'available_only'
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                      : 'bg-white/10 text-slate-300 hover:text-white'
                  }`}
                  title="Muestra solo los bloques libres para matricular"
                >
                  🟢 Solo Libres
                </button>
              </div>
            </div>

            {/* Filter 2: Filtrar por Alumna Específica */}
            <div className="bg-white/10 p-3 rounded-2xl border border-white/15 space-y-2">
              <span className="text-slate-300 font-bold block">Filtrar por Alumna:</span>
              <select
                value={selectedStudentFilter}
                onChange={(e) => {
                  setSelectedStudentFilter(e.target.value);
                  if (e.target.value !== 'all') {
                    setStudyRhythm('all');
                  }
                }}
                className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="all">Todas las Alumnas ({slots.filter(s => s.status === 'booked').length} turnos ocupados)</option>
                {Array.from(new Set(slots.filter(s => s.status === 'booked' && s.studentName).map(s => s.studentName))).map(name => (
                  <option key={name} value={name!}>{name}</option>
                ))}
              </select>
            </div>

            {/* Filter 3: Profesor */}
            <div className="bg-white/10 p-3 rounded-2xl border border-white/15 space-y-2">
              <span className="text-slate-300 font-bold block">Profesor Asignado:</span>
              <div className="bg-slate-800 text-amber-300 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold flex items-center justify-between">
                <span>Teacher Cokitö / Head Teacher</span>
                <span className="text-[10px] bg-amber-400/20 px-2 py-0.5 rounded-full text-amber-300 font-bold">Docente Única</span>
              </div>
            </div>
          </div>

          {/* Quick Access Student Chips */}
          <div className="pt-2 border-t border-white/10 flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-slate-400 text-[11px] font-bold mr-1">Tus Alumnas Directas:</span>
            {[
              { name: 'Carla Andreina Lira', tag: 'Lun/Mié 5-6 pm' },
              { name: 'Xiomara Muñoz', tag: 'Mar/Jue 4-5 pm' },
              { name: 'Vaneska Lopez', tag: 'Lun/Mié 9-10 pm' },
              { name: 'Ian Gabriel Mendoza', tag: 'Lun/Mié 10-12 m' },
              { name: 'Génesis Puello', tag: 'Lun/Mié 8-9 pm' },
              { name: 'María Guadalupe Peña Montilla', tag: 'Mar/Jue 6-7 pm' }
            ].map(alumna => {
              const isSelected = selectedStudentFilter.toLowerCase() === alumna.name.toLowerCase() || selectedStudentFilter.toLowerCase().includes(alumna.name.split(' ')[0].toLowerCase());
              return (
                <button
                  key={alumna.name}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      setSelectedStudentFilter('all');
                    } else {
                      setSelectedStudentFilter(alumna.name);
                      setStudyRhythm('all');
                    }
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 border ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black scale-105'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/10'
                  }`}
                >
                  <span>{alumna.name.split(' ')[0]} {alumna.name.split(' ')[1] || ''}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-md ${isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-black/30 text-amber-300'}`}>
                    {alumna.tag}
                  </span>
                </button>
              );
            })}
            {selectedStudentFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedStudentFilter('all')}
                className="text-[11px] text-rose-300 hover:text-white underline ml-2 font-bold"
              >
                Limpiar filtro
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2.2 STUDENT OFFICIAL ASSIGNED SCHEDULE CARD */}
      {effectiveStudent && activeRole === 'student' && (() => {
        const studentSlots = slots.filter(s => s.status === 'booked' && (s.studentId === effectiveStudent.id || (s.studentName && s.studentName.toLowerCase().includes(effectiveStudent.name.toLowerCase()))));
        if (studentSlots.length === 0 && (!effectiveStudent.assignedSlots || effectiveStudent.assignedSlots.length === 0)) return null;

        return (
          <div className="bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 rounded-3xl p-5 text-white border-2 border-emerald-400/40 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-black uppercase tracking-wider bg-emerald-400 text-slate-950 px-3 py-0.5 rounded-full shadow-xs">
                  ⭐ Tu Horario Asignado Oficial
                </span>
                <span className="text-xs text-emerald-200 font-bold">
                  {effectiveStudent.name} {effectiveStudent.lastName || ''}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleInitiateBooking()}
                className="text-[11px] font-bold text-amber-300 hover:text-white underline flex items-center gap-1"
              >
                <span>Solicitar cambio de horario</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
              {studentSlots.map(slot => (
                <div key={slot.id} className="bg-white/10 rounded-2xl p-3 border border-white/15 flex items-center justify-between gap-2">
                  <div>
                    <strong className="text-sm font-black text-amber-300 block">{slot.day}</strong>
                    <span className="text-xs text-slate-200">{slot.startTime} a {slot.endTime}</span>
                    <span className="text-[10px] text-emerald-300 block font-medium">Teacher Cokitö (Head Teacher)</span>
                  </div>
                  {slot.meetLink && (
                    <a
                      href={slot.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-[11px] shadow-sm flex items-center gap-1 shrink-0"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Meet</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* 2.5 STUDENT'S BOLSA DE HORAS PREPAGADAS & CLASES CONFIRMADAS BANNER */}
      {effectiveStudent && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white border border-slate-800 shadow-xl space-y-5">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                  🎒 Mi Portal de Agenda & Horas Prepagadas
                </span>
                <span className="text-xs text-blue-200 font-bold">
                  {effectiveStudent.name} {effectiveStudent.lastName || ''}
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.2 rounded-full font-bold">
                  🟢 Ciclo Mensual Activo
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                Bolsa de Horas Privadas & Turnos Confirmados
              </h3>
              <p className="text-xs text-slate-300">
                Tus horas individuales prepagadas tienen 30 días de vigencia calendario y las puedes utilizar libremente para repaso, examen o conversación.
              </p>
            </div>

            {/* Action Buttons: Book & Prepay/Tarifas */}
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto">
              {onOpenPricingModal && (
                <button
                  type="button"
                  onClick={onOpenPricingModal}
                  className="w-full sm:w-auto px-4 py-3 bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <span>💳 Recargar Horas / Ver Tarifas</span>
                </button>
              )}

              <button
                onClick={() => {
                  setPreselectedPrepaidDate(null);
                  setIsPrepaidBookingModalOpen(true);
                }}
                className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 transform hover:scale-102"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>➕ Agendar Hora con Mi Bolsa Prepagada</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Box 1: Saldo de Horas */}
            <div className="bg-white/10 rounded-2xl p-4 border border-white/15 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-bold text-[11px] uppercase tracking-wider">
                  Horas Disponibles
                </span>
                <Clock className="w-4 h-4 text-amber-300" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-amber-300">
                  {effectiveStudent.prepaidHoursBalance ?? 6.0}h
                </span>
                <span className="text-slate-300 text-xs">
                  / {effectiveStudent.prepaidHoursTotal ?? 8.0}h adquiridas
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-white/15 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.max(10, ((effectiveStudent.prepaidHoursBalance ?? 6.0) / (effectiveStudent.prepaidHoursTotal ?? 8.0)) * 100))}%`
                  }}
                />
              </div>
              <div className="text-[11px] text-slate-300 pt-1">
                📅 Válido hasta: <strong className="text-white">{effectiveStudent.prepaidHoursExpiresAt || '11 de Noviembre de 2026'}</strong> (30 días)
              </div>
            </div>

            {/* Box 2: Esquema de Facturación */}
            <div className="bg-white/10 rounded-2xl p-4 border border-white/15 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-bold text-[11px] uppercase tracking-wider">
                  Modalidad de Pago
                </span>
                <Shield className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="text-sm font-black text-white">
                {effectiveStudent.paymentBillingCycle === 'weekly' ? 'Semana a Semana' : 'Pago Mensual Prepagado (Ahorro)'}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {effectiveStudent.paymentBillingCycle === 'weekly' 
                  ? 'Pago semanal continuo. Recomendado para ritmo semana a semana.' 
                  : 'Mes completo prepagado por adelantado con descuento. Incluye bolsa de horas para todo el mes.'}
              </p>
              <div className="pt-1 flex items-center gap-1.5 text-emerald-300 text-[11px] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Turno habitual: {effectiveStudent.preferredTimeSlot || 'Lunes y Miércoles 6:00 pm'}</span>
              </div>
            </div>

            {/* Box 3: Próximas Clases Confirmadas */}
            <div className="bg-white/10 rounded-2xl p-4 border border-white/15 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-bold text-[11px] uppercase tracking-wider">
                  Próxima Clase Confirmada
                </span>
                <Video className="w-4 h-4 text-blue-300" />
              </div>

              {effectiveStudent.bookedSessions && effectiveStudent.bookedSessions.length > 0 ? (
                (() => {
                  const nextSess = effectiveStudent.bookedSessions[0];
                  return (
                    <div className="space-y-1.5">
                      <div className="font-black text-sm text-amber-200">
                        {nextSess.day} {nextSess.date} • {nextSess.startTime} - {nextSess.endTime}
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold bg-emerald-400 text-slate-950 px-2 py-0.2 rounded-md">
                          ✅ PREPAGADA
                        </span>
                        <span className="text-[10px] font-medium text-slate-200">
                          {nextSess.purposeLabel}
                        </span>
                      </div>
                      {nextSess.meetLink && (
                        <a
                          href={nextSess.meetLink}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-black text-white bg-blue-600 hover:bg-blue-500 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <Video className="w-3 h-3" />
                          <span>Entrar a Google Meet</span>
                        </a>
                      )}
                    </div>
                  );
                })()
              ) : (
                <div className="text-slate-300 text-xs py-1">
                  <span>Sin clases programadas esta semana. ¡Agenda con tu bolsa prepagada!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2.8 MAIN VIEW SELECTOR (SEMANAL vs MES ACTUAL OCTUBRE vs MES SIGUIENTE NOVIEMBRE) */}
      <div className="bg-white rounded-3xl p-2 sm:p-2.5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="grid grid-cols-3 gap-1.5 w-full text-xs font-bold">
          
          {/* Tab 1: Vista Semanal */}
          <button
            onClick={() => setCalendarTab('weekly')}
            className={`py-3 px-3 rounded-2xl flex items-center justify-center gap-2 transition-all ${
              calendarTab === 'weekly'
                ? 'bg-slate-900 text-amber-300 shadow-md font-black scale-101'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate">⚡ Agenda Semanal Interactiva</span>
          </button>

          {/* Tab 2: Esquema Mes Actual */}
          <button
            onClick={() => setCalendarTab('current_month')}
            className={`py-3 px-3 rounded-2xl flex items-center justify-center gap-2 transition-all ${
              calendarTab === 'current_month'
                ? 'bg-blue-600 text-white shadow-md font-black scale-101'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <CalendarIcon className="w-4 h-4 text-blue-200 shrink-0" />
            <span className="truncate">🗓️ Esquema Mes Actual (Octubre)</span>
          </button>

          {/* Tab 3: Esquema Mes Siguiente */}
          <button
            onClick={() => setCalendarTab('next_month')}
            className={`py-3 px-3 rounded-2xl flex items-center justify-center gap-2 transition-all ${
              calendarTab === 'next_month'
                ? 'bg-indigo-600 text-white shadow-md font-black scale-101'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <CalendarIcon className="w-4 h-4 text-indigo-200 shrink-0" />
            <span className="truncate">📆 Esquema Mes Siguiente (Noviembre)</span>
          </button>

        </div>
      </div>

      {/* CONDITIONAL RENDER: MONTH SCHEME VIEWS */}
      {calendarTab !== 'weekly' && (
        <MonthScheduleView
          student={effectiveStudent}
          targetMonth={calendarTab === 'current_month' ? 'current' : 'next'}
          onOpenPrepaidBooking={(preselectedDate) => {
            setPreselectedPrepaidDate(preselectedDate || null);
            setIsPrepaidBookingModalOpen(true);
          }}
        />
      )}

      {/* CONDITIONAL RENDER: WEEKLY VIEW (ONLY WHEN TAB === 'weekly') */}
      {calendarTab === 'weekly' && (
        <>
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
                      const matchingSession = (effectiveStudent?.bookedSessions || []).find(
                        s => s.startTime === slot.startTime && s.day === slot.day
                      );

                      return (
                        <div
                          key={slot.id}
                          className="p-3.5 rounded-2xl border-2 border-emerald-400 bg-gradient-to-r from-teal-50 to-emerald-50 shadow-md space-y-2.5"
                        >
                          <div className="flex items-center justify-between flex-wrap gap-1">
                            <span className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-emerald-600" />
                              {slot.startTime} - {slot.endTime}
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] font-black bg-[#2EC4B6] text-slate-950 px-2 py-0.2 rounded-full shadow-2xs">
                                ⭐ Tu Clase
                              </span>
                              <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.2 rounded-full shadow-2xs">
                                ✅ PREPAGADA
                              </span>
                            </div>
                          </div>

                          <div className="text-xs space-y-0.5">
                            <p className="font-black text-slate-900">
                              {matchingSession?.title || `${levelData?.levelName || 'Super Goal 1'} • Tutoría Privada`}
                            </p>
                            <p className="text-[11px] font-bold text-emerald-800">
                              Objetivo: {matchingSession?.purposeLabel || '📚 Lección Curricular & Repaso'}
                            </p>
                            <p className="text-[11px] text-slate-500">Teacher: Teacher Cokitö & Directora Waky</p>
                          </div>

                          {slot.meetLink && (
                            <div className="pt-1 border-t border-emerald-200/80">
                              <a
                                href={slot.meetLink}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded-xl shadow-xs transition-colors"
                              >
                                <Video className="w-3.5 h-3.5" />
                                <span>Entrar a Google Meet en Vivo</span>
                              </a>
                            </div>
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
                          onClick={() => handleInitiateBooking(slot)}
                          className="shrink-0 text-[11px] font-black text-emerald-900 bg-white border border-emerald-300 hover:bg-emerald-100 px-3 py-1.5 rounded-xl shadow-2xs transition-colors"
                        >
                          {currentStudent && currentStudent.id !== 'guest' ? 'Agendar' : 'Reservar'}
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
    </>
  )}

      {/* Student Fast Booking Modal for Logged-In Student */}
      {isBookingModalOpen && effectiveStudent && (
        <StudentScheduleRequestModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedBookingSlot(null);
          }}
          student={effectiveStudent}
          preselectedSlot={selectedBookingSlot}
          allSlots={slots}
          allLevels={ENGLISH_LEVELS}
          onSuccess={(msg) => setActionMessage(msg)}
          onUpdateStudent={onUpdateStudent}
        />
      )}

      {/* Student Prepaid Hours Dedicated Booking Modal */}
      {isPrepaidBookingModalOpen && effectiveStudent && (
        <PrepaidSessionBookingModal
          isOpen={isPrepaidBookingModalOpen}
          onClose={() => {
            setIsPrepaidBookingModalOpen(false);
            setPreselectedPrepaidDate(null);
          }}
          student={effectiveStudent}
          preselectedDate={preselectedPrepaidDate}
          onBookingSuccess={(newSession, updatedStudent) => {
            if (onUpdateStudent) {
              onUpdateStudent(updatedStudent);
            }
            setActionMessage(`✅ ¡Clase individual prepagada agendada con éxito para el ${newSession.date} (${newSession.startTime})! Horas descontadas de tu bolsa.`);
          }}
        />
      )}
    </div>
  );
};
