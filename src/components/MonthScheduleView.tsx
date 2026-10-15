import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Video, 
  Plus, 
  ChevronRight, 
  ChevronLeft,
  X,
  User,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Student, BookedSession } from '../types';

interface MonthScheduleViewProps {
  student: Student | null;
  targetMonth: 'current' | 'next'; // 'current' = Octubre 2026, 'next' = Noviembre 2026
  onOpenPrepaidBooking: (preselectedDate?: string) => void;
}

interface CalendarDay {
  dayNumber: number;
  dateStr: string; // YYYY-MM-DD
  dayName: string;
  isToday: boolean;
  isCycleExpiry: boolean;
  isCurrentMonth: boolean;
  sessions: BookedSession[];
  isRecurringDay: boolean; // e.g., Mon/Wed
}

export const MonthScheduleView: React.FC<MonthScheduleViewProps> = ({
  student,
  targetMonth,
  onOpenPrepaidBooking
}) => {
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

  const MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const [activeMonthIndex, setActiveMonthIndex] = useState<number>(targetMonth === 'next' ? 10 : 9);
  const [activeYear, setActiveYear] = useState<number>(2026);

  const monthTitle = `${MONTH_NAMES[activeMonthIndex]} ${activeYear}`;
  const isOctober = activeMonthIndex === 9 && activeYear === 2026;
  const daysInMonth = new Date(activeYear, activeMonthIndex + 1, 0).getDate();
  const firstDayDate = new Date(activeYear, activeMonthIndex, 1, 12, 0, 0);
  const firstDayOfWeek = (firstDayDate.getDay() + 6) % 7 + 1; // 1 = Lunes ... 7 = Domingo

  const handlePrevMonth = () => {
    if (activeMonthIndex === 0) {
      setActiveMonthIndex(11);
      setActiveYear(y => y - 1);
    } else {
      setActiveMonthIndex(m => m - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (activeMonthIndex === 11) {
      setActiveMonthIndex(0);
      setActiveYear(y => y + 1);
    } else {
      setActiveMonthIndex(m => m + 1);
    }
    setSelectedDay(null);
  };

  const studentSessions: BookedSession[] = student?.bookedSessions || [];
  const studentSlots = student?.assignedSlots || [];
  const hasMonWed = Boolean(
    studentSlots.some(s => s.toLowerCase().includes('lun') || s.toLowerCase().includes('mie')) ||
    (student?.preferredTimeSlot?.toLowerCase().includes('lun') && student?.preferredTimeSlot?.toLowerCase().includes('mie'))
  );
  const hasTueThu = Boolean(
    studentSlots.some(s => s.toLowerCase().includes('mar') || s.toLowerCase().includes('jue')) ||
    (student?.preferredTimeSlot?.toLowerCase().includes('mar') && student?.preferredTimeSlot?.toLowerCase().includes('jue'))
  );

  // Build calendar days array
  const calendarDays: CalendarDay[] = [];

  // 1. Leading blank days
  const leadingBlanks = firstDayOfWeek - 1;
  const prevMonthDate = new Date(activeYear, activeMonthIndex, 0);
  const prevMonthTotalDays = prevMonthDate.getDate();
  const prevMonthNum = activeMonthIndex === 0 ? 12 : activeMonthIndex;
  const prevMonthYear = activeMonthIndex === 0 ? activeYear - 1 : activeYear;

  for (let i = 0; i < leadingBlanks; i++) {
    const prevDayNum = prevMonthTotalDays - leadingBlanks + i + 1;
    const dateStr = `${prevMonthYear}-${String(prevMonthNum).padStart(2, '0')}-${String(prevDayNum).padStart(2, '0')}`;
    calendarDays.push({
      dayNumber: prevDayNum,
      dateStr,
      dayName: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][i],
      isToday: false,
      isCycleExpiry: false,
      isCurrentMonth: false,
      sessions: [],
      isRecurringDay: false
    });
  }

  // 2. Real month days
  for (let day = 1; day <= daysInMonth; day++) {
    const mm = String(activeMonthIndex + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const dateStr = `${activeYear}-${mm}-${dd}`;
    const dateObj = new Date(`${dateStr}T12:00:00`);
    const dayOfWeek = (dateObj.getDay() + 6) % 7; // Mon=0, Tue=1, ..., Sun=6
    const daysEs = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const dayName = daysEs[dayOfWeek];

    const isToday = activeYear === 2026 && activeMonthIndex === 9 && day === 15;
    const isCycleExpiry = day === 11;

    // Check sessions booked for this specific date
    const daySessions = studentSessions.filter(s => s.date === dateStr);

    // Check if this is a recurring flight day for the student
    const isRecurringDay = (hasMonWed && (dayName === 'Lunes' || dayName === 'Miércoles')) ||
      (hasTueThu && (dayName === 'Martes' || dayName === 'Jueves'));

    calendarDays.push({
      dayNumber: day,
      dateStr,
      dayName,
      isToday,
      isCycleExpiry,
      isCurrentMonth: true,
      sessions: daySessions,
      isRecurringDay
    });
  }

  // 3. Trailing blank days to complete 35 or 42 grid cells
  const totalCells = Math.ceil(calendarDays.length / 7) * 7;
  const trailingBlanks = totalCells - calendarDays.length;
  for (let i = 1; i <= trailingBlanks; i++) {
    const nextMonthNum = activeMonthIndex === 11 ? 1 : activeMonthIndex + 2;
    const nextMonthYear = activeMonthIndex === 11 ? activeYear + 1 : activeYear;
    const dateStr = `${nextMonthYear}-${String(nextMonthNum).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarDays.push({
      dayNumber: i,
      dateStr,
      dayName: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][(calendarDays.length) % 7],
      isToday: false,
      isCycleExpiry: false,
      isCurrentMonth: false,
      sessions: [],
      isRecurringDay: false
    });
  }

  // Monthly stats
  const activeMonthPrefix = `${activeYear}-${String(activeMonthIndex + 1).padStart(2, '0')}`;
  const totalMonthSessions = studentSessions.filter(s => s.date.startsWith(activeMonthPrefix));
  const totalMonthHours = totalMonthSessions.reduce((acc, s) => acc + (s.hours || 1), 0);

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* Month Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-300/30">
              {isOctober ? '📅 Esquema del Mes Actual' : '📆 Esquema del Mes Siguiente Proyectado'}
            </span>
            <span className="text-xs font-bold text-slate-300">
              {isOctober ? 'Octubre 2026 (4.5 Semanas)' : 'Noviembre 2026 (Ciclo Renovable)'}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap mt-1">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {monthTitle} • Calendario de Sesiones
            </h3>
            <div className="flex items-center gap-1 ml-0 sm:ml-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                title="Mes Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                title="Mes Siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-300 max-w-xl mt-1">
            Visualiza las clases reservadas y prepagadas del ciclo con fecha y mes exactos. Puedes avanzar a los meses siguientes para proyectar tu agenda con Teacher Cokitö.
          </p>
        </div>

        {/* Stats Pill Card */}
        <div className="flex items-center gap-2.5 bg-white/10 p-3 rounded-2xl border border-white/15 shrink-0">
          <div className="text-center px-2">
            <div className="text-lg sm:text-xl font-black text-amber-300">
              {totalMonthSessions.length}
            </div>
            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
              Clases
            </div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center px-2">
            <div className="text-lg sm:text-xl font-black text-emerald-300">
              {totalMonthHours}h
            </div>
            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
              Horas
            </div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <button
            onClick={() => onOpenPrepaidBooking()}
            className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agendar</span>
          </button>
        </div>
      </div>

      {/* Expiry / Renewal Notice Card */}
      <div className={`p-4 rounded-2xl border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        isOctober
          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
          : 'bg-blue-50/80 border-blue-200 text-blue-950'
      }`}>
        <div className="flex items-center gap-2.5">
          <Sparkles className={`w-5 h-5 shrink-0 ${isOctober ? 'text-emerald-600' : 'text-blue-600'}`} />
          <div>
            <strong className="font-black text-sm block">
              {isOctober
                ? '✅ Bolsa Mensual Prepagada Activa (Mes Calendario de 30 Días)'
                : '📆 Proyección de Noviembre 2026 (Reserva de Cupo Continuo)'}
            </strong>
            <span className="text-xs opacity-90">
              {isOctober
                ? 'Tu ciclo actual inició el 11 de Octubre de 2026 y está cubierto con tarifa preferencial hasta el 11 de Noviembre de 2026.'
                : 'El ciclo vigente concluye el 11 de Noviembre. Puedes programar las clases de todo Noviembre para no perder tu turno habitual.'}
            </span>
          </div>
        </div>

        <button
          onClick={() => onOpenPrepaidBooking()}
          className={`shrink-0 px-3.5 py-2 rounded-xl font-black text-xs shadow-2xs transition-all ${
            isOctober
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isOctober ? '➕ Usar Mis Horas Prepagadas' : '📅 Proyectar Noviembre'}
        </button>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/90 text-center text-xs font-black text-slate-700">
          {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(d => (
            <div key={d} className="py-3 px-1 border-r last:border-r-0 border-slate-200">
              <span className="hidden sm:inline">{d}</span>
              <span className="sm:hidden">{d.slice(0, 3)}</span>
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 auto-rows-fr">
          {calendarDays.map((day, idx) => {
            const hasSessions = day.sessions.length > 0;
            const isClickable = day.isCurrentMonth;

            return (
              <div
                key={`${day.dateStr}-${idx}`}
                onClick={() => {
                  if (isClickable) setSelectedDay(day);
                }}
                className={`min-h-[95px] sm:min-h-[110px] p-2 border-b border-r last:border-r-0 border-slate-100 flex flex-col justify-between transition-all relative ${
                  !day.isCurrentMonth
                    ? 'bg-slate-50/50 text-slate-300'
                    : isClickable
                    ? 'cursor-pointer hover:bg-blue-50/40 bg-white'
                    : 'bg-white'
                } ${day.isToday ? 'ring-2 ring-blue-500 ring-inset bg-blue-50/30 font-bold' : ''}`}
              >
                {/* Day Header Row */}
                <div className="flex items-center justify-between text-xs">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black ${
                    day.isToday
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : day.isCurrentMonth
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}>
                    {day.dayNumber}
                  </span>

                  {day.isToday && (
                    <span className="text-[9px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-md">
                      HOY
                    </span>
                  )}

                  {day.isCycleExpiry && (
                    <span className="text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded-md" title="Vence el ciclo de 30 días">
                      Vence
                    </span>
                  )}

                  {!day.isToday && !day.isCycleExpiry && day.isRecurringDay && day.isCurrentMonth && (
                    <span className="text-[8px] font-bold text-slate-400 hidden sm:inline" title="Día de tu ritmo habitual">
                      Turno Fijo
                    </span>
                  )}
                </div>

                {/* Sessions Badge List */}
                <div className="space-y-1 my-1 flex-1 overflow-hidden">
                  {day.sessions.slice(0, 2).map(sess => (
                    <div
                      key={sess.id}
                      className="p-1 rounded-lg bg-emerald-100/90 border border-emerald-300 text-emerald-950 text-[10px] font-bold truncate flex items-center gap-1 shadow-2xs hover:scale-101 transition-transform"
                      title={`${sess.startTime} - ${sess.endTime}: ${sess.title} (${sess.purposeLabel})`}
                    >
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-700 shrink-0" />
                      <span className="truncate">{sess.startTime} • {sess.purposeLabel.split(' ')[0]} {sess.title}</span>
                    </div>
                  ))}

                  {day.sessions.length > 2 && (
                    <div className="text-[9px] text-slate-500 font-bold pl-1">
                      +{day.sessions.length - 2} sesión(es) más
                    </div>
                  )}

                  {day.sessions.length === 0 && day.isRecurringDay && day.isCurrentMonth && (
                    <div className="hidden sm:block p-1 rounded-md bg-slate-50 border border-dashed border-slate-200 text-slate-400 text-[9px] truncate">
                      💡 Horario habitual 6:00 pm
                    </div>
                  )}
                </div>

                {/* Day Footer Action Indicator */}
                {day.isCurrentMonth && (
                  <div className="text-[9px] text-blue-600 font-bold flex items-center justify-end opacity-0 group-hover:opacity-100 hover:underline">
                    <span>{hasSessions ? 'Ver detalle' : '+ Agendar'}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* Day Detail & Booking Modal Drawer */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div 
            className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white p-5 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full inline-block">
                  Detalle del Día
                </span>
                <h4 className="text-lg font-black mt-1">
                  {selectedDay.dayName} {selectedDay.dayNumber} de {monthTitle}
                </h4>
                <p className="text-xs text-blue-200">
                  {selectedDay.sessions.length} clase(s) programada(s) para esta fecha
                </p>
              </div>

              <button
                onClick={() => setSelectedDay(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {selectedDay.sessions.length > 0 ? (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Sesiones Confirmadas:
                  </span>
                  {selectedDay.sessions.map(sess => (
                    <div 
                      key={sess.id}
                      className="p-4 rounded-2xl border border-emerald-300 bg-emerald-50/70 space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{sess.startTime} - {sess.endTime} ({sess.hours}h)</span>
                        </span>
                        <span className="text-[10px] font-black bg-emerald-600 text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                          ✅ PREPAGADA
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <strong className="text-sm font-black text-slate-900 block">
                          {sess.title}
                        </strong>
                        <span className="text-xs text-slate-600 font-medium block">
                          Objetivo: <strong className="text-emerald-900">{sess.purposeLabel}</strong>
                        </span>
                        <span className="text-xs text-slate-500 block">
                          Teacher: <strong>{sess.teacherName}</strong>
                        </span>
                      </div>

                      {sess.meetLink && (
                        <div className="pt-2 border-t border-emerald-200/80 flex justify-end">
                          <a
                            href={sess.meetLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition-colors"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Entrar a Google Meet</span>
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <h5 className="font-bold text-xs text-slate-800">
                    No tienes clases programadas para este día
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Puedes agendar una hora individual con tu teacher usando tu bolsa de horas prepagadas.
                  </p>
                </div>
              )}

              {/* Quick Action to Book on this Day */}
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => {
                    const dateToBook = selectedDay.dateStr;
                    setSelectedDay(null);
                    onOpenPrepaidBooking(dateToBook);
                  }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>➕ Agendar Hora Prepagada en Este Día</span>
                </button>

                <button
                  onClick={() => setSelectedDay(null)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
                >
                  Cerrar
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
