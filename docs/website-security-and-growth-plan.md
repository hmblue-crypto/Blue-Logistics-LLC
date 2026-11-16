# Blue Logistics website — growth, measurement and security specifications

## Portal threat boundary (#061–070)
The public repo contains `portal.html`, `portal.js`, several `portal-myblue*.js` scripts and `owner-os6/7` pages. Scripts use a **publishable** Supabase client key and bearer tokens from authenticated sessions, which is a normal public-client pattern; the actual database grants and Edge Function authorization cannot be proven from public JavaScript. Specifically verify IDOR/BOLA protections by using two synthetic users from different customer accounts. Test access to every shipment, BOL, POD, invoice, signed URL, company selector and mutation; reject cross-account reads on the server. A frontend-only company filter must not be trusted. Keep role ownership in protected server metadata and enforce RLS.

## Carrier documentation (#067–068)
Collect only required MC/DOT, legal business name, lane/equipment and authorized compliance documents through an approved private backend. W-9, certificates of insurance and payment details must not go to public buckets or website analytics. Banking details must never be accepted through a generic public contact form. Limit file types/sizes server-side, scan or quarantine attachments and define retention, authorized reviewers and deletion requests.

## Search Console (#080)
Verify ownership of `https://www.shipbluelogistics.com/` in the owner's account, compare sitemap index count to live 200 responses, inspect canonical host/redirects, and fix coverage anomalies. Sitemap submission and account changes require owner authorization. `robots.txt` does not block access to sensitive data.

## Funnel analytics (#091–093)
No analytics vendor or pixel has been installed. Proposed anonymous event names: `quote_form_view`, `quote_form_start`, `quote_step_2`, `quote_step_3`, `quote_validation_fail`, `quote_request_confirmed`. Do not send email, phone, customer name, origin/destination, commodity, rates, attachments, full URLs with query strings, or other shipment details. Confirm lawful basis/consent and retention policy before enabling. Reporting spec: sessions, service-page visits, form starts, confirmed requests, conversion rate and channel source, with counts derived only from verified permissions.

## Single-CTA experiment (#094)
Hypothesis: the current homepage quote headline may perform differently if CTA says 'Request a Freight Quote' instead of a longer variant. Metrics: confirmed requests per eligible session, guardrails on broken submissions and mobile abandonment. Only activate with owner-approved instrumentation and an experiment stop rule. No live A/B test in this branch.

## Lead routing (#095)
Trace from frontend submit to `public-quote-intake`, saved public quote request, owner notification and Sales OS assignment. Verify who acknowledges, response-time expectations and duplicate handling in authorized test environment. Avoid claiming automatic follow-ups or guaranteed response hours unless configured and tested.

## Uptime and non-invasive health checks (#096)
Proposed checks: public homepage and contact page HTTP 200, canonical redirect, TLS validity, sitemap 200, new service pages 200 and expected 404 status. Monitor latency and availability at a moderate cadence through an approved provider. Check form health with a dedicated non-writing canary endpoint or authorized staging-only fixture, never post fake freight into production. Owner and operations should agree alerts and escalation before scheduling.

## Claims and content verification (#009, #075)
The current public code contains different phone numbers in `index.html` and `about.html` structured data. Confirm the correct published business phone before harmonizing. Also verify MC authority, founder biographies, service scope, insurance language, response hours and customer permission before adding case studies or partner logos. Do not claim asset ownership.

## Browser and release QA (#085–098)
Desktop/mobile screenshots and screen-reader checks remain outstanding. Test homepage quote validation, optional file upload, successful mocked response, failed mocked response, repeat quote, contact form, portal sign-in shell, carrier onboarding and responsive navigation. Vercel preview READY and static CI success are not substitutions for this check.
