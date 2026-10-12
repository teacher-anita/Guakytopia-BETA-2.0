import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Users, 
  User, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  CreditCard, 
  ShieldCheck, 
  HelpCircle,
  Zap,
  TrendingDown,
  Info
} from 'lucide-react';
import { INTENSITY_PLANS } from '../data/curriculumData';
import { PlanIntensity, GroupSize, BillingFrequency } from '../types';
import { convertUsdToBs, getBcvDetails } from '../services/currencyService';

interface PricingCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPayment: (planName: string, amountUsd: number) => void;
}

export const PricingCalculatorModal: React.FC<PricingCalculatorModalProps> = ({
  isOpen,
  onClose,
  onSelectPayment
}) => {
  const [selectedPax, setSelectedPax] = useState<GroupSize>('individual');
  const [selectedIntensity, setSelectedIntensity] = useState<PlanIntensity>('basic');
  const [billingFrequency, setBillingFrequency] = useState<BillingFrequency>('monthly');
  const [bcvInfo, setBcvInfo] = useState(() => getBcvDetails());
  const [pricingMode, setPricingMode] = useState<'regular' | 'prepaid'>('regular');
  const [prepaidHours, setPrepaidHours] = useState<number>(6);

  useEffect(() => {
    const handleBcv = () => setBcvInfo(getBcvDetails());
    window.addEventListener('bcv_rate_updated', handleBcv);
    return () => window.removeEventListener('bcv_rate_updated', handleBcv);
  }, []);

  if (!isOpen) return null;

  const plan = INTENSITY_PLANS[selectedIntensity];

  // Pax configuration details
  const paxMap = {
    individual: { count: 1, label: 'Individual (1 Pax)', badge: 'Privada & 100% Flexible', desc: 'Clases individuales 1 a 1: úsalas para avanzar lección, repasar, preparar exámenes escolares o hablar libremente.' },
    duo: { count: 2, label: 'Dúo (2 Pax)', badge: 'Pareja de Estudio', desc: 'Compañero fijo. Obligatorio pago mensual anticipado para garantizar el ritmo y cupo del grupo.' },
    squad3: { count: 3, label: 'Trío (3 Pax)', badge: 'Manada Compacta', desc: 'Interacción grupal dinámica. Obligatorio pago mensual anticipado de todos los integrantes.' },
    crew4: { count: 4, label: 'Flock (4 Pax)', badge: 'Máximo Ahorro', desc: 'Manada completa de 4 personas. Máximo descuento por alumno con pago mensual adelantado.' }
  };

  const isGroup = selectedPax !== 'individual';

  // Extract rates
  const hourlyRate = plan.hourlyRates ? plan.hourlyRates[selectedPax] : 15;
  const weeklyTotal = plan.prices[selectedPax];
  const weeklyPerPax = plan.perPaxWeekly ? plan.perPaxWeekly[selectedPax] : weeklyTotal / paxMap[selectedPax].count;

  const monthlyTotal = plan.monthlyPrices ? plan.monthlyPrices[selectedPax] : weeklyTotal * 4;
  const monthlyPerPax = plan.perPaxMonthly ? plan.perPaxMonthly[selectedPax] : monthlyTotal / paxMap[selectedPax].count;

  // Monthly standard vs discounted savings
  const standard4WeeksTotal = weeklyTotal * 4;
  const standard4WeeksPerPax = weeklyPerPax * 4;
  const monthlySavings = standard4WeeksTotal - monthlyTotal;

  // Selected payment amount
  const displayAmount = isGroup
    ? (billingFrequency === 'monthly' ? monthlyPerPax : weeklyPerPax)
    : (billingFrequency === 'monthly' ? monthlyTotal : weeklyTotal);

  const displayTotalGroup = billingFrequency === 'monthly' ? monthlyTotal : weeklyTotal;

  const bsConversion = convertUsdToBs(displayAmount, bcvInfo.rate);

  // PrePaid Classes calculations (Exclusively for individual classes: min 6 hours at $10/h)
  const prepaidTotalUsd = prepaidHours * 10;
  const prepaidBsConversion = convertUsdToBs(prepaidTotalUsd, bcvInfo.rate);
  const prepaidSavingsVsRegular = (prepaidHours * 15) - prepaidTotalUsd; // Regular individual rate is $15/h

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white flex items-start justify-between relative shrink-0">
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
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Tarifario Oficial Güakytopia
              </span>
              <span className="text-xs text-blue-200 font-semibold">
                Transparencia 100% • Tasa Oficial BCV
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
              Planes, Tarifas y Calculadora de Inversión
            </h2>
            <p className="text-xs text-blue-200/90 mt-0.5">
              Descubre el costo exacto por alumno según el tamaño de tu manada y tus horas de clase semanales.
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

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* SECTION 1: PLATFORM MEMBERSHIP WITH $7 -> $4.99 LAUNCH PROMO */}
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-300 rounded-3xl p-4 sm:p-5 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white px-2.5 py-0.5 rounded-full">
                    ⚡ Promo de Lanzamiento Limitada
                  </span>
                  <span className="text-[11px] font-bold text-amber-900">
                    Membresía Campus Güakytopia
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Acceso Total al Nido Digital Autónomo
                </h3>
                <p className="text-xs text-slate-600 max-w-md leading-relaxed">
                  Todos los 12 niveles de libros oficiales (Super Goal & Mega Goal), quizzes automáticos con el Cyber Owl, audios nativos y retos diarios.
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                  <span>Precio estándar:</span>
                  <span className="line-through font-bold text-slate-400">$7.00 USD/mes</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">El 7 es el número de Dios</span>
                </div>
              </div>

              {/* Price & Action Badge */}
              <div className="bg-white rounded-2xl p-3.5 border border-amber-200 shadow-sm text-center min-w-[140px] shrink-0 w-full sm:w-auto">
                <div className="text-[10px] font-black text-amber-700 uppercase tracking-wider">
                  ¡Solo por tiempo limitado!
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 leading-none my-1">
                  $4.99 <span className="text-xs text-slate-500 font-bold">USD / mes</span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  Calculados a tasa oficial BCV
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSelectPayment('Membresía Digital Campus Güakytopia (Promo $4.99)', 4.99);
                  }}
                  className="mt-2 w-full py-1.5 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-1"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Suscribirme</span>
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: LIVE CLASSES INTERACTIVE CALCULATOR */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-2 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">👩‍🏫</span>
                <h3 className="text-base font-black text-slate-900">
                  Clases con Teacher Cokitö
                </h3>
              </div>
              
              {/* Mode Toggle: Regular Plans vs PrePaid Classes */}
              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPricingMode('regular')}
                  className={`py-1.5 px-3 rounded-lg transition-all ${
                    pricingMode === 'regular'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Horario Fijo Semanal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPricingMode('prepaid');
                    setSelectedPax('individual');
                  }}
                  className={`py-1.5 px-3 rounded-lg transition-all flex items-center gap-1 ${
                    pricingMode === 'prepaid'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-emerald-700 hover:text-emerald-900'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>PrePaid Classes ($10/h)</span>
                </button>
              </div>
            </div>

            {/* PREPAID CLASSES VIEW */}
            {pricingMode === 'prepaid' ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <span className="text-[11px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">
                      ⭐ PrePaid Classes
                    </span>
                    <span className="text-xs font-bold text-emerald-800">
                      Exclusivo para Clases Individuales (1 a 1)
                    </span>
                  </div>
                  <p className="text-xs text-emerald-950/90 leading-relaxed">
                    Prepara o adelanta tus horas individuales a tu propio ritmo. Todas las horas que prepagues te salen a <strong>$10 USD / hora</strong> (mínimo 6 horas, tarifa regular $15/h). Úsalas en un plazo de 30 días para lección de avance, dudas escolares o conversación libre con Teacher Cokitö.
                  </p>
                </div>

                {/* Hours Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Selecciona el número de horas individuales a prepagar (Mínimo 6 horas):
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[6, 8, 10, 12, 16, 20].map((hrs) => {
                      const isSelected = prepaidHours === hrs;
                      return (
                        <button
                          key={hrs}
                          type="button"
                          onClick={() => setPrepaidHours(hrs)}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20 font-black shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                          }`}
                        >
                          <div className="text-sm font-black">{hrs} hrs</div>
                          <div className="text-[10px] text-slate-500 font-bold">${hrs * 10} USD</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Manual Stepper */}
                  <div className="mt-3 flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="text-xs">
                      <span className="font-bold text-slate-800">¿Deseas otra cantidad de horas?</span>
                      <span className="text-[11px] text-slate-500 block">Mínimo 6 horas • $10 cada una</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPrepaidHours(prev => Math.max(6, prev - 1))}
                        disabled={prepaidHours <= 6}
                        className="w-8 h-8 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold disabled:opacity-40 hover:bg-slate-100 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="text-sm font-black text-slate-900 w-8 text-center">{prepaidHours}</span>
                      <button
                        type="button"
                        onClick={() => setPrepaidHours(prev => prev + 1)}
                        className="w-8 h-8 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold hover:bg-slate-100 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* PrePaid Classes Summary Card */}
                <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                          PrePaid Classes
                        </span>
                        <span className="text-[10px] bg-slate-800 text-blue-200 px-2 py-0.5 rounded-full font-bold">
                          {prepaidHours} Horas Individuales • $10.00 USD/h
                        </span>
                      </div>
                      <h4 className="text-base font-black mt-0.5 text-slate-200">
                        Ahorro de ${prepaidSavingsVsRegular.toFixed(2)} USD vs tarifa regular ($15/h)
                      </h4>
                    </div>

                    <div className="text-right sm:text-right">
                      <div className="text-xs text-slate-400 font-semibold">Total a pagar:</div>
                      <div className="text-3xl font-black text-emerald-400 leading-none my-0.5">
                        ${prepaidTotalUsd.toFixed(2)}{' '}
                        <span className="text-xs text-slate-300 font-normal">USD</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        ≈ {prepaidBsConversion.formattedBs} (Tasa BCV)
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-200">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-300">
                        Flexibilidad Total: Agenda tus horas cuando quieras
                      </span>
                      <p className="text-[11px] text-emerald-200/90 leading-relaxed mt-0.5">
                        Dispones de 30 días calendario para consumir tus {prepaidHours} horas prepagadas directamente en la plataforma o coordinándolas por WhatsApp con Teacher Cokitö.
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-1 flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectPayment(
                          `PrePaid Classes (${prepaidHours} Horas Individuales - $10/h)`,
                          prepaidTotalUsd
                        );
                      }}
                      className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Prepagar {prepaidHours} Horas con PayPal o Pago Móvil (${prepaidTotalUsd.toFixed(2)} USD)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={onClose}
                      className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl text-xs transition-colors"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              /* REGULAR PLANS VIEW */
              <div className="space-y-4 animate-fadeIn">
                {/* 1. Selector de Pax (Tamaño de la Manada) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    1. Selecciona la modalidad de tu clase:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['individual', 'duo', 'squad3', 'crew4'] as GroupSize[]).map((paxKey) => {
                      const info = paxMap[paxKey];
                      const isSelected = selectedPax === paxKey;
                      return (
                        <button
                          key={paxKey}
                          type="button"
                          onClick={() => {
                            setSelectedPax(paxKey);
                            if (paxKey !== 'individual') {
                              setBillingFrequency('monthly');
                            }
                          }}
                          className={`p-3 rounded-2xl border text-left transition-all relative ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-black text-slate-900">{info.label}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                          </div>
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded-md mt-1 inline-block">
                            {info.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    ℹ️ {paxMap[selectedPax].desc}
                  </p>
                </div>

                {/* 2. Selector de Carga Horaria Semanal */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    2. Selecciona la intensidad horaria semanal:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'basic' as PlanIntensity, hours: 2, label: '2 h / semana', sub: 'Lun-Mié o Mar-Jue (1h)' },
                      { id: 'regular' as PlanIntensity, hours: 3, label: '3 h / semana', sub: 'Lun-Mié o Mar-Jue (1.5h)' },
                      { id: 'intensive' as PlanIntensity, hours: 4, label: '4 h / semana', sub: 'Lun-Mié o Mar-Jue (2h)' },
                      { id: 'super_intensive' as PlanIntensity, hours: 6, label: '6 h / semana', sub: '3 días x 2h (Lun-Mié-Vie)' }
                    ].map((item) => {
                      const isSelected = selectedIntensity === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedIntensity(item.id)}
                          className={`p-2.5 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'border-[#2EC4B6] bg-[#2EC4B6]/10 ring-2 ring-[#2EC4B6]/30 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-900">{item.label}</span>
                            {isSelected && <Zap className="w-3.5 h-3.5 text-[#2EC4B6] fill-[#2EC4B6]" />}
                          </div>
                          <span className="text-[10px] text-slate-500 block mt-0.5 leading-tight">{item.sub}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Selector de Esquema de Frecuencia de Cobro */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-700">
                      3. Modalidad de Pago:
                    </label>
                    {isGroup && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                        ⚠️ Grupos requieren prepago mensual obligatorio
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setBillingFrequency('weekly')}
                      disabled={isGroup}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        billingFrequency === 'weekly' && !isGroup
                          ? 'bg-white text-slate-900 shadow-xs'
                          : isGroup
                          ? 'text-slate-400 opacity-60 cursor-not-allowed'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title={isGroup ? 'Para grupos de 2 o más pax, el pago debe ser mensual adelantado' : ''}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Semana a Semana</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBillingFrequency('monthly')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        billingFrequency === 'monthly'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>Prepago Mensual (Con Descuento ⭐)</span>
                    </button>
                  </div>
                </div>

                {/* REAL-TIME CALCULATION SUMMARY CARD */}
                <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                          Resumen de Inversión
                        </span>
                        <span className="text-[10px] bg-slate-800 text-blue-200 px-2 py-0.5 rounded-full font-bold">
                          {plan.hoursPerWeek} horas semanales • {paxMap[selectedPax].label}
                        </span>
                      </div>
                      <h4 className="text-lg font-black mt-0.5">
                        Tarifa: ${hourlyRate.toFixed(2)} USD / hora
                      </h4>
                    </div>

                    <div className="text-right sm:text-right">
                      <div className="text-xs text-slate-400 font-semibold">
                        {isGroup ? 'Monto por alumno:' : 'Inversión total:'}
                      </div>
                      <div className="text-3xl font-black text-emerald-400 leading-none my-0.5">
                        ${displayAmount.toFixed(2)}{' '}
                        <span className="text-xs text-slate-300 font-normal">
                          USD {billingFrequency === 'monthly' ? '/ mes' : '/ semana'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        ≈ {bsConversion.formattedBs} (Tasa BCV)
                      </div>
                    </div>
                  </div>

                  {/* Group total notice if multi-pax */}
                  {isGroup && (
                    <div className="flex items-center justify-between text-xs bg-slate-800/80 p-2.5 rounded-xl text-slate-300">
                      <span>Monto total de la manada ({paxMap[selectedPax].count} personas):</span>
                      <strong className="text-white font-bold text-sm">
                        ${displayTotalGroup.toFixed(2)} USD {billingFrequency === 'monthly' ? '/ mes' : '/ semana'}
                      </strong>
                    </div>
                  )}

                  {/* Monthly Savings Notice */}
                  {billingFrequency === 'monthly' && (
                    <div className="p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-200">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-emerald-300">
                          ¡Ahorro garantizado por prepago de mes calendario!
                        </span>
                        <p className="text-[11px] text-emerald-200/90 leading-relaxed mt-0.5">
                          Al abonar el mes por adelantado, ahorras ${monthlySavings.toFixed(2)} USD vs el pago semanal individual, garantizando el cupo de tu horario reservado durante 30 días calendario.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-1 flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectPayment(
                          `Clase ${paxMap[selectedPax].label} (${plan.hoursPerWeek}h/sem) - ${billingFrequency === 'monthly' ? 'Prepago Mensual' : 'Cuota Semanal'}`,
                          displayAmount
                        );
                      }}
                      className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pagar con PayPal o Pago Móvil (${displayAmount.toFixed(2)} USD)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={onClose}
                      className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl text-xs transition-colors"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
