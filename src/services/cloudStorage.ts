import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { db, auth, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import { Student, ScheduleSlot } from '../types';
import { INITIAL_STUDENTS, INITIAL_SCHEDULE_SLOTS } from '../data/curriculumData';

const STUDENTS_COLLECTION = 'students';
const SLOTS_COLLECTION = 'slots';

/**
 * Listen in real time to students collection in Firestore.
 * If empty on first boot, seeds initial students so UI is never blank.
 */
export function subscribeToStudents(
  onUpdate: (students: Student[]) => void,
  onError?: (err: unknown) => void
): () => void {
  const colRef = collection(db, STUDENTS_COLLECTION);

  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        // Seed initial students into cloud
        try {
          for (const s of INITIAL_STUDENTS) {
            await setDoc(doc(db, STUDENTS_COLLECTION, s.id), s);
          }
          onUpdate(INITIAL_STUDENTS);
        } catch (e) {
          console.warn('Could not seed initial students to cloud:', e);
          onUpdate(INITIAL_STUDENTS);
        }
      } else {
        const cloudStudents: Student[] = [];
        snapshot.forEach((docSnap) => {
          cloudStudents.push(docSnap.data() as Student);
        });
        onUpdate(cloudStudents);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, STUDENTS_COLLECTION);
      if (onError) onError(error);
    }
  );
}

/**
 * Save or update a student permanently in Firestore cloud.
 */
export async function saveStudentToCloud(student: Student): Promise<void> {
  const path = `${STUDENTS_COLLECTION}/${student.id}`;
  try {
    const docRef = doc(db, STUDENTS_COLLECTION, student.id);
    await setDoc(docRef, student, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Update student XP, progress or notes.
 */
export async function updateStudentProgress(
  studentId: string, 
  updates: Partial<Student>
): Promise<void> {
  const path = `${STUDENTS_COLLECTION}/${studentId}`;
  try {
    const docRef = doc(db, STUDENTS_COLLECTION, studentId);
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Listen in real time to schedule slots in Firestore.
 */
export function subscribeToSlots(
  onUpdate: (slots: ScheduleSlot[]) => void,
  onError?: (err: unknown) => void
): () => void {
  const colRef = collection(db, SLOTS_COLLECTION);

  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          for (const slot of INITIAL_SCHEDULE_SLOTS) {
            await setDoc(doc(db, SLOTS_COLLECTION, slot.id), slot);
          }
          onUpdate(INITIAL_SCHEDULE_SLOTS);
        } catch (e) {
          console.warn('Could not seed schedule slots:', e);
          onUpdate(INITIAL_SCHEDULE_SLOTS);
        }
      } else {
        const cloudSlots: ScheduleSlot[] = [];
        snapshot.forEach((docSnap) => {
          cloudSlots.push(docSnap.data() as ScheduleSlot);
        });
        onUpdate(cloudSlots);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, SLOTS_COLLECTION);
      if (onError) onError(error);
    }
  );
}

/**
 * Book or free a slot in Firestore.
 */
export async function updateSlotInCloud(
  slotId: string, 
  updates: Partial<ScheduleSlot>
): Promise<void> {
  const path = `${SLOTS_COLLECTION}/${slotId}`;
  try {
    const docRef = doc(db, SLOTS_COLLECTION, slotId);
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Google Sign In via Firebase Auth popup.
 */
export async function signInWithGoogle(): Promise<FirebaseUser | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
}

/**
 * Sign out of Firebase Auth.
 */
export async function signOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Listen to auth state changes.
 */
export function subscribeToAuth(
  onUserChanged: (user: FirebaseUser | null) => void
): () => void {
  return onAuthStateChanged(auth, onUserChanged);
}
