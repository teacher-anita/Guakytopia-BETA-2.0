/**
 * Cokitö's shared academic event contract.
 *
 * Keep activity, observed progress, and demonstrated mastery distinct.
 * Do not put names, email addresses, passwords, or full free-text answers here.
 */

export type AcademicEventSource =
  | 'language_practice_lab'
  | 'classroom_and_hub'
  | 'the_flock_arena'
  | 'quiz'
  | 'live_class'
  | 'google_classroom'
  | 'system';

export type AcademicEventType =
  | 'activity_opened'
  | 'activity_started'
  | 'answer_submitted'
  | 'activity_completed'
  | 'assessment_submitted'
  | 'class_section_covered'
  | 'attendance_recorded'
  | 'assignment_created'
  | 'assignment_submitted'
  | 'xp_awarded';

export type AcademicActorRole = 'student' | 'teacher' | 'system';

export type AcademicOutcome =
  | 'opened'
  | 'started'
  | 'correct'
  | 'incorrect'
  | 'submitted'
  | 'completed'
  | 'covered_in_class'
  | 'attended'
  | 'awarded'
  | 'not_applicable';

export interface AcademicCurriculumReference {
  levelId?: string;
  bookId?: string;
  unitId?: string;
  sectionId?: string;
  activityId?: string;
  assessmentId?: string;
}

export interface AcademicActor {
  role: AcademicActorRole;
  /** Internal application ID only; never use an email address here. */
  id?: string;
}

export interface AcademicEvidence {
  /** Keep evidence structured and minimal; never store full free-text answers. */
  score?: number;
  maxScore?: number;
  attemptNumber?: number;
  questionId?: string;
  isCorrect?: boolean;
  completionPercent?: number;
  xpAmount?: number;
}

export interface AcademicEventInput {
  schemaVersion: 1;
  /** Internal learner ID, not a name or email. */
  studentId: string;
  source: AcademicEventSource;
  eventType: AcademicEventType;
  occurredAt: string;
  actor: AcademicActor;
  eventId?: string;
  curriculum?: AcademicCurriculumReference;
  outcome?: AcademicOutcome;
  evidence?: AcademicEvidence;
  metadata?: Record<string, string | number | boolean>;
}

export interface AcademicEventRecord extends AcademicEventInput {
  /** Timestamp added when the event is persisted. */
  recordedAt: unknown;
}

const ALLOWED_METADATA_KEYS = new Set([
  'clientVersion',
  'attemptNumber',
  'durationSeconds',
  'stationId',
  'questionCount',
]);

/**
 * Minimal client-side validation. This is not an authorization boundary;
 * authorization and validation must also be enforced by trusted backend rules.
 */
export function validateAcademicEvent(input: AcademicEventInput): string[] {
  const errors: string[] = [];

  if (!input.studentId.trim()) errors.push('studentId is required.');
  if (!Number.isFinite(Date.parse(input.occurredAt))) {
    errors.push('occurredAt must be a valid ISO-8601 timestamp.');
  }
  if (input.actor.role !== 'student' && input.actor.role !== 'teacher' && input.actor.role !== 'system') {
    errors.push('actor.role is invalid.');
  }

  if (input.evidence?.score !== undefined && !Number.isFinite(input.evidence.score)) {
    errors.push('evidence.score must be finite.');
  }
  if (input.evidence?.maxScore !== undefined && !Number.isFinite(input.evidence.maxScore)) {
    errors.push('evidence.maxScore must be finite.');
  }
  if (input.evidence?.completionPercent !== undefined &&
      (input.evidence.completionPercent < 0 || input.evidence.completionPercent > 100)) {
    errors.push('evidence.completionPercent must be between 0 and 100.');
  }

  if (input.metadata) {
    for (const key of Object.keys(input.metadata)) {
      if (!ALLOWED_METADATA_KEYS.has(key)) {
        errors.push(`metadata key "${key}" is not allowed.`);
      }
    }
  }

  return errors;
}
