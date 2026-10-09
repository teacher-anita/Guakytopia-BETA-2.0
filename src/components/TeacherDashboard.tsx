import React, { useState } from 'react';
import { 
  UserCheck, Clock, Award, Mail, Send, CheckCircle2, Star, Edit3, Plus, 
  TrendingUp, BookOpen, AlertCircle, FileText, Check, Phone, Video, Copy,
  Users, UserPlus, Trash2, Calendar, Shield, ExternalLink, Sparkles, Filter,
  Coffee
} from 'lucide-react';
import { Student, PlanIntensity, ScheduleSlot } from '../types';
import { ENGLISH_LEVELS, INTENSITY_PLANS } from '../data/curriculumData';
import { generateEmailTemplate, sendGmailEmail } from '../services/gmailNotifier';
import { TeachersLounge } from './TeachersLounge';

interface TeacherDashboardProps {
  students: Student[];
  slots?: ScheduleSlot[];
  onUpdateStudent: (updatedStudent: Student) => void;
  onUpdateSlots?: (updatedSlots: ScheduleSlot[]) => void;
  onOpenOptimizer: () => void;
  onLogoutTeacher?: () => void;
  onSwitchToPrincipal?: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  students,
  slots = [],
  onUpdateStudent,
  onUpdateSlots,
  onOpenOptimizer,
  onLogoutTeacher,
  onSwitchToPrincipal
}) => {
  // Main view tab
  const [activeMainTab, setActiveMainTab] = useState<'lounge' | 'evaluation'>('lounge');

  // Navigation tab
  const [activeDashboardTab, setActiveDashboardTab] = useState<'classrooms' | 'applicants' | 'students'>('classrooms');

  // Classroom Roster Filter State
  const [classroomFilter, setClassroomFilter] = useState<'all' | 'assigned' | 'csb' | 'groups' | 'available'>('assigned');
  const [classroomSearch, setClassroomSearch] = useState('');
  const [selectedSlotForAssignment, setSelectedSlotForAssignment] = useState<ScheduleSlot | null>(null);
  const [studentToAssignId, setStudentToAssignId] = useState('');
  const [copiedMeetSlotId, setCopiedMeetSlotId] = useState<string | null>(null);

  // Pending students evaluation modal
  const [evaluatingStudent, setEvaluatingStudent] = useState<Student | null>(null);
  const [assignedLevelId, setAssignedLevelId] = useState('level_1');
  const [assignedSlotsInput, setAssignedSlotsInput] = useState('');
  const [teacherEvaluationNotes, setTeacherEvaluationNotes] = useState('');

  // Email Notification Modal
  const [selectedStudentForEmail, setSelectedStudentForEmail] = useState<Student | null>(null);
  const [emailTemplateType, setEmailTemplateType] = useState<'reminder_24h' | 'reminder_1h' | 'progress_report'>('reminder_24h');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null);

  // Edit Student Modal
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Filter pending vs active
  const pendingApplicants = students.filter(s => s.status === 'pending_evaluation');
  const activeStudents = students.filter(s => s.status === 'enrolled');

  const totalTeachingHours = activeStudents.reduce((acc, s) => {
    const plan = INTENSITY_PLANS[s.plan];
    return acc + (plan?.hoursPerWeek || 0);
  }, 0);

  // Copy Meet Link Helper
  const handleCopyMeet = (link: string, slotId: string) => {
    navigator.clipboard.writeText(link);
    setCopiedMeetSlotId(slotId);
    setTimeout(() => setCopiedMeetSlotId(null), 2500);
  };

  // Classroom Management Actions
  const handleAssignStudentToSlot = (slot: ScheduleSlot, studentId: string) => {
    if (!onUpdateSlots) return;
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const currentEnrolled = slot.enrolledStudents || [];
    if (currentEnrolled.some(e => e.studentId === student.id)) return;

    const newEnrolled = [
      ...currentEnrolled,
      {
        studentId: student.id,
        studentName: `${student.name} ${student.lastName || ''}`.trim(),
        levelId: student.levelId || 'level_1',
        avatar: student.avatar,
        email: student.email
      }
    ];

    const maxCap = slot.maxCapacity || 1;
    const isNowBooked = newEnrolled.length >= maxCap;

    const updatedSlot: ScheduleSlot = {
      ...slot,
      status: isNowBooked ? 'booked' : 'available',
      studentId: student.id,
      studentName: `${student.name} ${student.lastName || ''}`.trim(),
      levelId: student.levelId,
      meetLink: slot.meetLink || `https://meet.google.com/eng-${slot.id}-${Date.now().toString().slice(-4)}`,
      enrolledStudents: newEnrolled
    };

    const updatedSlots = slots.map(s => s.id === slot.id ? updatedSlot : s);
    onUpdateSlots(updatedSlots);

    // Update student's assignedSlots
    const updatedStudent: Student = {
      ...student,
      status: 'enrolled',
      assignedSlots: Array.from(new Set([...student.assignedSlots, slot.id]))
    };
    onUpdateStudent(updatedStudent);
    setSelectedSlotForAssignment(null);
    setStudentToAssignId('');
  };

  const handleRemoveStudentFromSlot = (slot: ScheduleSlot, studentId: string) => {
    if (!onUpdateSlots) return;
    const currentEnrolled = slot.enrolledStudents || [];
    const newEnrolled = currentEnrolled.filter(e => e.studentId !== studentId);

    const updatedSlot: ScheduleSlot = {
      ...slot,
      status: newEnrolled.length === 0 ? 'available' : slot.status,
      studentId: newEnrolled.length > 0 ? newEnrolled[0].studentId : undefined,
      studentName: newEnrolled.length > 0 ? newEnrolled[0].studentName : undefined,
      levelId: newEnrolled.length > 0 ? newEnrolled[0].levelId : undefined,
      enrolledStudents: newEnrolled
    };

    const updatedSlots = slots.map(s => s.id === slot.id ? updatedSlot : s);
    onUpdateSlots(updatedSlots);

    const student = students.find(s => s.id === studentId);
    if (student) {
      const updatedStudent: Student = {
        ...student,
        assignedSlots: student.assignedSlots.filter(id => id !== slot.id)
      };
      onUpdateStudent(updatedStudent);
    }
  };

  // Open evaluation modal
  const handleOpenEvaluation = (student: Student) => {
    setEvaluatingStudent(student);
    // Default to suggested level if available
    setAssignedLevelId(student.levelId || 'level_1');
    setAssignedSlotsInput(student.assignedSlots.join(', '));
    setTeacherEvaluationNotes(`Evaluado por Teacher Waky. Desempeño destacado en prueba de nivel.`);
  };

  const handleConfirmAssignment = async () => {
    if (!evaluatingStudent) return;

    const level = ENGLISH_LEVELS.find(l => l.id === assignedLevelId) || ENGLISH_LEVELS[0];
    const plan = INTENSITY_PLANS[evaluatingStudent.plan];

    const slotsArray = assignedSlotsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const updatedStudent: Student = {
      ...evaluatingStudent,
      levelId: assignedLevelId,
      status: 'enrolled',
      assignedSlots: slotsArray.length > 0 ? slotsArray : evaluatingStudent.assignedSlots,
      notes: `${evaluatingStudent.notes}\n[Nivel asignado oficialmente: ${level.levelName} (${level.book}) por Teacher Cokito]. ${teacherEvaluationNotes}`
    };

    onUpdateStudent(updatedStudent);

    // Send official acceptance email
    await sendGmailEmail({
      to: evaluatingStudent.email,
      subject: `🎓 ¡Tu Nivel Oficial en La Teacher Cokito ha sido Asignado!`,
      bodyText: `Hola ${evaluatingStudent.name},\n\n¡Excelentes noticias! La Teacher Cokito ha revisado personalmente los resultados de tu prueba de nivel.\n\nTu asignación oficial:\n- Nivel: ${level.levelName} (${level.book})\n- Módulo: Módulo ${level.module} - ${level.moduleName}\n- Paquete de estudio: ${plan?.name}\n- Horario confirmado: ${slotsArray.join(', ') || evaluatingStudent.preferredTimeSlot}\n\nYa puedes ingresar a la plataforma con tu cuenta para ver tus retos diarios de Duolingo y acceder a los materiales permanentes de Google Classroom.\n\n¡Nos vemos en clase!\nLa Teacher Cokito`
    }).catch(() => null);

    alert(`¡Nivel ${level.levelName} (${level.book}) asignado exitosamente a ${evaluatingStudent.name}!`);
    setEvaluatingStudent(null);
  };

  const handleOpenEmailModal = (student: Student) => {
    setSelectedStudentForEmail(student);
    const level = ENGLISH_LEVELS.find(l => l.id === student.levelId) || ENGLISH_LEVELS[0];
    const plan = INTENSITY_PLANS[student.plan];

    const template = generateEmailTemplate(emailTemplateType, {
      studentName: student.name,
      levelName: level.levelName,
      book: level.book,
      planName: plan?.name || 'Regular',
      slotTime: student.assignedSlots.length > 0 ? student.assignedSlots.join(', ') : 'Próxima clase programada',
      unit: student.currentUnit,
      xp: student.xp
    });

    setEmailSubject(template.subject);
    setEmailBody(template.bodyText);
    setSendResult(null);
  };

  const handleSendEmail = async () => {
    if (!selectedStudentForEmail) return;
    setIsSendingEmail(true);
    setSendResult(null);

    const res = await sendGmailEmail({
      to: selectedStudentForEmail.email,
      subject: emailSubject,
      bodyText: emailBody
    });

    if (res.success) {
      setSendResult({
        success: true,
        message: `Correo enviado exitosamente a ${selectedStudentForEmail.email} vía Gmail API.`
      });
    } else {
      setSendResult({
        success: false,
        message: res.error === 'NO_AUTH'
          ? 'Para enviar correos en vivo, conecta tu cuenta de Google en la esquina superior.'
          : `Error al enviar: ${res.error}`
      });
    }
    setIsSendingEmail(false);
  };

  const handleSaveStudentEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    onUpdateStudent(editingStudent);
    setEditingStudent(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-400/30">
              Academic Faculty • Teacher Leadership
            </span>
            <span className="text-xs text-blue-200">Control Pedagógico & Asignaciones</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Panel de Evaluación y Seguimiento de Alumnos
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
            Tú tienes el control absoluto: revisa las pruebas de nivel de los nuevos aspirantes, asígnales su libro oficial de Super Goal o MegaGoal, y administra la agenda.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {onSwitchToPrincipal && (
            <button
              onClick={onSwitchToPrincipal}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-md transition-colors border border-amber-300"
              title="Volver al Despacho Institucional de Rectoría"
            >
              <span>👑 Despacho de Rectoría</span>
            </button>
          )}
          <button
            onClick={onOpenOptimizer}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-colors"
          >
            <span>Estructura Recomendada</span>
          </button>
          {onLogoutTeacher && (
            <button
              onClick={onLogoutTeacher}
              className="flex items-center justify-center gap-1.5 px-4 py-3 bg-red-600/90 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-colors border border-red-400/30"
            >
              <span>Cerrar Sesión Teacher 🔒</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Switcher: Teacher's Lounge vs Seguimiento Pedagógico */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveMainTab('lounge')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all ${
            activeMainTab === 'lounge'
              ? 'bg-amber-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Coffee className="w-4 h-4 text-amber-300" />
          <span>☕ Teacher's Lounge & Coffee Hub</span>
        </button>

        <button
          onClick={() => setActiveMainTab('evaluation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all ${
            activeMainTab === 'evaluation'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-blue-400" />
          <span>🎓 Control Pedagógico & Alumnos ({activeStudents.length})</span>
        </button>
      </div>

      {activeMainTab === 'lounge' ? (
        <TeachersLounge
          currentStaffRole="teacher"
          staffName="Teacher Cokitö"
          staffAvatar="👩‍🏫"
          students={students}
          teachers={[]}
          slots={slots}
        />
      ) : (
        <>
          {/* Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-amber-600 block uppercase">Nuevos Aspirantes</span>
              <span className="text-2xl font-black text-slate-900">{pendingApplicants.length}</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Pruebas pendientes por asignar</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-blue-600 block uppercase">Alumnos Activos</span>
              <span className="text-2xl font-black text-slate-900">{activeStudents.length}</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Con nivel asignado</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-emerald-600 block uppercase">Horas Semanales</span>
              <span className="text-2xl font-black text-slate-900">{totalTeachingHours} h / sem</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Capacidad óptima: 20-24h</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-purple-600 block uppercase">Currículo Oficial</span>
              <span className="text-2xl font-black text-slate-900">12 Niveles</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Super Goal & MegaGoal</span>
            </div>
          </div>

          {/* SECTION 1: Pending Applicants for Placement Evaluation */}
          {pendingApplicants.length > 0 && (
            <div className="bg-gradient-to-br from-amber-50/70 to-white rounded-3xl border border-amber-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-amber-500 text-white font-black text-xs flex items-center justify-center">
                    !
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      Aspirantes con Prueba de Nivel Lista para Evaluar
                    </h3>
                    <p className="text-xs text-slate-500">
                      El estudiante eligió su paquete y completó la prueba. Selecciona el nivel oficial para incorporarlo al calendario.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold bg-amber-200 text-amber-900 px-3 py-1 rounded-full">
                  {pendingApplicants.length} pendiente(s)
                </span>
              </div>

              <div className="grid gap-3">
                {pendingApplicants.map(st => {
                  const plan = INTENSITY_PLANS[st.plan];
                  return (
                    <div
                      key={st.id}
                      className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={st.avatar}
                          alt={st.name}
                          className="w-12 h-12 rounded-full border border-slate-200 object-cover shrink-0"
                        />
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <strong className="text-slate-900 text-sm">{st.name} {st.lastName}</strong>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {st.isKid ? `Niño/Adolescente (${st.age} años)` : `Adulto (${st.age} años)`}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            {st.schoolOrProfession} • <span className="font-semibold text-blue-700">{st.email}</span>
                          </p>
                          <p className="text-xs text-slate-600">
                            Paquete deseado: <strong>{plan?.name}</strong> • Modalidad: <strong>{st.modality.toUpperCase()} ({st.groupSize})</strong>
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-xs">
                            <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                              Prueba de Nivel: {st.placementTestScore ?? 0} / 25 pts
                            </span>
                            <span className="text-slate-500 text-[11px] truncate max-w-xs">{st.placementTestDiagnosis}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleOpenEvaluation(st)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Asignar Nivel Oficial</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 2: Active Enrolled Students Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Alumnos Activos & Seguimiento de Progreso</h3>
                <p className="text-xs text-slate-400">Estudiantes cursando con nivel asignado</p>
              </div>
              <span className="text-xs text-slate-500 font-medium">{activeStudents.length} estudiantes</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Alumno</th>
                    <th className="py-3 px-4">Nivel & Módulo</th>
                    <th className="py-3 px-4">Paquete & Horas</th>
                    <th className="py-3 px-4">Avance del Nivel</th>
                    <th className="py-3 px-4">Habilidades</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeStudents.map(st => {
                    const level = ENGLISH_LEVELS.find(l => l.id === st.levelId) || ENGLISH_LEVELS[0];
                    const plan = INTENSITY_PLANS[st.plan];
                    const pct = Math.min(100, Math.round((st.completedHours / level.totalHours) * 100));

                    return (
                      <tr key={st.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={st.avatar}
                              alt={st.name}
                              className="w-10 h-10 rounded-full border border-slate-200 object-cover"
                            />
                            <div>
                              <strong className="text-slate-900 block font-semibold">{st.name} {st.lastName}</strong>
                              <span className="text-xs text-slate-400 block truncate">{st.email}</span>
                              <span className="text-[10px] text-amber-600 font-bold">🔥 {st.streak} días racha • {st.xp} XP</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-bold text-blue-900 block">{level.levelName}</span>
                          <span className="text-xs text-slate-500 block">{level.book}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md inline-block mt-0.5">
                            Módulo {level.module} • U{st.currentUnit}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-800 block">{plan?.name}</span>
                          <span className="text-xs text-slate-500 block">{st.completedHours}h de {level.totalHours}h</span>
                          <span className="text-[10px] text-slate-400 block">
                            {st.assignedSlots.length > 0 ? st.assignedSlots.join(', ') : st.preferredTimeSlot}
                          </span>
                        </td>

                        <td className="py-3 px-4 min-w-40">
                          <div className="flex items-center justify-between text-xs font-semibold mb-1">
                            <span className="text-blue-600">{pct}% completado</span>
                            <span className="text-slate-400">{st.completedHours}/{level.totalHours} h</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-blue-600 to-emerald-500 h-2 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
                            <span className="text-slate-500">Fluidez: <strong className="text-slate-800">{st.rating.fluency}/5</strong></span>
                            <span className="text-slate-500">Grammar: <strong className="text-slate-800">{st.rating.grammar}/5</strong></span>
                            <span className="text-slate-500">Vocab: <strong className="text-slate-800">{st.rating.vocabulary}/5</strong></span>
                            <span className="text-slate-500">Pronun: <strong className="text-slate-800">{st.rating.pronunciation}/5</strong></span>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingStudent(st)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                              title="Actualizar notas o unidad"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEmailModal(st)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition-colors"
                              title="Enviar correo recordatorio"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Notificar</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal: Asignar Nivel Oficial (Teacher Cokito Decision) */}
      {evaluatingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-block mb-1">
                Decisión Pedagógica de Teacher Cokito
              </span>
              <h3 className="text-lg font-black text-slate-900">
                Asignar Nivel a {evaluatingStudent.name} {evaluatingStudent.lastName}
              </h3>
              <p className="text-xs text-slate-500">
                Puntaje en prueba: <strong>{evaluatingStudent.placementTestScore ?? 0} / 25 puntos</strong>
              </p>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Selecciona el Nivel Oficial Asignado:
                </label>
                <select
                  value={assignedLevelId}
                  onChange={e => setAssignedLevelId(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 bg-slate-50"
                >
                  {ENGLISH_LEVELS.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.levelName}: {l.book} ({l.cefrEquiv}) — Módulo {l.module}: {l.moduleName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Horarios Asignados en Calendario (separados por coma):
                </label>
                <input
                  type="text"
                  value={assignedSlotsInput}
                  onChange={e => setAssignedSlotsInput(e.target.value)}
                  placeholder="Ej. Martes-16:00, Jueves-16:00"
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs font-mono"
                />
                <span className="text-[10px] text-slate-400">
                  Preferencia del alumno: {evaluatingStudent.preferredTimeSlot}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Notas Pedagógicas de Bienvenida:
                </label>
                <textarea
                  value={teacherEvaluationNotes}
                  onChange={e => setTeacherEvaluationNotes(e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEvaluatingStudent(null)}
                  className="px-4 py-2 text-slate-600 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAssignment}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                >
                  Aprobar y Enviar Bienvenida
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Send Email */}
      {selectedStudentForEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-xl max-w-xl w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Enviar Correo a {selectedStudentForEmail.name}
                </h3>
                <p className="text-xs text-slate-500">{selectedStudentForEmail.email}</p>
              </div>
              <button onClick={() => setSelectedStudentForEmail(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Asunto:</label>
              <input
                type="text"
                value={emailSubject}
                onChange={e => setEmailSubject(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-xl text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mensaje:</label>
              <textarea
                value={emailBody}
                onChange={e => setEmailBody(e.target.value)}
                rows={6}
                className="w-full p-2 border border-slate-300 rounded-xl text-xs font-mono"
              />
            </div>

            {sendResult && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                sendResult.success ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-amber-50 text-amber-900 border border-amber-200'
              }`}>
                {sendResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />}
                <span>{sendResult.message}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedStudentForEmail(null)}
                className="px-4 py-2 text-slate-600 text-xs font-semibold"
              >
                Cerrar
              </button>
              <button
                onClick={handleSendEmail}
                disabled={isSendingEmail}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSendingEmail ? 'Enviando...' : 'Enviar por Gmail'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Details Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Actualizar Progreso: {editingStudent.name}
            </h3>
            <form onSubmit={handleSaveStudentEdit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unidad Actual</label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={editingStudent.currentUnit}
                    onChange={e => setEditingStudent({ ...editingStudent, currentUnit: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Horas Completadas</label>
                  <input
                    type="number"
                    step="0.5"
                    min={0}
                    value={editingStudent.completedHours}
                    onChange={e => setEditingStudent({ ...editingStudent, completedHours: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Teacher Notes:</label>
                <textarea
                  value={editingStudent.notes}
                  onChange={e => setEditingStudent({ ...editingStudent, notes: e.target.value })}
                  rows={3}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
