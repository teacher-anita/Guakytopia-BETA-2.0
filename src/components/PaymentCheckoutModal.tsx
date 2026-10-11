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
import { OFFICIAL_PAGO_MOVIL, convertUsdToBs, getBcvDetails } from '../services/currencyService';

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: (method: string, reference: string) => void;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'paypal' | 'pagomovil' | 'cash'>('pagomovil');
  
  // Pago Móvil form state
  const [pagoMovilRef, setPagoMovilRef] = useState('');
  const [pagoMovilBank, setPagoMovilBank] = useState('Banco de Venezuela');
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
        // Clear previous render to prevent duplicate buttons
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

    // Attempt immediately
    if (tryRenderPayPal()) return;

    // Retry if SDK is still initializing
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

  const conversion = convertUsdToBs(5, bcvInfo.rate);

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
      onPaymentSuccess(`Pago Móvil (${OFFICIAL_PAGO_MOVIL.bankName} - ${pagoMovilBank})`, pagoMovilRef.trim());
    }
  };

  const handleSimulatePayPal = () => {
    try {
      window.open('https://paypal.me/anateresacsb/5', '_blank');
    } catch {}
    try { confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } }); } catch {}
    setIsSuccess(true);
    if (onPaymentSuccess) {
      onPaymentSuccess('PayPal (anateresa.csb@gmail.com)', `PAYPAL_${Date.now()}`);
    }
  };

  const handleConfirmCash = () => {
    try { confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } }); } catch {}
    setIsSuccess(true);
    if (onPaymentSuccess) {
      onPaymentSuccess('Efectivo USD', 'CASH_CONFIRMED');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 flex flex-col my-auto">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white flex items-start justify-between relative">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full">
                Pase Digital Coquitos
              </span>
              <span className="text-xs text-blue-200 font-semibold">$5 USD mensuales</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
              Métodos de Pago Oficiales
            </h2>
            <p className="text-xs text-blue-200 mt-0.5">
              Acceso mensual ilimitado a los 12 niveles de libros, audios y quizzes.
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
              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
                
                {/* 1. PayPal Tab */}
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
                  <span className="text-[11px] truncate">PayPal</span>
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
                  <span className="text-[11px] truncate">Pago Móvil</span>
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
                  <span className="text-[11px] truncate">Efectivo USD</span>
                </button>

              </div>

              {/* METHOD 1: PAYPAL */}
              {selectedMethod === 'paypal' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-950 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-blue-700" />
                        <span>Pago Seguro Internacional Oficial</span>
                      </span>
                      <span className="text-blue-700 font-bold">$5.00 USD</span>
                    </div>
                    <p className="text-xs text-blue-900/80 leading-relaxed">
                      Paga $5 USD mensuales con tu saldo PayPal, tarjeta de débito o crédito internacional. Tu suscripción se activará inmediatamente.
                    </p>
                    <div className="pt-2 flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-blue-200">
                      <span className="text-slate-600">Comercio oficial:</span>
                      <strong className="text-blue-900">Güakytopia (anateresa.csb@gmail.com)</strong>
                    </div>
                  </div>

                  {/* Official PayPal Hosted Button Live Container */}
                  <div className="space-y-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div className="text-center">
                      <span className="text-xs font-bold text-slate-800">Botón Oficial PayPal Güakytopia ($5):</span>
                    </div>

                    {!paypalLoaded && (
                      <div className="py-4 text-xs text-slate-500 flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-[#0079C1] border-t-transparent rounded-full animate-spin"></div>
                        <span>Conectando con PayPal...</span>
                      </div>
                    )}

                    {/* Container where PayPal Hosted Buttons renders */}
                    <div 
                      id="paypal-container-GEB2U9VHZC3BQ" 
                      className="w-full flex justify-center min-h-[45px]"
                    ></div>

                    <div className="text-center pt-1">
                      <p className="text-[10px] text-slate-500">
                        Al hacer clic en el botón amarillo de PayPal o Tarjeta, serás atendido por el portal seguro de PayPal.
                      </p>
                    </div>
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
                                onPaymentSuccess('PayPal Hosted Checkout (GEB2U9VHZC3BQ)', paypalReportRef.trim() || `PAYPAL_${Date.now()}`);
                              }
                            }}
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold whitespace-nowrap shadow-xs"
                          >
                            Confirmar
                          </button>
                        </div>
                      </div>
                    )}

                    <a
                      href="https://paypal.me/anateresacsb/5"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Enlace directo alternativo: paypal.me/anateresacsb/5</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
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
                      <p className="text-[11px] text-emerald-700 font-bold text-center">¡Dato copiado al portapapeles!</p>
                    )}
                  </div>

                  {/* Reference input */}
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Banco Emisor:
                      </label>
                      <select
                        value={pagoMovilBank}
                        onChange={e => setPagoMovilBank(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      >
                        <option value="Banco de Venezuela">Banco de Venezuela</option>
                        <option value="Banesco">Banesco</option>
                        <option value="Mercantil">Mercantil</option>
                        <option value="Bancamiga">Bancamiga</option>
                        <option value="Banco Provincial">Banco Provincial</option>
                        <option value="BNC">BNC (Banco Nacional de Crédito)</option>
                        <option value="Otro">Otro Banco</option>
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
                      <strong className="text-amber-900">$5.00 USD</strong>
                    </div>
                    <p className="text-xs leading-relaxed text-amber-900/90">
                      Puedes cancelar tu mensualidad del Pase Digital en efectivo ($5 en billete sin roturas) en la sede de clases presenciales o punto de encuentro acordado con Teacher Cokitö.
                    </p>
                    <ul className="space-y-1 list-disc list-inside text-[11px] text-slate-600 bg-white p-3 rounded-xl border border-amber-200">
                      <li>Billetes en buen estado (sin sellos ni roturas).</li>
                      <li>Recibirás un comprobante digital instantáneo de tu pago.</li>
                      <li>Activación inmediata del Pase Digital para la app.</li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmCash}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar Pago en Efectivo ($5)</span>
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
