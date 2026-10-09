import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Shield, 
  Send, 
  BookOpen, 
  Layers, 
  Award, 
  AlertCircle, 
  HelpCircle,
  Smartphone,
  Users,
  Star,
  Zap,
  KeyRound,
  Tag,
  Lock,
  Banknote,
  ExternalLink,
  Copy,
  MessageCircle,
  Gift
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, ScheduleSlot, ClassModality, GroupSize, AudienceTheme } from '../types';
import { PlacementQuizModal } from './PlacementQuizModal';
import { generateEmailTemplate, sendGmailEmail } from '../services/gmailNotifier';
import { OFFICIAL_PAGO_MOVIL, convertUsdToBs, getBcvExchangeRate, fetchLiveBcvRate } from '../services/currencyService';
import { findCouponByCode } from '../data/couponsData';

interface RegistrationFlowProps {
  slots: ScheduleSlot[];
  onRegisterComplete: (newStudent: Student, bookedSlotIds: string[]) => void;
  onExploreCalendar: () => void;
  audienceTheme: AudienceTheme;
}

export type RegistrationPlanType = 'digital_5' | 'basic_2' | 'regular_3' | 'intensive_4' | 'express_6';

interface CustomPlanInfo {
  id: RegistrationPlanType;
  title: string;
  badge: string;
  priceDisplay: string;
  priceNumber: number;
  period: string;
  hoursNote: string;
  description: string;
  isSelfPaced: boolean;
  features: string[];
}

const REGISTRATION_PLANS: CustomPlanInfo[] = [
  {
    id: 'digital_5',
    title: 'Pase Digital Autónomo Cokitö',
    badge: 'Opción Esencial • Autoaprendizaje',
    priceDisplay: '$5',
    priceNumber: 5,
    period: '/ mes',
    hoursNote: 'A tu propio ritmo (Sin horario fijo)',
    description: 'Acceso completo e ilimitado a los 12 niveles de la plataforma, audios nativos, quizzes del Cyber Owl y retos diarios.',
    isSelfPaced: true,
    features: [
      'Acceso a todos los niveles (SuperGoal y MegaGoal)',
      'Quizzes interactivos de fin de unidad (+50 XP)',
      'Smart Owl Trivia de cultura general y etiqueta',
      'Sin clases en vivo con la profesora'
    ]
  },
  {
    id: 'express_6',
    title: '⚡ Nivel Express / Súper Intensivo (6 h/sem)',
    badge: '¡Máxima Velocidad! • 4 Semanas/Nivel',
    priceDisplay: '$105',
    priceNumber: 105,
    period: '/ semana',
    hoursNote: '6 horas semanales (3 sesiones de 120 min)',
    description: 'Inmersión récord: completa 1 nivel oficial en solo 4 semanas. Ideal para viajes inminentes o entrevistas urgentes.',
    isSelfPaced: false,
    features: [
      '3 sesiones semanales de 120 min (Lun/Mié/Vie)',
      '¡Terminas cada nivel en solo 4 semanas (1 mes)!',
      'Atención VIP exclusiva de Teacher Cokitö',
      'Soporte y dudas continuo vía WhatsApp'
    ]
  },
  {
    id: 'intensive_4',
    title: 'Plan Intensivo (4 h/sem)',
    badge: 'Progreso Acelerado • 6 Semanas/Nivel',
    priceDisplay: '$80',
    priceNumber: 80,
    period: '/ semana',
    hoursNote: '4 horas semanales (2 de 120 min o 4 de 60 min)',
    description: 'Avance rápido y enfocado para metas a corto plazo, ascensos laborales o preparación de certificaciones.',
    isSelfPaced: false,
    features: [
      '4 horas semanales de clases en vivo',
      'Terminas cada nivel en 6 semanas (1.5 meses)',
      'Simulación de entrevistas y fluidez laboral',
      'Acceso total al Classroom y libros oficiales'
    ]
  },
  {
    id: 'regular_3',
    title: 'Plan Regular (3 h/sem)',
    badge: '⭐ Más Recomendado • 8 Semanas/Nivel',
    priceDisplay: '$67.5',
    priceNumber: 67.5,
    period: '/ semana',
    hoursNote: '3 horas semanales (2 sesiones de 90 min)',
    description: 'La fórmula pedagógica dorada: máximo equilibrio entre velocidad, retención cognitiva y comodidad de horario.',
    isSelfPaced: false,
    features: [
      '2 sesiones semanales de 90 min (ej. Lun/Mié)',
      'Terminas cada nivel en 8 semanas (2 meses)',
      'Práctica conversacional inmersiva y natural',
      'Feedback detallado de pronunciación en cada clase'
    ]
  },
  {
    id: 'basic_2',
    title: 'Plan Súper Básico (2 h/sem)',
    badge: 'Constante y Relajado • 12 Semanas/Nivel',
    priceDisplay: '$50',
    priceNumber: 50,
    period: '/ semana',
    hoursNote: '2 horas semanales (2 sesiones de 60 min)',
    description: 'Para personas con agendas apretadas que desean avanzar firme y sin sobrecarga mental.',
    isSelfPaced: false,
    features: [
      '2 sesiones semanales de 60 min (ej. Mar/Jue)',
      'Terminas cada nivel en 12 semanas (3 meses)',
      'Aprende sin miedo, sin estrés y a tu ritmo',
      'Materiales digitales y audios incluidos'
    ]
  }
];

export const RegistrationFlow: React.FC<RegistrationFlowProps> = ({
  slots,
  onRegisterComplete,
  onExploreCalendar,
  audienceTheme
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState<number>(25);
  const [schoolOrProfession, setSchoolOrProfession] = useState('');
  const [learningGoal, setLearningGoal] = useState('Oportunidades laborales y superación personal');

  // Package & Preferences
  const [selectedPlanId, setSelectedPlanId] = useState<RegistrationPlanType>('digital_5');
  const [selectedModality, setSelectedModality] = useState<ClassModality>('online');
  const [selectedGroupSize, setSelectedGroupSize] = useState<GroupSize>('individual');
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('Tardes (4:00 - 7:00 pm)');

  // Coupon Code State in Registration
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; label: string; discountPercent: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Placement Test State
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [placementResult, setPlacementResult] = useState<{
    score: number;
    total: number;
    suggestedLevelId: string;
    suggestedLevelName: string;
    diagnosisText: string;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredStudent, setRegisteredStudent] = useState<Student | null>(null);

  // BCV Exchange Rate State
  const [bcvRate, setBcvRate] = useState<number>(() => getBcvExchangeRate());
  useEffect(() => {
    fetchLiveBcvRate().then(rate => setBcvRate(rate));
    const handleBcvUpdate = () => {
      setBcvRate(getBcvExchangeRate());
    };
    window.addEventListener('bcv_rate_updated', handleBcvUpdate);
    return () => window.removeEventListener('bcv_rate_updated', handleBcvUpdate);
  }, []);

  // Step 4 Validation State (post-registration)
  const [step4Code, setStep4Code] = useState('');
  const [step4Error, setStep4Error] = useState<string | null>(null);
  const [step4Success, setStep4Success] = useState<string | null>(null);
  const [showPagoMovilBox, setShowPagoMovilBox] = useState(false);
  const [pagoMovilRef, setPagoMovilRef] = useState('');
  const [pagoMovilBank, setPagoMovilBank] = useState('Banco de Venezuela');
  const [payFullPrivate, setPayFullPrivate] = useState(false);
  const [isTrialActivated, setIsTrialActivated] = useState(false);
  const [pagoMovilSubmitted, setPagoMovilSubmitted] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleValidateStep4Code = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registeredStudent) return;
    const clean = step4Code.trim().toUpperCase();
    const VALID_CODES = [
      'CSB-PRE', 
      'CSB2026', 
      'COKITO2026', 
      'BECA100', 
      'TEACHERCOKITO', 
      'MALU2026', 
      'VIP-BECA', 
      'COKITO5', 
      'FRIENDS2026',
      'COKITO-VIP'
    ];

    if (VALID_CODES.includes(clean)) {
      const updated: Student = {
        ...registeredStudent,
        status: 'enrolled',
        paymentStatus: 'scholarship',
        xp: registeredStudent.xp + 250,
        notes: `${registeredStudent.notes || ''} | Validado exitosamente con código post-registro: ${clean}`
      };
      setRegisteredStudent(updated);
      onRegisterComplete(updated, selectedSlotIds);
      setStep4Success(`¡Código ${clean} Validado Exitosamente! Tu acceso a la plataforma está 100% activo.`);
      setStep4Error(null);
      try { confetti({ particleCount: 130, spread: 80, origin: { y: 0.6 } }); } catch {}
    } else {
      setStep4Error('Código no válido o no reconocido. Consulta con La Teacher Cokitö o verifica que esté bien escrito.');
      setStep4Success(null);
    }
  };

  const handlePaypalStep4 = () => {
    try {
      window.open('https://paypal.me/anateresacsb/5', '_blank');
    } catch {}
    if (!registeredStudent) return;
    const updated: Student = {
      ...registeredStudent,
      status: 'pending_evaluation',
      paymentStatus: 'pending_approval',
      paymentMethod: 'paypal',
      depositAmountUsd: 5,
      xp: registeredStudent.xp + 100,
      notes: `${registeredStudent.notes || ''} | Pago de $5 reportado vía PayPal Checkout (anateresa.csb@gmail.com)`
    };
    setRegisteredStudent(updated);
    onRegisterComplete(updated, selectedSlotIds);
    setPagoMovilSubmitted(true);
    setStep4Success('¡Pago reportado vía PayPal! La Directora Waky está verificando la transacción.');
    try { confetti({ particleCount: 110, spread: 75, origin: { y: 0.6 } }); } catch {}
  };

  // Handler for reporting Pago Móvil: Keeps in pending until Waky approves!
  const handleReportPagoMovilStep4 = (e: React.FormEvent, calculatedDueUsd: number, calculatedBs: number) => {
    e.preventDefault();
    if (!pagoMovilRef.trim() || !registeredStudent) {
      alert('Por favor ingresa el número de referencia del Pago Móvil.');
      return;
    }
    const isDeposit = calculatedDueUsd === 5 && selectedPlanId !== 'digital_5';
    const remaining = isDeposit ? (currentPlan.priceNumber - 5) : 0;

    const updated: Student = {
      ...registeredStudent,
      status: 'pending_evaluation',
      paymentStatus: 'pending_approval',
      paymentMethod: 'pagomovil',
      pagoMovilRef: pagoMovilRef.trim(),
      pagoMovilBank,
      pagoMovilAmountBs: calculatedBs,
      depositAmountUsd: calculatedDueUsd,
      balanceDueUsd: remaining,
      pagoMovilDate: new Date().toISOString(),
      notes: `${registeredStudent.notes || ''} | Pago Móvil Ref: ${pagoMovilRef.trim()} (${pagoMovilBank}) por Bs. ${calculatedBs} ($${calculatedDueUsd} USD). ${isDeposit ? 'Apartado de cupo con $5 (Saldo restante pendiente).' : 'Pago total reportado.'}`
    };
    setRegisteredStudent(updated);
    onRegisterComplete(updated, selectedSlotIds);
    setPagoMovilSubmitted(true);
    setStep4Success(`¡Comprobante Nro. ${pagoMovilRef.trim()} enviado a Dirección! La Directora Waky está validando tu transferencia.`);
    setShowPagoMovilBox(false);
    try { confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); } catch {}
  };

  // Handler for 24-hour courtesy trial (Retention: No student left behind!)
  const handleActivateTrial24h = () => {
    if (!registeredStudent) return;
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    const updated: Student = {
      ...registeredStudent,
      status: 'enrolled',
      paymentStatus: 'trial_24h',
      trialExpiresAt: expiresAt,
      notes: `${registeredStudent.notes || ''} | 🎁 Pase de Cortesía de 24 Horas Activado el ${new Date().toLocaleDateString()}`
    };
    setRegisteredStudent(updated);
    setIsTrialActivated(true);
    onRegisterComplete(updated, selectedSlotIds);
    setStep4Success('🎁 ¡Pase de Cortesía de 24 Horas Activado! Explora la plataforma y únete al Welcome Lounge de WhatsApp.');
    try { confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } }); } catch {}
  };

  const handleCashStep4 = () => {
    if (!registeredStudent) return;
    const updated: Student = {
      ...registeredStudent,
      status: 'pending_evaluation',
      paymentStatus: 'pending_approval',
      paymentMethod: 'cash',
      depositAmountUsd: 5,
      notes: `${registeredStudent.notes || ''} | Pago en efectivo acordado con La Teacher Cokitö`
    };
    setRegisteredStudent(updated);
    onRegisterComplete(updated, selectedSlotIds);
    setPagoMovilSubmitted(true);
    setStep4Success('¡Pago en efectivo acordado! Tu cupo ha quedado reservado.');
    try { confetti({ particleCount: 90, spread: 65, origin: { y: 0.6 } }); } catch {}
  };

  const isKid = age < 18;
  const currentPlan = REGISTRATION_PLANS.find(p => p.id === selectedPlanId) || REGISTRATION_PLANS[0];

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const clean = couponCode.trim().toUpperCase();

    if (clean === 'CSB2026') {
      setAppliedCoupon({
        code: clean,
        label: 'Pase Comunidad Educativa CSB (100% Bonificado)',
        discountPercent: 100
      });
      try { confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } }); } catch {}
    } else if (clean.includes('ALUMNO') || clean.includes('STUDENT') || clean.includes('ESTUDIANTE')) {
      setAppliedCoupon({
        code: clean,
        label: 'Pase Alumno Colegio Simón Bolívar (Prioridad 3:00 - 5:00 pm)',
        discountPercent: 100
      });
      try { confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } }); } catch {}
    } else if (clean.includes('TEACHER') || clean.includes('DOCENTE') || clean === 'PRE-CSB' || clean === 'CSB-PRE') {
      setAppliedCoupon({
        code: clean,
        label: 'Pase CSB / Teacher (Prioridad 5:00 - 7:00 pm)',
        discountPercent: 100
      });
      try { confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } }); } catch {}
    } else if (clean === 'FRIENDS2026') {
      setAppliedCoupon({
        code: clean,
        label: 'Pase VIP Friends & Family (100% Bonificado)',
        discountPercent: 100
      });
      try { confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } }); } catch {}
    } else if (clean === 'COKITO5') {
      setAppliedCoupon({
        code: clean,
        label: 'Suscripción Digital $5/mes Activada',
        discountPercent: 100
      });
      try { confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } }); } catch {}
    } else {
      const dbCoupon = findCouponByCode(clean);
      if (dbCoupon) {
        if (!dbCoupon.isActive) {
          setCouponError('Este cupón o beca se encuentra temporalmente inactivo en Güakytopia.');
          return;
        }
        const discountPct = dbCoupon.benefitType === 'scholar_100' || dbCoupon.benefitType === 'free_webapp_3m' ? 100
          : dbCoupon.benefitType === 'scholar_50' ? 50
          : dbCoupon.benefitType === 'scholar_20' || dbCoupon.benefitType === 'launch_20_off' ? 20
          : 100;

        setAppliedCoupon({
          code: clean,
          label: `${dbCoupon.title} (${discountPct === 100 ? '100% Bonificado' : `${discountPct}% OFF`})`,
          discountPercent: discountPct
        });
        try { confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } }); } catch {}
      } else {
        setCouponError('Código no válido o expirado. Consulta con la Rectoría de Güakytopia.');
      }
    }
  };

  // Check student and teacher priority roles
  const isCSBStudent = Boolean(
    appliedCoupon?.code?.includes('ALUMNO') ||
    appliedCoupon?.code?.includes('STUDENT') ||
    appliedCoupon?.code?.includes('ESTUDIANTE') ||
    (isKid && (
      schoolOrProfession.toLowerCase().includes('simón bolívar') ||
      schoolOrProfession.toLowerCase().includes('simon bolivar') ||
      schoolOrProfession.toLowerCase().includes('csb')
    ))
  );

  const isCSBTeacher = Boolean(
    appliedCoupon?.code?.includes('TEACHER') ||
    appliedCoupon?.code?.includes('DOCENTE') ||
    appliedCoupon?.code === 'PRE-CSB' ||
    appliedCoupon?.code === 'CSB-PRE' ||
    appliedCoupon?.code === 'CSB2026' ||
    schoolOrProfession.toLowerCase().includes('docente') ||
    schoolOrProfession.toLowerCase().includes('teacher') ||
    schoolOrProfession.toLowerCase().includes('auxiliar') ||
    schoolOrProfession.toLowerCase().includes('pre csb')
  );

  const isCSBMember = isCSBStudent || isCSBTeacher || Boolean(appliedCoupon?.code?.toUpperCase().includes('CSB'));

  // Maximum allowed hours for the chosen plan
  const maxHoursForPlan = 
    selectedPlanId === 'digital_5' ? 0 :
    selectedPlanId === 'basic_2' ? 2 :
    selectedPlanId === 'regular_3' ? 3 :
    selectedPlanId === 'intensive_4' ? 4 : 6;

  // Allowed days according to plan rules
  const getAllowedDaysForPlan = (planId: RegistrationPlanType): string[] => {
    switch (planId) {
      case 'basic_2': return ['Martes', 'Jueves'];
      case 'regular_3': return ['Lunes', 'Miércoles', 'Viernes'];
      case 'express_6': return ['Lunes', 'Miércoles', 'Viernes'];
      case 'intensive_4': return ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
      default: return ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    }
  };

  const allowedDays = getAllowedDaysForPlan(selectedPlanId);

  // Helper to determine slot restriction
  const getSlotRestriction = (slot: ScheduleSlot): { isBlocked: boolean; reason: string } => {
    if (slot.status === 'booked') {
      return { isBlocked: true, reason: 'Reservado por otro alumno' };
    }

    // 1. Day restriction according to plan
    if (!allowedDays.includes(slot.day)) {
      return { 
        isBlocked: true, 
        reason: `Día no habilitado para tu plan (${allowedDays.join(', ')})` 
      };
    }

    // 2. Alumnos CSB Priority (3:00 pm - 5:00 pm = 15:00, 16:00)
    const isCSBStudentHours = slot.startTime === '15:00' || slot.startTime === '16:00';
    if (isCSBStudentHours && !isCSBStudent && !isCSBTeacher) {
      return { 
        isBlocked: true, 
        reason: 'Bloque reservado con prioridad para Alumnos del Colegio Simón Bolívar (3:00 a 5:00 pm)' 
      };
    }

    // 3. Teachers CSB Priority (5:00 pm - 7:00 pm = 17:00, 18:00)
    const isCSBTeacherHours = slot.startTime === '17:00' || slot.startTime === '18:00';
    if (isCSBTeacherHours && !isCSBTeacher) {
      return { 
        isBlocked: true, 
        reason: 'Bloque reservado con prioridad para Teachers del Colegio Simón Bolívar (5:00 a 7:00 pm)' 
      };
    }

    // 4. Morning group restriction (6:00 am - 8:00 am = 06:00, 07:00)
    const isMorningHours = slot.startTime === '06:00' || slot.startTime === '07:00';
    if (isMorningHours && selectedGroupSize === 'individual') {
      return { 
        isBlocked: true, 
        reason: 'Bloque matutino exclusivo para grupos (no disponible para 1 a 1)' 
      };
    }

    // 5. Night group restriction (8:00 pm - 10:00 pm = 20:00, 21:00)
    const isNightHours = slot.startTime === '20:00' || slot.startTime === '21:00';
    if (isNightHours && selectedGroupSize === 'individual') {
      return { 
        isBlocked: true, 
        reason: 'Bloque nocturno exclusivo para grupos (no disponible para 1 a 1)' 
      };
    }

    return { isBlocked: false, reason: '' };
  };

  const [scheduleNotice, setScheduleNotice] = useState<string | null>(null);

  const handleToggleSlot = (slot: ScheduleSlot) => {
    const restriction = getSlotRestriction(slot);
    if (restriction.isBlocked) {
      setScheduleNotice(`⚠️ Horario no disponible: ${restriction.reason}`);
      return;
    }

    setScheduleNotice(null);

    if (selectedSlotIds.includes(slot.id)) {
      setSelectedSlotIds(prev => prev.filter(id => id !== slot.id));
    } else {
      if (selectedSlotIds.length >= maxHoursForPlan) {
        setScheduleNotice(`Tu plan (${currentPlan.title}) incluye ${maxHoursForPlan} horas semanales. Desmarca un bloque anterior para cambiar.`);
        return;
      }
      setSelectedSlotIds(prev => [...prev, slot.id]);
    }
  };

  const handleFinalSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      alert('Por favor completa tu nombre y correo electrónico.');
      return;
    }

    setIsSubmitting(true);

    const defaultLevelId = isKid ? 'level_1' : 'level_7';
    const defaultLevelName = isKid ? 'Super Goal 1 (Kids & Jóvenes A1)' : 'Mega Goal 1 (Adultos A1/A2)';

    const newStudentId = `student_${Date.now()}`;
    const newStudent: Student = {
      id: newStudentId,
      name: name.trim(),
      lastName: lastName.trim(),
      cedula: cedula.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password: password.trim() || undefined,
      age: Number(age),
      isKid,
      schoolOrProfession,
      learningGoal,
      avatar: `https://api.dicebear.com/7.x/${isKid ? 'bottts' : 'micah'}/svg?seed=${name}`,
      plan: selectedPlanId === 'express_6' ? 'super_intensive' : selectedPlanId === 'intensive_4' ? 'intensive' : selectedPlanId === 'regular_3' ? 'regular' : 'basic',
      modality: selectedModality,
      groupSize: selectedPlanId === 'digital_5' ? 'individual' : selectedGroupSize,
      preferredTimeSlot,
      status: appliedCoupon ? 'enrolled' : 'pending_evaluation',
      paymentStatus: appliedCoupon ? 'scholarship' : 'pending_approval',
      depositAmountUsd: appliedCoupon ? 0 : 5,
      levelId: placementResult?.suggestedLevelId || defaultLevelId,
      placementTestScore: placementResult?.score,
      placementTestDiagnosis: placementResult 
        ? `Puntaje: ${placementResult.score}/${placementResult.total}. Sugerencia: ${placementResult.suggestedLevelName}. ${placementResult.diagnosisText}`
        : 'Prueba diagnóstica pendiente por realizar a tu propio ritmo desde tu perfil de alumno.',
      placementTestDate: placementResult ? new Date().toISOString().split('T')[0] : undefined,
      registeredAt: new Date().toISOString().split('T')[0],
      currentUnit: 1,
      completedHours: 0,
      xp: appliedCoupon ? 350 : 200,
      streak: 1,
      league: 'Bronce',
      rating: { fluency: 3, grammar: 3, vocabulary: 3, pronunciation: 3 },
      notes: `Plan: ${currentPlan.title}. Horas elegidas: ${selectedSlotIds.length}/${maxHoursForPlan}. ${isCSBMember ? 'Personal CSB / Teacher.' : ''} ${appliedCoupon ? `Cupón: ${appliedCoupon.code}` : 'Sin cupón'}. Diagnóstico: ${placementResult ? placementResult.suggestedLevelName : 'Inicial por defecto (Prueba pendiente)'}.`,
      assignedSlots: selectedSlotIds
    };

    // Send confirmation email
    await sendGmailEmail({
      to: email,
      subject: `¡Inscripción recibida en Güakytopia! • Open the World`,
      bodyText: `Hola ${name},\n\n¡Bienvenido(a) a Güakytopia!\n\nHemos recibido tu registro${placementResult ? ` y el resultado de tu prueba diagnóstica (${placementResult.score}/${placementResult.total} puntos)` : ' para comenzar tu aprendizaje'}.\n\nDetalles:\n- Plan elegido: ${currentPlan.title}\n- Nivel: ${placementResult ? placementResult.suggestedLevelName : 'Inicial (A1) por defecto'}\n- Horario / Modalidad: ${currentPlan.isSelfPaced ? 'Autónomo Asincrónico' : selectedSlotIds.join(', ') || preferredTimeSlot}\n\nStart where you are. Keep going. ¡Nos alegra mucho acompañarte a abrir el mundo a través del inglés!`
    }).catch(() => null);

    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch {}

    onRegisterComplete(newStudent, selectedSlotIds);
    setRegisteredStudent(newStudent);
    setIsSubmitting(false);
    setStep(4);
  };

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'] as const;

  return (
    <div className="max-w-4xl mx-auto py-6 px-3 sm:px-6 w-full overflow-x-hidden">
      
      {/* Progress Stepper (Responsive) */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto px-2">
          {[
            { num: 1, label: 'Tus Datos' },
            { num: 2, label: 'Elegir Plan' },
            { num: 3, label: 'Nivel & Horario' },
            { num: 4, label: 'Confirmación' }
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                    step === s.num
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md'
                      : step > s.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : s.num}
                </div>
                <span className={`text-[10px] sm:text-xs mt-1 font-medium text-center ${
                  step === s.num ? 'text-blue-700 font-bold' : 'text-slate-500'
                }`}>
                  {s.label}
                </span>
              </div>
              {idx < 3 && (
                <div className={`flex-1 h-0.5 sm:h-1 mx-1 sm:mx-2 rounded-full ${
                  step > idx + 1 ? 'bg-emerald-500' : 'bg-slate-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* STEP 1: Personal Information */}
      {step === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 animate-fadeIn space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md inline-block mb-1">
              Paso 1 de 3
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Cuéntanos sobre ti
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Personalizamos la experiencia pedagógica según tu edad, ocupación y objetivos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre(s) *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. Mariana"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Apellidos *</label>
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Ej. Márquez"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Cédula / Identificación</label>
              <input
                type="text"
                value={cedula}
                onChange={e => setCedula(e.target.value)}
                placeholder="Ej. V-25.123.456"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico *</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu.correo@ejemplo.com"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono / WhatsApp *</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+58 412 1234567"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Edad del Alumno</label>
              <input
                type="number"
                min={5}
                max={99}
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                {isKid ? '🎈 Perfil Infantil / Juvenil' : '🎓 Perfil Adulto / Profesional'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contraseña de cuenta (opcional)
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Crea tu clave de acceso"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Para iniciar sesión sin Google
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isKid ? 'Colegio o Grado' : 'Profesión o Empresa'}
              </label>
              <input
                type="text"
                value={schoolOrProfession}
                onChange={e => setSchoolOrProfession(e.target.value)}
                placeholder={isKid ? 'Ej. Simón Bolívar II' : 'Ej. Diseñador / Estudiante'}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              ¿Cuál es tu principal motivo para aprender inglés?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                'Oportunidades laborales y desarrollo profesional',
                'Viajes, turismo y soltar la lengua en el extranjero',
                'Exámenes, certificaciones o apoyo escolar',
                'Superación personal y pensar en inglés sin traducir'
              ].map(goal => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => setLearningGoal(goal)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    learningGoal === goal
                      ? 'border-blue-600 bg-blue-50/80 font-bold text-blue-950 shadow-2xs'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => {
                if (!name.trim() || !email.trim()) {
                  alert('Por favor ingresa al menos tu nombre y correo electrónico.');
                  return;
                }
                setStep(2);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-colors"
            >
              <span>Siguiente: Elegir Plan</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Package Selection (Starting with the $5 Digital Plan!) */}
      {step === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 animate-fadeIn space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md inline-block mb-1">
              Paso 2 de 3
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Selecciona tu Plan de Aprendizaje
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Elige si deseas practicar de forma autónoma asincrónica o con clases en vivo de La Teacher Cokitö.
            </p>
          </div>

          {/* Modality Toggle (Only relevant if taking live classes) */}
          {selectedPlanId !== 'digital_5' && (
            <div className="space-y-1.5 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <label className="block text-xs font-semibold text-slate-700">Modalidad de Clase:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedModality('online')}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                    selectedModality === 'online'
                      ? 'border-blue-600 bg-white text-blue-950 shadow-xs'
                      : 'border-slate-200 bg-slate-100 text-slate-600'
                  }`}
                >
                  💻 Online (Google Meet)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedModality('presencial')}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                    selectedModality === 'presencial'
                      ? 'border-blue-600 bg-white text-blue-950 shadow-xs'
                      : 'border-slate-200 bg-slate-100 text-slate-600'
                  }`}
                >
                  🏫 Presencial
                </button>
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Formato del Grupo:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedGroupSize('individual')}
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                      selectedGroupSize === 'individual'
                        ? 'border-blue-600 bg-white text-blue-950 shadow-xs ring-2 ring-blue-100'
                        : 'border-slate-200 bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span className="block">👤 1 a 1</span>
                    <span className="text-[10px] block opacity-80 font-normal">Privada</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedGroupSize('duo')}
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                      selectedGroupSize === 'duo'
                        ? 'border-blue-600 bg-white text-blue-950 shadow-xs ring-2 ring-blue-100'
                        : 'border-slate-200 bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span className="block">👥 Dúo</span>
                    <span className="text-[10px] block opacity-80 font-normal">2 alumnos</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedGroupSize('crew4')}
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                      selectedGroupSize === 'crew4'
                        ? 'border-blue-600 bg-white text-blue-950 shadow-xs ring-2 ring-blue-100'
                        : 'border-slate-200 bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span className="block">🧑‍🤝‍🧑 Grupal</span>
                    <span className="text-[10px] block opacity-80 font-normal">3-4 pax</span>
                  </button>
                </div>
              </div>

              {/* REASSURING CALLOUT BOX: EXPLAINS EXACTLY WHAT IS PAID TODAY */}
              <div className={`p-4 rounded-2xl border text-xs space-y-2 mt-3 ${
                selectedGroupSize === 'individual'
                  ? 'bg-blue-50/80 border-blue-200 text-blue-950'
                  : 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
              }`}>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <strong className="text-sm font-black">
                    {selectedGroupSize === 'individual' 
                      ? '🌟 Clases Privadas 1 a 1' 
                      : selectedGroupSize === 'duo' 
                      ? '👥 Modalidad Dúo (2 Alumnos) • Reserva de Cupo' 
                      : '🧑‍🤝‍🧑 Modalidad Grupal (3 a 4 Alumnos) • Reserva de Cupo'}
                  </strong>
                </div>
                <p className="leading-relaxed">
                  {selectedGroupSize === 'individual' ? (
                    <>
                      Atención pedagógica exclusiva 100% personalizada. Para ingresar hoy a la plataforma, puedes <strong>apartar tu cupo con solo $5 USD</strong> (deducibles de tu paquete) o cancelar la totalidad si ya deseas iniciar de inmediato.
                    </>
                  ) : (
                    <>
                      La tarifa final de la mensualidad depende de la conformación de tu grupo. <strong>Para asegurar tu cupo y disfrutar de la plataforma de inmediato, hoy solo abonas la reserva mínima de $5 USD</strong> (o en Bs a tasa BCV). Este monto se te descontará al 100% de tu primera factura una vez que la Directora Waky confirme y arme tu grupo oficial.
                    </>
                  )}
                </p>
                <div className="pt-1.5 flex flex-wrap items-center justify-between gap-2 border-t border-emerald-200/60 font-bold">
                  <span className="text-[11px] text-slate-600">Abono requerido hoy para activar tu cuenta:</span>
                  <span className="text-xs font-black text-emerald-700 bg-white px-3 py-1 rounded-xl border border-emerald-300 shadow-2xs">
                    $5 USD (Bs. {convertUsdToBs(5, bcvRate).formattedBs})
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Plans Grid (First option is ALWAYS $5 Platform Pass) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {REGISTRATION_PLANS.map(plan => {
              const isSelected = selectedPlanId === plan.id;
              
              // Calculate adjusted rate based on group format
              let displayedPrice = plan.priceDisplay;
              let displayedPeriod = plan.period;
              if (plan.id !== 'digital_5') {
                if (selectedGroupSize === 'duo') {
                  const duoRates: Record<string, string> = { express_6: '$70', intensive_4: '$55', regular_3: '$45', basic_2: '$35' };
                  displayedPrice = duoRates[plan.id] || plan.priceDisplay;
                  displayedPeriod = `${plan.period} (por alumno)`;
                } else if (selectedGroupSize === 'crew4') {
                  const crewRates: Record<string, string> = { express_6: '$50', intensive_4: '$40', regular_3: '$30', basic_2: '$25' };
                  displayedPrice = crewRates[plan.id] || plan.priceDisplay;
                  displayedPeriod = `${plan.period} (por alumno)`;
                }
              }

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-100'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        plan.id === 'digital_5'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {plan.badge}
                      </span>
                      {plan.id === 'digital_5' && (
                        <Smartphone className="w-4 h-4 text-amber-600" />
                      )}
                    </div>

                    <div>
                      <h3 className="font-black text-slate-900 text-base">{plan.title}</h3>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900">{displayedPrice}</span>
                        <span className="text-xs text-slate-500 font-semibold">{displayedPeriod}</span>
                      </div>
                      {plan.id !== 'digital_5' && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          Reserva hoy con solo $5 USD (Bs. {convertUsdToBs(5, bcvRate).formattedBs})
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {plan.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 font-medium">{plan.hoursNote}</span>
                    <span className={`font-bold ${isSelected ? 'text-blue-700' : 'text-slate-400'}`}>
                      {isSelected ? '✓ Seleccionado' : 'Elegir'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 text-slate-600 text-xs font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-colors"
            >
              <span>{currentPlan.isSelfPaced ? 'Siguiente: Prueba de Nivel' : 'Siguiente: Horario & Prueba'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Placement Test, Schedule & Coupon Code */}
      {step === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 animate-fadeIn space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md inline-block mb-1">
              Paso 3 de 3
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {currentPlan.isSelfPaced ? 'Prueba Diagnóstica & Confirmación' : 'Horarios y Prueba Diagnóstica'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {currentPlan.isSelfPaced
                ? 'La prueba toma de 5 a 10 minutos y te posiciona en el libro y nivel ideal para comenzar.'
                : 'Selecciona tus turnos preferidos y completa la prueba para que La Teacher Cokitö organice tu grupo.'}
            </p>
          </div>

          {/* FINANCIAL & PLAN SUMMARY CARD BEFORE SELECTING HOURS */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-5 sm:p-6 space-y-4 shadow-md border border-slate-800 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30 inline-block mb-1.5">
                  Resumen de tu Inscripción
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {currentPlan.title}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Modalidad: <strong className="text-amber-300 capitalize">{selectedModality}</strong> • Formato: <strong className="text-amber-300">
                    {selectedPlanId === 'digital_5' ? 'Pase Autónomo' : selectedGroupSize === 'individual' ? 'Privada (1 a 1)' : selectedGroupSize === 'duo' ? 'Dúo (2 Alumnos)' : 'Grupal (3-4 Pax)'}
                  </strong>
                </p>
              </div>

              <div className="text-left sm:text-right bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 shrink-0">
                <span className="text-[10px] text-slate-300 uppercase font-bold block">
                  {selectedPlanId === 'digital_5' ? 'Monto a pagar:' : selectedGroupSize === 'individual' ? 'Abono hoy / Reserva:' : 'Abono de Reserva Hoy:'}
                </span>
                <span className="text-2xl font-black text-emerald-400 block">
                  $5 USD
                </span>
                <span className="text-[11px] text-amber-300 font-bold block mt-0.5">
                  ≈ {convertUsdToBs(5, bcvRate).formattedBs} (BCV)
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-emerald-400 text-sm font-bold">💡</span>
              <p>
                {selectedPlanId === 'digital_5'
                  ? 'Con tu pago de $5 USD desbloqueas inmediatamente los 12 niveles, audios oficiales, libros y quizzes con Cyber Owl.'
                  : selectedGroupSize === 'individual'
                  ? 'Marca tus horarios preferidos abajo. En el siguiente paso reportarás tu pago móvil de $5 USD (o la totalidad) para que la Directora Waky active tu acceso.'
                  : 'Para ingresar hoy a la plataforma y apartar tu puesto, solo abonas la reserva de $5 USD (o en Bs). Este monto se descontará 100% de tu mensualidad cuando la Directora Waky confirme y conforme tu grupo definitivo.'}
              </p>
            </div>
          </div>

          {/* Schedule Picker (Only if LIVE classes plan is chosen) */}
          {!currentPlan.isSelfPaced && (
            <div className="space-y-3">
              {/* Plan Rules & Limits Banner */}
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-4 space-y-2 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-300" />
                    <span className="text-xs font-bold">
                      Frecuencia Oficial: <span className="text-amber-300">{allowedDays.join(' - ')}</span>
                    </span>
                  </div>
                  <span className="text-[11px] font-black bg-white/20 px-2.5 py-0.5 rounded-full border border-white/30">
                    {selectedSlotIds.length} / {maxHoursForPlan} horas elegidas
                  </span>
                </div>
                <p className="text-[11px] text-blue-200">
                  {selectedPlanId === 'regular_3' && '📌 El Plan Regular de 3h/sem se organiza los Lunes, Miércoles y Viernes.'}
                  {selectedPlanId === 'basic_2' && '📌 El Plan Súper Básico de 2h/sem se organiza los Martes y Jueves.'}
                  {selectedPlanId === 'express_6' && '📌 El Plan Express de 6h/sem se organiza los Lunes, Miércoles y Viernes.'}
                  {selectedPlanId === 'intensive_4' && '📌 El Plan Intensivo de 4h/sem se organiza de Lunes a Jueves.'}
                </p>
              </div>

              {/* Notice Banner */}
              {scheduleNotice && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 font-semibold flex items-center justify-between">
                  <span>{scheduleNotice}</span>
                  <button 
                    type="button" 
                    onClick={() => setScheduleNotice(null)}
                    className="text-amber-700 hover:text-amber-950 font-bold ml-2 text-xs"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Schedule Rules Legend */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div>🌅 <strong>06:00 - 08:00:</strong> Grupos Matutinos (6-7 y 7-8 am)</div>
                <div>🎒 <strong>15:00 - 17:00:</strong> Prioridad Alumno Escolar</div>
                <div>🏫 <strong>17:00 - 19:00:</strong> Prioridad Teachers CSB</div>
                <div>🌙 <strong>20:00 - 22:00:</strong> Exclusivo Grupos Adultos</div>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {days.map(day => {
                    const daySlots = slots.filter(s => s.day === day);
                    const isAllowedDay = allowedDays.includes(day);

                    return (
                      <div 
                        key={day} 
                        className={`rounded-xl p-2 border text-center transition-all ${
                          isAllowedDay
                            ? 'bg-slate-50 border-slate-200'
                            : 'bg-slate-100/60 border-slate-200/50 opacity-50'
                        }`}
                      >
                        <span className={`text-[11px] font-bold block pb-1 border-b uppercase ${
                          isAllowedDay ? 'text-slate-800 border-slate-200' : 'text-slate-400 border-slate-200/50'
                        }`}>
                          {day}
                        </span>
                        
                        <div className="mt-1.5 space-y-1">
                          {daySlots.map(slot => {
                            const isBooked = slot.status === 'booked';
                            const isSelected = selectedSlotIds.includes(slot.id);
                            const restriction = getSlotRestriction(slot);
                            const isBlocked = restriction.isBlocked;

                            return (
                              <button
                                key={slot.id}
                                type="button"
                                disabled={isBooked || (isBlocked && !isSelected)}
                                onClick={() => handleToggleSlot(slot)}
                                title={restriction.reason || `Turno ${slot.startTime} a ${slot.endTime}`}
                                className={`w-full p-1.5 rounded-lg text-[10px] font-medium transition-all ${
                                  isBooked
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    : isSelected
                                    ? 'bg-blue-600 text-white font-bold shadow-2xs'
                                    : isBlocked
                                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                                    : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50/50'
                                }`}
                              >
                                <span>{slot.startTime} - {slot.endTime}</span>
                                <span className="block opacity-80 text-[8px] truncate">
                                  {isBooked ? '🔒 Reserv.' : isSelected ? '✓ Elegido' : isBlocked ? 'No disp.' : 'Libre'}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Self-Paced Note */}
          {currentPlan.isSelfPaced && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <strong className="block font-bold">Modalidad 100% Asincrónica:</strong>
                <span>No necesitas agendar clases en vivo. Podrás ingresar a la plataforma, resolver los retos del Cyber Owl y avanzar a cualquier hora del día o de la noche.</span>
              </div>
            </div>
          )}

          {/* COUPON / BECA CODE INPUT (WITHOUT LEAKING ANY CODES!) */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-600" />
              <strong className="text-xs font-bold text-slate-900">
                ¿Tienes un Código de Invitación, Beca o Cupón?
              </strong>
            </div>

            {appliedCoupon ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="font-bold block">Código Activo: {appliedCoupon.code}</span>
                    <span className="text-[11px] text-emerald-700">{appliedCoupon.label}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAppliedCoupon(null)}
                  className="text-xs text-rose-600 hover:underline font-bold"
                >
                  Quitar
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  placeholder="Ingresa tu código promocional o beca..."
                  className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase tracking-wider focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
                >
                  Aplicar Código
                </button>
              </form>
            )}

            {couponError && (
              <p className="text-[11px] text-rose-600 font-semibold">{couponError}</p>
            )}
          </div>

          {/* PLACEMENT TEST REQUIREMENT (100% OPCIONAL) */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 rounded-3xl p-5 sm:p-6 text-white space-y-4 shadow-md border border-blue-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-400 text-emerald-950 px-2.5 py-0.5 rounded-full inline-block mb-1">
                  100% Opcional
                </span>
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  Prueba Diagnóstica de Nivel (25 Preguntas)
                </h3>
                <p className="text-xs text-blue-200 max-w-md mt-0.5 leading-relaxed">
                  ¿Quieres medir tu nivel ahora? Puedes hacer la prueba rápida para sugerir tu libro oficial, o puedes finalizar tu inscripción directamente e iniciar desde el Nivel 1 (Principiante).
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsQuizModalOpen(true)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs rounded-xl shadow-md transition-colors whitespace-nowrap flex items-center justify-center gap-1.5"
                >
                  <span>{placementResult ? '✓ Repetir Prueba' : '📝 Hacer Prueba Ahora'}</span>
                </button>
              </div>
            </div>

            {placementResult ? (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center justify-between text-xs animate-fadeIn">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">
                      Resultado Registrado: {placementResult.score} / {placementResult.total} puntos
                    </span>
                    <span className="text-blue-200 text-[11px] block">{placementResult.suggestedLevelName}</span>
                  </div>
                </div>
                <span className="text-[11px] bg-emerald-500/30 text-emerald-200 px-2.5 py-1 rounded-full font-bold border border-emerald-400/30">
                  Nivel Asignado
                </span>
              </div>
            ) : (
              <div className="p-3 bg-white/10 border border-white/20 rounded-2xl text-xs text-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Modo directo:</strong> Comenzarás en el Nivel 1 (Principiante A1). Podrás tomar la prueba de nivel en cualquier momento desde tu perfil.</span>
                </div>
                <span className="text-[11px] bg-amber-400/20 text-amber-200 border border-amber-400/30 px-2.5 py-1 rounded-lg font-bold shrink-0 self-start sm:self-auto">
                  Nivel 1 por defecto
                </span>
              </div>
            )}
          </div>

          {/* Navigation & Submit */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 text-slate-600 text-xs font-semibold hover:text-slate-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all hover:scale-101 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Preparando tu comprobante de pago...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {appliedCoupon 
                      ? 'Finalizar con Cupón 100% Bonificado' 
                      : `Continuar al Pago Móvil ($5 USD • ${convertUsdToBs(5, bcvRate).formattedBs}) ➡️`}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

        {/* STEP 4: Post-Registration Account Validation Screen */}
        {step === 4 && registeredStudent && (() => {
          const isDigital = selectedPlanId === 'digital_5';
          const isGroup = selectedPlanId !== 'digital_5' && selectedGroupSize !== 'individual';
          const isPrivate = selectedPlanId !== 'digital_5' && selectedGroupSize === 'individual';
          const calculatedDueUsd = isDigital ? 5 : (isGroup ? 5 : (payFullPrivate ? currentPlan.priceNumber : 5));
          const step4Conversion = convertUsdToBs(calculatedDueUsd, bcvRate);

          return (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 animate-fadeIn space-y-6">
              
              {/* Header Status */}
              <div className="text-center space-y-2">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-md ${
                  registeredStudent.paymentStatus === 'trial_24h'
                    ? 'bg-amber-100 text-amber-700'
                    : registeredStudent.status === 'enrolled' 
                    ? 'bg-emerald-100 text-emerald-600' 
                    : pagoMovilSubmitted || registeredStudent.paymentStatus === 'pending_approval'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-amber-100 text-amber-600'
                }`}>
                  {registeredStudent.paymentStatus === 'trial_24h' ? (
                    <Gift className="w-8 h-8" />
                  ) : registeredStudent.status === 'enrolled' ? (
                    <CheckCircle2 className="w-8 h-8" />
                  ) : pagoMovilSubmitted || registeredStudent.paymentStatus === 'pending_approval' ? (
                    <Clock className="w-8 h-8" />
                  ) : (
                    <Lock className="w-8 h-8" />
                  )}
                </div>

                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block ${
                  registeredStudent.paymentStatus === 'trial_24h'
                    ? 'text-amber-800 bg-amber-50 border border-amber-300'
                    : registeredStudent.status === 'enrolled'
                    ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                    : pagoMovilSubmitted || registeredStudent.paymentStatus === 'pending_approval'
                    ? 'text-blue-800 bg-blue-50 border border-blue-200'
                    : 'text-amber-800 bg-amber-50 border border-amber-200'
                }`}>
                  {registeredStudent.paymentStatus === 'trial_24h'
                    ? '🎁 Pase de Cortesía de 24 Horas Activo'
                    : registeredStudent.status === 'enrolled' 
                    ? '¡Cuenta Validada y Activa!' 
                    : pagoMovilSubmitted || registeredStudent.paymentStatus === 'pending_approval'
                    ? 'Comprobante en Revisión por la Directora Waky'
                    : 'Paso Final • Validación de Cuenta Requerida'}
                </span>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Bienvenido(a), {registeredStudent.name}
                </h2>

                <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                  Tus datos y tu prueba diagnóstica (<strong>{registeredStudent.placementTestScore}/25 pts</strong>) han quedado guardados en el sistema con nivel sugerido <strong>{(registeredStudent.levelId || 'level_1').toUpperCase()}</strong>.
                </p>
              </div>

              {/* Registration Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 max-w-md mx-auto text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Alumno:</span>
                  <strong className="text-slate-900">{registeredStudent.name} {registeredStudent.lastName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Plan Seleccionado:</span>
                  <strong className="text-blue-700">{currentPlan.title}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Modalidad & Formato:</span>
                  <strong className="text-slate-800 capitalize">
                    {isDigital ? 'Autónomo Asincrónico' : `${selectedModality} • ${selectedGroupSize === 'individual' ? 'Clase 1 a 1' : selectedGroupSize === 'duo' ? 'Dúo (2 alumnos)' : 'Grupal (3-4 alumnos)'}`}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{isDigital ? 'Monto a pagar:' : isGroup ? 'Abono de Reserva Requerido Hoy:' : 'Abono Hoy:'}</span>
                  <strong className="text-emerald-700 font-bold">${calculatedDueUsd} USD (Bs. {step4Conversion.formattedBs})</strong>
                </div>
                {isGroup && (
                  <p className="text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                    💡 Los $5 USD de hoy se descuentan 100% de tu mensualidad al confirmarse el grupo.
                  </p>
                )}
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Estado de Cuenta:</span>
                  <strong className={
                    registeredStudent.paymentStatus === 'trial_24h' ? 'text-amber-700' :
                    registeredStudent.status === 'enrolled' ? 'text-emerald-700' :
                    pagoMovilSubmitted ? 'text-blue-700' : 'text-amber-600'
                  }>
                    {registeredStudent.paymentStatus === 'trial_24h' ? '🎁 Modo Cortesía (24h)' :
                     registeredStudent.status === 'enrolled' ? '🟢 Acceso Total Desbloqueado' :
                     pagoMovilSubmitted ? '🔵 Pago en Conciliación Bancaria' : '🟡 Modo Guest (Pendiente de Aprobación)'}
                  </strong>
                </div>
              </div>

              {/* SCENARIO A: 24-HOUR TRIAL OR ACTIVE ENROLLED */}
              {(registeredStudent.status === 'enrolled' || registeredStudent.paymentStatus === 'trial_24h') ? (
                <div className="text-center space-y-4 pt-2 max-w-md mx-auto">
                  <div className={`p-4 rounded-2xl text-xs font-medium space-y-2 ${
                    registeredStudent.paymentStatus === 'trial_24h'
                      ? 'bg-amber-50 border border-amber-200 text-amber-950'
                      : 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                  }`}>
                    <p className="font-bold text-sm">
                      {registeredStudent.paymentStatus === 'trial_24h'
                        ? '🎁 ¡Tu Pase de Cortesía de 24 Horas está Activo!'
                        : '🎉 ¡Tu cuenta está 100% activa!'}
                    </p>
                    <p className="leading-relaxed">
                      {registeredStudent.paymentStatus === 'trial_24h'
                        ? 'Explora el campus, haz tus primeros quizzes y audios. Recuerda completar tu pago antes de que expiren las 24 horas para asegurar tu cupo definitivo.'
                        : 'Tienes acceso a tus libros oficiales, quizzes del Cyber Owl y tu agenda de clases.'}
                    </p>
                  </div>

                  {/* Welcome Lounge WhatsApp button */}
                  <a
                    href={OFFICIAL_PAGO_MOVIL.whatsappWelcomeLoungeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-101"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Unirme al Welcome Lounge en WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={onExploreCalendar}
                    className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-sm shadow-md transition-all hover:scale-101 flex items-center justify-center gap-2"
                  >
                    <span>Entrar a mi Classroom y Comenzar</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              ) : pagoMovilSubmitted || registeredStudent.paymentStatus === 'pending_approval' ? (
                /* SCENARIO B: PAYMENT SUBMITTED - WAITING FOR WAKY TO APPROVE IN BANK */
                <div className="space-y-5 max-w-md mx-auto pt-2 text-center">
                  <div className="p-5 bg-blue-50 border-2 border-blue-200 rounded-2xl text-blue-950 space-y-2 text-xs">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
                      <Clock className="w-6 h-6" />
                    </div>
                    <h4 className="font-black text-sm text-blue-900">
                      ¡Comprobante Recibido por la Dirección!
                    </h4>
                    <p className="text-blue-800 leading-relaxed">
                      La <strong>Directora Waky</strong> está validando tu referencia bancaria en Banco Provincial. En cuanto sea conciliada, se desbloqueará tu acceso completo.
                    </p>
                    <div className="bg-white/80 p-2.5 rounded-xl border border-blue-200 font-semibold text-[11px] text-blue-900">
                      Referencia reportada: <strong>{registeredStudent.pagoMovilRef || pagoMovilRef}</strong>
                    </div>
                  </div>

                  {/* Crucial Welcome Lounge WhatsApp Community Button */}
                  <div className="space-y-2">
                    <p className="text-xs text-slate-600 font-medium">
                      Mientras la Directora valida tu cupo, únete a nuestra comunidad oficial:
                    </p>
                    <a
                      href={OFFICIAL_PAGO_MOVIL.whatsappWelcomeLoungeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-101"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>👉 Entrar al Welcome Lounge en WhatsApp</span>
                    </a>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={onExploreCalendar}
                      className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>🔒 Explorar la estructura en Modo Guest</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* SCENARIO C: PENDING VALIDATION (Requires Code or Payment) */
                <div className="space-y-6 max-w-xl mx-auto pt-2">
                  
                  {/* Notification banners */}
                  {step4Success && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-bold text-center animate-fadeIn">
                      {step4Success}
                    </div>
                  )}
                  {step4Error && (
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-bold text-center animate-fadeIn">
                      {step4Error}
                    </div>
                  )}

                  {/* OPTION 1: CODE VALIDATION (CSB, Becas, Promociones) */}
                  <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-blue-950">
                          Opción 1: Validar con Código Promocional o Beca CSB
                        </h4>
                        <p className="text-[11px] text-blue-800/80">
                          Si eres teacher o personal del Colegio Simón Bolívar o tienes un código de cortesía:
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleValidateStep4Code} className="flex flex-col sm:flex-row gap-2 pt-1">
                      <input
                        type="text"
                        value={step4Code}
                        onChange={e => setStep4Code(e.target.value)}
                        placeholder="Ej. CSB-PRE, COKITO2026, BECA100"
                        className="flex-1 p-3 bg-white border border-blue-200 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                      <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs shadow-md transition-colors whitespace-nowrap"
                      >
                        Validar Código
                      </button>
                    </form>
                  </div>

                  {/* OPTION 2: PAYMENT VALIDATION (PAGO MÓVIL BANCO PROVINCIAL O DIVISAS) */}
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900">
                            Opción 2: Pago Móvil Oficial (Banco Provincial)
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            {isDigital ? 'Pase Digital Autónomo ($5/mes)' :
                             isGroup ? 'Reserva de Cupo Grupal ($5 USD deducible de la mensualidad)' :
                             'Reserva de cupo o pago de clases privadas'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-base font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
                          ${calculatedDueUsd} USD
                        </span>
                        <span className="block text-[10px] text-slate-500 font-semibold mt-0.5">
                          Tasa BCV: Bs. {bcvRate.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Private Class Toggle (Pay $5 deposit vs pay full) */}
                    {isPrivate && (
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 text-xs">
                        <span className="font-bold text-slate-800 block">Modalidad de Pago para Clases Privadas:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setPayFullPrivate(false)}
                            className={`p-2.5 rounded-lg border text-left transition-all ${
                              !payFullPrivate 
                                ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-950 shadow-2xs' 
                                : 'bg-slate-50 border-slate-200 text-slate-600'
                            }`}
                          >
                            <span className="block font-black text-emerald-700">⭐ Apartar con $5 USD</span>
                            <span className="text-[10px] block opacity-80">Paga la diferencia (${currentPlan.priceNumber - 5}) antes de iniciar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPayFullPrivate(true)}
                            className={`p-2.5 rounded-lg border text-left transition-all ${
                              payFullPrivate 
                                ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-950 shadow-2xs' 
                                : 'bg-slate-50 border-slate-200 text-slate-600'
                            }`}
                          >
                            <span className="block font-black text-slate-900">Totalidad (${currentPlan.priceNumber} USD)</span>
                            <span className="text-[10px] block opacity-80">Mes completo de clases cancelado</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Group Class Rule Explanation */}
                    {isGroup && (
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
                        💡 <strong>Reserva de Cupo Grupal ($5 USD):</strong> Para grupos conformados, hoy solo abonas $5 USD (o su equivalente en Bs) para apartar tu lugar. <strong>Este monto se deducirá al 100% de tu primera mensualidad</strong> una vez que la Directora Waky confirme y cierre tu grupo y tarifa final.
                      </div>
                    )}

                    {/* Bank Details Card */}
                    <div className="p-4 bg-white border border-emerald-200 rounded-xl space-y-2 text-xs">
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

                      <div className="flex justify-between items-center pt-1.5 border-t border-slate-100">
                        <span className="text-slate-500 font-semibold">Monto Exacto a Transferir:</span>
                        <div className="flex items-center gap-1.5">
                          <strong className="text-emerald-700 font-extrabold text-sm sm:text-base">
                            {step4Conversion.formattedBs}
                          </strong>
                          <button
                            type="button"
                            onClick={() => handleCopy(step4Conversion.bsAmount.toString(), 'monto')}
                            className="text-emerald-600 hover:text-emerald-700 p-0.5"
                            title="Copiar monto en Bs"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      {copiedKey && (
                        <p className="text-[10px] text-emerald-700 font-bold text-center pt-0.5">¡Dato copiado al portapapeles!</p>
                      )}
                    </div>

                    {/* Form to submit payment reference */}
                    <form 
                      onSubmit={(e) => handleReportPagoMovilStep4(e, calculatedDueUsd, step4Conversion.bsAmount)} 
                      className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3"
                    >
                      <h5 className="font-bold text-xs text-slate-800">Reportar Transferencia / Referencia:</h5>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Banco desde el que pagaste:</label>
                          <select
                            value={pagoMovilBank}
                            onChange={e => setPagoMovilBank(e.target.value)}
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium"
                          >
                            <option value="Banco de Venezuela">Banco de Venezuela</option>
                            <option value="Banesco">Banesco</option>
                            <option value="Mercantil">Mercantil</option>
                            <option value="Bancamiga">Bancamiga</option>
                            <option value="Banco Provincial">Banco Provincial</option>
                            <option value="BNC">BNC</option>
                            <option value="Otro">Otro Banco</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Número de Referencia:</label>
                          <input
                            type="text"
                            value={pagoMovilRef}
                            onChange={e => setPagoMovilRef(e.target.value)}
                            placeholder="Ej. 948201"
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Enviar Comprobante a Dirección ({step4Conversion.formattedBs})</span>
                      </button>
                    </form>
                  </div>

                  {/* OPTION 3: RETENTION HERO BUTTON - 24 HOURS COURTESY TRIAL (NO STUDENTS LOST!) */}
                  <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl shrink-0 shadow-xs">
                        🎁
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-amber-950">
                          ¿No tienes para transferir en este momento?
                        </h4>
                        <p className="text-xs text-amber-900/90 mt-0.5 leading-relaxed">
                          ¡No te vayas! Te obsequiamos un <strong>Pase de Cortesía de 24 Horas</strong> para que explores el campus, hagas tus primeras prácticas diagnósticas y comiences hoy mismo sin perder tu motivación.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleActivateTrial24h}
                        className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <Gift className="w-4 h-4" />
                        <span>Activar mi Pase de Cortesía de 24 Horas (Gratis)</span>
                      </button>

                      <a
                        href={OFFICIAL_PAGO_MOVIL.whatsappWelcomeLoungeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 whitespace-nowrap"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Consultar por WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* OPTION 4: GUEST MODE EXPLORER */}
                  <div className="pt-2 text-center space-y-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={onExploreCalendar}
                      className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold text-xs transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>🔒 Continuar explorando en Modo Guest</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              )}

            </div>
          );
        })()}

      {/* Standalone Placement Quiz Modal */}
      <PlacementQuizModal
        isOpen={isQuizModalOpen}
        studentName={name || 'Aspirante'}
        onClose={() => setIsQuizModalOpen(false)}
        onFinishTest={(result) => {
          setPlacementResult({
            score: result.score,
            total: result.total,
            suggestedLevelId: result.suggestedLevelId,
            suggestedLevelName: result.suggestedLevelName,
            diagnosisText: result.diagnosisText
          });
          setIsQuizModalOpen(false);
        }}
      />

    </div>
  );
};
