import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  User, 
  Mail, 
  Tag, 
  BookOpen, 
  Send,
  AlertCircle
} from 'lucide-react';
import { Student, ScheduleSlot, EnglishLevel } from '../types';
import { addStudentClassRequest } from '../services/notificationService';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { trackStudentAction } from '../services/telemetryService';

interface StudentScheduleRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  preselectedSlot?: ScheduleSlot | null;
  allSlots: ScheduleSlot[];
  allLevels: EnglishLevel[];
  onSuccess: (message: string) => void;
  onUpdateStudent?: (student: Student) => void;
}

export const StudentScheduleRequestModal: React.FC<StudentScheduleRequestModalProps> = ({
  isOpen,
  onClose,
  student,
  preselectedSlot,
  allSlots,
  allLevels,
  onSuccess,
  onUpdateStudent
}) => {
  const [selectedDayTime, setSelectedDayTime] = useState<string>(() => {
    if (preselectedSlot) {
      return `${preselectedSlot.day} ${preselectedSlot.startTime} - ${preselectedSlot.endTime}`;
    }
    return 'Lunes y Miércoles de 5:00 pm a 6:00 pm';
  });
  const [preferredTeacher, setPreferredTeacher] = useState<string>('Teacher Cokitö');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const matchedLevel = allLevels.find(l => l.id === student.levelId);
  const activeCoupon = student.couponCodeAssigned || student.couponCodeUsed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const slotText = selectedDayTime.trim();

    try {
      // 1. Create class request record
      const newRequest = addStudentClassRequest({
        studentId: student.id,
        studentName: `${student.name} ${student.lastName || ''}`.trim(),
        studentEmail: student.email,
        requestedClassesCount: student.plan === 'basic' ? 2 : student.plan === 'regular' ? 3 : student.plan === 'intensive' ? 4 : 2,
        preferredTeacher,
        preferredDaysTimes: slotText,
        modality: student.modality || 'online',
        notes: notes.trim() || `Solicitud directa de horario por parte del alumno desde el Campus (${slotText})`
      });

      // 2. Persist to Firestore classRequests collection
      try {
        const reqRef = doc(db, 'classRequests', newRequest.id);
        await setDoc(reqRef, {
          ...newRequest,
          studentName: student.name,
          studentEmail: student.email,
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Firestore classRequests note:', err);
      }

      // 3. Track interaction telemetry
      trackStudentAction(student, 'calendar', 'schedule_requested', `Turno solicitado: ${slotText} con ${preferredTeacher}`);

      // 4. Update student model notes and pending slot state
      if (onUpdateStudent) {
        const currentAssigned = student.assignedSlots || [];
        const updatedStudent: Student = {
          ...student,
          preferredTimeSlot: slotText,
          assignedSlots: student.status === 'enrolled'
            ? Array.from(new Set([...currentAssigned, slotText]))
            : currentAssigned,
          notes: `${student.notes || ''} | Solicitó / seleccionó horario [${slotText}] con ${preferredTeacher} el ${new Date().toLocaleDateString('es-VE')}`
        };
        onUpdateStudent(updatedStudent);
      }

      onSuccess(`¡Listo ${student.name}! Tu horario "${slotText}" ha sido solicitado directamente a Rectoría. La Directora Waky y la Teacher Cokitö han recibido tu solicitud.`);
      onClose();
    } catch (err) {
      console.error('Error al agendar:', err);
      onSuccess(`¡Solicitud enviada! Tu turno "${slotText}" ha quedado registrado para revisión.`);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 text-xs text-amber-300 font-bold mb-1">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Reserva de Turno • Güakytopia Campus</span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-white">
            Solicitar Horario de Clases
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Tus datos ya están registrados en el sistema. Solo elige tu horario preferido.
          </p>
        </div>

        {/* Pre-filled Student Summary (NO RE-ASKING DATA!) */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-600">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>{student.name} {student.lastName || ''}</span>
            </span>
            <span className="font-mono text-slate-500">{student.email}</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px]">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-100 text-indigo-900 font-bold border border-indigo-200">
              <BookOpen className="w-3 h-3 text-indigo-600" />
              <span>{matchedLevel ? `${matchedLevel.levelName} (${matchedLevel.book})` : student.levelId || 'Super Goal 1'}</span>
            </span>

            {activeCoupon && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                <Tag className="w-3 h-3 text-emerald-600" />
                <span>Cupón: {activeCoupon}</span>
              </span>
            )}

            <span className="text-slate-500">
              Plan: <strong className="text-slate-700 capitalize">{student.plan}</strong>
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          {/* Turno / Horario */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              📅 Selecciona o escribe tu turno / horario preferido:
            </label>
            <div className="space-y-2">
              <select
                value={selectedDayTime}
                onChange={e => setSelectedDayTime(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 text-xs focus:ring-2 focus:ring-amber-500"
              >
                <option value="Lunes y Miércoles de 5:00 pm a 6:00 pm">Lunes y Miércoles (5:00 pm - 6:00 pm)</option>
                <option value="Lunes y Miércoles de 6:00 pm a 7:00 pm">Lunes y Miércoles (6:00 pm - 7:00 pm)</option>
                <option value="Martes y Jueves de 4:00 pm a 5:00 pm">Martes y Jueves (4:00 pm - 5:00 pm)</option>
                <option value="Martes y Jueves de 5:00 pm a 6:00 pm">Martes y Jueves (5:00 pm - 6:00 pm)</option>
                <option value="Martes y Jueves de 6:00 pm a 7:00 pm">Martes y Jueves (6:00 pm - 7:00 pm)</option>
                <option value="Sábados de 9:00 am a 11:00 am (Sabatino)">Sábados (9:00 am - 11:00 am)</option>
                <option value="Sábados de 10:00 am a 12:00 pm (Sabatino)">Sábados (10:00 am - 12:00 pm)</option>
                <option value="Sábados de 2:00 pm a 4:00 pm (Tardes)">Sábados (2:00 pm - 4:00 pm)</option>
                <option value="custom">Otro horario personalizado…</option>
              </select>

              {selectedDayTime === 'custom' && (
                <input
                  type="text"
                  placeholder="Escribe tu disponibilidad exacta (Ej: Lunes y Viernes a las 7:00 pm)..."
                  onChange={e => setSelectedDayTime(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  autoFocus
                  required
                />
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Si tu cupón o beca incluye 2 horas semanales, este horario reservará tus 2 sesiones de la semana.
            </p>
          </div>

          {/* Teacher preferido */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              🦉 Modalidad de Teacher:
            </label>
            <select
              value={preferredTeacher}
              onChange={e => setPreferredTeacher(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-semibold text-slate-800 text-xs focus:ring-2 focus:ring-amber-500"
            >
              <option value="Teacher Cokitö">Teacher Cokitö (Clases en vivo directas)</option>
              <option value="La Manada de Teachers Güakytopia">La Manada de Teachers Güakytopia (Horarios rotativos y flexibles)</option>
            </select>
          </div>

          {/* Comentario o nota opcional */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              💬 Nota para la Directora Waky / Teacher Cokitö (Opcional):
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="¿Algún detalle importante sobre tus horas, trabajo o conexión? (Ej: Solo puedo a partir de las 6pm)..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Send className="w-3.5 h-3.5 text-amber-400" />
              <span>{isSubmitting ? 'Agendando...' : 'Confirmar Reserva de Horario'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
