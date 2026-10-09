import React, { useState } from 'react';
import { 
  X, 
  Flame, 
  Zap, 
  Award, 
  BookOpen, 
  Clock, 
  Calendar, 
  Mail, 
  LogOut, 
  CheckCircle2, 
  ShieldCheck, 
  User, 
  GraduationCap, 
  Baby,
  KeyRound,
  FileText,
  Lock,
  Banknote,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { Student, AudienceTheme } from '../types';
import { User as FirebaseUser } from 'firebase/auth';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  user: FirebaseUser | null;
  onLogin?: () => void;
  onCredentialsLogin?: (emailOrUser: string, pass: string) => boolean;
  onLogout: () => void;
  isLoggingIn?: boolean;
  onOpenCoupon: () => void;
  onOpenPlacementTest: () => void;
  onOpenRegister?: () => void;
  onOpenPaymentModal?: () => void;
  audienceTheme?: AudienceTheme;
  onAudienceChange?: (theme: AudienceTheme) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  student,
  user,
  onLogin,
  onCredentialsLogin,
  onLogout,
  isLoggingIn = false,
  onOpenCoupon,
  onOpenPlacementTest,
  onOpenRegister,
  onOpenPaymentModal,
  audienceTheme,
  onAudienceChange
}) => {
  const [loginMethod, setLoginMethod] = useState<'credentials' | 'google'>('credentials');
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [credentialsError, setCredentialsError] = useState<string | null>(null);

  if (!isOpen) return null;
  const isKids = audienceTheme === 'kids';

  // An account is considered active if a Firebase user is logged in OR a real student profile is active
  const isLoggedIn = Boolean(user || (student && student.id !== 'guest'));
  const displayName = student?.name 
    ? `${student.name} ${student.lastName || ''}`.trim()
    : user?.displayName || 'Alumno Cokitö';
  const displayEmail = student?.email || user?.email || 'Sin correo asociado';
  const displayAvatar = student?.avatar || user?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`;
  const isEnrolled = student?.status === 'enrolled';

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCredentialsError(null);

    if (!emailOrUser.trim()) {
      setCredentialsError('Por favor ingresa tu correo electrónico o usuario.');
      return;
    }

    if (onCredentialsLogin) {
      const success = onCredentialsLogin(emailOrUser.trim(), password.trim());
      if (success) {
        setEmailOrUser('');
        setPassword('');
        setCredentialsError(null);
      } else {
        setCredentialsError('No se encontró una cuenta con esos datos o la contraseña es incorrecta. Si aún no te has registrado, puedes inscribirte abajo.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div 
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in slide-in-from-bottom-6 duration-200"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
              <User className="w-5 h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-sm sm:text-base tracking-tight truncate">
                {isLoggedIn ? 'Mi Cuenta de Alumno' : 'Acceso & Sesión'}
              </h3>
              <p className="text-[11px] text-blue-200 truncate">
                {isLoggedIn ? 'Progreso, clases y suscripción' : 'Inicia sesión con tu cuenta o con Google'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* ======================================================== */}
          {/* SCENARIO 1: LOGGED IN USER (AUTHENTIC STUDENT PROFILE) */}
          {/* ======================================================== */}
          {isLoggedIn ? (
            <>
              {/* Profile Card */}
              <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <img
                  src={displayAvatar}
                  alt={displayName}
                  className="w-14 h-14 rounded-2xl border-2 border-white shadow-xs object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-black text-slate-900 text-sm sm:text-base truncate">
                    {displayName}
                  </h4>
                  <p className="text-xs text-slate-500 truncate">{displayEmail}</p>
                  
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isEnrolled
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {isEnrolled ? '🟢 Alumno Oficial Activo' : '🟡 Modo Guest (Pendiente de Afiliación)'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded-full">
                      {(student?.levelId || 'SuperGoal 1').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress & Stats Cards */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-orange-50 border border-orange-200/80 rounded-2xl">
                  <div className="flex items-center justify-center gap-1 text-orange-600 font-black text-base sm:text-lg">
                    <Flame className="w-4 h-4 fill-orange-500" />
                    <span>{student?.streak || 1}</span>
                  </div>
                  <p className="text-[10px] font-bold text-orange-800 uppercase tracking-wider mt-0.5">Días Racha</p>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl">
                  <div className="flex items-center justify-center gap-1 text-emerald-600 font-black text-base sm:text-lg">
                    <Zap className="w-4 h-4 fill-emerald-500" />
                    <span>{student?.xp || 200}</span>
                  </div>
                  <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mt-0.5">Puntos XP</p>
                </div>

                <div className="p-3 bg-purple-50 border border-purple-200/80 rounded-2xl">
                  <div className="flex items-center justify-center gap-1 text-purple-600 font-black text-base sm:text-lg">
                    <Award className="w-4 h-4" />
                    <span>{student?.league || 'Bronce'}</span>
                  </div>
                  <p className="text-[10px] font-bold text-purple-800 uppercase tracking-wider mt-0.5">Liga</p>
                </div>
              </div>

              {/* Placement Test Result if exists */}
              {student?.placementTestScore !== undefined && (
                <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-xs space-y-1">
                  <div className="flex justify-between items-center font-bold text-blue-900">
                    <span>Prueba Diagnóstica Cokitö:</span>
                    <span className="px-2 py-0.5 bg-blue-600 text-white rounded-lg text-[11px]">
                      {student.placementTestScore} / 25 pts
                    </span>
                  </div>
                  {student.placementTestDiagnosis && (
                    <p className="text-[11px] text-blue-800 italic pt-1 leading-relaxed">
                      "{student.placementTestDiagnosis}"
                    </p>
                  )}
                </div>
              )}

              {/* Student Actions */}
              <div className="space-y-2 pt-1">
                {!isEnrolled && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenCoupon();
                      }}
                      className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>Validar con Código / Beca</span>
                    </button>

                    {onOpenPaymentModal && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenPaymentModal();
                        }}
                        className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <Banknote className="w-4 h-4" />
                        <span>Validar con $5 (PayPal / Pago Móvil)</span>
                      </button>
                    )}
                  </>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPlacementTest();
                  }}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Repetir Prueba de Nivel (Placement Test)</span>
                </button>
              </div>

              {/* Logout Button */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </>
          ) : (
            /* ======================================================== */
            /* SCENARIO 2: NOT LOGGED IN (FLEXIBLE: USER/PASS OR GOOGLE)*/
            /* ======================================================== */
            <div className="space-y-4">
              
              {/* Method Switcher Tabs: Correo/Usuario vs Google */}
              <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('credentials');
                    setCredentialsError(null);
                  }}
                  className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    loginMethod === 'credentials'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span>Usuario o Correo</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('google');
                    setCredentialsError(null);
                  }}
                  className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    loginMethod === 'google'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>Con Google</span>
                </button>
              </div>

              {/* OPTION 1: USERNAME / EMAIL & PASSWORD FORM */}
              {loginMethod === 'credentials' && (
                <form onSubmit={handleCredentialsSubmit} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Correo Electrónico o Nombre de Usuario:
                    </label>
                    <input
                      type="text"
                      value={emailOrUser}
                      onChange={(e) => setEmailOrUser(e.target.value)}
                      placeholder="ejemplo@correo.com o tu nombre"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Contraseña:
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden pr-8"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                        title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {credentialsError && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-[11px] flex items-start gap-1.5 leading-tight">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                      <span>{credentialsError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
                  >
                    Iniciar Sesión con mi Cuenta
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenCoupon();
                    }}
                    className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold rounded-xl text-[11px] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                    <span>¿Tienes un código de beca o invitación? Ingrésalo aquí</span>
                  </button>
                </form>
              )}

              {/* OPTION 2: 1-CLICK GOOGLE SIGN-IN */}
              {loginMethod === 'google' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Inicia sesión en 1 segundo usando tu cuenta de Google para sincronizar tus clases y certificados.
                  </p>

                  {onLogin && (
                    <button
                      type="button"
                      onClick={() => {
                        onLogin();
                        onClose();
                      }}
                      disabled={isLoggingIn}
                      className="w-full py-3 px-4 bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs font-bold text-slate-800 shadow-xs hover:border-slate-300 transition-all flex items-center justify-center gap-2.5"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                      </svg>
                      <span>{isLoggingIn ? 'Iniciando sesión...' : 'Continuar con Google'}</span>
                    </button>
                  )}
                </div>
              )}

              {/* Navigation Links: Register, Code, Placement */}
              <div className="space-y-2 pt-1">
                {onOpenRegister && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenRegister();
                    }}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <span>✍️ ¿No tienes cuenta? Inscríbete Aquí</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCoupon();
                  }}
                  className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-xs font-bold text-amber-900 transition-colors flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4 text-amber-600" />
                  <span>Tengo un Código de Validación o Beca</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPlacementTest();
                  }}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Hacer Prueba Diagnóstica Gratis</span>
                </button>
              </div>

            </div>
          )}

          {/* Theme Selector: Adultos vs Kids */}
          {onAudienceChange && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Modo Visual de la Academia:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => onAudienceChange('adults')}
                  className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    !isKids
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Modo Adultos</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAudienceChange('kids')}
                  className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    isKids
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Baby className="w-4 h-4" />
                  <span>Modo Kids</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
