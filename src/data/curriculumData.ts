import { EnglishLevel, PlanConfig, PlanIntensity, Student, ScheduleSlot, DailyChallenge, ClassroomMaterial } from '../types';

export const INTENSITY_PLANS: Record<PlanIntensity, PlanConfig> = {
  basic: {
    id: 'basic',
    name: 'Súper Básico (2 h/semana)',
    hoursPerWeek: 2,
    badge: 'Constante y Relajado',
    description: 'Un avance constante y relajado sin sobrecarga. Terminas cada nivel en 24 semanas (6 meses).',
    recommendedFor: 'Profesionales, estudiantes o personas con agenda apretada.',
    recommendedFormat: '2 sesiones de 60 minutos (ej. Martes y Jueves).',
    prices: {
      individual: 50,
      duo: 90,
      squad3: 120,
      crew4: 140
    }
  },
  regular: {
    id: 'regular',
    name: 'Regular (3 h/semana)',
    hoursPerWeek: 3,
    badge: 'Equilibrio Perfecto',
    description: 'El equilibrio óptimo entre velocidad y asimilación. Terminas cada nivel en 16 semanas (4 meses).',
    recommendedFor: 'Metas a mediano plazo y preparación de certificaciones intermedias.',
    recommendedFormat: '2 sesiones de 90 min (ej. Lun/Mié) o 3 sesiones de 60 min (Lun/Mié/Vie).',
    prices: {
      individual: 67.5,
      duo: 120,
      squad3: 157.5,
      crew4: 180
    }
  },
  intensive: {
    id: 'intensive',
    name: 'Intensivo (4 h/semana)',
    hoursPerWeek: 4,
    badge: 'Para los que llevan prisa',
    description: 'Progreso acelerado con práctica conversacional inmersiva. Terminas cada nivel en 12 semanas (3 meses).',
    recommendedFor: 'Viajes próximos, entrevistas laborales en inglés o exámenes.',
    recommendedFormat: '2 sesiones de 120 min (con receso de 5 min) o 4 sesiones de 60 min.',
    prices: {
      individual: 80,
      duo: 140,
      squad3: 180,
      crew4: 200
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
    prices: {
      individual: 105,
      duo: 180,
      squad3: 225,
      crew4: 240
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
    id: 'student_genesis',
    name: 'Génesis',
    lastName: 'Rondón',
    username: 'genesis',
    password: 'password123',
    cedula: 'V-25.998.112',
    email: 'genesis.rondon@gmail.com',
    phone: '+58 414 7891234',
    age: 26,
    isKid: false,
    schoolOrProfession: 'Ingeniera & Emprendedora Digital',
    learningGoal: 'Fluidez conversacional en inglés para reuniones de negocios y proyectos internacionales.',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    plan: 'regular',
    modality: 'online',
    groupSize: 'individual',
    preferredTimeSlot: 'Tardes (5:00 pm - 7:00 pm)',
    levelId: 'level_1',
    status: 'enrolled',
    placementTestScore: 19,
    placementTestDiagnosis: '🟢 Nivel A1 Sólido (Super Goal 1). Lista para iniciar clases presenciales u online una vez que Rectoría asigne su horario y profesor.',
    placementTestDate: '2026-10-06',
    registeredAt: '2026-10-06',
    currentUnit: 1,
    completedHours: 0,
    xp: 320,
    streak: 2,
    league: 'Bronce',
    rating: { fluency: 3, grammar: 3, vocabulary: 3, pronunciation: 3 },
    notes: 'Amiga de la casa ya inscrita formalmente. Pendiente de agendar clases y horarios con Directora Waky.',
    assignedSlots: []
  },
  {
    id: 'student_ana_sandoval',
    name: 'Ana',
    lastName: 'Sandoval',
    username: 'anasandoval',
    cedula: 'V-20.123.456',
    email: 'anateresa.csb@gmail.com',
    phone: '04141234567',
    age: 28,
    isKid: false,
    schoolOrProfession: 'Estudiante Digital Cokitö',
    learningGoal: 'Aprender inglés sin miedo, a mi propio ritmo con Super Goal 1.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    plan: 'basic',
    modality: 'online',
    groupSize: 'individual',
    preferredTimeSlot: 'Autónomo Asincrónico',
    levelId: 'level_1',
    status: 'enrolled',
    placementTestScore: 25,
    placementTestDiagnosis: '🟢 Principiante Activo (Super Goal 1 - Unit 1). Acceso completo al Aula Virtual y Laboratorio de 100 ejercicios.',
    placementTestDate: '2026-10-04',
    registeredAt: '2026-10-04',
    currentUnit: 1,
    completedHours: 2.0,
    xp: 500,
    streak: 3,
    league: 'Bronce',
    rating: { fluency: 3, grammar: 3, vocabulary: 4, pronunciation: 3 },
    notes: 'Alumna oficial registrada en Super Goal 1 con pase digital activo.',
    assignedSlots: []
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
    preferredTimeSlot: 'LUN-MIER 6:00 pm - 7:00 pm',
    levelId: 'level_1',
    status: 'enrolled',
    placementTestScore: 9,
    placementTestDiagnosis: '🟢 Principiante (Super Goal 1). Auxiliar CSB Preschool. Iniciando fundamentos pedagógicos, estructuras básicas y vocabulario.',
    placementTestDate: '2026-10-02',
    registeredAt: '2026-10-02',
    currentUnit: 1,
    completedHours: 4.0,
    xp: 650,
    streak: 4,
    league: 'Bronce',
    rating: { fluency: 2, grammar: 2, vocabulary: 3, pronunciation: 3 },
    notes: 'Alumna confirmada en Super Goal 1 (Principiante). Horario: Lunes y Miércoles de 6:00 pm a 7:00 pm. Institución: PRE CSB (Auxiliar). Correos: malupena26.mo@gmail.com / malupena.26mo@gmail.com. Tel: 04241830082.',
    assignedSlots: ['lun_18', 'mie_18']
  },
  {
    id: 'student_mariana',
    name: 'Mariana',
    lastName: 'Márquez',
    cedula: 'V-32.456.789',
    email: 'mariana.marquez@example.com',
    phone: '+58 412 1234567',
    age: 13,
    isKid: true,
    schoolOrProfession: 'U.E.P. Colegio Simón Bolívar II (7th Grade A)',
    learningGoal: 'Exámenes escolares, Spelling Bee y preparación para pádel internacional.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    plan: 'regular',
    modality: 'presencial',
    groupSize: 'individual',
    preferredTimeSlot: 'Tardes (4:00 - 6:00 pm)',
    levelId: 'level_4',
    status: 'enrolled',
    placementTestScore: 21,
    placementTestDiagnosis: 'Excelente fluidez en vocabulario escolar y preposiciones. Práctica activa para Spelling Bee.',
    placementTestDate: '2026-09-02',
    registeredAt: '2026-09-01',
    currentUnit: 3,
    completedHours: 12.0,
    xp: 1980,
    streak: 15,
    league: 'Diamante',
    rating: { fluency: 4, grammar: 4, vocabulary: 5, pronunciation: 4 },
    notes: 'Jugadora de Pádel. Estudiando listas de ortografía para el Spelling Bee. Muy receptiva a métodos visuales.',
    assignedSlots: ['Martes-16:00', 'Jueves-16:00']
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
    id: 'student_aspirante',
    name: 'Andrés',
    lastName: 'Guzmán',
    cedula: 'V-24.112.334',
    email: 'andres.guzman@example.com',
    phone: '+58 424 5551234',
    age: 26,
    isKid: false,
    schoolOrProfession: 'Licenciado en Mercadeo y Ventas',
    learningGoal: 'Oportunidades laborales y viajes a Canadá.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    plan: 'intensive',
    modality: 'online',
    groupSize: 'duo',
    preferredTimeSlot: 'Tardes (5:00 - 7:00 pm)',
    status: 'pending_evaluation',
    placementTestScore: 19,
    placementTestDiagnosis: 'Respondió 19 de 25 preguntas correctamente. Nivel sugerido: Level VI o VII (Transición a Mega Goal). Pendiente de asignación formal por Teacher Cokito.',
    placementTestDate: '2026-10-01',
    registeredAt: '2026-10-01',
    currentUnit: 1,
    completedHours: 0,
    xp: 250,
    streak: 1,
    league: 'Bronce',
    rating: { fluency: 3, grammar: 4, vocabulary: 4, pronunciation: 3 },
    notes: 'Nuevo aspirante registrado hoy. Requiere asignación de nivel y horario en el panel de Teachers.',
    assignedSlots: []
  },
  {
    id: 'student_ragni_ali_new',
    name: 'Ragni',
    lastName: 'Ali',
    email: '',
    age: 0,
    isKid: false,
    schoolOrProfession: 'Por completar',
    learningGoal: 'Desarrollar habilidades de comunicación en inglés.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    plan: 'basic',
    modality: 'online',
    groupSize: 'individual',
    preferredTimeSlot: 'Por definir',
    levelId: 'level_1',
    status: 'enrolled',
    registeredAt: '2026-10-08',
    currentUnit: 1,
    completedHours: 0,
    xp: 0,
    streak: 0,
    league: 'Bronce',
    rating: { fluency: 1, grammar: 1, vocabulary: 1, pronunciation: 1 },
    notes: 'Perfil nuevo de desarrollo. Correo y datos personales pendientes de vinculación privada; no importar progreso previo.',
    assignedSlots: []
  },
  {
    id: 'student_genesis_puello_new',
    name: 'Génesis',
    lastName: 'Puello',
    email: '',
    age: 0,
    isKid: false,
    schoolOrProfession: 'Por completar',
    learningGoal: 'Desarrollar habilidades de comunicación en inglés.',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    plan: 'basic',
    modality: 'online',
    groupSize: 'individual',
    preferredTimeSlot: 'Por definir',
    levelId: 'level_1',
    status: 'enrolled',
    registeredAt: '2026-10-08',
    currentUnit: 1,
    completedHours: 0,
    xp: 0,
    streak: 0,
    league: 'Bronce',
    rating: { fluency: 1, grammar: 1, vocabulary: 1, pronunciation: 1 },
    notes: 'Perfil nuevo de desarrollo. Correo y datos personales pendientes de vinculación privada; no importar progreso previo.',
    assignedSlots: []
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

      // Check booked students
      if (slotId === 'lun_18' || slotId === 'mie_18') {
        return {
          id: slotId,
          day,
          startTime: start,
          endTime: end,
          slotType,
          maxCapacity,
          classroomTitle: 'Aula Teachers CSB (Preescolar & Primaria)',
          enrolledStudents: [{
            studentId: 'student_maria_guadalupe',
            studentName: 'Maria Guadalupe Peña Montilla',
            levelId: 'level_1'
          }],
          teacherName: 'Teacher Cokitö',
          studentId: 'student_maria_guadalupe',
          studentName: 'Maria Guadalupe Peña Montilla',
          levelId: 'level_1',
          status: 'booked' as const,
          meetLink: 'https://meet.google.com/eng-malu-cokito'
        };
      }

      if (slotId === 'mar_16' || slotId === 'jue_16') {
        return {
          id: slotId,
          day,
          startTime: start,
          endTime: end,
          slotType,
          maxCapacity,
          classroomTitle: 'Aula Alumnos CSB (7mo Grado)',
          enrolledStudents: [{
            studentId: 'student_mariana',
            studentName: 'Mariana Márquez',
            levelId: 'level_4'
          }],
          teacherName: 'Teacher Cokitö',
          studentId: 'student_mariana',
          studentName: 'Mariana Márquez',
          levelId: 'level_4',
          status: 'booked' as const,
          meetLink: 'https://meet.google.com/eng-mariana-cokito'
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
        teacherName: 'Teacher Cokitö',
        status: 'available' as const
      };
    });
  }),

  // Sábado (Exclusivo Sabatinos: Bloques de 2 horas o 4 horas)
  { id: 'sab_08_10', day: 'Sábado', startTime: '08:00', endTime: '10:00', slotType: 'group', maxCapacity: 6, classroomTitle: 'Sabatino Bloque 1 (2 Horas: 8:00 - 10:00 am)', enrolledStudents: [], teacherName: 'Teacher Cokitö', status: 'available' },
  { id: 'sab_10_12', day: 'Sábado', startTime: '10:00', endTime: '12:00', slotType: 'group', maxCapacity: 6, classroomTitle: 'Sabatino Bloque 2 (2 Horas: 10:00 - 12:00 m)', enrolledStudents: [], teacherName: 'Teacher Cokitö', status: 'available' },
  { id: 'sab_08_12', day: 'Sábado', startTime: '08:00', endTime: '12:00', slotType: 'group', maxCapacity: 6, classroomTitle: 'Sabatino Intensivo (4 Horas: 8:00 am - 12:00 m)', enrolledStudents: [], teacherName: 'Teacher Cokitö', status: 'available' }
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
