import React, { useState } from 'react';
import { 
  X, 
  Gamepad2, 
  Sparkles, 
  Trophy, 
  CheckCircle2, 
  User, 
  Mail, 
  Lock, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  Flame,
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student } from '../types';

interface GamerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingXp: number;
  onRegisterGamer: (gamerData: { name: string; username: string; email: string; pin: string }) => void;
  onOpenPricingModal?: () => void;
}

export const GamerAccountModal: React.FC<GamerAccountModalProps> = ({
  isOpen,
  onClose,
  pendingXp,
  onRegisterGamer,
  onOpenPricingModal
}) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onRegisterGamer({
      name: name.trim(),
      username: username.trim() || name.trim().toLowerCase().replace(/\s+/g, '_'),
      email: email.trim().toLowerCase(),
      pin: pin.trim() || '1234'
    });

    setIsSuccess(true);
    try {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-scaleUp">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-violet-950 via-indigo-900 to-purple-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Gamepad2 className="w-3.5 h-3.5" /> Cuenta Gamer Gratuita
            </span>
            <span className="text-[10px] font-bold text-amber-300 bg-white/10 px-2 py-0.5 rounded-full">
              +{pendingXp > 0 ? pendingXp : 50} XP Pendientes
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            ¡Guarda tus Puntos &amp; Racha! 🎮
          </h3>
          <p className="text-xs text-purple-200 mt-1 leading-relaxed">
            No pierdas tus logros al cerrar la ventana. Crea tu alias gamer gratis para competir en la <strong>Tabla General de Güakytopia</strong>.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          
          {isSuccess ? (
            <div className="text-center py-4 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center text-3xl shadow-md">
                🏆
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-slate-900">
                  ¡Cuenta Gamer Creada con Éxito!
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                  Tus puntos ya están asegurados y apareces en la <strong>Tabla General de Posiciones</strong> de los domingos.
                </p>
              </div>

              {/* Upsell to Digital Pass $4.99 */}
              <div className="p-4 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-purple-500/10 rounded-2xl border-2 border-amber-400/60 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    🚀 Siguiente Nivel: Pase Digital
                  </span>
                  <strong className="text-sm font-black text-amber-600">$4.99/mes</strong>
                </div>
                <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                  ¿Quieres multiplicar tus puntos y aprender inglés de verdad?
                </h5>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Con el <strong>Pase Digital Autónomo ($4.99/mes)</strong> desbloqueas los 12 niveles de libros oficiales, quizzes con audios nativos en el Classroom y ganas el triple de XP para coronarte en el Top 3 Semanal.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPricingModal?.();
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Ver Beneficios del Pase Digital ($4.99)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Seguir Jugando como Gamer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Informative Note */}
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl text-[11px] text-purple-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <p>
                  Esta cuenta es <strong>100% gratuita</strong> para la Arena. Te permitirá guardar tu récord y competir por los premios de los domingos.
                </p>
              </div>

              {/* Name input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Tu Nombre o Apodo
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ej. Alex Gamer"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-purple-600 outline-none"
                  />
                </div>
              </div>

              {/* Username for Leaderboard */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Alias Gamer (Como saldrás en la Tabla)
                </label>
                <div className="relative">
                  <span className="text-xs text-slate-400 font-bold absolute left-3 top-2">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    placeholder="alex_hunter"
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-purple-600 outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Tu Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-purple-600 outline-none"
                  />
                </div>
              </div>

              {/* PIN / Password */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  PIN o Clave de 4 dígitos (Para volver a entrar)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    maxLength={10}
                    value={pin}
                    onChange={e => setPin(e.target.value)}
                    placeholder="••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-purple-600 outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black rounded-2xl text-xs shadow-lg transition-transform hover:scale-102 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Guardar mis Puntos &amp; Unirme al Ranking</span>
              </button>

              {/* Promotion banner for Pase Digital */}
              <div className="pt-2 text-center border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPricingModal?.();
                  }}
                  className="text-[11px] text-amber-700 hover:text-amber-800 font-bold underline transition-colors"
                >
                  ¿Deseas clases o acceso completo a los libros? Activa tu Pase Digital por $4.99/mes
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
