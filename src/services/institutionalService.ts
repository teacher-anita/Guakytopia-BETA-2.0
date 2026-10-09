// Institutional Service: Campus Onboarding, Flock Credentials & Welcome Emails
// Güakytopia Campus • Open the World

import { Student, Teacher } from '../types';
import { sendGmailEmail } from './gmailNotifier';
import { ENGLISH_LEVELS } from '../data/curriculumData';

export interface DispatchEmailResult {
  success: boolean;
  recipient: string;
  subject: string;
  bodyText?: string;
  gmailWebUrl?: string;
  previewUrl?: string;
  temporaryPassword?: string;
  timestamp: string;
  mode: 'gmail_api' | 'campus_logged';
  error?: string;
}

export function generateTemporaryPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const prefix = 'FLOCK';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${rand}`;
}

export function buildTeacherWelcomeEmailContent(
  teacher: Teacher,
  temporaryPassword?: string
): { subject: string; bodyText: string; gmailWebUrl: string; tempPass: string } {
  const tempPass = temporaryPassword || teacher.temporaryPassword || generateTemporaryPassword();
  const campusUrl = typeof window !== 'undefined' ? window.location.origin : 'https://guakytopia.campus';

  const levelNames = (teacher.levelsAssigned || [])
    .map(lvlId => {
      const found = ENGLISH_LEVELS.find(l => l.id === lvlId);
      return found ? `${found.levelName} (${found.book})` : lvlId;
    })
    .join(', ');

  const subject = `🪶 Welcome to Güakytopia's Flock! • Tus Credenciales y Acceso al Campus Digital`;

  const bodyText = `¡Hola, Teacher ${teacher.name}! 🪶✨

Es un honor darte la más cálida bienvenida oficial a Güakytopia's Flock (The Flock • Equipo de Teachers). Desde hoy formas parte del equipo de mentores que transforma vidas a través del inglés con empatía, fluidez y rigor pedagógico.

🏛️ DETALLES DE TU ROL COMO TEACHER EN EL CAMPUS:
- Rol: ${teacher.flockRole || 'Flock Mentor (Teacher de Inglés)'}
- Especialidad: ${teacher.specialty}
- Niveles Certificados en Matriz: ${levelNames || 'Super Goal 1–3'}
- Días Asignados: ${(teacher.assignedDays || []).join(', ')}
- Franja de Trabajo: ${teacher.workingHours}

🔐 TUS CREDENCIALES DE ACCESO AL CAMPUS:
- Acceso para Teachers: ${campusUrl}
- Usuario institucional: ${teacher.email}
- Contraseña provisional: ${tempPass}
- Clave de Acceso Rápido al Portal: 3223

Al ingresar por primera vez, podrás actualizar tu contraseña personal en tu perfil, consultar tu agenda de alumnos y compartir novedades en el Teachers' Lounge (el espacio oficial de nuestros teachers).

"Start where you are. Keep going." ¡Bienvenido a la manada!

Con gran aprecio pedagógico,
Directora Waky (The Principal)
Rectoría General • Güakytopia Campus
contacto: anateresa.csb@gmail.com`;

  const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(teacher.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

  return { subject, bodyText, gmailWebUrl, tempPass };
}

/**
 * Sends or logs an official Welcome Email for a new Teacher entering Güakytopia's Flock.
 */
export async function sendTeacherFlockWelcomeEmail(
  teacher: Teacher,
  temporaryPassword?: string
): Promise<DispatchEmailResult> {
  const { subject, bodyText, gmailWebUrl, tempPass } = buildTeacherWelcomeEmailContent(teacher, temporaryPassword);
  const timestamp = new Date().toISOString();

  // Attempt real Gmail API dispatch if Directora has OAuth token
  const mailResult = await sendGmailEmail({
    to: teacher.email,
    subject,
    bodyText,
    studentName: teacher.name
  });

  if (mailResult.success) {
    return {
      success: true,
      recipient: teacher.email,
      subject,
      bodyText,
      gmailWebUrl,
      temporaryPassword: tempPass,
      timestamp,
      mode: 'gmail_api'
    };
  }

  // Graceful fallback to campus institutional log & ready dispatch link
  return {
    success: true,
    recipient: teacher.email,
    subject,
    bodyText,
    gmailWebUrl,
    temporaryPassword: tempPass,
    timestamp,
    mode: 'campus_logged',
    error: mailResult.error
  };
}

export function buildStudentWelcomeEmailContent(
  student: Student,
  options: {
    temporaryPassword?: string;
    mentorName?: string;
    flockMentorsSummary?: string;
    meetLink?: string;
  } = {}
): { subject: string; bodyText: string; gmailWebUrl: string; tempPass: string } {
  const tempPass = options.temporaryPassword || student.temporaryPassword || generateTemporaryPassword();
  const campusUrl = typeof window !== 'undefined' ? window.location.origin : 'https://guakytopia.campus';
  
  const levelObj = ENGLISH_LEVELS.find(l => l.id === student.levelId);
  const levelTitle = levelObj ? `${levelObj.levelName} • ${levelObj.book}` : (student.levelId || 'Level 1');

  const mentorshipDescription = student.isExclusiveTeacher && student.teacherName
    ? `Mentor Dedicado Exclusivo: ${student.teacherName} (Tus sesiones y seguimiento se coordinan directamente con tu teacher)`
    : `Acceso Rotativo a La Manada (Güakytopia's Flock): Puedes interactuar y tomar clases con los mentores certificados en tu nivel (${options.flockMentorsSummary || 'Teacher Waky, Teacher David'}), manteniendo tu bitácora de progreso 100% unificada.`;

  const subject = `🎉 Welcome to Güakytopia Campus! • Tu Carnet Digital y Acceso Oficial`;

  const bodyText = `¡Bienvenido(a) a Güakytopia Campus, ${student.name}! 🌴✨

Tu matrícula oficial ha sido procesada con éxito por la Rectoría de Directora Waky. Ya eres parte de nuestro Campus Digital, un universo diseñado para que aprendas inglés con confianza, soltura y a tu propio ritmo.

🎓 TU FICHA DE ALUMNO EN EL CAMPUS:
- Alumno: ${student.name} ${student.lastName || ''}
- Nivel de Inicio: ${levelTitle}
- Plan de Estudio: ${student.plan.toUpperCase()} (${student.modality === 'online' ? 'Online' : 'Presencial'})
- Dinámica de Mentoría: ${mentorshipDescription}
- Horarios / Bloques Asignados: ${(student.assignedSlots && student.assignedSlots.length > 0) ? student.assignedSlots.join(' • ') : 'Por coordinar con Rectoría'}
- Salón Virtual (Google Meet): ${options.meetLink || 'https://meet.google.com/eng-cokito-class'}

🔑 CREDENCIALES DE ACCESO AL CAMPUS:
- Enlace al Campus: ${campusUrl}
- Usuario: ${student.email || student.username || student.name.toLowerCase()}
- Contraseña provisional: ${tempPass}

🚀 TU PRIMERA MISIÓN EN EL CAMPUS:
1. Inicia sesión con tus credenciales.
2. Explora el Aula Interactiva (Super Goal 1) y descarga tu libro en PDF.
3. Practica tus primeros drills en el Language Practice Lab (¡100 ejercicios con audio interactivo!).
4. Entrena en The Flock Arena (Sopa de letras, Scrabble y Ahorcado) para ganar tus primeros puntos XP.

"Start where you are. Keep going." ¡Estamos listos para verte volar!

Atentamente,
Directora Waky (The Principal)
Güakytopia Campus • Open the World`;

  const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(student.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

  return { subject, bodyText, gmailWebUrl, tempPass };
}

/**
 * Sends or logs an official Welcome Email for a new Student enrolled at Güakytopia Campus.
 */
export async function sendStudentCampusWelcomeEmail(
  student: Student,
  options: {
    temporaryPassword?: string;
    mentorName?: string;
    flockMentorsSummary?: string;
    meetLink?: string;
  } = {}
): Promise<DispatchEmailResult> {
  const { subject, bodyText, gmailWebUrl, tempPass } = buildStudentWelcomeEmailContent(student, options);
  const timestamp = new Date().toISOString();

  const mailResult = await sendGmailEmail({
    to: student.email,
    subject,
    bodyText,
    studentName: student.name
  });

  if (mailResult.success) {
    return {
      success: true,
      recipient: student.email,
      subject,
      bodyText,
      gmailWebUrl,
      temporaryPassword: tempPass,
      timestamp,
      mode: 'gmail_api'
    };
  }

  return {
    success: true,
    recipient: student.email,
    subject,
    bodyText,
    gmailWebUrl,
    temporaryPassword: tempPass,
    timestamp,
    mode: 'campus_logged',
    error: mailResult.error
  };
}
