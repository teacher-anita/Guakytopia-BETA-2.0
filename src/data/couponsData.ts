/**
 * Launch Matrix & Operational Coupons for Güakytopia
 * Configured according to Ana Teresa / Waky's Launch Specifications
 */

export type CouponCategory = 'csb' | 'scholarship' | 'launch' | 'ambassador' | 'tester';

export type BenefitType = 
  | 'free_webapp_3m' 
  | 'webapp_5usd_3m' 
  | 'csb_family_discount' 
  | 'scholar_100' 
  | 'scholar_50' 
  | 'scholar_20' 
  | 'friend_pass' 
  | 'trial_7days' 
  | 'launch_20_off' 
  | 'tester_ticket';

export interface CouponItem {
  id: string;
  code: string;
  category: CouponCategory;
  categoryLabel: string;
  benefitType: BenefitType;
  title: string;
  description: string;
  maxUses: number | null; // null = unlimited
  currentUses: number;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  testerRole?: string;
}

export const INITIAL_COUPONS: CouponItem[] = [
  // 1. TEACHERS COLEGIO SIMÓN BOLÍVAR - CSB
  {
    id: 'cp_csb_teachers',
    code: 'CSBteachers26',
    category: 'csb',
    categoryLabel: 'Colegio Simón Bolívar',
    benefitType: 'free_webapp_3m',
    title: 'Exalumnas Directas CSB • 100% FREE',
    description: 'Acceso 100% gratuito a la Web App y Módulos por 3 meses.',
    maxUses: 15,
    currentUses: 2,
    isActive: true,
    notes: 'Exalumnas y docentes directas del Colegio Simón Bolívar',
    createdAt: '2026-10-01'
  },
  {
    id: 'cp_csb_friends',
    code: 'CSBFriends',
    category: 'csb',
    categoryLabel: 'Colegio Simón Bolívar',
    benefitType: 'webapp_5usd_3m',
    title: 'Profesoras CSB • Tarifa Especial $5/mes',
    description: 'Acceso completo a Web App por $5.00/mes durante 3 meses.',
    maxUses: 25,
    currentUses: 5,
    isActive: true,
    notes: 'Docentes colaboradoras del CSB',
    createdAt: '2026-10-01'
  },
  {
    id: 'cp_csb_family',
    code: 'CSBFamily',
    category: 'csb',
    categoryLabel: 'Colegio Simón Bolívar',
    benefitType: 'csb_family_discount',
    title: 'Comunidad General CSB • 20% OFF + Horarios Protegidos',
    description: '20% OFF primeros 3 meses + 10% OFF Lifetime + Acceso a Horarios Protegidos (3:00 - 7:00 PM).',
    maxUses: null,
    currentUses: 8,
    isActive: true,
    notes: 'Comunidad CSB abierta (padres, alumnos, docentes)',
    createdAt: '2026-10-01'
  },

  // 2. SCHOLARSHIP MATRIX (CONTROL DE USO ÚNICO)
  {
    id: 'cp_scholar_100_1',
    code: 'SCHOLAR-100-WAKY01',
    category: 'scholarship',
    categoryLabel: 'Becas Institucionales',
    benefitType: 'scholar_100',
    title: 'Beca Total 100% • Web App + 2h/sem Live Classes',
    description: 'Beca completa 100% gratuita (Web App + 2 horas semanales en vivo escalable por rendimiento).',
    maxUses: 1,
    currentUses: 0,
    isActive: true,
    notes: 'Beca de excelencia académica #1',
    createdAt: '2026-10-02'
  },
  {
    id: 'cp_scholar_100_2',
    code: 'SCHOLAR-100-WAKY02',
    category: 'scholarship',
    categoryLabel: 'Becas Institucionales',
    benefitType: 'scholar_100',
    title: 'Beca Total 100% • Web App + 2h/sem Live Classes',
    description: 'Beca completa 100% gratuita (Web App + 2 horas semanales en vivo).',
    maxUses: 1,
    currentUses: 0,
    isActive: true,
    notes: 'Beca de excelencia académica #2',
    createdAt: '2026-10-02'
  },
  {
    id: 'cp_scholar_50_1',
    code: 'SCHOLAR-50-OCT26',
    category: 'scholarship',
    categoryLabel: 'Becas Institucionales',
    benefitType: 'scholar_50',
    title: 'Beca Parcial 50% OFF',
    description: '50% de descuento directo en cualquier plan o paquete de clases.',
    maxUses: 10,
    currentUses: 1,
    isActive: true,
    notes: 'Becas parciales por mérito',
    createdAt: '2026-10-02'
  },
  {
    id: 'cp_scholar_20_1',
    code: 'SCHOLAR-20-OCT26',
    category: 'scholarship',
    categoryLabel: 'Becas Institucionales',
    benefitType: 'scholar_20',
    title: 'Beca Parcial 20% OFF por 3 meses',
    description: '20% de descuento en mensualidad durante el primer trimestre.',
    maxUses: 15,
    currentUses: 3,
    isActive: true,
    notes: 'Subsidio inicial de estudio',
    createdAt: '2026-10-02'
  },

  // 3. CAMPAÑA DE LANZAMIENTO Y CORTESÍAS
  {
    id: 'cp_launch_pass',
    code: '7DAYPASS',
    category: 'launch',
    categoryLabel: 'Campaña de Lanzamiento',
    benefitType: 'trial_7days',
    title: 'Pase 7 Días Gratis + Sesión Privada Intro',
    description: '1 Semana de acceso completo a la Web App + 1 sesión privada de introducción metodológica.',
    maxUses: 20,
    currentUses: 7,
    isActive: true,
    notes: 'Gancho principal de redes y eventos',
    createdAt: '2026-10-03'
  },
  {
    id: 'cp_launch_2026',
    code: 'LAUNCH2026',
    category: 'launch',
    categoryLabel: 'Campaña de Lanzamiento',
    benefitType: 'launch_20_off',
    title: 'Early Bird Lanzamiento • 20% OFF en Clases',
    description: '20% de descuento en clases en vivo durante los primeros 3 meses.',
    maxUses: 15,
    currentUses: 9,
    isActive: true,
    notes: 'Promoción relámpago de apertura',
    createdAt: '2026-10-03'
  },
  {
    id: 'cp_friend_ana',
    code: 'FRIEND-ANA',
    category: 'ambassador',
    categoryLabel: 'Embajadores',
    benefitType: 'friend_pass',
    title: 'Invitación Embajador • 1 Semana + Clase Intro',
    description: '1 Semana gratis en Web App + 1 clase privada para tu invitado. Si contrata en vivo, ¡ganas tu mes gratis!',
    maxUses: 5,
    currentUses: 1,
    isActive: true,
    notes: 'Código de embajador para Ana',
    createdAt: '2026-10-04'
  },

  // 4. ESTRATEGIA DE TESTERS DE CONFIANZA (7 TICKETS EXACTOS)
  {
    id: 'cp_tester_app5',
    code: 'TESTER-APP5',
    category: 'tester',
    categoryLabel: 'Testers de Calidad',
    benefitType: 'tester_ticket',
    title: 'Tester #1 • Membresía Solo Web App ($5/mes)',
    description: 'Simula al usuario de la Membresía Solo Web App de $5/mes (100% asincrónica con Cyber Owl).',
    maxUses: 3,
    currentUses: 1,
    isActive: true,
    testerRole: 'Solo Web App ($5/mes)',
    notes: 'Auditoría de plataforma autónoma',
    createdAt: '2026-10-04'
  },
  {
    id: 'cp_tester_csb',
    code: 'TESTER-CSB',
    category: 'tester',
    categoryLabel: 'Testers de Calidad',
    benefitType: 'tester_ticket',
    title: 'Tester #2 • Usuario CSB (Horarios Protegidos)',
    description: 'Simula al usuario del Colegio Simón Bolívar con acceso a beneficios y franja protegida de 3 a 7 PM.',
    maxUses: 3,
    currentUses: 0,
    isActive: true,
    testerRole: 'Convenio CSB Horarios Protegidos',
    notes: 'Auditoría de franja institucional',
    createdAt: '2026-10-04'
  },
  {
    id: 'cp_tester_2h',
    code: 'TESTER-2H',
    category: 'tester',
    categoryLabel: 'Testers de Calidad',
    benefitType: 'tester_ticket',
    title: 'Tester #3 • Plan 2 Horas / Semana',
    description: 'Simula al alumno inscrito en el plan de 2 horas semanales (pareja fija de días).',
    maxUses: 3,
    currentUses: 1,
    isActive: true,
    testerRole: 'Plan 2h/semana en Vivo',
    notes: 'Auditoría de agenda regular',
    createdAt: '2026-10-04'
  },
  {
    id: 'cp_tester_3h',
    code: 'TESTER-3H',
    category: 'tester',
    categoryLabel: 'Testers de Calidad',
    benefitType: 'tester_ticket',
    title: 'Tester #4 • Plan 3 Horas / Semana',
    description: 'Simula al alumno en el plan de 3 horas semanales (1.5h por día).',
    maxUses: 3,
    currentUses: 0,
    isActive: true,
    testerRole: 'Plan 3h/semana en Vivo',
    notes: 'Auditoría de plan intermedio',
    createdAt: '2026-10-04'
  },
  {
    id: 'cp_tester_4h',
    code: 'TESTER-4H',
    category: 'tester',
    categoryLabel: 'Testers de Calidad',
    benefitType: 'tester_ticket',
    title: 'Tester #5 • Plan Intensivo 4 Horas / Semana',
    description: 'Simula al alumno en el plan intensivo de 4 horas semanales (2h diarias).',
    maxUses: 3,
    currentUses: 0,
    isActive: true,
    testerRole: 'Plan 4h/semana Intensivo',
    notes: 'Auditoría de plan intensivo',
    createdAt: '2026-10-04'
  },
  {
    id: 'cp_tester_scholar',
    code: 'TESTER-SCHOLAR',
    category: 'tester',
    categoryLabel: 'Testers de Calidad',
    benefitType: 'tester_ticket',
    title: 'Tester #6 • Alumno con Beca Asignada',
    description: 'Simula a un alumno con Beca Parcial o Total, validando que el subsidio y acceso se reflejen al 100%.',
    maxUses: 3,
    currentUses: 0,
    isActive: true,
    testerRole: 'Beca Total / Parcial',
    notes: 'Auditoría de becas',
    createdAt: '2026-10-04'
  },
  {
    id: 'cp_tester_vip',
    code: 'TESTER-VIP',
    category: 'tester',
    categoryLabel: 'Testers de Calidad',
    benefitType: 'tester_ticket',
    title: 'Tester #7 • Usuario Estándar General (Full Flow)',
    description: 'Simula al comprador externo general que adquiere un paquete estándar sin convenios para probar el flujo completo.',
    maxUses: 3,
    currentUses: 1,
    isActive: true,
    testerRole: 'Usuario VIP Estándar',
    notes: 'Auditoría de funnel general',
    createdAt: '2026-10-04'
  }
];

const LOCAL_STORAGE_COUPONS_KEY = 'guakytopia_coupons_store_v1';

export const getStoredCoupons = (): CouponItem[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_COUPONS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_COUPONS_KEY, JSON.stringify(INITIAL_COUPONS));
      return INITIAL_COUPONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_COUPONS;
  } catch {
    return INITIAL_COUPONS;
  }
};

export const saveStoredCoupons = (coupons: CouponItem[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_COUPONS_KEY, JSON.stringify(coupons));
  } catch (err) {
    console.error('Error saving coupons to localStorage', err);
  }
};

export const findCouponByCode = (code: string): CouponItem | null => {
  const cleanCode = code.trim().toUpperCase().replace(/\s+/g, '');
  const list = getStoredCoupons();
  
  // 1. Direct exact match
  const direct = list.find(c => c.code.toUpperCase() === cleanCode);
  if (direct) return direct;

  // 2. Pattern match for dynamic prefixes
  // e.g. FRIEND-[NAME]
  if (cleanCode.startsWith('FRIEND-')) {
    const existingFriend = list.find(c => c.code.toUpperCase() === cleanCode);
    if (existingFriend) return existingFriend;
    // Auto-synthesize ambassador coupon
    return {
      id: `cp_dynamic_${cleanCode}`,
      code: cleanCode,
      category: 'ambassador',
      categoryLabel: 'Embajador',
      benefitType: 'friend_pass',
      title: `Invitación de Embajador (${cleanCode})`,
      description: '1 Semana gratis de Web App + 1 Clase Privada de Introducción.',
      maxUses: 5,
      currentUses: 0,
      isActive: true,
      notes: 'Embajador generado por nombre',
      createdAt: new Date().toISOString().split('T')[0]
    };
  }

  // e.g. SCHOLAR-100-[ID]
  if (cleanCode.startsWith('SCHOLAR-100-')) {
    return list.find(c => c.code.toUpperCase() === cleanCode) || {
      id: `cp_scholar_${cleanCode}`,
      code: cleanCode,
      category: 'scholarship',
      categoryLabel: 'Becas Institucionales',
      benefitType: 'scholar_100',
      title: 'Beca Total 100% Asignada',
      description: '100% FREE Web App + 2 hrs/semana Live Classes.',
      maxUses: 1,
      currentUses: 0,
      isActive: true,
      notes: 'Beca de uso único',
      createdAt: new Date().toISOString().split('T')[0]
    };
  }

  // e.g. SCHOLAR-50-[ID]
  if (cleanCode.startsWith('SCHOLAR-50-')) {
    return list.find(c => c.code.toUpperCase() === cleanCode) || {
      id: `cp_scholar50_${cleanCode}`,
      code: cleanCode,
      category: 'scholarship',
      categoryLabel: 'Becas Institucionales',
      benefitType: 'scholar_50',
      title: 'Beca Parcial 50% OFF',
      description: '50% de descuento en cualquier plan contratado.',
      maxUses: 1,
      currentUses: 0,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };
  }

  // e.g. SCHOLAR-20-[ID]
  if (cleanCode.startsWith('SCHOLAR-20-')) {
    return list.find(c => c.code.toUpperCase() === cleanCode) || {
      id: `cp_scholar20_${cleanCode}`,
      code: cleanCode,
      category: 'scholarship',
      categoryLabel: 'Becas Institucionales',
      benefitType: 'scholar_20',
      title: 'Beca Parcial 20% OFF',
      description: '20% de descuento por 3 meses.',
      maxUses: 1,
      currentUses: 0,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };
  }

  return null;
};
