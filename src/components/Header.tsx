import React from 'react';
import { 
  Home, 
  BookOpen, 
  Calendar, 
  Zap, 
  Flame, 
  Lock, 
  KeyRound, 
  GraduationCap, 
  Sparkles, 
  User as UserIcon,
  Palette,
  CreditCard,
  LogIn
} from 'lucide-react';
import { User } from 'firebase/auth';
import { AudienceTheme, Student, StaffRole } from '../types';
import { GuakyLogo } from './GuakyLogo';
import { StudyThemeId } from './ThemeSelectorModal';
import { getThemeHeaderClass } from '../utils/themeStyles';

interface HeaderProps {
  user: User | null;
  isTeacherAuthenticated: boolean;
  staffRole?: StaffRole | null;
  onTeacherLogout: () => void;
  audienceTheme: AudienceTheme;
  onAudienceChange: (theme: AudienceTheme) => void;
  onLogin: () => void;
  onLogout: () => void;
  isLoggingIn: boolean;
  onOpenOptimizer: () => void;
  onOpenCouponModal: () => void;
  onOpenThemeModal?: () => void;
  onOpenPricingModal?: () => void;
  onOpenGuakypack?: () => void;
  onOpenProfile: () => void;
  currentStudentXp: number;
  currentStudentStreak: number;
  currentStudent: Student | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  allStudents: Student[];
  onSelectStudent: (studentId: string) => void;
  studyTheme?: StudyThemeId;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  isTeacherAuthenticated,
  staffRole,
  onTeacherLogout,
  audienceTheme,
  onAudienceChange,
  onLogin,
  onLogout,
  isLoggingIn,
  onOpenOptimizer,
  onOpenCouponModal,
  onOpenThemeModal,
  onOpenPricingModal,
  onOpenGuakypack,
  onOpenProfile,
  currentStudentXp,
  currentStudentStreak,
  currentStudent,
  activeTab,
  onTabChange,
  allStudents,
  onSelectStudent,
  studyTheme = 'official'
}) => {
  const isKids = audienceTheme === 'kids';
  const isEnrolled = isTeacherAuthenticated || (currentStudent && currentStudent.status === 'enrolled');
  const isUserLoggedIn = Boolean(user || isTeacherAuthenticated || (currentStudent && currentStudent.id !== 'guest'));
  const isStudentLoggedIn = Boolean((user && !isTeacherAuthenticated) || (currentStudent && currentStudent.status === 'enrolled' && !isTeacherAuthenticated));

  return (
    <>
      {/* Top Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b shadow-2xs transition-colors duration-200 ${getThemeHeaderClass(studyTheme)}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          
          {/* Row 1: Brand & Top Actions (Guaranteed 100% visible, never escapes on the right) */}
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
            
            {/* Logo & Güakytopia Brand */}
            <button
              onClick={() => onTabChange('landing')}
              className="flex items-center gap-2 text-left focus:outline-hidden shrink-0 min-w-0"
              title="Güakytopia • Open the World"
            >
              <GuakyLogo size="sm" showSubtitle={true} />
            </button>

            {/* Right Action Cluster - Strict Strategic Order */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              {/* 1. TARIFAS & PAGOS BUTTON */}
              {onOpenPricingModal && (
                <button
                  onClick={onOpenPricingModal}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 rounded-xl text-xs font-black transition-all shadow-2xs"
                  title="Ver Tarifas, Planes y Calculadora de Precios"
                >
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Tarifas & Pagos</span>
                  <span className="sm:hidden">Precios</span>
                </button>
              )}

              {/* 2. BECA / CÓDIGO BUTTON */}
              <button
                onClick={onOpenCouponModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-all shadow-2xs"
                title="Canjear código de cortesía o beca"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Beca</span>
              </button>

              {/* 3. AUDIENCE THEME TOGGLE: Junior (JR 🚀) FIRST, then Adult (Graduation Cap) in dark tone */}
              <div className="flex bg-slate-100 p-0.5 rounded-xl items-center text-xs font-bold border border-slate-200/90 shadow-2xs">
                {/* Junior first */}
                <button
                  onClick={() => onAudienceChange('kids')}
                  className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg transition-all ${
                    isKids
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs font-black'
                      : 'text-slate-600 hover:text-purple-700'
                  }`}
                  title="Modo Junior 12+ (Arcade, Desafíos & Aventura)"
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span className="text-[11px] font-black">JR 🚀</span>
                </button>

                {/* Adult second */}
                <button
                  onClick={() => onAudienceChange('adults')}
                  className={`flex items-center justify-center p-1.5 rounded-lg transition-all ${
                    !isKids
                      ? 'bg-[#243447] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Modo Adulto (Currículo Profesional)"
                  aria-label="Modo Adulto"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 4. TEACHER LOGIN BUTTON: Solo el candadito para staff */}
              <button
                onClick={() => onTabChange('teacher')}
                className={`flex items-center justify-center p-2 rounded-xl text-xs font-black transition-all shadow-2xs border ${
                  activeTab === 'teacher'
                    ? staffRole === 'principal'
                      ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xs ring-2 ring-amber-400/50'
                      : 'bg-indigo-900 text-amber-300 border-indigo-700 shadow-xs ring-2 ring-indigo-400/50'
                    : isTeacherAuthenticated
                      ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border-indigo-300'
                      : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-slate-800'
                }`}
                title={isTeacherAuthenticated ? (staffRole === 'principal' ? "Rectoría General" : "Panel de Teacher Cokitö") : "Portal Docente / Staff"}
                aria-label="Portal Docente"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              </button>

              {/* LOGGED IN USER EXPERIENCE: Solo visible para usuarios / alumnos con sesión activa */}
              {isUserLoggedIn ? (
                <>
                  {/* 5. AMBIENTE DE ESTUDIO ICON */}
                  {onOpenThemeModal && (
                    <button
                      onClick={onOpenThemeModal}
                      className="flex items-center justify-center p-2 bg-[#FFF9F0] hover:bg-[#FFEECB] text-[#243447] border border-[#FFD166] rounded-xl text-xs font-bold transition-all shadow-2xs"
                      title="Personalizar ambiente de estudio (Bajo estímulo, Modo Oscuro TDAH, Pasteles)"
                      aria-label="Ambiente de estudio"
                    >
                      <Palette className="w-3.5 h-3.5 text-[#2EC4B6]" />
                    </button>
                  )}

                  {/* 6. GÜAKYPACK BUTTON (Backpack 🎒) */}
                  {onOpenGuakypack && (
                    <button
                      onClick={onOpenGuakypack}
                      className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-950 border border-amber-300 rounded-xl text-xs font-black transition-all shadow-2xs group"
                      title="Abrir Güakypack • Horas, Escudos y Premios de Cokitö's League"
                      aria-label="Abrir Güakypack"
                    >
                      <span className="text-sm group-hover:scale-125 transition-transform">🎒</span>
                      <span className="hidden sm:inline text-[11px] font-black">Pack</span>
                    </button>
                  )}

                  {/* 7. Gamification badge: Racha + XP */}
                  <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-50 border border-slate-200/80 px-2 sm:px-2.5 py-1 rounded-xl text-xs">
                    <div className="flex items-center gap-0.5 text-orange-600 font-bold" title="Racha activa de días">
                      <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                      <span>{currentStudentStreak}</span>
                    </div>
                    <span className="text-slate-300">|</span>
                    <div className="flex items-center gap-0.5 text-emerald-600 font-bold" title="Puntos XP Cokitö">
                      <Zap className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                      <span>{currentStudentXp}</span>
                    </div>
                  </div>

                  {/* 8. Profile / Avatar Button con foto o inicial */}
                  {currentStudent ? (
                    <button
                      onClick={onOpenProfile}
                      className="flex items-center gap-1.5 p-0.5 sm:p-1 hover:bg-slate-100 rounded-xl transition-colors focus:outline-hidden"
                      title={`Perfil activo: ${currentStudent.name} (Toca para ver tu cuenta)`}
                    >
                      <img
                        src={currentStudent.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${currentStudent.name}`}
                        alt={currentStudent.name}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-emerald-400 object-cover shadow-2xs"
                      />
                      <span className="hidden md:inline text-xs font-black text-slate-800 max-w-[90px] truncate">
                        {currentStudent.name.split(' ')[0]}
                      </span>
                    </button>
                  ) : user ? (
                    <button
                      onClick={onOpenProfile}
                      className="flex items-center p-0.5 sm:p-1 hover:bg-slate-100 rounded-xl transition-colors focus:outline-hidden"
                      title="Ver mi perfil"
                    >
                      <img
                        src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || user.email}`}
                        alt={user.displayName || 'Usuario'}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-300 object-cover"
                      />
                    </button>
                  ) : (
                    <button
                      onClick={onOpenProfile}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow-xs transition-all active:scale-95"
                      title="Iniciar sesión en tu cuenta"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Iniciar Sesión</span>
                    </button>
                  )}

                  {/* Teacher Logout si está autenticado */}
                  {isTeacherAuthenticated && (
                    <button
                      onClick={onTeacherLogout}
                      className="hidden md:flex items-center gap-1 px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-[11px] font-bold transition-colors"
                      title="Cerrar sesión de Teacher"
                    >
                      <Lock className="w-3 h-3 text-red-500" />
                      <span>Salir</span>
                    </button>
                  )}
                </>
              ) : (
                /* VISITOR EXPERIENCE: Sin ruido, botón directo de Iniciar Sesión */
                <button
                  onClick={onOpenProfile}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2EC4B6] hover:bg-[#259C90] text-slate-950 font-black rounded-xl text-xs shadow-xs transition-all hover:scale-102"
                  title="Iniciar sesión o registrarme en Güakytopia"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Iniciar Sesión</span>
                  <span className="sm:hidden">Entrar</span>
                </button>
              )}

            </div>
          </div>

          {/* Row 2: Unified Navigation Bar with Exact Pedagogical Flow */}
          <div className="hidden md:flex items-center justify-center border-t border-slate-100 py-1.5 overflow-x-auto no-scrollbar">
            <nav className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl text-xs font-semibold text-slate-600 shadow-2xs border border-slate-200/50">
              
              {/* 1. Güakypedia • Guía Oficial & Políticas (Público / Abierto a todos) */}
              <button
                onClick={() => onTabChange('guakypedia')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'guakypedia'
                    ? isKids
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-xs font-black'
                      : 'bg-white text-indigo-700 shadow-xs font-black ring-1 ring-indigo-400/40'
                    : 'hover:text-slate-900 hover:bg-white/60'
                }`}
                title="Güakypedia • Enciclopedia, Políticas y Guía Oficial"
              >
                <span className="text-sm">🧭</span>
                <span>Güakypedia</span>
                <span className="text-[9px] bg-indigo-600 text-white font-bold px-1 rounded-full hidden lg:inline">Doc</span>
              </button>

              {/* 2. Home / Aventura (Público / Abierto a todos) */}
              <button
                onClick={() => onTabChange('landing')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'landing'
                    ? isKids 
                      ? 'bg-purple-600 text-white shadow-xs font-black' 
                      : 'bg-white text-[#2EC4B6] shadow-xs font-black ring-1 ring-slate-200/80'
                    : 'hover:text-slate-900 hover:bg-white/60'
                }`}
                title="Página principal de inicio"
              >
                <span className="text-sm">🏠</span>
                <span>{isKids ? 'Aventura' : 'Home'}</span>
              </button>

              {/* 3. Arena / Arcade & Daily Quests (Público / Abierto a todos) */}
              <button
                onClick={() => onTabChange('duolingo')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'duolingo'
                    ? isKids
                      ? 'bg-emerald-500 text-white shadow-xs font-black'
                      : 'bg-white text-emerald-600 shadow-xs font-black ring-1 ring-slate-200/80'
                    : 'hover:text-slate-900 hover:bg-white/60'
                }`}
                title="The Flock Arena • Daily Quests, Cokitö's League y Where's Güaky"
              >
                <span className="text-sm">{isKids ? '🎮' : '🌴'}</span>
                <span>{isKids ? 'Arcade' : 'Arena'}</span>
              </button>

              {/* Divisor visual sutil entre secciones abiertas y académicas */}
              <div className="h-4 w-px bg-slate-300 mx-1" />

              {/* 4. Hub / Mapa Mundos (12 Niveles McGraw Hill) */}
              <button
                onClick={() => onTabChange('pathway')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'pathway'
                    ? isKids
                      ? 'bg-indigo-600 text-white shadow-xs font-black'
                      : 'bg-white text-[#243447] shadow-xs font-black ring-1 ring-slate-200/80'
                    : 'hover:text-slate-900 hover:bg-white/60'
                }`}
                title="Learning Pathway • 12 Niveles de McGraw Hill"
              >
                <span className="text-sm">🗺️</span>
                <span>{isKids ? 'Mundos' : 'Hub'}</span>
                {!isEnrolled && (
                  <Lock className="w-3 h-3 text-amber-500 shrink-0 ml-0.5" />
                )}
              </button>

              {/* 5. Classroom (Aula Interactiva de 8 Fases) */}
              <button
                onClick={() => onTabChange('classroom')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'classroom'
                    ? 'bg-white text-[#2EC4B6] shadow-xs font-black ring-1 ring-[#2EC4B6]/40'
                    : 'hover:text-slate-900 hover:bg-white/60'
                }`}
                title="Classroom • Aula interactiva con lección de 8 fases"
              >
                <span className="text-sm">📖</span>
                <span>Classroom</span>
                {!isEnrolled && (
                  <Lock className="w-3 h-3 text-amber-500 shrink-0 ml-0.5" />
                )}
              </button>

              {/* 6. Lab (Language Practice Lab • 100 Drills) */}
              <button
                onClick={() => onTabChange('lab')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'lab'
                    ? 'bg-white text-[#2EC4B6] shadow-xs font-black ring-1 ring-slate-200/80'
                    : 'hover:text-slate-900 hover:bg-white/60'
                }`}
                title="Language Practice Lab • 100 Drills por unidad"
              >
                <span className="text-sm">🧪</span>
                <span>Lab</span>
                {!isUserLoggedIn ? (
                  <Lock className="w-3 h-3 text-amber-500 shrink-0 ml-0.5" />
                ) : (
                  <span className="bg-[#2EC4B6]/20 text-[#2EC4B6] text-[10px] font-black px-1.5 py-0.2 rounded-full">
                    100
                  </span>
                )}
              </button>

              {/* 7. Schedule / Agenda (Horarios & Misiones) */}
              <button
                onClick={() => onTabChange('calendar')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'calendar'
                    ? isKids
                      ? 'bg-sky-500 text-white shadow-xs font-black'
                      : 'bg-white text-[#243447] shadow-xs font-black ring-1 ring-slate-200/80'
                    : 'hover:text-slate-900 hover:bg-white/60'
                }`}
                title="Schedule • Horarios de clase y sesiones en vivo"
              >
                <span className="text-sm">📅</span>
                <span>{isKids ? 'Misiones' : 'Schedule'}</span>
              </button>

              {/* 8. Library (Academic Library • Libros, Audios y Workbooks) */}
              <button
                onClick={() => onTabChange('library')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'library'
                    ? 'bg-white text-indigo-600 shadow-xs font-black ring-1 ring-indigo-400/40'
                    : 'hover:text-slate-900 hover:bg-white/60'
                }`}
                title="Academic Library • Libros oficiales, Student Books y Audios"
              >
                <span className="text-sm">📚</span>
                <span>Library</span>
                {!isEnrolled && (
                  <Lock className="w-3 h-3 text-amber-500 shrink-0 ml-0.5" />
                )}
              </button>

            </nav>
          </div>

        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION BAR (Exact Matching Sequence) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl px-1 py-1 flex md:hidden items-center justify-around pb-safe">
        <div className="w-full max-w-lg mx-auto flex items-center justify-around">
          
          {/* 1. Güakypedia (Guía) */}
          <button
            onClick={() => onTabChange('guakypedia')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all flex-1 min-w-0 max-w-[44px] ${
              activeTab === 'guakypedia'
                ? 'text-indigo-700 font-black bg-indigo-50 scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="text-sm">🧭</span>
            <span className="text-[9px] leading-tight truncate w-full text-center mt-0.5 font-bold">
              Guía
            </span>
          </button>

          {/* 2. Home / Aventura */}
          <button
            onClick={() => onTabChange('landing')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all flex-1 min-w-0 max-w-[44px] ${
              activeTab === 'landing'
                ? isKids
                  ? 'text-purple-600 font-black bg-purple-50 scale-105'
                  : 'text-[#2EC4B6] font-black bg-[#2EC4B6]/10 scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="text-sm">🏠</span>
            <span className="text-[9px] leading-tight truncate w-full text-center mt-0.5 font-bold">
              Home
            </span>
          </button>

          {/* 3. Arena */}
          <button
            onClick={() => onTabChange('duolingo')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all flex-1 min-w-0 max-w-[44px] ${
              activeTab === 'duolingo'
                ? 'text-emerald-700 font-black bg-emerald-50 scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="text-sm">{isKids ? '🎮' : '🌴'}</span>
            <span className="text-[9px] leading-tight truncate w-full text-center mt-0.5 font-bold">
              Arena
            </span>
          </button>

          {/* 4. Hub / Mundos */}
          <button
            onClick={() => onTabChange('pathway')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all flex-1 min-w-0 max-w-[44px] relative ${
              activeTab === 'pathway'
                ? 'text-[#243447] font-black bg-slate-100 scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <span className="text-sm">🗺️</span>
              {!isEnrolled && (
                <span className="absolute -top-1 -right-2 w-3 h-3 bg-amber-500 rounded-full border border-white flex items-center justify-center">
                  <Lock className="w-1.5 h-1.5 text-white" />
                </span>
              )}
            </div>
            <span className="text-[9px] leading-tight truncate w-full text-center mt-0.5 font-bold">
              {isKids ? 'Mundos' : 'Hub'}
            </span>
          </button>

          {/* 5. Classroom (Aula) */}
          <button
            onClick={() => onTabChange('classroom')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all flex-1 min-w-0 max-w-[44px] relative ${
              activeTab === 'classroom'
                ? 'text-[#2EC4B6] font-black bg-[#2EC4B6]/10 scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <span className="text-sm">📖</span>
              {!isEnrolled && (
                <span className="absolute -top-1 -right-2 w-3 h-3 bg-amber-500 rounded-full border border-white flex items-center justify-center">
                  <Lock className="w-1.5 h-1.5 text-white" />
                </span>
              )}
            </div>
            <span className="text-[9px] leading-tight truncate w-full text-center mt-0.5 font-bold">Aula</span>
          </button>

          {/* 6. Lab */}
          <button
            onClick={() => onTabChange('lab')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all flex-1 min-w-0 max-w-[44px] relative ${
              activeTab === 'lab'
                ? 'text-[#2EC4B6] font-black bg-[#2EC4B6]/10 scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <span className="text-sm">🧪</span>
              {!isUserLoggedIn ? (
                <span className="absolute -top-1 -right-2 w-3 h-3 bg-amber-500 rounded-full border border-white flex items-center justify-center shadow-xs">
                  <Lock className="w-1.5 h-1.5 text-white" />
                </span>
              ) : (
                <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-[#2EC4B6] text-white rounded-full text-[7px] font-black">
                  100
                </span>
              )}
            </div>
            <span className="text-[9px] leading-tight truncate w-full text-center mt-0.5 font-bold">Lab</span>
          </button>

          {/* 7. Schedule (Agenda) */}
          <button
            onClick={() => onTabChange('calendar')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all flex-1 min-w-0 max-w-[44px] ${
              activeTab === 'calendar'
                ? 'text-[#243447] font-black bg-slate-100 scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="text-sm">📅</span>
            <span className="text-[9px] leading-tight truncate w-full text-center mt-0.5 font-bold">
              {isKids ? 'Misiones' : 'Agenda'}
            </span>
          </button>

          {/* 8. Library (Libros) */}
          <button
            onClick={() => onTabChange('library')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all flex-1 min-w-0 max-w-[44px] relative ${
              activeTab === 'library'
                ? 'text-indigo-600 font-black bg-indigo-50 scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <span className="text-sm">📚</span>
              {!isEnrolled && (
                <span className="absolute -top-1 -right-2 w-3 h-3 bg-amber-500 rounded-full border border-white flex items-center justify-center">
                  <Lock className="w-1.5 h-1.5 text-white" />
                </span>
              )}
            </div>
            <span className="text-[9px] leading-tight truncate w-full text-center mt-0.5 font-bold">Libros</span>
          </button>

        </div>
      </nav>
    </>
  );
};
