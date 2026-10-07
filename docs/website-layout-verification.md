# Public website layout verification — October 7, 2026

Site: https://www.shipbluelogistics.com/  
Repository: `hmblue-crypto/Blue-Logistics-LLC`  
Vercel project: `blue-logistics-llc` (`prj_NkW75QzlZ4QFsq4AgU1TEgW95mo6`)  
Framework: static HTML, CSS and JavaScript. No application compilation/build command exists; deployment must finish READY before promotion.

## Result

The returning-shipment card previously became a third sibling in a two-column grid, pushing the quote form into another row. A dedicated hero-side wrapper keeps the form and saved shipment together. The homepage stylesheet now has a single scoped layout system: 1,224px centered containers, compact white navigation, 48–50px desktop headline, 34px phone headline, coordinated quote/call actions, consistent cards and responsive spacing.

The original headline, paragraph, non-hero sections, navigation destinations, SEO metadata, quote field names and requirements remain intact. Primary/secondary CTA order changed to Quote then Call. Recognized saved routes retain Use Last Shipment. Complete freeform routes receive Review Saved Details without a route summary. Incomplete/malformed records do not create a hero card; the regular quote form remains available. Stored shipment data is not deleted or rewritten for presentation.

The public quote endpoint, multipart payload, attribution, confirmation logic, callback endpoint, carrier intake, portal authentication, CRM database and email routing were not replaced. No schemas, credentials or permissions were changed.

## Functional defects corrected

- Fixed a missing closing brace in conversion-engine.js that prevented its entire analytics/readiness/resume interface from running.
- Hidden wizard controls now obey their hidden state, instead of being made visible by button display styles.
- Attachment validation reads the dynamically inserted upload field when submitting, rather than caching a null field before enhancements load.
- The repeat-quote button remains available after a successful request, including after the wizard resets.
- Removed a request for the nonexistent founder-portraits-v2.js; existing portrait image sources are preserved.
- Gracefully handle unavailable browser storage for saved-shipment display.
- Mobile menu supports Escape; form anchors reserve sticky-header space; reduced-motion native scrolling is respected.

## Validation

Playwright Chromium checks passed at 390, 430, 768, 1280, 1440 and 1920px:

- Zero horizontal page overflow in every quote step and error state.
- All three wizard steps, required-field validation and invalid-email rejection.
- Correct multipart contract, optional freight/contact details, consent, attribution and attachment fields.
- More than three attachments rejected before a request; valid attachment accepted in the fixture.
- Success confirmation, wizard reset and repeat-quote prefill.
- Failed request keeps input and restores a usable retry button.
- Returning shipment prefill clears stale pickup dates.
- Empty, malformed, incomplete, freeform city-only and denied-storage states.
- Mobile menu open/close, Escape, quote anchor clearance and callback open/close.
- Input fonts at least 16px, relevant controls at least 44px by layout rules.
- Analytics click hooks and service-selector shortcut.
- No homepage JavaScript errors or missing local assets.
- Thirteen distinct internal navigation destinations returned HTTP 200 locally.

Static comparison also passed: identical SEO metadata, navigation destinations, quote field names/types/requirements, headline text, non-hero section content and backend endpoint. Edited JavaScript passes node --check. CSS delimiter balance and rendered layouts were verified.

Quote POST requests were intercepted and fulfilled with isolated success/error fixtures. They did not contact production Supabase, create CRM rows or send customer emails. Live production inbox delivery, authenticated portal data retrieval and external social/review destinations were not exercised by this presentation change.

## Reproduce

Install Playwright and its Chromium browser in a development environment, then run:

```sh
node tests/public-homepage.cjs
```

An optional PLAYWRIGHT_BROWSER_EXECUTABLE selects a managed Chromium binary. The test starts its own loopback static server and intercepts every external request. Screenshots and results are written to .qa-results. These fixtures must remain isolated; do not turn them into live quote submissions.

## Visual evidence

Desktop before: ![Desktop before](layout-before-1440.png)

Desktop after: ![Desktop after](layout-after-1440.png)

Phone before: ![Phone before](layout-before-390.png)

Phone after: ![Phone after](layout-after-390.png)
