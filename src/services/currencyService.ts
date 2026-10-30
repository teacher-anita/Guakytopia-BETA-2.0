// Exchange Rate and Payment Details Service for Güakytopia Academy
// Sourced directly from Banco Central de Venezuela (BCV) with automated midnight (12:00 AM VET) updates.

export interface PaymentCredentials {
  bankName: string;
  bankCode: string;
  cedula: string;
  phone: string;
  phoneRaw: string;
  whatsappWelcomeLoungeUrl: string;
}

export const OFFICIAL_PAGO_MOVIL: PaymentCredentials = {
  bankName: 'Banco de Venezuela',
  bankCode: '0102',
  cedula: 'V-18.313.077',
  phone: '0412 978 3540',
  phoneRaw: '04129783540',
  whatsappWelcomeLoungeUrl: 'https://chat.whatsapp.com/IgwV4BKKgOEAomBpfMOcjK'
};

export const DEFAULT_BCV_RATE = 875.65; // Live official fallback rate Bs/USD

const OFFICIAL_RATE_KEY = 'cokito_bcv_official_rate';
const OVERRIDE_KEY = 'cokito_bcv_rate_override';
const EFFECTIVE_DATE_KEY = 'cokito_bcv_effective_date';
const LAST_UPDATED_KEY = 'cokito_bcv_last_updated';
const SOURCE_KEY = 'cokito_bcv_source';

export interface BcvDetails {
  rate: number;
  officialRate: number;
  isManualOverride: boolean;
  effectiveDate: string;
  lastUpdated: string;
  source: string;
  status: 'official' | 'cached' | 'fallback' | 'override';
  hoursUntilMidnight: number;
}

// Calculate milliseconds until next 12:00:05 AM in Venezuela (VET, UTC-4)
export function getMsUntilMidnightVET(): number {
  const now = new Date();
  const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
  const vetOffsetMs = -4 * 60 * 60 * 1000;
  const vetTime = new Date(utcMs + vetOffsetMs);

  const nextMidnight = new Date(vetTime);
  nextMidnight.setDate(nextMidnight.getDate() + 1);
  nextMidnight.setHours(0, 0, 5, 0); // 12:00:05 AM

  const diff = nextMidnight.getTime() - vetTime.getTime();
  return diff > 0 ? diff : 24 * 60 * 60 * 1000;
}

export const getBcvDetails = (): BcvDetails => {
  let officialRate = DEFAULT_BCV_RATE;
  let isOverride = false;
  let overrideRate: number | null = null;
  let effectiveDate = new Date().toISOString().split('T')[0];
  let lastUpdated = new Date().toISOString();
  let source = 'Banco Central de Venezuela (BCV)';

  try {
    const storedOfficial = localStorage.getItem(OFFICIAL_RATE_KEY);
    if (storedOfficial) {
      const parsed = parseFloat(storedOfficial);
      if (!isNaN(parsed) && parsed > 0) officialRate = parsed;
    }

    const storedDate = localStorage.getItem(EFFECTIVE_DATE_KEY);
    if (storedDate) effectiveDate = storedDate;

    const storedLast = localStorage.getItem(LAST_UPDATED_KEY);
    if (storedLast) lastUpdated = storedLast;

    const storedSource = localStorage.getItem(SOURCE_KEY);
    if (storedSource) source = storedSource;

    const storedOverride = localStorage.getItem(OVERRIDE_KEY);
    if (storedOverride) {
      const parsedOverride = parseFloat(storedOverride);
      if (!isNaN(parsedOverride) && parsedOverride > 0) {
        isOverride = true;
        overrideRate = parsedOverride;
      }
    }
  } catch {}

  const activeRate = isOverride && overrideRate ? overrideRate : officialRate;
  const hoursUntilMidnight = Number((getMsUntilMidnightVET() / 3600000).toFixed(1));

  return {
    rate: activeRate,
    officialRate,
    isManualOverride: isOverride,
    effectiveDate,
    lastUpdated,
    source,
    status: isOverride ? 'override' : 'official',
    hoursUntilMidnight
  };
};

export const getBcvExchangeRate = (): number => {
  return getBcvDetails().rate;
};

// Notify all mounted views about rate changes
function dispatchBcvUpdateEvent(rate: number) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('bcv_rate_updated', { detail: { rate } }));
  }
}

// Allows Principal Waky to set a temporary manual override
export const setBcvExchangeRateOverride = (newRate: number): void => {
  try {
    if (newRate > 0) {
      localStorage.setItem(OVERRIDE_KEY, newRate.toFixed(2));
      dispatchBcvUpdateEvent(newRate);
    }
  } catch {}
};

// Restore automatic official BCV rates
export const clearBcvExchangeRateOverride = (): number => {
  try {
    localStorage.removeItem(OVERRIDE_KEY);
  } catch {}
  const fresh = getBcvExchangeRate();
  dispatchBcvUpdateEvent(fresh);
  return fresh;
};

// Fetch live official rate from server proxy or direct official source
export const fetchLiveBcvRate = async (force: boolean = false): Promise<number> => {
  try {
    // 1. Try server backend endpoint first
    const serverRes = await fetch(force ? '/api/bcv/sync' : '/api/bcv', {
      method: force ? 'POST' : 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-cache'
    });

    if (serverRes.ok) {
      const data = await serverRes.json();
      if (data && typeof data.rate === 'number' && data.rate > 0) {
        localStorage.setItem(OFFICIAL_RATE_KEY, data.rate.toString());
        if (data.effectiveDate) localStorage.setItem(EFFECTIVE_DATE_KEY, data.effectiveDate);
        if (data.lastChecked) localStorage.setItem(LAST_UPDATED_KEY, data.lastChecked);
        if (data.source) localStorage.setItem(SOURCE_KEY, data.source);
        
        const details = getBcvDetails();
        dispatchBcvUpdateEvent(details.rate);
        return details.rate;
      }
    }
  } catch {
    // Server proxy failed, try direct official provider
  }

  // 2. Direct client fallback to official BCV data
  try {
    const response = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', { cache: 'no-cache' });
    if (response.ok) {
      const data = await response.json();
      if (data && typeof data.promedio === 'number' && data.promedio > 0) {
        const val = Number(data.promedio.toFixed(4));
        localStorage.setItem(OFFICIAL_RATE_KEY, val.toString());
        if (data.fechaActualizacion) {
          localStorage.setItem(EFFECTIVE_DATE_KEY, data.fechaActualizacion.split('T')[0]);
          localStorage.setItem(LAST_UPDATED_KEY, data.fechaActualizacion);
        }
        localStorage.setItem(SOURCE_KEY, 'Banco Central de Venezuela (BCV)');
        const details = getBcvDetails();
        dispatchBcvUpdateEvent(details.rate);
        return details.rate;
      }
    }
  } catch (err) {
    console.warn('Could not fetch live BCV rate:', err);
  }

  return getBcvExchangeRate();
};

// Scheduler for automatic 12:00 AM (midnight) adjustment
let midnightTimer: any = null;
export const initMidnightBcvScheduler = (onUpdate?: (newRate: number) => void): (() => void) => {
  const scheduleNext = () => {
    if (midnightTimer) clearTimeout(midnightTimer);
    const msUntilMidnight = getMsUntilMidnightVET();
    console.log(`[BCV Client] Próxima actualización automática a medianoche (12:00 AM VET) en ${(msUntilMidnight / 3600000).toFixed(2)} horas.`);

    midnightTimer = setTimeout(async () => {
      console.log('[BCV Client] ¡Son las 12:00 AM en Venezuela! Sincronizando tasa oficial del BCV...');
      const updatedRate = await fetchLiveBcvRate(true);
      if (onUpdate) onUpdate(updatedRate);
      scheduleNext(); // Re-schedule for the following midnight
    }, msUntilMidnight);
  };

  scheduleNext();

  return () => {
    if (midnightTimer) clearTimeout(midnightTimer);
  };
};

export const convertUsdToBs = (usd: number, customRate?: number) => {
  const rate = customRate !== undefined ? customRate : getBcvExchangeRate();
  const bsAmount = Math.round(usd * rate * 100) / 100;
  
  const formattedBs = new Intl.NumberFormat('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(bsAmount);

  const formattedUsd = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(usd);

  return {
    usd,
    rate,
    bsAmount,
    formattedBs: `Bs. ${formattedBs}`,
    formattedUsd
  };
};

export interface VenezuelanBank {
  code: string;
  name: string;
  fullName: string;
}

// Lista oficial de instituciones bancarias activas del BCV en orden numérico de código
// Sin 'C.A.' ni 'S.A.' y en formato Título / Capitalizado
export const VENEZUELAN_BANKS: VenezuelanBank[] = [
  { code: '0102', name: 'Banco de Venezuela', fullName: '0102 - Banco de Venezuela Banco Universal' },
  { code: '0104', name: 'Banco Venezolano de Crédito', fullName: '0104 - Banco Venezolano de Crédito Banco Universal' },
  { code: '0105', name: 'Banco Mercantil', fullName: '0105 - Banco Mercantil Banco Universal' },
  { code: '0108', name: 'Banco Provincial', fullName: '0108 - Banco Provincial Banco Universal' },
  { code: '0114', name: 'Banco del Caribe', fullName: '0114 - Banco del Caribe Banco Universal' },
  { code: '0115', name: 'Banco Exterior', fullName: '0115 - Banco Exterior Banco Universal' },
  { code: '0128', name: 'Banco Caroní', fullName: '0128 - Banco Caroní Banco Universal' },
  { code: '0134', name: 'Banesco', fullName: '0134 - Banesco Banco Universal' },
  { code: '0137', name: 'Banco Sofitasa', fullName: '0137 - Banco Sofitasa Banco Universal' },
  { code: '0138', name: 'Banco Plaza', fullName: '0138 - Banco Plaza Banco Universal' },
  { code: '0146', name: 'Banco de la Gente Emprendedora', fullName: '0146 - Banco de la Gente Emprendedora' },
  { code: '0151', name: 'Banco Fondo Común', fullName: '0151 - Banco Fondo Común Banco Universal' },
  { code: '0156', name: '100% Banco', fullName: '0156 - 100% Banco Banco Comercial' },
  { code: '0157', name: 'DelSur', fullName: '0157 - DelSur Banco Universal' },
  { code: '0163', name: 'Banco del Tesoro', fullName: '0163 - Banco del Tesoro Banco Universal' },
  { code: '0166', name: 'Banco Agrícola de Venezuela', fullName: '0166 - Banco Agrícola de Venezuela Banco Universal' },
  { code: '0168', name: 'Bancrecer', fullName: '0168 - Bancrecer Banco Microfinanciero' },
  { code: '0169', name: 'R4', fullName: '0169 - R4 Banco Microfinanciero' },
  { code: '0171', name: 'Banco Activo', fullName: '0171 - Banco Activo Banco Universal' },
  { code: '0172', name: 'Bancamiga', fullName: '0172 - Bancamiga Banco Universal' },
  { code: '0173', name: 'Banco Internacional de Desarrollo', fullName: '0173 - Banco Internacional de Desarrollo Banco Universal' },
  { code: '0174', name: 'Banplus', fullName: '0174 - Banplus Banco Universal' },
  { code: '0175', name: 'Banco Digital de los Trabajadores', fullName: '0175 - Banco Digital de los Trabajadores Banco Universal' },
  { code: '0177', name: 'Banco de la Fuerza Armada Nacional Bolivariana', fullName: '0177 - Banco de la Fuerza Armada Nacional Bolivariana Banco Universal' },
  { code: '0178', name: 'N58 Banco Digital', fullName: '0178 - N58 Banco Digital Banco Microfinanciero' },
  { code: '0191', name: 'Banco Nacional de Crédito', fullName: '0191 - Banco Nacional de Crédito Banco Universal' }
];

// Helper para generar el bloque completo de datos de Pago Móvil para copiar en 1 clic
export const getFullPagoMovilCopyText = (formattedBs: string, concept: string = 'Güakytopia'): string => {
  return [
    `Banco: ${OFFICIAL_PAGO_MOVIL.bankCode} - ${OFFICIAL_PAGO_MOVIL.bankName}`,
    `Teléfono: ${OFFICIAL_PAGO_MOVIL.phoneRaw}`,
    `Cédula: ${OFFICIAL_PAGO_MOVIL.cedula.replace(/\D/g, '')}`,
    `Monto: ${formattedBs}`,
    `Concepto: ${concept}`
  ].join('\n');
};

export interface OfficialPayPalDetails {
  email: string;
  recipientName: string;
  clientId: string;
  paypalMeUsername: string;
  paypalMeBaseUrl: string;
  directTransferUrl: string;
  hasActivePayPalMe: boolean;
}

export const PAYPAL_CLIENT_ID = 'BAAwOd4TNDsLRxPsg-YKt2uUeBMh5MCxaHCkQPRUjgDrUsOd2SB3TUEVWLqVEwSAq0HyKsyNOtMV4QkUnc';

export const OFFICIAL_PAYPAL: OfficialPayPalDetails = {
  email: 'cokito.vzla@gmail.com',
  recipientName: 'Ana T Sandoval',
  clientId: PAYPAL_CLIENT_ID,
  paypalMeUsername: '',
  paypalMeBaseUrl: 'https://www.paypal.com/myaccount/transfer/homepage',
  directTransferUrl: 'https://www.paypal.com/myaccount/transfer/homepage',
  hasActivePayPalMe: false
};

// Genera la URL de pago más segura para que nunca dé error 404
export const getPayPalUrl = (amountUsd?: number): string => {
  try {
    const customLink = typeof window !== 'undefined' ? localStorage.getItem('cokito_custom_paypal_link') : null;
    if (customLink && customLink.trim()) return customLink.trim();
  } catch {}

  // Si tiene PayPal.Me activado con su handle
  if (OFFICIAL_PAYPAL.hasActivePayPalMe && OFFICIAL_PAYPAL.paypalMeUsername) {
    if (amountUsd && amountUsd > 0) {
      const formatted = Number(amountUsd.toFixed(2));
      return `https://www.paypal.com/paypalme/${OFFICIAL_PAYPAL.paypalMeUsername}/${formatted}USD`;
    }
    return `https://www.paypal.com/paypalme/${OFFICIAL_PAYPAL.paypalMeUsername}`;
  }

  // Fallback seguro que NUNCA da error 404: portal oficial de envío de PayPal
  return OFFICIAL_PAYPAL.directTransferUrl;
};

// Alias compatible para código existente
export const getPayPalMeUrl = (amountUsd?: number): string => getPayPalUrl(amountUsd);

export const getFullPayPalCopyText = (amountUsd: number, concept: string = 'Inscripción Güakytopia'): string => {
  return [
    `PayPal Oficial: ${OFFICIAL_PAYPAL.email}`,
    `Titular: ${OFFICIAL_PAYPAL.recipientName}`,
    `Monto: $${amountUsd.toFixed(2)} USD`,
    `Concepto: ${concept}`,
    `Instrucción: Envía $${amountUsd.toFixed(2)} USD a la cuenta ${OFFICIAL_PAYPAL.email} en PayPal.`
  ].join('\n');
};

