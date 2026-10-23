import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Shield, 
  Clock, 
  Trophy, 
  Flame, 
  Award, 
  Gift, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Calendar,
  Lock,
  Plus,
  Compass,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, AudienceTheme } from '../types';

interface GuakypackModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStudent: Student | null;
  onOpenPricingModal?: () => void;
  onNavigateToTab?: (tab: string) => void;
  onUpdateStudent?: (updated: Student) => void;
  audienceTheme?: AudienceTheme;
}

export const GuakypackModal: React.FC<GuakypackModalProps> = ({
  isOpen,
  onClose,
  currentStudent,
  onOpenPricingModal,
  onNavigateToTab,
  onUpdateStudent,
  audienceTheme = 'adults'
}) => {
  const [activeTab, setActiveTab] = useState<'hours' | 'shields' | 'league' | 'kit'>('hours');
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const isKids = audienceTheme === 'kids';

  // Fallback defaults for backpack data
  const pack = currentStudent?.guakypack || {
    hoursBalance: currentStudent?.prepaidHoursBalance ?? 6,
    hoursEarned: 1, // 1 free earned hour from Cokitö's League
    hoursExpiryDate: currentStudent?.prepaidHoursExpiresAt || new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0],
    hourShields: 1,
    streakShields: 1,
    flockPasses: 1,
    podiumCount: 2, // 2/3 towards next free month
    savedWords: ['serendipity', 'straightforward', 'by the way', 'breakthrough']
  };

  const totalHours = pack.hoursBalance + (pack.hoursEarned || 0);
  const currentXp = currentStudent?.xp || 350;

  const handleRedeem = (type: 'hour_shield' | 'streak_shield', cost: number) => {
    if (currentXp < cost) {
      alert(`Necesitas al menos ${cost} XP para canjear este escudo. ¡Gana más XP en el Lab o en la Arena!`);
      return;
    }

    if (currentStudent && onUpdateStudent) {
      const updatedPack = {
        ...pack,
        hourShields: type === 'hour_shield' ? pack.hourShields + 1 : pack.hourShields,
        streakShields: type === 'streak_shield' ? pack.streakShields + 1 : pack.streakShields
      };

      const updatedStudent: Student = {
        ...currentStudent,
        xp: Math.max(0, currentStudent.xp - cost),
        guakypack: updatedPack
      };

      onUpdateStudent(updatedStudent);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      setRedeemSuccess(type === 'hour_shield' ? '¡Escudo de 12 Horas añadido a tu Güakypack!' : '¡Escudo de Racha añadido a tu Güakypack!');
      setTimeout(() => setRedeemSuccess(null), 3000);
    } else {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      setRedeemSuccess('¡Escudo canjeado con éxito!');
      setTimeout(() => setRedeemSuccess(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 flex flex-col my-auto max-h-[92vh]">
        
        {/* HEADER: GÜAKYPACK BANNER */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-500 via-teal-700 to-slate-900 text-white relative shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <span>🎒</span>
                  <span>Mochila del Explorador</span>
                </span>
                <span className="text-[11px] font-bold text-teal-200">
                  Güakypack Oficial • Güakytopia
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Tu Güakypack Personal</span>
                <span className="text-2xl">🎒</span>
              </h2>
              <p className="text-xs text-teal-100 max-w-md leading-relaxed">
                Tus horas de clase, escudos de protección ganados, pases a la Flock Conversation y premios de la Cokitö's League.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors shrink-0"
              title="Cerrar Güakypack"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* QUICK INVENTORY MINI-BAR */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 mt-2 border-t border-white/20">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 text-center">
              <span className="text-[10px] uppercase font-bold text-teal-200 block">Horas Totales</span>
              <span className="text-base font-black text-amber-300">{totalHours}h</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 text-center">
              <span className="text-[10px] uppercase font-bold text-teal-200 block">Escudos 12h</span>
              <span className="text-base font-black text-emerald-300">{pack.hourShields}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 text-center">
              <span className="text-[10px] uppercase font-bold text-teal-200 block">Escudos Racha</span>
              <span className="text-base font-black text-orange-300">{pack.streakShields}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 text-center">
              <span className="text-[10px] uppercase font-bold text-teal-200 block">Pases Flock</span>
              <span className="text-base font-black text-purple-300">{pack.flockPasses}</span>
            </div>
          </div>
        </div>

        {/* COMPARTMENTS NAVIGATION TABS */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-3 sm:px-6 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'hours', label: '⏱️ Horas de Clase', desc: 'Bolsa y horas ganadas' },
            { id: 'shields', label: '🛡️ Escudos & Canje', desc: 'Protecciones ganadas' },
            { id: 'league', label: "🏆 Cokitö's League", desc: 'Premios y podios' },
            { id: 'kit', label: '📓 Libreta & Chuletas', desc: 'Recursos de bolsillo' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 sm:px-4 text-xs font-black transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'border-teal-600 text-teal-900 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* FEEDBACK NOTICE */}
        {redeemSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-800 text-center animate-fadeIn flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{redeemSuccess}</span>
          </div>
        )}

        {/* SCROLLABLE COMPARTMENT CONTENT */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* =========================================================================
              TAB 1: HORAS DE CLASE (HOURS POCKET)
              ========================================================================= */}
          {activeTab === 'hours' && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Balance Card */}
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50/60 border border-teal-200 rounded-3xl p-5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full">
                      Saldo en tu Güakypack
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                      {totalHours} Horas Disponibles
                    </h3>
                    <p className="text-xs text-slate-600">
                      Válidas para tutoría 1 a 1, speaking o preparación de exámenes.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {onNavigateToTab && (
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToTab('calendar');
                        }}
                        className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Agendar en Agenda</span>
                      </button>
                    )}
                    {onOpenPricingModal && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenPricingModal();
                        }}
                        className="px-3.5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Recargar Horas ($10/h)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub-breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-white rounded-2xl border border-teal-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-700 block">Horas Prepagadas Adquiridas</span>
                      <span className="text-[10px] text-slate-500">Tarifa plana de $10 USD/h</span>
                    </div>
                    <span className="text-lg font-black text-slate-900">{pack.hoursBalance}h</span>
                  </div>

                  <div className="p-3 bg-white rounded-2xl border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-amber-900 block flex items-center gap-1">
                        <span>Horas Ganadas en la Liga</span>
                        <Trophy className="w-3 h-3 text-amber-500" />
                      </span>
                      <span className="text-[10px] text-slate-500">Premios de Cokitö's League</span>
                    </div>
                    <span className="text-lg font-black text-amber-600">+{pack.hoursEarned}h</span>
                  </div>
                </div>

                {/* Expiry indicator */}
                <div className="p-3 bg-white/80 rounded-2xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                    <span><strong>Vigencia del ciclo:</strong> Vence el {pack.hoursExpiryDate} (30 días de validez).</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                    Activo
                  </span>
                </div>
              </div>

              {/* Reglas de Oro */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <h4 className="text-xs font-black text-slate-900">Aviso Estándar 24h</h4>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Cancela o reprograma con al menos 24 horas de antelación para que la hora retorne íntegra a tu mochila.
                  </p>
                </div>
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1">
                  <h4 className="text-xs font-black text-amber-950 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-amber-600" />
                    <span>Escudo de las 12h</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    ¿Un imprevisto de última hora? Activa tu escudo para reprogramar avisando con solo 12 horas.
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <h4 className="text-xs font-black text-slate-900">Garantía 45/15 min</h4>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Si por fuerza mayor te retiras antes del minuto 45, se te compensa un bloque de 15 minutos en tu bolsa.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* =========================================================================
              TAB 2: ESCUDOS & TALLER DE CANJE POR XP
              ========================================================================= */}
          {activeTab === 'shields' && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Status Header */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                    Bóveda de Protección
                  </span>
                  <h3 className="text-base font-black">
                    Tus Escudos Activos en el Güakypack
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Tus Puntos de XP</span>
                  <span className="text-lg font-black text-amber-300">{currentXp} XP</span>
                </div>
              </div>

              {/* Escudos Activos Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Escudo de 12 Horas */}
                <div className="p-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900">Escudo de las 12 Horas</h4>
                        <span className="text-[10px] text-emerald-800 font-semibold">Protección de Horas de Clase</span>
                      </div>
                    </div>
                    <span className="text-xl font-black text-emerald-700">{pack.hourShields}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Te permite reprogramar una sesión agendada avisando con solo 12 horas en vez de las 24 horas reglamentarias.
                  </p>
                  <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">¿Cómo ganar más?</span>
                    <span className="text-[11px] font-bold text-emerald-700">50 Drills en Lab o 300 XP</span>
                  </div>
                </div>

                {/* Escudo de Racha (Streak Freeze) */}
                <div className="p-4 rounded-2xl border-2 border-orange-300 bg-orange-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
                        <Flame className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900">Escudo de Racha (Streak Freeze)</h4>
                        <span className="text-[10px] text-orange-800 font-semibold">Protector de Fuego en la Arena</span>
                      </div>
                    </div>
                    <span className="text-xl font-black text-orange-600">{pack.streakShields}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Si un día no puedes entrar a la Arena por falta de luz o internet, congela tu racha automáticamente para no perderla.
                  </p>
                  <div className="pt-2 border-t border-orange-200/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">¿Cómo ganar más?</span>
                    <span className="text-[11px] font-bold text-orange-700">7 días de racha o 150 XP</span>
                  </div>
                </div>

              </div>

              {/* Taller de Canje por XP */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h4 className="text-sm font-black text-slate-900">
                      Taller del Backpack: Canje de Escudos con XP
                    </h4>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    Estudiar en el Lab te da recompensas reales
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-black text-slate-900 block">+1 Escudo de 12 Horas</span>
                      <span className="text-[11px] text-slate-500">Costo: 300 XP acumulados</span>
                    </div>
                    <button
                      onClick={() => handleRedeem('hour_shield', 300)}
                      disabled={currentXp < 300}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl text-xs transition-colors shrink-0 shadow-xs"
                    >
                      Canjear (300 XP)
                    </button>
                  </div>

                  <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-black text-slate-900 block">+1 Escudo de Racha</span>
                      <span className="text-[11px] text-slate-500">Costo: 150 XP acumulados</span>
                    </div>
                    <button
                      onClick={() => handleRedeem('streak_shield', 150)}
                      disabled={currentXp < 150}
                      className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl text-xs transition-colors shrink-0 shadow-xs"
                    >
                      Canjear (150 XP)
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* =========================================================================
              TAB 3: COKITÖ'S LEAGUE & PREMIOS DEL PODIO
              ========================================================================= */}
          {activeTab === 'league' && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Banner: Podios hacia Mes Gratis */}
              <div className="p-5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 rounded-3xl space-y-3 shadow-md">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 text-white px-2.5 py-0.5 rounded-full">
                    Regla de Oro del Podio
                  </span>
                  <span className="text-xs font-black">
                    Pase Digital ($4.99 / mes)
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black">
                  ¡3 Podios en Cokitö's League = 1 Mes Gratis de Pase Digital!
                </h3>
                <p className="text-xs font-semibold max-w-xl leading-relaxed">
                  Si quedas entre los 3 primeros lugares de la liga en 3 semanas diferentes, tu siguiente mes de membresía se renueva automáticamente a $0.
                </p>

                {/* Progress bar */}
                <div className="bg-slate-950/20 p-3 rounded-2xl space-y-1.5">
                  <div className="flex justify-between text-xs font-black">
                    <span>Tu Progreso de Podios:</span>
                    <span>{pack.podiumCount} / 3 Podios Alcanzados</span>
                  </div>
                  <div className="w-full bg-white/40 h-3 rounded-full overflow-hidden p-0.5">
                    <div 
                      className="bg-slate-950 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${(pack.podiumCount / 3) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-900 font-bold block text-right">
                    {pack.podiumCount >= 3 ? '🎉 ¡Recompensa lista para canjear!' : `Falta ${3 - pack.podiumCount} podio para tu mes gratuito`}
                  </span>
                </div>
              </div>

              {/* Tabla de Premios Oficial */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Tabla Oficial de Recompensas de Cokitö's League
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* 1st Place */}
                  <div className="p-4 rounded-2xl border-2 border-amber-400 bg-amber-50/70 space-y-2 relative">
                    <span className="text-2xl">🥇</span>
                    <span className="text-[10px] font-black uppercase bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full block w-fit">
                      1er Lugar • Oro
                    </span>
                    <ul className="text-xs text-slate-800 space-y-1.5 pt-1">
                      <li>⭐ <strong>Pase Digital:</strong> Suma 1 Podio para el mes gratis.</li>
                      <li>⭐ <strong>Clases en Vivo:</strong> <strong>1 Hora de Clase Gratis</strong> acreditada a tu Güakypack (valor $10).</li>
                      <li>⭐ Corona de Campeón en tu perfil.</li>
                    </ul>
                  </div>

                  {/* 2nd Place */}
                  <div className="p-4 rounded-2xl border border-slate-300 bg-slate-50 space-y-2">
                    <span className="text-2xl">🥈</span>
                    <span className="text-[10px] font-black uppercase bg-slate-300 text-slate-800 px-2 py-0.5 rounded-full block w-fit">
                      2do Lugar • Plata
                    </span>
                    <ul className="text-xs text-slate-700 space-y-1.5 pt-1">
                      <li>⭐ <strong>1 Pase VIP al Flock Conversation Club</strong> (sesión temática en vivo con teacher).</li>
                      <li>⭐ 1 Escudo de Racha para proteger tu racha.</li>
                      <li>⭐ Insignia plateada en la tabla.</li>
                    </ul>
                  </div>

                  {/* 3rd Place */}
                  <div className="p-4 rounded-2xl border border-amber-800/20 bg-amber-900/5 space-y-2">
                    <span className="text-2xl">🥉</span>
                    <span className="text-[10px] font-black uppercase bg-amber-700 text-white px-2 py-0.5 rounded-full block w-fit">
                      3er Lugar • Bronce
                    </span>
                    <ul className="text-xs text-slate-700 space-y-1.5 pt-1">
                      <li>⭐ <strong>Pack de 2 Escudos Protectores:</strong> 1 Escudo de 12 Horas + 1 Escudo de Racha.</li>
                      <li>⭐ Insignia de bronce en la tabla.</li>
                    </ul>
                  </div>

                </div>
              </div>

              {/* CTA button to Arena */}
              {onNavigateToTab && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToTab('duolingo');
                  }}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Ir a The Arena & Competir en Cokitö's League</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

            </div>
          )}

          {/* =========================================================================
              TAB 4: LIBRETA DE RECURSOS & CHULETAS (ACADEMIC KIT)
              ========================================================================= */}
          {activeTab === 'kit' && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Cheat Sheets Pocket */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-teal-600" />
                    <span>Chuletas de Bolsillo de Cokitö (Cheat Sheets)</span>
                  </h4>
                  <span className="text-[11px] text-teal-700 font-bold">100% de Consulta Rápida</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* In / On / At Rule Card */}
                  <div className="p-3.5 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-1.5">
                    <strong className="text-xs font-black text-teal-950 block">
                      📌 Regla Mágica: IN, ON, AT
                    </strong>
                    <p className="text-[11px] text-slate-700 leading-relaxed">
                      • <strong>AT:</strong> Horas exactas y puntos precisos (<em>at 4:00 PM, at home</em>).<br />
                      • <strong>ON:</strong> Días y superficies (<em>on Monday, on the table, on the bus</em>).<br />
                      • <strong>IN:</strong> Meses, años y espacios cerrados (<em>in October, in Venezuela, in the room</em>).
                    </p>
                  </div>

                  {/* Conversation Starters */}
                  <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1.5">
                    <strong className="text-xs font-black text-amber-950 block">
                      🗣️ Conectores de Fluidez Nativa
                    </strong>
                    <p className="text-[11px] text-slate-700 leading-relaxed">
                      • <em>"By the way..."</em> (Por cierto...)<br />
                      • <em>"To be honest..."</em> (Para ser sincero...)<br />
                      • <em>"Actually..."</em> (En realidad / De hecho...)<br />
                      • <em>"How about you?"</em> (¿Y tú qué tal?)
                    </p>
                  </div>

                </div>
              </div>

              {/* Saved Words Deck */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-slate-700" />
                    <h4 className="text-xs font-black text-slate-900">
                      Mi Libreta de Palabras Guardadas ({pack.savedWords?.length || 0})
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Palabras capturadas en Where's Güaky y el Lab
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(pack.savedWords || []).map((word, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 bg-white border border-slate-200 text-slate-800 rounded-lg text-xs font-bold shadow-2xs flex items-center gap-1"
                    >
                      <span>🔤</span>
                      <span>{word}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Direct Library PDF Link */}
              {onNavigateToTab && (
                <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between gap-4">
                  <div>
                    <h5 className="text-xs font-black text-white">Libros Oficiales McGraw Hill</h5>
                    <p className="text-[11px] text-slate-300">
                      Accede a los PDFs de Student Book y Workbook en la Academic Library.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToTab('library');
                    }}
                    className="px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl text-xs transition-colors shrink-0"
                  >
                    Abrir Library &rarr;
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-teal-600" />
            <span className="font-semibold">Güakypack • Inventario oficial del alumno</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors"
          >
            Cerrar Mochila
          </button>
        </div>

      </div>
    </div>
  );
};
