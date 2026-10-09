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

The shared event schema and guarded writer have been added on the development branch. Language Practice Lab answer submission and Unit Quiz completion now call the writer only for a Firebase-authenticated student session; quiz events record score/max score and curriculum reference without storing question text or selected answers. The writer is disabled unless `VITE_ENABLE_ACADEMIC_EVENT_LOG=true`, so no events are persisted by default. Keep it disabled until database targeting, authorization rules, and validation are reviewed.

## Recommended implementation sequence

1. **Finish environment-isolation verification.** Compare effective runtime configuration and database-scoped Firestore rules before enabling writes. Do not alter rules until app read/write requirements and the intended database are confirmed.
2. **Define a shared academic-event schema.** Design an auditable, chronological record for Lab, Hub, Classroom, The Flock Arena • Retos Diarios & Comunidad, quizzes, and teacher-marked class coverage.
3. **Connect the Language Practice Lab first.** Preserve its current user experience while emitting events for starts, answers, correctness, completion, and retries. Do not treat XP as a substitute for academic evidence.
4. **Add authorized teacher/class records.** A teacher marking a section as covered records the teacher, student, section, and timestamp; it does not automatically mean mastery.
5. **Connect the remaining experiences.** Integrate the Hub and Classroom, The Flock Arena, assessments, and class activity. Google Classroom data requires its own authorized integration.
6. **Build recommendations.** Only after event capture is reliable, derive patterns and propose next steps with supporting evidence.
7. **Surface insights in teacher dashboards.** Show evidence, trends, uncertainty, and suggested actions; leave pedagogical decisions to humans.

## Authentication and event-authorization review (2026-10-08)

A focused review found that the current student selector is browser-persisted and is not identity proof; student credential login is client-side and does not create a Firebase Auth identity; student records have no Firebase UID link; and staff role checks are client-side. The auth listener was corrected on this branch to report Firebase auth independently of Google API token availability, but the change is not yet tested. The Lab event guard still does not prove that the authenticated UID owns the selected student profile. Details and safe prerequisites are documented in `docs/cokito-auth-and-event-authorization.md`. Event writes remain disabled. No rules or live authentication behavior were changed.

## Initial audit findings

- Language Practice Lab answers are currently persisted in browser localStorage under a per-student key; they are not yet a shared academic event history.
- A versioned event contract is defined in `src/types/academicEvent.ts` and `docs/cokito-academic-event-schema.md`; `src/services/academicEvents.ts` is opt-in, and the Language Practice Lab and Unit Quiz call it for authenticated student answer/assessment submissions. Event writes remain disabled by default.
- Student and schedule data are persisted to Firestore and localStorage.
- The current Firestore rules allow public reads and creates for student records, and schedule writes are effectively unrestricted due to an unconditional `|| true`.
- Teacher access checks exist in client-side code. Client-side gates alone are not a secure authorization boundary.
- These are security concerns to resolve carefully, after confirming environment isolation and mapping the app's required reads/writes. Tightening rules without that analysis could break existing flows.

## Safety constraints

- Work on a development branch; keep `main` unchanged until reviewed.
- Do not place secrets, credentials, or personal student data in this document, source control, or logs.
- Do not change Firebase security rules, authentication, migrations, or deployment settings as part of an unrelated feature.
- Verify build/type checks and review the diff before proposing a merge.


## Approved 15-point optimization program (2026-10-09)

The owner authorized all 15 optimization areas for this development branch only. No production deployment, merge, real-data mutation, or external-service change is authorized. Work autonomously on reversible code/documentation improvements, run validation, and stop before high-risk changes or when external credentials/environment access are required.

### Workstream status and sequencing

| # | Workstream | Current understanding | Next safe action |
|---|---|---|---|
| 1 | Security and student privacy | **Critical blocker:** Firestore rules allow public student reads/creates and effectively public slot writes. Student profile shape includes a password field. | Map all read/write paths and identity ownership first. Do not deploy/tighten rules blindly or migrate credentials without a reviewed migration plan. |
| 2 | Cokitö pedagogical intelligence | Schema and opt-in academic-event writer exist. Arena currently records up to 200 local learning signals per browser profile; it is not central analytics. | Keep activity, progress, and mastery distinct; unify event contracts only after identity authorization is trustworthy. |
| 3 | Curriculum progression | Arena has a verified Level 1 Unit 1 vocabulary pack; later-unit banks are not yet validated in the available source. Lab has 100 Unit 1 exercises. | Reuse only verified curriculum content; do not invent later-unit vocabulary. Map authoritative curriculum sources before adding banks. |
| 4 | Mobile/tablet UX | Arena received responsive layout changes and a 320px viewport smoke test. Other screens still need systematic coverage. | Add viewport and touch-usage coverage module by module; fix measured issues. |
| 5 | Authentication and roles | Browser-selected profiles and client-side staff gates are not identity proof. Student credentials are not yet safely linked to Firebase UID ownership. | Design UID linking and trusted staff-role authorization; do not force account migration or change login behavior without a tested plan. |
| 6 | Central learning history | Academic-event schema/writer are present but logging is disabled by default; Arena signals remain local. | Keep the feature flag off until database targeting and Firestore authorization are verified. |
| 7 | Teacher progress dashboard | Existing teacher dashboards display roster/classroom information; Cokitö evidence-based insights are not yet fully connected. | Build only on authorized, validated event data; display evidence and uncertainty, not unsupported mastery claims. |
| 8 | Games, XP and rewards | Arena includes three mini-games and XP/lives. Daily quest state/reward persistence requires further review. | Audit repeat reward paths and progression without resetting learner state. |
| 9 | Speech/audio | Language Lab uses browser/media audio paths; speech quality varies by browser/device. | Improve graceful fallback and controls; any paid/neural voice service requires separate owner credentials and approval. |
| 10 | Schedule/calendar | Slots are stored through local/cloud data paths; public-write rule makes authorization review urgent. | Review booking, assignment, capacity and concurrency paths before changing persistence or rules. |
| 11 | Performance | Vite/React build and CI checks are available. No current performance baseline is recorded here. | Measure bundle/build and key render paths before optimizing. |
| 12 | Data integrity/sync | LocalStorage and Firestore coexist; cloud student/slot persistence and Arena lives sync need consistent ownership rules. | Add idempotency/conflict tests and avoid destructive sync or migration. |
| 13 | Automated tests | GitHub Actions checks TypeScript, production build, Playwright E2E and a runtime smoke test. Latest Arena learning-signal workflow succeeded. | Expand negative authorization and cross-profile isolation tests as safe test seams become available. |
| 14 | Accessibility/age adaptation | Kids/adult theme variants exist; full accessibility audit is not yet recorded. | Test labels, keyboard flow, contrast, zoom and touch targets across key screens. |
| 15 | Maintenance/documentation | Existing technical plans cover account migration, event schema and auth authorization. | Keep these docs aligned with verified implementation and test results. |

### Arena learning-signal implementation note

The Arena now records local signals for correct round completion and incorrect attempts, tagged with game, word, a Unit 1 curriculum key, and timestamp; it shows a small local summary. A Playwright test verifies a Scrabble incorrect attempt is stored. This is a **local prototype**, not the central academic-event pipeline. Do not describe it as cross-device analytics, and do not enable Firestore event writes until UID ownership and database-specific rules are reviewed.

### Non-negotiable stop conditions

- Do not deploy or change Firebase rules, production config, OAuth scopes, paid services, or external integrations.
- Do not create, merge, delete, or bulk-link student/staff accounts or mutate real student records.
- Do not enable central academic-event logging while student ownership and staff authorization remain unresolved.
- Do not invent curriculum content for unverified units or report mastery from XP/attempt counts alone.
- If a change could lock out legitimate users, expose student information, or irreversibly alter data, document the finding and stop for owner review.

### Validation record

- Arena curriculum/mobile smoke workflow: successful at commit `db751b7666bd048ab698132e2a1385e8deb8ee28`.
- Arena learning-signal E2E workflow: successful at commit `5ed83d8de4dba6c02b62cc1ea50bc20d8b8ee141`.
- These are historical workflow results for their respective commits, not proof that all 15 workstreams are complete.
