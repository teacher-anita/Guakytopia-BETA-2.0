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
  MessageCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  OFFICIAL_PAGO_MOVIL, 
  convertUsdToBs, 
  getBcvDetails, 
  VENEZUELAN_BANKS, 
  getFullPagoMovilCopyText 
} from '../services/currencyService';

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: (method: string, reference: string) => void;
  initialPlanName?: string;
  initialAmountUsd?: number;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  initialPlanName = 'Membresía Plataforma Campus Güakytopia (Promo $4.99)',
  initialAmountUsd = 4.99
}) => {
  // Always default to PayPal as requested
  const [selectedMethod, setSelectedMethod] = useState<'paypal' | 'pagomovil' | 'cash'>('paypal');
  const [planName, setPlanName] = useState(initialPlanName);
  const [amountUsd, setAmountUsd] = useState(initialAmountUsd);

  useEffect(() => {
    if (initialPlanName) setPlanName(initialPlanName);
    if (initialAmountUsd) setAmountUsd(initialAmountUsd);
  }, [initialPlanName, initialAmountUsd, isOpen]);
  
  // Pago Móvil form state
  const [pagoMovilRef, setPagoMovilRef] = useState('');
  const [pagoMovilBank, setPagoMovilBank] = useState('0102 - Banco de Venezuela Banco Universal');
  const [pagoMovilSenderName, setPagoMovilSenderName] = useState('');
  
  // Copy notice
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Submission notice
  const [isSuccess, setIsSuccess] = useState(false);

  // Live BCV rate details
  const [bcvInfo, setBcvInfo] = useState(() => getBcvDetails());

  // PayPal Hosted Buttons state
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [paypalReportRef, setPaypalReportRef] = useState('');
  const [showPaypalManualConfirm, setShowPaypalManualConfirm] = useState(false);

  useEffect(() => {
    const handleBcvUpdate = () => {
      setBcvInfo(getBcvDetails());
    };
    window.addEventListener('bcv_rate_updated', handleBcvUpdate);
    return () => window.removeEventListener('bcv_rate_updated', handleBcvUpdate);
  }, []);

  // Effect to render PayPal Hosted Button GEB2U9VHZC3BQ
  useEffect(() => {
    if (!isOpen || selectedMethod !== 'paypal') return;

    let isMounted = true;
    let attempts = 0;
    const containerId = 'paypal-container-GEB2U9VHZC3BQ';

    const tryRenderPayPal = () => {
      const container = document.getElementById(containerId);
      if (!container || !isMounted) return false;

      const paypalObj = (window as any).paypal;
      if (paypalObj && typeof paypalObj.HostedButtons === 'function') {
        container.innerHTML = '';
        try {
          paypalObj.HostedButtons({
            hostedButtonId: 'GEB2U9VHZC3BQ'
          })
          .render(`#${containerId}`)
          .then(() => {
            if (isMounted) setPaypalLoaded(true);
          })
          .catch((err: any) => {
            console.warn('PayPal render note:', err);
            if (isMounted) setPaypalLoaded(true);
          });
          return true;
        } catch (err) {
          console.warn('PayPal HostedButtons invocation note:', err);
          return false;
        }
      }
      return false;
    };

    if (tryRenderPayPal()) return;

    const interval = setInterval(() => {
      attempts++;
      if (tryRenderPayPal() || attempts > 25) {
        clearInterval(interval);
        if (attempts > 25 && isMounted) {
          setPaypalLoaded(true);
        }
      }
    }, 200);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isOpen, selectedMethod]);

  const conversion = convertUsdToBs(amountUsd, bcvInfo.rate);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleConfirmPagoMovil = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pagoMovilRef.trim()) {
      alert('Por favor ingresa el número de referencia de tu Pago Móvil.');
      return;
    }
    try { confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } }); } catch {}
    setIsSuccess(true);
    if (onPaymentSuccess) {
      onPaymentSuccess(`Pago Móvil (${OFFICIAL_PAGO_MOVIL.bankName} - ${pagoMovilBank}) [${planName}]`, pagoMovilRef.trim());
    }
  };

  const handleSimulatePayPal = () => {
    try {
      window.open(`https://paypal.me/anateresacsb/${amountUsd}`, '_blank');
    } catch {}
    try { confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } }); } catch {}
    setIsSuccess(true);
    if (onPaymentSuccess) {
      onPaymentSuccess(`PayPal (anateresa.csb@gmail.com - $${amountUsd} USD) [${planName}]`, paypalReportRef.trim() || `PAYPAL_${Date.now()}`);
    }
  };

  const handleConfirmCash = () => {
    try { confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } }); } catch {}
    setIsSuccess(true);
    if (onPaymentSuccess) {
      onPaymentSuccess(`Efectivo ($${amountUsd} USD) [${planName}]`, 'CASH_CONFIRMED');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 flex flex-col my-auto">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white flex items-start justify-between relative">
          <div>
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
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          
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
                    ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold'
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
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold'
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
                    ? 'border-blue-500 bg-blue-50 text-blue-950 font-bold'
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
                  La Directora Waky está validando tu referencia bancaria. Mientras tanto, únete a nuestra comunidad oficial:
                </p>
              </div>

              {/* Welcome Lounge WhatsApp button */}
              <a
                href={OFFICIAL_PAGO_MOVIL.whatsappWelcomeLoungeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-101"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Unirme al Welcome Lounge en WhatsApp</span>
              </a>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
              >
                Volver a la Plataforma
              </button>
            </div>
          ) : (
            <>
              {/* Payment Method Selector Tabs: 1st PayPal, 2nd Pago Móvil, 3rd Efectivo */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
                
                {/* 1. PayPal Tab (FIRST ALWAYS) */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('paypal')}
                  className={`py-2.5 px-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                    selectedMethod === 'paypal'
                      ? 'bg-white text-blue-800 shadow-xs'
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
                      ? 'bg-white text-emerald-800 shadow-xs'
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
                      ? 'bg-white text-amber-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-amber-600" />
                  <span className="text-[11px] truncate">3. Efectivo USD</span>
                </button>

              </div>

              {/* METHOD 1: PAYPAL */}
              {selectedMethod === 'paypal' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-950 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-blue-700" />
                        <span>Pago Directo Internacional con PayPal</span>
                      </span>
                      <span className="text-blue-700 font-bold text-sm">${amountUsd.toFixed(2)} USD</span>
                    </div>
                    <p className="text-xs text-blue-900/80 leading-relaxed">
                      Paga ${amountUsd.toFixed(2)} USD de forma instantánea usando tu saldo PayPal, tarjeta de débito o tarjeta de crédito internacional.
                    </p>
                    <div className="pt-2 flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-blue-200">
                      <span className="text-slate-600">Cuenta PayPal oficial:</span>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-blue-900">anateresa.csb@gmail.com</strong>
                        <button
                          type="button"
                          onClick={() => handleCopy('anateresa.csb@gmail.com', 'paypal_email')}
                          className="text-blue-600 hover:text-blue-800 p-0.5"
                          title="Copiar correo de PayPal"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Direct PayPal Link Button (Prominent & Primary) */}
                  <a
                    href={`https://paypal.me/anateresacsb/${amountUsd}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 px-4 bg-[#0079C1] hover:bg-[#005ea6] text-white rounded-2xl font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-101"
                  >
                    <svg className="w-4 h-4 text-white fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.786.786 0 0 1 .775-.652h6.812c3.275 0 5.617 1.343 6.074 4.364.28 1.85-.246 3.447-1.565 4.747-1.34 1.32-3.23 2.012-5.618 2.012H8.818l-.946 5.99-.044.254a.64.64 0 0 1-.633.535l-.119.367zm2.493-9.068h1.853c2.25 0 3.79-.824 4.34-2.316.368-.997.23-1.927-.41-2.766-.63-.824-1.748-1.238-3.323-1.238H9.06l-1.49 8.32h2zm.12 7.068h2.008l1.09-6.9h-1.853l-1.245 6.9z" />
                    </svg>
                    <span>Pagar ${amountUsd.toFixed(2)} USD vía PayPal.Me</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {/* Official PayPal Hosted Button Live Container */}
                  <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div className="text-center">
                      <span className="text-xs font-bold text-slate-800">Botón Oficial PayPal Checkout:</span>
                    </div>

                    {/* Container where PayPal Hosted Buttons renders */}
                    <div 
                      id="paypal-container-GEB2U9VHZC3BQ" 
                      className="w-full flex justify-center min-h-[45px]"
                    ></div>

                    {!paypalLoaded && (
                      <div className="text-center pt-1">
                        <button
                          type="button"
                          onClick={() => window.open(`https://paypal.me/anateresacsb/${amountUsd}`, '_blank')}
                          className="text-xs font-bold text-blue-700 hover:text-blue-900 underline"
                        >
                          Haz clic aquí si el botón de PayPal tarda en cargar
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Post-Payment or Fallback Confirmation */}
                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">¿Ya realizaste el pago en PayPal?</span>
                      <button
                        type="button"
                        onClick={() => setShowPaypalManualConfirm(!showPaypalManualConfirm)}
                        className="text-blue-600 hover:text-blue-800 font-bold underline text-xs"
                      >
                        {showPaypalManualConfirm ? 'Ocultar' : 'Reportar comprobante'}
                      </button>
                    </div>

                    {showPaypalManualConfirm && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-2 animate-fadeIn">
                        <label className="block text-[11px] font-semibold text-blue-950">
                          ID de Transacción de PayPal o Correo del Pagador:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={paypalReportRef}
                            onChange={(e) => setPaypalReportRef(e.target.value)}
                            placeholder="Ej. 8XF291048... o micorreo@gmail.com"
                            className="flex-1 p-2 bg-white border border-blue-200 rounded-lg text-xs font-semibold"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              try { confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } }); } catch {}
                              setIsSuccess(true);
                              if (onPaymentSuccess) {
                                onPaymentSuccess(`PayPal ($${amountUsd} USD) [${planName}]`, paypalReportRef.trim() || `PAYPAL_${Date.now()}`);
                              }
                            }}
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold whitespace-nowrap shadow-xs"
                          >
                            Confirmar
                          </button>
                        </div>
                      </div>
                    )}
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
