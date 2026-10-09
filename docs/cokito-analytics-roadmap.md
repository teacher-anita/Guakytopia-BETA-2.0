# Cokitö — Technical Roadmap for Academic Intelligence

## Purpose

Cokitö is the study-control analyst and advisor for Güakytopia. It reviews authorized learning history, detects patterns, and recommends evidence-based next steps. Teachers retain final pedagogical decisions.

## Operating principle

Güakytopia 2.0 is a development and experimentation environment. The separate platform currently used by students must not be disrupted. No production data, Firebase rules, or deployments should be changed until the relationship between this repository's Firebase project and the student-facing platform is verified.

## Learning evidence model

Keep these concepts separate:
- **Activity:** an event occurred (opened, started, answered, submitted, attended, or was assigned).
- **Observed progress:** evidence that a learner completed a defined step.
- **Demonstrated mastery:** evidence from assessment or performance against a stated criterion.

Opening an activity is not completion; completion alone is not mastery. Every academic event should include, where available: student ID, event type, experience/source, activity or curriculum reference, timestamp, outcome, evidence, and actor (student, teacher, or system).

## Environment-isolation check (2026-10-08)

The repository configuration was compared with the student-facing `Cokitos-Academy` repository. Both configurations reference the same Firebase project ID, but specify different Firestore database IDs. This is a positive indicator of database-level separation, not sufficient proof by itself. Before enabling writes, verify the deployed app's effective config and that Firestore rules are deployed and scoped to the intended database. No production data or rules have been changed.

The shared event schema and guarded writer have been added on the development branch. Language Practice Lab answer submission now calls the writer only for a Firebase-authenticated student session. The writer is disabled unless `VITE_ENABLE_ACADEMIC_EVENT_LOG=true`, so no events are persisted by default. Keep it disabled until database targeting, authorization rules, and validation are reviewed.

## Recommended implementation sequence

1. **Finish environment-isolation verification.** Compare effective runtime configuration and database-scoped Firestore rules before enabling writes. Do not alter rules until app read/write requirements and the intended database are confirmed.
2. **Define a shared academic-event schema.** Design an auditable, chronological record for Lab, Hub, Classroom, The Flock Arena • Retos Diarios & Comunidad, quizzes, and teacher-marked class coverage.
3. **Connect the Language Practice Lab first.** Preserve its current user experience while emitting events for starts, answers, correctness, completion, and retries. Do not treat XP as a substitute for academic evidence.
4. **Add authorized teacher/class records.** A teacher marking a section as covered records the teacher, student, section, and timestamp; it does not automatically mean mastery.
5. **Connect the remaining experiences.** Integrate the Hub and Classroom, The Flock Arena, assessments, and class activity. Google Classroom data requires its own authorized integration.
6. **Build recommendations.** Only after event capture is reliable, derive patterns and propose next steps with supporting evidence.
7. **Surface insights in teacher dashboards.** Show evidence, trends, uncertainty, and suggested actions; leave pedagogical decisions to humans.

## Initial audit findings

- Language Practice Lab answers are currently persisted in browser localStorage under a per-student key; they are not yet a shared academic event history.
- A versioned event contract is defined in `src/types/academicEvent.ts` and `docs/cokito-academic-event-schema.md`; `src/services/academicEvents.ts` is opt-in, and Language Practice Lab calls it for authenticated student answer submissions. Event writes remain disabled by default.
- Student and schedule data are persisted to Firestore and localStorage.
- The current Firestore rules allow public reads and creates for student records, and schedule writes are effectively unrestricted due to an unconditional `|| true`.
- Teacher access checks exist in client-side code. Client-side gates alone are not a secure authorization boundary.
- These are security concerns to resolve carefully, after confirming environment isolation and mapping the app's required reads/writes. Tightening rules without that analysis could break existing flows.

## Safety constraints

- Work on a development branch; keep `main` unchanged until reviewed.
- Do not place secrets, credentials, or personal student data in this document, source control, or logs.
- Do not change Firebase security rules, authentication, migrations, or deployment settings as part of an unrelated feature.
- Verify build/type checks and review the diff before proposing a merge.
