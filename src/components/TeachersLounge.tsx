import React, { useState, useEffect, useRef } from 'react';
import { 
  Coffee, 
  Send, 
  Megaphone, 
  CheckCircle2, 
  Clock, 
  Users, 
  Sparkles, 
  AlertCircle, 
  Plus, 
  Trash2, 
  MessageSquare, 
  Calendar, 
  BookOpen, 
  ShieldCheck,
  Video,
  Smile,
  FileCheck
} from 'lucide-react';
import { 
  TeacherAnnouncement, 
  LoungeMessage, 
  TeacherAttendanceLog, 
  Student, 
  Teacher, 
  ScheduleSlot 
} from '../types';
import { 
  getTeacherAnnouncements, 
  saveTeacherAnnouncement, 
  deleteTeacherAnnouncement,
  getLoungeMessages, 
  postLoungeMessage, 
  addLoungeReaction,
  getAttendanceLogs,
  saveAttendanceLog 
} from '../services/loungeService';

interface TeachersLoungeProps {
  currentStaffRole: 'principal' | 'teacher';
  staffName: string;
  staffAvatar?: string;
  students: Student[];
  teachers: Teacher[];
  slots: ScheduleSlot[];
}

export const TeachersLounge: React.FC<TeachersLoungeProps> = ({
  currentStaffRole,
  staffName,
  staffAvatar = currentStaffRole === 'principal' ? '👑' : '👩‍🏫',
  students,
  teachers,
  slots
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'announcements' | 'tasks' | 'log'>('chat');
  
  // Announcements
  const [announcements, setAnnouncements] = useState<TeacherAnnouncement[]>([]);
  const [isNewAnnModalOpen, setIsNewAnnModalOpen] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState<'urgent' | 'important' | 'info'>('important');

  // Coffee Chat
  const [messages, setMessages] = useState<LoungeMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Attendance Log
  const [logs, setLogs] = useState<TeacherAttendanceLog[]>([]);
  const [logSlotId, setLogSlotId] = useState('');
  const [logUnit, setLogUnit] = useState<number>(1);
  const [logNotes, setLogNotes] = useState('');
  const [logAttendedStudentIds, setLogAttendedStudentIds] = useState<string[]>([]);
  const [logSuccess, setLogSuccess] = useState(false);

  useEffect(() => {
    setAnnouncements(getTeacherAnnouncements());
    setMessages(getLoungeMessages());
    setLogs(getAttendanceLogs());
  }, []);

  useEffect(() => {
    if (activeSubTab === 'chat' && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages.length, activeSubTab]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;
    const authorId = currentStaffRole === 'principal' ? 'principal-waky' : `teacher-${staffName.toLowerCase().replace(/\s+/g, '-')}`;
    const sent = postLoungeMessage(authorId, staffName, currentStaffRole, staffAvatar, newMessageText.trim());
    setMessages(prev => [...prev, sent]);
    setNewMessageText('');
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    const created = saveTeacherAnnouncement({
      title: annTitle.trim(),
      content: annContent.trim(),
      authorName: staffName,
      authorRole: currentStaffRole === 'principal' ? 'principal' : 'head_teacher',
      priority: annPriority
    });
    setAnnouncements(prev => [created, ...prev]);
    setAnnTitle('');
    setAnnContent('');
    setIsNewAnnModalOpen(false);
  };

  const handleDeleteAnnouncement = (id: string) => {
    deleteTeacherAnnouncement(id);
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const handleReact = (msgId: string, emoji: string) => {
    addLoungeReaction(msgId, emoji);
    setMessages(getLoungeMessages());
  };

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logSlotId) return;
    const selectedSlot = slots.find(s => s.id === logSlotId);
    const newLog = saveAttendanceLog({
      slotId: logSlotId,
      teacherId: currentStaffRole === 'principal' ? 'waky' : 'teacher-self',
      teacherName: staffName,
      date: new Date().toLocaleDateString('es-VE', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }),
      unitCovered: logUnit,
      summaryNotes: logNotes,
      attendedStudentIds: logAttendedStudentIds
    });
    setLogs(prev => [newLog, ...prev]);
    setLogSuccess(true);
    setLogNotes('');
    setTimeout(() => setLogSuccess(false), 3000);
  };

  // Pending tasks for staff
  const pendingValidationStudents = students.filter(s => s.status === 'pending_evaluation' || s.paymentStatus === 'pending_approval');
  const trialStudents = students.filter(s => s.paymentStatus === 'trial_24h');

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-fadeIn">
      {/* Lounge Header */}
      <div className="p-6 bg-gradient-to-r from-amber-700 via-orange-800 to-amber-950 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-6 pointer-events-none">
          <Coffee className="w-56 h-56" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/30 border border-amber-300/40 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
              ☕
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 shadow-xs">
                  Sala de Profesores Oficial
                </span>
                <span className="text-xs text-amber-200/90 font-medium">
                  {currentStaffRole === 'principal' ? '👑 Vista de Dirección General' : '👩‍🏫 Portal Teacher'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5">
                Teacher's Lounge & Coffee Hub
              </h2>
              <p className="text-xs text-amber-100/90 mt-0.5">
                Espacio colaborativo de Waky y el equipo de Teachers: mensajes en vivo, avisos oficiales, bitácoras y coordinación.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-amber-950/40 border border-amber-400/30 px-3.5 py-2 rounded-2xl text-xs">
            <span className="text-lg">{staffAvatar}</span>
            <div>
              <span className="font-bold text-white block leading-tight">{staffName}</span>
              <span className="text-[10px] text-amber-300 capitalize">{currentStaffRole === 'principal' ? 'Directora Principal' : 'Teacher Coquitos'}</span>
            </div>
          </div>
        </div>

        {/* Sub-nav Navigation */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'chat'
                ? 'bg-white text-amber-950 shadow-md scale-102'
                : 'bg-amber-900/40 text-amber-100 hover:bg-amber-900/70 border border-amber-500/20'
            }`}
          >
            <Coffee className="w-4 h-4 text-amber-600" />
            <span>Coffee Chat ({messages.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('announcements')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'announcements'
                ? 'bg-white text-amber-950 shadow-md scale-102'
                : 'bg-amber-900/40 text-amber-100 hover:bg-amber-900/70 border border-amber-500/20'
            }`}
          >
            <Megaphone className="w-4 h-4 text-amber-600" />
            <span>Muro de Avisos ({announcements.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('tasks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'tasks'
                ? 'bg-white text-amber-950 shadow-md scale-102'
                : 'bg-amber-900/40 text-amber-100 hover:bg-amber-900/70 border border-amber-500/20'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <span>Pendientes ({pendingValidationStudents.length + trialStudents.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('log')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'log'
                ? 'bg-white text-amber-950 shadow-md scale-102'
                : 'bg-amber-900/40 text-amber-100 hover:bg-amber-900/70 border border-amber-500/20'
            }`}
          >
            <FileCheck className="w-4 h-4 text-amber-600" />
            <span>Bitácora de Clase ({logs.length})</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: COFFEE CHAT */}
      {activeSubTab === 'chat' && (
        <div className="flex flex-col h-[520px] bg-slate-50/70">
          {/* Messages Stream */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
                ☕ Canal del Equipo de Teachers • Coquitos Academy
              </span>
            </div>

            {messages.map((msg) => {
              const isMe = (currentStaffRole === 'principal' && msg.authorRole === 'principal') ||
                           (currentStaffRole === 'teacher' && msg.authorName === staffName);
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-xl ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className="w-9 h-9 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-lg shrink-0">
                    {msg.avatar || '☕'}
                  </div>
                  <div className="space-y-1">
                    <div className={`flex items-center gap-2 text-[11px] ${isMe ? 'justify-end' : ''}`}>
                      <span className="font-bold text-slate-800">{msg.authorName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-semibold">
                        {msg.authorRole === 'principal' ? 'Directora' : 'Docente'}
                      </span>
                      <span className="text-slate-400 text-[10px]">{msg.timestamp}</span>
                    </div>

                    <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isMe 
                        ? 'bg-amber-600 text-white rounded-tr-none' 
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>

                    {/* Quick Reactions */}
                    <div className={`flex items-center gap-1 pt-0.5 ${isMe ? 'justify-end' : ''}`}>
                      {['☕', '❤️', '👏', '🦉', '👍'].map((emoji) => {
                        const count = msg.reactions?.[emoji] || 0;
                        return (
                          <button
                            key={emoji}
                            onClick={() => handleReact(msg.id, emoji)}
                            className={`px-1.5 py-0.5 rounded-lg text-[10px] border transition-all ${
                              count > 0 
                                ? 'bg-amber-50 border-amber-200 text-amber-900 font-bold' 
                                : 'bg-transparent border-transparent hover:bg-slate-200/50 text-slate-400 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <span>{emoji}</span>
                            {count > 0 && <span className="ml-1">{count}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={newMessageText}
              onChange={e => setNewMessageText(e.target.value)}
              placeholder={`Escribe un mensaje en el Lounge como ${staffName}...`}
              className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-medium"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span>Enviar</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* SUBTAB 2: ANNOUNCEMENTS */}
      {activeSubTab === 'announcements' && (
        <div className="p-6 space-y-6 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Tablón de Anuncios Oficiales
              </h3>
              <p className="text-xs text-slate-500">
                Directivas académicas, lineamientos curriculares y comunicados emitidos por la Dirección General.
              </p>
            </div>
            {currentStaffRole === 'principal' && (
              <button
                onClick={() => setIsNewAnnModalOpen(true)}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Publicar Comunicado</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map((ann) => (
              <div 
                key={ann.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                  ann.priority === 'urgent' 
                    ? 'bg-rose-500' 
                    : ann.priority === 'important' 
                    ? 'bg-amber-500' 
                    : 'bg-blue-500'
                }`} />

                <div className="flex items-start justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      ann.priority === 'urgent'
                        ? 'bg-rose-100 text-rose-800'
                        : ann.priority === 'important'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {ann.priority === 'urgent' ? '🚨 Urgente' : ann.priority === 'important' ? '⭐ Importante' : 'ℹ️ Informativo'}
                    </span>
                    <span className="text-[11px] text-slate-400">{ann.createdAt}</span>
                  </div>

                  {currentStaffRole === 'principal' && (
                    <button
                      onClick={() => handleDeleteAnnouncement(ann.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Eliminar comunicado"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <h4 className="font-bold text-slate-900 text-sm leading-snug">
                  {ann.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {ann.content}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Emitido por: <strong>{ann.authorName}</strong></span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Oficial
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Modal to create announcement */}
          {isNewAnnModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
              <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-lg text-slate-900">Nuevo Comunicado de Dirección</h3>
                  <button onClick={() => setIsNewAnnModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>

                <form onSubmit={handleCreateAnnouncement} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Título del Comunicado</label>
                    <input
                      type="text"
                      value={annTitle}
                      onChange={e => setAnnTitle(e.target.value)}
                      placeholder="Ej. Lineamientos de asistencia y bitácora de clases"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Prioridad</label>
                    <select
                      value={annPriority}
                      onChange={e => setAnnPriority(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    >
                      <option value="important">Importante (Dorado)</option>
                      <option value="urgent">Urgente (Rojo)</option>
                      <option value="info">Informativo (Azul)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Contenido</label>
                    <textarea
                      rows={4}
                      value={annContent}
                      onChange={e => setAnnContent(e.target.value)}
                      placeholder="Escribe el mensaje detallado para los Teachers..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsNewAnnModalOpen(false)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md"
                    >
                      Publicar Comunicado
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: PENDING TASKS */}
      {activeSubTab === 'tasks' && (
        <div className="p-6 space-y-6 bg-slate-50/50">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Bandeja de Pendientes y Alumnos en Seguimiento
            </h3>
            <p className="text-xs text-slate-500">
              Alumnos con pagos por validar por Waky, prospectos en pase de cortesía de 24 horas y asignaciones activas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: Trial 24h Students */}
            <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⏱️</span>
                  <h4 className="font-bold text-amber-950 text-sm">
                    Pases de Cortesía 24h ({trialStudents.length})
                  </h4>
                </div>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                  Prospectos Activos
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Alumnos que activaron el pase para probar la plataforma antes de pagar. Oportunidad clave para dar bienvenida en WhatsApp.
              </p>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {trialStudents.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">No hay alumnos en período de cortesía activo en este momento.</p>
                ) : (
                  trialStudents.map(student => (
                    <div key={student.id} className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-slate-900 block">{student.name} {student.lastName}</strong>
                        <span className="text-slate-500 text-[11px] block">{student.email} • {student.phone || 'Sin tel'}</span>
                      </div>
                      {student.phone && (
                        <a
                          href={`https://wa.me/${student.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`¡Hola ${student.name}! Te saluda el equipo de Coquitos Academy. Vemos que estás explorando tu pase de cortesía de 24 horas. ¿Tienes alguna duda con tu nivel o tus clases?`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] flex items-center gap-1 shadow-2xs"
                        >
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Box 2: Pending Approval Payments */}
            <div className="bg-white rounded-2xl p-5 border border-blue-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💳</span>
                  <h4 className="font-bold text-blue-950 text-sm">
                    Pagos Pendientes de Conciliación ({pendingValidationStudents.length})
                  </h4>
                </div>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full">
                  Directora Waky
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Alumnos que reportaron su referencia de Banco Provincial o depósito de $5. Requieren confirmación bancaria.
              </p>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {pendingValidationStudents.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">Todos los pagos están al día y conciliados.</p>
                ) : (
                  pendingValidationStudents.map(student => (
                    <div key={student.id} className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-slate-900 block">{student.name} {student.lastName}</strong>
                        <span className="text-blue-800 font-semibold text-[11px] block">
                          Ref: {student.pagoMovilRef || 'Pendiente'} • {student.pagoMovilAmountBs ? `Bs. ${student.pagoMovilAmountBs}` : '$5 Depósito'}
                        </span>
                      </div>
                      <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-1 rounded-md font-black">
                        Revisar
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: ATTENDANCE & QUICK LOG */}
      {activeSubTab === 'log' && (
        <div className="p-6 space-y-6 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Bitácora de Clase y Asistencia Rápida
              </h3>
              <p className="text-xs text-slate-500">
                Al terminar una sesión de Google Meet, registra en 30 segundos la unidad vista y observaciones pedagógicas.
              </p>
            </div>
            {logSuccess && (
              <div className="px-3.5 py-1.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>¡Bitácora guardada exitosamente!</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <form onSubmit={handleSaveAttendance} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 lg:col-span-1">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Registrar Clase de Hoy
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Salón / Bloque de Horario</label>
                <select
                  value={logSlotId}
                  onChange={e => setLogSlotId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  required
                >
                  <option value="">Selecciona el salón...</option>
                  {slots.slice(0, 15).map(slot => (
                    <option key={slot.id} value={slot.id}>
                      {slot.day} {slot.startTime} - {slot.classroomTitle || slot.studentName || 'Salón Regular'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Unidad Vista (Super / Mega Goal)</label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={logUnit}
                  onChange={e => setLogUnit(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Resumen / Observaciones</label>
                <textarea
                  rows={3}
                  value={logNotes}
                  onChange={e => setLogNotes(e.target.value)}
                  placeholder="Ej. Vimos páginas 8 a 10. Excelente pronunciación en pasado simple; reforzar vocabulario de viajes."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Guardar Registro en Bitácora</span>
              </button>
            </form>

            {/* Past Logs */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs lg:col-span-2 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Historial de Clases Dictadas
              </h4>

              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {logs.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs italic">
                    Aún no hay registros de bitácora guardados para este ciclo.
                  </div>
                ) : (
                  logs.map(item => (
                    <div key={item.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          {item.teacherName} • <span className="text-amber-700">Unidad {item.unitCovered}</span>
                        </span>
                        <span className="text-[11px] text-slate-400">{item.date}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {item.summaryNotes}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
