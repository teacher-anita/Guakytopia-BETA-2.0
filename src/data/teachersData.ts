import { Teacher } from '../types';

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'teacher_cokito',
    name: 'Waky',
    lastName: 'Sandoval (Teacher Waky / Head Teacher)',
    email: 'anateresa.csb@gmail.com',
    phone: '+58 414 1234567',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    specialty: 'Pedagogical Foundations, Super Goal 1–3 and Speaking Immersion',
    levelsAssigned: ['level_1', 'level_2', 'level_3', 'level_4'],
    assignedDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
    workingHours: '06:00 - 12:00 / 15:00 - 19:00',
    status: 'active',
    hourlyRate: 15,
    bio: 'Founder & Head Teacher at Güakytopia. Specialist in communicative confidence, phonetic agility, and immersive speaking practice.'
  },
  {
    id: 'teacher_marcos',
    name: 'Marcos',
    lastName: 'Villalobos',
    email: 'marcos.villalobos@guakytopia.com',
    phone: '+58 424 9876543',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    specialty: 'Intermediate Conversation, Super Goal 4–6 and Teens',
    levelsAssigned: ['level_4', 'level_5', 'level_6'],
    assignedDays: ['Lunes', 'Miércoles', 'Viernes'],
    workingHours: '14:00 - 20:00 (Afternoons & Evenings)',
    status: 'active',
    hourlyRate: 12,
    bio: 'Youth debate coach and real-time fluency mentor. TEFL certified with group dynamic expertise.'
  },
  {
    id: 'teacher_elena',
    name: 'Elena',
    lastName: 'Rondón',
    email: 'elena.rondon@guakytopia.com',
    phone: '+58 412 5556789',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    specialty: 'Advanced English, Mega Goal 1–6 and TOEFL/IELTS Preparation',
    levelsAssigned: ['level_7', 'level_8', 'level_9', 'level_10', 'level_11', 'level_12'],
    assignedDays: ['Martes', 'Jueves', 'Sábado'],
    workingHours: '08:00 - 14:00 (Mornings)',
    status: 'active',
    hourlyRate: 18,
    bio: 'Certified instructor for international exams, business English, and academic university essay coaching.'
  },
  {
    id: 'teacher_david',
    name: 'David',
    lastName: 'Pérez',
    email: 'david.perez@guakytopia.com',
    phone: '+58 416 3334455',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    specialty: 'Kinder & Primary Phonetics, First Steps and CSB Bridge',
    levelsAssigned: ['level_1'],
    assignedDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
    workingHours: '15:00 - 18:00 (CSB Shift)',
    status: 'active',
    hourlyRate: 10,
    bio: 'Teaching assistant focused on kids phonetics and institutional academic bridge programs.'
  }
];
