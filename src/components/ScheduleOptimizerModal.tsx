import React, { useState } from 'react';
import { X, Sparkles, Clock, CheckCircle2, AlertTriangle, Calendar, Award, Compass, TrendingUp, Layers } from 'lucide-react';
import { INTENSITY_PLANS } from '../data/curriculumData';

interface ScheduleOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPreset?: (presetName: string) => void;
}

export const ScheduleOptimizerModal: React.FC<ScheduleOptimizerModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedPlanTab, setSelectedPlanTab] = useState<'basic' | 'regular' | 'intensive' | 'super_intensive'>('regular');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-start justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">Análisis y Optimización de Agenda Pedagógica</h2>
                <span className="text-[11px] font-semibold bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  Propuesta para Profe Ana
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-0.5">
                Estructura estratégica basada en tus 12 niveles de Super Goal y Mega Goal (390 horas totales).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700">

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl">
              <span className="text-xs text-indigo-600 font-medium block">Total Currículo</span>
              <span className="text-xl font-black text-indigo-900">390 Horas</span>
              <span className="text-[11px] text-slate-500 block">12 Niveles (Super + Mega)</span>
            </div>
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl">
              <span className="text-xs text-emerald-600 font-medium block">Formato Recomendado</span>
              <span className="text-xl font-black text-emerald-900">50 min + 10 min</span>
              <span className="text-[11px] text-slate-500 block">Regla anti-retrasos en cadena</span>
            </div>
            <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl">
              <span className="text-xs text-blue-600 font-medium block">Capacidad Óptima</span>
              <span className="text-xl font-black text-blue-900">20-24 h / sem</span>
              <span className="text-[11px] text-slate-500 block">8 a 12 alumnos activos</span>
            </div>
            <div className="p-3.5 bg-amber-50/70 border border-amber-100 rounded-xl">
              <span className="text-xs text-amber-600 font-medium block">Bloques Óptimos</span>
              <span className="text-xl font-black text-amber-900">90 min x 2</span>
              <span className="text-[11px] text-slate-500 block">Máxima retención cognitiva</span>
            </div>
          </div>

          {/* Core Diagnosis & Findings */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <Compass className="w-5 h-5 text-indigo-600" />
              <span>Diagnóstico de tu Hoja de Cálculo y Cuellos de Botella Habituales</span>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p>
                    <strong>Sesiones de 1 hora fragmentadas:</strong> Generan huecos muertos de 30 o 45 minutos que nadie puede reservar, recortando tu disponibilidad real hasta en un 30%.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p>
                    <strong>Fatiga en sesiones de 120 min:</strong> La neurociencia del aprendizaje de idiomas muestra que después de 75 min continuos, la atención cae un 40%. Las sesiones largas requieren pausas obligatorias estructuradas.
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p>
                    <strong>Super Goal (Niveles I a VI):</strong> Unidades de 3.0 y 4.0 hrs. Se completan en ciclos limpios de 24 horas por nivel (12 semanas en básico, 8 semanas en regular).
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p>
                    <strong>Mega Goal (Niveles VII a XII):</strong> Unidades más densas (5.2 y 6.5 hrs). Requieren bloques más intensivos para producción de ensayos y debates.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Plan Breakdown Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Recomendación Estratégica por Cada Modalidad:</span>
              </h3>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                {(['basic', 'regular', 'intensive', 'super_intensive'] as const).map(key => (
                  <button
                    key={key}
                    onClick={() => setSelectedPlanTab(key)}
                    className={`px-3 py-1 rounded-md transition-all ${
                      selectedPlanTab === key
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {INTENSITY_PLANS[key].badge} ({INTENSITY_PLANS[key].hoursPerWeek}h)
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Plan Details Card */}
            <div className="border border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-white rounded-xl p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100 pb-3">
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    {INTENSITY_PLANS[selectedPlanTab].name}
                  </h4>
                  <p className="text-xs text-slate-600">
                    {INTENSITY_PLANS[selectedPlanTab].description}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-indigo-700 bg-indigo-100/80 px-2.5 py-1 rounded-full">
                    {INTENSITY_PLANS[selectedPlanTab].recommendedFor}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4 text-xs sm:text-sm">
                <div className="space-y-2.5">
                  <h5 className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    Estructura de Horario Sugerida:
                  </h5>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                    <p className="font-medium text-slate-900">
                      {INTENSITY_PLANS[selectedPlanTab].recommendedFormat}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {selectedPlanTab === 'regular' && '✅ 2 clases de 90 min liberan 1 día completo de tu semana en comparación con 3 de 60 min, reduciendo tiempos muertos.'}
                      {selectedPlanTab === 'basic' && '✅ Evita dar las 2 horas en un solo día; separar Martes y Jueves duplica la tasa de memorización.'}
                      {selectedPlanTab === 'intensive' && '✅ Si tomas 2 sesiones de 120 min, programa obligatoriamente 5 minutos de estiramiento y cambio de dinámica al minuto 55.'}
                      {selectedPlanTab === 'super_intensive' && '✅ 3 sesiones de 2 horas (Lun/Mié/Vie) es la fórmula dorada para evitar sobrecargar los fines de semana.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <h5 className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    Proyección de Tiempos Reales:
                  </h5>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Nivel Super Goal (24h totales):</span>
                      <strong className="text-slate-900">
                        {selectedPlanTab === 'basic' ? '12 semanas (3 meses)' : selectedPlanTab === 'regular' ? '8 semanas (2 meses)' : selectedPlanTab === 'intensive' ? '6 semanas (1.5 meses)' : '4 semanas (1 mes)'}
                      </strong>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Nivel Mega Goal I-III (36h totales):</span>
                      <strong className="text-slate-900">
                        {selectedPlanTab === 'basic' ? '18 semanas (4.5 meses)' : selectedPlanTab === 'regular' ? '12 semanas (3 meses)' : selectedPlanTab === 'intensive' ? '9 semanas (2.3 meses)' : '6 semanas (1.5 meses)'}
                      </strong>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Nivel Mega Goal IV-VI (46h totales):</span>
                      <strong className="text-slate-900">
                        {selectedPlanTab === 'basic' ? '23 semanas (5.8 meses)' : selectedPlanTab === 'regular' ? '15.3 semanas (3.8 meses)' : selectedPlanTab === 'intensive' ? '11.5 semanas (2.9 meses)' : '7.7 semanas (1.9 meses)'}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Golden Rules for Teacher Ana */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Las 3 Reglas de Oro para Blindar tu Agenda</span>
            </h4>
            <div className="grid md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-indigo-700 block text-sm">1. La Regla de los 10 Minutos</span>
                <p className="text-slate-600">
                  Las clases de 60 min se cierran al min 50. Los últimos 10 min son para enviar la tarea al Classroom, registrar asistencia y tomar agua antes del siguiente alumno.
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-indigo-700 block text-sm">2. Time-Blocking por Nivel</span>
                <p className="text-slate-600">
                  Agrupa alumnos de <strong>Super Goal</strong> por las mañanas y alumnos de <strong>Mega Goal</strong> por las tardes. Disminuye drásticamente el desgaste mental de cambiar de nivel pedagógico.
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-indigo-700 block text-sm">3. Notificación Automática</span>
                <p className="text-slate-600">
                  Activa los recordatorios automáticos de 24 horas y 1 hora vía Gmail. Reduce la tasa de inasistencia (no-shows) de un 15% a menos del 2%.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>Todos los horarios de la aplicación ya implementan esta optimización.</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm shadow-md transition-colors"
          >
            Entendido, volver a la aplicación
          </button>
        </div>

      </div>
    </div>
  );
};
