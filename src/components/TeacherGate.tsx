import React, { useState } from 'react';
import { Lock, KeyRound, AlertCircle, ArrowLeft, ShieldCheck, CheckCircle2, Crown, Briefcase, Eye, EyeOff } from 'lucide-react';
import { User } from 'firebase/auth';

interface TeacherGateProps {
  user: User | null;
  onLoginWithGoogle: () => void;
  isLoggingIn: boolean;
  onAuthenticated: (role: 'principal' | 'teacher') => void;
  onBackToStudent: () => void;
}

export const TeacherGate: React.FC<TeacherGateProps> = ({
  user,
  onLoginWithGoogle,
  isLoggingIn,
  onAuthenticated,
  onBackToStudent
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Directora General / Institutional Principal
    if (cleanPass === '0112' || (cleanUser === 'waky' && cleanPass === '0112')) {
      onAuthenticated('principal');
      return;
    }

    // 2. Teacher Docente
    if (cleanPass === '3223' || ((cleanUser === 'coquito' || cleanUser === 'cokito') && cleanPass === '3223')) {
      onAuthenticated('teacher');
      return;
    }

    setErrorMessage('Credenciales institucionales inválidas. Verifica tu usuario y clave o contacta a la administración.');
  };

  const isTeacherGoogle = user && (user.email === 'anateresa.csb@gmail.com' || user.email?.includes('anateresa'));

  return (
    <div className="max-w-md mx-auto my-8 p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xl text-center">
      
      {/* Icon Badge */}
      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-tr from-amber-500 to-amber-600 rounded-3xl flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
        <Crown className="w-8 h-8 text-white" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-300 rounded-full text-[11px] font-bold text-amber-900 mb-2">
        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
        Acceso Institucional Restringido
      </div>

      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
        Portal Administrativo & Teachers
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-6">
        Ingreso seguro para personal directivo, administrativo y Teachers autorizados de Güakytopia.
      </p>

      {/* Google login option if already matching email */}
      {isTeacherGoogle ? (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-left space-y-2">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs sm:text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Cuenta verificada: {user.email}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => onAuthenticated('principal')}
              className="py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black text-xs shadow-md transition-colors"
            >
              Enter Principal's Office
            </button>
            <button
              type="button"
              onClick={() => onAuthenticated('teacher')}
              className="py-2.5 bg-[#243447] hover:bg-[#18232F] text-white rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              Entrar como Teacher
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-left">
          <form onSubmit={handleCredentialsSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Usuario Institucional
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario institucional"
                autoComplete="username"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Clave de Seguridad Institucional
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full px-4 py-2.5 pr-10 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 tracking-wider"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition-colors"
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-amber-300"
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Ingresar al Portal Institucional</span>
            </button>
          </form>

          <div className="relative py-2 text-center">
            <span className="bg-white px-2 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              o con tu cuenta oficial
            </span>
          </div>

          <button
            type="button"
            onClick={onLoginWithGoogle}
            disabled={isLoggingIn}
            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continuar con Google</span>
          </button>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center">
        <button
          type="button"
          onClick={onBackToStudent}
          className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Modo Alumno</span>
        </button>
      </div>

    </div>
  );
};
