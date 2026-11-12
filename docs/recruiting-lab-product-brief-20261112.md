# Recruit Studio — standalone recruiting ATS/CRM concept (Nov 12, 2026)

Status: **original code, static demo, synthetic data, not production, not a real agency or payment service**.
Website preview route after an approved deployment: /recruiting-lab.html. It is intentionally **not linked from the freight homepage** and carries noindex,nofollow.

## Why this project exists

Build a separate, non-logistics subscription software business serving independent recruiting agencies and boutique staffing teams. The recruiting demo is independent of Blue Logistics Sales OS. It does **not** use, retrieve, or migrate the freight CRM, customer data, Gmail messages, carrier rates, or contact lists. It does not present Top Echelon as our source-code supplier.

## Competitive feature benchmark — publicly advertised functionality only

TE Recruit publicly describes an ATS + CRM with candidate/resume records, configurable pipelines, jobs and clients, communication history, business development, calendar/email integration, searches, automation, reporting and user permissions. The pricing page currently lists Standard at $79/seat/month annual equivalent or $95 monthly, and Professional $95/seat/month annual equivalent or $115 monthly, subject to vendor updates.
- https://topechelon.com/product/te-recruit/
- https://topechelon.com/product/te-recruit/applicant-tracking-system/
- https://topechelon.com/pricing/

Nothing in this prototype copies Top Echelon code, imagery, trademark, datasets, UI text or protected design assets. It uses original markup, CSS and JavaScript to implement general ATS workflows.

## Reddit customer-discovery signals — anecdotal, not market proof

1. Agency owners want a linked ATS/CRM rather than manually maintaining separate client/deal and requisition revenue workflows: https://www.reddit.com/r/recruiting/comments/1g3o6b7/
2. Users cite clunky pipelines, scattered communications/notes, and missing automation: https://www.reddit.com/r/RecruitingAgency/comments/1rovlk1/agency_recruiterswhat_part_of_the_recruiting/
3. Users complain about slow systems, poor integrations, high switching costs and resume parsing: https://www.reddit.com/r/RecruitmentAgencies/comments/1foqtfr/if_youre_thinking_about_starting_an_agency_do_not/
4. Agency users want candidate-client records, real exports and practical integrations to drive adoption: https://www.reddit.com/r/RecruitingAgency/comments/1r9xdn6/agency_recruiters_are_you_actually_happy_with/
5. Recruiting agencies seek revenue-first, business-development CRM workflows: https://www.reddit.com/r/RecruitmentAgencies/comments/1ovwtn7/crmats_recommendations/

Reddit posts include individual anecdotes, some potential vendor self-promotion, and conflicting preferences. Validate via real interviews; do not treat them as aggregate survey results.

## Working demo functionality (in browser only)

- Three completely fictional recruiting desks (boutique, healthcare, technology).
- Example client companies with linked job orders; salary, fee percentage and candidate counts.
- Candidate pipeline: Sourced → Screened → Submitted → Interview → Offer → Placed.
- Stage changes update the demo funnel, example activity feed and simulated fee metrics.
- Add fictional candidate and job entries with validation; reset to fresh sample state.
- Search/filter candidates by name, job and location; export fictional demo CSV.
- Revenue view models potential job-placement fees and fictitious placed fees only.
- Pricing concepts $39 solo / $89 team are **hypothetical proposals**, not available to purchase and not verified demand.

## Strict safety boundaries

- **No backend**, Supabase, API, auth, database, mail send, calendar, payment processing or analytics. All demo records are in-memory and disappear on reload.
- Do not enter real applicant names, personal contact details, resumes, protected traits, background check information, or confidential client information.
- No real data is represented as evidence of placements, revenue, candidates, job orders or customer demand.
- No transport data flows into this product. Never import the freight prospect database.
- No cookie/storage synchronization. The CSV intentionally includes only the synthetic/current in-tab demo entries. User-entered values are escaped before display and guarded against spreadsheet-formula interpretation in CSV.
- No public sales, hiring claims, live recruiter signup or billing is present.

## Product roadmap / mandatory release gates

1. Validate problem and willingness to pay through 10–15 interviews with independent recruiting/staffing agencies. Record which pain each pilot can verify and their current stack.
2. Choose whether this sells **software to recruiting agencies** or whether a separate entity also performs **recruiting/placement services**. Those are separate offerings, legal/contractual structures and revenue types.
3. Separate legal/branding/domain from freight operations. Review IP ownership, licenses, employer restrictions, terms, privacy, tax and recruiting laws for chosen market.
4. Build real authenticated multitenancy with agency-scoped access policies, least privilege, encrypted applicant records, consent/retention/deletion/portability, audit logs, secure document storage and scoped email/calendar integrations. Never reuse Sales OS production secrets or service-role access.
5. Add legitimate resume parsing and fair, auditable candidate search/matching with appropriate anti-discrimination reviews; protect sensitive applicant attributes and provide human decision authority.
6. Verify backups, isolated restore, penetration/role tests, signed customer contracts, payments/billing, observability and staffed support before accepting production data or money.
7. Consider recruiter-to-recruiter split-placement networking only after the basic ATS/CRM is stable and after contract and licensing review.

## Demo tests

Run node --test tests/recruiting-lab.test.cjs from repository root. This validates file presence, executable script syntax, route asset references, demo safety invariants and expected workflow controls. Browser-level review is still required for keyboard navigation, mobile layout, stage transitions, job creation, reset and CSV download.

## Deployment decision

This commit is **development branch / draft PR only**. Do not merge, promote production, publish on the freight homepage, create paid infrastructure, collect applicants or deploy external tracking without express owner approval.
