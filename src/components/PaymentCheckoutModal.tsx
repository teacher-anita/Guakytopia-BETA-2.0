import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Smartphone, 
  Banknote, 
  ShieldCheck, 
  Copy, 
  Sparkles, 
  ExternalLink,
  Lock,
  ArrowRight,
  MessageCircle,
  QrCode,
  AlertCircle,
  User,
  Mail,
  Phone,
  KeyRound
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Student } from '../types';
import { 
  OFFICIAL_PAGO_MOVIL, 
  OFFICIAL_PAYPAL,
  PAYPAL_CLIENT_ID,
  getPayPalMeUrl,
  getFullPayPalCopyText,
  convertUsdToBs, 
  getBcvDetails, 
  VENEZUELAN_BANKS, 
  getFullPagoMovilCopyText 
} from '../services/currencyService';

export interface GuestRegistrationData {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
}

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: (method: string, reference: string, guestData?: GuestRegistrationData) => void;
  initialPlanName?: string;
  initialAmountUsd?: number;
  currentStudent?: Student | null;
  onOpenLogin?: () => void;
  onOpenFullRegistration?: () => void;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  initialPlanName = 'Membresía Plataforma Campus Güakytopia (Promo $4.99)',
  initialAmountUsd = 4.99,
  currentStudent,
  onOpenLogin,
  onOpenFullRegistration
}) => {
  // Always default to PayPal as primary international method
  const [selectedMethod, setSelectedMethod] = useState<'paypal' | 'pagomovil' | 'cash'>('paypal');
  const [planName, setPlanName] = useState(initialPlanName);
  const [amountUsd, setAmountUsd] = useState(initialAmountUsd);

  // Guest identification state (Required if user is not logged in)
  const [guestName, setGuestName] = useState('');
  const [guestLastName, setGuestLastName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestPassword, setGuestPassword] = useState('');
  const [identificationError, setIdentificationError] = useState<string | null>(null);

  const isAuthenticatedStudent = Boolean(currentStudent && currentStudent.id && currentStudent.id !== 'guest');
  const isGuestFormValid = isAuthenticatedStudent || (
    guestName.trim().length >= 2 &&
    guestLastName.trim().length >= 2 &&
    guestEmail.trim().includes('@') &&
    guestEmail.trim().includes('.') &&
    guestPhone.trim().length >= 7
  );

  const getActiveStudentIdentity = (): GuestRegistrationData => {
    if (isAuthenticatedStudent && currentStudent) {
      return {
        name: currentStudent.name,
        lastName: currentStudent.lastName || '',
        email: currentStudent.email,
        phone: currentStudent.phone || ''
      };
    }
    return {
      name: guestName.trim(),
      lastName: guestLastName.trim(),
      email: guestEmail.trim().toLowerCase(),
      phone: guestPhone.trim(),
      password: guestPassword.trim() || undefined
    };
  };

  useEffect(() => {
    if (initialPlanName) setPlanName(initialPlanName);
    if (initialAmountUsd) setAmountUsd(initialAmountUsd);
  }, [initialPlanName, initialAmountUsd, isOpen]);
  
  // Pago Móvil form state
  const [pagoMovilRef, setPagoMovilRef] = useState('');
  const [pagoMovilBank, setPagoMovilBank] = useState('0102 - Banco de Venezuela Banco Universal');
  
  // PayPal form state
  const [paypalTransactionId, setPaypalTransactionId] = useState('');
  const [paypalSenderEmail, setPaypalSenderEmail] = useState('');
  const [showPaypalQr, setShowPaypalQr] = useState(false);
  const [showManualPayPal, setShowManualPayPal] = useState(false);
  const [paypalError, setPaypalError] = useState<string | null>(null);

  // Copy notice
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Submission notice
  const [isSuccess, setIsSuccess] = useState(false);
  const [receiptDetails, setReceiptDetails] = useState<{
    method: string;
    reference: string;
    amount: number;
    plan: string;
  } | null>(null);

  // Live BCV rate details
  const [bcvInfo, setBcvInfo] = useState(() => getBcvDetails());

  useEffect(() => {
    const handleBcvUpdate = () => {
      setBcvInfo(getBcvDetails());
    };
    window.addEventListener('bcv_rate_updated', handleBcvUpdate);
    return () => window.removeEventListener('bcv_rate_updated', handleBcvUpdate);
  }, []);

  const conversion = convertUsdToBs(amountUsd, bcvInfo.rate);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      // Fallback
    }
  };

  const handleConfirmPagoMovil = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticatedStudent && !isGuestFormValid) {
      setIdentificationError('Por favor completa tu nombre, apellido, correo y WhatsApp arriba para crear tu cuenta y asignarte tu pago.');
      return;
    }
    setIdentificationError(null);

    if (!pagoMovilRef.trim()) {
      alert('Por favor ingresa el número de referencia de tu Pago Móvil.');
      return;
    }
    const cleanRef = pagoMovilRef.trim();
    const activeId = getActiveStudentIdentity();
    const methodStr = `Pago Móvil (${OFFICIAL_PAGO_MOVIL.bankName} - ${pagoMovilBank}) [${planName}]`;
    
    setReceiptDetails({
      method: methodStr,
      reference: cleanRef,
      amount: amountUsd,
      plan: planName
    });

    try { confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } }); } catch {}
    setIsSuccess(true);
    if (onPaymentSuccess) {
      onPaymentSuccess(methodStr, cleanRef, !isAuthenticatedStudent ? activeId : undefined);
    }
  };

  const handleConfirmPayPal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticatedStudent && !isGuestFormValid) {
      setIdentificationError('Por favor completa tu nombre, apellido, correo y WhatsApp arriba para crear tu cuenta y asignarte tu pago.');
      return;
    }
    setIdentificationError(null);
    const ref = paypalTransactionId.trim() || paypalSenderEmail.trim();
    if (!ref) {
      setPaypalError('Por favor ingresa tu ID de transacción de PayPal o el correo de tu cuenta PayPal.');
      return;
    }
    setPaypalError(null);

    const refString = paypalTransactionId.trim() 
      ? `ID: ${paypalTransactionId.trim()}${paypalSenderEmail.trim() ? ` (Cuenta: ${paypalSenderEmail.trim()})` : ''}`
      : `Cuenta: ${paypalSenderEmail.trim()}`;

    const methodStr = `PayPal (${OFFICIAL_PAYPAL.email} - $${amountUsd.toFixed(2)} USD) [${planName}]`;

    setReceiptDetails({
      method: methodStr,
      reference: refString,
      amount: amountUsd,
      plan: planName
    });

    try { confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } }); } catch {}
    setIsSuccess(true);
    if (onPaymentSuccess) {
      const activeId = getActiveStudentIdentity();
      onPaymentSuccess(methodStr, refString, !isAuthenticatedStudent ? activeId : undefined);
    }
  };

  const handleConfirmCash = () => {
    if (!isAuthenticatedStudent && !isGuestFormValid) {
      setIdentificationError('Por favor completa tu nombre, apellido, correo y WhatsApp arriba para crear tu cuenta y acordar el punto de entrega.');
      return;
    }
    setIdentificationError(null);
    const activeId = getActiveStudentIdentity();
    const methodStr = `Efectivo ($${amountUsd.toFixed(2)} USD) [${planName}]`;
    setReceiptDetails({
      method: methodStr,
      reference: 'ENTREGA_PRESENCIAL_ACORDADA',
      amount: amountUsd,
      plan: planName
    });
    try { confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } }); } catch {}
    setIsSuccess(true);
    if (onPaymentSuccess) {
      onPaymentSuccess(methodStr, 'CASH_CONFIRMED', !isAuthenticatedStudent ? activeId : undefined);
    }
  };

  const currentPayPalUrl = getPayPalMeUrl(amountUsd);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(currentPayPalUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white flex items-start justify-between relative shrink-0">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <img 
                src="/guakytopia-nombre.png" 
                alt="Güakytopia" 
                className="h-6 w-auto object-contain" 
                onError={(e) => {
                  e.currentTarget.style.visibility = 'hidden';
                }}
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full">
                Plataforma de Pagos Güakytopia
              </span>
              <span className="text-xs text-blue-200 font-semibold">${amountUsd.toFixed(2)} USD</span>
              {amountUsd === 4.99 && (
                <span className="text-[10px] text-amber-300 font-bold bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-300/30">
                  Promo $4.99 (Reg. $7.00)
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
              {planName}
            </h2>
            <p className="text-xs text-blue-200 mt-0.5">
              Paga de forma rápida y segura en PayPal (USD), Pago Móvil (Bs a tasa oficial BCV) o Efectivo.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors shrink-0"
            title="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          
          {/* Quick Item / Amount Selector */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
            <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
              Concepto a Cancelar:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  setPlanName('Membresía Plataforma Campus Güakytopia (Promo $4.99)');
                  setAmountUsd(4.99);
                }}
                className={`p-2 rounded-xl border text-left flex items-center justify-between transition-all ${
                  amountUsd === 4.99
                    ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="truncate">
                  <span className="block truncate font-bold text-[11px]">🚀 Membresía Campus</span>
                  <span className="text-[10px] text-emerald-600 font-bold">$4.99/mes</span>
                </div>
                {amountUsd === 4.99 && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setPlanName('PrePaid Classes (6 Horas Individuales - $10/h)');
                  setAmountUsd(60.00);
                }}
                className={`p-2 rounded-xl border text-left flex items-center justify-between transition-all ${
                  amountUsd === 60.00
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="truncate">
                  <span className="block truncate font-bold text-[11px]">⭐ PrePaid (6h)</span>
                  <span className="text-[10px] text-emerald-700 font-bold">$60.00 USD</span>
                </div>
                {amountUsd === 60.00 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setPlanName('1 Hora de Clase Individual Prepagada');
                  setAmountUsd(15.00);
                }}
                className={`p-2 rounded-xl border text-left flex items-center justify-between transition-all ${
                  amountUsd === 15.00
                    ? 'border-blue-500 bg-blue-50 text-blue-950 font-bold shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="truncate">
                  <span className="block truncate font-bold text-[11px]">🎒 1 Hora Suelta</span>
                  <span className="text-[10px] text-blue-600 font-bold">$15.00 USD</span>
                </div>
                {amountUsd === 15.00 && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
              </button>
            </div>
          </div>
          
          {isSuccess ? (
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900">¡Pago Registrado Exitosamente!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Tu comprobante ha sido registrado y asociado a tu cuenta. La Directora Waky y Teacher Cokitö están validando tu acceso:
                </p>
              </div>

              {receiptDetails && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-sm mx-auto text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monto:</span>
                    <strong className="text-emerald-700 font-black">${receiptDetails.amount.toFixed(2)} USD</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Comprobante:</span>
                    <strong className="text-slate-900 truncate max-w-[200px]">{receiptDetails.reference}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Concepto:</span>
                    <span className="text-slate-800 truncate max-w-[200px]">{receiptDetails.plan}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 text-[11px]">
                    <span className="text-slate-500">Estado:</span>
                    <span className="text-blue-700 font-bold">En Conciliación Inmediata</span>
                  </div>
                </div>
              )}

              {/* Welcome Lounge WhatsApp button */}
              <a
                href={OFFICIAL_PAGO_MOVIL.whatsappWelcomeLoungeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Unirme al Welcome Lounge en WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
              >
                Volver a la Plataforma
              </button>
            </div>
          ) : (
            <>
              {/* STEP 1: STUDENT IDENTIFICATION (MANDATORY BEFORE PAYING) */}
              {!isAuthenticatedStudent ? (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50/70 border-2 border-blue-200 rounded-2xl space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
                        1
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-blue-950">
                          Identificación del Alumno (Obligatorio)
                        </h4>
                        <p className="text-[11px] text-blue-800/80">
                          ¿A quién le asignamos este pago? Llena tus datos para crear tu usuario y activar tu acceso:
                        </p>
                      </div>
                    </div>
                    {onOpenLogin && (
                      <button
                        type="button"
                        onClick={onOpenLogin}
                        className="text-[11px] font-bold text-blue-700 hover:text-blue-900 underline whitespace-nowrap shrink-0"
                      >
                        Ya tengo cuenta ➔
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Nombre(s) *</label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={e => {
                          setGuestName(e.target.value);
                          setIdentificationError(null);
                        }}
                        placeholder="Ej. Mariana"
                        className="w-full p-2.5 bg-white border border-blue-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Apellido(s) *</label>
                      <input
                        type="text"
                        value={guestLastName}
                        onChange={e => {
                          setGuestLastName(e.target.value);
                          setIdentificationError(null);
                        }}
                        placeholder="Ej. Márquez"
                        className="w-full p-2.5 bg-white border border-blue-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Correo Electrónico *</label>
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={e => {
                          setGuestEmail(e.target.value);
                          setIdentificationError(null);
                        }}
                        placeholder="tu.correo@ejemplo.com"
                        className="w-full p-2.5 bg-white border border-blue-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">WhatsApp / Teléfono *</label>
                      <input
                        type="tel"
                        value={guestPhone}
                        onChange={e => {
                          setGuestPhone(e.target.value);
                          setIdentificationError(null);
                        }}
                        placeholder="+58 412 1234567"
                        className="w-full p-2.5 bg-white border border-blue-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  {identificationError && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-700 flex items-center gap-1.5 font-bold animate-fadeIn">
                      <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>{identificationError}</span>
                    </div>
                  )}

                  {!isGuestFormValid && !identificationError && (
                    <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-center gap-1.5 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Completa tu nombre, apellido, correo y WhatsApp arriba para asociar tu pago y activar tu usuario.</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold text-emerald-950 block">
                        Alumno Identificado: {currentStudent?.name} {currentStudent?.lastName || ''}
                      </span>
                      <span className="text-[11px] text-emerald-700">
                        Cuenta: {currentStudent?.email} • WhatsApp: {currentStudent?.phone || 'Registrado'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                    Perfil Activo
                  </span>
                </div>
              )}

              {/* Payment Method Selector Tabs: 1st PayPal, 2nd Pago Móvil, 3rd Efectivo */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
                
                {/* 1. PayPal Tab (FIRST ALWAYS) */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('paypal')}
                  className={`py-2.5 px-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                    selectedMethod === 'paypal'
                      ? 'bg-white text-blue-800 shadow-xs ring-2 ring-blue-500/20'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <svg className="w-4 h-4 text-[#0079C1] fill-current" viewBox="0 0 24 24">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.786.786 0 0 1 .775-.652h6.812c3.275 0 5.617 1.343 6.074 4.364.28 1.85-.246 3.447-1.565 4.747-1.34 1.32-3.23 2.012-5.618 2.012H8.818l-.946 5.99-.044.254a.64.64 0 0 1-.633.535l-.119.367zm2.493-9.068h1.853c2.25 0 3.79-.824 4.34-2.316.368-.997.23-1.927-.41-2.766-.63-.824-1.748-1.238-3.323-1.238H9.06l-1.49 8.32h2zm.12 7.068h2.008l1.09-6.9h-1.853l-1.245 6.9z" />
                  </svg>
                  <span className="text-[11px] truncate">1. PayPal (USD)</span>
                </button>

                {/* 2. Pago Móvil Tab */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('pagomovil')}
                  className={`py-2.5 px-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                    selectedMethod === 'pagomovil'
                      ? 'bg-white text-emerald-800 shadow-xs ring-2 ring-emerald-500/20'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px] truncate">2. Pago Móvil (Bs)</span>
                </button>

                {/* 3. Dólares en Efectivo Tab */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('cash')}
                  className={`py-2.5 px-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                    selectedMethod === 'cash'
                      ? 'bg-white text-amber-900 shadow-xs ring-2 ring-amber-500/20'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-amber-600" />
                  <span className="text-[11px] truncate">3. Efectivo USD</span>
                </button>

              </div>

              {/* METHOD 1: PAYPAL (100% RELIABLE & FAIL-SAFE) */}
              {selectedMethod === 'paypal' && (
                <div className="space-y-4 animate-fadeIn">
                  
                  {/* Summary & Account Info Card */}
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50/70 border border-blue-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-950 flex items-center gap-1.5">
                        <Lock className="w-4 h-4 text-blue-700" />
                        <span>Pago Directo Internacional con PayPal</span>
                      </span>
                      <span className="text-blue-900 font-black text-base bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200">
                        ${amountUsd.toFixed(2)} USD
                      </span>
                    </div>

                    <p className="text-xs text-blue-900/85 leading-relaxed">
                      Paga de forma instantánea usando tu saldo PayPal o tarjeta de débito/crédito internacional. Al pulsar el botón se abrirá la plataforma oficial de PayPal para procesar tu abono.
                    </p>

                    {/* Verified PayPal Credentials */}
                    <div className="bg-white p-3 rounded-xl border border-blue-200/90 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Cuenta PayPal Oficial:</span>
                        <div className="flex items-center gap-1.5">
                          <strong className="text-blue-950 font-bold">{OFFICIAL_PAYPAL.email}</strong>
                          <button
                            type="button"
                            onClick={() => handleCopy(OFFICIAL_PAYPAL.email, 'paypal_email')}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded-md hover:bg-blue-50 transition-colors"
                            title="Copiar correo de PayPal"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="text-slate-500 font-medium">Titular Receptor:</span>
                        <span className="text-slate-800 font-semibold">{OFFICIAL_PAYPAL.recipientName}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="text-slate-500 font-medium">Monto Exacto:</span>
                        <div className="flex items-center gap-1.5">
                          <strong className="text-emerald-700 font-black">${amountUsd.toFixed(2)} USD</strong>
                          <button
                            type="button"
                            onClick={() => handleCopy(amountUsd.toFixed(2), 'paypal_amount')}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded-md hover:bg-blue-50 transition-colors"
                            title="Copiar monto"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {copiedKey && (
                      <p className="text-[11px] text-emerald-700 font-bold text-center animate-fadeIn">
                        {copiedKey === 'paypal_all' ? '¡Todos los datos de PayPal copiados!' : '¡Copiado al portapapeles!'}
                      </p>
                    )}
                  </div>

                  {/* OFFICIAL PAYPAL SMART BUTTONS (CREDIT / DEBIT CARD & PAYPAL) */}
                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-2xl border border-blue-200/90 shadow-xs space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                        <span className="flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Pagar con Tarjeta Internacional o PayPal:</span>
                        </span>
                        <span className="text-emerald-700 font-black text-sm bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                          ${amountUsd.toFixed(2)} USD
                        </span>
                      </div>

                      <div className="min-h-[140px] pt-1 relative">
                        <PayPalScriptProvider
                          options={{
                            clientId: PAYPAL_CLIENT_ID,
                            currency: 'USD',
                            intent: 'capture',
                            components: 'buttons',
                            'disable-funding': 'paylater,venmo'
                          }}
                        >
                          <PayPalButtons
                            key={`paypal_modal_${amountUsd}_${planName}`}
                            style={{
                              layout: 'vertical',
                              color: 'gold',
                              shape: 'pill',
                              label: 'pay',
                              height: 44
                            }}
                            createOrder={(_data, actions) => {
                              if (!isAuthenticatedStudent && !isGuestFormValid) {
                                setIdentificationError('Por favor completa tu nombre, apellido, correo y WhatsApp arriba antes de pagar para asignar tu cuenta.');
                                return Promise.reject(new Error('Faltan datos de identificación del alumno'));
                              }
                              setIdentificationError(null);
                              const activeId = getActiveStudentIdentity();
                              return actions.order.create({
                                intent: 'CAPTURE',
                                purchase_units: [
                                  {
                                    description: `${planName} - Güakytopia (${activeId.email || activeId.name})`,
                                    amount: {
                                      currency_code: 'USD',
                                      value: amountUsd.toFixed(2)
                                    }
                                  }
                                ]
                              });
                            }}
                            onApprove={async (data, actions) => {
                              try {
                                const details = await actions.order?.capture();
                                const txId = details?.id || data.orderID || `PP-${Date.now()}`;
                                const payerEmail = details?.payer?.email_address || '';
                                const activeId = getActiveStudentIdentity();
                                const methodStr = `PayPal Tarjeta/Cuenta ($${amountUsd.toFixed(2)} USD) [${planName}]`;
                                const refStr = `ID: ${txId}${payerEmail ? ` (${payerEmail})` : ''}`;

                                setReceiptDetails({
                                  method: methodStr,
                                  reference: refStr,
                                  amount: amountUsd,
                                  plan: planName
                                });
                                try { confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } }); } catch {}
                                setIsSuccess(true);
                                if (onPaymentSuccess) {
                                  onPaymentSuccess(methodStr, refStr, !isAuthenticatedStudent ? activeId : undefined);
                                }
                              } catch (err: any) {
                                console.error('Error al capturar pago de PayPal:', err);
                                setPaypalError('Tu pago fue procesado pero hubo un retraso en la sincronización. Por favor copia tu ID de recibo abajo.');
                              }
                            }}
                            onError={(err) => {
                              console.error('PayPal Smart Buttons error:', err);
                              setPaypalError('Error al procesar con tarjeta o PayPal. Verifica que tu tarjeta permita compras internacionales en USD o usa el enlace directo.');
                            }}
                            onCancel={() => {
                              setPaypalError('El pago fue cancelado. Puedes intentar nuevamente cuando desees.');
                            }}
                          />
                        </PayPalScriptProvider>
                      </div>

                      <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Acepta tarjetas de débito o crédito internacionales (Visa, Mastercard, Amex)</span>
                      </div>
                    </div>

                    {paypalError && (
                      <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{paypalError}</span>
                      </div>
                    )}

                    {/* COLLAPSIBLE MANUAL / ALTERNATIVE OPTIONS */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setShowManualPayPal(!showManualPayPal)}
                        className="text-xs text-blue-700 hover:text-blue-900 font-semibold underline flex items-center gap-1 mx-auto"
                      >
                        <span>{showManualPayPal ? '▲ Ocultar opciones de transferencia manual' : '▼ ¿Prefieres transferir manualmente o ya enviaste tu pago?'}</span>
                      </button>

                      {showManualPayPal && (
                        <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 animate-fadeIn text-xs">
                          <div className="space-y-2">
                            <a
                              href={currentPayPalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-2.5 px-3 bg-[#0070BA] hover:bg-[#003087] text-white rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all"
                            >
                              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                              <span>Abrir portal de PayPal para enviar a {OFFICIAL_PAYPAL.email}</span>
                            </a>

                            <div className="flex items-center justify-between text-[11px] text-slate-600">
                              <button
                                type="button"
                                onClick={() => handleCopy(getFullPayPalCopyText(amountUsd, planName), 'paypal_all')}
                                className="text-blue-700 hover:text-blue-900 font-bold underline flex items-center gap-1"
                              >
                                <Copy className="w-3 h-3" />
                                <span>Copiar datos de PayPal</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setShowPaypalQr(!showPaypalQr)}
                                className="text-blue-700 hover:text-blue-900 font-bold underline flex items-center gap-1"
                              >
                                <QrCode className="w-3 h-3" />
                                <span>{showPaypalQr ? 'Ocultar QR' : 'Ver QR móvil'}</span>
                              </button>
                            </div>
                          </div>

                          {showPaypalQr && (
                            <div className="p-3 bg-white border border-blue-200 rounded-xl text-center space-y-2">
                              <span className="text-[11px] font-bold text-slate-800 block">
                                Escanea con la cámara o App de PayPal:
                              </span>
                              <img 
                                src={qrCodeUrl} 
                                alt="QR PayPal" 
                                className="w-32 h-32 object-contain mx-auto border border-slate-200 rounded-lg p-1"
                              />
                            </div>
                          )}

                          {/* FORM TO REPORT & CONFIRM TRANSACTION */}
                          <form onSubmit={handleConfirmPayPal} className="space-y-2.5 pt-2 border-t border-slate-200">
                            <label className="block text-xs font-bold text-slate-800">
                              Reportar ID de transacción previa:
                            </label>
                            <input
                              type="text"
                              value={paypalTransactionId}
                              onChange={(e) => setPaypalTransactionId(e.target.value)}
                              placeholder="Ej. 8XF2910484920..."
                              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                            />
                            <button
                              type="submit"
                              className="w-full py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Validar Comprobante Manual</span>
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* METHOD 2: PAGO MÓVIL (VENEZUELA) */}
              {selectedMethod === 'pagomovil' && (
                <form onSubmit={handleConfirmPagoMovil} className="space-y-4 animate-fadeIn">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-emerald-600" />
                        <span>Datos Oficiales Pago Móvil</span>
                      </span>
                      <div className="text-right">
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md inline-block">
                          Tasa Oficial BCV: Bs. {conversion.rate.toFixed(2)}
                        </span>
                        <span className="text-[9px] text-emerald-700 block mt-0.5">
                          Actualización diaria oficial (12:00 AM VET)
                        </span>
                      </div>
                    </div>

                    {/* BOTÓN COPIAR TODOS LOS DATOS JUNTOS (1 SOLO CLIC) */}
                    <button
                      type="button"
                      onClick={() => handleCopy(getFullPagoMovilCopyText(conversion.formattedBs, 'Inscripción Güakytopia'), 'todos_datos')}
                      className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-2 hover:scale-[1.01]"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copiar todos los datos juntos (1 clic)</span>
                    </button>

                    <div className="space-y-1.5 bg-white p-3 rounded-xl border border-emerald-200 text-slate-700 font-medium">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Banco Receptor:</span>
                        <div className="flex items-center gap-1">
                          <strong className="text-slate-900">{OFFICIAL_PAGO_MOVIL.bankName} ({OFFICIAL_PAGO_MOVIL.bankCode})</strong>
                          <button
                            type="button"
                            onClick={() => handleCopy(OFFICIAL_PAGO_MOVIL.bankName, 'banco')}
                            className="text-emerald-600 hover:text-emerald-700 p-0.5"
                            title="Copiar banco"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Teléfono:</span>
                        <div className="flex items-center gap-1">
                          <strong className="text-slate-900">{OFFICIAL_PAGO_MOVIL.phone}</strong>
                          <button
                            type="button"
                            onClick={() => handleCopy(OFFICIAL_PAGO_MOVIL.phoneRaw, 'tel')}
                            className="text-emerald-600 hover:text-emerald-700 p-0.5"
                            title="Copiar teléfono"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Cédula del Titular:</span>
                        <div className="flex items-center gap-1">
                          <strong className="text-slate-900">{OFFICIAL_PAGO_MOVIL.cedula}</strong>
                          <button
                            type="button"
                            onClick={() => handleCopy(OFFICIAL_PAGO_MOVIL.cedula.replace(/\D/g, ''), 'ci')}
                            className="text-emerald-600 hover:text-emerald-700 p-0.5"
                            title="Copiar cédula"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                        <span className="text-slate-500">Monto Exacto en Bs:</span>
                        <div className="flex items-center gap-1">
                          <strong className="text-emerald-700 font-extrabold text-sm">{conversion.formattedBs}</strong>
                          <button
                            type="button"
                            onClick={() => handleCopy(conversion.bsAmount.toString(), 'monto')}
                            className="text-emerald-600 hover:text-emerald-700 p-0.5"
                            title="Copiar monto exacto"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {copiedKey && (
                      <p className="text-[11px] text-emerald-700 font-bold text-center">
                        {copiedKey === 'todos_datos' ? '¡Todos los datos copiados juntos al portapapeles!' : '¡Dato copiado al portapapeles!'}
                      </p>
                    )}
                  </div>

                  {/* Reference input */}
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Banco Emisor (En orden numérico oficial BCV):
                      </label>
                      <select
                        value={pagoMovilBank}
                        onChange={e => setPagoMovilBank(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      >
                        {VENEZUELAN_BANKS.map((b) => (
                          <option key={b.code} value={b.fullName}>{b.fullName}</option>
                        ))}
                        <option value="Otro">Otro Banco Nacional</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Número de Referencia (Comprobante):
                      </label>
                      <input
                        type="text"
                        value={pagoMovilRef}
                        onChange={e => setPagoMovilRef(e.target.value)}
                        placeholder="Ej. 849201"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Reportar Pago Móvil ({conversion.formattedBs})</span>
                    </button>
                  </div>
                </form>
              )}

              {/* METHOD 3: DÓLARES EN EFECTIVO */}
              {selectedMethod === 'cash' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2.5 text-xs text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-950 flex items-center gap-1.5">
                        <Banknote className="w-4 h-4 text-amber-600" />
                        <span>Pago en Dólares Físicos ($ USD)</span>
                      </span>
                      <strong className="text-amber-900">${amountUsd.toFixed(2)} USD</strong>
                    </div>
                    <p className="text-xs leading-relaxed text-amber-900/90">
                      Entrega directa en <strong>punto de encuentro acordado con la teacher Coquito en Caracas</strong> (coordinado de mutuo acuerdo a través de WhatsApp).
                    </p>
                    <ul className="space-y-1 list-disc list-inside text-[11px] text-slate-600 bg-white p-3 rounded-xl border border-amber-200">
                      <li>Billetes en buen estado (sin roturas, sellos pesados ni tachaduras).</li>
                      <li>Entrega acordada en punto céntrico de Caracas con Teacher Coquito.</li>
                      <li>Recuerda: Todas nuestras clases y campus son 100% online (no existen sedes físicas de clases).</li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmCash}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Acordar Punto de Encuentro con La Teacher (${amountUsd.toFixed(2)} USD)</span>
                  </button>
                </div>
              )}

              {/* Trust Badge */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Activación Directa con La Teacher
                </span>
                <span>Soporte Inmediato</span>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
