import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, ArrowRight, Award, ExternalLink, HelpCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PathwayUnit } from '../data/pathwayData';
import { Student } from '../types';
import { User } from 'firebase/auth';
import { recordAcademicEvent } from '../services/academicEvents';

interface UnitQuizModalProps {
  unit: PathwayUnit;
  isOpen: boolean;
  onClose: () => void;
  onQuizFinished: (score: number, total: number) => void;
  currentStudent?: Student | null;
  user?: User | null;
  activeRole?: 'student' | 'teacher';
}

export const UnitQuizModal: React.FC<UnitQuizModalProps> = ({
  unit,
  isOpen,
  onClose,
  onQuizFinished,
  currentStudent,
  user,
  activeRole = 'student'
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const currentQ = unit.quizQuestions[currentIdx];
  const isLastQuestion = currentIdx === unit.quizQuestions.length - 1;

  const handleVerify = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);

    if (selectedOption === currentQ.correctIndex) {
      setCorrectCount(prev => prev + 1);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch {}
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setIsCompleted(true);
      onQuizFinished(finalScore, unit.quizQuestions.length);
      const finalScore = correctCount + (selectedOption === currentQ.correctIndex ? 1 : 0);
      // Capture the assessment result only for a Firebase-authenticated student.
      // The writer remains disabled by default until database/rules authorization is reviewed.
      if (currentStudent && user && activeRole === 'student') {
        void recordAcademicEvent({
          schemaVersion: 1,
          studentId: currentStudent.id,
          source: 'quiz',
          eventType: 'assessment_submitted',
          occurredAt: new Date().toISOString(),
          actor: { role: 'student', id: user.uid },
          curriculum: {
            unitId: `unit_${unit.unitNumber}`,
            assessmentId: `unit_quiz_${unit.unitNumber}`,
          },
          outcome: 'submitted',
          evidence: {
            score: finalScore,
            maxScore: unit.quizQuestions.length,
          },
        }).catch((error) => {
          console.warn('Academic quiz event was not recorded:', error);
        });
      }
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      } catch {}
    } else {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setIsCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full font-sans">
              Interactive Unit Practice Quiz
            </span>
            <h3 className="font-black text-lg text-white mt-1">
              Unit {unit.unitNumber}: {unit.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isCompleted ? (
          <div className="p-6 space-y-5">
            {/* Progress */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Question {currentIdx + 1} of {unit.quizQuestions.length}</span>
              <span className="text-emerald-600 font-bold">Score: {correctCount} correct</span>
            </div>

            {/* Question */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
              <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {currentQ.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                let btnStyle = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800';

                if (isAnswered) {
                  if (idx === currentQ.correctIndex) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-200';
                  } else if (isSelected) {
                    btnStyle = 'border-rose-500 bg-rose-50 text-rose-950 font-bold ring-2 ring-rose-200';
                  } else {
                    btnStyle = 'opacity-40 border-slate-200 bg-slate-50 text-slate-400';
                  }
                } else if (isSelected) {
                  btnStyle = 'border-blue-600 bg-blue-50 text-blue-950 font-bold ring-2 ring-blue-200';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => setSelectedOption(idx)}
                    className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && idx === currentQ.correctIndex && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    {isAnswered && isSelected && idx !== currentQ.correctIndex && (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {isAnswered && (
              <div className={`p-4 rounded-2xl border text-xs space-y-1 animate-fadeIn ${
                selectedOption === currentQ.correctIndex
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}>
                <span className="font-bold block">
                  {selectedOption === currentQ.correctIndex ? 'Excellent Job! 🎉' : 'Tip Cokitö Insight:'}
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Google Form Link Notice */}
            {unit.googleFormUrl && (
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
                <span>Would you prefer to submit on the official Google Form?</span>
                <a
                  href={unit.googleFormUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Teacher\'s Form</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-end pt-2">
              {!isAnswered ? (
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={selectedOption === null}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors disabled:opacity-50"
                >
                  Verify Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
                >
                  <span>{isLastQuestion ? 'Complete Quiz (+50 XP)' : 'Next Question'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Finished Screen */
          <div className="p-8 text-center space-y-5 animate-fadeIn">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-block mb-1">
                Unit Quiz Completed!
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Score: {correctCount} of {unit.quizQuestions.length}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                You have earned <strong>+50 XP</strong> for your Cokitö weekly league! You can review or retake this quiz anytime before your next live class.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleRestart}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl"
              >
                Retake Quiz
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md"
              >
                Return to Classroom
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
