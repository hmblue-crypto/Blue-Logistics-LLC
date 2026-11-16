# Blue Logistics public website — release safety
**Baseline:** GitHub `hmblue-crypto/Blue-Logistics-LLC` main at `85dba06ff82a5dd781be8937e90dd15f5d58a1df` (2026-11-16 inspection). Separate Sales OS is out of scope.

## Release gate
1. Changes must be on an isolated PR branch, never pushed to `main` automatically.
2. Run `node tests/site-audit.cjs` and the existing Playwright-based UI tests in an authorized runner with browser dependencies.
3. Review code diffs and license status of added assets, then verify keyboard navigation, 320/375/430/768/1024/1440-pixel layouts, and form behavior on a **mocked** intake endpoint. Never submit production freight fixtures.
4. Verify quote contracts (`public-quote-intake`), CRM routing, protected portal, role checks and storage policies in authorized staging; do not infer backend protections from frontend markup.
5. Check build/preview deployment and compare to production screenshots. Preview may be Vercel authentication-protected. Report unavailable evidence honestly.
6. Confirm verified business details before publishing claims, phone number changes, testimonials, reviews, service hours, pricing, certifications, or client logos.
7. Confirm privacy notice, analytics/consent, data retention and SMS requirements with the owner/counsel before activating new collection.
8. Approve the exact PR commit, then merge/deploy separately with owner authorization. Do not modify DNS or Supabase production schema from a public-site PR.
9. After release verify all URLs, 404 status, quote receipt with an authorized test procedure, and rollback command.

## Rollback
If the PR has not been merged, close it or delete the feature branch. For an approved release with regression, restore the immediately preceding known-good Vercel production deployment or revert the merge commit, then verify public pages and quote intake. Do not change domain assignment or roll back database state without separate approval.

## Data flows and threat boundaries
- Public HTML/JS captures freight lane and visitor contact data and submits HTTPS multipart payloads to a Supabase Edge Function, `public-quote-intake`.
- The Edge Function owns server-side validation, rate limits, database insert, optional private document storage, and notifications. Production behavior must be verified with role-limited test accounts and authorized staging.
- The customer portal relies on Supabase Auth, bearer tokens, and server-side authorization; frontend client filtering alone is never a security boundary.
- Owner OS pages appear in the public repo but have separate authentication; ensure backend checks and RLS independently. `robots.txt` does not provide access control.
- Review client-side localStorage of repeat-quote details and remove unnecessary PII.
- Do not log access tokens, payment information, email lists, BOLs, customer documents, or carrier banking details.

## Verified infrastructure on 2026-11-16
- Vercel project `blue-logistics-llc` is linked to the public site and listed production deployment `dpl_RcVQucCWQkGyx63RqA2fwrkQPJDL` as READY at main commit `85dba06...`.
- Both `shipbluelogistics.com` and `www.shipbluelogistics.com` are verified project domains. Apex redirects to www with 308.
- Direct HTTP browsing of those domains was not independently successful from this environment; this is not proof of downtime.
- Third-party preview access, live screenshots, form deliverability and Supabase RLS **remain unverified**, not passed.
