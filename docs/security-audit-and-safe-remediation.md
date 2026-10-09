# Güakytopia 2.0 — Security Audit and Safe Remediation Queue

## Scope and safety

This is a source-code review of branch `codex/guakytopia-lab-2026-10-08` only. It does not test a live Firebase project and does not prove which rules are currently deployed. No runtime code, credentials, student records, Firebase configuration, or rules were changed as part of this audit note.

**Do not deploy a replacement ruleset based on this document alone.** First confirm the target Firebase project/database and model legitimate registration, teacher, calendar, and student flows in an isolated emulator or development project.

## Findings from source review

### Critical — Firestore rules permit broad access in the checked-in rules file

File: `firestore.rules`

- Student documents are readable and creatable without authentication.
- Slot writes are effectively public because the rule includes an unconditional true branch.
- The student update rule allows matching by document ID or email in addition to a teacher email check; neither is a complete ownership/role model.
- A default-deny catch-all does not compensate for permissive collection-specific rules.

**Impact:** depending on which rules are deployed, student profiles and scheduling records may be exposed or modifiable by unauthenticated visitors. Source review cannot establish deployed state.

**Safe next step:** inventory all document fields and client read/write operations, then implement least-privilege rules in an isolated environment with rules unit tests. Never publish rules until student registration and scheduling have a tested, approved authorization path.

### Critical — Staff authorization is based on client-side state and hard-coded credentials

Files: `src/components/TeacherGate.tsx`, `src/App.tsx`

- TeacherGate contains institutional credential comparisons in client code.
- The app restores staff role flags from `sessionStorage`; these flags are presentation state, not proof of staff authorization.
- The Firebase auth listener promotes accounts based on a specific email and an email-substring check.
- Teacher and principal roles can be selected client-side after entering the gate.

**Impact:** client code and browser storage cannot establish trusted staff permissions. Hard-coded credentials are recoverable from a client bundle/source.

**Safe next step:** move staff authorization to a trusted mechanism such as server-managed custom claims or a server-controlled membership record, and verify permissions in Firestore rules/backend. Do not remove the existing path abruptly; preserve a migration and rollback plan and test separate teacher/principal capabilities with synthetic accounts.

### Critical — Student credential login is client-side and depends on the student roster

File: `src/App.tsx`

- Credential login searches the client-side `students` array by email, name, or username and compares the supplied password with a profile field.
- A successful match sets a sessionStorage flag and selected profile; it does not itself establish a Firebase Authentication identity.
- The current check rejects missing passwords, but the overall design still places credential verification in client-visible profile data.
- Registration and coupon flows set the student session flag after saving/selecting a profile, without proving ownership through Firebase Auth.

**Impact:** profile selection/session flags can be confused with identity and the legacy credential design cannot safely authorize private data.

**Safe next step:** authenticate using Firebase Authentication; link profiles to a verified Firebase UID through a deliberate, teacher-verified migration. Do not bulk-link by display name or unverified email, and do not migrate plaintext legacy passwords.

### High — Student and teacher rosters are subscribed to globally in the client

File: `src/services/db.ts`

- `subscribeToStudents` subscribes to the full `students` collection and caches the roster in localStorage.
- `subscribeToTeachers` subscribes to the full `teachers` collection and caches it locally.
- If a cloud collection is empty, the client attempts to seed initial records.

**Impact:** the app architecture assumes broad roster access and can cache sensitive profile fields on a device. Tightening rules without first redesigning the read model may break the app; leaving permissive rules is not a safe alternative.

**Safe next step:** identify the minimum fields and roles needed by each screen. Split public booking availability from private learner records; return only role-appropriate data. Remove client-side seeding of real profiles as part of a separately tested migration, not as an unreviewed production change.

### High — Calendar/slot operations are broad and client-trusted

Files: `src/App.tsx`, `src/services/db.ts`, `firestore.rules`

- The client saves batches of slots and can change booking status, student identifiers, names, levels, and meeting links.
- The checked-in slot rule allows writes regardless of authentication.

**Impact:** a caller may be able to alter bookings or associated metadata if the checked-in policy matches deployed rules.

**Safe next step:** define which actions are public (e.g. reading available times), student-owned (e.g. their own booking), and staff-only (e.g. freeing or editing another person's slot). Enforce these rules server-side and validate transitions, not just document shape.

### Medium — Logout does not clear every role-related session field in one shared path

File: `src/App.tsx`

The student logout handler clears student and teacher auth flags, but the visible code path does not remove `cokito_staff_role` there. The separate teacher logout callback does remove it. This inconsistency should be covered by tests and resolved only alongside a single explicit session-state model.

### High — Profile email matching is not a sufficient profile link

File: `src/App.tsx`

Google sign-in switches to a student profile when the email matches. A verified Firebase user is useful evidence for an account, but a profile-to-account association should be explicit and stable (UID-based), especially for academic history and event attribution.

## Recommended staged remediation

1. **Containment and inventory (current):** document data fields, readers/writers, routes, and roles. Keep academic event logging disabled. Do not touch deployed rules.
2. **Test harness:** add Firestore Rules Unit Testing with the Firebase Emulator and synthetic fixtures. Include unauthenticated, student A, student B, teacher, and principal cases. Confirm tests target an isolated emulator/project.
3. **Identity model:** design UID-to-student mapping and trusted staff roles. Specify migration, account recovery, duplicate handling, and rollback before implementation.
4. **Data access redesign:** separate public schedule availability from private student profiles and teacher rosters; minimize local caching.
5. **Rules implementation in isolation:** least privilege by role and ownership, field validation, and immutable actor/timestamp fields where appropriate.
6. **UI integration:** only after the isolated policy passes, update reads/writes to fit the authorized model and add regression tests for registration, booking, logout, student learning, and staff workflows.
7. **Controlled review:** review test output and migration steps with the owner. Production changes require separate explicit approval.

## Acceptance criteria before enabling central academic events

- Every student profile involved in an event is linked to a verified Firebase UID.
- A student cannot read or write another student's private record or submit events under another student's identity.
- Teacher access is granted by trusted server-side authorization and scoped to permitted students/classes.
- Event schema, actor, timestamp, and allowed event types are validated by rules or trusted backend.
- Emulator tests pass for both allowed and denied access.
- The effective Firebase project/database is verified and test accounts contain synthetic data only.
- The event feature flag remains off until all criteria and a rollback plan are approved.

## Not performed

- No live Firebase rules were read or changed.
- No production data was queried, copied, modified, or deleted.
- No credential, password, OAuth, or external service configuration was changed.
- No deployment, merge, or production migration was performed.
