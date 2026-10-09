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
  /** Firestore server timestamp added when the event is persisted. */
  recordedAt: unknown;
}

const ALLOWED_SOURCES = new Set<AcademicEventSource>([
  'language_practice_lab',
  'classroom_and_hub',
  'the_flock_arena',
  'quiz',
  'live_class',
  'google_classroom',
  'system',
]);

const ALLOWED_EVENT_TYPES = new Set<AcademicEventType>([
  'activity_opened',
  'activity_started',
  'answer_submitted',
  'activity_completed',
  'assessment_submitted',
  'class_section_covered',
  'attendance_recorded',
  'assignment_created',
  'assignment_submitted',
  'xp_awarded',
]);

const ALLOWED_OUTCOMES = new Set<AcademicOutcome>([
  'opened',
  'started',
  'correct',
  'incorrect',
  'submitted',
  'completed',
  'covered_in_class',
  'attended',
  'awarded',
  'not_applicable',
]);

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
  if (input.schemaVersion !== 1) errors.push('schemaVersion is unsupported.');
  if (!ALLOWED_SOURCES.has(input.source)) errors.push('source is invalid.');
  if (!ALLOWED_EVENT_TYPES.has(input.eventType)) errors.push('eventType is invalid.');
  if (input.outcome !== undefined && !ALLOWED_OUTCOMES.has(input.outcome)) {
    errors.push('outcome is invalid.');
  }

  const isoTimestamp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
  if (!isoTimestamp.test(input.occurredAt) || !Number.isFinite(Date.parse(input.occurredAt))) {
    errors.push('occurredAt must be an ISO-8601 timestamp with timezone.');
  }

  if (!input.actor || !['student', 'teacher', 'system'].includes(input.actor.role)) {
    errors.push('actor.role is invalid.');
  }

  if (input.evidence?.score !== undefined &&
      (!Number.isFinite(input.evidence.score) || input.evidence.score < 0)) {
    errors.push('evidence.score must be a non-negative finite number.');
  }
  if (input.evidence?.maxScore !== undefined &&
      (!Number.isFinite(input.evidence.maxScore) || input.evidence.maxScore < 0)) {
    errors.push('evidence.maxScore must be a non-negative finite number.');
  }
  if (input.evidence?.score !== undefined &&
      input.evidence.maxScore !== undefined &&
      input.evidence.score > input.evidence.maxScore) {
    errors.push('evidence.score cannot exceed evidence.maxScore.');
  }
  if (input.evidence?.attemptNumber !== undefined &&
      (!Number.isInteger(input.evidence.attemptNumber) || input.evidence.attemptNumber < 1)) {
    errors.push('evidence.attemptNumber must be a positive integer.');
  }
  if (input.evidence?.completionPercent !== undefined &&
      (!Number.isFinite(input.evidence.completionPercent) ||
       input.evidence.completionPercent < 0 ||
       input.evidence.completionPercent > 100)) {
    errors.push('evidence.completionPercent must be between 0 and 100.');
  }
  if (input.evidence?.xpAmount !== undefined &&
      (!Number.isFinite(input.evidence.xpAmount) || input.evidence.xpAmount < 0)) {
    errors.push('evidence.xpAmount must be a non-negative finite number.');
  }

  if (input.metadata) {
    for (const [key, value] of Object.entries(input.metadata)) {
      if (!ALLOWED_METADATA_KEYS.has(key)) {
        errors.push(`metadata key "${key}" is not allowed.`);
      }
      if (typeof value === 'string' && value.length > 120) {
        errors.push(`metadata value "${key}" is too long.`);
      }
      if (typeof value === 'number' && !Number.isFinite(value)) {
        errors.push(`metadata value "${key}" must be finite.`);
      }
    }
  }

  return errors;
}
