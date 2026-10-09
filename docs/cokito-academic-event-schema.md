# Cokitö — Academic Event Schema (v1)

## Purpose
A shared, append-oriented event model for an auditable learner timeline across Güakytopia experiences. This is a design contract; event capture is not enabled by this document.

## Required event fields
- `schemaVersion`: integer, currently `1`.
- `studentId`: internal learner ID, not a name or email.
- `eventType`: a controlled event category.
- `source`: the experience that produced the event.
- `occurredAt`: ISO-8601 timestamp for when the learning event happened.
- `actor`: who initiated it (`student`, `teacher`, or `system`), with an internal ID when authorized and available.

## Optional fields
- `eventId`: stable identifier generated for idempotency.
- `curriculum`: level, book, unit, section, or activity references.
- `outcome`: observed result such as `correct`, `incorrect`, `completed`, `submitted`, or `covered_in_class`.
- `evidence`: structured, minimal evidence (for example, score, attempt number, question ID, or completion flag).
- `metadata`: bounded, non-sensitive technical context.

## Controlled sources
- `language_practice_lab`
- `classroom_and_hub`
- `the_flock_arena`
- `quiz`
- `live_class`
- `google_classroom`
- `system`

## Controlled event types
- `activity_opened`
- `activity_started`
- `answer_submitted`
- `activity_completed`
- `assessment_submitted`
- `class_section_covered`
- `attendance_recorded`
- `assignment_created`
- `assignment_submitted`
- `xp_awarded`

## Evidence rules
1. An opened activity is activity, not completion.
2. Completion is observed progress, not automatically mastery.
3. Mastery requires an assessment/performance and an explicit criterion; XP alone is not evidence of mastery.
4. A teacher marking a section as covered records classroom coverage, not learner mastery.
5. Keep the event append-only; corrections should be represented as a new event or an explicit superseding record rather than silently rewriting history.
6. Store only what is needed. Do not place student names, emails, passwords, full free-text answers, or other unnecessary personal data in event metadata.
7. Events must be authorized for the current teacher/student relationship and validated server-side before being trusted for analytics.

## Suggested Firestore collection
`academicEvents`, with generated document IDs and indexes designed only after query requirements are confirmed.

## Rollout guardrails
- The event writer remains disabled unless `VITE_ENABLE_ACADEMIC_EVENT_LOG=true` is explicitly configured.
- Do not enable it until the Firebase project/database is confirmed to be isolated from the student-facing platform, the authorization model is reviewed, and the Firestore rules are designed and tested.
- This schema alone does not grant access or make Firestore secure.
