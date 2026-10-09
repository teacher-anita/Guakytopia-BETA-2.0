import React, { useState } from 'react';
import { X, CheckCircle2, ChevronRight, ChevronLeft, Award, ExternalLink, HelpCircle, AlertCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PLACEMENT_TEST_QUESTIONS, evaluatePlacementScore, OFFICIAL_GOOGLE_FORM_URL } from '../data/placementTestData';

interface PlacementQuizModalProps {
  isOpen: boolean;
  studentName: string;
  onClose: () => void;
  onFinishTest: (result: {
    score: number;
    total: number;
    suggestedLevelId: string;
    suggestedLevelName: string;
    diagnosisText: string;
    answers: Record<number, string>;
  }) => void;
}

export const PlacementQuizModal: React.FC<PlacementQuizModalProps> = ({
  isOpen,
  studentName,
  onClose,
  onFinishTest
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [fillInput, setFillInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedResult, setCompletedResult] = useState<ReturnType<typeof evaluatePlacementScore> | null>(null);

  if (!isOpen) return null;

  const currentQ = PLACEMENT_TEST_QUESTIONS[currentIdx];
  const progressPct = Math.round(((currentIdx + 1) / PLACEMENT_TEST_QUESTIONS.length) * 100);

  const handleSelectOption = (option: string) => {
    // Extract choice letter like "a" or the full string
    const key = option.trim().charAt(0).toLowerCase();
    setAnswers(prev => ({ ...prev, [currentQ.id]: key }));
  };

  const handleFillSubmit = () => {
    if (!fillInput.trim()) return;
    setAnswers(prev => ({ ...prev, [currentQ.id]: fillInput.trim().toLowerCase() }));
  };

  const handleNext = () => {
    if (currentIdx < PLACEMENT_TEST_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setFillInput('');
    } else {
      // Finished all 25 questions!
      const evalResult = evaluatePlacementScore(answers);
      setCompletedResult(evalResult);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
      setFillInput(answers[PLACEMENT_TEST_QUESTIONS[currentIdx - 1]?.id] || '');
    }
  };

  const handleConfirmAndSend = () => {
    if (!completedResult) return;
    onFinishTest({
      ...completedResult,
      answers
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                Prueba Oficial de Nivel
              </span>
              <span className="text-xs text-slate-300">Teacher Cokito</span>
            </div>
            <h3 className="font-bold text-lg text-white mt-1">
              {completedResult ? '¡Evaluación Completada!' : `Pregunta ${currentIdx + 1} de ${PLACEMENT_TEST_QUESTIONS.length}`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {!completedResult ? (
          <div className="p-6 overflow-y-auto space-y-5">
            
            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>{currentQ.partTitle}</span>
                <span>{progressPct}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-600 to-amber-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Reading Context if present */}
            {currentQ.contextText && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs sm:text-sm text-blue-950 font-medium italic leading-relaxed">
                <span className="font-bold text-blue-700 block not-italic uppercase tracking-wider text-[11px] mb-1">
                  Texto de Lectura:
                </span>
                {currentQ.contextText}
              </div>
            )}

            {/* Question Text */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Pregunta #{currentQ.id}
              </span>
              <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {currentQ.question}
              </p>
            </div>

            {/* Answer Input: Options or Fill-in */}
            {currentQ.category === 'fill_in' ? (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  Escribe la palabra que falta en inglés:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={fillInput || answers[currentQ.id] || ''}
                    onChange={e => {
                      setFillInput(e.target.value);
                      setAnswers(prev => ({ ...prev, [currentQ.id]: e.target.value.toLowerCase().trim() }));
                    }}
                    placeholder="Ej. bring / improve"
                    className="flex-1 p-3 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Tip: Escribe una sola palabra sin puntos ni comas.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {currentQ.options?.map((opt, idx) => {
                  const optLetter = opt.trim().charAt(0).toLowerCase();
                  const isSelected = answers[currentQ.id] === optLetter;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold ring-2 ring-blue-200 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* External Google Form Notice */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
              <span>¿Prefieres responder en Google Forms?</span>
              <a
                href={OFFICIAL_GOOGLE_FORM_URL}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Abrir Form Oficial</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentIdx === 0}
                className="flex items-center gap-1 px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!answers[currentQ.id]}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors disabled:opacity-50"
              >
                <span>{currentIdx === PLACEMENT_TEST_QUESTIONS.length - 1 ? 'Finalizar Prueba' : 'Siguiente'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        ) : (
          /* Result Confirmation Screen */
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-center animate-fadeIn">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full inline-block mb-2">
                Resultado Preliminar Calculado
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                ¡Excelente esfuerzo, {studentName || 'Aspirante'}!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                Has completado las 25 preguntas de la prueba diagnóstica oficial de Teacher Cokito.
              </p>
            </div>

            {/* Score Card */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 border border-blue-200 rounded-3xl p-5 max-w-md mx-auto text-left space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-blue-100 pb-3">
                <span className="text-xs text-slate-600 font-semibold">Puntaje Obtenido:</span>
                <div className="text-right">
                  <span className="text-2xl font-black text-blue-900">{completedResult.score} / {completedResult.total}</span>
                  <span className="text-xs text-slate-500 block font-medium">({completedResult.percentage}% de aciertos)</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500 block">Nivel Preliminar Sugerido:</span>
                <strong className="text-sm font-bold text-slate-900 block mt-0.5">
                  {completedResult.suggestedLevelName}
                </strong>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {completedResult.diagnosisText}
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl flex items-start gap-2 text-xs text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Importante:</strong> Esta sugerencia es un punto de partida. La Teacher Cokito revisará tus respuestas a fondo y te asignará el nivel y grupo definitivos de forma personalizada.
                </p>
              </div>
            </div>

            {/* Confirm button */}
            <div className="max-w-md mx-auto">
              <button
                type="button"
                onClick={handleConfirmAndSend}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Adjuntar Resultado a Mi Registro</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
