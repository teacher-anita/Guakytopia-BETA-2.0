import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Flame, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Smile, 
  BookOpen, 
  Video, 
  Zap, 
  Award,
  ChevronRight,
  ShieldCheck,
  Star,
  Users,
  Smartphone,
  Banknote
} from 'lucide-react';
import { AudienceTheme } from '../types';
import { MODULES_INFO } from '../data/curriculumData';
import { GuakyLogo } from './GuakyLogo';

interface LandingHeroProps {
  audienceTheme: AudienceTheme;
  onStartRegistration: () => void;
  onExploreCalendar: () => void;
  onExploreGamification: () => void;
  onOpenOptimizer: () => void;
  onOpenPaymentModal?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  audienceTheme,
  onStartRegistration,
  onExploreCalendar,
  onExploreGamification,
  onOpenOptimizer,
  onOpenPaymentModal
}) => {
  const isKids = audienceTheme === 'kids';

  return (
    <div className="space-y-12 sm:space-y-16 animate-fadeIn pb-12">
      
      {/* 1. HERO BANNER */}
      <section className={`relative overflow-hidden rounded-3xl p-6 sm:p-12 text-white shadow-xl transition-all ${
        isKids
          ? 'bg-gradient-to-br from-[#2EC4B6] via-[#243447] to-[#18232F]'
          : 'bg-gradient-to-br from-[#243447] via-[#1a2736] to-[#0f1720] border border-slate-700/80'
      }`}>
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#2EC4B6]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md border border-white/20 text-[#FFD166]">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B4A]" />
              <span>GÜAKYTOPIA • OPEN THE WORLD</span>
            </div>
            <span className="text-xs text-slate-300 font-medium hidden sm:inline">
              Start where you are. Keep going.
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            {isKids ? (
              <>Aprende Inglés <span className="text-[#FFD166] underline decoration-[#FF6B4A]">con Curiosidad y Confianza</span> junto a Güaky 🎈</>
            ) : (
              <>Bienvenido a Tu <span className="text-[#2EC4B6]">Universo del Inglés</span>. Abrir el Mundo.</>
            )}
          </h1>

          <p className="text-sm sm:text-lg text-slate-200 leading-relaxed font-normal">
            Una experiencia digital de aprendizaje: estructurada, flexible, humana y con personalidad.
            12 niveles progresivos, micro-bloques sin fatiga cognitiva, laboratorio de conversación oral y clases con tutores.
          </p>

          {/* Core Feature Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-xs">
              <span className="block font-bold text-[#FFD166]">Micro-Chunking ⏱️</span>
              <span className="text-slate-200 text-[11px]">3 sesiones por unidad, cero fatiga cognitiva</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-xs">
              <span className="block font-bold text-[#2EC4B6]">Güakytalkie 📻</span>
              <span className="text-slate-200 text-[11px]">Speaking real para soltar la lengua</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-xs col-span-2 sm:col-span-1">
              <span className="block font-bold text-[#FF6B4A]">The Flock Community 🪶</span>
              <span className="text-slate-200 text-[11px]">Retos, insignias, XP y avance mutuo</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
            <button
              onClick={onStartRegistration}
              className="px-8 py-4 bg-[#2EC4B6] hover:bg-[#259C90] text-[#18232F] rounded-2xl font-black text-sm shadow-lg transition-transform hover:scale-102 flex items-center justify-center gap-2"
            >
              <span>Hacer Prueba Diagnóstica (25 Preguntas)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreCalendar}
              className="px-6 py-4 bg-white/15 hover:bg-white/20 text-white rounded-2xl font-bold text-sm backdrop-blur-md border border-white/20 transition-colors flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#FFD166]" />
              <span>Ver Horarios & Flights</span>
            </button>
          </div>

        </div>
      </section>

      {/* 2. THE 4 MODULES PENSUM OVERVIEW */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2EC4B6] bg-[#2EC4B6]/10 px-3 py-1 rounded-full border border-[#2EC4B6]/20">
            Currículo Estructurado • 12 Flights de Transformación
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#243447] tracking-tight">
            Los 4 Módulos de Güakytopia
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Un recorrido progresivo y organizado para saber qué aprender y hacia dónde avanzar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {MODULES_INFO.map(m => (
            <div
              key={m.module}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-all hover:border-blue-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-800 font-black text-sm flex items-center justify-center">
                    M{m.module}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {m.hours}
                  </span>
                </div>

                <div>
                  <h3 className="font-black text-slate-900 text-lg">{m.name}</h3>
                  <p className="text-xs font-semibold text-blue-700 mt-0.5">{m.tagline}</p>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {m.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Niveles que abarca:</span>
                  <div className="text-xs font-medium text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="font-bold">{m.levelsText}</span> • {m.booksText}
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs font-bold text-blue-700 flex items-center gap-1">
                <span>{m.meta}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TRANSPARENT PRICING & PLANS (EXPRESS, INTENSIVO, REGULAR, BÁSICO & PASE DIGITAL) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Inversión Clara & Pensum Internacional
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Planes Diseñados Para Tu Rutina
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Elige el ritmo que mejor se adapte a tus metas: desde el autoaprendizaje digital hasta la inmersión acelerada récord con el Nivel Express.
          </p>
        </div>

        {/* 4 Intensity Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Plan 1: Nivel Express (6 h/sem) */}
          <div className="bg-gradient-to-b from-amber-500/10 via-white to-white rounded-3xl border-2 border-amber-400 p-5 sm:p-6 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-4 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs whitespace-nowrap">
              ⚡ Nivel Express • ¡4 Semanas!
            </span>

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  6 h / semana
                </span>
                <Zap className="w-4 h-4 text-amber-500 fill-amber-400" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">Súper Intensivo Express</h3>
                <p className="text-xs text-slate-500">Máxima aceleración y fluidez récord</p>
              </div>

              <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200/80 text-xs">
                <span className="text-[10px] uppercase font-bold text-amber-800 block">Duración Nivel SuperGoal:</span>
                <strong className="text-amber-950 font-black text-sm">¡Solo 1 mes (4 semanas)!</strong>
                <span className="text-[10px] text-slate-500 block mt-0.5">3 sesiones semanales de 120 min</span>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Ideal para viajes urgentes o entrevistas laborales inmediatas</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Atención 1 a 1 o en Dúo de alta intensidad</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Feedback continuo directo por WhatsApp de La Teacher</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onStartRegistration}
              className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-black text-xs shadow-md transition-transform hover:scale-102 flex items-center justify-center gap-1.5"
            >
              <span>Elegir Nivel Express</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Plan 2: Intensivo (4 h/sem) */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 sm:p-6 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  4 h / semana
                </span>
                <Clock className="w-4 h-4 text-blue-600" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">Plan Intensivo</h3>
                <p className="text-xs text-slate-500">Para quienes llevan prisa y foco</p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Duración Nivel SuperGoal:</span>
                <strong className="text-slate-900 font-black text-sm">6 semanas (1.5 meses)</strong>
                <span className="text-[10px] text-slate-500 block mt-0.5">2 sesiones de 120 min o 4 de 60 min</span>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Progreso acelerado con inmersión constante</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Preparación para exámenes y certificaciones</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Práctica conversacional y debates activos</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onStartRegistration}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              Elegir Intensivo
            </button>
          </div>

          {/* Plan 3: Regular (3 h/sem) */}
          <div className="bg-white rounded-3xl border-2 border-blue-600 p-5 sm:p-6 shadow-md relative flex flex-col justify-between space-y-4">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs whitespace-nowrap">
              ⭐ Más Recomendado
            </span>

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  3 h / semana
                </span>
                <Star className="w-4 h-4 text-blue-600 fill-blue-600" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">Plan Regular</h3>
                <p className="text-xs text-slate-500">Equilibrio perfecto de ritmo y retención</p>
              </div>

              <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-200/80 text-xs">
                <span className="text-[10px] uppercase font-bold text-blue-800 block">Duración Nivel SuperGoal:</span>
                <strong className="text-blue-950 font-black text-sm">8 semanas (2 meses)</strong>
                <span className="text-[10px] text-slate-500 block mt-0.5">2 sesiones de 90 min (ej. Lun/Mié)</span>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>La fórmula dorada: máxima retención sin sobrecarga</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Disponible en modalidad Individual o en Parejas (Dúo)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Acceso permanente al Classroom y libro de trabajo</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onStartRegistration}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              Elegir Regular
            </button>
          </div>

          {/* Plan 4: Súper Básico (2 h/sem) */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  2 h / semana
                </span>
                <Smile className="w-4 h-4 text-emerald-600" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">Súper Básico</h3>
                <p className="text-xs text-slate-500">Constante, relajado y sin estrés</p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Duración Nivel SuperGoal:</span>
                <strong className="text-slate-900 font-black text-sm">12 semanas (3 meses)</strong>
                <span className="text-[10px] text-slate-500 block mt-0.5">2 sesiones de 60 min (ej. Mar/Jue)</span>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Diseñado para agendas muy ocupadas</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Avanza sin presión paso a paso</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Clases en vivo personalizadas con Teacher Cokitö</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onStartRegistration}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors"
            >
              Elegir Básico
            </button>
          </div>

        </div>

        {/* Highlighted Banner: Pase Digital Autónomo ($5/mes) */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 sm:p-7 text-white border border-slate-800 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full border border-amber-400/30 inline-flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" />
                Autoaprendizaje Autónomo
              </span>
              <span className="text-xs text-blue-200">Sin clases en vivo</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              ¿Prefieres estudiar a tu propio ritmo? Pase Digital Cokitö
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              Accede a los <strong>12 niveles completos</strong> de libros oficiales (SuperGoal y MegaGoal), audios nativos, quizzes autocorregibles del Cyber Owl y retos diarios con racha por solo <strong>$5 al mes</strong>.
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-2.5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="text-center sm:text-right">
                <span className="text-3xl font-black text-white">$5</span>
                <span className="text-[11px] text-blue-200 block">/ mes</span>
              </div>
              <button
                onClick={onOpenPaymentModal || onStartRegistration}
                className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-transform hover:scale-102 whitespace-nowrap"
              >
                Comenzar con Pase Digital
              </button>
            </div>

            {/* Badges de Métodos de Pago Solicitados */}
            <div className="pt-1 flex items-center justify-center sm:justify-end gap-2 flex-wrap">
              <span className="text-[10px] text-blue-200/80 font-bold uppercase tracking-wider block">
                Métodos de Pago:
              </span>

              {/* 1. Logo PayPal */}
              <div 
                onClick={onOpenPaymentModal}
                className="cursor-pointer flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-2 py-1 rounded-lg border border-white/15 transition-all text-white shadow-2xs"
                title="Pagar con PayPal o tarjeta internacional"
              >
                <svg className="w-3.5 h-3.5 text-[#0079C1] fill-current" viewBox="0 0 24 24">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.786.786 0 0 1 .775-.652h6.812c3.275 0 5.617 1.343 6.074 4.364.28 1.85-.246 3.447-1.565 4.747-1.34 1.32-3.23 2.012-5.618 2.012H8.818l-.946 5.99-.044.254a.64.64 0 0 1-.633.535l-.119.367zm2.493-9.068h1.853c2.25 0 3.79-.824 4.34-2.316.368-.997.23-1.927-.41-2.766-.63-.824-1.748-1.238-3.323-1.238H9.06l-1.49 8.32h2zm.12 7.068h2.008l1.09-6.9h-1.853l-1.245 6.9z" />
                </svg>
                <span className="font-black text-[11px] tracking-tight">PayPal</span>
              </div>

              {/* 2. Logo Pago Móvil */}
              <div 
                onClick={onOpenPaymentModal}
                className="cursor-pointer flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 px-2 py-1 rounded-lg border border-emerald-400/30 transition-all text-emerald-300 shadow-2xs"
                title="Pagar con Pago Móvil en Bolívares (Tasa BCV)"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold text-[11px]">Pago Móvil (Bs)</span>
              </div>

              {/* 3. Dólares en Efectivo */}
              <div 
                onClick={onOpenPaymentModal}
                className="cursor-pointer flex items-center gap-1.5 bg-amber-400/20 hover:bg-amber-400/30 px-2 py-1 rounded-lg border border-amber-400/30 transition-all text-amber-300 shadow-2xs"
                title="Pagar en Dólares en Efectivo ($ USD)"
              >
                <Banknote className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-[11px]">Dólares Efectivo ($)</span>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* 4. METHODOLOGY & GROWTH MINDSET PILLARS */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#2EC4B6] bg-[#2EC4B6]/10 px-2.5 py-0.5 rounded-full">
            Growth Mindset • Principios de Güakytopia
          </span>
          <h3 className="font-black text-[#243447] text-lg sm:text-xl">
            Progreso sobre Perfección. Práctica sobre Miedo.
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-[#2EC4B6]/15 text-[#2EC4B6] rounded-2xl flex items-center justify-center mx-auto text-xl">
              🌱
            </div>
            <h4 className="font-black text-[#243447] text-sm">Curiosidad sobre Vergüenza</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tu punto de partida no determina hasta dónde puedes llegar. Equivocarse es avanzar, descubrir y aprender.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 bg-[#FFD166]/25 text-[#FF9248] rounded-2xl flex items-center justify-center mx-auto text-xl">
              🪽
            </div>
            <h4 className="font-black text-[#243447] text-sm">Autonomía & Estructura</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Avanza a tu propio ritmo por los 12 Flights internacionales o acelera con clases y acompañamiento de tutores.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 bg-[#FF6B4A]/15 text-[#FF6B4A] rounded-2xl flex items-center justify-center mx-auto text-xl">
              🚀
            </div>
            <h4 className="font-black text-[#243447] text-sm">Tu Nivel de Hoy no es para Siempre</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Nunca etiquetamos. La práctica constante y el hábito diario desarrollan cualquier habilidad.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
