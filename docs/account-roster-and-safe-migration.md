# Güakytopia — Account Roster and Safe Migration Plan

## Requested profile roster

| Display profile | Human / purpose | Intended role |
|---|---|---|
| **Teacher Anita** | Ana T Sandoval | Teacher |
| **Principal Waky** | Ana Teresa Sandoval | Principal / Director |
| **Student Tester** | Synthetic test learner | Student, development only |
| **Teacher Tester** | Synthetic test staff profile | Teacher, development only |
| **Ragni Ali (Comunidad)** | Friend who enrolled | Existing real student profile; locate and preserve |
| **Génesis** | Friend who enrolled | Existing real student profile; locate and preserve |

## Identity and access decisions

Teacher Anita and Principal Waky refer to the same human. Prefer one verified authentication identity with explicitly granted teacher and principal permissions, rather than separate passwords/accounts unless a concrete operational need requires separation. Principal permissions must be enforced by trusted server-side authorization, not by a browser-selected role.

Student Tester and Teacher Tester must be isolated development identities. Teacher Tester must not inherit principal permissions or access real learner histories.

## Existing-code observations

- A seeded student profile for Génesis exists in `src/data/curriculumData.ts`. Confirm it against the intended database and preserve the existing student ID and progress.
- The user identified Ragni as **“Ragni Ali (Comunidad)”**. This exact label is the search clue for finding the existing record; an earlier code search for “Ragni” alone did not find a match, which does not establish absence from Firestore, browser storage, or the other student platform.
- Ana also has a seeded student-mode profile. Do not delete, merge, or repurpose it automatically; first decide whether it is used for her own learning or testing.
- Current student credentials are checked against client-side profile data, and a missing saved password can permit login with an empty password. Existing legacy credential material must not be reused as the foundation for secure accounts.
- The staff gate contains client-side credential checks. Client-side role state is not a trusted authorization boundary.

## Safe migration sequence

1. Locate **Ragni Ali (Comunidad)** in the intended database/app and confirm it is the correct person with Teacher Anita. Do not create a duplicate.
2. Confirm Génesis's existing profile and progress.
3. Verify Ana's authentication identity; grant staff roles through a trusted authorization mechanism.
4. Create Student Tester and Teacher Tester only in the isolated development database.
5. Link each real learner profile to a verified Firebase UID, preserving existing internal IDs and academic progress.
6. Add trusted username-to-account resolution before offering username + password. Never store plaintext passwords in profile documents or browser storage.
7. Keep Cokitö academic event logging disabled until UID ownership, database targeting, and Firestore rules are implemented and tested.

## Guardrails

- No bulk linking by display name or unverified email.
- No destructive profile merge, password migration, or student record recreation.
- No production/live-platform changes, rule deployments, or event logging activation as part of this plan.
- Validate with isolated development accounts and rules tests before considering rollout.

## Status

Documentation/plan only. No accounts were created or changed, no student data or passwords were modified, and no rules or deployments were changed. Build and automated tests have not yet been run.
