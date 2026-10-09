# Güakytopia 2.0 — Account roster and safe onboarding plan

## Status

Planning document only. This does not create Firebase Authentication accounts, change existing student profiles, grant permissions, alter Firestore rules, enable academic-event writes, or deploy anything. Keep all work on the development branch until reviewed.

## Requested identities

| Display identity | Person / purpose | Intended application role | Handling |
|---|---|---|---|
| Teacher Anita | Ana T Sandoval | Teacher | Staff identity; preserve the requested display name |
| Principal Waky | Ana Teresa Sandoval | Principal / director | Staff identity; preserve the requested display name |
| Student Tester | Dedicated test learner | Student (test) | Must be clearly flagged as test data and excluded from real learner analytics |
| Teacher Tester | Dedicated test staff profile | Teacher (test) | Must be restricted to the development environment and never receive production privileges by default |
| Ragni | Existing enrolled learner | Student | Preserve the existing student document ID and learning history |
| Genesis | Existing enrolled learner | Student | Preserve the existing student document ID and learning history |

## Recommended identity model

### Teacher Anita and Principal Waky

The two names refer to the same person according to the requested roster, but represent different application roles and display identities. The safest initial model is **one verified Firebase Authentication identity for Ana, with explicitly authorized teacher and principal roles**. After authentication, she can choose the active role/profile label. The active role is for workflow and audit context; it must not itself grant privileges unless the authenticated identity is authorized for that role by a trusted server-managed claim or server-controlled staff membership record.

Do not create two Firebase accounts with invented email addresses. If the owner later specifically wants two separate sign-in identities, collect a distinct verified email for each account and review the role design first.

### Ragni and Genesis

1. Locate their existing student records in the development database and confirm the database is the intended isolated development database.
2. Verify each learner directly with the teacher; do not link accounts by display name alone.
3. Ask each learner which email they control for sign-in. Do not write the email into this planning document.
4. Create or confirm the Firebase Authentication account, then link the existing student profile to that verified Firebase UID.
5. Preserve the current internal student ID, enrollment information, level, completed hours, XP, streak, notes, and other academic history. Do not create a replacement profile simply to enable login.
6. Test sign-in, refresh persistence, and sign-out with the learner before considering the link complete.

### Student Tester and Teacher Tester

- Use only in the isolated development environment.
- Mark test profiles with an explicit test-only flag or environment-scoped test registry; do not rely on names such as “Tester” as the only safeguard.
- Use non-real learner data and no real learner email, password, or academic history.
- Ensure test activity is excluded from real learner reports, recommendations, leaderboards, and Cokitö analytics by a structured test flag/environment boundary.
- Teacher Tester must not automatically inherit Principal Waky's or Teacher Anita's permissions.

## Sign-in requirements

- Student sign-in should accept email + password, and optionally username + password after a trusted server-side username-to-account lookup is implemented.
- Firebase Authentication validates credentials; Student documents and localStorage must never be used to compare passwords or accept an empty password.
- A successful sign-in must resolve the learner profile through its verified Firebase UID link. A selected browser profile, matching name, or unverified email is not proof of identity.
- Use generic failure messages, rate limiting, and safe password recovery. Never expose a username's underlying email to unauthenticated visitors.
- Staff permissions must not rely on client-side password checks, display names, email substring matching, or sessionStorage flags.

## Safe order of work

1. Review the existing student and staff data models and current login callbacks.
2. Verify the effective Firebase project/database and deployed rules for the development environment.
3. Implement and test trusted identity and role linking without touching the student-facing platform.
4. Link Ragni and Genesis only after manual verification, preserving their existing profile IDs and progress.
5. Create isolated Student Tester and Teacher Tester accounts and verify their test-data exclusion.
6. Add and test Firestore authorization for academic events.
7. Enable event recording in development only after UID ownership, rules, and tests pass.
8. Review any changes before opening a pull request or merging. Do not deploy or change production data as part of this plan.

## Current implementation warnings

The development branch currently has a client-side student credential matcher that can accept a blank password when a student record has no stored password. Staff role checks also include client-side logic. Existing Firestore rules have overly broad student and schedule access. These must be addressed through a deliberate authentication and authorization change, not by creating additional profile records or changing production rules hastily.

The academic event writer remains disabled by default. Keep it disabled until UID-to-profile ownership and database-specific rules are implemented and tested in the isolated development environment.

## Source-code seed audit (development branch)

- The bundled `INITIAL_STUDENTS` seed contains a Genesis profile and includes legacy username/password fields in source code. Treat these fields as exposed legacy credentials: do not reuse them for Firebase Authentication, do not copy them into a new account, and remove their use as part of the reviewed authentication migration. Do not reproduce the credential values in documentation or logs.
- The bundled `INITIAL_STUDENTS` seed does not contain a Ragni entry. This does **not** prove Ragni is absent from Firestore or browser-local data. Inspect the intended development database and confirm the existing record before creating anything.
- The bundled seed also does not define the requested Student Tester or Teacher Tester identities.
- Because the database layer can seed initial records when a cloud collection is empty, verify the effective development database before running the app or changing seed behavior. Do not use a seed reset as a way to reconcile existing learner records.
