import React, { useState } from 'react';
import { 
  X, 
  Brain, 
  Calendar, 
  Sparkles, 
  Mail, 
  Phone, 
  BookOpen, 
  Award, 
  Clock, 
  Flame, 
  Tag, 
  Edit3, 
  Send, 
  FileText, 
  ArrowRightLeft, 
  Power, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  MessageCircle,
  Smartphone,
  ShieldCheck,
  User,
  Zap,
  HelpCircle
} from 'lucide-react';
import { Student, EnglishLevel } from '../types';
import { CouponItem } from '../data/couponsData';
import { analyzeStudentWithCoquito, CoquitoCognitiveAnalysis } from '../services/coquitoBrainService';

interface StudentMasterDossierModalProps {
  student: Student;
  allLevels: EnglishLevel[];
  couponsList: CouponItem[];
  onClose: () => void;
  onUpdateStudent: (updated: Student) => void;
  onOpenEditStudent: (student: Student) => void;
  onOpenAssignClasses: (student: Student) => void;
  onOpenStudentLetter: (student: Student) => void;
  onResendWelcomeEmail: (student: Student) => void;
  onMoveStudent: (student: Student) => void;
  onToggleStatus: (student: Student) => void;
}

export const StudentMasterDossierModal: React.FC<StudentMasterDossierModalProps> = ({
  student,
  allLevels,
  couponsList,
  onClose,
  onUpdateStudent,
  onOpenEditStudent,
  onOpenAssignClasses,
  onOpenStudentLetter,
  onResendWelcomeEmail,
  onMoveStudent,
  onToggleStatus
}) => {
  const [activeTab, setActiveTab] = useState<'brain' | 'membership' | 'schedule' | 'progress'>('brain');
  const [newNoteText, setNewNoteText] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [customAiAdvice, setCustomAiAdvice] = useState<string | null>(null);

  const matchedLevel = allLevels.find(l => l.id === student.levelId);
  const coquitoAnalysis: CoquitoCognitiveAnalysis = analyzeStudentWithCoquito(student);
  const hasClasses = student.assignedSlots && student.assignedSlots.length > 0;

  // Format registration date
  const registrationDate = student.registeredAt ? new Date(student.registeredAt) : new Date();
  const formattedRegDate = isNaN(registrationDate.getTime()) 
    ? 'Reciente' 
    : registrationDate.toLocaleDateString('es-VE', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

  const ratings = student.rating || { fluency: 3, grammar: 3, vocabulary: 3, pronunciation: 3 };

  const handleAddDirectorNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    setIsSavingNote(true);
    const timeStamp = new Date().toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const noteEntry = `[${timeStamp} - Rectora]: ${newNoteText.trim()}`;
    const updatedNotes = student.notes ? `${student.notes}\n• ${noteEntry}` : `• ${noteEntry}`;
    
    onUpdateStudent({
      ...student,
      notes: updatedNotes
    });

    setNewNoteText('');
    setIsSavingNote(false);
  };

  const handleAskCoquitoDeepAdvice = async () => {
    setAiGenerating(true);
    try {
      const prompt = `Analiza al siguiente alumno de Güakytopia en inglés:
Nombre: ${student.name} ${student.lastName || ''}
Nivel: ${matchedLevel ? matchedLevel.levelName : student.levelId} (Unidad ${student.currentUnit || 1})
Edad: ${student.age} (${student.isKid ? 'Niño' : 'Adulto'}), Profesión: ${student.schoolOrProfession || 'No especificada'}
Meta: ${student.learningGoal || 'Fluidez'}
Modalidad: ${student.modality}, Plan: ${student.plan} (${student.isDigitalPass ? 'Pase digital autónomo' : 'Clases en vivo'})
Evaluaciones: Fluidez: ${ratings.fluency}/5, Gramática: ${ratings.grammar}/5, Vocabulario: ${ratings.vocabulary}/5, Pronunciación: ${ratings.pronunciation}/5.
Notas previas: ${student.notes || 'Ninguna'}

Como "Cokitö", el cerebro pedagógico institucional de Güakytopia, dame una recomendación de 2 párrafos concisos y motivadores para la Directora y el equipo de teachers sobre cómo desbloquear el máximo potencial de este alumno en las próximas 3 semanas.`;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', text: prompt }]
        })
      });

      if (res.ok) {
        const data = await res.json();
        setCustomAiAdvice(data.reply || data.text || 'Cokitö completó el análisis pedagógico.');
      } else {
        // Fallback intelligent insight
        setCustomAiAdvice(
          `¡Hoo-hoo! 🦉 Cokitö evaluó a ${student.name}: Para su nivel ${matchedLevel?.levelName || 'actual'}, recomendamos sesiones de conversación aplicadas a su ámbito (${student.schoolOrProfession || 'personal'}) con retroalimentación fonética inmediata. Mantén su racha activa para consolidar el hábito semanal.`
        );
      }
    } catch {
      setCustomAiAdvice(
        `Recomendación de Cokitö: ${student.name} avanza a paso firme. Sugerimos priorizar dinámicas situacionales en vivo y sesiones de 15 minutos de listening con Cyber Owl para afianzar vocabulario antes de la siguiente evaluación.`
      );
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div 
        className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            aria-label="Cerrar expediente"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pr-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={student.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`}
                  alt={student.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-amber-400/80 shadow-md object-cover bg-slate-800"
                />
                <div 
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-sm"
                  style={{ backgroundColor: coquitoAnalysis.styleColor.accent, color: '#fff' }}
                  title={`Estilo cognitivo Cokitö: ${coquitoAnalysis.learningStyle}`}
                >
                  🧠
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap text-xs text-slate-300">
                  <span>Expediente de Alumno</span>
                  <span aria-hidden="true">·</span>
                  <span>ID: <strong className="font-mono text-slate-200">{student.id}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span className={student.status === 'enrolled' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {student.status === 'enrolled' ? '● Alumno Activo' : '○ En Pausa'}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {student.name} {student.lastName || ''}
                </h1>

                <div className="flex items-center gap-2 text-xs text-slate-300 mt-1 flex-wrap">
                  <span>{student.email}</span>
                  {student.phone && (
                    <>
                      <span aria-hidden="true">·</span>
                      <a 
                        href={`https://wa.me/${student.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`¡Hola ${student.name}! Te saluda la Directora Ana Teresa de Güakytopia.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-300 hover:text-amber-200 hover:underline flex items-center gap-1 font-semibold"
                        title="Abrir chat de WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{student.phone}</span>
                      </a>
                    </>
                  )}
                  {student.cedula && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>CI: {student.cedula}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick badges */}
            <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t border-white/10 sm:border-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded-xl text-xs font-black">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>{matchedLevel ? `${matchedLevel.levelName} (${matchedLevel.book})` : student.levelId || 'Sin nivel'}</span>
              </div>
              <div className="text-[11px] text-slate-300">
                <span>Inscrito: </span>
                <strong className="text-white">{formattedRegDate}</strong>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 mt-6 pt-2 border-t border-white/10 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('brain')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'brain'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span>Cerebro Cokitö & Diagnóstico</span>
            </button>

            <button
              onClick={() => setActiveTab('membership')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'membership'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Membresía, Cupones & Pagos</span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'schedule'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Horarios & Teacher</span>
            </button>

            <button
              onClick={() => setActiveTab('progress')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'progress'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Progreso, XP & Notas</span>
            </button>
          </div>
        </div>

        {/* Scrollable Tab Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50/50">

          {/* TAB 1: CEREBRO COKITÖ & DIAGNÓSTICO */}
          {activeTab === 'brain' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Cokitö Brain Overview Banner */}
              <div className={`p-5 rounded-3xl border ${coquitoAnalysis.styleColor.bg} ${coquitoAnalysis.styleColor.border} relative overflow-hidden shadow-2xs`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0"
                      style={{ backgroundColor: coquitoAnalysis.styleColor.accent, color: '#fff' }}
                    >
                      🧠
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <span>Cerebro Pedagógico Cokitö</span>
                        <span aria-hidden="true">·</span>
                        <span>Perfil Cognitivo</span>
                      </div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                        Estilo Dominante: <span style={{ color: coquitoAnalysis.styleColor.accent }}>{coquitoAnalysis.learningStyle}</span>
                      </h2>
                      <div className="flex items-center gap-2 text-xs text-slate-600 mt-1 flex-wrap">
                        <span>Ritmo: <strong className="text-slate-800">{coquitoAnalysis.cognitivePace}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Compromiso: <strong className="text-slate-800">{coquitoAnalysis.engagementScore}/100 ({coquitoAnalysis.weeklyEffortStatus})</strong></span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleAskCoquitoDeepAdvice}
                    disabled={aiGenerating}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{aiGenerating ? 'Cokitö Analizando...' : '✨ Profundizar con Cokitö AI'}</span>
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200/80">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    "{coquitoAnalysis.coquitoDiagnosis}"
                  </p>
                </div>
              </div>

              {/* Dynamic AI Deep Advice if requested */}
              {customAiAdvice && (
                <div className="p-4 rounded-2xl bg-indigo-950 text-indigo-100 border border-indigo-800 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Dictamen Pedagógico Directo de Cokitö (IA en Vivo)</span>
                    </div>
                    <span className="text-[10px] text-indigo-300">Generado para Dirección Waky</span>
                  </div>
                  <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed whitespace-pre-line">
                    {customAiAdvice}
                  </p>
                </div>
              )}

              {/* Cognitive Attributes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    <span>Superpoder Pedagógico Detectado</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {coquitoAnalysis.superpower}
                  </p>
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    Aprovecha este rasgo en cada clase para darle protagonismo y confianza rápida.
                  </div>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Flame className="w-4 h-4 text-amber-600" />
                    <span>Área a Potenciar (Punto de Crecimiento)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {coquitoAnalysis.growthEdge}
                  </p>
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    Enfoque recomendado para los teachers de Güakytopia en las próximas semanas.
                  </div>
                </div>
              </div>

              {/* Skills Radar / Bar Breakdown */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Evaluación de Competencias Clave (1 - 5)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700">Fluidez Conversacional</span>
                      <span className="text-slate-900 font-bold">{ratings.fluency} / 5</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${(ratings.fluency / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700">Gramática & Estructura</span>
                      <span className="text-slate-900 font-bold">{ratings.grammar} / 5</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${(ratings.grammar / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700">Vocabulario Activo</span>
                      <span className="text-slate-900 font-bold">{ratings.vocabulary} / 5</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${(ratings.vocabulary / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700">Pronunciación & Fonética</span>
                      <span className="text-slate-900 font-bold">{ratings.pronunciation} / 5</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${(ratings.pronunciation / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pedagogical Tips for Teachers */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Estrategias Recomendadas por Cokitö para los Teachers
                </h3>
                <ul className="space-y-2">
                  {coquitoAnalysis.pedagogicalTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: MEMBRESÍA, CUPONES & PAGOS */}
          {activeTab === 'membership' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Membership Plan Overview */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Modalidad & Tipo de Plan
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {student.modality === 'online' ? '🌐 100% Online' : '🏫 Presencial'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Plan Académico</span>
                    <div className="text-sm font-black text-slate-900">
                      {student.isDigitalPass ? 'Pase Digital Autónomo' : 
                       student.plan === 'basic' ? 'Básico (2 h/sem)' :
                       student.plan === 'regular' ? 'Regular (3 h/sem)' :
                       student.plan === 'intensive' ? 'Intensivo (4 h/sem)' : 'Súper Intensivo (6 h/sem)'}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {student.isDigitalPass ? 'Plataforma y libros (sin clases en vivo)' : 'Clases en vivo programadas'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Estado de Pago</span>
                    <div className="text-sm font-black text-slate-900">
                      {student.paymentStatus === 'scholarship' ? '🎓 Beca / Cupón Institucional' :
                       student.paymentStatus === 'fully_paid' ? '✅ Pago Completo' :
                       student.paymentStatus === 'trial_24h' ? '⏱️ Pase de Cortesía 24h' : 'Pendiente de Aprobación'}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Método: {student.paymentMethod || 'Registro en línea'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Horas Semanales</span>
                    <div className="text-sm font-black text-slate-900">
                      {student.isDigitalPass ? '0 h en vivo' : 
                       student.plan === 'basic' ? '2 horas/semana' :
                       student.plan === 'regular' ? '3 horas/semana' :
                       student.plan === 'intensive' ? '4 horas/semana' : '6 horas/semana'}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Duración estimada de nivel: {student.plan === 'basic' ? '12 semanas' : student.plan === 'regular' ? '8 semanas' : '6 semanas'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Coupons & Discounts Details */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Cupones & Becas Asignadas
                  </h3>
                  <span className="text-xs text-slate-500">
                    Control directo de Dirección
                  </span>
                </div>

                <div className="space-y-3">
                  {student.couponCodeUsed && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                          Cupón Aplicado en Registro
                        </div>
                        <div className="font-mono font-black text-emerald-900 text-sm">
                          {student.couponCodeUsed}
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-xl">
                        Canjeado por el alumno
                      </span>
                    </div>
                  )}

                  {student.couponCodeAssigned && student.couponCodeAssigned !== student.couponCodeUsed && (
                    <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-purple-800">
                          Cupón Asignado por la Rectora
                        </div>
                        <div className="font-mono font-black text-purple-900 text-sm">
                          {student.couponCodeAssigned}
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-purple-800 bg-purple-100 px-2.5 py-1 rounded-xl">
                        Asignación Manual
                      </span>
                    </div>
                  )}

                  {!student.couponCodeUsed && !student.couponCodeAssigned && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                      Este alumno no tiene ningún cupón ni beca asignada actualmente.
                    </div>
                  )}

                  {/* Quick Coupon Assignment Selector right here */}
                  <div className="pt-3 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Cambiar o Asignar Cupón a este Alumno:
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={student.couponCodeAssigned || ""}
                        onChange={e => {
                          const selected = couponsList.find(c => c.code === e.target.value);
                          if (selected) {
                            const isDigi = Boolean(selected.isDigitalPass || selected.includedHoursPerWeek === 0 || selected.benefitType === 'free_webapp_3m' || selected.benefitType === 'webapp_5usd_3m');
                            const planForCoupon = selected.includedHoursPerWeek === 2 ? 'basic' : selected.includedHoursPerWeek === 3 ? 'regular' : selected.includedHoursPerWeek === 4 ? 'intensive' : selected.includedHoursPerWeek === 6 ? 'super_intensive' : student.plan;
                            const allCoupons = Array.from(new Set([...(student.coupons || []), ...(student.couponCodeUsed ? [student.couponCodeUsed] : []), selected.code]));
                            onUpdateStudent({
                              ...student,
                              couponCodeAssigned: selected.code,
                              coupons: allCoupons,
                              isDigitalPass: isDigi,
                              plan: isDigi ? student.plan : planForCoupon,
                              paymentStatus: 'scholarship',
                              notes: (student.notes || '') + ` | Cupón [${selected.code}] asignado desde Expediente el ${new Date().toLocaleDateString('es-VE')}`
                            });
                          } else {
                            onUpdateStudent({
                              ...student,
                              couponCodeAssigned: undefined,
                              notes: (student.notes || '') + ` | Cupón manual retirado el ${new Date().toLocaleDateString('es-VE')}`
                            });
                          }
                        }}
                        className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="">{student.couponCodeAssigned ? 'Quitar asignación de cupón...' : 'Seleccionar cupón / beca para asignar…'}</option>
                        {couponsList.filter(c => c.isActive).map(c => (
                          <option key={c.id} value={c.code}>
                            {c.code} — {c.title} ({c.includedHoursPerWeek === 0 ? 'Digital' : `${c.includedHoursPerWeek || 2}h/sem`})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pago Móvil or Transaction Details if exist */}
              {student.pagoMovilRef && (
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Datos de Pago Registrado
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">Referencia:</span>
                      <strong className="text-slate-800 font-mono">{student.pagoMovilRef}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Banco:</span>
                      <strong className="text-slate-800">{student.pagoMovilBank || 'Pago Móvil'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Monto en Bs:</span>
                      <strong className="text-slate-800">{student.pagoMovilAmountBs ? `Bs ${student.pagoMovilAmountBs}` : '-'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Fecha:</span>
                      <strong className="text-slate-800">{student.pagoMovilDate || '-'}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: HORARIOS & TEACHER */}
          {activeTab === 'schedule' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Teacher Asignado & Modalidad de Acompañamiento
                  </h3>
                  <button
                    onClick={() => onOpenAssignClasses(student)}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{hasClasses ? 'Modificar Horarios' : 'Asignar Horarios Ahora'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Teacher / Mentor</span>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-800 text-amber-300 font-bold flex items-center justify-center text-xs">
                        🦉
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          {student.teacherName || 'Teacher Cokitö'}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {student.isExclusiveTeacher ? '🔒 Mentor Exclusivo Dedicado' : '🌟 Rotación con La Manada Güakytopia'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Franja Horaria Preferida</span>
                    <div className="font-bold text-slate-900 text-sm">
                      {student.preferredTimeSlot || 'Sin preferencia especificada'}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Tamaño de grupo: {student.groupSize === 'individual' ? '1 a 1 (Individual)' : student.groupSize === 'duo' ? 'Dúo (2 alumnos)' : 'Squad (Grupal)'}
                    </div>
                  </div>
                </div>

                {/* Scheduled Slots List */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-700 block">
                    Horarios de Clase en Vivo Activos:
                  </span>
                  {hasClasses ? (
                    <div className="space-y-2">
                      {student.assignedSlots.map((slot, index) => (
                        <div 
                          key={index}
                          className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex items-center justify-between text-xs font-semibold text-indigo-950"
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-indigo-600" />
                            <span>{slot}</span>
                          </div>
                          <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-lg">
                            Agendado
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : student.isDigitalPass ? (
                    <div className="p-4 rounded-2xl bg-violet-50 border border-violet-200 text-violet-900 text-xs space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-violet-700" />
                        <span>Membresía Plataforma (Sin Clases en Vivo)</span>
                      </div>
                      <p className="text-violet-700">
                        Este alumno tiene acceso a la plataforma digital y biblioteca. Si desea clases en vivo, puedes asignarle horarios con el botón superior.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>Sin Horario Agendado</span>
                      </div>
                      <p className="text-amber-800">
                        El alumno tiene plan con clases en vivo pero aún no se le ha reservado un espacio en agenda.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROGRESO, XP & NOTAS */}
          {activeTab === 'progress' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Gamification and Progress metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Unidad Actual</span>
                  <div className="text-xl font-black text-indigo-700">
                    Unidad {student.currentUnit || 1}
                  </div>
                  <div className="text-[11px] text-slate-500">de 12 unidades del nivel</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Horas Vistas</span>
                  <div className="text-xl font-black text-slate-900">
                    {student.completedHours || 0} h
                  </div>
                  <div className="text-[11px] text-slate-500">acumuladas</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Experiencia (XP)</span>
                  <div className="text-xl font-black text-amber-600">
                    {student.xp || 0} XP
                  </div>
                  <div className="text-[11px] text-slate-500">Puntos acumulados</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Racha de Días</span>
                  <div className="text-xl font-black text-orange-500 flex items-center gap-1">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span>{student.streak || 0} días</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Liga: {student.league || 'Bronce'}</div>
                </div>
              </div>

              {/* Learning Goal & Diagnostic */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Objetivo del Alumno & Diagnóstico Inicial
                </h3>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 block">Meta declarada:</span>
                  <p>{student.learningGoal || 'Fluidez general y soltura conversacional.'}</p>
                </div>
                {student.placementTestDiagnosis && (
                  <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1">
                    <span className="font-bold text-blue-950 block">Diagnóstico de Placement Test ({student.placementTestScore ?? 'N/A'}/25 pts):</span>
                    <p>{student.placementTestDiagnosis}</p>
                  </div>
                )}
              </div>

              {/* Bitácora de la Rectora & Notas */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Bitácora Institucional & Notas de Dirección
                  </h3>
                  <span className="text-xs text-slate-400">Permanente</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 max-h-48 overflow-y-auto whitespace-pre-line leading-relaxed">
                  {student.notes ? student.notes : 'Sin notas registradas aún para este alumno.'}
                </div>

                <form onSubmit={handleAddDirectorNote} className="space-y-2">
                  <textarea
                    rows={2}
                    value={newNoteText}
                    onChange={e => setNewNoteText(e.target.value)}
                    placeholder="Escribir una nueva anotación de seguimiento para este alumno..."
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingNote || !newNoteText.trim()}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors"
                    >
                      {isSavingNote ? 'Guardando Nota...' : '+ Agregar a Bitácora'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>

        {/* Footer Quick Actions Bar */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-5 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
            <button
              onClick={() => onOpenStudentLetter(student)}
              className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 rounded-xl text-xs transition-colors flex items-center gap-1.5 shrink-0"
              title="Ver Carnet Oficial y Credenciales"
            >
              <FileText className="w-3.5 h-3.5 text-slate-600" />
              <span>Carnet & Credenciales</span>
            </button>

            <button
              onClick={() => onResendWelcomeEmail(student)}
              className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-300 rounded-xl text-xs transition-colors flex items-center gap-1.5 shrink-0"
              title="Reenviar carta oficial por correo electrónico"
            >
              <Send className="w-3.5 h-3.5 text-amber-700" />
              <span>Reenviar Correo</span>
            </button>

            <button
              onClick={() => onMoveStudent(student)}
              className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 rounded-xl text-xs transition-colors flex items-center gap-1.5 shrink-0"
              title="Mover de nivel, unidad o teacher"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-slate-600" />
              <span>Mover Nivel</span>
            </button>

            <button
              onClick={() => onToggleStatus(student)}
              className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 rounded-xl text-xs transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Power className={`w-3.5 h-3.5 ${student.status === 'enrolled' ? 'text-amber-600' : 'text-emerald-600'}`} />
              <span>{student.status === 'enrolled' ? 'Pausar' : 'Reactivar'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => onOpenEditStudent(student)}
              className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editar Perfil Completo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
