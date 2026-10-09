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
  Palette
} from 'lucide-react';
import { User } from 'firebase/auth';
import { AudienceTheme, Student, StaffRole } from '../types';
import { GuakyLogo } from './GuakyLogo';

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
  onOpenProfile: () => void;
  currentStudentXp: number;
  currentStudentStreak: number;
  currentStudent: Student | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  allStudents: Student[];
  onSelectStudent: (studentId: string) => void;
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
  onOpenProfile,
  currentStudentXp,
  currentStudentStreak,
  currentStudent,
  activeTab,
  onTabChange,
  allStudents,
  onSelectStudent
}) => {
  const isKids = audienceTheme === 'kids';
  const isEnrolled = isTeacherAuthenticated || (currentStudent && currentStudent.status === 'enrolled');
  const isUserLoggedIn = !!user || isTeacherAuthenticated;
  const isStudentLoggedIn = Boolean((user && !isTeacherAuthenticated) || (currentStudent && currentStudent.status === 'enrolled' && !isTeacherAuthenticated));

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
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

            {/* Right Action Cluster - Always visible on desktop, tablet, and mobile */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              {/* THEME / AMBIENTE DE ESTUDIO BUTTON (Sensory & Neurodiversity Control) */}
              {onOpenThemeModal && (
                <button
                  onClick={onOpenThemeModal}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FFF9F0] hover:bg-[#FFEECB] text-[#243447] border border-[#FFD166] rounded-xl text-xs font-bold transition-all shadow-2xs"
                  title="Personalizar ambiente de estudio (Bajo estímulo, Modo Oscuro TDAH, Pasteles)"
                >
                  <Palette className="w-3.5 h-3.5 text-[#2EC4B6]" />
                  <span className="hidden sm:inline">Ambiente</span>
                </button>
              )}

              {/* Coupon / Beca button */}
              <button
                onClick={onOpenCouponModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-all shadow-2xs"
                title="Canjear código de cortesía o beca"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Beca / Código</span>
              </button>

              {/* AUDIENCE THEME TOGGLE: Junior 12+ vs Adult */}
              <div className="hidden sm:flex bg-slate-100 p-0.5 rounded-xl items-center text-xs font-bold border border-slate-200/80">
                <button
                  onClick={() => onAudienceChange('adults')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                    !isKids
                      ? 'bg-[#243447] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Audiencia Adult"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Adult</span>
                </button>
                <button
                  onClick={() => onAudienceChange('kids')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                    isKids
                      ? 'bg-[#2EC4B6] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Audiencia Junior 12+"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Junior 12+</span>
                </button>
              </div>

              {/* Gamification badge: Racha + XP */}
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

              {/* Profile / Avatar Button */}
              <button
                onClick={onOpenProfile}
                className="flex items-center p-0.5 sm:p-1 hover:bg-slate-100 rounded-xl transition-colors focus:outline-hidden"
                title="Ver mi perfil"
              >
                {currentStudent ? (
                  <img
                    src={currentStudent.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${currentStudent.name}`}
                    alt={currentStudent.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-300 object-cover"
                  />
                ) : user ? (
                  <img
                    src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || user.email}`}
                    alt={user.displayName || 'Usuario'}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-300 object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-500">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </button>

              {/* Teacher Logout if authenticated */}
              {isTeacherAuthenticated && (
                <button
                  onClick={onTeacherLogout}
                  className="hidden md:flex items-center gap-1 px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-[11px] font-bold transition-colors"
                  title="Cerrar sesión de Teacher"
                >
                  <Lock className="w-3 h-3 text-red-500" />
                  <span>Salir Teacher</span>
                </button>
              )}

            </div>
          </div>

          {/* Row 2: Navigation Pills Bar with Emojis (Libres a la Izquierda, Candados a la Derecha) */}
          <div className="hidden md:flex items-center justify-center border-t border-slate-100 py-1.5 overflow-x-auto no-scrollbar">
            <nav className="flex items-center gap-1 sm:gap-1.5 bg-slate-100/90 p-1 rounded-2xl text-xs font-semibold text-slate-600">
              
              {/* --- ZONA IZQUIERDA: ACCESO LIBRE (SIN CANDADOS) --- */}

              {/* 1. Home */}
              <button
                onClick={() => onTabChange('landing')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'landing'
                    ? 'bg-white text-[#2EC4B6] shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                <span className="text-sm">🏠</span>
                <span>Home</span>
              </button>

              {/* 2. Inscribirme (Solo visible si NO está inscrito/logueado como alumno) */}
              {!isEnrolled && !isStudentLoggedIn && (
                <button
                  onClick={() => onTabChange('register')}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    activeTab === 'register'
                      ? 'bg-white text-[#2EC4B6] shadow-xs font-bold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  <span className="text-sm">✍️</span>
                  <span>Inscribirme</span>
                </button>
              )}

              {/* 3. Agenda */}
              <button
                onClick={() => onTabChange('calendar')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'calendar'
                    ? 'bg-white text-[#243447] shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                <span className="text-sm">📅</span>
                <span>Agenda</span>
              </button>

              {/* 4. Arena (Con emoticón de palmera verde donde aterrizan las guacamayas) */}
              <button
                onClick={() => onTabChange('duolingo')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'duolingo'
                    ? 'bg-white text-emerald-600 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                <span className="text-sm">🌴</span>
                <span>Arena</span>
              </button>

              {/* Divisor visual sutil */}
              <div className="h-4 w-px bg-slate-300 mx-0.5" />

              {/* --- ZONA DERECHA: REGISTRADOS / CANDADOS A LA DERECHA --- */}

              {/* 5. Hub (Donde está el progreso y dónde estamos parados) */}
              <button
                onClick={() => onTabChange('pathway')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'pathway'
                    ? 'bg-white text-[#243447] shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                <span className="text-sm">🧭</span>
                <span>Hub</span>
                {!isEnrolled && (
                  <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0 ml-0.5" />
                )}
              </button>

              {/* 6. Classroom (Aula Interactiva) */}
              <button
                onClick={() => onTabChange('classroom')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'classroom'
                    ? 'bg-white text-[#2EC4B6] shadow-xs font-bold ring-1 ring-[#2EC4B6]/30'
                    : 'hover:text-slate-900'
                }`}
              >
                <span className="text-sm">📖</span>
                <span>Classroom</span>
                {!isEnrolled && (
                  <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0 ml-0.5" />
                )}
              </button>

              {/* 7. Library (Biblioteca oficial y repositorio de materiales) */}
              <button
                onClick={() => onTabChange('library')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'library'
                    ? 'bg-white text-indigo-600 shadow-xs font-bold ring-1 ring-indigo-500/30'
                    : 'hover:text-slate-900'
                }`}
                title="Academic Library • Libros, Audios y Workbooks"
              >
                <span className="text-sm">📚</span>
                <span>Library</span>
                {!isEnrolled && (
                  <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0 ml-0.5" />
                )}
              </button>
              
              {/* 8. Lab (Con badge de 100 ejercicios) */}
              <button
                onClick={() => onTabChange('lab')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'lab'
                    ? 'bg-white text-[#2EC4B6] shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
                title="Language Practice Lab • 100 Ejercicios"
              >
                <span className="text-sm">🧪</span>
                <span>Lab</span>
                {!isUserLoggedIn ? (
                  <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0 ml-0.5" />
                ) : (
                  <span className="bg-[#2EC4B6]/20 text-[#2EC4B6] text-[10px] font-black px-1.5 py-0.5 rounded-full">
                    100
                  </span>
                )}
              </button>

              {/* 8. Teacher / Principal's Office Portal (hidden for signed-in students) */}
              {!isStudentLoggedIn && (
                <button
                  onClick={() => onTabChange('teacher')}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    activeTab === 'teacher'
                      ? staffRole === 'principal'
                        ? 'bg-amber-400 text-slate-950 shadow-md font-black ring-1 ring-amber-500'
                        : 'bg-[#243447] text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                  title={staffRole === 'principal' ? "Principal's Office portal" : 'Teacher portal'}
                >
                  <span className="text-sm">{staffRole === 'principal' ? '👑' : '👩‍🏫'}</span>
                  <span>{staffRole === 'principal' ? "Principal's Office" : 'Teacher'}</span>
                  <Lock className={`w-3.5 h-3.5 shrink-0 ml-0.5 ${isTeacherAuthenticated ? 'text-emerald-400' : 'text-amber-500'}`} />
                </button>
              )}

            </nav>
          </div>

        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION BAR (Con emoticones consistentes y candados a la derecha) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl px-1 py-1 flex md:hidden items-center justify-around pb-safe">
        <div className="w-full max-w-lg mx-auto flex items-center justify-around">
          
          {/* 1. Home */}
          <button
            onClick={() => onTabChange('landing')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all flex-1 min-w-0 max-w-[54px] ${
              activeTab === 'landing'
                ? 'text-[#2EC4B6] font-bold bg-[#2EC4B6]/10 scale-102'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="text-base">🏠</span>
            <span className="text-[9px] leading-tight truncate w-full text-center mt-0.5 font-bold">Home</span>
          </button>

          {/* 2. Inscribirme (Solo si no está inscrito/alumno logueado) */}
          {!isEnrolled && !isStudentLoggedIn && (
            <button
              onClick={() => onTabChange('register')}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all flex-1 min-w-0 max-w-[54px] ${
                activeTab === 'register'
                  ? 'text-[#2EC4B6] font-bold bg-[#2EC4B6]/10 scale-102'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="text-base">✍️</span>
              <span className="text-[9px] leading-tight truncate w-full text-center mt-0.5">Inscribir</span>
            </button>
          )}

          {/* 3. Agenda */}
          <button
            onClick={() => onTabChange('calendar')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all flex-1 min-w-0 max-w-[54px] ${
              activeTab === 'calendar'
                ? 'text-[#243447] font-bold bg-slate-100 scale-102'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="text-base">📅</span>
            <span className="text-[9px] leading-tight truncate w-full text-center mt-0.5">Agenda</span>
          </button>

          {/* 4. Arena */}
          <button
            onClick={() => onTabChange('duolingo')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all flex-1 min-w-0 max-w-[54px] ${
              activeTab === 'duolingo'
                ? 'text-emerald-600 font-bold bg-emerald-50 scale-102'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="text-base">🌴</span>
            <span className="text-[9px] leading-tight truncate w-full text-center mt-0.5">Arena</span>
          </button>

          {/* 5. Hub */}
          <button
            onClick={() => onTabChange('pathway')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all flex-1 min-w-0 max-w-[54px] relative ${
              activeTab === 'pathway'
                ? 'text-[#243447] font-bold bg-slate-100 scale-102'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <span className="text-base">🧭</span>
              {!isEnrolled && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-amber-500 rounded-full border border-white flex items-center justify-center">
                  <Lock className="w-2 h-2 text-white" />
                </span>
              )}
            </div>
            <span className="text-[9px] leading-tight truncate w-full text-center mt-0.5">Hub</span>
          </button>

          {/* 6. Classroom */}
          <button
            onClick={() => onTabChange('classroom')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all flex-1 min-w-0 max-w-[54px] relative ${
              activeTab === 'classroom'
                ? 'text-[#2EC4B6] font-bold bg-[#2EC4B6]/10 scale-102'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <span className="text-base">📖</span>
              {!isEnrolled && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-amber-500 rounded-full border border-white flex items-center justify-center">
                  <Lock className="w-2 h-2 text-white" />
                </span>
              )}
            </div>
            <span className="text-[9px] leading-tight truncate w-full text-center mt-0.5">Classroom</span>
          </button>

          {/* 7. Library */}
          <button
            onClick={() => onTabChange('library')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all flex-1 min-w-0 max-w-[54px] relative ${
              activeTab === 'library'
                ? 'text-indigo-600 font-bold bg-indigo-50 scale-102'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <span className="text-base">📚</span>
              {!isEnrolled && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-amber-500 rounded-full border border-white flex items-center justify-center">
                  <Lock className="w-2 h-2 text-white" />
                </span>
              )}
            </div>
            <span className="text-[9px] leading-tight truncate w-full text-center mt-0.5">Library</span>
          </button>

          {/* 8. Lab */}
          <button
            onClick={() => onTabChange('lab')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all flex-1 min-w-0 max-w-[54px] relative ${
              activeTab === 'lab'
                ? 'text-[#2EC4B6] font-bold bg-[#2EC4B6]/10 scale-102'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <span className="text-base">🧪</span>
              {!isUserLoggedIn ? (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-amber-500 rounded-full border border-white flex items-center justify-center shadow-xs">
                  <Lock className="w-2 h-2 text-white" />
                </span>
              ) : (
                <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-[#2EC4B6] text-white rounded-full text-[8px] font-black">
                  100
                </span>
              )}
            </div>
            <span className="text-[9px] leading-tight truncate w-full text-center mt-0.5">Lab</span>
          </button>

          {/* 8. Teacher / Principal's Office (hidden for signed-in students) */}
          {!isStudentLoggedIn && (
            <button
              onClick={() => onTabChange('teacher')}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all flex-1 min-w-0 max-w-[54px] relative ${
                activeTab === 'teacher'
                  ? staffRole === 'principal'
                    ? 'text-amber-950 font-black bg-amber-200/80 scale-102'
                    : 'text-[#243447] font-bold bg-slate-200 scale-102'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <span className="text-base">{staffRole === 'principal' ? '👑' : '👩‍🏫'}</span>
                <span className={`absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full border border-white flex items-center justify-center ${
                  isTeacherAuthenticated ? 'bg-emerald-500' : 'bg-amber-500'
                }`}>
                  <Lock className="w-2 h-2 text-white" />
                </span>
              </div>
              <span className="text-[9px] leading-tight truncate w-full text-center mt-0.5 font-bold">
                {staffRole === 'principal' ? "Principal's Office" : 'Teacher'}
              </span>
            </button>
          )}

        </div>
      </nav>
    </>
  );
};
