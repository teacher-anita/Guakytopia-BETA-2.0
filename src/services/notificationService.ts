// Notification and Student Class Request Service for Güakytopia / Coquitos Academy

export interface StudentNotification {
  id: string;
  studentId: string;
  type: 'class_assigned' | 'class_request' | 'class_updated' | 'scholarship' | 'rectoria';
  title: string;
  message: string;
  teacherName?: string;
  slots?: string[];
  levelTitle?: string;
  meetLink?: string;
  date: string;
  read: boolean;
}

export interface StudentClassRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  requestedClassesCount: number; // e.g. 2, 4, 8
  preferredTeacher?: string;
  preferredDaysTimes: string;
  modality: 'online' | 'presencial';
  notes?: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const NOTIFICATIONS_STORAGE_KEY = 'cokitö_student_notifications_v1';
const CLASS_REQUESTS_STORAGE_KEY = 'cokitö_class_requests_v1';

const INITIAL_NOTIFICATIONS: StudentNotification[] = [
  {
    id: 'notif_genesis_welcome',
    studentId: 'student_genesis',
    type: 'rectoria',
    title: '¡Bienvenida a Güakytopia, Génesis! 🌴🎓',
    message: 'Tu matrícula institucional ha sido procesada con éxito por Rectoría. Directora Waky revisará tu perfil para asignarte profesor y horarios de clase.',
    date: '2026-10-06T14:30:00Z',
    read: false
  },
  {
    id: 'notif_ana_welcome',
    studentId: 'student_ana_sandoval',
    type: 'class_assigned',
    title: '¡Pase Digital de Super Goal 1 Activado! 📚',
    message: 'Tu acceso al aula digital y banco de 100 ejercicios interactivos ya se encuentra habilitado.',
    teacherName: 'Teacher Cokitö',
    levelTitle: 'Super Goal 1 (A1)',
    date: '2026-10-04T10:00:00Z',
    read: true
  }
];

export function getStoredNotifications(): StudentNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_NOTIFICATIONS;
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveStoredNotifications(notifs: StudentNotification[]): void {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifs));
  } catch (e) {
    console.warn('Failed saving notifications', e);
  }
}

export function getStudentNotifications(studentId: string): StudentNotification[] {
  const all = getStoredNotifications();
  return all.filter(n => n.studentId === studentId);
}

export function addStudentNotification(data: {
  studentId: string;
  type: StudentNotification['type'];
  title: string;
  message: string;
  teacherName?: string;
  slots?: string[];
  levelTitle?: string;
  meetLink?: string;
}): StudentNotification {
  const all = getStoredNotifications();
  const newNotif: StudentNotification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    studentId: data.studentId,
    type: data.type,
    title: data.title,
    message: data.message,
    teacherName: data.teacherName,
    slots: data.slots,
    levelTitle: data.levelTitle,
    meetLink: data.meetLink,
    date: new Date().toISOString(),
    read: false
  };

  const updated = [newNotif, ...all];
  saveStoredNotifications(updated);
  return newNotif;
}

export function markNotificationAsRead(studentId: string, notificationId: string): void {
  const all = getStoredNotifications();
  const updated = all.map(n => {
    if (n.studentId === studentId && n.id === notificationId) {
      return { ...n, read: true };
    }
    return n;
  });
  saveStoredNotifications(updated);
}

// -------------------------------------------------------------
// STUDENT CLASS REQUESTS (Adding more classes / Solicitar clases)
// -------------------------------------------------------------
const INITIAL_CLASS_REQUESTS: StudentClassRequest[] = [
  {
    id: 'req_genesis_initial',
    studentId: 'student_genesis',
    studentName: 'Génesis Rondón',
    studentEmail: 'genesis.rondon@gmail.com',
    requestedClassesCount: 2,
    preferredTeacher: 'Teacher Cokitö',
    preferredDaysTimes: 'Lunes y Miércoles 5:00 pm - 6:00 pm',
    modality: 'online',
    notes: '¡Hola Directora Waky! Ya me inscribí y quiero agendar 2 clases semanales de conversación para mi trabajo.',
    createdAt: '2026-10-06T15:00:00Z',
    status: 'pending'
  }
];

export function getStoredClassRequests(): StudentClassRequest[] {
  try {
    const raw = localStorage.getItem(CLASS_REQUESTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CLASS_REQUESTS_STORAGE_KEY, JSON.stringify(INITIAL_CLASS_REQUESTS));
      return INITIAL_CLASS_REQUESTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_CLASS_REQUESTS;
  } catch {
    return INITIAL_CLASS_REQUESTS;
  }
}

export function saveStoredClassRequests(requests: StudentClassRequest[]): void {
  try {
    localStorage.setItem(CLASS_REQUESTS_STORAGE_KEY, JSON.stringify(requests));
  } catch (e) {
    console.warn('Failed saving class requests', e);
  }
}

export function addStudentClassRequest(data: Omit<StudentClassRequest, 'id' | 'createdAt' | 'status'>): StudentClassRequest {
  const all = getStoredClassRequests();
  const newRequest: StudentClassRequest = {
    ...data,
    id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: 'pending'
  };

  const updated = [newRequest, ...all];
  saveStoredClassRequests(updated);
  return newRequest;
}

export function updateClassRequestStatus(requestId: string, status: 'pending' | 'approved' | 'rejected'): void {
  const all = getStoredClassRequests();
  const updated = all.map(r => r.id === requestId ? { ...r, status } : r);
  saveStoredClassRequests(updated);
}
