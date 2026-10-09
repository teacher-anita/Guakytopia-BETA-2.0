import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { AcademicEventInput, validateAcademicEvent } from '../types/academicEvent';

/**
 * Writes an academic event only when explicitly enabled.
 *
 * IMPORTANT: Keep VITE_ENABLE_ACADEMIC_EVENT_LOG unset/false until the
 * Firebase environment is confirmed isolated and security rules are reviewed.
 * Client-side checks are not a security boundary; Firestore rules must enforce
 * authorization before this writer is enabled.
 */
const isAcademicEventLogEnabled =
  import.meta.env.VITE_ENABLE_ACADEMIC_EVENT_LOG === 'true';

export async function recordAcademicEvent(
  event: AcademicEventInput
): Promise<{ recorded: boolean; reason?: string }> {
  if (!isAcademicEventLogEnabled) {
    return { recorded: false, reason: 'academic_event_logging_disabled' };
  }

  const validationErrors = validateAcademicEvent(event);
  if (validationErrors.length > 0) {
    throw new Error(`Invalid academic event: ${validationErrors.join(' ')}`);
  }

  // Use a generated document ID. Do not trust client-supplied IDs for auth.
  await addDoc(collection(db, 'academicEvents'), {
    ...event,
    recordedAt: serverTimestamp(),
  });

  return { recorded: true };
}
