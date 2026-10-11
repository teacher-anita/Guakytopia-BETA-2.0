// Telemetry & Pilot Interaction Tracking Engine for Güakytopia Campus
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Student, StudentActivityEvent, StudentTelemetry } from '../types';
import { getLocalStudents, saveStudent } from './db';

const TELEMETRY_STORAGE_KEY_PREFIX = 'guakytopia_telemetry_';

export function getDefaultTelemetry(): StudentTelemetry {
  return {
    hubVisits: 0,
    classroomVisits: 0,
    libraryVisits: 0,
    labVisits: 0,
    calendarVisits: 0,
    totalInteractions: 0,
    recentActivity: []
  };
}

export function getLocalStudentTelemetry(studentId: string): StudentTelemetry {
  try {
    const raw = localStorage.getItem(`${TELEMETRY_STORAGE_KEY_PREFIX}${studentId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return getDefaultTelemetry();
}

/**
 * Tracks student real interaction across Campus sections (Hub, Classroom, Library, Lab, Calendar)
 * Persists immediately in local storage, updates student document in Firestore and syncs with server.
 */
export async function trackStudentAction(
  student: Student | null,
  section: 'hub' | 'classroom' | 'library' | 'lab' | 'calendar',
  action: string,
  detail?: string
): Promise<StudentTelemetry | null> {
  if (!student || !student.id || student.id === 'guest') {
    return null;
  }

  const nowIso = new Date().toISOString();
  const currentTelemetry = student.telemetry || getLocalStudentTelemetry(student.id);

  const event: StudentActivityEvent = {
    id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    section,
    action,
    detail,
    timestamp: nowIso
  };

  const updatedTelemetry: StudentTelemetry = {
    ...currentTelemetry,
    totalInteractions: (currentTelemetry.totalInteractions || 0) + 1,
    lastActiveAt: nowIso,
    hubVisits: section === 'hub' ? (currentTelemetry.hubVisits || 0) + 1 : (currentTelemetry.hubVisits || 0),
    lastHubVisit: section === 'hub' ? nowIso : currentTelemetry.lastHubVisit,
    classroomVisits: section === 'classroom' ? (currentTelemetry.classroomVisits || 0) + 1 : (currentTelemetry.classroomVisits || 0),
    lastClassroomVisit: section === 'classroom' ? nowIso : currentTelemetry.lastClassroomVisit,
    libraryVisits: section === 'library' ? (currentTelemetry.libraryVisits || 0) + 1 : (currentTelemetry.libraryVisits || 0),
    lastLibraryVisit: section === 'library' ? nowIso : currentTelemetry.lastLibraryVisit,
    labVisits: section === 'lab' ? (currentTelemetry.labVisits || 0) + 1 : (currentTelemetry.labVisits || 0),
    lastLabVisit: section === 'lab' ? nowIso : currentTelemetry.lastLabVisit,
    calendarVisits: section === 'calendar' ? (currentTelemetry.calendarVisits || 0) + 1 : (currentTelemetry.calendarVisits || 0),
    lastCalendarVisit: section === 'calendar' ? nowIso : currentTelemetry.lastCalendarVisit,
    recentActivity: [event, ...(currentTelemetry.recentActivity || [])].slice(0, 40)
  };

  // 1. Save locally
  try {
    localStorage.setItem(`${TELEMETRY_STORAGE_KEY_PREFIX}${student.id}`, JSON.stringify(updatedTelemetry));
  } catch {}

  // 2. Update student model in memory and Firestore
  const updatedStudent: Student = {
    ...student,
    telemetry: updatedTelemetry
  };

  // 3. Fire-and-forget save in Firestore & server
  saveStudent(updatedStudent).catch(() => null);

  // 4. Log event to activityLogs collection
  try {
    const logRef = doc(db, 'activityLogs', `${student.id}_${Date.now()}`);
    setDoc(logRef, {
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      ...event
    }).catch(() => null);
  } catch {}

  return updatedTelemetry;
}
