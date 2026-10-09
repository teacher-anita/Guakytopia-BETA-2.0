import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  onSnapshot, 
  updateDoc 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Student, ScheduleSlot, Teacher } from '../types';
import { INITIAL_STUDENTS, INITIAL_SCHEDULE_SLOTS } from '../data/curriculumData';
import { INITIAL_TEACHERS } from '../data/teachersData';

const STORAGE_KEYS = {
  STUDENTS: 'cokito_students_data_v3',
  SLOTS: 'cokito_slots_data_v3',
  TEACHERS: 'cokito_teachers_data_v1'
};

// 1. SAVE STUDENT (Local + Firestore Cloud)
export async function saveStudent(student: Student): Promise<void> {
  // Always save locally first for instant offline response
  try {
    const local = getLocalStudents();
    const filtered = local.filter(s => s.id !== student.id);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify([student, ...filtered]));
  } catch {}

  // Persist directly to Firestore Cloud
  try {
    const path = `students/${student.id}`;
    const docRef = doc(db, 'students', student.id);
    await setDoc(docRef, student, { merge: true });
    console.log('✅ Student persisted to Firestore Cloud:', student.name);
  } catch (e) {
    console.warn('Firestore cloud save note:', e);
  }
}

// 2. GET STUDENTS LOCAL FALLBACK
export function getLocalStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!raw) return INITIAL_STUDENTS;
    const parsed: Student[] = JSON.parse(raw);
    const map = new Map<string, Student>();
    INITIAL_STUDENTS.forEach((s) => map.set(s.id, s));
    parsed.forEach((s) => map.set(s.id, s));
    return Array.from(map.values());
  } catch {
    return INITIAL_STUDENTS;
  }
}

// 3. SUBSCRIBE TO STUDENTS IN REALTIME FROM FIRESTORE
export function subscribeToStudents(callback: (students: Student[]) => void): () => void {
  // Initialize immediately with local data
  callback(getLocalStudents());

  try {
    const studentsCol = collection(db, 'students');
    const unsubscribe = onSnapshot(
      studentsCol, 
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudStudents: Student[] = [];
          snapshot.forEach((d) => cloudStudents.push(d.data() as Student));
          callback(cloudStudents);
          try {
            localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(cloudStudents));
          } catch {}
        } else {
          // Seed cloud if empty
          for (const s of INITIAL_STUDENTS) {
            setDoc(doc(db, 'students', s.id), s).catch(() => null);
          }
        }
      }, 
      (error) => {
        console.warn('Firestore real-time subscription note:', error.message);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Could not setup Firestore onSnapshot:', err);
    return () => {};
  }
}

// 4. SAVE SCHEDULE SLOTS (Local + Cloud)
export async function saveSlots(slots: ScheduleSlot[]): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(slots));
  } catch {}

  try {
    for (const slot of slots) {
      const docRef = doc(db, 'slots', slot.id);
      await setDoc(docRef, slot, { merge: true });
    }
  } catch (e) {
    console.warn('Could not sync slots to Firestore cloud:', e);
  }
}

// 5. GET SCHEDULE SLOTS LOCAL
export function getLocalSlots(): ScheduleSlot[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SLOTS);
    return raw ? JSON.parse(raw) : INITIAL_SCHEDULE_SLOTS;
  } catch {
    return INITIAL_SCHEDULE_SLOTS;
  }
}

// 6. DELETE STUDENT (Local + Cloud)
export async function deleteStudent(studentId: string): Promise<void> {
  try {
    const local = getLocalStudents();
    const filtered = local.filter(s => s.id !== studentId);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(filtered));
  } catch {}

  try {
    const docRef = doc(db, 'students', studentId);
    await setDoc(docRef, { status: 'inactive' }, { merge: true });
  } catch (e) {
    console.warn('Could not sync student deletion to Firestore:', e);
  }
}

// 7. TEACHERS MANAGEMENT (Local + Cloud)
export function getLocalTeachers(): Teacher[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEACHERS);
    return raw ? JSON.parse(raw) : INITIAL_TEACHERS;
  } catch {
    return INITIAL_TEACHERS;
  }
}

export async function saveTeacher(teacher: Teacher): Promise<void> {
  try {
    const local = getLocalTeachers();
    const filtered = local.filter(t => t.id !== teacher.id);
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify([teacher, ...filtered]));
  } catch {}

  try {
    const docRef = doc(db, 'teachers', teacher.id);
    await setDoc(docRef, teacher, { merge: true });
  } catch (e) {
    console.warn('Could not sync teacher to Firestore:', e);
  }
}

export async function deleteTeacher(teacherId: string): Promise<void> {
  try {
    const local = getLocalTeachers();
    const filtered = local.filter(t => t.id !== teacherId);
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(filtered));
  } catch {}
}

export function subscribeToTeachers(callback: (teachers: Teacher[]) => void): () => void {
  callback(getLocalTeachers());

  try {
    const teachersCol = collection(db, 'teachers');
    const unsubscribe = onSnapshot(
      teachersCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudTeachers: Teacher[] = [];
          snapshot.forEach((d) => cloudTeachers.push(d.data() as Teacher));
          callback(cloudTeachers);
          try {
            localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(cloudTeachers));
          } catch {}
        } else {
          for (const t of INITIAL_TEACHERS) {
            setDoc(doc(db, 'teachers', t.id), t).catch(() => null);
          }
        }
      },
      (err) => console.warn('Teachers subscription note:', err.message)
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Could not setup teachers onSnapshot:', err);
    return () => {};
  }
}

// Arena lives are stored on the authenticated student's existing Firestore document,
// so their count and recharge timestamp follow the student across devices.
export interface ArenaLivesState {
  lives: number;
  updatedAt: number;
}

function parseArenaLives(value: unknown): ArenaLivesState | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Partial<ArenaLivesState>;
  if (!Number.isFinite(candidate.lives) || !Number.isFinite(candidate.updatedAt)) return null;
  return {
    lives: Math.max(0, Math.min(5, Math.floor(candidate.lives as number))),
    updatedAt: candidate.updatedAt as number
  };
}

export function subscribeToArenaLives(
  studentId: string,
  callback: (state: ArenaLivesState | null) => void
): () => void {
  return onSnapshot(
    doc(db, 'students', studentId),
    snapshot => callback(parseArenaLives(snapshot.data()?.arenaLives)),
    error => console.warn('Could not sync Arena lives from Firestore:', error.message)
  );
}

export async function saveArenaLives(studentId: string, state: ArenaLivesState): Promise<void> {
  try {
    await setDoc(doc(db, 'students', studentId), {
      arenaLives: {
        lives: Math.max(0, Math.min(5, Math.floor(state.lives))),
        updatedAt: state.updatedAt
      }
    }, { merge: true });
  } catch (error) {
    console.warn('Could not save Arena lives to Firestore:', error);
  }
}

