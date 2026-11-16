# Blue Logistics website — 90-day implementation roadmap
**Starting point:** GitHub public-site main commit `85dba06...`, Vercel site `blue-logistics-llc`, draft upgrade PR #26. Avoid making changes to the independent Sales OS without a separate reviewed plan.

## Days 1–14: safety and first revenue wins
- Complete the draft PR static checks, preview build and existing visual QA; fix any regressions.
- Establish mobile screenshots for homepage, service, resource, carrier, contact, and portal public shell, at 320 / 375 / 430 / 768 / 1024 / 1440 pixels.
- Verify new service pages and correct disclaimers with operations; ensure the quote form's exact backend contract remains intact.
- Check public-page metadata, canonical host, valid sitemap and 404 behavior.
- Confirm all public contact channels and broker authority details before merging; note `about.html` structured data contains a different phone number than the homepage.
- Owner explicitly approves each release; never auto-publish.

## Days 15–45: conversions and trust
- Review homepage hero and quote funnel with an approved baseline screenshot before a major redesign.
- Improve LTL/FTL/drayage shipping information; link relevant services with a single prominent quote action.
- Make forms keyboard accessible; add helpful field-specific validation and clear retry/fallback states.
- Confirm carrier onboarding and document rules in staging (MC/DOT, equipment, insurance, private files, authorization).
- Do not add customer logos, testimonials, testimonials based on fiction, or unsupported guaranteed timing.

## Days 46–90: measured quality and marketing
- Run full accessibility, multi-browser and mobile QA, fix measured Core Web Vitals bottlenecks.
- Consolidate layered CSS only with visual regression snapshots.
- Prepare Search Console verification and publish genuinely helpful freight guides.
- After privacy review/consent, add aggregate analytics and event tracking without PII fields.
- Evaluate A/B test hypothesis for one CTA; no live experiment until metric and owner approval.
- Set an approved uptime and non-invasive form-health monitoring cadence (no synthetic production freight requests).

## Highest-risk dependencies
1. Protect Supabase RLS and edge functions: no authenticated data read based solely on frontend filters, and no public document buckets.
2. Avoid triggering production quote or callback submissions during QA.
3. Confirm client-side persisted lane templates contain no name, email, phone, or freeform shipment notes; old values should be scrubbed.
4. Keep Vercel SSO-protected preview and GitHub branch isolation; no DNS or production writes.
5. No image replacement without provenance/licensing and side-by-side acceptance.
