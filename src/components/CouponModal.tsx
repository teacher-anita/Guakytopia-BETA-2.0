import React, { useState } from 'react';
import { X, KeyRound, CheckCircle2, Sparkles, AlertCircle, ArrowLeft, Eye, EyeOff, User, Lock, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student } from '../types';
import { findCouponByCode } from '../data/couponsData';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCoupon: (student: Student) => void;
  onBackToLogin?: () => void;
}

export const CouponModal: React.FC<CouponModalProps> = ({
  isOpen,
  onClose,
  onApplyCoupon,
  onBackToLogin
}) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ title: string; desc: string } | null>(null);

  if (!isOpen) return null;

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanCode = code.trim().toUpperCase().replace(/\s+/g, '');
    const cleanUser = username.trim().toLowerCase().replace(/\s+/g, '');

    if (!name.trim() || !email.trim()) {
      setErrorMsg('Por favor completa tu nombre completo y correo electrónico.');
      return;
    }

    if (!cleanUser) {
      setErrorMsg('Por favor crea un nombre de usuario para tu cuenta.');
      return;
    }

    if (!password.trim()) {
      setErrorMsg('Por favor define una contraseña para poder iniciar sesión.');
      return;
    }

    if (!cleanCode) {
      setErrorMsg('Por favor ingresa tu código de invitación o beca.');
      return;
    }

    // Check against configured coupons database or known coupon formats
    const matchedCoupon = findCouponByCode(cleanCode);

    if (matchedCoupon && matchedCoupon.isActive === false) {
      setErrorMsg('Este código o beca se encuentra temporalmente inactivo. Por favor consulta con la Rectoría de Güakytopia.');
      return;
    }

    const isCSB = cleanCode === 'CSB2026' || cleanCode.includes('CSB2026') || cleanCode === 'CSBTEACHERS26' || cleanCode === 'CSBFRIENDS';
    const isFriends = cleanCode === 'FRIENDS2026' || cleanCode.startsWith('FRIEND-');
    const isDigital = cleanCode === 'COKITO5';
    const isScholar = Boolean(matchedCoupon && matchedCoupon.category === 'scholarship') || cleanCode.startsWith('SCHOLAR-');

    if (matchedCoupon || isCSB || isFriends || isDigital || isScholar) {
      const benefitTitle = matchedCoupon?.title || (
        isCSB ? 'Pase Directo Comunidad Simón Bolívar (CSB)' :
        isFriends ? 'Pase de Invitación VIP' :
        isDigital ? 'Pase Digital Web App $5' :
        'Beca Institucional Asignada'
      );

      const redeemedStudent: Student = {
        id: `student_${Date.now()}`,
        name: name.trim(),
        lastName: '',
        username: cleanUser,
        email: email.trim().toLowerCase(),
        password: password.trim(),
        phone: '',
        age: 26,
        isKid: false,
        schoolOrProfession: isCSB ? 'Comunidad CSB' : 'Estudiante Güakytopia',
        learningGoal: 'Aprender y certificar inglés bilingüe',
        avatar: `https://api.dicebear.com/7.x/micah/svg?seed=${cleanUser}`,
        plan: isScholar ? 'intensive' : isFriends ? 'regular' : 'basic',
        modality: 'online',
        groupSize: isCSB ? 'duo' : 'individual',
        preferredTimeSlot: 'Flexible',
        status: 'enrolled',
        levelId: 'level_1',
        placementTestScore: 24,
        placementTestDiagnosis: `Beca/Pase activado (${benefitTitle})`,
        placementTestDate: new Date().toISOString().split('T')[0],
        registeredAt: new Date().toISOString().split('T')[0],
        currentUnit: 1,
        completedHours: 0,
        xp: isScholar ? 600 : isFriends ? 500 : 350,
        streak: 1,
        league: isScholar ? 'Diamante' : isFriends ? 'Oro' : 'Plata',
        rating: { fluency: 4, grammar: 4, vocabulary: 4, pronunciation: 4 },
        notes: `Pase/Beca activada mediante código secreto [${cleanCode}]: ${benefitTitle}`,
        assignedSlots: isCSB ? ['Lunes-16:00', 'Miércoles-16:00'] : []
      };

      setSuccessInfo({
        title: '¡Pase & Beca Activada con Éxito! 🎁',
        desc: `Tu cuenta ha sido creada como @${cleanUser}. Tienes acceso completo e inmediato al Hub y al aula de la Unidad 1 de Güakytopia.`
      });

      try {
        confetti({ particleCount: 120, spread: 75, origin: { y: 0.6 } });
      } catch {}

      setTimeout(() => {
        onApplyCoupon(redeemedStudent);
        onClose();
      }, 1800);

    } else {
      setErrorMsg('El código ingresado no es válido o ha expirado. Verifica que esté bien escrito o solicita uno a la administración de Güakytopia.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 my-auto">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Pases de Cortesía & Becas Institucionales
              </span>
              <h3 className="font-black text-base text-white">
                Canjear Código en Güakytopia
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {successInfo ? (
          <div className="p-8 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-slate-900">{successInfo.title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{successInfo.desc}</p>
            <p className="text-[11px] font-bold text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded-xl border border-emerald-200">
              Iniciando tu sesión y cargando tus libros...
            </p>
          </div>
        ) : (
          <form onSubmit={handleRedeem} className="p-5 sm:p-6 space-y-3.5">
            <p className="text-xs text-slate-600 leading-relaxed bg-amber-50/70 p-3 rounded-2xl border border-amber-200/60">
              Si recibiste una cortesía especial, beca institucional o pase de invitación de <strong>Güakytopia</strong> (Coquitos Academy), completa tus datos para crear tu usuario y contraseña de acceso.
            </p>

            <div className="space-y-3">
              {/* 1. Nombre Completo */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Tu Nombre Completo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Ana Teresa Sandoval"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* 2. Usuario & Correo en dos columnas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Crea tu Usuario
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    placeholder="ej. anasandoval"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu.correo@ejemplo.com"
                      className="w-full pl-8 pr-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* 3. Contraseña */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Crea tu Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Define una clave para volver a entrar"
                    className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 4. Código Secreto (Sin delatar códigos en el placeholder) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Código Secreto de Invitación / Beca
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Ingresa tu código confidencial..."
                    className="w-full pl-9 pr-9 py-2.5 bg-amber-50/70 border border-amber-300 rounded-xl text-xs text-slate-900 font-mono font-bold uppercase tracking-wider focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                  <KeyRound className="w-4 h-4 text-amber-600 absolute left-3 top-3 pointer-events-none" />
                  <Sparkles className="w-4 h-4 text-amber-500 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4 text-slate-950" />
                <span>Validar y Activar Pase</span>
              </button>

              {onBackToLogin && (
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver a Iniciar Sesión</span>
                </button>
              )}
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
