export type PlanIntensity = 'basic' | 'regular' | 'intensive' | 'super_intensive';
export type AudienceTheme = 'adults' | 'kids';
export type ClassModality = 'online' | 'presencial';
export type GroupSize = 'individual' | 'duo' | 'squad3' | 'crew4';
export type BillingFrequency = 'weekly' | 'monthly';
export type BookedSessionPurpose = 'lesson' | 'review' | 'exam_prep' | 'conversation' | 'group_flock';

export interface BookedSession {
  id: string;
  date: string; // YYYY-MM-DD
  day: string;  // 'Lunes', 'Martes', etc.
  startTime: string; // "18:00"
  endTime: string;   // "19:00"
  hours: number;     // 1, 1.5, 2
  teacherName: string;
  teacherId?: string;
  title: string;
  purpose: BookedSessionPurpose;
  purposeLabel: string; // e.g. "🎯 Preparación de Examen", "🗣️ Conversación Fluida", "🔄 Repaso"
  isPrepaid: boolean;
  status: 'confirmed' | 'completed' | 'cancelled';
  meetLink?: string;
  notes?: string;
}

export interface PlanConfig {
  id: PlanIntensity;
  name: string;
  hoursPerWeek: number;
  description: string;
  badge: string;
  recommendedFor: string;
  recommendedFormat: string;
  // Hourly rates per person for this intensity
  hourlyRates?: {
    individual: number;
    duo: number;
    squad3: number;
    crew4: number;
  };
  // Weekly total prices
  prices: {
    individual: number; // 1 pax $/week
    duo: number;        // 2 pax total $/week
    squad3: number;     // 3 pax total $/week
    crew4: number;      // 4 pax total $/week
  };
  // Per pax weekly prices
  perPaxWeekly?: {
    individual: number;
    duo: number;
    squad3: number;
    crew4: number;
  };
  // Monthly package prices (discount applied, 30 days validity)
  monthlyPrices?: {
    individual: number; // monthly total (e.g. $110 for 8 hrs)
    duo: number;        // monthly total
    squad3: number;     // monthly total
    crew4: number;      // monthly total
  };
  // Per pax monthly prices
  perPaxMonthly?: {
    individual: number;
    duo: number;
    squad3: number;
    crew4: number;
  };
}

export interface EnglishLevel {
  id: string; // e.g. 'level_1'
  levelName: string; // 'Level I'
  cefrEquiv: string; // 'Begginer I (A1)'
  book: string; // 'Super Goal 1'
  category: 'Super Goal' | 'Mega Goal';
  module: 1 | 2 | 3 | 4;
  moduleName: string;
  units: number;
  sections: number;
  expositions: number;
  hoursPerUnit: number;
  totalHours: number;
  durations: Record<PlanIntensity, { weeks: number; months: number }>;
}

export interface Student {
  id: string;
  uid?: string;
  name: string;
  lastName?: string;
  cedula?: string;
  hasNoCedula?: boolean;
  email: string;
  phone?: string;
  parentEmail?: string;
  parentPhone?: string;
  familyAccountId?: string;
  username?: string;
  password?: string;
  age: number;
  isKid: boolean;
  schoolOrProfession: string; // school name if kid, job/profession if adult
  learningGoal: string; // work, travel, school, personal
  avatar: string;
  
  // Package & Registration
  plan: PlanIntensity;
  /** 'gamer' = Free arcade account to save game XP; 'student' = Enrolled student with campus access */
  accountType?: 'gamer' | 'student';
  /** True for the self-paced $5 Digital Pass; no live schedule is required. */
  isDigitalPass?: boolean;
  /** Coupon applied during registration, when known. */
  couponCodeUsed?: string;
  /** Coupon assigned later by the director. */
  couponCodeAssigned?: string;
  /** List of all coupons / scholarships associated with this student */
  coupons?: string[];
  modality: ClassModality;
  groupSize: GroupSize;
  preferredTimeSlot: string; // "Mañanas", "Tardes", "Noches", "Sábados"
  
  // Payment & Trial Status (Waky Review Workflow)
  paymentStatus?: 'pending_approval' | 'trial_24h' | 'deposit_5_paid' | 'fully_paid' | 'scholarship';
  trialExpiresAt?: number; // timestamp when 24h trial ends
  paymentMethod?: 'pagomovil' | 'paypal' | 'cash' | 'coupon' | 'trial_24h';
  pagoMovilRef?: string;
  pagoMovilBank?: string;
  pagoMovilAmountBs?: number;
  pagoMovilDate?: string;
  depositAmountUsd?: number; // e.g. 5 USD
  balanceDueUsd?: number;    // e.g. remaining balance for private classes or group
  preferredSlotId?: string;
  
  // Level Assignment & Flock Mentorship
  levelId?: string; // Assigned by Teacher Cokito or Principal Waky!
  teacherId?: string; // Assigned Teacher (if exclusive or primary)
  teacherName?: string;
  isExclusiveTeacher?: boolean; // If true: dedicated mentor only; If false: Rotational across Güakytopia's Flock
  status: 'pending_evaluation' | 'enrolled' | 'completed' | 'paused';
  placementTestScore?: number; // 0-50
  placementTestDiagnosis?: string;
  placementTestDate?: string;
  
  // Onboarding & Campus Access
  welcomeEmailSent?: boolean;
  welcomeEmailSentAt?: string;
  temporaryPassword?: string;
  
  registeredAt: string;
  currentUnit: number;
  completedHours: number;
  xp: number;
  streak: number;
  league: 'Bronce' | 'Plata' | 'Oro' | 'Diamante';
  rating: {
    fluency: number; // 1-5
    grammar: number;
    vocabulary: number;
    pronunciation: number;
  };
  notes: string;
  assignedSlots: string[]; // e.g. ['Lunes-16:00', 'Miercoles-16:00']
  /** Billing scheme: weekly or monthly upfront */
  paymentBillingCycle?: BillingFrequency;
  /** Bolsa de Horas Prepagadas (Exclusivo Individual One-to-One) */
  prepaidHoursBalance?: number; // Hours remaining to schedule
  prepaidHoursTotal?: number;   // Total hours acquired in current cycle (e.g. 8, 12, 16, 24)
  prepaidHoursExpiresAt?: string; // 30 calendar days validity
  isPrepaidActive?: boolean;
  /** My Own Flock (Grupos privados formados por el alumno) */
  myOwnFlockName?: string;
  myOwnFlockRole?: 'creator' | 'member';
  myOwnFlockMembersCount?: number;
  /** Lista de clases agendadas y prepagadas del alumno */
  bookedSessions?: BookedSession[];
  /** Pilot Telemetry and Real Interaction Tracking */
  telemetry?: StudentTelemetry;
  /** Granular item-by-item completion tracking within units (e.g. ['u1_1', 'u1_2', 'u1_3']) */
  completedUnitItems?: string[];
  /** Items marked by the student during class or self-study, awaiting Teacher confirmation */
  pendingUnitItems?: string[];
  /** Teacher-assigned custom password */
  customPassword?: string;
  /** Teacher Handover & Progress Marker for teacher continuity across classes */
  unitHandover?: {
    lastCompletedUnit: number;
    lastCompletedItemNumber: number;
    lastCompletedItemTitle: string;
    nextItemNumber: number;
    nextItemTitle: string;
    teacherNote: string;
    teacherName: string;
    updatedAt: string;
  };
}

export interface StudentActivityEvent {
  id: string;
  section: 'hub' | 'classroom' | 'library' | 'lab' | 'calendar';
  action: string;
  detail?: string;
  timestamp: string;
}

export interface StudentTelemetry {
  hubVisits: number;
  lastHubVisit?: string;
  classroomVisits: number;
  lastClassroomVisit?: string;
  libraryVisits: number;
  lastLibraryVisit?: string;
  labVisits: number;
  lastLabVisit?: string;
  calendarVisits: number;
  lastCalendarVisit?: string;
  totalInteractions: number;
  lastActiveAt?: string;
  recentActivity: StudentActivityEvent[];
}

export interface TeacherAnnouncement {
  id: string;
  title: string;
  content: string;
  authorName: string; // e.g. "Directora Waky"
  authorRole: 'principal' | 'head_teacher';
  priority: 'urgent' | 'important' | 'info';
  createdAt: string;
  targetAudience?: 'all' | 'teachers';
}

export interface LoungeMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: 'principal' | 'teacher';
  avatar: string;
  text: string;
  timestamp: string;
  reactions?: Record<string, number>; // e.g. { '☕': 4, '👏': 3 }
}

export interface TeacherAttendanceLog {
  id: string;
  slotId: string;
  teacherId: string;
  teacherName: string;
  date: string;
  unitCovered: number;
  summaryNotes: string;
  attendedStudentIds: string[];
}

export type SlotType = 'individual' | 'group' | 'institutional_csb';

export interface EnrolledStudentInSlot {
  studentId: string;
  studentName: string;
  levelId: string;
  avatar?: string;
  email?: string;
}

export interface ScheduleSlot {
  id: string;
  day: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado';
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:00"
  slotType?: SlotType; // 'individual' | 'group' | 'institutional_csb'
  maxCapacity?: number; // 1 for individual, 3-4 for group
  enrolledStudents?: EnrolledStudentInSlot[]; // Students inside this classroom
  classroomTitle?: string; // e.g. "Aula CSB Teachers - Super Goal 3"
  teacherId?: string; // ID linking to Güakytopia's Flock Mentor
  teacherName?: string; // e.g. "Teacher Cokitö"
  allowedLevels?: string[]; // Curricular levels this slot supports (e.g. ['level_1', 'level_2'])
  academicMinutes?: number; // 45 min
  bufferMinutes?: number; // 15 min (10 min break + 5 min gracia)
  studentId?: string;
  studentName?: string;
  levelId?: string;
  meetLink?: string;
  status: 'available' | 'booked' | 'break' | 'blocked';
}

export interface DailyChallenge {
  id: string;
  title: string;
  category: 'Grammar' | 'Vocabulary' | 'Pronunciation' | 'Listening';
  audience: 'all' | 'kids' | 'adults';
  xpReward: number;
  prompt: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ClassroomMaterial {
  id: string;
  levelId: string;
  levelTitle: string;
  unit: number;
  title: string;
  description: string;
  type: 'pdf' | 'audio' | 'video' | 'quiz' | 'slides';
  url: string;
  classroomCourseId?: string;
  updatedAt: string;
}

export interface PlacementQuestion {
  id: number;
  part: number;
  partTitle: string;
  category: 'grammar' | 'reading' | 'vocabulary' | 'fill_in';
  question: string;
  contextText?: string;
  options?: string[];
  correctAnswer: string; // option letter like "a" or exact word like "bring"
  explanation: string;
}

export type StaffRole = 'principal' | 'teacher';

export interface Teacher {
  id: string;
  name: string;
  lastName?: string;
  email: string;
  phone?: string;
  avatar: string;
  specialty: string;
  levelsAssigned: string[];
  assignedDays: ('Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado')[];
  workingHours: string;
  status: 'active' | 'leave' | 'inactive';
  hourlyRate?: number;
  bio?: string;
  
  // Flock Credentials & Onboarding
  flockRole?: string; // e.g. "Flock Mentor", "Head Teacher"
  password?: string;
  temporaryPassword?: string;
  welcomeEmailSent?: boolean;
  welcomeEmailSentAt?: string;
}

