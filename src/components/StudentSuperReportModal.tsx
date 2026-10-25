import React, { useState } from 'react';
import { 
  X, 
  Award, 
  Flame, 
  Zap, 
  Clock, 
  Calendar, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Sparkles, 
  Target, 
  Brain, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Volume2,
  Copy,
  BookOpen
} from 'lucide-react';
import { Student, AudienceTheme } from '../types';

interface StudentSuperReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  audienceTheme?: AudienceTheme;
  onOpenGuakypack?: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const StudentSuperReportModal: React.FC<StudentSuperReportModalProps> = ({
  isOpen,
  onClose,
  student,
  audienceTheme = 'adults',
  onOpenGuakypack,
  onNavigateToTab
}) => {
  const [viewMode, setViewMode] = useState<'student' | 'guardian'>('student');
  const [copiedShare, setCopiedShare] = useState(false);

  if (!isOpen || !student) return null;

  const isKids = audienceTheme === 'kids';
  const name = `${student.name} ${student.lastName || ''}`.trim();
  const rating = student.rating || { fluency: 3.5, grammar: 3, vocabulary: 3.5, pronunciation: 3 };

  // Calculate percentage scores from 1-5 scale
  const fluencyPct = Math.min(100, Math.round(((rating.fluency || 3) / 5) * 100));
  const grammarPct = Math.min(100, Math.round(((rating.grammar || 3) / 5) * 100));
  const vocabPct = Math.min(100, Math.round(((rating.vocabulary || 3) / 5) * 100));
  const pronunPct = Math.min(100, Math.round(((rating.pronunciation || 3) / 5) * 100));
  const overallAvg = (((rating.fluency + rating.grammar + rating.vocabulary + rating.pronunciation) / 4) || 3).toFixed(1);

  // Common opportunities & sticking points (ADHD-friendly microtips)
  const opportunities = [
    {
      skill: 'Pronunciación de Pasado (-ed endings)',
      issue: 'Tendencia a pronunciar la "e" en palabras como "worked" o "watched".',
      guakyTip: 'Recuerda el truco de Güaky: si el verbo termina en sonido sordo (k, p, s, sh, ch), la "-ed" suena como una explosión "T" suave: /workt/, no /worked/! 🦜',
      level: 'Avanzando'
    },
    {
      skill: 'Preposiciones de Tiempo (In, On, At)',
      issue: 'Confusión entre "at night" vs "in the morning", o días con "on Monday".',
      guakyTip: 'Piensa en la pirámide: IN es grande (siglos, años, meses), ON es específico (días y fechas), AT es súper puntual (horas y at night). 📐',
      level: 'Por afianzar'
    },
    {
      skill: 'Tercera Persona Singular (-s en presente)',
      issue: 'Omitir la "-s" al hablar rápido con he/she/it en oraciones afirmativas.',
      guakyTip: 'Imagina que He, She e It siempre llevan un cascabel que suena "sssss" al final del verbo. ¡No dejes que se caiga el cascabel! 🔔',
      level: 'En progreso'
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleCopyWhatsAppReport = () => {
    const reportText = `📊 *REPORTE DE PROGRESO • GÜAKYTOPIA ENGLISH LAB* 🦜
👤 *Estudiante:* ${name}
🎯 *Nivel:* ${student.levelId || 'Super Goal 1'}
🔥 *Racha activa:* ${student.streak} días consecutivos
⚡ *Puntos XP:* ${student.xp} pts
🏆 *Liga:* Cokitö's League (${student.league || 'Bronce'})

*RADAR DE HABILIDADES (1 - 5):*
🗣️ Fluidez y Espontaneidad: ${rating.fluency}/5 (${fluencyPct}%)
📐 Precisión Gramatical: ${rating.grammar}/5 (${grammarPct}%)
📖 Riqueza de Vocabulario: ${rating.vocabulary}/5 (${vocabPct}%)
🎙️ Pronunciación & Fonética: ${rating.pronunciation}/5 (${pronunPct}%)
⭐ Promedio Global: ${overallAvg} / 5.0

*ESTADO DE CLASES & GÜAKYPACK:*
🎒 Plan: ${student.plan || 'Plan Mensual'}
📅 Horario: ${student.preferredTimeSlot || 'Turno Activo'}
🛡️ Escudos Activos: ${student.guakypack?.hourShields ?? 1} Escudo(s) de protección

_Generado automáticamente desde la plataforma de Güakytopia. Para más detalles visita tu panel de alumno._`;

    navigator.clipboard.writeText(reportText);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Title & Controls */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-md shrink-0">
              📊
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight truncate">
                  The Flock Radar • Super Reporte
                </h2>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full hidden sm:inline">
                  McGraw-Hill Standard
                </span>
              </div>
              <p className="text-xs text-blue-200 truncate">
                Diagnóstico integral, metas, radar fonético y oportunidades de mejora
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer hidden sm:flex items-center gap-1.5 text-xs font-bold"
              title="Imprimir o exportar PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              title="Cerrar reporte"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Switcher: Student vs Guardian/Parent */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center justify-between gap-3 text-xs">
          <div className="flex bg-white p-1 rounded-xl shadow-2xs border border-slate-200 font-bold">
            <button
              onClick={() => setViewMode('student')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'student'
                  ? 'bg-indigo-600 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🧑‍🎓 Mi Vista de Alumno
            </button>
            <button
              onClick={() => setViewMode('guardian')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'guardian'
                  ? 'bg-indigo-600 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👨‍👩‍👧 Vista para Padres / Tutores
            </button>
          </div>

          <button
            onClick={handleCopyWhatsAppReport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all cursor-pointer"
          >
            {copiedShare ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>¡Copiado para WhatsApp!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Compartir por WhatsApp</span>
              </>
            )}
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Student Profile Overview Card */}
          <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50/60 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={student.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`}
                alt={name}
                className="w-14 h-14 rounded-2xl border-2 border-white shadow-xs object-cover"
              />
              <div>
                <h3 className="text-base font-black text-slate-900">{name}</h3>
                <p className="text-xs text-slate-500">{student.email || 'Alumno Oficial Güakytopia'}</p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-black bg-indigo-100 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded-full">
                    {student.levelId || 'Super Goal 1'}
                  </span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full capitalize">
                    {student.plan || 'Plan Mensual'}
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Turno: {student.preferredTimeSlot || 'Asignado'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick KPI stats */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-around sm:justify-start">
              <div className="text-center p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs min-w-[70px]">
                <div className="flex items-center justify-center gap-0.5 text-orange-600 font-black text-sm">
                  <Flame className="w-3.5 h-3.5 fill-orange-500" />
                  <span>{student.streak}</span>
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Racha</span>
              </div>
              <div className="text-center p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs min-w-[70px]">
                <div className="flex items-center justify-center gap-0.5 text-emerald-600 font-black text-sm">
                  <Zap className="w-3.5 h-3.5 fill-emerald-500" />
                  <span>{student.xp}</span>
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase">XP Total</span>
              </div>
              <div className="text-center p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs min-w-[70px]">
                <div className="flex items-center justify-center gap-0.5 text-purple-600 font-black text-sm">
                  <Award className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[50px]">{student.league || 'Liga'}</span>
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Coquito's</span>
              </div>
            </div>
          </div>

          {/* Section 1: Radar de 4 Habilidades */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                <span>Radar de Competencias Comunicativas (Escala 1 - 5)</span>
              </h4>
              <span className="text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                Promedio: {overallAvg} / 5.0
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Fluidez */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-slate-800 flex items-center gap-1.5">
                    <span>🗣️</span> Fluidez & Espontaneidad
                  </span>
                  <span className="font-bold text-indigo-700">{rating.fluency}/5 ({fluencyPct}%)</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${fluencyPct}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Capacidad para sostener conversaciones sin pausas prolongadas y responder con naturalidad.
                </p>
              </div>

              {/* Gramática */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-slate-800 flex items-center gap-1.5">
                    <span>📐</span> Precisión Gramatical
                  </span>
                  <span className="font-bold text-teal-700">{rating.grammar}/5 ({grammarPct}%)</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-teal-400 to-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${grammarPct}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Dominio de estructuras oracionales, tiempos verbales y coherencia sintáctica McGraw-Hill.
                </p>
              </div>

              {/* Vocabulario */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-slate-800 flex items-center gap-1.5">
                    <span>📖</span> Riqueza de Vocabulario
                  </span>
                  <span className="font-bold text-amber-700">{rating.vocabulary}/5 ({vocabPct}%)</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${vocabPct}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Amplitud de léxico activo para describir emociones, trabajo, rutinas y situaciones reales.
                </p>
              </div>

              {/* Pronunciación */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-slate-800 flex items-center gap-1.5">
                    <span>🎙️</span> Pronunciación & Fonética
                  </span>
                  <span className="font-bold text-rose-700">{rating.pronunciation}/5 ({pronunPct}%)</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-pink-500 to-rose-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pronunPct}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Claridad articulatoria, acentuación de palabras y distinción de fonemas clave en inglés.
                </p>
              </div>

            </div>
          </div>

          {/* Section 2: Mi Nido de Fallas & Oportunidades de Mejora */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm">
                  🦜
                </div>
                <h4 className="font-black text-sm sm:text-base text-amber-950">
                  Mi Nido de Oportunidades • Puntos a Pulir
                </h4>
              </div>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                ADHD-Friendly
              </span>
            </div>

            <p className="text-xs text-amber-900/80 leading-relaxed">
              En Güakytopia los errores no son penalizaciones, sino las misiones que te harán subir de nivel. Güaky The Macaw te deja estos micro-tips para tus próximas sesiones:
            </p>

            <div className="space-y-2.5 pt-1">
              {opportunities.map((item, idx) => (
                <div key={idx} className="p-3 bg-white border border-amber-200/80 rounded-xl space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-xs">{item.skill}</span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      {item.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">{item.issue}</p>
                  <div className="p-2 bg-amber-50/60 rounded-lg border border-amber-200/50 text-[11px] text-amber-950 font-medium">
                    {item.guakyTip}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Mochila & Protección de Clases (Güakypack Status) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎒</span>
              <div>
                <h4 className="font-black text-sm sm:text-base text-slate-900">
                  Estado del Güakypack
                </h4>
                <p className="text-xs text-slate-500">
                  Horas de clase protegidas, escudos flex y pases para The Flock
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs">
                <span>🛡️</span>
                <span>{student.guakypack?.hourShields ?? 1} Escudo(s) Flex</span>
              </div>
              {onOpenGuakypack && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenGuakypack();
                  }}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs shadow-xs transition-transform hover:scale-102 cursor-pointer"
                >
                  Abrir Mochila 🎒
                </button>
              )}
            </div>
          </div>

          {/* Guardian specific note if guardian view is active */}
          {viewMode === 'guardian' && (
            <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-2xl space-y-1 text-xs text-indigo-950">
              <h5 className="font-black text-indigo-900 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-indigo-600" />
                <span>Nota Pedagógica de Teacher Coquito para Representantes:</span>
              </h5>
              <p className="text-[11px] text-indigo-900/90 leading-relaxed pt-1">
                "{student.name} demuestra una excelente actitud de participación y retención auditiva. Para maximizar su progreso este mes, recomendamos que complete al menos 3 micro-sesiones semanales de 10 minutos en el <strong>Lab de 100 drills</strong> y mantenga activa su racha de juego en The Flock Arena. ¡Estamos muy orgullosos de su constancia!"
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Güakytopia • Academia Oficial • Método McGraw-Hill
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
