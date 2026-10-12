import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Video, 
  BookOpen, 
  HelpCircle, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, BookedSession, BookedSessionPurpose } from '../types';
import { trackStudentAction } from '../services/telemetryService';
import { addStudentClassRequest } from '../services/notificationService';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface PrepaidSessionBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  preselectedDate?: string | null;
  onBookingSuccess: (newSession: BookedSession, updatedStudent: Student) => void;
}

const PURPOSES: { id: BookedSessionPurpose; label: string; icon: string; desc: string }[] = [
  {
    id: 'lesson',
    label: '📚 Lección Curricular de Avance',
    icon: '📚',
    desc: 'Continuar el avance en tu libro oficial (Super Goal o Mega Goal).'
  },
  {
    id: 'review',
    label: '🔄 Repaso & Refuerzo',
    icon: '🔄',
    desc: 'Afianzar dudas, gramática pendiente o pronunciación de unidades anteriores.'
  },
  {
    id: 'exam_prep',
    label: '🎯 Preparación de Examen / Certificación',
    icon: '🎯',
    desc: 'Entrenamiento intensivo para pruebas escolares, universitarias o laborales.'
  },
  {
    id: 'conversation',
    label: '🗣️ Conversación Fluida Guiada',
    icon: '🗣️',
    desc: 'Práctica oral intensiva, simulación de entrevistas y soltar la lengua.'
  }
];

const TIME_OPTIONS = [
  '07:00 - 08:00 (Mañana Temprano)',
  '08:00 - 09:00 (Mañana)',
  '09:00 - 10:00 (Mañana)',
  '10:00 - 11:00 (Mañana)',
  '15:00 - 16:00 (Tarde Escolar)',
  '16:00 - 17:00 (Tarde Escolar)',
  '17:00 - 18:00 (Tarde)',
  '18:00 - 19:00 (Tarde / Noche)',
  '19:00 - 20:00 (Noche)',
  '20:00 - 21:00 (Noche Adultos)'
];

export const PrepaidSessionBookingModal: React.FC<PrepaidSessionBookingModalProps> = ({
  isOpen,
  onClose,
  student,
  preselectedDate,
  onBookingSuccess
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    if (preselectedDate) return preselectedDate;
    const now = new Date();
    // Default to tomorrow or next Monday
    const target = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    return target.toISOString().split('T')[0];
  });

  const [selectedTime, setSelectedTime] = useState<string>('18:00 - 19:00 (Tarde / Noche)');
  const [durationHours, setDurationHours] = useState<number>(1);
  const [purpose, setPurpose] = useState<BookedSessionPurpose>('lesson');
  const [teacherName, setTeacherName] = useState<string>('Teacher Cokitö');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentBalance = student.prepaidHoursBalance ?? 6.0;
  const expiresAt = student.prepaidHoursExpiresAt || '2026-11-11';
  const hasEnoughHours = currentBalance >= durationHours;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedDate) {
      setErrorMessage('Por favor selecciona una fecha válida.');
      return;
    }

    if (!hasEnoughHours) {
      setErrorMessage(`No tienes suficientes horas prepagadas disponibles (${currentBalance} hrs disponibles, requieres ${durationHours} hrs). Puedes adquirir un paquete adicional en caja.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const startTime = selectedTime.split(' ')[0] || '18:00';
      const endTimeH = parseInt(startTime.split(':')[0], 10) + durationHours;
      const endTime = `${String(endTimeH).padStart(2, '0')}:00`;

      // Determine day name in Spanish
      const dateObj = new Date(`${selectedDate}T12:00:00`);
      const daysEs = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const dayName = daysEs[dateObj.getDay()];

      const selectedPurposeObj = PURPOSES.find(p => p.id === purpose) || PURPOSES[0];

      const newSession: BookedSession = {
        id: `sess_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        date: selectedDate,
        day: dayName,
        startTime,
        endTime,
        hours: durationHours,
        teacherName,
        title: customTitle.trim() || `${selectedPurposeObj.label.split(' ')[1] || 'Clase'} con ${teacherName}`,
        purpose,
        purposeLabel: selectedPurposeObj.label,
        isPrepaid: true,
        status: 'confirmed',
        meetLink: 'https://meet.google.com/cok-waky-edu',
        notes: notes.trim()
      };

      const newBalance = Math.max(0, currentBalance - durationHours);
      const existingSessions = student.bookedSessions || [];

      const updatedStudent: Student = {
        ...student,
        prepaidHoursBalance: newBalance,
        isPrepaidActive: true,
        bookedSessions: [newSession, ...existingSessions],
        notes: `${student.notes || ''} | Hora prepagada reservada el ${new Date().toLocaleDateString('es-VE')} para ${selectedDate} ${startTime}`
      };

      // Telemetry
      trackStudentAction(student, 'calendar', 'prepaid_hour_booked', `Agendó ${durationHours}h para ${selectedDate} (${selectedPurposeObj.label})`);

      // Firestore persistence
      try {
        const reqRecord = addStudentClassRequest({
          studentId: student.id,
          studentName: student.name,
          studentEmail: student.email,
          requestedClassesCount: durationHours,
          preferredTeacher: teacherName,
          preferredDaysTimes: `${dayName} ${selectedDate} ${startTime} - ${endTime}`,
          modality: student.modality || 'online',
          notes: `[PREPAGADA CONFIRMADA] ${newSession.title} - ${notes}`
        });

        const reqRef = doc(db, 'classRequests', reqRecord.id);
        await setDoc(reqRef, {
          ...reqRecord,
          isPrepaid: true,
          status: 'confirmed',
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Firestore sync note:', err);
      }

      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } catch {}

      onBookingSuccess(newSession, updatedStudent);
      onClose();
    } catch (err: any) {
      console.error('Error booking prepaid session:', err);
      setErrorMessage('Hubo un inconveniente al registrar la reserva. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-5 sm:p-6 relative">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full inline-block">
                ⭐ Bolsa de Horas Prepagadas
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                Agendar Hora Individual con Teacher
              </h3>
              <p className="text-xs text-blue-200">
                Usa tus horas disponibles para repasar, preparar exámenes o avanzar a tu ritmo.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Balance Widget Banner */}
          <div className="mt-4 p-3 bg-white/10 rounded-2xl border border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Horas disponibles en tu bolsa:</span>
              <strong className="text-sm font-black text-amber-300 bg-white/10 px-2 py-0.5 rounded-lg">
                {currentBalance} hrs
              </strong>
            </div>
            <div className="text-[11px] text-blue-200">
              Vigencia 30 días: <span className="font-bold text-white">{expiresAt}</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleBooking} className="p-5 sm:p-6 space-y-4">
          
          {/* Motivo / Propósito pedagógico */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              ¿Para qué deseas utilizar esta hora individual? *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {PURPOSES.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPurpose(p.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    purpose === p.id
                      ? 'border-blue-600 bg-blue-50/80 font-bold text-blue-950 shadow-xs ring-2 ring-blue-100'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="font-black text-xs text-slate-900">{p.label}</div>
                  <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-snug">
                    {p.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Fecha & Turno */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Fecha de la Sesión *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  required
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Octubre o Noviembre 2026
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Horario / Franja Horaria *
              </label>
              <select
                value={selectedTime}
                onChange={e => setSelectedTime(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                {TIME_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Duración & Profesor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Duración de la Sesión:
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
                {[
                  { h: 1, label: '1 Hora' },
                  { h: 1.5, label: '1.5 H' },
                  { h: 2, label: '2 Horas' }
                ].map(item => (
                  <button
                    key={item.h}
                    type="button"
                    onClick={() => setDurationHours(item.h)}
                    className={`py-2 px-1 rounded-xl border text-center transition-all ${
                      durationHours === item.h
                        ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Deducirá {durationHours}h de tus {currentBalance}h disponibles
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Teacher Asignado(a):
              </label>
              <select
                value={teacherName}
                onChange={e => setTeacherName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="Teacher Cokitö">Teacher Cokitö (Titular)</option>
                <option value="Directora Waky">Directora Waky (Supervisión)</option>
                <option value="Flock Mentor Rotativo">Flock Mentor Rotativo</option>
              </select>
            </div>
          </div>

          {/* Tema específico o notas */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tema específico o mensaje para la clase (opcional):
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={e => setCustomTitle(e.target.value)}
              placeholder="Ej. Repasar pasado regular e irregular, o practicar preguntas del examen"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !hasEnoughHours}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all ${
                hasEnoughHours
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Confirmando...' : `Confirmar y Descontar ${durationHours}h`}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
