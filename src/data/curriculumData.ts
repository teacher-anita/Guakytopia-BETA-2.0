import { EnglishLevel, PlanConfig, PlanIntensity, Student, ScheduleSlot, DailyChallenge, ClassroomMaterial } from '../types';

export const INTENSITY_PLANS: Record<PlanIntensity, PlanConfig> = {
  basic: {
    id: 'basic',
    name: 'Súper Básico (2 h/semana)',
    hoursPerWeek: 2,
    badge: 'Constante y Relajado',
    description: 'Un avance constante y relajado sin sobrecarga. Terminas cada nivel en 24 semanas (6 meses).',
    recommendedFor: 'Profesionales, estudiantes o personas con agenda apretada.',
    recommendedFormat: '2 sesiones de 60 minutos (ej. Martes y Jueves o Lunes y Miércoles).',
    hourlyRates: {
      individual: 15.00,
      duo: 13.75,
      squad3: 11.67,
      crew4: 10.62
    },
    prices: {
      individual: 30, // $15/h * 2h
      duo: 55,        // $13.75/h * 4h total
      squad3: 70,     // $11.67/h * 6h total
      crew4: 85       // $10.62/h * 8h total
    },
    perPaxWeekly: {
      individual: 30.00,
      duo: 27.50,
      squad3: 23.33,
      crew4: 21.25
    },
    monthlyPrices: {
      individual: 110, // Ahorro vs $120 (Bolsa de 8 horas prepagadas - 30 días)
      duo: 200,        // Ahorro vs $220 ($100 x alumno)
      squad3: 250,     // Ahorro vs $280 ($83.33 x alumno)
      crew4: 300       // Ahorro vs $340 ($75 x alumno)
    },
    perPaxMonthly: {
      individual: 110.00,
      duo: 100.00,
      squad3: 83.33,
      crew4: 75.00
    }
  },
  regular: {
    id: 'regular',
    name: 'Regular (3 h/semana)',
    hoursPerWeek: 3,
    badge: 'Equilibrio Perfecto',
    description: 'El equilibrio óptimo entre velocidad y asimilación. Terminas cada nivel en 16 semanas (4 meses).',
    recommendedFor: 'Metas a mediano plazo y preparación de certificaciones intermedias.',
    recommendedFormat: '2 sesiones de 90 min (ej. Lun/Mié o Mar/Jue).',
    hourlyRates: {
      individual: 13.33,
      duo: 12.00,
      squad3: 10.56,
      crew4: 9.17
    },
    prices: {
      individual: 40, // $13.33/h * 3h
      duo: 72,        // $12.00/h * 6h total
      squad3: 95,     // $10.56/h * 9h total
      crew4: 110      // $9.17/h * 12h total
    },
    perPaxWeekly: {
      individual: 40.00,
      duo: 36.00,
      squad3: 31.67,
      crew4: 27.50
    },
    monthlyPrices: {
      individual: 145, // Ahorro vs $160 (Bolsa de 12 horas prepagadas - 30 días)
      duo: 260,        // $130 x alumno
      squad3: 340,     // $113.33 x alumno
      crew4: 390       // $97.50 x alumno
    },
    perPaxMonthly: {
      individual: 145.00,
      duo: 130.00,
      squad3: 113.33,
      crew4: 97.50
    }
  },
  intensive: {
    id: 'intensive',
    name: 'Intensivo (4 h/semana)',
    hoursPerWeek: 4,
    badge: 'Para los que llevan prisa',
    description: 'Progreso acelerado con práctica conversacional inmersiva. Terminas cada nivel en 12 semanas (3 meses).',
    recommendedFor: 'Viajes próximos, entrevistas laborales en inglés o exámenes.',
    recommendedFormat: '2 sesiones de 120 min (con receso anti-fatiga) o 4 sesiones de 60 min.',
    hourlyRates: {
      individual: 12.50,
      duo: 10.62,
      squad3: 9.17,
      crew4: 7.50
    },
    prices: {
      individual: 50, // $12.50/h * 4h
      duo: 85,        // $10.62/h * 8h total
      squad3: 110,    // $9.17/h * 12h total
      crew4: 120      // $7.50/h * 16h total
    },
    perPaxWeekly: {
      individual: 50.00,
      duo: 42.50,
      squad3: 36.67,
      crew4: 30.00
    },
    monthlyPrices: {
      individual: 180, // Ahorro vs $200 (Bolsa de 16 horas prepagadas - 30 días)
      duo: 305,        // $152.50 x alumno
      squad3: 395,     // $131.67 x alumno
      crew4: 430       // $107.50 x alumno
    },
    perPaxMonthly: {
      individual: 180.00,
      duo: 152.50,
      squad3: 131.67,
      crew4: 107.50
    }
  },
  super_intensive: {
    id: 'super_intensive',
    name: 'Súper Intensivo (6 h/semana)',
    hoursPerWeek: 6,
    badge: '¡Máxima Velocidad!',
    description: 'Inmersión total. Terminas cada nivel en 8 semanas (2 meses) con sesiones estructuradas de 120 min.',
    recommendedFor: 'Reubicación internacional o metas profesionales urgentes.',
    recommendedFormat: 'Lunes (2h) + Miércoles (2h) + Viernes (2h) en bloques anti-fatiga.',
    hourlyRates: {
      individual: 10.00,
      duo: 8.33,
      squad3: 6.94,
      crew4: 5.83
    },
    prices: {
      individual: 60, // $10.00/h * 6h
      duo: 100,       // $8.33/h * 12h total
      squad3: 125,    // $6.94/h * 18h total
      crew4: 140      // $5.83/h * 24h total
    },
    perPaxWeekly: {
      individual: 60.00,
      duo: 50.00,
      squad3: 41.67,
      crew4: 35.00
    },
    monthlyPrices: {
      individual: 215, // Ahorro vs $240 (Bolsa de 24 horas prepagadas - 30 días)
      duo: 360,        // $180 x alumno
      squad3: 450,     // $150 x alumno
      crew4: 500       // $125 x alumno
    },
    perPaxMonthly: {
      individual: 215.00,
      duo: 180.00,
      squad3: 150.00,
      crew4: 125.00
    }
  }
};

export const MODULES_INFO = [
  {
    module: 1,
    name: 'Fundamentos Esenciales',
    tagline: '¡Pierde el Miedo!',
    levelsText: 'Niveles I al III',
    booksText: 'Super Goal 1, 2 y 3',
    meta: 'Alcanzar nivel A1+ (Usuario Básico Conectado)',
    hours: '48h por nivel (144h totales)',
    description: 'Diseñado para sanar traumas del pasado con el idioma. Aprenderás a presentarte, describir tu rutina, hablar de comida, precios, el hogar y expresarte con seguridad.',
    badgeColor: 'emerald'
  },
  {
    module: 2,
    name: 'Consolidación e Independencia',
    tagline: '¡Suelta la Lengua!',
    levelsText: 'Niveles IV al VI',
    booksText: 'Super Goal 4, 5 y 6',
    meta: 'Alcanzar nivel B1 / B1+ (Usuario Independiente)',
    hours: '48h por nivel (144h totales)',
    description: 'Dejarás de traducir en tu mente. Conectarás ideas complejas, hablarás de viajes, tecnología, experiencias de vida en Presente Perfecto y darás consejos.',
    badgeColor: 'amber'
  },
  {
    module: 3,
    name: 'Fluidez Avanzada y Debate',
    tagline: '¡Piensa en Inglés!',
    levelsText: 'Niveles VII al IX',
    booksText: 'Mega Goal 1, 2 y 3',
    meta: 'Alcanzar nivel B2 (Usuario Independiente Fluido)',
    hours: '70h por nivel (210h totales)',
    description: 'Entrada formal al inglés profesional e intelectual. Redacción de correos corporativos, negociación, voz pasiva, condicionales avanzados y debates moderados.',
    badgeColor: 'blue'
  },
  {
    module: 4,
    name: 'Maestría Cognitiva y Profesional',
    tagline: '¡Conquista el Mundo!',
    levelsText: 'Niveles X al XII',
    booksText: 'Mega Goal 4, 5 y 6',
    meta: 'Alcanzar nivel B2+ / C1 (Usuario Competente)',
    hours: '84h por nivel (252h totales)',
    description: 'La cima de la montaña. Ensayos argumentativos complejos, modismos nativos, presentaciones de negocios, inversiones oracionales y preparación TOEFL/IELTS.',
    badgeColor: 'rose'
  }
];

export const ENGLISH_LEVELS: EnglishLevel[] = [
  {
    id: 'level_1',
    levelName: 'Level I',
    cefrEquiv: 'Begginer I (A1)',
    book: 'Super Goal 1',
    category: 'Super Goal',
    module: 1,
    moduleName: 'Fundamentos Esenciales',
    units: 8,
    sections: 11,
    expositions: 2,
    hoursPerUnit: 3.0,
    totalHours: 24.0,
    durations: {
      basic: { weeks: 12.0, months: 3.0 },
      regular: { weeks: 8.0, months: 2.0 },
      intensive: { weeks: 6.0, months: 1.5 },
      super_intensive: { weeks: 4.0, months: 1.0 }
    }
  },
  {
    id: 'level_2',
    levelName: 'Level II',
    cefrEquiv: 'Begginer II (A1+)',
    book: 'Super Goal 2',
    category: 'Super Goal',
    module: 1,
    moduleName: 'Fundamentos Esenciales',
    units: 8,
    sections: 11,
    expositions: 2,
    hoursPerUnit: 3.0,
    totalHours: 24.0,
    durations: {
      basic: { weeks: 12.0, months: 3.0 },
      regular: { weeks: 8.0, months: 2.0 },
      intensive: { weeks: 6.0, months: 1.5 },
      super_intensive: { weeks: 4.0, months: 1.0 }
    }
  },
  {
    id: 'level_3',
    levelName: 'Level III',
    cefrEquiv: 'Beg - Inter I (A2)',
    book: 'Super Goal 3',
    category: 'Super Goal',
    module: 1,
    moduleName: 'Fundamentos Esenciales',
    units: 8,
    sections: 11,
    expositions: 2,
    hoursPerUnit: 3.0,
    totalHours: 24.0,
    durations: {
      basic: { weeks: 12.0, months: 3.0 },
      regular: { weeks: 8.0, months: 2.0 },
      intensive: { weeks: 6.0, months: 1.5 },
      super_intensive: { weeks: 4.0, months: 1.0 }
    }
  },
  {
    id: 'level_4',
    levelName: 'Level IV',
    cefrEquiv: 'Beg - Inter II (A2+)',
    book: 'Super Goal 4',
    category: 'Super Goal',
    module: 2,
    moduleName: 'Consolidación e Independencia',
    units: 8,
    sections: 11,
    expositions: 2,
    hoursPerUnit: 3.0,
    totalHours: 24.0,
    durations: {
      basic: { weeks: 12.0, months: 3.0 },
      regular: { weeks: 8.0, months: 2.0 },
      intensive: { weeks: 6.0, months: 1.5 },
      super_intensive: { weeks: 4.0, months: 1.0 }
    }
  },
  {
    id: 'level_5',
    levelName: 'Level V',
    cefrEquiv: 'Intermediate I (B1)',
    book: 'Super Goal 5',
    category: 'Super Goal',
    module: 2,
    moduleName: 'Consolidación e Independencia',
    units: 6,
    sections: 12,
    expositions: 2,
    hoursPerUnit: 4.0,
    totalHours: 24.0,
    durations: {
      basic: { weeks: 12.0, months: 3.0 },
      regular: { weeks: 8.0, months: 2.0 },
      intensive: { weeks: 6.0, months: 1.5 },
      super_intensive: { weeks: 4.0, months: 1.0 }
    }
  },
  {
    id: 'level_6',
    levelName: 'Level VI',
    cefrEquiv: 'Intermediate II (B1+)',
    book: 'Super Goal 6',
    category: 'Super Goal',
    module: 2,
    moduleName: 'Consolidación e Independencia',
    units: 6,
    sections: 12,
    expositions: 2,
    hoursPerUnit: 4.0,
    totalHours: 24.0,
    durations: {
      basic: { weeks: 12.0, months: 3.0 },
      regular: { weeks: 8.0, months: 2.0 },
      intensive: { weeks: 6.0, months: 1.5 },
      super_intensive: { weeks: 4.0, months: 1.0 }
    }
  },
  {
    id: 'level_7',
    levelName: 'Level VII',
    cefrEquiv: 'Inter - Adv I (B2)',
    book: 'Mega Goal 1',
    category: 'Mega Goal',
    module: 3,
    moduleName: 'Fluidez Avanzada y Debate',
    units: 7,
    sections: 13,
    expositions: 2,
    hoursPerUnit: 5.2,
    totalHours: 36.0,
    durations: {
      basic: { weeks: 18.0, months: 4.5 },
      regular: { weeks: 12.0, months: 3.0 },
      intensive: { weeks: 9.0, months: 2.3 },
      super_intensive: { weeks: 6.0, months: 1.5 }
    }
  },
  {
    id: 'level_8',
    levelName: 'Level VIII',
    cefrEquiv: 'Inter - Adv II (B2+)',
    book: 'Mega Goal 2',
    category: 'Mega Goal',
    module: 3,
    moduleName: 'Fluidez Avanzada y Debate',
    units: 7,
    sections: 13,
    expositions: 2,
    hoursPerUnit: 5.2,
    totalHours: 36.0,
    durations: {
      basic: { weeks: 18.0, months: 4.5 },
      regular: { weeks: 12.0, months: 3.0 },
      intensive: { weeks: 9.0, months: 2.3 },
      super_intensive: { weeks: 6.0, months: 1.5 }
    }
  },
  {
    id: 'level_9',
    levelName: 'Level IX',
    cefrEquiv: 'Inter - Adv III (B2/C1)',
    book: 'Mega Goal 3',
    category: 'Mega Goal',
    module: 3,
    moduleName: 'Fluidez Avanzada y Debate',
    units: 7,
    sections: 13,
    expositions: 2,
    hoursPerUnit: 5.2,
    totalHours: 36.0,
    durations: {
      basic: { weeks: 18.0, months: 4.5 },
      regular: { weeks: 12.0, months: 3.0 },
      intensive: { weeks: 9.0, months: 2.3 },
      super_intensive: { weeks: 6.0, months: 1.5 }
    }
  },
  {
    id: 'level_10',
    levelName: 'Level X',
    cefrEquiv: 'Advanced I (C1)',
    book: 'Mega Goal 4',
    category: 'Mega Goal',
    module: 4,
    moduleName: 'Maestría Cognitiva y Profesional',
    units: 7,
    sections: 13,
    expositions: 2,
    hoursPerUnit: 6.5,
    totalHours: 46.0,
    durations: {
      basic: { weeks: 23.0, months: 5.8 },
      regular: { weeks: 15.3, months: 3.8 },
      intensive: { weeks: 11.5, months: 2.9 },
      super_intensive: { weeks: 7.7, months: 1.9 }
    }
  },
  {
    id: 'level_11',
    levelName: 'Level XI',
    cefrEquiv: 'Advanced II (C1+)',
    book: 'Mega Goal 5',
    category: 'Mega Goal',
    module: 4,
    moduleName: 'Maestría Cognitiva y Profesional',
    units: 7,
    sections: 13,
    expositions: 2,
    hoursPerUnit: 6.5,
    totalHours: 46.0,
    durations: {
      basic: { weeks: 23.0, months: 5.8 },
      regular: { weeks: 15.3, months: 3.8 },
      intensive: { weeks: 11.5, months: 2.9 },
      super_intensive: { weeks: 7.7, months: 1.9 }
    }
  },
  {
    id: 'level_12',
    levelName: 'Level XII',
    cefrEquiv: 'Advanced III (C2)',
    book: 'Mega Goal 6',
    category: 'Mega Goal',
    module: 4,
    moduleName: 'Maestría Cognitiva y Profesional',
    units: 7,
    sections: 13,
    expositions: 2,
    hoursPerUnit: 6.5,
    totalHours: 46.0,
    durations: {
      basic: { weeks: 23.0, months: 5.8 },
      regular: { weeks: 15.3, months: 3.8 },
      intensive: { weeks: 11.5, months: 2.9 },
      super_intensive: { weeks: 7.7, months: 1.9 }
    }
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'student_1791825726430',
    name: 'Carla Andreina',
    lastName: 'Lira',
    username: 'carlalira',
    password: 'password123',
    email: 'carlandreina2407@gmail.com',
    phone: '+58 414 1122334',
    age: 26,
    isKid: false,
    schoolOrProfession: 'Estudiante Campus Güakytopia',
    learningGoal: 'Fluidez y seguridad al hablar inglés con Teacher Cokitö.',
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=carlalira',
    plan: 'basic',
    modality: 'online',
    groupSize: 'individual',
    preferredTimeSlot: 'Lunes y Miércoles 5:00 pm - 6:00 pm',
    levelId: 'level_1',
    status: 'enrolled',
    teacherName: 'Teacher Cokitö / Head Teacher',
    placementTestScore: 24,
    placementTestDiagnosis: 'Beca/Pase activado (Tester #3 • Plan 2 Horas / Semana)',
    registeredAt: '2026-10-12',
    currentUnit: 1,
    completedHours: 0,
    xp: 350,
    streak: 1,
    league: 'Plata',
    rating: { fluency: 4, grammar: 4, vocabulary: 4, pronunciation: 4 },
    notes: 'Horario oficial confirmado: Lunes y Miércoles de 5:00 a 6:00 pm con Teacher Cokitö.',
    assignedSlots: ['lun_17', 'mie_17']
  },
  {
    id: 'student_vaneska',
    name: 'Vaneska',
    lastName: 'Lopez',
    username: 'vaneskalopez',
    email: 'vaneska.lopez@gmail.com',
    phone: '+58 412 9988776',
    age: 35,
    isKid: false,
    schoolOrProfession: 'Madre & Profesional',
    learningGoal: 'Desarrollar fluidez comunicativa en inglés.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    plan: 'regular',
    modality: 'online',
    groupSize: 'individual',
    preferredTimeSlot: 'Lunes y Miércoles 9:00 pm - 10:00 pm',
    levelId: 'level_1',
    status: 'enrolled',
    teacherName: 'Teacher Cokitö / Head Teacher',
    placementTestScore: 0,
    placementTestDiagnosis: 'Prueba diagnóstica pendiente por realizar (0/50 pts).',
    registeredAt: '2026-10-12',
    currentUnit: 1,
    completedHours: 0,
    xp: 200,
    streak: 1,
    league: 'Bronce',
    rating: { fluency: 3, grammar: 3, vocabulary: 3, pronunciation: 3 },
    notes: 'Mamá de Ian Gabriel Mendoza. Horario oficial confirmado: Lunes y Miércoles de 9:00 a 10:00 pm con Teacher Cokitö.',
    assignedSlots: ['lun_21', 'mie_21']
  },
  {
    id: 'student_ian_gabriel',
    name: 'Ian Gabriel',
    lastName: 'Mendoza',
    username: 'iangabriel',
    email: 'ian.gabriel@gmail.com',
    parentEmail: 'vaneska.lopez@gmail.com',
    phone: '+58 412 9988776',
    age: 10,
    isKid: true,
    schoolOrProfession: 'Estudiante Escolar (Hijo de Vaneska Lopez)',
    learningGoal: 'Aprender inglés divertido y con confianza.',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=IanGabriel',
    plan: 'intensive',
    modality: 'online',
    groupSize: 'individual',
    preferredTimeSlot: 'Lunes y Miércoles 10:00 am - 12:00 m (2 Horas)',
    levelId: 'level_1',
    status: 'enrolled',
    teacherName: 'Teacher Cokitö / Head Teacher',
    placementTestScore: 0,
    placementTestDiagnosis: 'Prueba diagnóstica pendiente por realizar (0/50 pts).',
    registeredAt: '2026-10-12',
    currentUnit: 1,
    completedHours: 0,
    xp: 250,
    streak: 1,
    league: 'Bronce',
    rating: { fluency: 3, grammar: 3, vocabulary: 3, pronunciation: 3 },
    notes: 'Hijo de Vaneska Lopez. Bloque matutino de 2 horas continuas: Lunes y Miércoles de 10:00 am a 12:00 m con Teacher Cokitö.',
    assignedSlots: ['lun_10', 'lun_11', 'mie_10', 'mie_11']
  },
  {
    id: 'student_genesis_puello_new',
    name: 'Génesis',
    lastName: 'Puello',
    username: 'genesispuello',
    password: 'password123',
    cedula: 'V-25.998.112',
    email: 'genesis.puello@gmail.com',
    phone: '+58 414 7891234',
    age: 26,
    isKid: false,
    schoolOrProfession: 'Ingeniera & Emprendedora Digital',
    learningGoal: 'Fluidez conversacional en inglés para reuniones de negocios y proyectos internacionales.',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    plan: 'regular',
    modality: 'online',
    groupSize: 'individual',
    preferredTimeSlot: 'Lunes y Miércoles 8:00 pm - 9:00 pm',
    levelId: 'level_1',
    status: 'enrolled',
    teacherName: 'Teacher Cokitö / Head Teacher',
    placementTestScore: 0,
    placementTestDiagnosis: 'Prueba diagnóstica pendiente por realizar (0/50 pts).',
    registeredAt: '2026-10-06',
    currentUnit: 1,
    completedHours: 0,
    xp: 320,
    streak: 2,
    league: 'Bronce',
    rating: { fluency: 3, grammar: 3, vocabulary: 3, pronunciation: 3 },
    notes: 'Horario oficial confirmado: Lunes y Miércoles de 8:00 a 9:00 pm con Directora Waky.',
    assignedSlots: ['lun_20', 'mie_20']
  },
  {
    id: 'student_maria_guadalupe',
    name: 'Maria Guadalupe',
    lastName: 'Peña Montilla',
    cedula: 'V-26.418.082',
    email: 'malupena26.mo@gmail.com',
    phone: '04241830082',
    age: 25,
    isKid: false,
    schoolOrProfession: 'Auxiliar - CSB Preschool (PRE CSB)',
    learningGoal: 'Consolidación comunicativa, fluidez en inglés y desarrollo profesional.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    plan: 'basic',
    modality: 'presencial',
    groupSize: 'individual',
    preferredTimeSlot: 'Martes y Jueves 6:00 pm - 7:00 pm',
    levelId: 'level_1',
    status: 'enrolled',
    teacherName: 'Teacher Cokitö / Head Teacher',
    placementTestScore: 0,
    placementTestDiagnosis: 'Prueba diagnóstica pendiente por realizar (0/50 pts).',
    placementTestDate: '2026-10-02',
    registeredAt: '2026-10-02',
    currentUnit: 1,
    completedHours: 4.0,
    xp: 650,
    streak: 4,
    league: 'Bronce',
    rating: { fluency: 2, grammar: 2, vocabulary: 3, pronunciation: 3 },
    notes: 'Alumna confirmada en Super Goal 1 (Principiante). Horario oficial acordado: Martes y Jueves de 6:00 pm a 7:00 pm con Directora Waky. Institución: PRE CSB (Auxiliar). Correos: malupena26.mo@gmail.com / malupena.26mo@gmail.com. Tel: 04241830082.',
    assignedSlots: ['mar_18', 'jue_18'],
    paymentBillingCycle: 'monthly',
    prepaidHoursBalance: 6,
    prepaidHoursTotal: 8,
    prepaidHoursExpiresAt: '2026-11-11',
    isPrepaidActive: true
  },
  {
    id: 'student_carlos',
    name: 'Carlos',
    lastName: 'Mendoza',
    cedula: 'V-19.876.543',
    email: 'carlos.mendoza@example.com',
    phone: '+58 414 9876543',
    age: 32,
    isKid: false,
    schoolOrProfession: 'Ingeniero de Software en Tech Latam',
    learningGoal: 'Entrevistas de trabajo en inglés con clientes en Estados Unidos.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    plan: 'regular',
    modality: 'online',
    groupSize: 'individual',
    preferredTimeSlot: 'Noches (6:00 - 8:00 pm)',
    levelId: 'level_3',
    status: 'enrolled',
    placementTestScore: 14,
    placementTestDiagnosis: 'Buen manejo de vocabulario cotidiano. Necesita soltar la lengua en Presente Perfecto y fluidez auditiva.',
    placementTestDate: '2026-08-15',
    registeredAt: '2026-08-15',
    currentUnit: 4,
    completedHours: 14.5,
    xp: 1420,
    streak: 12,
    league: 'Oro',
    rating: { fluency: 4, grammar: 3, vocabulary: 4, pronunciation: 4 },
    notes: 'Excelente pronunciación. Reforzando el uso del Present Perfect vs Past Simple.',
    assignedSlots: ['Lunes-18:00', 'Miércoles-18:00']
  },
  {
    id: 'student_1791585084637',
    name: 'Xiomara',
    lastName: 'Muñoz',
    username: 'xiomaramunoz',
    password: 'password123',
    email: 'autoxmartmentor@gmail.com',
    phone: '+58 414 1234567',
    age: 34,
    isKid: false,
    schoolOrProfession: 'Auto Xmar Mentor / Profesional',
    learningGoal: 'Fluidez comunicativa bilingüe en inglés y presentaciones profesionales.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    plan: 'basic',
    modality: 'online',
    groupSize: 'individual',
    preferredTimeSlot: 'Martes y Jueves 4:00 pm - 5:00 pm',
    levelId: 'level_1',
    status: 'enrolled',
    teacherId: 'teacher_cokito',
    teacherName: 'Teacher Cokitö / Head Teacher',
    placementTestScore: 22,
    placementTestDiagnosis: 'Nivel Principiante / Intermedio Temprano (Super Goal 1). Práctica de estructuras básicas y fluidez.',
    registeredAt: '2026-10-12',
    currentUnit: 1,
    completedHours: 2,
    xp: 450,
    streak: 2,
    league: 'Plata',
    rating: { fluency: 3, grammar: 3, vocabulary: 3, pronunciation: 3 },
    notes: 'Horario oficial confirmado: Martes y Jueves de 4:00 a 5:00 pm con Teacher Cokitö. Petición adicional: 10:00 am a 11:00 am.',
    assignedSlots: ['mar_16', 'jue_16'],
    coupons: ['TESTER-2H'],
    couponCodeAssigned: 'TESTER-2H',
    paymentStatus: 'scholarship'
  },
  {
    id: 'student_xiomara',
    name: 'Xiomara',
    lastName: 'Muñoz',
    username: 'xiomara',
    password: 'password123',
    email: 'xiomara.munoz@gmail.com',
    phone: '+58 414 9876543',
    age: 34,
    isKid: false,
    schoolOrProfession: 'Profesional',
    learningGoal: 'Desarrollar fluidez comunicativa en inglés.',
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=XiomaraMunoz2',
    plan: 'basic',
    modality: 'online',
    groupSize: 'individual',
    preferredTimeSlot: 'Martes y Jueves 4:00 pm - 5:00 pm',
    levelId: 'level_1',
    status: 'enrolled',
    teacherId: 'teacher_cokito',
    teacherName: 'Teacher Cokitö / Head Teacher',
    placementTestScore: 20,
    placementTestDiagnosis: 'Principiante (Super Goal 1).',
    registeredAt: '2026-10-12',
    currentUnit: 1,
    completedHours: 0,
    xp: 200,
    streak: 1,
    league: 'Bronce',
    rating: { fluency: 3, grammar: 3, vocabulary: 3, pronunciation: 3 },
    notes: 'Perfil de Xiomara Muñoz (xiomara.munoz@gmail.com).',
    assignedSlots: ['mar_16', 'jue_16'],
    coupons: ['TESTER-2H'],
    couponCodeAssigned: 'TESTER-2H',
    paymentStatus: 'scholarship'
  }
];

const WEEKDAYS: ('Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes')[] = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'
];

const DAILY_HOURS = [
  { start: '06:00', end: '07:00' },
  { start: '07:00', end: '08:00' },
  { start: '08:00', end: '09:00' },
  { start: '09:00', end: '10:00' },
  { start: '10:00', end: '11:00' },
  { start: '11:00', end: '12:00' },
  // 12:00 - 13:00 Receso / Almuerzo
  { start: '13:00', end: '14:00' },
  { start: '14:00', end: '15:00' },
  { start: '15:00', end: '16:00' }, // Prioridad Alumnos CSB
  { start: '16:00', end: '17:00' }, // Prioridad Alumnos CSB
  { start: '17:00', end: '18:00' }, // Prioridad Teachers CSB
  { start: '18:00', end: '19:00' }, // Prioridad Teachers CSB
  { start: '19:00', end: '20:00' },
  { start: '20:00', end: '21:00' }, // Grupal Nocturno
  { start: '21:00', end: '22:00' }  // Grupal Nocturno
];

export const INITIAL_SCHEDULE_SLOTS: ScheduleSlot[] = [
  ...WEEKDAYS.flatMap(day => {
    const prefix = day === 'Lunes' ? 'lun' : day === 'Martes' ? 'mar' : day === 'Miércoles' ? 'mie' : day === 'Jueves' ? 'jue' : 'vie';
    return DAILY_HOURS.map(({ start, end }) => {
      const hourNum = start.split(':')[0];
      const slotId = `${prefix}_${hourNum}`;

      const isGroup = hourNum === '06' || hourNum === '07' || hourNum === '20' || hourNum === '21';
      const isCSB = hourNum === '15' || hourNum === '16' || hourNum === '17' || hourNum === '18';
      const slotType: 'individual' | 'group' | 'institutional_csb' = isGroup ? 'group' : isCSB ? 'institutional_csb' : 'individual';
      const maxCapacity = isGroup ? 4 : isCSB ? 4 : 1;

      const classroomTitle = 
        hourNum === '06' ? 'Grupo Madrugador 1 (6:00 am)' :
        hourNum === '07' ? 'Grupo Madrugador 2 (7:00 am)' :
        hourNum === '15' ? 'Aula Prioridad Alumnos CSB (3:00 pm)' :
        hourNum === '16' ? 'Aula Prioridad Alumnos CSB (4:00 pm)' :
        hourNum === '17' ? 'Aula Prioridad Teachers CSB (5:00 pm)' :
        hourNum === '18' ? 'Aula Prioridad Teachers CSB (6:00 pm)' :
        hourNum === '20' ? 'Grupo Nocturno 1 (8:00 pm)' :
        hourNum === '21' ? 'Grupo Nocturno 2 (9:00 pm)' :
        `Aula Individual (${start} - ${end})`;

      // 1. Ian Gabriel: Lunes y Miércoles de 10:00 a 12:00 m (Bloque 2 Horas: 10-11 y 11-12)
      if (slotId === 'lun_10' || slotId === 'lun_11' || slotId === 'mie_10' || slotId === 'mie_11') {
        return {
          id: slotId,
          day,
          startTime: start,
          endTime: end,
          slotType: 'individual' as const,
          maxCapacity: 1,
          classroomTitle: 'Aula Matutina (Ian Gabriel Mendoza • 2 Horas)',
          enrolledStudents: [{
            studentId: 'student_ian_gabriel',
            studentName: 'Ian Gabriel Mendoza',
            levelId: 'level_1'
          }],
          teacherName: 'Teacher Cokitö / Head Teacher',
          studentId: 'student_ian_gabriel',
          studentName: 'Ian Gabriel Mendoza',
          levelId: 'level_1',
          status: 'booked' as const,
          meetLink: 'https://meet.google.com/eng-ian-waky'
        };
      }

      // 2. Carla Andreina Lira: Lunes y Miércoles de 5:00 a 6:00 pm (17:00 - 18:00)
      if (slotId === 'lun_17' || slotId === 'mie_17') {
        return {
          id: slotId,
          day,
          startTime: start,
          endTime: end,
          slotType: 'individual' as const,
          maxCapacity: 1,
          classroomTitle: 'Aula Individual (Carla Andreina Lira)',
          enrolledStudents: [{
            studentId: 'student_1791825726430',
            studentName: 'Carla Andreina Lira',
            levelId: 'level_1'
          }],
          teacherName: 'Teacher Cokitö / Head Teacher',
          studentId: 'student_1791825726430',
          studentName: 'Carla Andreina Lira',
          levelId: 'level_1',
          status: 'booked' as const,
          meetLink: 'https://meet.google.com/eng-carla-waky'
        };
      }

      // 3. Génesis Puello: Lunes y Miércoles de 8:00 a 9:00 pm (20:00 - 21:00)
      if (slotId === 'lun_20' || slotId === 'mie_20') {
        return {
          id: slotId,
          day,
          startTime: start,
          endTime: end,
          slotType: 'individual' as const,
          maxCapacity: 1,
          classroomTitle: 'Aula Nocturna (Génesis Puello)',
          enrolledStudents: [{
            studentId: 'student_genesis_puello_new',
            studentName: 'Génesis Puello',
            levelId: 'level_1'
          }],
          teacherName: 'Teacher Cokitö / Head Teacher',
          studentId: 'student_genesis_puello_new',
          studentName: 'Génesis Puello',
          levelId: 'level_1',
          status: 'booked' as const,
          meetLink: 'https://meet.google.com/eng-genesis-waky'
        };
      }

      // 4. Vaneska Lopez: Lunes y Miércoles de 9:00 a 10:00 pm (21:00 - 22:00)
      if (slotId === 'lun_21' || slotId === 'mie_21') {
        return {
          id: slotId,
          day,
          startTime: start,
          endTime: end,
          slotType: 'individual' as const,
          maxCapacity: 1,
          classroomTitle: 'Aula Nocturna (Vaneska Lopez)',
          enrolledStudents: [{
            studentId: 'student_vaneska',
            studentName: 'Vaneska Lopez',
            levelId: 'level_1'
          }],
          teacherName: 'Teacher Cokitö / Head Teacher',
          studentId: 'student_vaneska',
          studentName: 'Vaneska Lopez',
          levelId: 'level_1',
          status: 'booked' as const,
          meetLink: 'https://meet.google.com/eng-vaneska-waky'
        };
      }

      // 5. Xiomara Muñoz: Martes y Jueves de 4:00 a 5:00 pm (16:00 - 17:00)
      if (slotId === 'mar_16' || slotId === 'jue_16') {
        return {
          id: slotId,
          day,
          startTime: start,
          endTime: end,
          slotType: 'individual' as const,
          maxCapacity: 1,
          classroomTitle: 'Aula Individual (Xiomara Muñoz)',
          enrolledStudents: [{
            studentId: 'student_1791585084637',
            studentName: 'Xiomara Muñoz',
            levelId: 'level_1'
          }],
          teacherName: 'Teacher Cokitö / Head Teacher',
          studentId: 'student_1791585084637',
          studentName: 'Xiomara Muñoz',
          levelId: 'level_1',
          status: 'booked' as const,
          meetLink: 'https://meet.google.com/eng-xiomara-cokito'
        };
      }

      // 6. María Guadalupe: Martes y Jueves de 6:00 a 7:00 pm (18:00 - 19:00)
      if (slotId === 'mar_18' || slotId === 'jue_18') {
        return {
          id: slotId,
          day,
          startTime: start,
          endTime: end,
          slotType: 'individual' as const,
          maxCapacity: 1,
          classroomTitle: 'Aula Teachers CSB (María Guadalupe)',
          enrolledStudents: [{
            studentId: 'student_maria_guadalupe',
            studentName: 'María Guadalupe Peña Montilla',
            levelId: 'level_1'
          }],
          teacherName: 'Teacher Cokitö / Head Teacher',
          studentId: 'student_maria_guadalupe',
          studentName: 'María Guadalupe Peña Montilla',
          levelId: 'level_1',
          status: 'booked' as const,
          meetLink: 'https://meet.google.com/eng-malu-waky'
        };
      }

      return {
        id: slotId,
        day,
        startTime: start,
        endTime: end,
        slotType,
        maxCapacity,
        classroomTitle,
        enrolledStudents: [],
        teacherName: 'Teacher Cokitö / Head Teacher',
        status: 'available' as const
      };
    });
  }),

  // Sábado (Exclusivo Sabatinos: Bloques de 2 horas o 4 horas)
  { id: 'sab_08_10', day: 'Sábado', startTime: '08:00', endTime: '10:00', slotType: 'group', maxCapacity: 6, classroomTitle: 'Sabatino Bloque 1 (2 Horas: 8:00 - 10:00 am)', enrolledStudents: [], teacherName: 'Teacher Cokitö / Head Teacher', status: 'available' },
  { id: 'sab_10_12', day: 'Sábado', startTime: '10:00', endTime: '12:00', slotType: 'group', maxCapacity: 6, classroomTitle: 'Sabatino Bloque 2 (2 Horas: 10:00 - 12:00 m)', enrolledStudents: [], teacherName: 'Teacher Cokitö / Head Teacher', status: 'available' },
  { id: 'sab_08_12', day: 'Sábado', startTime: '08:00', endTime: '12:00', slotType: 'group', maxCapacity: 6, classroomTitle: 'Sabatino Intensivo (4 Horas: 8:00 am - 12:00 m)', enrolledStudents: [], teacherName: 'Teacher Cokitö / Head Teacher', status: 'available' }
];

export const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 'ch_1',
    title: 'Word Choice & Collocations',
    category: 'Vocabulary',
    audience: 'all',
    xpReward: 25,
    prompt: 'Completa la frase con la opción que mejor exprese una decisión espontánea:',
    question: '“I feel exhausted after working all day. I think I _____ go to bed early tonight.”',
    options: ['will', 'am going to', 'shall have', 'went'],
    correctIndex: 0,
    explanation: 'En inglés, usamos "will" para decisiones tomadas en el momento espontáneo del habla ("I think I will..."). "Going to" se reserva para planes meditados previamente.'
  },
  {
    id: 'ch_2',
    title: 'Prepositions of Time & Place',
    category: 'Grammar',
    audience: 'all',
    xpReward: 20,
    prompt: 'Elige la preposición correcta para días de la semana y momentos puntuales:',
    question: '“Our next English class with Teacher Cokito is _____ Thursday _____ 4:00 PM.”',
    options: ['in / at', 'on / at', 'at / in', 'on / on'],
    correctIndex: 1,
    explanation: 'Se usa "on" para días específicos (on Thursday, on my birthday) y "at" para horas exactas (at 4:00 PM).'
  },
  {
    id: 'ch_3',
    title: 'Spelling Bee Challenge: Suffixes',
    category: 'Vocabulary',
    audience: 'kids',
    xpReward: 30,
    prompt: 'Para nuestra campeona de Spelling Bee: ¿Cuál es la forma correcta con el sufijo -ness?',
    question: 'Si a la palabra "happy" le agregamos el sufijo "-ness", ¿cómo se escribe correctamente?',
    options: ['happyness', 'happiness', 'happines', 'happy-ness'],
    correctIndex: 1,
    explanation: 'Regla ortográfica de oro: cuando una palabra termina en consonante + "y", cambiamos la "y" por "i" antes de agregar "-ness" -> "happiness".'
  },
  {
    id: 'ch_4',
    title: 'Business Idioms & False Friends',
    category: 'Vocabulary',
    audience: 'adults',
    xpReward: 35,
    prompt: 'Identifica el significado real en contexto profesional:',
    question: '¿Qué significa la palabra "actually" en la frase: "Actually, she didn\'t attend the meeting"?',
    options: ['Actualmente / En estos momentos', 'De hecho / En realidad', 'Actualmente programado', 'Con rapidez'],
    correctIndex: 1,
    explanation: '"Actually" es un clásico falso amigo. Significa "en realidad" o "de hecho". Para decir "actualmente", usamos "currently".'
  },
  {
    id: 'ch_5',
    title: 'Conditionals in Action',
    category: 'Grammar',
    audience: 'adults',
    xpReward: 40,
    prompt: 'Selecciona la estructura adecuada para una situación hipotética o irreal en el presente:',
    question: '“If I _____ more free time during the week, I _____ join the Super Intensive course.”',
    options: ['have / will', 'had / would', 'would have / had', 'had / will'],
    correctIndex: 1,
    explanation: 'El Segundo Condicional se formula con "If + Past Simple, would + base verb". Se utiliza para situaciones hipotéticas en el presente.'
  }
];

export const INITIAL_MATERIALS: ClassroomMaterial[] = [
  {
    id: 'mat_1',
    levelId: 'level_1',
    levelTitle: 'Módulo 1: Super Goal 1',
    unit: 1,
    title: 'Unit 1: What\'s Your Name? - Student Guide & Audio',
    description: 'Guía oficial de vocabulario básico: saludos, el alfabeto fonético en inglés y el verbo To Be.',
    type: 'pdf',
    url: 'https://classroom.google.com/',
    classroomCourseId: 'course_sg1',
    updatedAt: '2026-09-15'
  },
  {
    id: 'mat_2',
    levelId: 'level_3',
    levelTitle: 'Módulo 1: Super Goal 3',
    unit: 4,
    title: 'Unit 4: Since & For with Present Perfect',
    description: 'Esquema visual y 15 ejercicios interactivos para dominar la diferencia entre "Since" y "For".',
    type: 'slides',
    url: 'https://classroom.google.com/',
    classroomCourseId: 'course_sg3',
    updatedAt: '2026-09-25'
  },
  {
    id: 'mat_3',
    levelId: 'level_4',
    levelTitle: 'Módulo 2: Super Goal 4',
    unit: 2,
    title: 'Spelling Bee & Vocabulary Booster #20-21',
    description: 'Listas oficiales de palabras con reglas de prefijos, sufijos y ejercicios para 7mo grado.',
    type: 'pdf',
    url: 'https://classroom.google.com/',
    classroomCourseId: 'course_sg4',
    updatedAt: '2026-09-28'
  },
  {
    id: 'mat_4',
    levelId: 'level_7',
    levelTitle: 'Módulo 3: Mega Goal 1',
    unit: 1,
    title: 'Unit 1: Big Ideas & Innovation - Audio Interviews',
    description: 'Pistas de audio en velocidad nativa con transcripción para práctica de listening y debate conversacional.',
    type: 'audio',
    url: 'https://classroom.google.com/',
    classroomCourseId: 'course_mg1',
    updatedAt: '2026-09-28'
  },
  {
    id: 'mat_5',
    levelId: 'level_10',
    levelTitle: 'Módulo 4: Mega Goal 4',
    unit: 2,
    title: 'Unit 2: Advanced Inversion & Emphasis for Writing',
    description: 'Material avanzado de estructuras de inversión (Not only... but also, Seldom, Rarely) para redacción de ensayos.',
    type: 'slides',
    url: 'https://classroom.google.com/',
    classroomCourseId: 'course_mg4',
    updatedAt: '2026-09-29'
  }
];
