// Exchange Rate and Payment Details Service for Cokits Academy

export interface PaymentCredentials {
  bankName: string;
  bankCode: string;
  cedula: string;
  phone: string;
  phoneRaw: string;
  whatsappWelcomeLoungeUrl: string;
}

export const OFFICIAL_PAGO_MOVIL: PaymentCredentials = {
  bankName: 'Banco Provincial',
  bankCode: '0108',
  cedula: 'V-18.313.077',
  phone: '0412 923 2527',
  phoneRaw: '04129232527',
  whatsappWelcomeLoungeUrl: 'https://chat.whatsapp.com/IgwV4BKKgOEAomBpfMOcjK'
};

const DEFAULT_BCV_RATE = 89.50; // Fallback rate Bs/USD
const RATE_STORAGE_KEY = 'cokito_bcv_rate_override';

export const getBcvExchangeRate = (): number => {
  try {
    const stored = localStorage.getItem(RATE_STORAGE_KEY);
    if (stored) {
      const num = parseFloat(stored);
      if (!isNaN(num) && num > 0) return num;
    }
  } catch {}
  return DEFAULT_BCV_RATE;
};

export const setBcvExchangeRateOverride = (newRate: number): void => {
  try {
    if (newRate > 0) {
      localStorage.setItem(RATE_STORAGE_KEY, newRate.toFixed(2));
    }
  } catch {}
};

// Try to fetch latest official BCV rate asynchronously from reliable public APIs
export const fetchLiveBcvRate = async (): Promise<number> => {
  try {
    const response = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', { cache: 'no-cache' });
    if (response.ok) {
      const data = await response.json();
      if (data && typeof data.promedio === 'number' && data.promedio > 0) {
        setBcvExchangeRateOverride(data.promedio);
        return data.promedio;
      }
    }
  } catch (err) {
    // Graceful fallback to stored or default
  }
  return getBcvExchangeRate();
};

export const convertUsdToBs = (usd: number, customRate?: number) => {
  const rate = customRate || getBcvExchangeRate();
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
