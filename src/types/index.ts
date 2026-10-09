export type PlanIntensity = 'basic' | 'regular' | 'intensive' | 'super_intensive';
export type AudienceTheme = 'adults' | 'kids';
export type ClassModality = 'online' | 'presencial';
export type GroupSize = 'individual' | 'duo' | 'squad3' | 'crew4';

export interface PlanConfig {
  id: PlanIntensity;
  name: string;
  hoursPerWeek: number;
  description: string;
  badge: string;
  recommendedFor: string;
  recommendedFormat: string;
  prices: {
    individual: number; // 1 pax $/week
    duo: number;        // 2 pax total $/week
    squad3: number;     // 3 pax total $/week
    crew4: number;      // 4 pax total $/week
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
  name: string;
  lastName?: string;
  cedula?: string;
  email: string;
  phone?: string;
  username?: string;
  password?: string;
  age: number;
  isKid: boolean;
  schoolOrProfession: string; // school name if kid, job/profession if adult
  learningGoal: string; // work, travel, school, personal
  avatar: string;
  
  // Package & Registration
  plan: PlanIntensity;
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
  
  // Level Assignment
  levelId?: string; // Assigned by Teacher Cokito or Principal Waky!
  teacherId?: string; // Assigned Teacher
  teacherName?: string;
  status: 'pending_evaluation' | 'enrolled' | 'completed' | 'paused';
  placementTestScore?: number; // 0-25
  placementTestDiagnosis?: string;
  placementTestDate?: string;
  
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
  teacherName?: string; // e.g. "Teacher Cokitö"
  academicMinutes?: number; // 45 min
  bufferMinutes?: number; // 15 min (10 min break + 5 min gracia)
  studentId?: string;
  studentName?: string;
  levelId?: string;
  meetLink?: string;
  status: 'available' | 'booked' | 'break';
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
  part: 1 | 2;
  partTitle: string;
  category: 'grammar' | 'reading' | 'fill_in';
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
}

