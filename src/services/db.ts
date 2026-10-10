import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  onSnapshot, 
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Student, ScheduleSlot, Teacher } from '../types';
import { INITIAL_STUDENTS, INITIAL_SCHEDULE_SLOTS } from '../data/curriculumData';
import { INITIAL_TEACHERS } from '../data/teachersData';
import { 
  CouponItem, 
  INITIAL_COUPONS, 
  getStoredCoupons, 
  saveStoredCoupons, 
  findCouponByCode, 
  normalizeCouponCode 
} from '../data/couponsData';

const STORAGE_KEYS = {
  STUDENTS: 'cokito_students_data_v3',
  SLOTS: 'cokito_slots_data_v3',
  TEACHERS: 'cokito_teachers_data_v1'
};

// 1. SAVE STUDENT (Local + Firestore Cloud + Server Backup)
export async function saveStudent(student: Student): Promise<void> {
  // Always save locally first for instant offline response
  try {
    const local = getLocalStudents();
    const filtered = local.filter(s => s.id !== student.id);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify([student, ...filtered]));
  } catch {}

  // Persist directly to Firestore Cloud
  try {
    const docRef = doc(db, 'students', student.id);
    await setDoc(docRef, student, { merge: true });
    console.log('✅ Student persisted to Firestore Cloud:', student.name);
  } catch (e) {
    console.warn('Firestore cloud save note:', e);
  }

  // Backup sync to server endpoint
  try {
    await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
  } catch {}
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

// 3. SUBSCRIBE TO STUDENTS IN REALTIME FROM FIRESTORE & SERVER
export function subscribeToStudents(callback: (students: Student[]) => void): () => void {
  // Initialize immediately with local data
  callback(getLocalStudents());

  // Also fetch from server cache immediately to bridge cross-device changes
  fetch('/api/students')
    .then(res => res.json())
    .then((serverStudents: Student[]) => {
      if (Array.isArray(serverStudents) && serverStudents.length > 0) {
        const map = new Map<string, Student>();
        getLocalStudents().forEach(s => map.set(s.id, s));
        serverStudents.forEach(s => map.set(s.id, s));
        const merged = Array.from(map.values());
        try {
          localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(merged));
        } catch {}
        callback(merged);
      }
    })
    .catch(() => null);

  try {
    const studentsCol = collection(db, 'students');
    const unsubscribe = onSnapshot(
      studentsCol, 
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudStudents: Student[] = [];
          snapshot.forEach((d) => cloudStudents.push(d.data() as Student));
          
          // Merge with INITIAL_STUDENTS to preserve baseline
          const map = new Map<string, Student>();
          INITIAL_STUDENTS.forEach(s => map.set(s.id, s));
          cloudStudents.forEach(s => map.set(s.id, s));
          const merged = Array.from(map.values());

          callback(merged);
          try {
            localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(merged));
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

  try {
    await fetch(`/api/students/${studentId}`, { method: 'DELETE' });
  } catch {}
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

// ============================================================================
// COUPONS CLOUD MANAGEMENT & REAL-TIME MULTI-DEVICE SYNCHRONIZATION
// ============================================================================

export async function saveCoupon(coupon: CouponItem): Promise<void> {
  // 1. Instant local cache update
  try {
    const list = getStoredCoupons();
    const filtered = list.filter(c => c.id !== coupon.id);
    const updated = [coupon, ...filtered];
    saveStoredCoupons(updated);
  } catch {}

  // 2. Persist to Firestore Cloud (/coupons/{couponId})
  try {
    const docRef = doc(db, 'coupons', coupon.id);
    await setDoc(docRef, coupon, { merge: true });
    console.log('✅ Coupon synced to Firestore Cloud:', coupon.code);
  } catch (err) {
    console.warn('Could not sync coupon to Firestore:', err);
  }

  // 3. Fallback sync to server endpoint
  try {
    await fetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(coupon)
    });
  } catch {}
}

export async function deleteCoupon(couponId: string): Promise<void> {
  // 1. Update local cache
  try {
    const list = getStoredCoupons();
    const updated = list.filter(c => c.id !== couponId);
    saveStoredCoupons(updated);
  } catch {}

  // 2. Delete from Firestore Cloud
  try {
    await deleteDoc(doc(db, 'coupons', couponId));
    console.log('🗑️ Coupon deleted from Firestore Cloud:', couponId);
  } catch (err) {
    console.warn('Could not delete coupon from Firestore:', err);
  }

  // 3. Server endpoint
  try {
    await fetch(`/api/coupons/${couponId}`, { method: 'DELETE' });
  } catch {}
}

export async function incrementCouponUses(couponId: string): Promise<void> {
  try {
    const list = getStoredCoupons();
    const coupon = list.find(c => c.id === couponId);
    const newUses = ((coupon?.currentUses) || 0) + 1;
    if (coupon) {
      coupon.currentUses = newUses;
      saveStoredCoupons(list);
    }

    // Update in Firestore
    const docRef = doc(db, 'coupons', couponId);
    await setDoc(docRef, { currentUses: newUses }, { merge: true });

    // Update on server
    await fetch(`/api/coupons/${couponId}/redeem`, { method: 'POST' });
  } catch (err) {
    console.warn('Could not increment coupon uses:', err);
  }
}

export function subscribeToCoupons(callback: (coupons: CouponItem[]) => void): () => void {
  // Emit current local coupons immediately
  callback(getStoredCoupons());

  try {
    const couponsCol = collection(db, 'coupons');
    const unsubscribe = onSnapshot(
      couponsCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudCoupons: CouponItem[] = [];
          snapshot.forEach((d) => cloudCoupons.push(d.data() as CouponItem));

          // Merge cloud coupons with INITIAL_COUPONS
          const map = new Map<string, CouponItem>();
          INITIAL_COUPONS.forEach(c => map.set(c.id, c));
          cloudCoupons.forEach(c => map.set(c.id, c));
          const merged = Array.from(map.values());

          saveStoredCoupons(merged);
          callback(merged);
        } else {
          // If cloud collection is completely empty, seed it with INITIAL_COUPONS
          const initial = getStoredCoupons();
          for (const c of initial) {
            setDoc(doc(db, 'coupons', c.id), c).catch(() => null);
          }
        }
      },
      (err) => {
        console.warn('Coupons real-time subscription note:', err.message);
      }
    );

    // Also poll server endpoint as background resilience
    fetch('/api/coupons')
      .then(res => res.json())
      .then((serverCoupons: CouponItem[]) => {
        if (Array.isArray(serverCoupons) && serverCoupons.length > 0) {
          const map = new Map<string, CouponItem>();
          getStoredCoupons().forEach(c => map.set(c.id, c));
          serverCoupons.forEach(c => map.set(c.id, c));
          const merged = Array.from(map.values());
          saveStoredCoupons(merged);
          callback(merged);
        }
      })
      .catch(() => null);

    return unsubscribe;
  } catch (err) {
    console.warn('Could not setup coupons onSnapshot:', err);
    return () => {};
  }
}

export async function findCouponByCodeAsync(code: string): Promise<CouponItem | null> {
  if (!code || typeof code !== 'string') return null;

  // 1. Instant local check
  const local = findCouponByCode(code);
  if (local) return local;

  // 2. Direct Firestore Cloud lookup across devices
  try {
    const snap = await getDocs(collection(db, 'coupons'));
    if (!snap.empty) {
      const cloudList: CouponItem[] = [];
      snap.forEach(d => cloudList.push(d.data() as CouponItem));
      saveStoredCoupons(cloudList);
      const matched = findCouponByCode(code, cloudList);
      if (matched) return matched;
    }
  } catch (err) {
    console.warn('Direct Firestore coupon lookup error:', err);
  }

  // 3. Server API fallback lookup
  try {
    const res = await fetch('/api/coupons');
    if (res.ok) {
      const serverCoupons = await res.json();
      if (Array.isArray(serverCoupons) && serverCoupons.length > 0) {
        saveStoredCoupons(serverCoupons);
        const matched = findCouponByCode(code, serverCoupons);
        if (matched) return matched;
      }
    }
  } catch {}

  return null;
}


