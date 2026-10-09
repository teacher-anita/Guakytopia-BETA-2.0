# Cokitö — Authentication and Academic Event Authorization

## Status

Design note only. No authentication flow, Firestore rules, production configuration, or deployment has been changed.

## Findings from the current development branch

1. The active student profile is selected through a browser-persisted `currentStudentId`. This is useful for UI continuity, but it is not proof of identity.
2. Student credential login currently matches a student record in the client and can accept an empty password when the record has no password. It does not establish a Firebase Authentication identity.
3. `Student` records do not currently define a Firebase Auth UID field. Google sign-in can match a student by email, but that is not a durable authorization link unless the account identity is verified and linked deliberately.
4. `TeacherGate` contains client-side institutional credential checks and role selection. A client-side role is presentation state, not a trusted security boundary.
5. The auth listener previously invoked its success callback only when the Google access-token cache was populated. This was corrected on the development branch: Firebase auth state is now reported independently, with an empty token when a Google API token is unavailable. This does not itself grant Google API access or link a student profile to a UID.
6. The Lab event call currently checks for a non-null Firebase `user` and student UI role, but does not verify that the Firebase UID is linked to `currentStudent.id`. That check alone is insufficient for reliable student attribution.
7. Existing Firestore rules permit public student reads/creates and effectively public slot writes. The catch-all rule denies the new `academicEvents` collection unless an explicit rule is added.

## Required authorization design before enabling event writes

- Keep `VITE_ENABLE_ACADEMIC_EVENT_LOG` unset or false.
- Define a verified link between a student record and a Firebase Auth UID. Never trust a browser-selected student ID as proof of ownership.
- Define a trusted staff authorization mechanism (for example, server-managed custom claims or a server-controlled staff membership record). Do not grant staff privileges based on a client-side password check, email substring, or sessionStorage flag.
- Enforce event authorization in Firestore Security Rules or a trusted backend. Client-side validation is defense in depth, not authorization.
- For student-submitted events, require the authenticated UID to match the UID linked to the event's student record, and validate allowed event fields and types. Prevent a student from claiming a teacher/system actor.
- For teacher-marked class coverage, verify teacher permissions for the relevant student/class and record actor identity and timestamp. Coverage is not mastery.
- Restrict event reads to authorized teachers/staff and the student whose record is linked to the authenticated UID. Avoid public access to academic history.
- Verify the app's effective Firebase project/database at runtime and the rules deployed for that exact database before any write test.
- Test rules and event behavior in an isolated development database with emulator/rules tests before enabling the feature flag.
- Plan migration of existing student accounts/records; do not infer or bulk-link UIDs from names or unverified emails.

## Safe implementation order

1. **Done in development branch (not yet tested):** represent Firebase auth state independently of Google API access-token availability.
2. Design and review student UID linking and staff authorization without changing the live student platform.
3. Write and test database-specific rules in an isolated environment.
4. Add event-writer integration tests and a controlled end-to-end test using non-production test accounts.
5. Only then consider enabling event writes in the development environment.

## Validation status

The auth-listener correction is committed on the development branch, but no TypeScript check, build, automated test, or sign-in regression test has been run yet. Verify Google sign-in, refresh persistence, sign-out, and Firebase email/password sessions before considering this change ready.

## Explicit non-goals for this step

- Do not deploy Firestore rules.
- Do not enable event logging.
- Do not alter student login behavior or force account migration.
- Do not copy student records or credentials into new collections.

## Login decision: email or username + password

The student-facing login should support both identifiers while authenticating through the same trusted identity system:

- **Email + password:** use Firebase Authentication email/password sign-in.
- **Username + password:** resolve the normalized username to the account's authentication email through a trusted server-side mechanism, then authenticate with Firebase Authentication. Do not search the public student collection for usernames and passwords, and do not treat a client-side student lookup as authentication.
- **Password storage:** never store plaintext passwords or password comparisons on Student documents, in localStorage, or in Firestore. Firebase Authentication manages password credentials.
- **Profile link:** after successful authentication, load the student profile linked to the authenticated Firebase UID. A browser-selected `currentStudentId`, matching display name, or unverified email is not proof of ownership.
- **Existing two-student transition:** manually verify each student's identity with the teacher, create or confirm the Firebase Authentication account, then link that profile to the verified UID. Preserve existing student IDs and academic progress; do not bulk-link accounts by name or copy legacy passwords into the new system.
- **Account recovery:** provide a safe password reset flow for email-based accounts. For username sign-in, ensure recovery does not reveal the underlying email address to an unauthenticated visitor.

Username lookup must not create an account-enumeration endpoint. Any callable backend or lookup service must rate-limit attempts, return generic authentication errors, and never return password data. A username may be an alias for sign-in, but the authenticated Firebase UID remains the stable identity used for authorization and academic events.

This is a design decision only. No login code, user records, Firestore rules, or deployed configuration were changed by adding this section. Keep academic event logging disabled until UID linking and database rules are implemented and tested in an isolated development environment.
