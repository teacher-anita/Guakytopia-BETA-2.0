import React, { useState } from 'react';
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
  Banknote,
  Gamepad2,
  Headphones,
  Trophy,
  Rocket,
  Target,
  MessageSquare
} from 'lucide-react';
import { AudienceTheme } from '../types';
import { MODULES_INFO } from '../data/curriculumData';
import { StudyThemeId } from './ThemeSelectorModal';
import { getThemeBannerClass } from '../utils/themeStyles';

interface LandingHeroProps {
  audienceTheme: AudienceTheme;
  onStartRegistration: () => void;
  onExploreCalendar: () => void;
  onExploreGamification: () => void;
  onOpenOptimizer: () => void;
  onOpenPaymentModal?: () => void;
  onOpenPricingModal?: () => void;
  onOpenGuakypedia?: () => void;
  studyTheme?: StudyThemeId;
}

const JUNIOR_WORLDS = [
  {
    world: 1,
    name: 'Neon Starter Park',
    subtitle: 'Rookie Explorer • Nivel 1 & 2',
    tagline: 'Pierde la pena y suelta la lengua 🌲',
    description: 'Aprende a presentarte, contar tus hobbies, describir a tus streamers favoritos y hablar sin miedo a equivocarte.',
    badge: '🌲 Parque Novato',
    color: 'from-emerald-500/10 to-teal-500/10 border-emerald-300 text-emerald-950',
    headerBg: 'bg-emerald-500 text-white',
    topics: ['Presentaciones y gustos', 'Hobbies, gaming y música', 'Preguntas cotidianas sin trabarse'],
    meta: 'Desbloquea: Insignia Rookie ⭐'
  },
  {
    world: 2,
    name: 'Cyber Gamer Zone',
    subtitle: 'Pro Player • Nivel 3 & 4',
    tagline: 'Discord, Twitch & Multiplayer Slang ⚡',
    description: 'Comunícate en partidas multijugador, entiende jerga nativa de gaming (clutch, no cap, nerf, buff) y coordina estrategias con amigos.',
    badge: '⚡ Zona Gamer',
    color: 'from-sky-500/10 to-indigo-500/10 border-sky-300 text-sky-950',
    headerBg: 'bg-sky-500 text-white',
    topics: ['Slang de Discord y chats', 'Estrategias de Minecraft & Roblox', 'Narrar partidas en tiempo real'],
    meta: 'Desbloquea: Insignia Squad Leader 🎧'
  },
  {
    world: 3,
    name: 'Creator Stage',
    subtitle: 'Content Master • Nivel 5 & 6',
    tagline: 'YouTube, TikTok & Storytelling 🎬',
    description: 'Crea contenido, haz reviews de películas y series en inglés, expresa opiniones con argumentos y narra historias épicas.',
    badge: '🎬 Escenario Creador',
    color: 'from-amber-500/10 to-orange-500/10 border-amber-300 text-amber-950',
    headerBg: 'bg-amber-500 text-white',
    topics: ['Reviews de películas y juegos', 'Debates divertidos y argumentos', 'Storytelling y podcasts cortos'],
    meta: 'Desbloquea: Insignia Pro Creator 🎙️'
  },
  {
    world: 4,
    name: 'Galaxy Legend',
    subtitle: 'World Champion • Nivel 7 & 8',
    tagline: 'Fluidez Total & Pensamiento Directo 👑',
    description: 'Habla fluidamente sin traducir en la mente. Prepárate para viajar, certificarte internacionalmente o estudiar en cualquier lugar del planeta.',
    badge: '👑 Leyenda Galáctica',
    color: 'from-purple-500/10 to-indigo-500/10 border-purple-300 text-purple-950',
    headerBg: 'bg-purple-600 text-white',
    topics: ['Fluidez conversacional 100%', 'Entrevistas y debates avanzados', 'Certificaciones internacionales'],
    meta: 'Desbloquea: Trofeo Galaxy Legend 🚀'
  }
];

export const LandingHero: React.FC<LandingHeroProps> = ({
  audienceTheme,
  onStartRegistration,
  onExploreCalendar,
  onExploreGamification,
  onOpenOptimizer,
  onOpenPaymentModal,
  onOpenPricingModal,
  onOpenGuakypedia,
  studyTheme = 'official'
}) => {
  const isKids = audienceTheme === 'kids';

  // Interactive Live Slang Mini-Challenge State (for exciting kids in live demo)
  const [slangAnswer, setSlangAnswer] = useState<number | null>(null);
  const [slangCelebration, setSlangCelebration] = useState(false);

  const handleSelectSlangAnswer = (index: number) => {
    setSlangAnswer(index);
    if (index === 1) {
      setSlangCelebration(true);
    }
  };

  return (
    <div className={`w-full space-y-8 animate-fadeIn pb-8 ${isKids ? 'font-fredoka' : ''}`}>
      
      {/* 1. HERO BANNER */}
      <section className={`relative overflow-hidden rounded-3xl p-6 sm:p-10 shadow-2xl border transition-all ${getThemeBannerClass(studyTheme, isKids)}`}>
        {/* Glows and particles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4 flex-1">
          
          <div className="flex flex-wrap items-center gap-2">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
              isKids 
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-amber-300 border border-purple-300/40 shadow-xs'
                : 'bg-amber-400 text-slate-950 shadow-sm'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isKids ? '🕹️ GÜAKYTOPIA (GUAKYTOPIA) JUNIOR 12+ • ARCADE EDITION' : 'GÜAKYTOPIA (GUAKYTOPIA) • CAMPUS DIGITAL'}</span>
            </div>
            <span className="text-xs text-teal-300 font-bold bg-teal-500/20 px-2.5 py-0.5 rounded-full border border-teal-400/30 hidden sm:inline">
              {isKids ? '⚡ Sube de nivel en inglés jugando' : 'McGraw Hill + Habit Lab'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            {isKids ? (
              <>
                ¡Sube de Nivel tu Inglés como un <span className="bg-gradient-to-r from-amber-300 via-pink-400 to-purple-300 bg-clip-text text-transparent">Pro Gamer</span>! ⚡🎮
              </>
            ) : (
              <>Bienvenido a Tu <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-teal-300 bg-clip-text text-transparent">Universo del Inglés</span>. Abrir el Mundo.</>
            )}
          </h1>

          <p className="text-amber-200 font-mono text-xs sm:text-sm tracking-wide">
            «Güakytopia (Guakytopia) • Open the World. Start where you are. Keep going.»
          </p>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
            {isKids ? (
              'Cero memorizaciones aburridas ni reglas de los años 90. Aprende a hablar con fluidez sobre lo que a ti te apasiona: gaming, Twitch, series, anime, creadores de contenido y cultura global con mentores que te escuchan.'
            ) : (
              'Una experiencia digital de aprendizaje: estructurada, flexible, humana y con personalidad. 12 niveles progresivos, micro-bloques sin fatiga cognitiva, laboratorio de conversación oral y clases con tutores.'
            )}
          </p>

          {/* Core Feature Badges */}
          {isKids ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-purple-400/30 text-xs">
                <span className="block font-black text-amber-300 text-sm">🔥 Racha & XP</span>
                <span className="text-purple-100 text-[11px]">Gana insignias, gemas y cofres semanales</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-purple-400/30 text-xs">
                <span className="block font-black text-cyan-300 text-sm">🎧 Squad Voice</span>
                <span className="text-purple-100 text-[11px]">Sesiones 1 a 1 y Dúos con tus mentores</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-purple-400/30 text-xs col-span-2 sm:col-span-1">
                <span className="block font-black text-emerald-300 text-sm">🗺️ 4 Mundos Épicos</span>
                <span className="text-purple-100 text-[11px]">De Rookie Explorer a Galaxy Legend</span>
              </div>
            </div>
          ) : (
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
          )}

          {/* INTERACTIVE MINI SLANG QUEST (Only in Junior mode, for live demo engagement) */}
          {isKids && (
            <div className="bg-slate-900/80 border-2 border-amber-400/60 rounded-2xl p-4 space-y-3 backdrop-blur-md shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
                  <Gamepad2 className="w-4 h-4 text-amber-400 animate-bounce" />
                  Mini-Misión en Vivo: ¿Qué significa este Slang?
                </span>
                <span className="bg-amber-400/20 text-amber-300 text-[11px] font-black px-2 py-0.5 rounded-full border border-amber-400/30">
                  +25 XP
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 font-medium">
                Tu amigo en Discord te escribe en plena partida: <strong className="text-cyan-300">"Bro, that move was pure GOAT!"</strong> ¿Qué te quiso decir?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => handleSelectSlangAnswer(0)}
                  className={`text-left p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    slangAnswer === 0 
                      ? 'bg-red-500/20 border-red-400 text-red-200' 
                      : 'bg-white/5 border-white/15 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <span>A) "Que tu jugada fue una cabra" 🐐</span>
                </button>
                <button
                  onClick={() => handleSelectSlangAnswer(1)}
                  className={`text-left p-2.5 rounded-xl border text-xs font-black transition-all ${
                    slangAnswer === 1 
                      ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400' 
                      : 'bg-white/5 border-white/15 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <span>B) "¡El Mejor de Todos los Tiempos!" ⭐</span>
                </button>
                <button
                  onClick={() => handleSelectSlangAnswer(2)}
                  className={`text-left p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    slangAnswer === 2 
                      ? 'bg-red-500/20 border-red-400 text-red-200' 
                      : 'bg-white/5 border-white/15 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <span>C) "Que el juego se congeló" ❄️</span>
                </button>
              </div>

              {slangCelebration && (
                <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-xl flex items-center justify-between text-xs text-emerald-200 font-bold animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🎉</span>
                    <span>¡Correcto! GOAT = <strong>Greatest Of All Time</strong>. ¡Ganaste +25 XP!</span>
                  </div>
                  <button
                    onClick={onExploreGamification}
                    className="text-[11px] underline text-amber-300 hover:text-white"
                  >
                    Ver en la Arena ➔
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 flex-wrap">
            <button
              onClick={onStartRegistration}
              className={`px-8 py-4 rounded-2xl font-black text-sm shadow-lg transition-transform hover:scale-102 flex items-center justify-center gap-2 ${
                isKids 
                  ? 'btn-game-3d btn-game-yellow text-slate-950 font-black text-base'
                  : 'bg-[#2EC4B6] hover:bg-[#259C90] text-[#18232F]'
              }`}
            >
              <span>{isKids ? '¡Comenzar Mi Misión Gratis! 🕹️' : 'Hacer Prueba Diagnóstica (50 Preguntas)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {onOpenPricingModal && (
              <button
                onClick={onOpenPricingModal}
                className={`px-6 py-4 rounded-2xl font-black text-sm shadow-lg transition-transform hover:scale-102 flex items-center justify-center gap-2 ${
                  isKids
                    ? 'btn-game-3d btn-game-emerald text-white'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
                }`}
              >
                <span>{isKids ? '💳 Ver Packs de Aventura & Precios' : '💳 Ver Tarifas & Calculadora ($4.99 Promo)'}</span>
              </button>
            )}
            <button
              onClick={onExploreCalendar}
              className={`px-6 py-4 rounded-2xl font-bold text-sm backdrop-blur-md border transition-all flex items-center justify-center gap-2 ${
                isKids
                  ? 'btn-game-3d bg-white/20 hover:bg-white/30 text-white border-white/30'
                  : 'bg-white/15 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              <Calendar className="w-4 h-4 text-[#FFD166]" />
              <span>{isKids ? '📅 Misiones en Vivo & Horarios' : 'Ver Horarios & Flights'}</span>
            </button>
            {onOpenGuakypedia && (
              <button
                onClick={onOpenGuakypedia}
                className="px-6 py-4 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 shadow-lg transition-transform hover:scale-102 flex items-center justify-center gap-2"
                title="Abrir Güakypedia • Guía Oficial de Güakytopia"
              >
                <BookOpen className="w-4 h-4" />
                <span>🧭 Güakypedia Oficial</span>
              </button>
            )}
          </div>

          </div>

          {/* Mascot Feature Spotlight Card */}
          <div className={`shrink-0 flex flex-col items-center justify-center relative p-5 rounded-3xl shadow-xl max-w-xs text-center ${
            isKids 
              ? 'bg-gradient-to-b from-purple-800/40 via-indigo-900/60 to-slate-900/80 border-2 border-amber-400/40 shadow-purple-900/50'
              : 'bg-white/10 backdrop-blur-md border border-white/20'
          }`}>
            {isKids && (
              <div className="absolute -top-3 bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                ⭐ Mentor Güaky Nivel 10
              </div>
            )}
            <div className="w-48 h-56 sm:w-56 sm:h-64 flex items-center justify-center relative drop-shadow-2xl hover:scale-105 transition-transform duration-300">
              <img 
                src="/guaky-mascota.png" 
                alt="Güaky" 
                className="w-full h-full object-contain filter drop-shadow-md" 
                onError={(e) => {
                  e.currentTarget.style.visibility = 'hidden';
                }}
              />
            </div>
            <div className="mt-2 space-y-0.5">
              <span className="text-xs font-black text-[#FFD166] uppercase tracking-wider block">
                {isKids ? '¡Güaky Gamer & Explorer! 🦜🎧' : '¡Hola, soy Güaky! 🦜'}
              </span>
              <p className="text-[11px] text-teal-100 font-medium">
                {isKids 
                  ? 'Tu compañero de partidas y misiones en inglés. ¡Cero vergüenza aquí!'
                  : 'Tu compañero con morral listo para explorar el inglés sin miedo.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE MODULES / JUNIOR WORLDS OVERVIEW */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
            isKids
              ? 'text-purple-700 bg-purple-100 border-purple-200'
              : 'text-[#2EC4B6] bg-[#2EC4B6]/10 border-[#2EC4B6]/20'
          }`}>
            {isKids ? '🗺️ MAPA DE AVENTURA • 4 MUNDOS ÉPICOS' : 'Currículo Estructurado • 12 Flights de Transformación'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#243447] tracking-tight">
            {isKids ? 'Los 4 Mundos de Aventura de Güakytopia' : 'Los 4 Módulos de Güakytopia'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isKids 
              ? 'Un recorrido diseñado como un RPG donde cada mundo desbloquea nuevas habilidades, vocabulario gamer y fluidez para hablar con el mundo.'
              : 'Un recorrido progresivo y organizado para saber qué aprender y hacia dónde avanzar.'}
          </p>
        </div>

        {isKids ? (
          /* JUNIOR 4 WORLDS CARDS */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {JUNIOR_WORLDS.map(w => (
              <div
                key={w.world}
                className={`bg-white rounded-3xl border-2 p-6 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between space-y-4 relative ${w.color}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-xl font-black text-xs shadow-xs ${w.headerBg}`}>
                      Mundo {w.world}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 bg-white/80 px-2 py-0.5 rounded-full border border-slate-200">
                      {w.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-black text-slate-900 text-lg">{w.name}</h3>
                    <p className="text-xs font-bold text-indigo-600 mt-0.5">{w.tagline}</p>
                    <span className="text-[10px] font-black text-slate-400 block mt-0.5 uppercase tracking-wider">{w.subtitle}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {w.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Misiones clave:</span>
                    <ul className="text-xs font-medium text-slate-700 space-y-1">
                      {w.topics.map((t, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-[11px]">
                          <span className="text-emerald-500">✔</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2 text-xs font-black text-indigo-700 flex items-center gap-1 bg-white/80 p-2 rounded-xl border border-slate-200">
                  <span>{w.meta}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ADULT STANDARD MODULES */
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
        )}
      </section>

      {/* 3. TRANSPARENT PRICING & PLANS (JUNIOR SQUAD PACKS VS ADULT FORMAL PLANS) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
            isKids
              ? 'text-amber-800 bg-amber-50 border-amber-300'
              : 'text-emerald-800 bg-emerald-50 border-emerald-200'
          }`}>
            {isKids ? '⚡ PACKS DE ENTRENAMIENTO JUNIOR' : 'Inversión Clara & Pensum Internacional'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isKids ? 'Elige tu Modalidad de Juego' : 'Planes Diseñados Para Tu Rutina'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isKids 
              ? 'Desde el Pase Digital para jugar y practicar en la Arena, hasta sesiones en vivo con tu squad o tu mentor 1 a 1.'
              : 'Elige el ritmo que mejor se adapte a tus metas: desde el autoaprendizaje digital hasta la inmersión acelerada récord con el Nivel Express.'}
          </p>
        </div>

        {/* 4 Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Plan 1: Express / Battle Pass Express */}
          <div className="bg-gradient-to-b from-amber-500/10 via-white to-white rounded-3xl border-2 border-amber-400 p-5 sm:p-6 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-4 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs whitespace-nowrap">
              {isKids ? '⚡ Battle Pass Express • 4 Semanas' : '⚡ Nivel Express • ¡4 Semanas!'}
            </span>

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  6 h / semana
                </span>
                <Zap className="w-4 h-4 text-amber-500 fill-amber-400" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {isKids ? 'Battle Pass Acelerado' : 'Súper Intensivo Express'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isKids ? 'Para subir de rango a la velocidad de la luz' : 'Máxima aceleración y fluidez récord'}
                </p>
              </div>

              <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200/80 text-xs">
                <span className="text-[10px] uppercase font-bold text-amber-800 block">
                  {isKids ? 'Duración de Nivel:' : 'Duración Nivel SuperGoal:'}
                </span>
                <strong className="text-amber-950 font-black text-sm">¡Solo 1 mes (4 semanas)!</strong>
                <span className="text-[10px] text-slate-500 block mt-0.5">3 sesiones semanales en vivo</span>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isKids ? 'Inmersión total para hablar sin pena' : 'Ideal para viajes urgentes o entrevistas laborales'}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isKids ? 'Sesiones 1 a 1 de alta energía' : 'Atención 1 a 1 o en Dúo de alta intensidad'}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isKids ? 'Feedback continuo por WhatsApp de Teacher Cokitö' : 'Feedback continuo directo por WhatsApp de La Teacher'}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onStartRegistration}
              className={`w-full py-2.5 px-4 rounded-xl font-black text-xs shadow-md transition-transform hover:scale-102 flex items-center justify-center gap-1.5 ${
                isKids 
                  ? 'btn-game-3d btn-game-yellow text-slate-950'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
              }`}
            >
              <span>{isKids ? 'Elegir Battle Pass' : 'Elegir Nivel Express'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Plan 2: Intensivo / Squad Dúo */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 sm:p-6 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  4 h / semana
                </span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {isKids ? 'Gamer Squad (Dúo)' : 'Plan Intensivo'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isKids ? 'Inscríbete con tu mejor amigo o hermano' : 'Para quienes llevan prisa y foco'}
                </p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Duración de Nivel:</span>
                <strong className="text-slate-900 font-black text-sm">6 semanas (1.5 meses)</strong>
                <span className="text-[10px] text-slate-500 block mt-0.5">2 sesiones de 120 min</span>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isKids ? 'Practica conversaciones en pareja divertida' : 'Progreso acelerado con inmersión constante'}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isKids ? 'Descuento especial por alumno al venir en Dúo' : 'Preparación para exámenes y certificaciones'}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isKids ? 'Retos cooperativos en la Arena Güaky' : 'Práctica conversacional y debates activos'}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onStartRegistration}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow-md transition-colors ${
                isKids
                  ? 'btn-game-3d btn-game-teal text-slate-950 font-black'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {isKids ? 'Unirme en Squad' : 'Elegir Intensivo'}
            </button>
          </div>

          {/* Plan 3: Regular / Solo Quest VIP */}
          <div className="bg-white rounded-3xl border-2 border-purple-500 p-5 sm:p-6 shadow-md relative flex flex-col justify-between space-y-4">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs whitespace-nowrap">
              {isKids ? '⭐ Más Popular' : '⭐ Más Recomendado'}
            </span>

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full">
                  3 h / semana
                </span>
                <Star className="w-4 h-4 text-purple-600 fill-purple-600" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {isKids ? 'Solo Quest VIP' : 'Plan Regular'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isKids ? 'Mentor dedicado solo para ti y a tu ritmo' : 'Equilibrio perfecto de ritmo y retención'}
                </p>
              </div>

              <div className="p-2.5 bg-purple-50/70 rounded-xl border border-purple-200/80 text-xs">
                <span className="text-[10px] uppercase font-bold text-purple-800 block">Duración de Nivel:</span>
                <strong className="text-purple-950 font-black text-sm">8 semanas (2 meses)</strong>
                <span className="text-[10px] text-slate-500 block mt-0.5">2 sesiones de 90 min</span>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isKids ? 'Temas adaptados a tus gustos y juegos' : 'La fórmula dorada: máxima retención sin sobrecarga'}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isKids ? 'Confianza total para preguntar sin pena' : 'Disponible en modalidad Individual o Parejas'}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isKids ? 'Acceso VIP al Classroom y audios nativos' : 'Acceso permanente al Classroom y libro'}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onStartRegistration}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow-md transition-colors ${
                isKids
                  ? 'btn-game-3d btn-game-purple text-white font-black'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isKids ? 'Elegir Solo Quest' : 'Elegir Regular'}
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
                <h3 className="text-lg font-black text-slate-900">
                  {isKids ? 'Chill Explorer' : 'Súper Básico'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isKids ? 'Constante, relajado y sin tareas pesadas' : 'Constante, relajado y sin estrés'}
                </p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Duración de Nivel:</span>
                <strong className="text-slate-900 font-black text-sm">12 semanas (3 meses)</strong>
                <span className="text-[10px] text-slate-500 block mt-0.5">2 sesiones de 60 min</span>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isKids ? 'Ideal si tienes muchas clases en el colegio' : 'Diseñado para agendas muy ocupadas'}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isKids ? 'Avanzas a tu propio ritmo sin agobios' : 'Avanza sin presión paso a paso'}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isKids ? 'Práctica con Teacher Cokitö' : 'Clases en vivo personalizadas con Teacher'}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onStartRegistration}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-colors ${
                isKids
                  ? 'btn-game-3d btn-game-emerald text-white font-black'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              {isKids ? 'Elegir Chill Explorer' : 'Elegir Básico'}
            </button>
          </div>

        </div>

        {/* Highlighted Banner: Pase Digital Autónomo ($5/mes) */}
        <div className={`rounded-3xl p-6 sm:p-7 text-white border shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 ${
          isKids
            ? 'bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 border-purple-500/40'
            : 'bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 border-slate-800'
        }`}>
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-xs font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full border border-amber-400/30 inline-flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" />
                {isKids ? '🎮 Pase Arcade Autónomo' : 'Autoaprendizaje Autónomo'}
              </span>
              <span className="text-xs text-blue-200">{isKids ? 'Solo minijuegos y práctica digital' : 'Sin clases en vivo'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              {isKids 
                ? '¿Quieres practicar a tu propio ritmo? Pase Digital Arcade'
                : '¿Prefieres estudiar a tu propio ritmo? Pase Digital Cokitö'}
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              {isKids
                ? 'Accede a los 12 niveles con audios nativos, quizzes interactivos de Güaky, desafíos diarios y retos de racha por solo $4.99 al mes.'
                : 'Accede a los 12 niveles completos de libros oficiales (SuperGoal y MegaGoal), audios nativos, quizzes autocorregibles de Güaky y retos diarios con racha por solo $4.99 al mes.'}
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-2.5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="text-center sm:text-right">
                <span className="text-3xl font-black text-amber-300">$4.99</span>
                <span className="text-[11px] text-blue-200 block">/ mes</span>
              </div>
              <button
                onClick={onOpenPaymentModal || onStartRegistration}
                className={`px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-transform hover:scale-102 whitespace-nowrap ${
                  isKids
                    ? 'btn-game-3d btn-game-yellow text-slate-950'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                }`}
              >
                {isKids ? '¡Activar Pase Arcade!' : 'Comenzar con Pase Digital'}
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
          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
            isKids ? 'text-purple-700 bg-purple-100' : 'text-[#2EC4B6] bg-[#2EC4B6]/10'
          }`}>
            {isKids ? '🎮 REGLAS DEL JUEGO • GÜAKYTOPIA JUNIOR' : 'Growth Mindset • Principios de Güakytopia'}
          </span>
          <h3 className="font-black text-[#243447] text-lg sm:text-xl">
            {isKids 
              ? 'No pierdes vidas al equivocarte: ganas Experiencia (XP) 🚀' 
              : 'Progreso sobre Perfección. Práctica sobre Miedo.'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto text-xl shadow-xs">
              {isKids ? '🕹️' : '🌱'}
            </div>
            <h4 className="font-black text-[#243447] text-sm">
              {isKids ? 'Cero Vergüenza ni Exámenes Aburridos' : 'Curiosidad sobre Vergüenza'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isKids 
                ? 'Aquí nadie se burla ni te juzga. Hablamos en confianza como si estuviéramos en Discord jugando con amigos.'
                : 'Tu punto de partida no determina hasta dónde puedes llegar. Equivocarse es avanzar, descubrir y aprender.'}
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto text-xl shadow-xs">
              {isKids ? '🏆' : '🪽'}
            </div>
            <h4 className="font-black text-[#243447] text-sm">
              {isKids ? 'Insignias, Niveles y Rachas' : 'Autonomía & Estructura'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isKids
                ? 'Cada reto superado te premia con gemas, sube tu nivel y te da acceso a mundos más épicos.'
                : 'Avanza a tu propio ritmo por los 12 Flights internacionales o acelera con clases y acompañamiento de tutores.'}
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto text-xl shadow-xs">
              {isKids ? '🎧' : '🚀'}
            </div>
            <h4 className="font-black text-[#243447] text-sm">
              {isKids ? 'Mentores Jóvenes y Cercanos' : 'Tu Nivel de Hoy no es para Siempre'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isKids
                ? 'Profesores que entienden tu mundo: hablan de tus streamers favoritos, música, series y videojuegos.'
                : 'Nunca etiquetamos. La práctica constante y el hábito diario desarrollan cualquier habilidad.'}
            </p>
          </div>
        </div>
      </section>

      {/* 9. FINAL ENROLLMENT CTA (Inscripción directa al final de la página principal) */}
      <section className={`rounded-3xl p-6 sm:p-10 border shadow-2xl relative overflow-hidden transition-all text-center ${getThemeBannerClass(studyTheme, isKids)}`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-sm mx-auto">
            <span>✨ Comienza Tu Aventura Hoy</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            {isKids ? '¿Listo para Subir de Nivel en Inglés? 🚀' : 'Inscríbete y Abre las Puertas del Mundo'}
          </h2>

          <p className="text-amber-200 font-mono text-xs sm:text-sm">
            «Open the World. Start where you are. Keep going.»
          </p>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
            {isKids
              ? 'Realiza tu prueba diagnóstica gamificada sin costo, descubre tu nivel y empieza a practicar con Teacher Cokitö y la comunidad de Güakytopia.'
              : 'Elige tu plan, haz tu prueba diagnóstica de 50 preguntas y recibe tu diagnóstico personalizado para iniciar tu ruta de fluidez.'}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onStartRegistration}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black rounded-2xl text-sm transition-transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
            >
              <span>{isKids ? '¡Inscribirme y Jugar Gratis! 🎮' : 'Inscribirme y Realizar Prueba Diagnóstica'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onOpenPricingModal && (
              <button
                onClick={onOpenPricingModal}
                className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-2xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Ver Planes y Tarifas</span>
              </button>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};
